
-- Remove the permissive SELECT that lets users read solution_code directly
DROP POLICY IF EXISTS "Authenticated users can view challenges" ON public.code_challenges;

-- Recreate the view as SECURITY DEFINER so it doesn't need base table access
-- This is intentional: the view restricts which columns are visible
DROP VIEW IF EXISTS public.code_challenges_public;

CREATE VIEW public.code_challenges_public AS
SELECT id, title, description, starter_code, expected_output, test_cases,
       difficulty, category, hints, xp_reward, created_at
FROM public.code_challenges;

GRANT SELECT ON public.code_challenges_public TO authenticated;
GRANT SELECT ON public.code_challenges_public TO anon;
