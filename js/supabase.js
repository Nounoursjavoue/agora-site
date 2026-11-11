/* ==========================================================
   Agora — envoi des formulaires à Supabase (serveur à Paris)
   La clé ci-dessous est la clé « publishable » : elle est faite
   pour être publique. Les règles de sécurité de la base
   (supabase/schema.sql) n'autorisent qu'à AJOUTER une ligne :
   personne ne peut lire les réponses avec cette clé.
   Ne mettez JAMAIS ici une clé « secret » (sb_secret_…).
   ========================================================== */
const SUPABASE_URL = "https://ewybqexxwkkealbunlny.supabase.co";
const SUPABASE_CLE = "sb_publishable_fkTt2ohRS3fqznsNxSlQsw_SnUi4d_3";

// Ajoute une ligne dans une table. « ignorerDoublon » : une adresse déjà
// inscrite est traitée comme un succès, sans révéler qu'elle existait.
async function envoyerSupabase(table, ligne, { ignorerDoublon = false } = {}) {
  const reponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_CLE,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(ligne),
  });
  if (reponse.ok || (ignorerDoublon && reponse.status === 409)) return;
  const info = await reponse.json().catch(() => ({}));
  throw new Error("Erreur " + reponse.status + (info.message ? " : " + info.message : ""));
}
