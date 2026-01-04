import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CodeChallenge } from '@/hooks/useCodeEditor';

interface ChallengePanelProps {
  challenges: CodeChallenge[];
  currentChallenge: CodeChallenge | null;
  completedChallenges?: Set<string>;
  onSelectChallenge: (challenge: CodeChallenge) => void;
  className?: string;
}

const difficultyConfig = {
  1: { label: 'Beginner', color: 'bg-green-500', stars: 1 },
  2: { label: 'Easy', color: 'bg-blue-500', stars: 2 },
  3: { label: 'Medium', color: 'bg-yellow-500', stars: 3 },
  4: { label: 'Hard', color: 'bg-orange-500', stars: 4 },
  5: { label: 'Expert', color: 'bg-red-500', stars: 5 },
};

export function ChallengePanel({
  challenges,
  currentChallenge,
  completedChallenges = new Set(),
  onSelectChallenge,
  className,
}: ChallengePanelProps) {
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, CodeChallenge[]>);

  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Coding Challenges</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete challenges to earn XP and level up!
        </p>
      </div>

      {/* Challenge List */}
      <ScrollArea className="h-[400px]">
        <div className="p-3 space-y-4">
          {Object.entries(groupedChallenges).map(([category, categoryChalls]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {category}
              </h4>
              <div className="space-y-2">
                {categoryChalls.map((challenge, index) => {
                  const isCompleted = completedChallenges.has(challenge.id);
                  const isActive = currentChallenge?.id === challenge.id;
                  const difficulty = difficultyConfig[challenge.difficulty as keyof typeof difficultyConfig] || difficultyConfig[1];

                  return (
                    <motion.button
                      key={challenge.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelectChallenge(challenge)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-all duration-200',
                        'border border-transparent hover:border-primary/30',
                        isActive
                          ? 'bg-primary/10 border-primary/50'
                          : 'bg-muted/30 hover:bg-muted/50',
                        isCompleted && 'opacity-80'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className={cn('w-4 h-4 rounded-full', difficulty.color, 'opacity-70 flex-shrink-0')} />
                            )}
                            <span className={cn(
                              'font-medium text-sm truncate',
                              isCompleted && 'line-through text-muted-foreground'
                            )}>
                              {challenge.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-1.5 ml-6">
                            {/* Stars */}
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-3 w-3',
                                    i < difficulty.stars
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-muted-foreground/30'
                                  )}
                                />
                              ))}
                            </div>
                            
                            {/* XP */}
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <Zap className="h-3 w-3" />
                              <span>{challenge.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Current Challenge Details */}
      {currentChallenge && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h4 className="font-semibold mb-2">{currentChallenge.title}</h4>
          <p className="text-sm text-muted-foreground">{currentChallenge.description}</p>
        </div>
      )}
    </div>
  );
}
