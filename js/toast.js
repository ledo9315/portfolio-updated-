export class Toast {
  constructor() {
    document
      .getElementById("contactForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault(); // Verhindere das Standardverhalten (kein Reload, kein Redirect)

        const form = e.target;
        const formData = new FormData(form);

        try {
          const response = await fetch(form.action, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            // Zeige den Toast bei erfolgreichem Absenden
            showToast();

            // Formular zurücksetzen
            form.reset();
          } else {
            // Fehlermeldung anzeigen, falls etwas schiefgeht
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
      toast.style.display = "block"; // Zeige den Toast an
      toast.classList.add("bounceInRight");

      setTimeout(() => {
        toast.style.display = "none"; // Blende den Toast nach 3 Sekunden aus
      }, 3000);
    }
  }
}
