import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/contexts/GameContext';
import { 
  Trophy, Star, Zap, Flame, Target, Award, Crown, 
  Rocket, Brain, Heart, Shield, Code, Sparkles, Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'progress' | 'skill' | 'streak' | 'collection' | 'special';
  requirement: number;
  current: number;
  xpReward: number;
  unlockedAt?: Date;
  secret?: boolean;
}

const achievements: Achievement[] = [
  // Progress Achievements
  { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎓', rarity: 'common', category: 'progress', requirement: 1, current: 1, xpReward: 25, unlockedAt: new Date() },
  { id: 'ten-lessons', name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', rarity: 'common', category: 'progress', requirement: 10, current: 7, xpReward: 50 },
  { id: 'fifty-lessons', name: 'Dedicated Student', description: 'Complete 50 lessons', icon: '🎯', rarity: 'rare', category: 'progress', requirement: 50, current: 7, xpReward: 150 },
  { id: 'hundred-lessons', name: 'Master Scholar', description: 'Complete 100 lessons', icon: '👨‍🎓', rarity: 'epic', category: 'progress', requirement: 100, current: 7, xpReward: 500 },
  
  // Skill Achievements
  { id: 'first-game', name: 'Player One', description: 'Play your first game', icon: '🎮', rarity: 'common', category: 'skill', requirement: 1, current: 1, xpReward: 25, unlockedAt: new Date() },
  { id: 'perfect-game', name: 'Perfectionist', description: 'Get 100% accuracy in any game', icon: '💯', rarity: 'rare', category: 'skill', requirement: 1, current: 1, xpReward: 100, unlockedAt: new Date() },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete Speed Challenge under 30 seconds', icon: '⚡', rarity: 'epic', category: 'skill', requirement: 1, current: 0, xpReward: 200 },
  { id: 'bug-master', name: 'Bug Exterminator', description: 'Find 50 bugs in Debugging Game', icon: '🐛', rarity: 'rare', category: 'skill', requirement: 50, current: 23, xpReward: 150 },
  { id: 'pattern-pro', name: 'Pattern Pro', description: 'Master 20 code patterns', icon: '🧩', rarity: 'epic', category: 'skill', requirement: 20, current: 12, xpReward: 250 },
  
  // Streak Achievements
  { id: 'streak-3', name: 'Getting Warmed Up', description: 'Maintain a 3-day streak', icon: '🔥', rarity: 'common', category: 'streak', requirement: 3, current: 5, xpReward: 30, unlockedAt: new Date() },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '📅', rarity: 'rare', category: 'streak', requirement: 7, current: 5, xpReward: 100 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🏆', rarity: 'epic', category: 'streak', requirement: 30, current: 5, xpReward: 500 },
  { id: 'streak-100', name: 'Century Champion', description: 'Maintain a 100-day streak', icon: '👑', rarity: 'legendary', category: 'streak', requirement: 100, current: 5, xpReward: 2000 },
  
  // Collection Achievements
  { id: 'all-games', name: 'Game Collector', description: 'Play every type of game', icon: '🎲', rarity: 'rare', category: 'collection', requirement: 20, current: 14, xpReward: 200 },
  { id: 'all-modules', name: 'Curriculum Champion', description: 'Start all 7 modules', icon: '📖', rarity: 'rare', category: 'collection', requirement: 7, current: 4, xpReward: 175 },
  { id: 'all-zones', name: 'World Explorer', description: 'Visit all learning zones', icon: '🗺️', rarity: 'epic', category: 'collection', requirement: 6, current: 3, xpReward: 300 },
  
  // Special Achievements
  { id: 'night-owl', name: 'Night Owl', description: 'Practice after midnight', icon: '🦉', rarity: 'rare', category: 'special', requirement: 1, current: 0, xpReward: 50, secret: true },
  { id: 'early-bird', name: 'Early Bird', description: 'Practice before 6 AM', icon: '🐦', rarity: 'rare', category: 'special', requirement: 1, current: 0, xpReward: 50, secret: true },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Practice every weekend for a month', icon: '🛡️', rarity: 'epic', category: 'special', requirement: 4, current: 2, xpReward: 200 },
  { id: 'comeback-kid', name: 'Comeback Kid', description: 'Return after 7+ days away', icon: '🔄', rarity: 'rare', category: 'special', requirement: 1, current: 0, xpReward: 100, secret: true },
];

const rarityColors = {
  common: 'bg-muted text-muted-foreground border-border',
  rare: 'bg-primary/20 text-primary border-primary/50',
  epic: 'bg-accent/20 text-accent border-accent/50',
  legendary: 'bg-gradient-to-r from-warning/30 to-primary/30 text-warning border-warning/50',
};

const rarityGlow = {
  common: '',
  rare: 'shadow-primary/20 shadow-lg',
  epic: 'shadow-accent/30 shadow-xl',
  legendary: 'shadow-warning/40 shadow-2xl animate-pulse',
};

const AchievementsGallery: React.FC = () => {
  const { gameMode } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const isKidsMode = gameMode === 'kid';
  
  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'skill', name: 'Skill', icon: '⭐' },
    { id: 'streak', name: 'Streak', icon: '🔥' },
    { id: 'collection', name: 'Collection', icon: '📦' },
    { id: 'special', name: 'Special', icon: '✨' },
  ];
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalXpEarned = achievements
    .filter(a => a.unlockedAt)
    .reduce((sum, a) => sum + a.xpReward, 0);
  
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Stats */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 via-accent/5 to-warning/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                {isKidsMode ? '🏆' : <Trophy className="w-6 h-6" />}
                Achievements
              </h1>
              <p className="text-muted-foreground">Your collection of accomplishments</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-primary">{unlockedCount}/{achievements.length}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
          </div>
          
          <Progress value={progressPercent} className="h-3 mb-2" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{progressPercent}% Complete</span>
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              {totalXpEarned} XP Earned
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-1">
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progress = (achievement.current / achievement.requirement) * 100;
          const isSecret = achievement.secret && !isUnlocked;
          
          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isSecret && setSelectedAchievement(achievement)}
            >
              <Card className={`cursor-pointer transition-all h-full ${
                isUnlocked 
                  ? `${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]}`
                  : 'bg-muted/30 border-dashed'
              }`}>
                <CardContent className="p-4 text-center">
                  {isSecret ? (
                    <>
                      <div className="text-4xl mb-2 opacity-30">❓</div>
                      <p className="font-bold text-sm opacity-50">Secret Achievement</p>
                      <p className="text-xs text-muted-foreground">Keep exploring...</p>
                    </>
                  ) : (
                    <>
                      <div className={`text-4xl mb-2 ${!isUnlocked && 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <p className="font-bold text-sm mb-1">{achievement.name}</p>
                      <Badge variant="outline" className="text-[10px] mb-2 capitalize">
                        {achievement.rarity}
                      </Badge>
                      
                      {!isUnlocked && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-1" />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {achievement.current}/{achievement.requirement}
                          </p>
                        </div>
                      )}
                      
                      {isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-success mt-2">
                          <Award className="w-3 h-3" />
                          <span className="text-xs font-bold">Unlocked!</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className={`${rarityColors[selectedAchievement.rarity]} ${rarityGlow[selectedAchievement.rarity]}`}>
                <CardContent className="p-8 text-center">
                  <div className="text-7xl mb-4">{selectedAchievement.icon}</div>
                  <h2 className="text-2xl font-black mb-2">{selectedAchievement.name}</h2>
                  <Badge className="mb-4 capitalize">{selectedAchievement.rarity}</Badge>
                  <p className="text-muted-foreground mb-6">{selectedAchievement.description}</p>
                  
                  {selectedAchievement.unlockedAt ? (
                    <div className="bg-success/20 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-center gap-2 text-success mb-2">
                        <Award className="w-5 h-5" />
                        <span className="font-bold">Unlocked!</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Progress 
                        value={(selectedAchievement.current / selectedAchievement.requirement) * 100} 
                        className="h-3 mb-2" 
                      />
                      <p className="text-sm">
                        Progress: {selectedAchievement.current}/{selectedAchievement.requirement}
                      </p>
                    </div>
                  )}
                  
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    {selectedAchievement.xpReward} XP Reward
                  </Badge>
                  
                  <Button 
                    className="w-full mt-6" 
                    variant="outline"
                    onClick={() => setSelectedAchievement(null)}
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementsGallery;
