import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TutorChat } from './TutorChat';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

interface TutorFloatingButtonProps {
  currentTopic?: string;
}

export function TutorFloatingButton({ currentTopic }: TutorFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { gameMode } = useGame();
  const isKidMode = gameMode === 'kid';

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            'h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
            'group overflow-hidden',
            isKidMode
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400'
              : 'bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90'
          )}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-white/30" style={{ animationDuration: '2s' }} />
        </Button>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
        >
          <div className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg',
            isKidMode
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-muted text-foreground'
          )}>
            {isKidMode ? 'Need help? 🤖' : 'AI Tutor'}
          </div>
        </motion.div>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-6 right-6 w-[420px] h-[600px] max-h-[80vh] bg-background rounded-2xl shadow-2xl overflow-hidden z-50 border border-border"
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>

              <TutorChat currentTopic={currentTopic} className="h-full" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
