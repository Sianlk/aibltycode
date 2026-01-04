import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Clock, Check, X, Crown, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useBattle } from '@/hooks/useBattle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const ROUND_TIME_LIMIT = 15000; // 15 seconds

export function BattleArena() {
  const { user } = useAuth();
  const { currentRoom, currentRound, isHost, submitAnswer, startNextRound, leaveRoom } = useBattle();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isMyTurn = currentRound && !selectedAnswer;
  const bothAnswered = currentRound?.hostAnswer !== null && currentRound?.opponentAnswer !== null;
  const amHost = user?.id === currentRoom?.hostId;
  const myScore = amHost ? currentRoom?.hostScore : currentRoom?.opponentScore;
  const opponentScore = amHost ? currentRoom?.opponentScore : currentRoom?.hostScore;
  const currentRoundNum = currentRound?.roundNumber || 0;
  const totalRounds = currentRoom?.totalRounds || 5;

  // Countdown timer
  useEffect(() => {
    if (!currentRound || selectedAnswer !== null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          // Time's up - auto-submit wrong answer
          submitAnswer(-1);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentRound, selectedAnswer, submitAnswer]);

  // Reset on new round
  useEffect(() => {
    if (currentRound) {
      setSelectedAnswer(null);
      setTimeLeft(ROUND_TIME_LIMIT);
      setShowResult(false);
      setIsTransitioning(false);
    }
  }, [currentRound?.roundNumber]);

  // Show results when both answered
  useEffect(() => {
    if (bothAnswered && !showResult) {
      setShowResult(true);
      
      // Start next round after delay
      setTimeout(() => {
        if (isHost && currentRoundNum < totalRounds) {
          setIsTransitioning(true);
          setTimeout(() => {
            startNextRound();
          }, 500);
        }
      }, 2500);
    }
  }, [bothAnswered, showResult, isHost, currentRoundNum, totalRounds, startNextRound]);

  // Start first round
  useEffect(() => {
    if (currentRoom?.status === 'active' && !currentRound && isHost) {
      startNextRound();
    }
  }, [currentRoom?.status, currentRound, isHost, startNextRound]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    submitAnswer(index);
  };

  // Battle complete
  if (currentRoom?.status === 'completed' || (currentRoundNum >= totalRounds && bothAnswered)) {
    const won = myScore! > opponentScore!;
    const draw = myScore === opponentScore;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className={cn(
            'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
            won ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
            draw ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
            'bg-gradient-to-br from-gray-400 to-gray-600'
          )}
        >
          {won ? (
            <Crown className="h-12 w-12 text-white" />
          ) : draw ? (
            <Swords className="h-12 w-12 text-white" />
          ) : (
            <Trophy className="h-12 w-12 text-white" />
          )}
        </motion.div>

        <h2 className="text-3xl font-bold mb-2">
          {won ? '🎉 Victory!' : draw ? '🤝 Draw!' : 'Good Fight!'}
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Final Score: {myScore} - {opponentScore}
        </p>

        <Button onClick={leaveRoom} size="lg" className="gap-2">
          Back to Lobby
        </Button>
      </motion.div>
    );
  }

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Preparing battle...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">You</p>
            <p className="text-2xl font-bold">{myScore}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Round</p>
          <p className="text-lg font-bold">{currentRoundNum} / {totalRounds}</p>
        </div>

        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Opponent</p>
            <p className="text-2xl font-bold">{opponentScore}</p>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time Left</span>
          </div>
          <span className={cn(
            'font-bold',
            timeLeft < 5000 && 'text-red-500 animate-pulse'
          )}>
            {(timeLeft / 1000).toFixed(1)}s
          </span>
        </div>
        <Progress value={(timeLeft / ROUND_TIME_LIMIT) * 100} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={currentRound.roundNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-center mb-6">
                  {currentRound.question.text}
                </h3>

                {currentRound.question.code && (
                  <pre className="bg-muted p-4 rounded-lg mb-6 overflow-x-auto font-mono text-sm">
                    {currentRound.question.code}
                  </pre>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {currentRound.question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = showResult && index === currentRound.correctAnswer;
                    const isWrong = showResult && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={cn(
                          'p-4 rounded-xl text-left transition-all duration-200',
                          'border-2',
                          selectedAnswer === null && 'hover:bg-muted/50 hover:border-primary/50 border-border',
                          isSelected && !showResult && 'bg-primary/20 border-primary',
                          isCorrect && 'bg-green-500/20 border-green-500',
                          isWrong && 'bg-red-500/20 border-red-500',
                          !isSelected && !isCorrect && showResult && 'opacity-50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                            isCorrect && 'bg-green-500 text-white',
                            isWrong && 'bg-red-500 text-white',
                            !isCorrect && !isWrong && 'bg-muted'
                          )}>
                            {isCorrect ? <Check className="h-4 w-4" /> :
                             isWrong ? <X className="h-4 w-4" /> :
                             String.fromCharCode(65 + index)}
                          </div>
                          <span className={cn(
                            isCorrect && 'text-green-500 font-medium',
                            isWrong && 'text-red-500'
                          )}>
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting indicator */}
      {selectedAnswer !== null && !bothAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Waiting for opponent...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
