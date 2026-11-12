# Agora — site vitrine

Site de présentation d'[Agora](https://agora-trade.fr/), le réseau social
et la place de marché des collectionneurs, avec la liste d'attente de la bêta.

- En ligne : https://agora-trade.fr/
- Contact : agoratradefr@gmail.com
- Réseaux : [@agoratradefr sur Instagram](https://www.instagram.com/agoratradefr/) et [sur X](https://x.com/agoratradefr)

Le code de l'application mobile se trouve dans un autre dépôt, privé :
`Nounoursjavoue/agora`. Il contient aussi la présentation complète du projet
(fonctionnalités, choix techniques, méthode de travail). Demandez l'accès au porteur du projet.

C'est un site statique en HTML, CSS et JavaScript : aucune installation ni compilation.

## Contenu

```
index.html                    page d'accueil (liste d'attente, chiffres, fonctionnalités, boutiques, feuille de route, contact)
questionnaire/index.html      questionnaire pour collectionneurs, boutiques et organisateurs
mentions-legales/index.html   mentions légales (éditeur, hébergeur)
confidentialite/index.html    politique de confidentialité (RGPD, liste d'attente, questionnaire)
css/styles.css                couleurs, polices et mise en page (variables en haut du fichier)
js/supabase.js                adresse et clé publique Supabase, fonction d'envoi commune aux formulaires
js/main.js                    formulaire de liste d'attente, enregistré dans Supabase
js/questionnaire.js           questionnaire : questions selon le profil, enregistré dans Supabase
supabase/schema.sql           tables et règles de sécurité de la base Supabase
js/notification.js            message « réponses enregistrées » sur l'accueil après le questionnaire
js/preferences.js             mode sombre et police dyslexie (boutons de l'en-tête, choix gardé dans le navigateur)
js/navigation.js              défilement vers les sections sans « #ancre » dans l'adresse
*.html à la racine            anciennes adresses, redirigées vers les nouvelles
img/cartes/                   images des cartes Pokémon des maquettes (WebP, 300 px de large)
fonts/                        polices du site (dont OpenDyslexic en WOFF2) (WOFF, réduites aux caractères latins) et leurs licences OFL
favicon.svg                   icône α de l'onglet
.nojekyll                     indique à GitHub Pages de servir les fichiers tels quels
```

## Adresses propres

Chaque page est un dossier contenant un `index.html` : l'adresse affichée est donc
`agora-trade.fr/questionnaire/` et non `agora-trade.fr/questionnaire.html`.
Pour ajouter une page, créez un dossier avec son `index.html` et préfixez les chemins
des fichiers communs par `../` (`../css/styles.css`, `../js/navigation.js`…).

## Voir le site en local

Lancez un petit serveur depuis ce dossier (les adresses en dossiers ne marchent pas en ouvrant le fichier par double-clic) :

```
python3 -m http.server 8000
```

puis allez sur http://localhost:8000

## Mise en ligne

Le site est publié par GitHub Pages depuis la branche `main`, à la racine du dépôt
(**Settings › Pages › Deploy from a branch › `main` / `(root)`**).
Toute modification poussée sur `main` est en ligne une à deux minutes plus tard.

## Cache des navigateurs

Les fichiers CSS et JS sont appelés avec un numéro de version (`css/styles.css?v=20261112c`).
Après une modification de ces fichiers, changez ce numéro dans toutes les pages (`index.html`,
`questionnaire/`, `mentions-legales/`, `confidentialite/`) : sinon les visiteurs peuvent garder
l'ancienne version en cache et la mélanger avec le nouveau HTML.

## Liste d'attente et questionnaire (Supabase)

Les deux formulaires enregistrent leurs envois dans une base **Supabase** hébergée à Paris
(projet `ewybqexxwkkealbunlny`) :

- table `inscriptions` : e-mail, profil, consentement, date ;
- table `reponses_questionnaire` : profil, réponses (en JSON), e-mail facultatif, date.

Les données se consultent et s'exportent en CSV dans **Supabase › Table Editor**.

Sécurité : le site utilise la clé **publishable** (publique par nature). Les règles de
`supabase/schema.sql` n'autorisent les visiteurs qu'à **ajouter** une ligne, sur des colonnes
précises : ils ne peuvent ni lire, ni modifier, ni supprimer. Pour changer une table, modifiez
ce fichier puis relancez-le dans **SQL Editor**. Ne mettez jamais la clé `sb_secret_…` dans le site.

Une adresse déjà inscrite n'est pas enregistrée deux fois ; le visiteur voit quand même le
message de remerciement, pour ne pas révéler qui est inscrit.

Un champ caché `_gotcha` bloque les robots qui remplissent tous les champs.

Après l'envoi du questionnaire, la personne revient sur l'accueil (`/?questionnaire=merci`) ;
`js/notification.js` affiche une notification de confirmation puis retire le paramètre de l'adresse.

Engagement pris dans la politique de confidentialité : les données sont supprimées au plus tard
12 mois après le lancement de l'application, dans Supabase, dans Formspree (anciens envois,
jusqu'au 11 novembre 2026) et dans la boîte Gmail du projet. Cette suppression est manuelle.

## Règles de contenu

Agora repose sur la confiance : le site ne doit contenir que des informations vraies et vérifiables.

- Les écrans de téléphone sont des maquettes, et la mention qui le dit doit rester visible.
- Chaque chiffre cite sa source, avec la formulation exacte de l'étude.
- Une fonctionnalité ou un tarif non encore disponible est présenté comme prévu.
- Les images de cartes Pokémon portent la mention « © Pokémon » sous chaque groupe de cartes, et la
  mention de marque reste en pied de page. Pas de logo Pokémon ni de partenariat suggéré.
- Tout nouveau prestataire qui reçoit des données doit être ajouté à `confidentialite/index.html`.

## Nom de domaine

Le site est servi sur **agora-trade.fr** (domaine acheté chez IONOS), toujours hébergé
gratuitement par GitHub Pages. L'ancienne adresse `nounoursjavoue.github.io/agora-site/`
redirige automatiquement vers le domaine.

- **Fichier `CNAME`** à la racine : il contient le domaine. Ne pas le supprimer, sinon
  le site repasse sur l'adresse github.io.
- **DNS chez IONOS** : quatre enregistrements A sur `@` (185.199.108.153 à 185.199.111.153),
  quatre AAAA (2606:50c0:8000::153 à 2606:50c0:8003::153) et un CNAME `www` vers
  `nounoursjavoue.github.io`. Les enregistrements « Mail » d'IONOS sont à garder.
- **HTTPS** : certificat fourni gratuitement par GitHub ; « Enforce HTTPS » est coché dans
  **Settings › Pages**.
- Si le site part un jour chez un hébergeur payant, copiez les fichiers dans son dossier public,
  changez les enregistrements DNS et mettez à jour l'hébergeur dans `mentions-legales/index.html`.
