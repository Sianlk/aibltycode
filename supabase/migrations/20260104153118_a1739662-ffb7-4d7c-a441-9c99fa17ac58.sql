-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add hashed PIN column to profiles (keep old column temporarily for migration)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hashed_parental_pin TEXT;

-- Create table to track parental unlock attempts (rate limiting)
CREATE TABLE IF NOT EXISTS public.parental_unlock_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on unlock log
ALTER TABLE public.parental_unlock_log ENABLE ROW LEVEL SECURITY;

-- Only allow users to insert their own attempts
CREATE POLICY "Users can insert own unlock attempts" ON public.parental_unlock_log
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own attempts
CREATE POLICY "Users can view own unlock attempts" ON public.parental_unlock_log
FOR SELECT USING (auth.uid() = user_id);

-- Create function to set parental PIN (hashes the PIN server-side)
CREATE OR REPLACE FUNCTION public.set_parental_pin(pin_value TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the authenticated user ID
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Validate PIN length (4-6 digits)
  IF LENGTH(pin_value) < 4 OR LENGTH(pin_value) > 6 OR pin_value !~ '^[0-9]+$' THEN
    RAISE EXCEPTION 'PIN must be 4-6 digits';
  END IF;
  
  -- Hash the PIN and store it
  UPDATE public.profiles
  SET hashed_parental_pin = crypt(pin_value, gen_salt('bf', 8)),
      parental_pin = NULL  -- Clear plaintext PIN
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;

-- Create function to verify parental PIN with rate limiting
CREATE OR REPLACE FUNCTION public.verify_parental_pin(pin_attempt TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  stored_hash TEXT;
  recent_attempts INTEGER;
  is_valid BOOLEAN;
BEGIN
  -- Get the authenticated user ID
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Rate limiting: check for too many recent failed attempts (max 5 per 15 minutes)
  SELECT COUNT(*) INTO recent_attempts
  FROM public.parental_unlock_log
  WHERE user_id = user_uuid
    AND attempted_at > NOW() - INTERVAL '15 minutes'
    AND success = false;
  
  IF recent_attempts >= 5 THEN
    -- Log the blocked attempt
    INSERT INTO public.parental_unlock_log (user_id, success) VALUES (user_uuid, false);
    RAISE EXCEPTION 'Too many failed attempts. Please wait 15 minutes.';
  END IF;
  
  -- Get the stored hash
  SELECT hashed_parental_pin INTO stored_hash
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- Check if PIN is set
  IF stored_hash IS NULL THEN
    RAISE EXCEPTION 'Parental PIN not set';
  END IF;
  
  -- Verify the PIN
  is_valid := (crypt(pin_attempt, stored_hash) = stored_hash);
  
  -- Log the attempt
  INSERT INTO public.parental_unlock_log (user_id, success) VALUES (user_uuid, is_valid);
  
  RETURN is_valid;
END;
$$;

-- Create function to check if parental PIN is configured
CREATE OR REPLACE FUNCTION public.has_parental_pin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  has_pin BOOLEAN;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT (hashed_parental_pin IS NOT NULL) INTO has_pin
  FROM public.profiles
  WHERE id = user_uuid;
  
  RETURN COALESCE(has_pin, false);
END;
$$;

-- Create function to clear parental PIN
CREATE OR REPLACE FUNCTION public.clear_parental_pin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  UPDATE public.profiles
  SET hashed_parental_pin = NULL,
      parental_pin = NULL
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;