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
js/main.js                    formulaire de liste d'attente, envoyé à Formspree
js/questionnaire.js           questionnaire : questions selon le profil, envoi à Formspree
js/notification.js            message « réponses enregistrées » sur l'accueil après le questionnaire
js/navigation.js              défilement vers les sections sans « #ancre » dans l'adresse
*.html à la racine            anciennes adresses, redirigées vers les nouvelles
img/cartes/                   images des cartes Pokémon des maquettes (WebP, 300 px de large)
fonts/                        polices du site (WOFF, réduites aux caractères latins) et leurs licences OFL
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

Les fichiers CSS et JS sont appelés avec un numéro de version (`css/styles.css?v=20261111c`).
Après une modification de ces fichiers, changez ce numéro dans toutes les pages (`index.html`,
`questionnaire/`, `mentions-legales/`, `confidentialite/`) : sinon les visiteurs peuvent garder
l'ancienne version en cache et la mélanger avec le nouveau HTML.

## Liste d'attente

Le formulaire envoie l'e-mail, le profil (collectionneur ou boutique), le consentement
et la date à Formspree (adresse dans `ADRESSE_FORMULAIRE`, en haut de `js/main.js`).
Les inscriptions se consultent et s'exportent depuis le tableau de bord Formspree.
Un champ caché `_gotcha` bloque les robots.

Engagement pris dans la politique de confidentialité : les inscriptions sont supprimées
au plus tard 12 mois après le lancement de l'application. Cette suppression est manuelle,
dans Formspree.

## Questionnaire

`questionnaire/index.html` affiche des questions différentes selon le profil choisi
(collectionneur, boutique, organisateur). Les réponses partent sur le même formulaire
Formspree que la liste d'attente, avec le champ `formulaire: questionnaire` pour les
distinguer. Pour les recevoir à part, créez un second formulaire Formspree et changez
`ADRESSE_QUESTIONNAIRE` en haut de `js/questionnaire.js`.

Après l'envoi, la personne revient sur l'accueil (`/?questionnaire=merci`) ; `js/notification.js`
affiche une notification de confirmation puis retire le paramètre de l'adresse.

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
