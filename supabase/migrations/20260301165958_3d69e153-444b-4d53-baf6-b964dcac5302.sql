
-- Update clear_parental_pin to remove reference to dropped parental_pin column
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
  
  UPDATE public.profiles
  SET hashed_parental_pin = NULL
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;

-- Update set_parental_pin to remove reference to dropped parental_pin column
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
  
  UPDATE public.profiles
  SET hashed_parental_pin = crypt(pin_value, gen_salt('bf', 8))
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;
