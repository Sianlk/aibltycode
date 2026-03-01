
-- Fix SECURITY DEFINER view issue - recreate with security_invoker
DROP VIEW IF EXISTS public.code_challenges_public;

CREATE VIEW public.code_challenges_public
WITH (security_invoker = true) AS
SELECT id, title, description, starter_code, expected_output, test_cases,
       difficulty, category, hints, xp_reward, created_at
FROM public.code_challenges;

GRANT SELECT ON public.code_challenges_public TO authenticated;
GRANT SELECT ON public.code_challenges_public TO anon;

-- Since view uses security_invoker, users need SELECT on base table
-- Add back a limited SELECT policy for authenticated users
CREATE POLICY "Authenticated users can view challenges"
  ON public.code_challenges FOR SELECT TO authenticated
  USING (true);
