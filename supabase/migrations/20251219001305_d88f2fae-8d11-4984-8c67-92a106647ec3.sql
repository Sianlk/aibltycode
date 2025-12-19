-- Fix security issues: Add missing RLS policies

-- Add INSERT policy for profiles (for onboarding)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Add INSERT policy for leaderboard
CREATE POLICY "Users can insert their own leaderboard entry"
ON public.leaderboard
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy for user_progress (reset progress)
CREATE POLICY "Users can delete their own progress"
ON public.user_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Add DELETE policy for spaced_repetition (reset learning data)
CREATE POLICY "Users can delete their own spaced repetition data"
ON public.spaced_repetition
FOR DELETE
USING (auth.uid() = user_id);