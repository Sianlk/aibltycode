import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Trash2, Copy, Check, Lightbulb, HelpCircle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTutorChat, TutorMessage } from '@/hooks/useTutorChat';
import { useGame } from '@/contexts/GameContext';

interface TutorChatProps {
  currentTopic?: string;
  className?: string;
}

const QuickActions = ({ onAction }: { onAction: (action: string) => void }) => {
  const actions = [
    { icon: HelpCircle, label: 'Explain', prompt: 'Can you explain this concept simply?' },
    { icon: Code, label: 'Example', prompt: 'Can you show me a code example?' },
    { icon: Lightbulb, label: 'Quiz me', prompt: 'Quiz me on this topic with a question!' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          className="gap-2 bg-background/50 hover:bg-primary/10 border-primary/20"
          onClick={() => onAction(action.prompt)}
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

const MessageBubble = ({ message, isKidMode }: { message: TutorMessage; isKidMode: boolean }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const firstNewline = codeContent.indexOf('\n');
        const code = firstNewline > -1 ? codeContent.slice(firstNewline + 1) : codeContent;
        
        return (
          <pre key={i} className="bg-background/80 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono border border-border">
            <code>{code}</code>
          </pre>
        );
      }
      
      // Bold text
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={j}>{bp.slice(2, -2)}</strong>;
            }
            return <span key={j}>{bp}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 group',
        isUser ? 'flex-row-reverse' : ''
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/70'
            : isKidMode
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-accent to-accent/70'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      
      <div
        className={cn(
          'relative max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted/80 backdrop-blur-sm rounded-tl-sm'
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>
        
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-10 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyContent}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export function TutorChat({ currentTopic, className }: TutorChatProps) {
  const { gameMode } = useGame();
  const isKidMode = gameMode === 'kid';
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  } = useTutorChat();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim(), currentTopic);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt, currentTopic);
  };

  return (
    <div className={cn('flex flex-col h-full bg-gradient-to-b from-background to-muted/30', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            isKidMode
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-accent to-accent/70'
          )}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">
              {isKidMode ? 'CodeBuddy 🤖' : 'AI Tutor'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isKidMode ? 'Your friendly coding helper!' : 'Expert programming assistance'}
            </p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-destructive"
            onClick={clearChat}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className={cn(
                  'w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                  isKidMode
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-accent to-accent/70'
                )}>
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isKidMode ? 'Hey there, coder! 👋' : 'How can I help you?'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  {isKidMode
                    ? "I'm here to help you learn coding! Ask me anything about programming!"
                    : 'Ask me about Java, algorithms, data structures, or any programming concept.'}
                </p>
                <QuickActions onAction={handleQuickAction} />
              </motion.div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isKidMode={isKidMode}
                />
              ))
            )}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                isKidMode
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-br from-accent to-accent/70'
              )}>
                <Bot className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="bg-muted/80 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isKidMode ? "Type your question here... 🚀" : "Ask me anything..."}
            className="min-h-[44px] max-h-32 resize-none bg-muted/50 border-border/50"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
