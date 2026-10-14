import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import {
  AppErrorBoundary,
  clearChunkReloadFlag,
  isChunkLoadError,
  reloadOnceForStaleChunks,
} from "./components/AppErrorBoundary";

const LEGACY_PUBLIC_HOSTS = new Set(["aibltycode.lovable.app"]);

if (LEGACY_PUBLIC_HOSTS.has(window.location.hostname)) {
  const canonical = new URL(window.location.href);
  canonical.protocol = "https:";
  canonical.host = "aiblty.com";
  window.location.replace(canonical.toString());
} else {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadOnceForStaleChunks();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason)) reloadOnceForStaleChunks();
  });

  window.setTimeout(clearChunkReloadFlag, 10000);

  createRoot(document.getElementById("root")!).render(
    <AppErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </AppErrorBoundary>,
  );
}

// vite-plugin-pwa owns service-worker registration and update lifecycle.
// Do not manually register /sw.js here; duplicate registration can preserve
// stale chunks across releases.
