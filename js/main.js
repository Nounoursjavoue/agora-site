/* ==========================================================
   Agora — liste d'attente
   Les inscriptions sont enregistrées dans Supabase, table
   « inscriptions » (voir js/supabase.js et supabase/schema.sql).
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const annee = document.getElementById("annee");
  if (annee) annee.textContent = new Date().getFullYear();

  const form = document.getElementById("form-attente");
  if (!form) return;
  const message = form.querySelector(".attente__message");
  const merci = document.querySelector(".attente__merci");
  const bouton = form.querySelector('button[type="submit"]');

  // Le bouton « Devenir boutique partenaire » présélectionne le profil boutique
  document.querySelectorAll("[data-profil]").forEach((lien) => {
    lien.addEventListener("click", () => {
      const radio = document.getElementById("profil-" + lien.dataset.profil);
      if (radio) radio.checked = true;
      setTimeout(() => document.getElementById("email").focus({ preventScroll: true }), 400);
    });
  });

  const erreur = (texte, champ) => {
    message.textContent = texte;
    message.className = "attente__message attente__message--erreur";
    if (champ) champ.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";
    const email = form.email;
    const consentement = form.consentement;

    if (!email.value.trim() || !email.checkValidity()) {
      return erreur("Entrez une adresse e-mail valide.", email);
    }
    if (!consentement.checked) {
      return erreur("Cochez la case pour accepter d'être prévenu du lancement.", consentement);
    }

    // Champ piège invisible : un robot le remplit, un humain non
    if (form._gotcha && form._gotcha.value) return;

    const donnees = {
      email: email.value.trim().toLowerCase(),
      profil: form.profil.value,
      consentement: true,
    };

    bouton.disabled = true;
    bouton.textContent = "Envoi…";

    try {
      await envoyerSupabase("inscriptions", donnees, { ignorerDoublon: true });
      form.hidden = true;
      merci.hidden = false;
      merci.focus();
    } catch (err) {
      console.error("Inscription non envoyée :", err);
      erreur("L'inscription n'a pas pu être envoyée. Réessayez dans un instant. (" + err.message + ")");
      bouton.disabled = false;
      bouton.textContent = "M'inscrire";
    }
  });
});
