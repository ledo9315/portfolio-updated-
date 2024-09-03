let path = window.location.pathname;
let languageFilePath = "";

// Bestimmen des Pfads zur Sprachdatei basierend auf dem aktuellen Pfad
if (path.includes("index.html" || "main")) {
  languageFilePath = "./";
} else if (path.includes("works")) {
  languageFilePath = "../../";
} else if (path.includes("pages")) {
  languageFilePath = "../";
}

// Funktion zum Holen einer Sprachdatei
export async function fetchLanguageData(lang) {
  const url = `${languageFilePath}languages/${lang}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch language file: ${url}`);
  }
  return await response.json();
}

// Funktion zum Wechseln der Sprache
export function changeLanguage(lang) {
  localStorage.setItem("language", lang);
  fetchLanguageData(lang)
    .then((languageData) => {
      updateContent(languageData);
    })
    .catch((error) => {
      console.error("Error loading language data:", error);
    });
}

// Funktion zum Aktualisieren des Inhalts auf der Seite
export function updateContent(languageData) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (languageData[key]) {
      element.innerHTML = languageData[key];
    } else {
      console.warn(`Missing translation for key: ${key}`);
    }
  });
}

// Initiale Sprachsetzung bei DOMContentLoaded
export async function initializeLanguageSwitcher() {
  document.addEventListener("DOMContentLoaded", async () => {
    const userPreferredLanguage = localStorage.getItem("language") || "de";
    try {
      const languageData = await fetchLanguageData(userPreferredLanguage);
      updateContent(languageData);
    } catch (error) {
      console.error("Error initializing language switcher:", error);
    }
  });
}
