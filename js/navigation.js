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
  document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0; // Position des letzten Scrolls speichern
    const nav = document.querySelector(".navigation");

    window.addEventListener("scroll", function () {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        nav.classList.add("navigation--none");
        nav.classList.remove("navigation--black-bg");
      } else if (scrollTop < lastScrollTop) {
        nav.classList.remove("navigation--none");

        if (scrollTop > 100) {
          nav.classList.add("navigation--black-bg");
        } else {
          nav.classList.remove("navigation--black-bg");
        }
      }

      lastScrollTop = scrollTop;
    });
  });
}
