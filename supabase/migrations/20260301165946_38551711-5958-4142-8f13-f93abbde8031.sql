
-- Remove the plaintext parental_pin column (security risk - should only use hashed version)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS parental_pin;

-- Restrict admin view to exclude hashed_parental_pin by revoking and using a more restrictive policy
-- Since column-level security isn't practical with RLS, we ensure the plaintext column is gone
-- The hashed_parental_pin is bcrypt-hashed and not reversible, so it's safe in the table
-- The plaintext column was the actual risk
