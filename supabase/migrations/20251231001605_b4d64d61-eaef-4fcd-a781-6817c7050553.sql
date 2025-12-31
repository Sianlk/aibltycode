-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add index for spaced_repetition performance  
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_next_review ON public.spaced_repetition(user_id, next_review_at);