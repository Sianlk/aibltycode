import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Bot, User, Trash2, Copy, Check,
  Lightbulb, HelpCircle, Code, MessageSquarePlus,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTutorChat, TutorMessage, Conversation } from '@/hooks/useTutorChat';
import { useGame } from '@/contexts/GameContext';

interface TutorChatProps {
  currentTopic?: string;
  className?: string;
}

/* ───── Quick action chips ───── */
const QuickActions = ({ onAction, isKidMode }: { onAction: (p: string) => void; isKidMode: boolean }) => {
  const actions = [
    { icon: HelpCircle, label: 'Explain a concept', prompt: 'Can you explain this concept simply?' },
    { icon: Code, label: 'Show me code', prompt: 'Can you show me a code example?' },
    { icon: Lightbulb, label: 'Quiz me', prompt: 'Quiz me on this topic with a question!' },
  ];
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {actions.map((a) => (
        <Button
          key={a.label}
          variant="outline"
          size="sm"
          className={cn(
            'gap-2 rounded-full',
            isKidMode
              ? 'border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-200'
              : 'border-primary/20 hover:bg-primary/10'
          )}
          onClick={() => onAction(a.prompt)}
        >
          <a.icon className="h-4 w-4" />
          {a.label}
        </Button>
      ))}
    </div>
  );
};

/* ───── Markdown-lite renderer ───── */
function renderMarkdown(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const inner = part.slice(3, -3);
      const nl = inner.indexOf('\n');
      const code = nl > -1 ? inner.slice(nl + 1) : inner;
      return (
        <pre key={i} className="bg-background/80 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono border border-border">
          <code>{code}</code>
        </pre>
      );
    }
    // bold
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {boldParts.map((bp, j) =>
          bp.startsWith('**') && bp.endsWith('**')
            ? <strong key={j} className="font-semibold">{bp.slice(2, -2)}</strong>
            : <span key={j}>{bp}</span>
        )}
      </span>
    );
  });
}

/* ───── Single message bubble ───── */
const MessageBubble = ({ message, isKidMode }: { message: TutorMessage; isKidMode: boolean }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-3 group', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1',
          isUser
            ? 'bg-primary/90'
            : isKidMode
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-accent to-accent/70'
        )}
      >
        {isUser ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'relative max-w-[75%] rounded-2xl px-4 py-2.5',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-muted/70 rounded-tl-md'
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-9 top-0.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyContent}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

/* ───── Conversation sidebar ───── */
const ConversationSidebar = ({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  isKidMode,
}: {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isKidMode: boolean;
}) => (
  <div className="flex flex-col h-full">
    <div className="p-3 border-b border-border/40">
      <Button
        onClick={onNew}
        className={cn(
          'w-full gap-2 rounded-xl',
          isKidMode
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
            : 'bg-primary hover:bg-primary/90'
        )}
        size="sm"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New Chat
      </Button>
    </div>
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">No conversations yet</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 group/item transition-colors',
              c.id === currentId
                ? isKidMode ? 'bg-yellow-500/15 text-yellow-200' : 'bg-primary/10 text-primary'
                : 'hover:bg-muted/60 text-muted-foreground'
            )}
          >
            <MessageSquarePlus className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate flex-1">{c.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              className="opacity-0 group-hover/item:opacity-100 text-destructive/70 hover:text-destructive transition-opacity"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </button>
        ))}
      </div>
    </ScrollArea>
  </div>
);

/* ───── Typing indicator ───── */
const TypingIndicator = ({ isKidMode }: { isKidMode: boolean }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
    <div className={cn(
      'w-8 h-8 rounded-lg flex items-center justify-center',
      isKidMode ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-accent to-accent/70'
    )}>
      <Bot className="h-4 w-4 text-white animate-pulse" />
    </div>
    <div className="bg-muted/70 rounded-2xl rounded-tl-md px-4 py-3">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  </motion.div>
);

/* ───── Main TutorChat ───── */
export function TutorChat({ currentTopic, className }: TutorChatProps) {
  const { gameMode } = useGame();
  const isKidMode = gameMode === 'kid';
  const {
    messages, isLoading, conversations, currentConversationId,
    sendMessage, loadConversations, loadMessages,
    deleteConversation, clearChat,
  } = useTutorChat();

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim(), currentTopic);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSelectConversation = (id: string) => { loadMessages(id); };
  const handleNewChat = () => { clearChat(); };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className={cn('flex h-full overflow-hidden', className)}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden flex-shrink-0 hidden md:block"
          >
            <ConversationSidebar
              conversations={conversations}
              currentId={currentConversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewChat}
              onDelete={deleteConversation}
              isKidMode={isKidMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center',
              isKidMode
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                : 'bg-gradient-to-br from-accent to-accent/70'
            )}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{isKidMode ? 'CodeBuddy 🤖' : 'AI Tutor'}</h3>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {isKidMode ? 'Your friendly coding helper!' : 'Expert programming assistance'}
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive text-xs" onClick={clearChat}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className={cn(
                  'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                  isKidMode
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-accent to-accent/70'
                )}>
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {isKidMode ? 'Hey there, coder! 👋' : 'How can I help you today?'}
                </h3>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  {isKidMode
                    ? "I'm here to help you learn coding! Ask me anything about programming!"
                    : 'Ask about Java, algorithms, data structures, systems design, or any CS topic.'}
                </p>
                <QuickActions onAction={(p) => sendMessage(p, currentTopic)} isKidMode={isKidMode} />
              </motion.div>
            ) : (
              messages.map((m) => <MessageBubble key={m.id} message={m} isKidMode={isKidMode} />)
            )}

            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <TypingIndicator isKidMode={isKidMode} />
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm flex-shrink-0 px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isKidMode ? 'Type your question here... 🚀' : 'Ask me anything...'}
              className="min-h-[42px] max-h-32 resize-none bg-muted/50 border-border/50 rounded-xl text-sm"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className={cn(
                'h-[42px] w-[42px] rounded-xl flex-shrink-0',
                isKidMode
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
                  : 'bg-primary hover:bg-primary/90'
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
