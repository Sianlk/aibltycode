import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { AppErrorBoundary, clearChunkReloadFlag, isChunkLoadError, reloadOnceForStaleChunks } from "./components/AppErrorBoundary";

// Recover from stale cached files after a new release instead of showing a blank page.
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

// Register the service worker so lessons keep working offline once cached.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* Offline support is a progressive enhancement — ignore failures. */
    });
  });
}
