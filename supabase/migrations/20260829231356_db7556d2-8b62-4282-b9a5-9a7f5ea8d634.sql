-- Battle rooms: read + create only. Outcome writes stay with the engine RPCs.
GRANT SELECT, INSERT ON public.battle_rooms TO authenticated;
GRANT ALL ON public.battle_rooms TO service_role;

-- Battle rounds: read only; creation and grading go through SECURITY DEFINER RPCs.
GRANT SELECT ON public.battle_rounds TO authenticated;
GRANT ALL ON public.battle_rounds TO service_role;

-- Spectators: participants manage their own spectating rows.
GRANT SELECT, INSERT, DELETE ON public.battle_spectators TO authenticated;
GRANT ALL ON public.battle_spectators TO service_role;

-- Challenges: the table no longer holds solutions, so briefs are safe to read.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_challenges TO authenticated;
GRANT ALL ON public.code_challenges TO service_role;

-- Answer keys remain unreachable from any client role.
REVOKE ALL ON public.battle_round_answers FROM anon, authenticated, PUBLIC;