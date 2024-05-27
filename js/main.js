const hamburger = document.querySelector(".navigation__hamburger");
const nav = document.querySelector(".navigation");
const navMenu = document.querySelector(".navigation__list");
const navContainer = document.querySelector(".navigation__container");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("navigation__hamburger--active");
  navMenu.classList.toggle("navigation__list--active");
  navContainer.classList.toggle("navigation__container--mobile");
});

document.querySelectorAll(".navigation__item").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("navigation__hamburger--active");
    navMenu.classList.remove("navigation__list--active");
  })
);

// switcht die aktive Klasse in der Navigation
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

document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0; // Position des letzten Scrolls speichern

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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
