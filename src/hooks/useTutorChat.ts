import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useTutorChat() {
  const { user } = useAuth();
  const { gameMode } = useGame();
  const isKidMode = gameMode === 'kid';
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor-chat`;

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('tutor_conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data.map(c => ({
        id: c.id,
        title: c.title || 'New Chat',
        topic: c.topic || undefined,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      })));
    }
  }, [user]);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('tutor_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: new Date(m.created_at),
      })));
      setCurrentConversationId(conversationId);
    }
  }, []);

  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('tutor_conversations')
      .insert({ user_id: user.id, title: title || 'New Chat' })
      .select()
      .single();

    if (!error && data) {
      const newConv: Conversation = {
        id: data.id,
        title: data.title || 'New Chat',
        topic: data.topic || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(data.id);
      setMessages([]);
      return data.id;
    }
    return null;
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    const { error } = await supabase
      .from('tutor_conversations')
      .delete()
      .eq('id', conversationId);

    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  }, [currentConversationId]);

  const sendMessage = useCallback(async (content: string, topic?: string) => {
    if (!user || !content.trim()) return;

    let convId = currentConversationId;
    if (!convId) {
      convId = await createConversation(content.slice(0, 50));
      if (!convId) return;
    }

    // Add user message optimistically
    const userMsg: TutorMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Save user message to DB
    await supabase
      .from('tutor_messages')
      .insert({ conversation_id: convId, role: 'user', content });

    // Prepare messages for API
    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantContent = '';
    const assistantMsgId = `assistant-${Date.now()}`;

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages, 
          isKidMode,
          currentTopic: topic || ''
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => prev.map(m => 
                m.id === assistantMsgId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            // Partial JSON, continue
          }
        }
      }

      // Save assistant message to DB
      if (assistantContent) {
        await supabase
          .from('tutor_messages')
          .insert({ conversation_id: convId, role: 'assistant', content: assistantContent });

        // Update conversation title if first message
        if (messages.length === 0) {
          await supabase
            .from('tutor_conversations')
            .update({ title: content.slice(0, 50), updated_at: new Date().toISOString() })
            .eq('id', convId);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
    } finally {
      setIsLoading(false);
    }
  }, [user, currentConversationId, messages, isKidMode, createConversation, CHAT_URL]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  return {
    messages,
    isLoading,
    conversations,
    currentConversationId,
    sendMessage,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation,
    clearChat,
    setCurrentConversationId,
  };
}
