-- Add lesson_key column for string-based lesson identification
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS lesson_key TEXT;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_key ON public.user_progress(user_id, lesson_key);

-- Add module_key column for string-based module identification  
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS module_key TEXT;