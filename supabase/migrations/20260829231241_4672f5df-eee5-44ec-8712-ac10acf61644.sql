-- 1. Hide battle answers in a table clients cannot read at all -----------------

CREATE TABLE IF NOT EXISTS public.battle_round_answers (
  round_id uuid PRIMARY KEY REFERENCES public.battle_rounds(id) ON DELETE CASCADE,
  correct_answer integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.battle_round_answers TO service_role;
ALTER TABLE public.battle_round_answers ENABLE ROW LEVEL SECURITY;
-- No policies: unreachable via the Data API. Only SECURITY DEFINER functions read it.
REVOKE ALL ON public.battle_round_answers FROM anon, authenticated, PUBLIC;

INSERT INTO public.battle_round_answers (round_id, correct_answer)
SELECT id, correct_answer FROM public.battle_rounds
ON CONFLICT (round_id) DO NOTHING;

DROP VIEW IF EXISTS public.safe_battle_rounds;

ALTER TABLE public.battle_rounds DROP COLUMN IF EXISTS correct_answer;

-- Rounds are created through a trusted function so the answer never travels
-- through a client-writable column.
CREATE OR REPLACE FUNCTION public.create_battle_round(
  p_room_id uuid,
  p_round_number integer,
  p_question jsonb,
  p_correct_answer integer
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_round_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM battle_rooms
    WHERE id = p_room_id AND host_id = auth.uid() AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Only the host of an active room can start a round';
  END IF;

  INSERT INTO battle_rounds (room_id, round_number, question)
  VALUES (p_room_id, p_round_number, p_question)
  RETURNING id INTO v_round_id;

  INSERT INTO battle_round_answers (round_id, correct_answer)
  VALUES (v_round_id, p_correct_answer);

  RETURN v_round_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_battle_round(uuid, integer, jsonb, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_battle_round(uuid, integer, jsonb, integer) TO authenticated;

-- Grading reads the answer from the hidden table.
CREATE OR REPLACE FUNCTION public.submit_battle_answer(p_round_id uuid, p_answer integer, p_time_ms integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_room_id uuid; v_is_host boolean; v_correct integer; v_already integer;
  v_host_answer integer; v_opp_answer integer;
  v_host_score integer; v_opp_score integer; v_total integer; v_round_number integer;
BEGIN
  PERFORM set_config('app.battle_engine', 'on', true);

  SELECT r.room_id, r.round_number, a.correct_answer
    INTO v_room_id, v_round_number, v_correct
    FROM battle_rounds r
    LEFT JOIN battle_round_answers a ON a.round_id = r.id
   WHERE r.id = p_round_id;

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

  -- Auto-finalise once the final round is fully answered.
  SELECT host_answer, opponent_answer INTO v_host_answer, v_opp_answer
    FROM battle_rounds WHERE id = p_round_id;

  IF v_host_answer IS NOT NULL AND v_opp_answer IS NOT NULL THEN
    SELECT host_score, opponent_score, total_rounds
      INTO v_host_score, v_opp_score, v_total
      FROM battle_rooms WHERE id = v_room_id;

    IF v_round_number >= COALESCE(v_total, 5) THEN
      UPDATE battle_rooms
         SET status = 'finished',
             ended_at = now(),
             winner_id = CASE
               WHEN v_host_score > v_opp_score THEN host_id
               WHEN v_opp_score > v_host_score THEN opponent_id
               ELSE NULL END
       WHERE id = v_room_id;
    END IF;
  END IF;
END;
$$;

-- Reveals the answer only once both players have committed theirs.
CREATE OR REPLACE FUNCTION public.get_safe_battle_round(p_round_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_round battle_rounds%ROWTYPE;
  v_is_host boolean;
  v_result jsonb;
BEGIN
  SELECT * INTO v_round FROM battle_rounds WHERE id = p_round_id;
  IF v_round IS NULL THEN RETURN NULL; END IF;

  SELECT (host_id = auth.uid()) INTO v_is_host
    FROM battle_rooms
   WHERE id = v_round.room_id AND (host_id = auth.uid() OR opponent_id = auth.uid());
  IF v_is_host IS NULL THEN RETURN NULL; END IF;

  v_result := to_jsonb(v_round);

  IF v_round.host_answer IS NOT NULL AND v_round.opponent_answer IS NOT NULL THEN
    v_result := v_result || jsonb_build_object(
      'correct_answer', (SELECT correct_answer FROM battle_round_answers WHERE round_id = p_round_id)
    );
  ELSIF v_is_host THEN
    v_result := v_result - 'opponent_answer' - 'opponent_time_ms';
  ELSE
    v_result := v_result - 'host_answer' - 'host_time_ms';
  END IF;

  RETURN v_result;
END;
$$;

-- Clients may no longer insert rounds directly.
DROP POLICY IF EXISTS "System can create rounds" ON public.battle_rounds;
REVOKE INSERT, UPDATE, DELETE ON public.battle_rounds FROM anon, authenticated;

-- 2. Players can no longer write match outcomes ---------------------------------

DROP POLICY IF EXISTS "Participants can update their room" ON public.battle_rooms;
REVOKE UPDATE, DELETE ON public.battle_rooms FROM anon, authenticated;

-- 3. Challenge answer keys move to an admin-only store ---------------------------

CREATE TABLE IF NOT EXISTS public.code_challenge_solutions (
  challenge_id uuid PRIMARY KEY REFERENCES public.code_challenges(id) ON DELETE CASCADE,
  solution_code text,
  test_cases jsonb,
  expected_output text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.code_challenge_solutions TO service_role;
ALTER TABLE public.code_challenge_solutions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.code_challenge_solutions FROM anon, authenticated, PUBLIC;

CREATE POLICY "Admins can manage challenge solutions"
  ON public.code_challenge_solutions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_challenge_solutions TO authenticated;

INSERT INTO public.code_challenge_solutions (challenge_id, solution_code, test_cases, expected_output)
SELECT id, solution_code, test_cases, expected_output FROM public.code_challenges
ON CONFLICT (challenge_id) DO NOTHING;

DROP VIEW IF EXISTS public.safe_code_challenges CASCADE;

ALTER TABLE public.code_challenges DROP COLUMN IF EXISTS solution_code;
ALTER TABLE public.code_challenges DROP COLUMN IF EXISTS test_cases;
ALTER TABLE public.code_challenges DROP COLUMN IF EXISTS expected_output;