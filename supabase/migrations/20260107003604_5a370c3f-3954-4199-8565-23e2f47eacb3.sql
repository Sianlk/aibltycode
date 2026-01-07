-- Avatar customization system
CREATE TABLE public.avatar_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL, -- 'head', 'body', 'accessory', 'background', 'effect'
    name text NOT NULL,
    icon text,
    rarity text DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    unlock_requirement text, -- 'xp:1000', 'achievement:first_win', 'purchase'
    xp_cost integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.avatar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view avatar items" ON public.avatar_items
FOR SELECT USING (true);

-- User unlocked avatar items
CREATE TABLE public.user_avatar_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES public.avatar_items(id) ON DELETE CASCADE,
    unlocked_at timestamptz DEFAULT now(),
    UNIQUE(user_id, item_id)
);

ALTER TABLE public.user_avatar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own avatar items" ON public.user_avatar_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock avatar items" ON public.user_avatar_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User avatar configuration
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_config jsonb DEFAULT '{}';

-- Daily/Weekly challenges table
CREATE TABLE public.challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text NOT NULL, -- 'daily', 'weekly', 'event'
    reward_xp integer DEFAULT 50,
    reward_item_id uuid REFERENCES public.avatar_items(id),
    requirements jsonb DEFAULT '{}', -- e.g. {"games_played": 3, "game_type": "pattern"}
    active_from timestamptz DEFAULT now(),
    active_until timestamptz,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges" ON public.challenges
FOR SELECT USING (
    (active_from IS NULL OR active_from <= now()) 
    AND (active_until IS NULL OR active_until >= now())
);

CREATE POLICY "Admins can manage challenges" ON public.challenges
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User challenge completions
CREATE TABLE public.challenge_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    progress jsonb DEFAULT '{}',
    completed boolean DEFAULT false,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge progress" ON public.challenge_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress" ON public.challenge_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own challenge progress" ON public.challenge_progress
FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;

-- Insert default avatar items
INSERT INTO public.avatar_items (category, name, icon, rarity, unlock_requirement, xp_cost) VALUES
('head', 'Default Hat', '🎩', 'common', NULL, 0),
('head', 'Crown', '👑', 'legendary', 'xp:5000', 5000),
('head', 'Halo', '😇', 'epic', 'xp:3000', 3000),
('head', 'Ninja Mask', '🥷', 'rare', 'xp:1500', 1500),
('head', 'Wizard Hat', '🧙', 'epic', 'achievement:spell_master', 0),
('body', 'Robot', '🤖', 'rare', 'xp:2000', 2000),
('body', 'Astronaut', '👨‍🚀', 'epic', 'xp:4000', 4000),
('body', 'Knight', '🛡️', 'legendary', 'achievement:battle_champion', 0),
('accessory', 'Star', '⭐', 'common', NULL, 0),
('accessory', 'Lightning', '⚡', 'rare', 'xp:1000', 1000),
('accessory', 'Fire', '🔥', 'epic', 'achievement:streak_master', 0),
('background', 'Space', '🌌', 'rare', 'xp:2500', 2500),
('background', 'Forest', '🌲', 'common', 'xp:500', 500),
('background', 'Sunset', '🌅', 'epic', 'xp:3500', 3500),
('effect', 'Sparkles', '✨', 'rare', 'xp:1500', 1500),
('effect', 'Rainbow', '🌈', 'legendary', 'achievement:colorful', 0);

-- Insert sample daily challenges
INSERT INTO public.challenges (title, description, type, reward_xp, requirements, active_from, active_until) VALUES
('Pattern Pro', 'Complete 3 Pattern Recognition games', 'daily', 100, '{"games_played": 3, "game_type": "pattern"}', now(), now() + interval '1 day'),
('Speed Demon', 'Score 500+ in Speed Challenge', 'daily', 150, '{"min_score": 500, "game_type": "speed"}', now(), now() + interval '1 day'),
('Code Warrior', 'Win 2 multiplayer battles', 'daily', 200, '{"battles_won": 2}', now(), now() + interval '1 day'),
('Weekly Champion', 'Earn 1000 XP this week', 'weekly', 500, '{"xp_earned": 1000}', now(), now() + interval '7 days'),
('Marathon Coder', 'Complete 20 lessons this week', 'weekly', 750, '{"lessons_completed": 20}', now(), now() + interval '7 days');
