// Supabase auth storage is fully local to the installed app or browser.
// The retained function name avoids a breaking change at existing import sites.
export function brokeredPreviewStorage() {
  if (typeof window === 'undefined') return undefined;
  return localStorage;
}
