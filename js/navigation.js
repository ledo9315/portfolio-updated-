// navigation.js

// Funktion zur Verwaltung der aktiven Klasse in der Navigation
export function initNavigation() {
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navigation__item");

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        // Alle aktiven Klassen entfernen
        navLinks.forEach((link) =>
          link.classList.remove("navigation__item--active")
        );

        // Aktive Klasse zu dem angeklickten Link hinzufügen
        this.classList.add("navigation__item--active");
      });
    });
  });
}

// Funktion zur Verwaltung des Scroll-Verhaltens der Navigation
export function initScrollNavigation() {
  // Funktion ist jetzt leer - kein Scroll-Verhalten mehr
}
