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

console.log(`Computed language file path: ${languageFilePath}`);

// Überprüfen, ob localStorage verfügbar ist
function localStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Fallback auf Cookies
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Holen einer Sprachdatei
async function fetchLanguageData(lang) {
  const url = `${languageFilePath}languages/${lang}.json`;
  console.log(`Fetching language data from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch language data: ${error.message}`);
    return {};
  }
}

// Event um die Sprache zu wechseln
function changeLanguage(lang) {
  console.log(`Setting language to: ${lang}`);
  if (localStorageAvailable()) {
    localStorage.setItem("language", lang);
    console.log(
      `Language set in localStorage: ${localStorage.getItem("language")}`
    );
  } else {
    setCookie("language", lang, 365);
    console.log(`Language set in cookie: ${getCookie("language")}`);
  }

  fetchLanguageData(lang)
    .then((languageData) => {
      updateContent(languageData);
    })
    .catch((error) => {
      console.error(`Error during language change: ${error.message}`);
    });
}

// Aktualisieren des Inhalts
function updateContent(languageData) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (languageData[key]) {
      element.innerHTML = languageData[key];
      console.log(`Updated ${key} with ${languageData[key]}`);
    } else {
      console.warn(`Key ${key} not found in language data`);
    }
  });
}

// Initiales Event um entweder die zuvor gewählte Sprache zu setzen
// oder Deutsch als Fallback
document.addEventListener("DOMContentLoaded", async () => {
  let userPreferredLanguage;
  if (localStorageAvailable()) {
    userPreferredLanguage = localStorage.getItem("language") || "de";
  } else {
    userPreferredLanguage = getCookie("language") || "de";
  }
  console.log(`User preferred language: ${userPreferredLanguage}`);
  const languageData = await fetchLanguageData(userPreferredLanguage);
  updateContent(languageData);
});
