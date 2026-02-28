
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view battle stats" ON public.battle_stats;

-- Users can only view their own battle stats
CREATE POLICY "Users can view own battle stats"
ON public.battle_stats FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a view for the public leaderboard that only exposes aggregate data (no user_id)
CREATE OR REPLACE VIEW public.battle_leaderboard
WITH (security_invoker = on) AS
SELECT 
  bs.id,
  bs.wins,
  bs.losses,
  bs.draws,
  bs.rating,
  bs.current_win_streak,
  bs.best_win_streak,
  p.display_name
FROM public.battle_stats bs
JOIN public.profiles p ON p.id = bs.user_id
ORDER BY bs.rating DESC
LIMIT 50;
