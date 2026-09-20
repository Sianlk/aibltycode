# Offline Test Plan — AIblty

Covers the four core flows offline: lesson playback, learning path updates,
progress save, and replay. Run against a **production build** (the service
worker never registers in dev or Lovable preview).

## Setup

```bash
npx vite build
npx vite preview --port 4173 --strictPort
```

Automated suite (Playwright, signed-in session injected from the environment):

```bash
python3 /tmp/browser/offline/run.py     # core flows
python3 /tmp/browser/offline/steps.py   # step-by-step lesson completion offline
```

Manual equivalent: load the app, wait for the service worker to activate
(Application → Service Workers), then DevTools → Network → Offline.

## Test matrix

| # | Flow | Steps | Expected |
|---|------|-------|----------|
| 1 | SW install | Load `/` once online | `navigator.serviceWorker.ready` resolves with an active worker; cache `aiblty-v1.1.0` created |
| 2 | App shell offline | Go offline, hard reload `/` | App shell renders from cache, no browser error page |
| 3 | Deep-link offline | Offline, reload `/dashboard`, `/path`, `/module/:id`, `/lesson/:module/:lesson` | Each client route resolves via cached `index.html`, page renders |
| 4 | Lesson playback | Offline, open a cached lesson | Lesson title, step counter (`1/6`) and content render; lesson data is bundled, not fetched |
| 5 | Lesson interaction | Offline, type the drill answer, press Check; answer the quizzes | Step counter advances (1/6 → 6/6) without network |
| 6 | Progress save offline | Offline, finish a lesson | Toast "Saved offline — will sync when you reconnect"; completion stored in `localStorage["aiblty-offline-queue"]`; lesson shows as complete immediately |
| 7 | Path updates offline | Offline, open `/path` after completing a lesson | Learning path renders and reflects the locally completed lesson |
| 8 | Replay | Offline, reopen the same lesson | Lesson reopens from cache and replays from the start |
| 9 | Reconnect sync | Go back online | Queue flushes automatically (`online` event + mount); toast "Synced N offline results"; queue empties; backend `user_progress` row exists |
| 10 | Local state durability | Reload after reconnect | XP, mode, sound and accessibility settings survive; no duplicate completions |
| 11 | Cross-origin safety | Offline, observe network | Auth/database/payment requests are never served from cache (SW skips cross-origin) |
| 12 | Cache upgrade | Bump `CACHE_NAME`, redeploy | Old caches deleted on activate; clients claimed; new shell served |

## Known limits (by design)

- A lesson must have been visited at least once online, or the app shell must be
  cached, before it is available offline.
- Live features that need the backend (AI Tutor replies, leaderboards, code
  battles, sign-in) are unavailable offline; they fail gracefully and recover
  on reconnect.
- Offline completions sync on the next online session; XP shown offline is
  local-optimistic until then.

## Pass criteria

All 12 rows pass, no uncaught console errors other than expected
`ERR_INTERNET_DISCONNECTED` for backend calls, and the offline queue is empty
after reconnect.