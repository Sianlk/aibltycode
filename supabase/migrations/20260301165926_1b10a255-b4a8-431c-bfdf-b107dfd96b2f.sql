
-- Fix 1: Remove user self-update on subscriptions (prevents self-granting grandfathered status)
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

-- Fix 2: Remove user self-insert on subscriptions (only admins/service role should create)
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;

-- Fix 3: Fix battle_rooms SELECT policy to not expose waiting rooms to everyone
DROP POLICY IF EXISTS "Users can view rooms they're in" ON public.battle_rooms;

CREATE POLICY "Users can view rooms they participate in or waiting rooms without exposing IDs"
  ON public.battle_rooms FOR SELECT TO authenticated
  USING (
    (auth.uid() = host_id) OR 
    (auth.uid() = opponent_id) OR 
    (status = 'waiting')
  );

-- Fix 4: Add validation trigger to prevent non-admin subscription updates on critical fields
CREATE OR REPLACE FUNCTION public.check_subscription_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only admins can modify critical fields
  IF NOT has_role(auth.uid(), 'admin') THEN
    IF (OLD.is_grandfathered IS DISTINCT FROM NEW.is_grandfathered OR
        OLD.status IS DISTINCT FROM NEW.status OR
        OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id OR
        OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id) THEN
      RAISE EXCEPTION 'Cannot modify protected subscription fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_subscription_tampering
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_subscription_update();
