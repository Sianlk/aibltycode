import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, TrendingUp, Flame, Award } from "lucide-react";

export type FeedbackType = 'success' | 'improvement' | 'levelUp' | 'streak' | 'achievement';

interface FeedbackToastProps {
  type: FeedbackType;
  message: string;
  subMessage?: string;
  visible: boolean;
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-gradient-to-r from-success/20 to-success/5',
    borderClass: 'border-success/30',
    iconClass: 'text-success',
    emoji: '✨'
  },
  improvement: {
    icon: AlertCircle,
    bgClass: 'bg-gradient-to-r from-warning/20 to-warning/5',
    borderClass: 'border-warning/30',
    iconClass: 'text-warning',
    emoji: '💪'
  },
  levelUp: {
    icon: TrendingUp,
    bgClass: 'bg-gradient-to-r from-accent/20 to-primary/10',
    borderClass: 'border-accent/30',
    iconClass: 'text-accent',
    emoji: '🎉'
  },
  streak: {
    icon: Flame,
    bgClass: 'bg-gradient-to-r from-secondary/20 to-warning/10',
    borderClass: 'border-secondary/30',
    iconClass: 'text-secondary',
    emoji: '🔥'
  },
  achievement: {
    icon: Award,
    bgClass: 'bg-gradient-to-r from-primary/20 to-accent/10',
    borderClass: 'border-primary/30',
    iconClass: 'text-primary',
    emoji: '🏆'
  }
};

export function FeedbackToast({ type, message, subMessage, visible, onClose }: FeedbackToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4
            ${config.bgClass} border ${config.borderClass} rounded-2xl p-4 shadow-lg
          `}
          onClick={onClose}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center ${config.iconClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{config.emoji}</span>
                <p className="font-bold">{message}</p>
              </div>
              {subMessage && (
                <p className="text-sm text-muted-foreground mt-1">{subMessage}</p>
              )}
            </div>
          </div>

          {/* Auto-dismiss progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4, ease: 'linear' }}
            onAnimationComplete={onClose}
            className={`h-1 ${config.iconClass.replace('text-', 'bg-')} rounded-full mt-3`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
