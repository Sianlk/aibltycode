-- ========================================================
-- 1. battle_spectators: identities never public
-- ========================================================
DROP POLICY IF EXISTS "Authenticated users can join as spectator" ON public.battle_spectators;
CREATE POLICY "Authenticated users can join as spectator"
  ON public.battle_spectators FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can leave spectating" ON public.battle_spectators;
CREATE POLICY "Users can leave spectating"
  ON public.battle_spectators FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Room members can view spectators" ON public.battle_spectators;
CREATE POLICY "Room members can view spectators"
  ON public.battle_spectators FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.battle_rooms r
      WHERE r.id = battle_spectators.room_id
        AND (r.host_id = auth.uid() OR r.opponent_id = auth.uid())
    )
  );

REVOKE ALL ON public.battle_spectators FROM anon;
REVOKE UPDATE ON public.battle_spectators FROM authenticated;
GRANT SELECT, INSERT, DELETE ON public.battle_spectators TO authenticated;
GRANT ALL ON public.battle_spectators TO service_role;

-- ========================================================
-- 2. Battles finish server-side; no client-callable finalizer
-- ========================================================
CREATE OR REPLACE FUNCTION public.submit_battle_answer(p_round_id uuid, p_answer integer, p_time_ms integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_room_id uuid; v_is_host boolean; v_correct integer; v_already integer;
  v_total int; v_done int; v_h int; v_o int; v_host uuid; v_opp uuid; v_winner uuid;
BEGIN
  PERFORM set_config('app.battle_engine', 'on', true);

  SELECT room_id, correct_answer INTO v_room_id, v_correct
    FROM battle_rounds WHERE id = p_round_id;
  IF v_room_id IS NULL THEN RAISE EXCEPTION 'Round not found'; END IF;

  SELECT (host_id = auth.uid()) INTO v_is_host FROM battle_rooms
   WHERE id = v_room_id AND (host_id = auth.uid() OR opponent_id = auth.uid());
  IF v_is_host IS NULL THEN RAISE EXCEPTION 'Not a participant'; END IF;

  IF v_is_host THEN
    SELECT host_answer INTO v_already FROM battle_rounds WHERE id = p_round_id;
    IF v_already IS NOT NULL THEN RETURN; END IF;
    UPDATE battle_rounds
       SET host_answer = p_answer, host_time_ms = p_time_ms
     WHERE id = p_round_id;
    IF p_answer = v_correct THEN
      UPDATE battle_rooms SET host_score = COALESCE(host_score, 0) + 1 WHERE id = v_room_id;
    END IF;
  ELSE
    SELECT opponent_answer INTO v_already FROM battle_rounds WHERE id = p_round_id;
    IF v_already IS NOT NULL THEN RETURN; END IF;
    UPDATE battle_rounds
       SET opponent_answer = p_answer, opponent_time_ms = p_time_ms
     WHERE id = p_round_id;
    IF p_answer = v_correct THEN
      UPDATE battle_rooms SET opponent_score = COALESCE(opponent_score, 0) + 1 WHERE id = v_room_id;
    END IF;
  END IF;

  -- record the per-round winner
  UPDATE battle_rounds SET round_winner = CASE
      WHEN host_answer IS NULL OR opponent_answer IS NULL THEN round_winner
      WHEN (host_answer = v_correct) AND (opponent_answer <> v_correct) THEN 'host'
      WHEN (opponent_answer = v_correct) AND (host_answer <> v_correct) THEN 'opponent'
      WHEN (host_answer = v_correct) AND (opponent_answer = v_correct)
        THEN CASE WHEN COALESCE(host_time_ms, 2147483647) < COALESCE(opponent_time_ms, 2147483647)
                  THEN 'host' ELSE 'opponent' END
      ELSE 'draw' END
   WHERE id = p_round_id;

  -- auto-finalise once every round of the battle is complete
  SELECT total_rounds, host_score, opponent_score, host_id, opponent_id
    INTO v_total, v_h, v_o, v_host, v_opp
    FROM battle_rooms WHERE id = v_room_id;

  SELECT count(*) INTO v_done FROM battle_rounds
   WHERE room_id = v_room_id AND host_answer IS NOT NULL AND opponent_answer IS NOT NULL;

  IF v_total IS NOT NULL AND v_done >= v_total THEN
    v_winner := CASE WHEN COALESCE(v_h,0) > COALESCE(v_o,0) THEN v_host
                     WHEN COALESCE(v_o,0) > COALESCE(v_h,0) THEN v_opp
                     ELSE NULL END;
    UPDATE battle_rooms
       SET status = 'finished', winner_id = v_winner, ended_at = now()
     WHERE id = v_room_id AND status <> 'finished';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.finalize_battle(uuid, uuid, integer, integer) FROM PUBLIC, anon, authenticated;

-- ========================================================
-- 3. Internal-only helpers: not reachable from the API
-- ========================================================
REVOKE EXECUTE ON FUNCTION public.guard_battle_room_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_spectator_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_subscription_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_admin_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_badge(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.unlock_avatar_item(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_leaderboard_stats(integer, integer, integer) FROM anon;