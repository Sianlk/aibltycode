import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BattleRoom {
  id: string;
  roomCode: string;
  hostId: string;
  opponentId: string | null;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  gameType: string;
  difficulty: number;
  totalRounds: number;
  hostScore: number;
  opponentScore: number;
  winnerId: string | null;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
}

export interface BattleRound {
  id: string;
  roomId: string;
  roundNumber: number;
  question: {
    text: string;
    code?: string;
    options: string[];
  };
  correctAnswer: number;
  hostAnswer: number | null;
  opponentAnswer: number | null;
  hostTimeMs: number | null;
  opponentTimeMs: number | null;
  roundWinner: 'host' | 'opponent' | 'draw' | null;
}

export interface BattleStats {
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

const BATTLE_QUESTIONS = [
  {
    text: "What is the output of: System.out.println(5 + 3);",
    options: ["53", "8", "5 + 3", "Error"],
    correctAnswer: 1
  },
  {
    text: "Which keyword is used to create a new instance of a class?",
    options: ["class", "new", "this", "create"],
    correctAnswer: 1
  },
  {
    text: "What data type would you use for a whole number in Java?",
    options: ["float", "String", "int", "char"],
    correctAnswer: 2
  },
  {
    text: "What symbol is used to end most Java statements?",
    options: [".", ":", ";", ","],
    correctAnswer: 2
  },
  {
    text: "Which loop is best when you know how many times to iterate?",
    options: ["while", "do-while", "for", "if"],
    correctAnswer: 2
  },
  {
    text: "What is the correct way to declare a String variable?",
    options: ['string name = "Hi"', 'String name = "Hi"', 'str name = "Hi"', 'String name = Hi'],
    correctAnswer: 1
  },
  {
    text: "What does OOP stand for?",
    options: ["Object Oriented Programming", "Open Online Platform", "Ordered Output Process", "Operation Object Protocol"],
    correctAnswer: 0
  },
  {
    text: "Which access modifier makes a member accessible only within its class?",
    options: ["public", "protected", "private", "default"],
    correctAnswer: 2
  },
  {
    text: "What is the parent class of all classes in Java?",
    options: ["Main", "Object", "Parent", "Super"],
    correctAnswer: 1
  },
  {
    text: "Which operator is used to compare two values for equality?",
    options: ["=", "==", "===", "!="],
    correctAnswer: 1
  },
];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useBattle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState<BattleRoom | null>(null);
  const [currentRound, setCurrentRound] = useState<BattleRound | null>(null);
  const [myStats, setMyStats] = useState<BattleStats | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState<number | null>(null);

