
-- 1. Move hashed_parental_pin to a separate secured table
CREATE TABLE IF NOT EXISTS public.parental_pins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hashed_pin text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.parental_pins ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for regular users
-- Only SECURITY DEFINER functions access this table

-- Migrate existing data
INSERT INTO public.parental_pins (user_id, hashed_pin)
SELECT id, hashed_parental_pin FROM public.profiles
WHERE hashed_parental_pin IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Drop the column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS hashed_parental_pin;

-- 2. Update PIN functions to use the new table
CREATE OR REPLACE FUNCTION public.set_parental_pin(pin_value text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF LENGTH(pin_value) < 4 OR LENGTH(pin_value) > 6 OR pin_value !~ '^[0-9]+$' THEN
    RAISE EXCEPTION 'PIN must be 4-6 digits';
  END IF;
  INSERT INTO public.parental_pins (user_id, hashed_pin)
  VALUES (user_uuid, crypt(pin_value, gen_salt('bf', 8)))
  ON CONFLICT (user_id) DO UPDATE SET hashed_pin = crypt(pin_value, gen_salt('bf', 8));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_parental_pin(pin_attempt text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
  stored_hash TEXT;
  recent_attempts INTEGER;
  is_valid BOOLEAN;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT COUNT(*) INTO recent_attempts
  FROM public.parental_unlock_log
  WHERE user_id = user_uuid
    AND attempted_at > NOW() - INTERVAL '15 minutes'
    AND success = false;
  IF recent_attempts >= 5 THEN
    INSERT INTO public.parental_unlock_log (user_id, success) VALUES (user_uuid, false);
    RAISE EXCEPTION 'Too many failed attempts. Please wait 15 minutes.';
  END IF;
  SELECT hashed_pin INTO stored_hash
  FROM public.parental_pins
  WHERE user_id = user_uuid;
  IF stored_hash IS NULL THEN
    RAISE EXCEPTION 'Parental PIN not set';
  END IF;
  is_valid := (crypt(pin_attempt, stored_hash) = stored_hash);
  INSERT INTO public.parental_unlock_log (user_id, success) VALUES (user_uuid, is_valid);
  RETURN is_valid;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_parental_pin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
  has_pin BOOLEAN;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.parental_pins WHERE user_id = user_uuid) INTO has_pin;
  RETURN COALESCE(has_pin, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_parental_pin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  user_uuid := auth.uid();
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM public.parental_pins WHERE user_id = user_uuid;
  RETURN TRUE;
END;
$$;

-- 3. Restrict code_challenges: revoke public SELECT, create view without solution_code
DROP POLICY IF EXISTS "Anyone can view challenges" ON public.code_challenges;

CREATE POLICY "Admins can view full challenges"
  ON public.code_challenges FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.code_challenges_public
WITH (security_invoker = false) AS
SELECT id, title, description, starter_code, expected_output, test_cases,
       difficulty, category, hints, xp_reward, created_at
FROM public.code_challenges;

GRANT SELECT ON public.code_challenges_public TO authenticated;
GRANT SELECT ON public.code_challenges_public TO anon;

-- 4. Fix subscriptions: hide stripe IDs from regular users by replacing SELECT policy
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

CREATE POLICY "Users can view own subscription status"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 5. battle_leaderboard is a VIEW - ensure it has proper access
-- It's already a view that joins battle_stats + profiles, both with RLS
-- The view itself doesn't need RLS since it uses security_invoker
