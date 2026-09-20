-- Remove direct client write access to battle room outcome fields
DROP POLICY IF EXISTS "Participants can update their room" ON public.battle_rooms;
REVOKE UPDATE ON public.battle_rooms FROM authenticated, anon;
REVOKE DELETE ON public.battle_rooms FROM authenticated, anon;
REVOKE ALL ON public.battle_rooms FROM anon;
GRANT SELECT, INSERT ON public.battle_rooms TO authenticated;

-- battle_rounds: no anon access, no client updates/deletes
REVOKE ALL ON public.battle_rounds FROM anon;
REVOKE UPDATE, DELETE ON public.battle_rounds FROM authenticated;

-- code_challenges: anon has no access at all; safe columns only for signed-in users
REVOKE ALL ON public.code_challenges FROM anon;

-- battle_spectators: no anon access
REVOKE ALL ON public.battle_spectators FROM anon;
GRANT SELECT, INSERT, DELETE ON public.battle_spectators TO authenticated;