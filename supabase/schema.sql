-- ==========================================================
-- Agora : tables du site vitrine (liste d'attente + questionnaire)
-- À coller dans Supabase › SQL Editor › New query, puis « Run ».
-- Le script peut être relancé sans risque.
--
-- Sécurité : les visiteurs (rôle « anon », utilisé par la clé
-- publishable du site) peuvent seulement AJOUTER une ligne.
-- Ils ne peuvent ni lire, ni modifier, ni supprimer quoi que ce soit.
-- Les réponses se consultent dans Supabase › Table Editor.
-- ==========================================================

create table if not exists public.inscriptions (
  id            uuid primary key default gen_random_uuid(),
  cree_le       timestamptz not null default now(),
  email         text not null unique
                check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  profil        text not null check (profil in ('collectionneur', 'boutique')),
  consentement  boolean not null check (consentement)
);

create table if not exists public.reponses_questionnaire (
  id            uuid primary key default gen_random_uuid(),
  cree_le       timestamptz not null default now(),
  profil        text not null
                check (profil in ('Collectionneur', 'Boutique', 'Organisateur d''événements')),
  reponses      jsonb not null
                check (jsonb_typeof(reponses) = 'object' and pg_column_size(reponses) < 20000),
  email         text
                check (email is null or (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  consentement  boolean not null default false,
  check (email is null or consentement)
);

-- Row Level Security : tout est fermé par défaut
alter table public.inscriptions enable row level security;
alter table public.reponses_questionnaire enable row level security;

-- Droits : les visiteurs peuvent seulement insérer, et seulement ces colonnes
revoke all on public.inscriptions, public.reponses_questionnaire from anon, authenticated;
grant insert (email, profil, consentement) on public.inscriptions to anon;
grant insert (profil, reponses, email, consentement) on public.reponses_questionnaire to anon;

drop policy if exists "Visiteurs : inscription" on public.inscriptions;
create policy "Visiteurs : inscription" on public.inscriptions
  for insert to anon with check (true);

drop policy if exists "Visiteurs : réponse au questionnaire" on public.reponses_questionnaire;
create policy "Visiteurs : réponse au questionnaire" on public.reponses_questionnaire
  for insert to anon with check (true);
