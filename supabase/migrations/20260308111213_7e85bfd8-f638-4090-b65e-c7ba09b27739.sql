
-- Fix security definer view - make it security invoker so RLS of querying user applies
ALTER VIEW public.safe_code_challenges SET (security_invoker = on);
