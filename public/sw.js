/**
 * Service Worker — offline-first PWA with stale-while-revalidate caching.
 * Supports background sync for deferred form submissions.
 */
const CACHE_NAME = "aiblty-v1.1.0";
// Only real, existing files — a missing entry makes cache.addAll() reject and
// the whole service worker fail to install.
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/favicon.png", "/logo192.png", "/logo512.png"];
const API_CACHE_TTL = 60 * 1000; // 1 minute for API responses

// Install: pre-cache static assets (tolerate any individual miss)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch(() => undefined))
      )
    )
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation + API, stale-while-revalidate for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch cross-origin traffic (auth, database, payments, analytics).
  if (url.origin !== self.location.origin) return;

  // Never cache auth or payment endpoints
  if (url.pathname.startsWith("/api/v1/auth") || url.pathname.startsWith("/api/v1/payments")) {
    return;
  }

  // App-shell navigation: try network, fall back to the cached shell offline
  // so every client-side route keeps working without a connection.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", clone));
          return response;
        })
        .catch(async () => (await caches.match("/index.html")) || Response.error())
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    // Network-first with cache fallback for API
    event.respondWith(
      fetch(request.clone())
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Stale-while-revalidate for static assets
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok && response.type === "basic") {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

// Background sync — retry failed form submissions when back online
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-forms") {
    event.waitUntil(syncPendingForms());
  }
});

async function syncPendingForms() {
  const db = await openIndexedDB();
  const pending = await getAllPending(db);
  for (const item of pending) {
    try {
      await fetch(item.url, { method: item.method, body: item.body,
        headers: { "Content-Type": "application/json" } });
      await deleteItem(db, item.id);
    } catch (_) { /* Will retry next sync */ }
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("offline-db", 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = reject;
  });
}
function getAllPending(db) {
  return new Promise((res) => {
    const tx = db.transaction("pending", "readonly");
    tx.objectStore("pending").getAll().onsuccess = (e) => res(e.target.result);
  });
}
function deleteItem(db, id) {
  return new Promise((res) => {
    const tx = db.transaction("pending", "readwrite");
    tx.objectStore("pending").delete(id).onsuccess = res;
  });
}

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
      icon: "/assets/icon.svg",
      badge: "/assets/icon.svg",
      data: data.url || "/",
      actions: data.actions || [],
      requireInteraction: data.urgent || false,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || "/"));
});
