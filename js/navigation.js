/* ==========================================================
   Agora — navigation sans « #ancre » dans l'adresse
   Les liens internes (#inscription, #contact…) font défiler la
   page sans modifier l'adresse affichée. Une adresse arrivant
   avec une ancre (ex. depuis une autre page) est nettoyée.
   ========================================================== */
(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const allerA = (cible, focus) => {
    cible.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    if (focus) {
      if (!cible.hasAttribute("tabindex")) cible.setAttribute("tabindex", "-1");
      cible.focus({ preventScroll: true });
    }
  };

  // Clic sur un lien vers une ancre de la page
  document.addEventListener("click", (e) => {
    const lien = e.target.closest('a[href^="#"]');
    if (!lien) return;
    const cible = document.getElementById(lien.getAttribute("href").slice(1));
    if (!cible) return;
    e.preventDefault();
    allerA(cible, lien.classList.contains("skip-link"));
  });

  // Arrivée sur la page avec une ancre : on défile puis on retire l'ancre de l'adresse
  if (location.hash) {
    const cible = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    history.replaceState(null, "", location.pathname + location.search);
    if (cible) {
      const defiler = () => cible.scrollIntoView({ block: "start" });
      if (document.readyState === "complete") defiler();
      else window.addEventListener("load", defiler);
    }
  }
})();
