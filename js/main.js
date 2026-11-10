/* ==========================================================
   Agora — liste d'attente
   ----------------------------------------------------------
   Pour enregistrer les inscriptions, créez un formulaire chez
   un service gratuit (Formspree, Getform, Basin…) et collez
   son adresse d'envoi ci-dessous, par exemple :
   const ADRESSE_FORMULAIRE = "https://formspree.io/f/abcdwxyz";
   Tant que c'est vide, le formulaire affiche le message de
   remerciement SANS rien enregistrer (mode démonstration).
   ========================================================== */
const ADRESSE_FORMULAIRE = "https://formspree.io/f/xgaagzwk";

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
      email: email.value.trim(),
      profil: form.profil.value,
      consentement: "oui",
      date: new Date().toISOString(),
      _subject: "Agora : nouvelle inscription à la liste d'attente",
    };

    bouton.disabled = true;
    bouton.textContent = "Envoi…";

    try {
      if (ADRESSE_FORMULAIRE) {
        const reponse = await fetch(ADRESSE_FORMULAIRE, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(donnees),
        });
        if (!reponse.ok) throw new Error("HTTP " + reponse.status);
      } else {
        console.warn("Agora : aucune ADRESSE_FORMULAIRE dans js/main.js, l'inscription n'a pas été enregistrée (mode démonstration).", donnees);
      }
      form.hidden = true;
      merci.hidden = false;
      merci.focus();
    } catch (err) {
      erreur("L'inscription n'a pas pu être envoyée. Réessayez dans un instant.");
      bouton.disabled = false;
      bouton.textContent = "M'inscrire";
    }
  });
});
