import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Flame, Gift, Trophy, Zap, Star, Target, 
  ChevronRight, CheckCircle, Lock, Sparkles, Timer
} from 'lucide-react';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'game' | 'lesson' | 'practice' | 'streak';
  requirement: number;
  current: number;
  xpReward: number;
  bonusReward?: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresIn: number; // hours
}

interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  badge?: string;
}

interface StreakReward {
  day: number;
  reward: string;
  xp: number;
  claimed: boolean;
}

const DailyChallenges: React.FC = () => {
  const { playSound, addXp, gameMode } = useGame();
  const { user } = useAuth();
  const isKidsMode = gameMode === 'kid';
  
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: 'dc1',
      title: 'Speed Demon',
      description: 'Complete 3 Speed Challenge rounds',
      type: 'game',
      requirement: 3,
      current: 1,
      xpReward: 50,
      bonusReward: 'Speed Badge',
      icon: '⚡',
      difficulty: 'easy',
      expiresIn: 18,
    },
    {
      id: 'dc2',
      title: 'Bug Hunter',
      description: 'Find 5 bugs in Debugging Game',
      type: 'game',
      requirement: 5,
      current: 3,
      xpReward: 75,
      icon: '🐛',
      difficulty: 'medium',
      expiresIn: 18,
    },
    {
      id: 'dc3',
      title: 'Knowledge Seeker',
      description: 'Complete 2 lessons',
      type: 'lesson',
      requirement: 2,
      current: 0,
      xpReward: 60,
      icon: '📚',
      difficulty: 'easy',
      expiresIn: 18,
    },
    {
      id: 'dc4',
      title: 'Perfect Practice',
      description: '10 correct answers in a row',
      type: 'practice',
      requirement: 10,
      current: 7,
      xpReward: 100,
      bonusReward: 'Perfect Star',
      icon: '⭐',
      difficulty: 'hard',
      expiresIn: 18,
    },
  ]);

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([
    {
      id: 'wg1',
      title: 'Weekly Warrior',
      description: 'Earn 500 XP this week',
      target: 500,
      current: 320,
      xpReward: 200,
      badge: '🏅',
    },
    {
      id: 'wg2',
      title: 'Consistency King',
      description: 'Practice 5 days this week',
      target: 5,
      current: 3,
      xpReward: 150,
      badge: '👑',
    },
    {
      id: 'wg3',
      title: 'Game Master',
      description: 'Play 10 different games',
      target: 10,
      current: 6,
      xpReward: 175,
    },
  ]);

  const [streakRewards, setStreakRewards] = useState<StreakReward[]>([
    { day: 1, reward: 'Starter Boost', xp: 10, claimed: true },
    { day: 3, reward: 'Momentum', xp: 25, claimed: true },
    { day: 7, reward: 'Week Warrior', xp: 75, claimed: false },
    { day: 14, reward: 'Dedicated', xp: 150, claimed: false },
    { day: 30, reward: 'Legendary', xp: 500, claimed: false },
  ]);

  const [currentStreak, setCurrentStreak] = useState(5);
  const [showRewardClaim, setShowRewardClaim] = useState<string | null>(null);

  const claimDailyReward = (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge && challenge.current >= challenge.requirement) {
      playSound('levelUp');
      addXp(challenge.xpReward);
      setShowRewardClaim(challengeId);
      
      // Remove claimed challenge
      setTimeout(() => {
        setDailyChallenges(prev => prev.filter(c => c.id !== challengeId));
        setShowRewardClaim(null);
      }, 2000);
    }
  };

  const claimStreakReward = (day: number) => {
    if (currentStreak >= day) {
      const reward = streakRewards.find(r => r.day === day);
      if (reward && !reward.claimed) {
        playSound('levelUp');
        addXp(reward.xp);
        setStreakRewards(prev => 
          prev.map(r => r.day === day ? { ...r, claimed: true } : r)
        );
      }
    }
  };

  const difficultyColors = {
    easy: 'bg-success/20 text-success border-success/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    hard: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Streak Section */}
      <Card className="bg-gradient-to-r from-warning/10 via-primary/5 to-accent/10 border-2 border-warning/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-warning" />
              </div>
              <div>
                <h3 className="text-2xl font-black">{currentStreak} Day Streak!</h3>
                <p className="text-sm text-muted-foreground">Keep learning to grow your streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next reward at</p>
              <p className="text-lg font-bold text-warning">Day 7</p>
            </div>
          </div>

          {/* Streak Milestones */}
          <div className="flex justify-between items-center gap-1">
            {streakRewards.map((reward, index) => {
              const isReached = currentStreak >= reward.day;
              const canClaim = isReached && !reward.claimed;
              
              return (
                <motion.button
                  key={reward.day}
                  onClick={() => canClaim && claimStreakReward(reward.day)}
                  className={`flex-1 p-2 rounded-lg text-center transition-all ${
                    reward.claimed
                      ? 'bg-success/20 border border-success/50'
                      : isReached
                      ? 'bg-warning/20 border-2 border-warning animate-pulse cursor-pointer'
                      : 'bg-muted/50 border border-border'
                  }`}
                  whileHover={canClaim ? { scale: 1.05 } : {}}
                  whileTap={canClaim ? { scale: 0.95 } : {}}
                >
                  <div className="text-lg">{reward.claimed ? '✓' : isReached ? '🎁' : '🔒'}</div>
                  <p className="text-xs font-bold">Day {reward.day}</p>
                  <p className="text-[10px] text-muted-foreground">+{reward.xp} XP</p>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isKidsMode ? '🎯' : <Target className="w-5 h-5" />}
            Daily Challenges
          </h2>
          <Badge variant="outline" className="gap-1">
            <Timer className="w-3 h-3" />
            Resets in 18h
          </Badge>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {dailyChallenges.map((challenge) => {
              const isComplete = challenge.current >= challenge.requirement;
              const progress = (challenge.current / challenge.requirement) * 100;
              
              return (
                <motion.div
                  key={challenge.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                >
                  <Card className={`transition-all ${
                    isComplete ? 'border-success/50 bg-success/5' : ''
                  } ${showRewardClaim === challenge.id ? 'bg-gradient-to-r from-success/20 to-primary/20 scale-105' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{challenge.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{challenge.title}</h3>
                            <Badge className={difficultyColors[challenge.difficulty]} variant="outline">
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                          <div className="flex items-center gap-3">
                            <Progress value={progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium">
                              {challenge.current}/{challenge.requirement}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {isComplete ? (
                            <Button
                              size="sm"
                              onClick={() => claimDailyReward(challenge.id)}
                              className="gap-1 bg-success hover:bg-success/90"
                            >
                              <Gift className="w-4 h-4" />
                              Claim
                            </Button>
                          ) : (
                            <div>
                              <Badge variant="secondary" className="gap-1">
                                <Star className="w-3 h-3" />
                                {challenge.xpReward} XP
                              </Badge>
                              {challenge.bonusReward && (
                                <p className="text-xs text-primary mt-1">+{challenge.bonusReward}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Weekly Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isKidsMode ? '🏆' : <Trophy className="w-5 h-5" />}
            Weekly Goals
          </h2>
          <Badge variant="outline" className="gap-1">
            <Calendar className="w-3 h-3" />
            4 days left
          </Badge>
        </div>

        <div className="grid gap-3">
          {weeklyGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            
            return (
              <Card key={goal.id} className={isComplete ? 'border-primary/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {goal.badge && <div className="text-2xl">{goal.badge}</div>}
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                    </div>
                    <Badge variant={isComplete ? 'default' : 'secondary'} className="gap-1">
                      <Zap className="w-3 h-3" />
                      {goal.xpReward} XP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick Start
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => navigate('/game/pacman')}>
              <span className="text-2xl">🎮</span>
              <span className="text-sm">Play Game</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => navigate('/path')}>
              <span className="text-2xl">📚</span>
              <span className="text-sm">Learn</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => navigate('/game/spaced-rep')}>
              <span className="text-2xl">🔄</span>
              <span className="text-sm">Review</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => navigate('/battle')}>
              <span className="text-2xl">⚔️</span>
              <span className="text-sm">Challenge</span>
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyChallenges;
