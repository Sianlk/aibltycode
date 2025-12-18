import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProgress {
  lessonId: string;
  moduleId: string;
  completed: boolean;
  score: number;
  attempts: number;
}

interface GameScore {
  gameType: string;
  score: number;
  timeTaken?: number;
  accuracy?: number;
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user progress
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Fetch progress error:', error);
        throw error;
      }

      setProgress(data?.map((p: any) => ({
        lessonId: p.lesson_key || '',
        moduleId: p.module_key || '',
        completed: p.completed || false,
        score: p.score || 0,
        attempts: p.attempts || 0,
      })) || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Complete a lesson
  const completeLesson = useCallback(async (moduleId: string, lessonId: string, score: number = 100) => {
    if (!user) {
      toast.error('Please sign in to save progress');
      return;
    }

    try {
      // Check if progress exists
      const { data: existing, error: fetchError } = await supabase
        .from('user_progress')
        .select('id, attempts, score')
        .eq('user_id', user.id)
        .eq('lesson_key', lessonId)
        .maybeSingle();

      if (fetchError) {
        console.error('Check existing error:', fetchError);
      }

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('user_progress')
          .update({
            completed: true,
            score: Math.max(existing.score || 0, score),
            attempts: (existing.attempts || 0) + 1,
            completed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Insert new progress - cast to any to bypass strict typing for new columns
        const insertData = {
          user_id: user.id,
          lesson_key: lessonId,
          module_key: moduleId,
          completed: true,
          score,
          attempts: 1,
          completed_at: new Date().toISOString(),
        } as any;
        
        result = await supabase
          .from('user_progress')
          .insert(insertData);
      }

      if (result.error) {
        console.error('Save progress error:', result.error);
        toast.error('Failed to save progress');
        return;
      }

      // Update profile XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp: (profile.xp || 0) + Math.floor(score / 10) })
          .eq('id', user.id);
      }

      // Update leaderboard
      const { data: leaderboard } = await supabase
        .from('leaderboard')
        .select('total_xp, lessons_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (leaderboard) {
        await supabase
          .from('leaderboard')
          .update({
            total_xp: (leaderboard.total_xp || 0) + Math.floor(score / 10),
            lessons_completed: (leaderboard.lessons_completed || 0) + (existing ? 0 : 1),
          })
          .eq('user_id', user.id);
      }

      toast.success('Progress saved!');
      await fetchProgress();
    } catch (err) {
      console.error('Error saving progress:', err);
      toast.error('Failed to save progress');
    }
  }, [user, fetchProgress]);

  // Save game score
  const saveGameScore = useCallback(async (gameScore: GameScore) => {
    if (!user) return;

    try {
      await supabase
        .from('game_scores')
        .insert({
          user_id: user.id,
          game_type: gameScore.gameType,
          score: gameScore.score,
          time_taken: gameScore.timeTaken,
          accuracy: gameScore.accuracy,
        });

      // Update leaderboard games played
      const { data: leaderboard } = await supabase
        .from('leaderboard')
        .select('games_played, total_xp')
        .eq('user_id', user.id)
        .maybeSingle();

      if (leaderboard) {
        await supabase
          .from('leaderboard')
          .update({
            games_played: (leaderboard.games_played || 0) + 1,
            total_xp: (leaderboard.total_xp || 0) + Math.floor(gameScore.score / 5),
          })
          .eq('user_id', user.id);
      }
    } catch (err) {
      console.error('Error saving game score:', err);
    }
  }, [user]);

  // Check if lesson is completed
  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  }, [progress]);

  // Get module progress percentage
  const getModuleProgress = useCallback((moduleId: string, totalLessons: number) => {
    const completed = progress.filter(p => p.moduleId === moduleId && p.completed).length;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }, [progress]);

  return {
    progress,
    loading,
    completeLesson,
    saveGameScore,
    isLessonCompleted,
    getModuleProgress,
    refetch: fetchProgress,
  };
}
