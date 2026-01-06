import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AchievementNotification } from '@/components/ui/AchievementNotification';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'zap' | 'crown' | 'medal' | 'target' | 'flame' | 'award';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
  unlockAchievement: (id: string) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Predefined achievements
const ACHIEVEMENTS: Record<string, Achievement> = {
  first_lesson: {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'star',
    rarity: 'common',
    xpReward: 50,
  },
  first_game: {
    id: 'first_game',
    title: 'Game On!',
    description: 'Play your first mini-game',
    icon: 'zap',
    rarity: 'common',
    xpReward: 50,
  },
  five_streak: {
    id: 'five_streak',
    title: 'On Fire',
    description: 'Achieve a 5-day learning streak',
    icon: 'flame',
    rarity: 'rare',
    xpReward: 150,
  },
  battle_winner: {
    id: 'battle_winner',
    title: 'Battle Champion',
    description: 'Win your first multiplayer battle',
    icon: 'trophy',
    rarity: 'rare',
    xpReward: 200,
  },
  perfect_score: {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Get 100% on any challenge',
    icon: 'target',
    rarity: 'epic',
    xpReward: 300,
  },
  module_complete: {
    id: 'module_complete',
    title: 'Module Master',
    description: 'Complete an entire learning module',
    icon: 'medal',
    rarity: 'epic',
    xpReward: 500,
  },
  tournament_winner: {
    id: 'tournament_winner',
    title: 'Tournament Champion',
    description: 'Win a tournament',
    icon: 'crown',
    rarity: 'legendary',
    xpReward: 1000,
  },
  all_games: {
    id: 'all_games',
    title: 'Game Master',
    description: 'Play every mini-game at least once',
    icon: 'award',
    rarity: 'legendary',
    xpReward: 750,
  },
};

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [unlockedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const showAchievement = useCallback((achievement: Achievement) => {
    if (currentAchievement) {
      setQueue(prev => [...prev, achievement]);
    } else {
      setCurrentAchievement(achievement);
    }
  }, [currentAchievement]);

  const unlockAchievement = useCallback((id: string) => {
    if (unlockedIds.has(id)) return;
    
    const achievement = ACHIEVEMENTS[id];
    if (achievement) {
      unlockedIds.add(id);
      localStorage.setItem('unlockedAchievements', JSON.stringify([...unlockedIds]));
      showAchievement(achievement);
    }
  }, [unlockedIds, showAchievement]);

  const handleClose = useCallback(() => {
    setCurrentAchievement(null);
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

  return (
    <AchievementContext.Provider value={{ showAchievement, unlockAchievement }}>
      {children}
      <AchievementNotification
        achievement={currentAchievement}
        onClose={handleClose}
      />
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
}
