// Performance-Monitoring für Production
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initPerformanceObserver();
    this.measurePageLoad();
  }

  initPerformanceObserver() {
    if ("PerformanceObserver" in window) {
      // Core Web Vitals messen
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Verschiedene Performance-Metriken beobachten
      try {
        observer.observe({
          entryTypes: [
            "largest-contentful-paint",
            "first-input",
            "layout-shift",
          ],
        });
      } catch (e) {
        console.warn("Performance Observer nicht vollständig unterstützt");
      }
    }
  }

  handlePerformanceEntry(entry) {
    switch (entry.entryType) {
      case "largest-contentful-paint":
        this.metrics.lcp = entry.startTime;
        this.sendMetric("LCP", entry.startTime);
        break;
      case "first-input":
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.sendMetric("FID", this.metrics.fid);
        break;
      case "layout-shift":
        if (!entry.hadRecentInput) {
          this.metrics.cls = (this.metrics.cls || 0) + entry.value;
          this.sendMetric("CLS", this.metrics.cls);
        }
        break;
    }
  }

  measurePageLoad() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const timing = performance.timing;

        this.metrics.pageLoad = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          dom: timing.domContentLoadedEventEnd - timing.navigationStart,
          load: timing.loadEventEnd - timing.navigationStart,
        };

        this.sendMetrics();
      }, 1000);
    });
  }

  sendMetric(name, value) {
    // In Production würde hier eine Analytics-API aufgerufen
    console.log(`[Performance] ${name}: ${Math.round(value)}ms`);

    // Google Analytics 4 Event (falls aktiviert)
    if (typeof gtag !== "undefined") {
      gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  }

  sendMetrics() {
    console.log("[Performance] Page Load Metrics:", this.metrics.pageLoad);

    // Warnung bei schlechten Core Web Vitals
    if (this.metrics.lcp > 2500) {
      console.warn("[Performance] LCP ist zu hoch:", this.metrics.lcp);
    }
    if (this.metrics.fid > 100) {
      console.warn("[Performance] FID ist zu hoch:", this.metrics.fid);
    }
    if (this.metrics.cls > 0.1) {
      console.warn("[Performance] CLS ist zu hoch:", this.metrics.cls);
    }
  }

  // Manuelles Messen für Custom Events
  measureUserTiming(name, startTime) {
    const duration = performance.now() - startTime;
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    this.sendMetric(`Custom-${name}`, duration);
  }
}

// Resource-Hints für bessere Performance
class ResourceHints {
  constructor() {
    this.addResourceHints();
  }

  addResourceHints() {
    // Preconnect zu wichtigen Domains
    this.addPreconnect("https://fonts.googleapis.com");
    this.addPreconnect("https://www.google-analytics.com");

    // DNS-Prefetch für externe Ressourcen
    this.addDnsPrefetch("//github.com");
    this.addDnsPrefetch("//linkedin.com");
  }

  addPreconnect(url) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  addDnsPrefetch(url) {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = url;
    document.head.appendChild(link);
  }
}

// Critical Resource Preloader
class CriticalResourcePreloader {
  constructor() {
    this.preloadCriticalImages();
  }

  preloadCriticalImages() {
    // Korrekte Pfade basierend auf aktueller Seitenstruktur
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes("/pages/");

    // Dynamische Pfad-Erstellung basierend auf aktueller Position
    const basePath = isInSubfolder ? "../" : "./";

    const criticalImages = [
      `${basePath}img/metropol.jpg`,
      `${basePath}img/angeles-dance-academy.webp`,
      `${basePath}img/photography-masterclass.webp`,
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;

      // Fehlerbehandlung hinzufügen
      link.onerror = () => {
        console.warn(
          `[Performance] Bild konnte nicht vorgeladen werden: ${src}`
        );
      };

      link.onload = () => {
        console.log(`[Performance] Bild erfolgreich vorgeladen: ${src}`);
      };

      document.head.appendChild(link);
    });
  }
}

export { PerformanceMonitor, ResourceHints, CriticalResourcePreloader };
