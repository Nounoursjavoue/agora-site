/* ==========================================================
   Agora — questionnaire
   Les réponses sont envoyées à Formspree, avec le champ
   « formulaire : questionnaire » pour les distinguer des
   inscriptions à la liste d'attente.
   Pour les recevoir dans un formulaire Formspree séparé,
   créez-en un second et remplacez l'adresse ci-dessous.
   ========================================================== */
const ADRESSE_QUESTIONNAIRE = "https://formspree.io/f/xgaagzwk";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-questionnaire");
  if (!form) return;
  const message = form.querySelector(".attente__message");
  const bouton = form.querySelector('button[type="submit"]');
  const blocs = form.querySelectorAll(".quest__bloc");

  // Affiche les questions qui correspondent au profil choisi
  const majBlocs = () => {
    const profil = form.querySelector('input[name="profil"]:checked');
    blocs.forEach((bloc) => { bloc.hidden = !profil || bloc.dataset.pour !== profil.value; });
  };
  form.querySelectorAll('input[name="profil"]').forEach((r) => r.addEventListener("change", majBlocs));
  majBlocs();

  // Questions limitées à un nombre de choix (data-max)
  form.querySelectorAll("fieldset[data-max]").forEach((groupe) => {
    const max = Number(groupe.dataset.max);
    const cases = groupe.querySelectorAll('input[type="checkbox"]');
    const maj = () => {
      const n = [...cases].filter((c) => c.checked).length;
      cases.forEach((c) => { c.disabled = !c.checked && n >= max; });
    };
    cases.forEach((c) => c.addEventListener("change", maj));
  });

  const erreur = (texte, champ) => {
    message.textContent = texte;
    message.className = "attente__message attente__message--erreur";
    if (champ) champ.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";
    if (form._gotcha.value) return;

    const profil = form.querySelector('input[name="profil"]:checked');
    const age = form.querySelector('input[name="age"]:checked');
    if (!profil) return erreur("Indiquez si vous êtes collectionneur, boutique ou organisateur.", form.querySelector('input[name="profil"]'));
    if (!age) return erreur("Indiquez votre tranche d'âge.", form.querySelector('input[name="age"]'));

    const email = form.email.value.trim();
    if (email && !form.email.checkValidity()) return erreur("Cette adresse e-mail n'est pas valide.", form.email);
    if (email && !form.consentement.checked) return erreur("Cochez la case pour que nous puissions utiliser votre e-mail, ou laissez le champ vide.", form.consentement);

    // Réponses : seulement les questions affichées ; les choix multiples sont regroupés
    const donnees = {
      formulaire: "questionnaire",
      _subject: "Agora : nouvelle réponse au questionnaire",
      date: new Date().toISOString(),
    };
    const champs = [...form.elements].filter((el) => el.name && !el.name.startsWith("_") && el.name !== "consentement" && !el.closest("[hidden]"));
    const noms = [...new Set(champs.map((el) => el.name))];
    noms.forEach((nom) => {
      const valeurs = champs
        .filter((el) => el.name === nom && (!["radio", "checkbox"].includes(el.type) || el.checked))
        .map((el) => el.value.trim())
        .filter(Boolean);
      if (valeurs.length) donnees[nom] = valeurs.join(" ; ");
    });
    if (email) {
      donnees.email = email;
      donnees.consentement = "oui";
    }

    bouton.disabled = true;
    bouton.textContent = "Envoi…";
    try {
      const reponse = await fetch(ADRESSE_QUESTIONNAIRE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(donnees),
      });
      if (!reponse.ok) {
        // Formspree explique le refus dans sa réponse : on l'affiche pour pouvoir corriger
        const info = await reponse.json().catch(() => ({}));
        const detail = (info.errors || []).map((e) => e.message).join(" ; ") || info.error || "";
        throw new Error("Erreur " + reponse.status + (detail ? " : " + detail : ""));
      }
      // Retour à l'accueil, qui affiche une notification de confirmation
      window.location.href = "../?questionnaire=merci";
    } catch (err) {
      console.error("Questionnaire non envoyé :", err);
      erreur("Vos réponses n'ont pas pu être envoyées. Réessayez dans un instant. (" + err.message + ")");
      bouton.disabled = false;
      bouton.textContent = "Envoyer mes réponses";
    }
  });
});
