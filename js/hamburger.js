// hamburger.js
export function initHamburgerMenu() {
  const hamburger = document.querySelector(".navigation__hamburger");
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hamburger.classList.remove("navigation__hamburger--active");
      navMenu.classList.remove("navigation__list--active");
    }
  });
}
