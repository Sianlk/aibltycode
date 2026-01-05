import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Clock, Check, X, Crown, Trophy, User, Eye, Zap, Flame, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBattle } from '@/hooks/useBattle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const ROUND_TIME_LIMIT = 15000;

interface Spectator {
  id: string;
  user_id: string;
  joined_at: string;
}

export function BattleArena() {
  const { user } = useAuth();
  const { currentRoom, currentRound, isHost, submitAnswer, startNextRound, leaveRoom } = useBattle();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const isMyTurn = currentRound && !selectedAnswer;
  const bothAnswered = currentRound?.hostAnswer !== null && currentRound?.opponentAnswer !== null;
  const amHost = user?.id === currentRoom?.hostId;
  const myScore = amHost ? currentRoom?.hostScore : currentRoom?.opponentScore;
  const opponentScore = amHost ? currentRoom?.opponentScore : currentRoom?.hostScore;
  const currentRoundNum = currentRound?.roundNumber || 0;
  const totalRounds = currentRoom?.totalRounds || 5;

  // Fetch spectators
  useEffect(() => {
    if (!currentRoom?.id) return;

    const fetchSpectators = async () => {
      const { data } = await supabase
        .from('battle_spectators')
        .select('*')
        .eq('room_id', currentRoom.id);
      if (data) setSpectators(data);
    };

    fetchSpectators();

    const channel = supabase
      .channel(`spectators-${currentRoom.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'battle_spectators',
        filter: `room_id=eq.${currentRoom.id}`,
      }, fetchSpectators)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentRoom?.id]);

  // Particle effects on correct answer
  const triggerParticles = useCallback(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!currentRound || selectedAnswer !== null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
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
      if (selectedAnswer === currentRound?.correctAnswer) {
        triggerParticles();
      }
      
      setTimeout(() => {
        if (isHost && currentRoundNum < totalRounds) {
          setIsTransitioning(true);
          setTimeout(() => {
            startNextRound();
          }, 500);
        }
      }, 2500);
    }
  }, [bothAnswered, showResult, isHost, currentRoundNum, totalRounds, startNextRound, selectedAnswer, currentRound?.correctAnswer, triggerParticles]);

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
        className="max-w-2xl mx-auto text-center py-12 relative"
      >
        {/* Victory particles */}
        {won && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 1 }}
                animate={{ y: '100vh', opacity: 0 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
                className="absolute w-3 h-3"
                style={{ left: `${Math.random() * 100}%` }}
              >
                {i % 3 === 0 ? (
                  <Star className="w-full h-full text-yellow-400" />
                ) : i % 3 === 1 ? (
                  <Zap className="w-full h-full text-primary" />
                ) : (
                  <Flame className="w-full h-full text-orange-500" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2, damping: 12 }}
          className={cn(
            'w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center relative',
            'before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-30',
            won ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 before:bg-yellow-400 shadow-[0_0_60px_rgba(234,179,8,0.6)]' :
            draw ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 before:bg-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.6)]' :
            'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 before:bg-slate-400 shadow-[0_0_40px_rgba(100,116,139,0.4)]'
          )}
        >
          {won ? (
            <Crown className="h-16 w-16 text-white drop-shadow-lg" />
          ) : draw ? (
            <Swords className="h-16 w-16 text-white drop-shadow-lg" />
          ) : (
            <Shield className="h-16 w-16 text-white drop-shadow-lg" />
          )}
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'text-5xl font-black mb-4 tracking-tight',
            won && 'text-gradient-primary',
            draw && 'text-blue-400',
            !won && !draw && 'text-muted-foreground'
          )}
        >
          {won ? '🎉 VICTORY!' : draw ? '🤝 DRAW!' : 'GOOD FIGHT!'}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mb-8"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Score</p>
            <p className="text-4xl font-black text-primary">{myScore}</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Opponent</p>
            <p className="text-4xl font-black text-accent">{opponentScore}</p>
          </div>
        </motion.div>

        {spectators.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8 text-muted-foreground"
          >
            <Eye className="h-4 w-4" />
            <span>{spectators.length} spectators watched this battle</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button onClick={leaveRoom} size="lg" className="gap-2 h-14 px-8 text-lg font-bold">
            <Swords className="h-5 w-5" />
            Back to Arena
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (!currentRound) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
        />
        <p className="text-lg text-muted-foreground animate-pulse">Preparing battle...</p>
      </div>
    );
  }

  const timeProgress = (timeLeft / ROUND_TIME_LIMIT) * 100;
  const isLowTime = timeLeft < 5000;
  const isCriticalTime = timeLeft < 2000;

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: `${p.x}%`, y: `${p.y}%` }}
            animate={{ opacity: 0, scale: 2, y: `${p.y - 30}%` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute pointer-events-none"
          >
            <Star className="h-6 w-6 text-yellow-400" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Premium Score Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-background to-accent/20 border-2 border-border p-1"
      >
        <div className="relative flex items-center justify-between p-4 rounded-xl bg-card/80 backdrop-blur-xl">
          {/* Player 1 */}
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ scale: amHost && selectedAnswer !== null ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <User className="h-7 w-7 text-primary-foreground" />
              </div>
              {amHost && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              )}
            </motion.div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">You</p>
              <motion.p 
                key={myScore}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-black text-primary"
              >
                {myScore}
              </motion.p>
            </div>
          </div>

          {/* Round Counter */}
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <Swords className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">ROUND</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-primary">{currentRoundNum}</span>
              <span className="text-lg text-muted-foreground">/</span>
              <span className="text-lg text-muted-foreground">{totalRounds}</span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-4 flex-row-reverse">
            <motion.div
              animate={{ scale: !amHost && selectedAnswer !== null ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent),0.3)]">
                <User className="h-7 w-7 text-white" />
              </div>
            </motion.div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Opponent</p>
              <motion.p
                key={opponentScore}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-black text-accent"
              >
                {opponentScore}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spectator Count */}
      {spectators.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{spectators.length} watching</span>
          </Badge>
        </motion.div>
      )}

      {/* Timer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isLowTime ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
            >
              <Clock className={cn('h-5 w-5', isCriticalTime ? 'text-red-500' : isLowTime ? 'text-yellow-500' : 'text-muted-foreground')} />
            </motion.div>
            <span className="font-medium text-muted-foreground">Time Remaining</span>
          </div>
          <motion.span 
            animate={isCriticalTime ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, repeat: isCriticalTime ? Infinity : 0 }}
            className={cn(
              'font-black text-lg tabular-nums',
              isCriticalTime ? 'text-red-500' : isLowTime ? 'text-yellow-500' : 'text-foreground'
            )}
          >
            {(timeLeft / 1000).toFixed(1)}s
          </motion.span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden bg-muted">
          <motion.div
            className={cn(
              'absolute inset-y-0 left-0 rounded-full transition-colors',
              isCriticalTime ? 'bg-gradient-to-r from-red-500 to-red-600' :
              isLowTime ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-primary to-primary/80'
            )}
            style={{ width: `${timeProgress}%` }}
            animate={isCriticalTime ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.3, repeat: isCriticalTime ? Infinity : 0 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={currentRound.roundNumber}
            initial={{ opacity: 0, y: 30, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, rotateX: 10 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/80 backdrop-blur-xl shadow-[0_0_40px_rgba(var(--primary),0.1)]">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8 leading-relaxed">
                  {currentRound.question.text}
                </h3>

                {currentRound.question.code && (
                  <pre className="bg-background/80 border border-border p-6 rounded-xl mb-8 overflow-x-auto font-mono text-sm shadow-inner">
                    {currentRound.question.code}
                  </pre>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {currentRound.question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = showResult && index === currentRound.correctAnswer;
                    const isWrong = showResult && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        whileHover={selectedAnswer === null ? { scale: 1.03, y: -2 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={cn(
                          'p-5 rounded-xl text-left transition-all duration-300 relative overflow-hidden',
                          'border-2 font-medium',
                          selectedAnswer === null && 'hover:border-primary/60 hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] border-border bg-card/50',
                          isSelected && !showResult && 'border-primary bg-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.3)]',
                          isCorrect && 'border-green-500 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.4)]',
                          isWrong && 'border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]',
                          !isSelected && !isCorrect && showResult && 'opacity-40'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all',
                            isCorrect && 'bg-green-500 text-white scale-110',
                            isWrong && 'bg-red-500 text-white scale-110',
                            !isCorrect && !isWrong && 'bg-muted text-muted-foreground'
                          )}>
                            {isCorrect ? <Check className="h-5 w-5" /> :
                             isWrong ? <X className="h-5 w-5" /> :
                             String.fromCharCode(65 + index)}
                          </div>
                          <span className={cn(
                            'text-base truncate',
                            isCorrect && 'text-green-400 font-semibold',
                            isWrong && 'text-red-400'
                          )}>
                            {option}
                          </span>
                        </div>
                        
                        {/* Selection shine effect */}
                        {isSelected && !showResult && (
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          />
                        )}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50 border border-border backdrop-blur-sm">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-primary"
            />
            <span className="text-sm font-medium text-muted-foreground">
              Waiting for opponent's answer...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}