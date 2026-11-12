/* ==========================================================
   Agora — préférences d'affichage : mode sombre et police
   adaptée à la dyslexie. Chargé dans <head> sans « defer »
   pour appliquer le choix avant l'affichage (pas de flash).
   Le choix est gardé dans ce navigateur seulement
   (localStorage) : rien n'est envoyé, ce n'est pas un cookie.
   ========================================================== */
(() => {
  const racine = document.documentElement;
  const lire = (cle) => { try { return localStorage.getItem(cle); } catch (e) { return null; } };
  const ecrire = (cle, valeur) => { try { localStorage.setItem(cle, valeur); } catch (e) { /* navigation privée : sans mémoire */ } };
  const systemeSombre = window.matchMedia("(prefers-color-scheme: dark)");

  // Thème : choix enregistré, sinon celui de l'appareil
  const appliquerTheme = () => {
    racine.dataset.theme = lire("agora-theme") || (systemeSombre.matches ? "dark" : "light");
  };
  appliquerTheme();
  systemeSombre.addEventListener("change", () => { if (!lire("agora-theme")) { appliquerTheme(); majBoutons(); } });

  if (lire("agora-police") === "dyslexie") racine.dataset.police = "dyslexie";

  const majBoutons = () => {
    document.querySelectorAll("[data-reglage]").forEach((b) => {
      const actif = b.dataset.reglage === "theme"
        ? racine.dataset.theme === "dark"
        : racine.dataset.police === "dyslexie";
      b.setAttribute("aria-pressed", String(actif));
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    majBoutons();
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-reglage]");
      if (!b) return;
      if (b.dataset.reglage === "theme") {
        const theme = racine.dataset.theme === "dark" ? "light" : "dark";
        racine.dataset.theme = theme;
        ecrire("agora-theme", theme);
      } else {
        const actif = racine.dataset.police === "dyslexie";
        if (actif) delete racine.dataset.police; else racine.dataset.police = "dyslexie";
        ecrire("agora-police", actif ? "standard" : "dyslexie");
      }
      majBoutons();
    });
  });
})();
