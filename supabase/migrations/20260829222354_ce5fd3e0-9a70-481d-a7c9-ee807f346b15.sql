DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
  END LOOP;
END $$;

GRANT EXECUTE ON FUNCTION public.award_badge(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_parental_pin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_battle(uuid, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_safe_battle_round(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_parental_pin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_parental_pin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_battle_answer(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlock_avatar_item(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_leaderboard_stats(integer, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_parental_pin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_battle_room(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_battle_room(text) TO authenticated;