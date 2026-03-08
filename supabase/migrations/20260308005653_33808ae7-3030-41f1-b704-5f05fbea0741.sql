
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_count INTEGER;
  user_mode TEXT;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Get mode from signup metadata (defaults to 'pro' for adults)
  user_mode := COALESCE(NEW.raw_user_meta_data ->> 'mode', 'pro');
  
  INSERT INTO public.profiles (id, display_name, mode)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', user_mode);
  
  -- First user becomes admin, others are regular users
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  INSERT INTO public.leaderboard (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;
