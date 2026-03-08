-- Fix battle_rounds: use security definer functions instead of complex policies
DROP POLICY IF EXISTS "Participants can update rounds" ON public.battle_rounds;

CREATE OR REPLACE FUNCTION public.submit_battle_answer(p_round_id uuid, p_answer int, p_time_ms int)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_room_id uuid; v_is_host boolean;
BEGIN
  SELECT room_id INTO v_room_id FROM battle_rounds WHERE id = p_round_id;
  SELECT (host_id = auth.uid()) INTO v_is_host FROM battle_rooms WHERE id = v_room_id AND (host_id = auth.uid() OR opponent_id = auth.uid());
  IF v_is_host IS NULL THEN RAISE EXCEPTION 'Not a participant'; END IF;
  IF v_is_host THEN
    UPDATE battle_rounds SET host_answer = p_answer, host_time_ms = p_time_ms WHERE id = p_round_id;
  ELSE
    UPDATE battle_rounds SET opponent_answer = p_answer, opponent_time_ms = p_time_ms WHERE id = p_round_id;
  END IF;
END;
$$;

-- Fix battle_rooms: security definer for winner/score
CREATE OR REPLACE FUNCTION public.finalize_battle(p_room_id uuid, p_winner_id uuid, p_host_score int, p_opponent_score int)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE battle_rooms SET winner_id = p_winner_id, host_score = p_host_score, opponent_score = p_opponent_score, status = 'finished', ended_at = now()
  WHERE id = p_room_id AND (host_id = auth.uid() OR opponent_id = auth.uid());
END;
$$;

-- Fix user_badges: security definer
CREATE OR REPLACE FUNCTION public.award_badge(p_badge_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_xp_required int; v_user_xp int;
BEGIN
  SELECT xp_required INTO v_xp_required FROM badges WHERE id = p_badge_id;
  IF v_xp_required IS NULL THEN RETURN false; END IF;
  SELECT xp INTO v_user_xp FROM profiles WHERE id = auth.uid();
  IF v_user_xp >= v_xp_required THEN
    INSERT INTO user_badges (user_id, badge_id) VALUES (auth.uid(), p_badge_id) ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;

-- Fix leaderboard: security definer for updates
CREATE OR REPLACE FUNCTION public.update_leaderboard_stats(p_xp_delta int DEFAULT 0, p_games_delta int DEFAULT 0, p_lessons_delta int DEFAULT 0)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE leaderboard SET total_xp = COALESCE(total_xp,0) + p_xp_delta, games_played = COALESCE(games_played,0) + p_games_delta, lessons_completed = COALESCE(lessons_completed,0) + p_lessons_delta, updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;
DROP POLICY IF EXISTS "Users can update own leaderboard" ON public.leaderboard;

-- Fix avatar items: security definer
CREATE OR REPLACE FUNCTION public.unlock_avatar_item(p_item_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_xp_cost int; v_user_xp int;
BEGIN
  SELECT xp_cost INTO v_xp_cost FROM avatar_items WHERE id = p_item_id;
  IF v_xp_cost IS NULL THEN RETURN false; END IF;
  SELECT xp INTO v_user_xp FROM profiles WHERE id = auth.uid();
  IF v_user_xp >= COALESCE(v_xp_cost, 0) THEN
    INSERT INTO user_avatar_items (user_id, item_id) VALUES (auth.uid(), p_item_id) ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
DROP POLICY IF EXISTS "Users can unlock avatar items" ON public.user_avatar_items;