  // Load user stats
  const loadStats = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('battle_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading stats:', error);
      return;
    }

    if (data) {
      setMyStats({
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        rating: data.rating || 1000,
        currentWinStreak: data.current_win_streak || 0,
        bestWinStreak: data.best_win_streak || 0,
      });
    } else {
      // Create initial stats
      await supabase.from('battle_stats').insert({ user_id: user.id });
      setMyStats({ wins: 0, losses: 0, draws: 0, rating: 1000, currentWinStreak: 0, bestWinStreak: 0 });
    }
  }, [user]);

  // Create a new battle room
  const createRoom = useCallback(async (gameType = 'quick-fire', totalRounds = 5, difficulty = 5) => {
    if (!user) return null;

    const roomCode = generateRoomCode();
    
    const { data, error } = await supabase
      .from('battle_rooms')
      .insert({
        room_code: roomCode,
        host_id: user.id,
        game_type: gameType,
        total_rounds: totalRounds,
        difficulty,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      toast({ title: 'Failed to create room', variant: 'destructive' });
      return null;
    }

    setIsHost(true);
    const room: BattleRoom = {
      id: data.id,
      roomCode: data.room_code,
      hostId: data.host_id,
      opponentId: data.opponent_id,
      status: data.status as BattleRoom['status'],
      gameType: data.game_type,
      difficulty: data.difficulty || 5,
      totalRounds: data.total_rounds || 5,
      hostScore: data.host_score || 0,
      opponentScore: data.opponent_score || 0,
      winnerId: data.winner_id,
      createdAt: new Date(data.created_at),
      startedAt: data.started_at ? new Date(data.started_at) : null,
      endedAt: data.ended_at ? new Date(data.ended_at) : null,
    };
    setCurrentRoom(room);
    return room;
  }, [user, toast]);

  // Join an existing room
  const joinRoom = useCallback(async (roomCode: string) => {
    if (!user) return null;

    const { data: roomData, error: fetchError } = await supabase
      .from('battle_rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .eq('status', 'waiting')
      .single();

    if (fetchError || !roomData) {
      toast({ title: 'Room not found or already started', variant: 'destructive' });
      return null;
    }

    if (roomData.host_id === user.id) {
      toast({ title: 'You cannot join your own room', variant: 'destructive' });
      return null;
    }

    const { error: updateError } = await supabase
      .from('battle_rooms')
      .update({ opponent_id: user.id, status: 'active', started_at: new Date().toISOString() })
      .eq('id', roomData.id);

    if (updateError) {
      toast({ title: 'Failed to join room', variant: 'destructive' });
      return null;
    }

    setIsHost(false);
    const room: BattleRoom = {
      id: roomData.id,
      roomCode: roomData.room_code,
      hostId: roomData.host_id,
      opponentId: user.id,
      status: 'active',
      gameType: roomData.game_type,
      difficulty: roomData.difficulty || 5,
      totalRounds: roomData.total_rounds || 5,
      hostScore: roomData.host_score || 0,
      opponentScore: roomData.opponent_score || 0,
      winnerId: roomData.winner_id,
      createdAt: new Date(roomData.created_at),
      startedAt: new Date(),
      endedAt: null,
    };
    setCurrentRoom(room);
    return room;
  }, [user, toast]);

  // Start next round (host only)
  const startNextRound = useCallback(async () => {
    if (!currentRoom || !isHost) return null;

    const currentRoundNum = currentRound?.roundNumber || 0;
    const nextRoundNum = currentRoundNum + 1;

    if (nextRoundNum > currentRoom.totalRounds) {
      return null; // Battle complete
    }

    const questions = shuffleArray(BATTLE_QUESTIONS);
    const question = questions[nextRoundNum % questions.length];

    const { data, error } = await supabase
      .from('battle_rounds')
      .insert({
        room_id: currentRoom.id,
        round_number: nextRoundNum,
        question: {
          text: question.text,
          options: question.options,
        },
        correct_answer: question.correctAnswer,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating round:', error);
      return null;
    }

    setRoundStartTime(Date.now());
    return data;
  }, [currentRoom, currentRound, isHost]);

  // Submit answer
  const submitAnswer = useCallback(async (answerIndex: number) => {
    if (!currentRoom || !currentRound || !user || roundStartTime === null) return;

    const timeMs = Date.now() - roundStartTime;
    const isCorrect = answerIndex === currentRound.correctAnswer;
    const isHostPlayer = user.id === currentRoom.hostId;

    const updateData: Record<string, number | string | null> = {};
    if (isHostPlayer) {
      updateData.host_answer = answerIndex;
      updateData.host_time_ms = timeMs;
    } else {
      updateData.opponent_answer = answerIndex;
      updateData.opponent_time_ms = timeMs;
    }

    await supabase
      .from('battle_rounds')
      .update(updateData)
      .eq('id', currentRound.id);

    // Update local state
    setCurrentRound(prev => prev ? {
      ...prev,
      ...(isHostPlayer 
        ? { hostAnswer: answerIndex, hostTimeMs: timeMs }
        : { opponentAnswer: answerIndex, opponentTimeMs: timeMs }
      ),
    } : null);

    // Update score if correct
    if (isCorrect) {
      const scoreField = isHostPlayer ? 'host_score' : 'opponent_score';
      await supabase
        .from('battle_rooms')
        .update({ [scoreField]: (isHostPlayer ? currentRoom.hostScore : currentRoom.opponentScore) + 1 })
        .eq('id', currentRoom.id);
    }
  }, [currentRoom, currentRound, user, roundStartTime]);

  // Leave/cancel room
  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;

    if (currentRoom.status === 'waiting' && isHost) {
      await supabase
        .from('battle_rooms')
        .update({ status: 'cancelled' })
        .eq('id', currentRoom.id);
    }

    setCurrentRoom(null);
    setCurrentRound(null);
    setIsHost(false);
  }, [currentRoom, isHost]);

  // Subscribe to room changes
  useEffect(() => {
    if (!currentRoom) return;

    const channel = supabase
      .channel(`battle-${currentRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_rooms',
          filter: `id=eq.${currentRoom.id}`,
        },
        (payload) => {
          const data = payload.new as Record<string, unknown>;
          setCurrentRoom(prev => prev ? {
            ...prev,
            status: data.status as BattleRoom['status'],
            opponentId: data.opponent_id as string | null,
            hostScore: (data.host_score as number) || 0,
            opponentScore: (data.opponent_score as number) || 0,
            winnerId: data.winner_id as string | null,
            startedAt: data.started_at ? new Date(data.started_at as string) : null,
            endedAt: data.ended_at ? new Date(data.ended_at as string) : null,
          } : null);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'battle_rounds',
          filter: `room_id=eq.${currentRoom.id}`,
        },
        (payload) => {
          const data = payload.new as Record<string, unknown>;
          const question = data.question as { text: string; options: string[] };
          setCurrentRound({
            id: data.id as string,
            roomId: data.room_id as string,
            roundNumber: data.round_number as number,
            question,
            correctAnswer: data.correct_answer as number,
            hostAnswer: data.host_answer as number | null,
            opponentAnswer: data.opponent_answer as number | null,
            hostTimeMs: data.host_time_ms as number | null,
            opponentTimeMs: data.opponent_time_ms as number | null,
            roundWinner: data.round_winner as 'host' | 'opponent' | 'draw' | null,
          });
          setRoundStartTime(Date.now());
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'battle_rounds',
          filter: `room_id=eq.${currentRoom.id}`,
        },
        (payload) => {
          const data = payload.new as Record<string, unknown>;
          setCurrentRound(prev => {
            if (!prev || prev.id !== data.id) return prev;
            return {
              ...prev,
              hostAnswer: data.host_answer as number | null,
              opponentAnswer: data.opponent_answer as number | null,
              hostTimeMs: data.host_time_ms as number | null,
              opponentTimeMs: data.opponent_time_ms as number | null,
              roundWinner: data.round_winner as 'host' | 'opponent' | 'draw' | null,
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    currentRoom,
    currentRound,
    myStats,
    isHost,
    createRoom,
    joinRoom,
    startNextRound,
    submitAnswer,
    leaveRoom,
    loadStats,
  };
}
