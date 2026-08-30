-- 1. code_challenges: hide solutions/test data from clients
DROP VIEW IF EXISTS public.safe_code_challenges;
DROP POLICY IF EXISTS "Public can view challenges" ON public.code_challenges;
CREATE POLICY "Signed-in users can view challenge briefs"
  ON public.code_challenges FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.code_challenges FROM anon, authenticated;
GRANT SELECT (id, title, description, category, difficulty, starter_code, hints, xp_reward, created_at)
  ON public.code_challenges TO authenticated;
GRANT ALL ON public.code_challenges TO service_role;

-- 2. battle_rounds: never expose correct_answer to clients
REVOKE SELECT, UPDATE ON public.battle_rounds FROM anon, authenticated;
GRANT SELECT (id, room_id, round_number, question, host_answer, opponent_answer, host_time_ms, opponent_time_ms, round_winner, created_at)
  ON public.battle_rounds TO authenticated;
GRANT ALL ON public.battle_rounds TO service_role;

-- 3. battle_rooms: no client-side score/winner/status tampering
DROP POLICY IF EXISTS "Participants can update their room" ON public.battle_rooms;
CREATE POLICY "Participants can update their room"
  ON public.battle_rooms FOR UPDATE TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = opponent_id OR (status = 'waiting' AND opponent_id IS NULL))
  WITH CHECK (auth.uid() = host_id OR auth.uid() = opponent_id);
REVOKE UPDATE ON public.battle_rooms FROM anon, authenticated;
GRANT UPDATE (opponent_id, started_at) ON public.battle_rooms TO authenticated;
GRANT ALL ON public.battle_rooms TO service_role;

-- server-side scoring + room lifecycle
CREATE OR REPLACE FUNCTION public.submit_battle_answer(p_round_id uuid, p_answer integer, p_time_ms integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_room_id uuid; v_is_host boolean; v_correct integer; v_already integer;
BEGIN
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

-- 4. battle_spectators: no public identity exposure
DROP POLICY IF EXISTS "Anyone can view spectators" ON public.battle_spectators;
CREATE POLICY "Room members can view spectators"
  ON public.battle_spectators FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM battle_rooms r
      WHERE r.id = battle_spectators.room_id
        AND (r.host_id = auth.uid() OR r.opponent_id = auth.uid())
    )
  );
REVOKE SELECT ON public.battle_spectators FROM anon;

-- 5. Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.award_badge(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.clear_parental_pin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.finalize_battle(uuid, uuid, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_safe_battle_round(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_parental_pin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_parental_pin(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.submit_battle_answer(uuid, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.unlock_avatar_item(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_leaderboard_stats(integer, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.verify_parental_pin(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.cancel_battle_room(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.join_battle_room(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.cancel_battle_room(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_battle_room(text) TO authenticated;

-- internal/trigger-only functions: not callable from the API at all
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_admin_role() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_spectator_count() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_subscription_update() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin_email(text) FROM anon, authenticated;