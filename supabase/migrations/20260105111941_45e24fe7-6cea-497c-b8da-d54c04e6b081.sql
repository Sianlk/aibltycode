-- Add spectators table for battle watching
CREATE TABLE IF NOT EXISTS public.battle_spectators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.battle_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable RLS
ALTER TABLE public.battle_spectators ENABLE ROW LEVEL SECURITY;

-- Spectator policies
CREATE POLICY "Anyone can view spectators" 
  ON public.battle_spectators FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join as spectator" 
  ON public.battle_spectators FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave spectating" 
  ON public.battle_spectators FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable realtime for spectators
ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_spectators;

-- Create function to get admin emails
CREATE OR REPLACE FUNCTION public.is_admin_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email = 'hosturserver@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure hosturserver@gmail.com gets admin role on sign up
CREATE OR REPLACE FUNCTION public.handle_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'hosturserver@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add existing_user flag to subscriptions for grandfathering
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS is_grandfathered BOOLEAN DEFAULT false;

-- Add spectator_count column to battle_rooms for performance
ALTER TABLE public.battle_rooms ADD COLUMN IF NOT EXISTS spectator_count INTEGER DEFAULT 0;

-- Function to update spectator count
CREATE OR REPLACE FUNCTION public.update_spectator_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.battle_rooms SET spectator_count = spectator_count + 1 WHERE id = NEW.room_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.battle_rooms SET spectator_count = spectator_count - 1 WHERE id = OLD.room_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update spectator count
DROP TRIGGER IF EXISTS update_spectator_count_trigger ON public.battle_spectators;
CREATE TRIGGER update_spectator_count_trigger
AFTER INSERT OR DELETE ON public.battle_spectators
FOR EACH ROW EXECUTE FUNCTION public.update_spectator_count();