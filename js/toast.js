export class Toast {
  constructor() {
    // Prüfen ob wir auf der Kontaktseite sind
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
      // Wenn kein Kontaktformular vorhanden ist, Toast-Klasse nicht initialisieren
      console.log(
        "[Toast] Kein Kontaktformular gefunden - Toast wird übersprungen"
      );
      return;
    }

    this.initContactForm(contactForm);
  }

  initContactForm(form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Verhindere das Standardverhalten (kein Reload, kein Redirect)

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Zeige den Toast bei erfolgreichem Absenden
          this.showToast();

          // Formular zurücksetzen
          form.reset();
        } else {
          // Fehlermeldung anzeigen, falls etwas schiefgeht
          this.showErrorToast(
            "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
          );
        }
      } catch (error) {
        // Error handling without console output for production
        this.showErrorToast(
          "Es ist ein Netzwerkfehler aufgetreten. Bitte versuche es später erneut."
        );
      }
    });
  }

  showToast() {
    const toast = document.getElementById("toast");
    if (!toast) {
      console.warn("[Toast] Toast-Element nicht gefunden");
      return;
    }

    toast.style.display = "block"; // Zeige den Toast an
    toast.classList.add("bounceInRight");

    setTimeout(() => {
      toast.style.display = "none"; // Blende den Toast nach 3 Sekunden aus
    }, 3000);
  }

  showErrorToast(message) {
    // Erstelle einen temporären Error-Toast
    const errorToast = document.createElement("div");
    errorToast.className = "toast error-toast";
    errorToast.textContent = message;
    errorToast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #ff6b6b;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 1000;
      animation: bounceInRight 0.5s ease-out;
    `;

    document.body.appendChild(errorToast);

    setTimeout(() => {
      errorToast.remove();
    }, 4000);
  }
}
