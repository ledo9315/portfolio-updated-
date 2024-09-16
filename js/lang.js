let path = window.location.pathname;
let languageFilePath = "/"; // Absolute Pfade verwenden, damit es serverunabhängig funktioniert

if (!path.includes("works") && !path.includes("pages")) {
  languageFilePath = "/"; // Wurzelverzeichnis
} else if (path.includes("works")) {
  languageFilePath = "/works/"; // Pfad anpassen
} else if (path.includes("pages")) {
  languageFilePath = "/pages/"; // Pfad anpassen
}

// Funktion zum Holen einer Sprachdatei
export async function fetchLanguageData(lang) {
  // Cache-Busting hinzufügen
  const url = `${languageFilePath}languages/${lang}.json?${new Date().getTime()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not fetch language file: ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching the language file: ${error.message}`);
    throw error; // Fehler werfen, um die weitere Verarbeitung zu stoppen
  }
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
