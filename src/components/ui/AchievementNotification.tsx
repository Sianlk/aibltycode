import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Medal, Target, Flame, Award, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'zap' | 'crown' | 'medal' | 'target' | 'flame' | 'award';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
  duration?: number;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  target: Target,
  flame: Flame,
  award: Award,
};

const rarityStyles = {
  common: {
    bg: 'from-slate-500 to-slate-600',
    glow: 'hsla(220, 10%, 50%, 0.4)',
    text: 'text-slate-300',
    border: 'border-slate-400/30',
  },
  rare: {
    bg: 'from-blue-500 to-indigo-600',
    glow: 'hsla(220, 90%, 55%, 0.5)',
    text: 'text-blue-300',
    border: 'border-blue-400/40',
  },
  epic: {
    bg: 'from-purple-500 to-pink-600',
    glow: 'hsla(280, 80%, 55%, 0.5)',
    text: 'text-purple-300',
    border: 'border-purple-400/40',
  },
  legendary: {
    bg: 'from-yellow-400 via-orange-500 to-red-500',
    glow: 'hsla(40, 100%, 55%, 0.6)',
    text: 'text-yellow-300',
    border: 'border-yellow-400/50',
  },
};

export function AchievementNotification({ achievement, onClose, duration = 5000 }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Generate particles for legendary achievements
      if (achievement.rarity === 'legendary' || achievement.rarity === 'epic') {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 0.5,
        }));
        setParticles(newParticles);
      }

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievement, duration, onClose]);

  if (!achievement) return null;

  const Icon = iconMap[achievement.icon];
  const style = rarityStyles[achievement.rarity];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-[100] max-w-sm"
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 p-4",
              style.border,
              achievement.rarity === 'legendary' && "achievement-glow"
            )}
            style={{
              background: `linear-gradient(145deg, hsla(222, 47%, 12%, 0.95), hsla(222, 47%, 8%, 0.98))`,
              boxShadow: `0 0 40px ${style.glow}, 0 20px 40px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Particle effects for epic/legendary */}
            {particles.length > 0 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-warning"
                    initial={{ x: `${p.x}%`, y: '100%', opacity: 1 }}
                    animate={{ y: '-100%', opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: p.delay,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{ left: `${p.x}%` }}
                  />
                ))}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2, damping: 10 }}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br",
                  style.bg
                )}
                style={{
                  boxShadow: `0 0 20px ${style.glow}`,
                }}
              >
                <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
                >
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-bold uppercase tracking-wider", style.text)}>
                      {achievement.rarity}
                    </span>
                    <span className="text-xs text-muted-foreground">Achievement</span>
                  </div>
                  <h4 className="font-bold text-lg text-foreground leading-tight">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {achievement.description}
                  </p>
                </motion.div>

                {/* XP Reward */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 flex items-center gap-2"
                >
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-warning/20">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="text-sm font-bold text-warning">+{achievement.xpReward} XP</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Achievement Provider for global state
export const useAchievements = () => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);

  const showAchievement = useCallback((achievement: Achievement) => {
    if (currentAchievement) {
      setQueue(prev => [...prev, achievement]);
    } else {
      setCurrentAchievement(achievement);
    }
  }, [currentAchievement]);

  const handleClose = useCallback(() => {
    setCurrentAchievement(null);
    // Process queue
    setTimeout(() => {
      setQueue(prev => {
        if (prev.length > 0) {
          const [next, ...rest] = prev;
          setCurrentAchievement(next);
          return rest;
        }
        return prev;
      });
    }, 300);
  }, []);

  return {
    currentAchievement,
    showAchievement,
    handleClose,
    AchievementNotificationComponent: () => (
      <AchievementNotification
        achievement={currentAchievement}
        onClose={handleClose}
      />
    ),
  };
};

export default AchievementNotification;
