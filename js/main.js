import { initHamburgerMenu } from "./hamburger.js";
import { initNavigation, initScrollNavigation } from "./navigation.js";
import { initSectionHighlighting } from "./timeline.js";
import { initializeLanguageSwitcher, changeLanguage } from "./lang.js";

initHamburgerMenu();
initNavigation();
initScrollNavigation();
initSectionHighlighting();
initializeLanguageSwitcher();

window.changeLanguage = changeLanguage;

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Verhindere Standardverhalten des Formulars

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Formular erfolgreich abgeschickt, zeige den Toast
        showToast();

        // Formular leeren
        form.reset();
      } else {
        // Falls ein Fehler auftritt
        alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert(
        "Es ist ein Netzwerkfehler aufgetreten. Bitte versuche es später erneut."
      );
    }
  });

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Toast nach 3 Sekunden ausblenden
}
