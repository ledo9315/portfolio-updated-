const CACHE_NAME = "portfolio-v1.2.0";
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Kritische Ressourcen für sofortiges Caching
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/main.min.css",
  "/css/noscript.css",
  "/js/main.js",
  "/js/hamburger.js",
  "/js/navigation.js",
  "/js/toast.js",
  "/img/icons/logo.svg",
  "/img/fallback-image.webp",
  "/fonts/Hanson-Bold.woff2",
  "/fonts/Montserrat-Regular.woff2",
  "/fonts/Montserrat-Medium.woff2",
  "/fonts/Montserrat-Bold.woff2",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
];

// Installation - Cache statische Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      })
  );
});

// Aktivierung - Alte Caches löschen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("portfolio-") &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE
            )
            .map((cacheName) => {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("[SW] Service Worker activated");
        return self.clients.claim();
      })
  );
});

// Fetch - Cache-First-Strategie für statische Assets, Network-First für API-Calls
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur GET-Requests cachen
  if (request.method !== "GET") return;

  // Skip chrome-extension und andere Browser-spezifische URLs
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Cache-First für statische Assets
  if (
    STATIC_ASSETS.some((asset) => url.pathname.endsWith(asset.replace("/", "")))
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            // Nur erfolgreiche Responses cachen
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(request, responseClone))
                .catch((err) => console.warn("[SW] Cache put failed:", err));
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Fallback für kritische Ressourcen
          if (request.destination === "document") {
            return caches.match("/index.html");
          }
          if (request.destination === "image") {
            return caches.match("/img/fallback-image.webp");
          }
        })
    );
    return;
  }

  // Network-First für andere Ressourcen
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Nur erfolgreiche Responses cachen
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches
            .open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone))
            .catch((err) => console.warn("[SW] Dynamic cache failed:", err));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback für HTML-Seiten
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/index.html");
          }
        });
      })
  );
});

// Background Sync für Offline-Formulare (falls implementiert)
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(
      // Hier könnten offline gesendete Formulare verarbeitet werden
      console.log("[SW] Background sync: contact-form")
    );
  }
});

// Push Notifications (optional)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "Neue Nachricht von leonid-domahalskyy.de",
      icon: "/favicon-192x192.png",
      badge: "/favicon-96x96.png",
      vibrate: [200, 100, 200],
      data: data.url || "/",
      actions: [
        {
          action: "open",
          title: "Öffnen",
        },
        {
          action: "close",
          title: "Schließen",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "Portfolio Update",
        options
      )
    );
  }
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data || "/"));
  }
});
