-- First, normalize existing data that violates constraints

-- Cap scores at 100 (bonus scores normalized to max)
UPDATE public.user_progress SET score = 100 WHERE score > 100;

-- Ensure no negative scores
UPDATE public.user_progress SET score = 0 WHERE score < 0;

-- Ensure no negative attempts
UPDATE public.user_progress SET attempts = 0 WHERE attempts < 0;

-- Ensure no negative XP
UPDATE public.profiles SET xp = 0 WHERE xp < 0;

-- Ensure no negative streak days
UPDATE public.profiles SET streak_days = 0 WHERE streak_days < 0;

-- Normalize leaderboard stats
UPDATE public.leaderboard SET total_xp = 0 WHERE total_xp < 0;
UPDATE public.leaderboard SET games_played = 0 WHERE games_played < 0;
UPDATE public.leaderboard SET lessons_completed = 0 WHERE lessons_completed < 0;
UPDATE public.leaderboard SET current_streak = 0 WHERE current_streak < 0;
UPDATE public.leaderboard SET best_streak = 0 WHERE best_streak < 0;

-- Normalize game_scores
UPDATE public.game_scores SET score = 0 WHERE score < 0;
UPDATE public.game_scores SET accuracy = 100 WHERE accuracy > 100;
UPDATE public.game_scores SET accuracy = 0 WHERE accuracy < 0;
UPDATE public.game_scores SET time_taken = 1 WHERE time_taken IS NOT NULL AND time_taken <= 0;

-- Normalize spaced_repetition
UPDATE public.spaced_repetition SET interval_days = 1 WHERE interval_days < 1;
UPDATE public.spaced_repetition SET ease_factor = 2.5 WHERE ease_factor IS NOT NULL AND (ease_factor < 1.0 OR ease_factor > 5.0);

-- Now add the constraints

-- user_progress: Lesson scores should be 0-100
ALTER TABLE public.user_progress 
  ADD CONSTRAINT score_valid_range CHECK (score IS NULL OR (score >= 0 AND score <= 100));

-- user_progress: Attempts should be non-negative
ALTER TABLE public.user_progress 
  ADD CONSTRAINT attempts_non_negative CHECK (attempts IS NULL OR attempts >= 0);

-- profiles: XP should be non-negative and have a reasonable upper limit
ALTER TABLE public.profiles 
  ADD CONSTRAINT xp_non_negative CHECK (xp IS NULL OR (xp >= 0 AND xp <= 10000000));

-- profiles: Streak days should be non-negative
ALTER TABLE public.profiles 
  ADD CONSTRAINT streak_days_non_negative CHECK (streak_days IS NULL OR streak_days >= 0);

-- leaderboard: All stats should be non-negative
ALTER TABLE public.leaderboard 
  ADD CONSTRAINT leaderboard_stats_valid CHECK (
    (total_xp IS NULL OR total_xp >= 0) AND 
    (games_played IS NULL OR games_played >= 0) AND 
    (lessons_completed IS NULL OR lessons_completed >= 0) AND
    (current_streak IS NULL OR current_streak >= 0) AND
    (best_streak IS NULL OR best_streak >= 0)
  );

-- game_scores: Score should be non-negative with reasonable upper limit
ALTER TABLE public.game_scores 
  ADD CONSTRAINT game_score_valid CHECK (score IS NULL OR (score >= 0 AND score <= 100000));

-- game_scores: Accuracy should be 0-100
ALTER TABLE public.game_scores 
  ADD CONSTRAINT accuracy_valid CHECK (accuracy IS NULL OR (accuracy >= 0 AND accuracy <= 100));

-- game_scores: Time taken should be positive when set
ALTER TABLE public.game_scores 
  ADD CONSTRAINT time_positive CHECK (time_taken IS NULL OR time_taken > 0);

-- spaced_repetition: Interval days should be positive
ALTER TABLE public.spaced_repetition 
  ADD CONSTRAINT interval_days_positive CHECK (interval_days IS NULL OR interval_days >= 1);

-- spaced_repetition: Ease factor should be reasonable (typically 1.3-2.5+)
ALTER TABLE public.spaced_repetition 
  ADD CONSTRAINT ease_factor_valid CHECK (ease_factor IS NULL OR (ease_factor >= 1.0 AND ease_factor <= 5.0));