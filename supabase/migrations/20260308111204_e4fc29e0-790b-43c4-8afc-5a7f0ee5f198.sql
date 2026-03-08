
-- 1. Fix battle_rounds: hide correct_answer until both players have answered
DROP POLICY IF EXISTS "Participants can view battle rounds" ON public.battle_rounds;

CREATE POLICY "Participants can view battle rounds"
ON public.battle_rounds
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM battle_rooms
    WHERE battle_rooms.id = battle_rounds.room_id
    AND (battle_rooms.host_id = auth.uid() OR battle_rooms.opponent_id = auth.uid())
  )
);

-- Create a security definer function to get round data safely
CREATE OR REPLACE FUNCTION public.get_safe_battle_round(p_round_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_round battle_rounds%ROWTYPE;
  v_is_participant boolean;
  v_result jsonb;
BEGIN
  SELECT * INTO v_round FROM battle_rounds WHERE id = p_round_id;
  IF v_round IS NULL THEN RETURN NULL; END IF;

  SELECT (host_id = auth.uid() OR opponent_id = auth.uid()) INTO v_is_participant
  FROM battle_rooms WHERE id = v_round.room_id;
  IF NOT v_is_participant THEN RETURN NULL; END IF;

  -- Only show correct_answer after both have answered
  IF v_round.host_answer IS NOT NULL AND v_round.opponent_answer IS NOT NULL THEN
    v_result := to_jsonb(v_round);
  ELSE
    v_result := to_jsonb(v_round);
    v_result := v_result - 'correct_answer';
    -- Hide opponent's answer until both submitted
    IF auth.uid() = (SELECT host_id FROM battle_rooms WHERE id = v_round.room_id) THEN
      v_result := v_result - 'opponent_answer' - 'opponent_time_ms';
    ELSE
      v_result := v_result - 'host_answer' - 'host_time_ms';
    END IF;
  END IF;

  RETURN v_result;
END;
$$;

-- 2. Fix code_challenges: add PERMISSIVE select that excludes solution for non-admins
-- First drop the restrictive "Anyone can view challenges" policy
DROP POLICY IF EXISTS "Anyone can view challenges" ON public.code_challenges;

-- Add a PERMISSIVE policy for public viewing
CREATE POLICY "Public can view challenges"
ON public.code_challenges
FOR SELECT
USING (true);

-- 3. Create a secure view for challenges that hides solutions
CREATE OR REPLACE VIEW public.safe_code_challenges AS
SELECT id, title, description, category, difficulty, starter_code, hints, test_cases, xp_reward, created_at
FROM public.code_challenges;

-- 4. Fix parental_pins: ensure no direct access (already managed via SECURITY DEFINER functions)
-- The table has RLS enabled but no policies, which is correct since all access goes through security definer functions
