
-- Drop the security definer view (linter flagged)
DROP VIEW IF EXISTS public.code_challenges_public;

-- Add back SELECT for authenticated users (needed for the app to work)
-- solution_code will be excluded at the application level
CREATE POLICY "Anyone can view challenges"
  ON public.code_challenges FOR SELECT TO authenticated
  USING (true);
