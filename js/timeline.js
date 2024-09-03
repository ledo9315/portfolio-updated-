// Funktion zur Aktualisierung der aktiven Klasse basierend auf dem Scrollen durch Abschnitte
export function initSectionHighlighting() {
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
}
