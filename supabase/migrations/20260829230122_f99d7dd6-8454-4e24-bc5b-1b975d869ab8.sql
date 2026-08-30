-- =========================================================
-- 1. battle_rooms: block client tampering with scores/winner/status
-- =========================================================
CREATE OR REPLACE FUNCTION public.guard_battle_room_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(current_setting('app.battle_engine', true), '') = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.host_score IS DISTINCT FROM OLD.host_score
     OR NEW.opponent_score IS DISTINCT FROM OLD.opponent_score
     OR NEW.winner_id IS DISTINCT FROM OLD.winner_id
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.host_id IS DISTINCT FROM OLD.host_id
     OR NEW.ended_at IS DISTINCT FROM OLD.ended_at THEN
    RAISE EXCEPTION 'Scores, winner and status can only be set by the battle engine';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_battle_room_update ON public.battle_rooms;
CREATE TRIGGER guard_battle_room_update
  BEFORE UPDATE ON public.battle_rooms
  FOR EACH ROW EXECUTE FUNCTION public.guard_battle_room_update();

REVOKE EXECUTE ON FUNCTION public.guard_battle_room_update() FROM anon, authenticated;

-- Engine functions mark themselves as trusted
CREATE OR REPLACE FUNCTION public.submit_battle_answer(p_round_id uuid, p_answer integer, p_time_ms integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_room_id uuid; v_is_host boolean; v_correct integer; v_already integer;
BEGIN
  PERFORM set_config('app.battle_engine', 'on', true);
  SELECT room_id, correct_answer INTO v_room_id, v_correct FROM battle_rounds WHERE id = p_round_id;
  IF v_room_id IS NULL THEN RAISE EXCEPTION 'Round not found'; END IF;

  SELECT (host_id = auth.uid()) INTO v_is_host FROM battle_rooms
   WHERE id = v_room_id AND (host_id = auth.uid() OR opponent_id = auth.uid());
  IF v_is_host IS NULL THEN RAISE EXCEPTION 'Not a participant'; END IF;

  IF v_is_host THEN
    SELECT host_answer INTO v_already FROM battle_rounds WHERE id = p_round_id;
    IF v_already IS NOT NULL THEN RETURN; END IF;
    UPDATE battle_rounds SET host_answer = p_answer, host_time_ms = p_time_ms WHERE id = p_round_id;
    IF p_answer = v_correct THEN
      UPDATE battle_rooms SET host_score = COALESCE(host_score, 0) + 1 WHERE id = v_room_id;
    END IF;
  ELSE
    SELECT opponent_answer INTO v_already FROM battle_rounds WHERE id = p_round_id;
    IF v_already IS NOT NULL THEN RETURN; END IF;
    UPDATE battle_rounds SET opponent_answer = p_answer, opponent_time_ms = p_time_ms WHERE id = p_round_id;
    IF p_answer = v_correct THEN
      UPDATE battle_rooms SET opponent_score = COALESCE(opponent_score, 0) + 1 WHERE id = v_room_id;
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_battle_room(p_room_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.battle_engine', 'on', true);
  UPDATE battle_rooms SET status = 'cancelled', ended_at = now()
   WHERE id = p_room_id AND host_id = auth.uid() AND status = 'waiting';
END;
$$;

CREATE OR REPLACE FUNCTION public.join_battle_room(p_room_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  PERFORM set_config('app.battle_engine', 'on', true);
  UPDATE battle_rooms
     SET opponent_id = auth.uid(), status = 'active', started_at = now()
   WHERE room_code = upper(p_room_code)
     AND status = 'waiting'
     AND opponent_id IS NULL
     AND host_id <> auth.uid()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Restrictive policy: only participants may update, and only their own room
DROP POLICY IF EXISTS "Participants can update their room" ON public.battle_rooms;
CREATE POLICY "Participants can update their room"
  ON public.battle_rooms FOR UPDATE TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = opponent_id)
  WITH CHECK (auth.uid() = host_id OR auth.uid() = opponent_id);

REVOKE UPDATE, DELETE ON public.battle_rooms FROM anon, authenticated;
GRANT UPDATE (opponent_id, started_at) ON public.battle_rooms TO authenticated;
GRANT ALL ON public.battle_rooms TO service_role;

-- =========================================================
-- 2. battle_rounds: answer key hidden until both players answered
-- =========================================================
DROP POLICY IF EXISTS "Participants can view battle rounds" ON public.battle_rounds;
CREATE POLICY "Participants can view their battle rounds"
  ON public.battle_rounds FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM battle_rooms r
      WHERE r.id = battle_rounds.room_id
        AND (r.host_id = auth.uid() OR r.opponent_id = auth.uid())
    )
  );

REVOKE SELECT, UPDATE, DELETE ON public.battle_rounds FROM anon, authenticated;
GRANT SELECT (id, room_id, round_number, question, host_answer, opponent_answer,
              host_time_ms, opponent_time_ms, round_winner, created_at)
  ON public.battle_rounds TO authenticated;
GRANT ALL ON public.battle_rounds TO service_role;

CREATE OR REPLACE VIEW public.safe_battle_rounds
WITH (security_invoker = true)
AS
SELECT id, room_id, round_number, question,
       host_answer, opponent_answer, host_time_ms, opponent_time_ms,
       round_winner, created_at,
       CASE WHEN host_answer IS NOT NULL AND opponent_answer IS NOT NULL
            THEN correct_answer END AS correct_answer
FROM public.battle_rounds;

GRANT SELECT ON public.safe_battle_rounds TO authenticated;

-- =========================================================
-- 3. code_challenges: solutions, tests and expected output are server-only
-- =========================================================
DROP POLICY IF EXISTS "Signed-in users can view challenge briefs" ON public.code_challenges;
CREATE POLICY "Signed-in users can view challenge briefs"
  ON public.code_challenges FOR SELECT TO authenticated USING (true);

REVOKE SELECT, INSERT, UPDATE, DELETE ON public.code_challenges FROM anon, authenticated;
GRANT SELECT (id, title, description, category, difficulty, starter_code, hints, xp_reward, created_at)
  ON public.code_challenges TO authenticated;
GRANT ALL ON public.code_challenges TO service_role;

DROP VIEW IF EXISTS public.safe_code_challenges;
CREATE VIEW public.safe_code_challenges
WITH (security_invoker = true)
AS
SELECT id, title, description, category, difficulty, starter_code, hints, xp_reward, created_at
FROM public.code_challenges;

GRANT SELECT ON public.safe_code_challenges TO authenticated;