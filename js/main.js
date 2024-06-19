// Hamburger Menu toggle
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

// Mit der Escape-Taste das Hamburger Menu schließen
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hamburger.classList.remove("navigation__hamburger--active");
    navMenu.classList.remove("navigation__list--active");
  }
});

// Switcht die aktive Klasse in der Navigation
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

// Navigation wird beim Scrollen ausgeblendet und wieder eingeblendet
document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0; // Position des letzten Scrolls speichern

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

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".timeline__item");
  const navLi = document.querySelectorAll(".timeline__sidenav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach((li) => {
      li.classList.remove("active");
      if (li.getAttribute("href").includes(current)) {
        li.classList.add("active");
      }
    });
  });
});

// *********** Language Switcher ***********

let path = window.location.pathname;
let languageFilePath = "";

if (path.includes("index.html")) {
  languageFilePath = "./";
} else if (path.includes("works")) {
  languageFilePath = "../../";
} else {
  languageFilePath = "../";
}

// Holen einer Sprachdatei
async function fetchLanguageData(lang) {
  const url = `${languageFilePath}languages/${lang}.json`;
  console.log(`Fetching from: ${url}`);
  const response = await fetch(url);
  return await response.json();
}

// Event um die Sprache zu wechseln
function changeLanguage(lang) {
  localStorage.setItem("language", lang);
  fetchLanguageData(lang).then((languageData) => {
    updateContent(languageData);
  });
}

// Aktualisieren des Inhalts
function updateContent(languageData) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = languageData[key];
    console.log(`key: ${key}, value: ${languageData[key]}`);
  });
}

// Initiales Event um entweder die zuvor gewählte Sprache zu setzen
// oder Deutsch als Fallback
document.addEventListener("DOMContentLoaded", async () => {
  const userPreferredLanguage = localStorage.getItem("language") || "de";
  const languageData = await fetchLanguageData(userPreferredLanguage);
  updateContent(languageData);
});
