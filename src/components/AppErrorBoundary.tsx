import React from "react";

const RELOAD_KEY = "aiblty-chunk-reload";

export function isChunkLoadError(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err ?? "");
  return /dynamically imported module|Importing a module script failed|Loading chunk|Failed to fetch/i.test(msg);
}

/** After a new release, an old cached page may request files that no longer exist. Reload once to pick up the new version. */
export function reloadOnceForStaleChunks(): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* storage unavailable */
  }
  window.location.reload();
  return true;
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    /* ignore */
  }
}

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("App error:", error);
    if (isChunkLoadError(error)) reloadOnceForStaleChunks();
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            AIblty hit a temporary problem loading this page. Please reload — your progress is safe.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => {
                clearChunkReloadFlag();
                window.location.reload();
              }}
            >
              Reload
            </button>
            <a className="rounded-md border border-border px-4 py-2" href="/">
              Home
            </a>
          </div>
        </div>
      </main>
    );
  }
}
