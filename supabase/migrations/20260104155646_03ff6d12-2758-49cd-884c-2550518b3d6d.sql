-- =============================================
-- MULTIPLAYER BATTLES SYSTEM
-- =============================================

-- Battle rooms for matchmaking
CREATE TABLE public.battle_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  game_type TEXT NOT NULL DEFAULT 'quick-fire',
  difficulty INTEGER DEFAULT 5 CHECK (difficulty >= 1 AND difficulty <= 10),
  total_rounds INTEGER DEFAULT 5 CHECK (total_rounds >= 1 AND total_rounds <= 20),
  host_score INTEGER DEFAULT 0 CHECK (host_score >= 0),
  opponent_score INTEGER DEFAULT 0 CHECK (opponent_score >= 0),
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Battle rounds with questions
CREATE TABLE public.battle_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.battle_rooms(id) ON DELETE CASCADE NOT NULL,
  round_number INTEGER NOT NULL CHECK (round_number >= 1),
  question JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  host_answer INTEGER,
  opponent_answer INTEGER,
  host_time_ms INTEGER CHECK (host_time_ms IS NULL OR host_time_ms >= 0),
  opponent_time_ms INTEGER CHECK (opponent_time_ms IS NULL OR opponent_time_ms >= 0),
  round_winner TEXT CHECK (round_winner IS NULL OR round_winner IN ('host', 'opponent', 'draw')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, round_number)
);

-- Battle stats for ranking
CREATE TABLE public.battle_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  wins INTEGER DEFAULT 0 CHECK (wins >= 0),
  losses INTEGER DEFAULT 0 CHECK (losses >= 0),
  draws INTEGER DEFAULT 0 CHECK (draws >= 0),
  rating INTEGER DEFAULT 1000 CHECK (rating >= 0 AND rating <= 5000),
  current_win_streak INTEGER DEFAULT 0 CHECK (current_win_streak >= 0),
  best_win_streak INTEGER DEFAULT 0 CHECK (best_win_streak >= 0),
  total_rounds_won INTEGER DEFAULT 0 CHECK (total_rounds_won >= 0),
  avg_answer_time_ms INTEGER CHECK (avg_answer_time_ms IS NULL OR avg_answer_time_ms >= 0),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- AI TUTOR CHAT SYSTEM
-- =============================================

-- Tutor conversations
CREATE TABLE public.tutor_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Chat',
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tutor messages
CREATE TABLE public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.tutor_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- LIVE CODE EDITOR SYSTEM
-- =============================================

-- User code projects
CREATE TABLE public.code_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  code TEXT NOT NULL DEFAULT '',
  language TEXT DEFAULT 'java' CHECK (language IN ('java', 'python', 'javascript')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Coding challenges
CREATE TABLE public.code_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT,
  expected_output TEXT,
  test_cases JSONB,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  category TEXT,
  hints JSONB,
  xp_reward INTEGER DEFAULT 50 CHECK (xp_reward >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User challenge completions
CREATE TABLE public.challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.code_challenges(id) ON DELETE CASCADE NOT NULL,
  user_code TEXT NOT NULL,
  passed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 1 CHECK (attempts >= 1),
  best_time_ms INTEGER CHECK (best_time_ms IS NULL OR best_time_ms >= 0),
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- =============================================
-- ENABLE RLS ON ALL NEW TABLES
-- =============================================

ALTER TABLE public.battle_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - BATTLE ROOMS
-- =============================================

CREATE POLICY "Users can view rooms they're in"
  ON public.battle_rooms FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = opponent_id OR status = 'waiting');

CREATE POLICY "Users can create battle rooms"
  ON public.battle_rooms FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Participants can update their room"
  ON public.battle_rooms FOR UPDATE
  USING (auth.uid() = host_id OR auth.uid() = opponent_id);

-- =============================================
-- RLS POLICIES - BATTLE ROUNDS
-- =============================================

CREATE POLICY "Participants can view battle rounds"
  ON public.battle_rounds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.battle_rooms 
      WHERE id = battle_rounds.room_id 
      AND (host_id = auth.uid() OR opponent_id = auth.uid())
    )
  );

CREATE POLICY "System can create rounds"
  ON public.battle_rounds FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.battle_rooms 
      WHERE id = battle_rounds.room_id 
      AND host_id = auth.uid()
    )
  );

CREATE POLICY "Participants can update rounds"
  ON public.battle_rounds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.battle_rooms 
      WHERE id = battle_rounds.room_id 
      AND (host_id = auth.uid() OR opponent_id = auth.uid())
    )
  );

-- =============================================
-- RLS POLICIES - BATTLE STATS
-- =============================================

CREATE POLICY "Anyone can view battle stats"
  ON public.battle_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own stats"
  ON public.battle_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.battle_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - TUTOR CONVERSATIONS
