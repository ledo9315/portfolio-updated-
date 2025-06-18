// Performance-Optimierung: Defer nicht-kritische Operationen
const initApp = () => {
  try {
    // Kritische Funktionalität sofort initialisieren
    initHamburgerMenu();
    initNavigation();

    // Performance-Monitoring initialisieren (mit Fehlerbehandlung)
    try {
      new PerformanceMonitor();
      new ResourceHints();
    } catch (perfError) {
      console.warn(
        "[Performance] Monitoring konnte nicht initialisiert werden:",
        perfError
      );
    }

    // Nicht-kritische Funktionalität verzögert laden
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        try {
          initScrollNavigation();
          new Toast();
          new CriticalResourcePreloader();
          registerServiceWorker();
        } catch (idleError) {
          console.warn(
            "[Init] Fehler bei verzögerter Initialisierung:",
            idleError
          );
        }
      });
    } else {
      // Fallback für ältere Browser
      setTimeout(() => {
        try {
          initScrollNavigation();
          new Toast();
          new CriticalResourcePreloader();
          registerServiceWorker();
        } catch (timeoutError) {
          console.warn(
            "[Init] Fehler bei Timeout-Initialisierung:",
            timeoutError
          );
        }
      }, 100);
    }
  } catch (error) {
    console.error("[Init] Kritischer Fehler bei App-Initialisierung:", error);
  }
};

// Service Worker Registrierung mit verbesserter Fehlerbehandlung
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("[SW] Service Worker registriert:", registration.scope);

      // Update-Benachrichtigung
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Neue Version verfügbar
              showUpdateNotification();
            }
          });
        }
      });

      // Service Worker Fehler abfangen
      registration.addEventListener("error", (error) => {
        console.error("[SW] Service Worker Fehler:", error);
      });
    } catch (error) {
      console.error("[SW] Service Worker Registrierung fehlgeschlagen:", error);
    }
  } else {
    console.warn(
      "[SW] Service Worker wird von diesem Browser nicht unterstützt"
    );
  }
};

// Update-Benachrichtigung anzeigen
const showUpdateNotification = () => {
  const updateBanner = document.createElement("div");
  updateBanner.className = "update-banner";
  updateBanner.innerHTML = `
    <div class="update-banner__content">
      <span>Neue Version verfügbar!</span>
      <button class="update-banner__button" onclick="window.location.reload()">Aktualisieren</button>
      <button class="update-banner__close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  document.body.appendChild(updateBanner);
};

// Event Listener für DOMContentLoaded
document.addEventListener("DOMContentLoaded", initApp);

// Erweiterte Error Handling
window.addEventListener("error", (event) => {
  // Externe Scripts (wie Ads) ignorieren
  if (event.filename && event.filename.includes("ads.")) {
    console.warn(
      "[Error] Externer Werbe-Script-Fehler ignoriert:",
      event.filename
    );
    return true; // Fehler als behandelt markieren
  }

  console.error("Global error:", {
    message: event.error?.message || event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack,
  });

  // Production Error Tracking (z.B. Sentry)
  if (typeof gtag !== "undefined") {
    gtag("event", "exception", {
      description: event.error?.message || "Unknown error",
      fatal: false,
      filename: event.filename,
      line: event.lineno,
    });
  }
});

// Unhandled Promise Rejections mit besserer Behandlung
window.addEventListener("unhandledrejection", (event) => {
  // Chrome Extension Fehler ignorieren
  if (event.reason && event.reason.toString().includes("Extension")) {
    console.warn("[Error] Browser Extension Fehler ignoriert");
    event.preventDefault();
    return;
  }

  console.error("Unhandled promise rejection:", {
    reason: event.reason,
    promise: event.promise,
  });

  // In Development: Fehler nicht unterdrücken
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return; // Lass den Fehler durch für Debugging
  }

  // In Production: Fehler protokollieren aber App nicht crashen lassen
  event.preventDefault();
});

// Import der Module
import { initHamburgerMenu } from "./hamburger.js";
import { initNavigation, initScrollNavigation } from "./navigation.js";
import { Toast } from "./toast.js";
import {
  PerformanceMonitor,
  ResourceHints,
  CriticalResourcePreloader,
} from "./performance.js";
