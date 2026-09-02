import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SkillLevel, calculateAutomationScore, determineLevel } from '@/data/learningSystem';

export interface SkillMasteryData {
  id: string;
  user_id: string;
  skill_id: string;
  skill_name: string;
  category: string;
  level: SkillLevel;
  automation_score: number;
  accuracy: number;
  avg_speed: number;
  total_attempts: number;
  correct_attempts: number;
  streak_days: number;
  last_practiced: string | null;
}

// SM-2 Algorithm implementation
export function calculateSM2(
  quality: number, // 0-5 rating (0=complete failure, 5=perfect)
  easeFactor: number,
  interval: number,
  repetitions: number
): { easeFactor: number; interval: number; repetitions: number } {
  // Quality < 3 means the response was incorrect or forgotten
  if (quality < 3) {
    return {
      easeFactor: easeFactor,
      interval: 1,
      repetitions: 0
    };
  }

  // Calculate new ease factor
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate new interval
  let newInterval: number;
  if (repetitions === 0) {
    newInterval = 1;
  } else if (repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: repetitions + 1
  };
}

export function useSkillMastery() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillMasteryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    if (!user) {
      setSkills([]);
      setLoading(false);
      return;
    }
    
    try {
      // Use raw query since table may not be in generated types yet
      const { data, error } = await (supabase as any)
        .from('skill_mastery')
        .select('*')
        .eq('user_id', user.id)
        .order('automation_score', { ascending: false });

      if (!error && data) {
        setSkills(data as SkillMasteryData[]);
      }
    } catch (e) {
      console.log('Skill mastery table may not exist yet');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const updateSkillMastery = useCallback(async (
    skillId: string,
    skillName: string,
    category: string,
    isCorrect: boolean,
    responseTime: number,
    hintsUsed: number = 0
  ) => {
    if (!user) return;

    try {
      // Get current skill data
      const { data: existing } = await (supabase as any)
        .from('skill_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();

      const currentData = existing as SkillMasteryData | null;
      
      const newTotalAttempts = (currentData?.total_attempts || 0) + 1;
      const newCorrectAttempts = (currentData?.correct_attempts || 0) + (isCorrect ? 1 : 0);
      const newAccuracy = (newCorrectAttempts / newTotalAttempts) * 100;
      
      // Calculate rolling average speed
      const prevAvgSpeed = currentData?.avg_speed || responseTime;
      const newAvgSpeed = (prevAvgSpeed * (newTotalAttempts - 1) + responseTime) / newTotalAttempts;
      
      // Calculate automation score
      const automationScore = calculateAutomationScore(
        newAccuracy,
        newAvgSpeed,
        hintsUsed,
        newTotalAttempts,
        10 // target speed in seconds
      );

      // Determine level based on mastery
      const mastery = {
        skillId,
        name: skillName,
        category,
        level: currentData?.level as SkillLevel || 'novice',
        automationScore,
        accuracy: newAccuracy,
        avgSpeed: newAvgSpeed,
        lastPracticed: new Date(),
        totalAttempts: newTotalAttempts,
        correctAttempts: newCorrectAttempts,
        streakDays: currentData?.streak_days || 0
      };
      
      const newLevel = determineLevel(mastery);

      const updateData = {
        user_id: user.id,
        skill_id: skillId,
        skill_name: skillName,
        category,
        level: newLevel,
        automation_score: automationScore,
        accuracy: newAccuracy,
        avg_speed: newAvgSpeed,
        total_attempts: newTotalAttempts,
        correct_attempts: newCorrectAttempts,
        last_practiced: new Date().toISOString()
      };

      if (currentData) {
        await (supabase as any)
          .from('skill_mastery')
          .update(updateData)
          .eq('id', currentData.id);
      } else {
        await (supabase as any)
          .from('skill_mastery')
          .insert(updateData);
      }

      fetchSkills();
    } catch (e) {
      console.log('Error updating skill mastery:', e);
    }
  }, [user, fetchSkills]);

  return { skills, loading, updateSkillMastery, refetch: fetchSkills };
}

export function useSpacedRepetition() {
  const { user } = useAuth();
  const [dueItems, setDueItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDueItems = useCallback(async () => {
    if (!user) {
      setDueItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('spaced_repetition')
      .select('*')
      .eq('user_id', user.id)
      .lte('next_review_at', new Date().toISOString())
      .order('next_review_at', { ascending: true });

    if (!error && data) {
      setDueItems(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDueItems();
  }, [fetchDueItems]);

  const recordReview = useCallback(async (
    questionId: string,
    lessonId: string | null,
    quality: number // 0-5 SM-2 quality rating
  ) => {
    if (!user) return;

    // Get existing data. The current schema stores interval/ease but not a
    // repetition counter, so infer the SM-2 phase from the persisted interval:
    // 1 day = first successful repetition; 6+ days = mature repetition.
    const { data: existing } = await supabase
      .from('spaced_repetition')
      .select('*')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .maybeSingle();

    const currentEaseFactor = existing?.ease_factor || 2.5;
    const currentInterval = existing?.interval_days || 1;
    const repetitions = !existing ? 0 : currentInterval <= 1 ? 1 : 2;

    // Apply SM-2 algorithm: 1 day -> 6 days -> expanding adaptive intervals.
    const { easeFactor, interval } = calculateSM2(
      quality,
      currentEaseFactor,
      currentInterval,
      repetitions
    );

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const updateData = {
      user_id: user.id,
      question_id: questionId,
      lesson_id: lessonId,
      ease_factor: easeFactor,
      interval_days: interval,
      next_review_at: nextReviewDate.toISOString()
    };

    if (existing) {
      await supabase
        .from('spaced_repetition')
        .update(updateData)
        .eq('id', existing.id);
    } else {
      await supabase
        .from('spaced_repetition')
        .insert(updateData);
    }

    fetchDueItems();
  }, [user, fetchDueItems]);

  return { dueItems, loading, recordReview, refetch: fetchDueItems };
}

export function useDailyActivity() {
  const { user } = useAuth();

  const recordActivity = useCallback(async (
    gamesPlayed: number = 0,
    lessonsCompleted: number = 0,
    xpEarned: number = 0,
    timeSpent: number = 0,
    skillsPracticed: string[] = []
  ) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Get existing activity for today
      const { data: existing } = await (supabase as any)
        .from('daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      if (existing) {
        const existingSkills = existing.skills_practiced || [];
        const mergedSkills = [...new Set([...existingSkills, ...skillsPracticed])];
        
        await (supabase as any)
          .from('daily_activity')
          .update({
            games_played: existing.games_played + gamesPlayed,
            lessons_completed: existing.lessons_completed + lessonsCompleted,
            xp_earned: existing.xp_earned + xpEarned,
            time_spent_minutes: existing.time_spent_minutes + timeSpent,
            skills_practiced: mergedSkills
          })
          .eq('id', existing.id);
      } else {
        await (supabase as any)
          .from('daily_activity')
          .insert({
            user_id: user.id,
            activity_date: today,
            games_played: gamesPlayed,
            lessons_completed: lessonsCompleted,
            xp_earned: xpEarned,
            time_spent_minutes: timeSpent,
            skills_practiced: skillsPracticed
          });
      }
    } catch (e) {
      console.log('Error recording daily activity:', e);
    }
  }, [user]);

  return { recordActivity };
}