-- =============================================

CREATE POLICY "Users can view their own conversations"
  ON public.tutor_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.tutor_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.tutor_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.tutor_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - TUTOR MESSAGES
-- =============================================

CREATE POLICY "Users can view messages in their conversations"
  ON public.tutor_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutor_conversations 
      WHERE id = tutor_messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON public.tutor_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tutor_conversations 
      WHERE id = tutor_messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- RLS POLICIES - CODE PROJECTS
-- =============================================

CREATE POLICY "Users can view their own or public projects"
  ON public.code_projects FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own projects"
  ON public.code_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.code_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.code_projects FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - CODE CHALLENGES
-- =============================================

CREATE POLICY "Anyone can view challenges"
  ON public.code_challenges FOR SELECT
  USING (true);

-- =============================================
-- RLS POLICIES - CHALLENGE COMPLETIONS
-- =============================================

CREATE POLICY "Users can view their own completions"
  ON public.challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
  ON public.challenge_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions"
  ON public.challenge_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- ENABLE REALTIME FOR BATTLE TABLES
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_rounds;

-- =============================================
-- SEED CODE CHALLENGES
-- =============================================

INSERT INTO public.code_challenges (title, description, starter_code, expected_output, difficulty, category, xp_reward, hints) VALUES
('Hello World', 'Write a program that prints "Hello, World!" to the console.', 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}', 'Hello, World!', 1, 'basics', 25, '["Use System.out.println() to print text", "Don''t forget the comma and exclamation mark!"]'),
('Sum of Two Numbers', 'Write a program that calculates and prints the sum of 5 and 3.', 'public class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 3;\n        // Calculate and print the sum\n        \n    }\n}', '8', 1, 'basics', 30, '["Add the two numbers using the + operator", "Print the result using System.out.println()"]'),
('Even or Odd', 'Write a program that checks if the number 7 is even or odd, and prints "Even" or "Odd".', 'public class Main {\n    public static void main(String[] args) {\n        int number = 7;\n        // Check if even or odd and print result\n        \n    }\n}', 'Odd', 2, 'conditionals', 40, '["Use the modulo operator % to check divisibility by 2", "If number % 2 == 0, it''s even"]'),
('FizzBuzz Single', 'For the number 15: print "FizzBuzz" if divisible by both 3 and 5, "Fizz" if by 3, "Buzz" if by 5, or the number itself.', 'public class Main {\n    public static void main(String[] args) {\n        int n = 15;\n        // Your FizzBuzz logic here\n        \n    }\n}', 'FizzBuzz', 2, 'conditionals', 50, '["Check divisibility by both 3 AND 5 first", "Use && for AND logic"]'),
('Factorial', 'Calculate and print the factorial of 5 (5! = 5 × 4 × 3 × 2 × 1).', 'public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        int factorial = 1;\n        // Calculate factorial\n        \n        System.out.println(factorial);\n    }\n}', '120', 3, 'loops', 60, '["Use a for loop from 1 to n", "Multiply factorial by each number in the loop"]'),
('Reverse String', 'Write a program that reverses the string "Hello" and prints the result.', 'public class Main {\n    public static void main(String[] args) {\n        String str = "Hello";\n        // Reverse and print the string\n        \n    }\n}', 'olleH', 3, 'strings', 70, '["You can use StringBuilder and its reverse() method", "Or loop through the string backwards"]'),
('Find Maximum', 'Find and print the maximum value in the array {3, 7, 2, 9, 5}.', 'public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {3, 7, 2, 9, 5};\n        // Find and print the maximum\n        \n    }\n}', '9', 3, 'arrays', 65, '["Start with the first element as max", "Compare each element and update max if larger"]'),
('Count Vowels', 'Count and print the number of vowels in "Programming".', 'public class Main {\n    public static void main(String[] args) {\n        String word = "Programming";\n        // Count and print vowels\n        \n    }\n}', '3', 4, 'strings', 80, '["Loop through each character", "Check if it matches a, e, i, o, u (case insensitive)"]'),
('Prime Check', 'Check if 17 is a prime number and print "Prime" or "Not Prime".', 'public class Main {\n    public static void main(String[] args) {\n        int n = 17;\n        // Check if prime\n        \n    }\n}', 'Prime', 4, 'algorithms', 90, '["A prime has no divisors other than 1 and itself", "Only need to check up to sqrt(n)"]'),
('Fibonacci', 'Print the 10th number in the Fibonacci sequence (starting from 0, 1).', 'public class Main {\n    public static void main(String[] args) {\n        // Calculate and print the 10th Fibonacci number\n        // Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...\n        \n    }\n}', '34', 5, 'algorithms', 100, '["Each number is the sum of the two before it", "Use variables to track the last two numbers"]');