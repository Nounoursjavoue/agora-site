/* ==========================================================
   Agora — notification de confirmation
   Après l'envoi du questionnaire, l'accueil est ouvert avec
   « ?questionnaire=merci » : on affiche un message, puis on
   retire ce paramètre de l'adresse.
   ========================================================== */
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("questionnaire") !== "merci") return;
  params.delete("questionnaire");
  const reste = params.toString();
  history.replaceState(null, "", location.pathname + (reste ? "?" + reste : "") + location.hash);

  const afficher = () => {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.setAttribute("role", "status");
    notif.innerHTML =
      '<span class="notification__icone" aria-hidden="true">✓</span>' +
      '<p><strong>Merci, vos réponses ont bien été enregistrées.</strong><br>Elles vont servir à construire Agora.</p>' +
      '<button type="button" class="notification__fermer" aria-label="Fermer la notification">×</button>';
    document.body.appendChild(notif);
    requestAnimationFrame(() => notif.classList.add("notification--visible"));
    const fermer = () => {
      notif.classList.remove("notification--visible");
      setTimeout(() => notif.remove(), 300);
    };
    notif.querySelector("button").addEventListener("click", fermer);
    setTimeout(fermer, 7000);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", afficher);
  else afficher();
})();
