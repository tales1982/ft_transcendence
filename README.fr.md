# ft_transcendence

> Une plateforme de jeu Pong multijoueur en temps réel avec tournois, chat en direct et intégration blockchain.

**42 Luxembourg**

## Aperçu

ft_transcendence est une application web full-stack qui modernise le jeu classique Pong avec des capacités multijoueurs en temps réel, la gestion de tournois, un chat en direct et le stockage des scores sur blockchain.

## Stack Technique

- **Frontend**: TypeScript SPA + Tailwind CSS + Canvas API
- **Backend**: Fastify + SQLite + WebSocket + JWT
- **Blockchain**: Avalanche + Solidity (Hardhat)
- **Infrastructure**: Docker + Docker Compose

## Structure du Répertoire

```
ft_transcendence/
│
├── backend/              # Fastify + SQLite + WebSocket + JWT
│   ├── src/
│   │   ├── index.ts
│   │   ├── config.ts
│   │   ├── plugins/
│   │   │   ├── db.ts
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── user.route.ts
│   │   │   ├── tournament.route.ts
│   │   │   ├── match.route.ts
│   │   │   └── chat.route.ts
│   │   ├── ws/
│   │   │   ├── chat.ws.ts
│   │   │   └── game.ws.ts
│   │   ├── models/
│   │   └── utils/
│   ├── schema.sql
│   └── package.json
│
├── frontend/             # SPA TS + Tailwind + Canvas Pong
│   ├── src/
│   │   ├── main.ts
│   │   ├── router.ts
│   │   ├── i18n/
│   │   │   ├── en.ts
│   │   │   ├── fr.ts
│   │   │   └── pt.ts
│   │   ├── styles/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── game/
│   │   │   ├── chat/
│   │   │   └── dashboard/
│   │   └── services/
│   ├── public/
│   └── package.json
│
├── blockchain/           # Avalanche + Solidity
│   ├── contracts/
│   ├── scripts/
│   └── hardhat.config.js
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Fonctionnalités

- **Jeu Pong Multijoueur**: Gameplay en temps réel utilisant WebSocket
- **Système de Tournois**: Créer et rejoindre des tournois avec matchmaking automatique
- **Chat en Direct**: Messagerie en temps réel avec système d'amis et blocage d'utilisateurs
- **Profils Utilisateurs**: Profils personnalisables avec avatars et gestion des amis
- **Tableau de Statistiques**: Suivi des victoires, défaites et historique des parties
- **Intégration Blockchain**: Scores de tournois stockés sur la blockchain Avalanche
- **Internationalisation**: Support de plusieurs langues (EN, FR, PT)
- **Authentification Sécurisée**: Authentification basée sur JWT avec HTTPS

## Démarrage Rapide

```bash
# Cloner le répertoire
git clone https://github.com/yourusername/ft_transcendence.git
cd ft_transcendence

# Démarrer l'application
docker compose up --build
```

L'application sera disponible à `https://localhost:8443`

## Phases de Développement

### PHASE 0 — Préparation

**Objectif**: Tout aligner avant de coder

- Lire l'ensemble du sujet
- Créer le répertoire ft_transcendence
- Configurer .gitignore (node_modules, dist, .env, etc.)
- Créer les répertoires vides backend/, frontend/, et blockchain/

### PHASE 1 — Infrastructure & Base Docker

**Objectif**: Avoir `docker compose up` qui démarre le backend et le frontend

#### 1.1 Backend Node + Fastify de Base
- Initialiser le projet dans `backend/`
- Dépendances: fastify, fastify-plugin, @fastify/websocket, typescript, ts-node-dev
- Créer `tsconfig.json`
- Créer `src/index.ts` avec:
  - Création du serveur Fastify
  - Route GET `/health` retournant `{ status: "ok" }`
  - Service de fichiers statiques depuis frontend/dist

#### 1.2 Frontend TS + Bundler + Tailwind Configuré
- Utiliser Vite comme bundler: `npm create vite@latest`
- Ajouter Tailwind CSS
- Créer une page de test avec "Hello Pong"

#### 1.3 Docker Initial
- **Dockerfile**: Image Node de base, build frontend, build backend
- **docker-compose.yml**: Service app exposant `https://localhost:8443`

**Livrable**: `docker compose up` démarre Fastify servant la SPA simple

### PHASE 2 — SQLite + Modèle de Données

**Objectif**: Avoir la base de données créée et le connecteur prêt

#### 2.1 Définir le Schéma
Créer `backend/schema.sql` avec les tables:
- `users`
- `friends`
- `tournaments`
- `tournament_players`
- `matches`
- `messages`
- `blocked_users`
- `blockchain_scores`

#### 2.2 Plugin Base de Données
- Utiliser better-sqlite3 ou sqlite3
- Créer `backend/src/plugins/db.ts`
- Ouvrir `data/database.sqlite`
- Exécuter schema.sql à l'initialisation si la base de données est vide
- Exporter l'instance pour les modèles

**Livrable**: Le serveur démarre, se connecte à SQLite, GET `/health` confirme

### PHASE 3 — Backend REST Core

**Objectif**: API REST stable pour le frontend

#### 3.1 Auth + Gestion des Utilisateurs
**routes/auth.route.ts**:
- POST `/auth/register`
- POST `/auth/login`

**plugins/auth.ts**:
- Configurer JWT (fastify-jwt)
- Implémenter le middleware authGuard

**routes/user.route.ts**:
- GET `/users/me`
- PATCH `/users/me`
- POST `/users/me/avatar`
- GET `/users/:id`
- POST `/users/:id/friends`
- GET `/users/me/friends`

#### 3.2 Tournois et Matchs
**routes/tournament.route.ts**:
- POST `/tournaments` - Créer un tournoi
- POST `/tournaments/:id/join` - Rejoindre un tournoi
- POST `/tournaments/:id/start` - Générer la liste des matchs
- GET `/tournaments/:id` - Obtenir les détails + matchs

**routes/match.route.ts**:
- GET `/matches/:id`
- POST `/matches/:id/result` - Sauvegarder le score final et mettre à jour les stats

**Livrable**: Flux utilisateur complet via Postman (inscription → connexion → créer tournoi → rejoindre → démarrer → sauvegarder résultat)

### PHASE 4 — Frontend SPA de Base

**Objectif**: Navigation et mise en page de base

#### 4.1 Routeur Manuel (History API)
**frontend/src/router.ts**:
- Carte des routes: `/login`, `/lobby`, `/tournament/:id`, `/game/:matchId`, `/profile/:id`, `/stats`
- `navigate(path)` utilisant `history.pushState`
- Enregistrer l'écouteur `window.onpopstate` dans `main.ts`

#### 4.2 Mise en Page + Pages
- `components/layout/Navbar.ts` - Navigation (Accueil, Profil, Déconnexion)
- `pages/LoginPage.ts`
- `pages/LobbyPage.ts`
- `pages/TournamentPage.ts`
- `pages/GamePage.ts`
- `pages/ProfilePage.ts`
- `pages/StatsPage.ts`

#### 4.3 Module Multi-langue
- Créer `i18n/en.ts`, `i18n/fr.ts`, `i18n/pt.ts`
- Créer `i18n/index.ts` avec:
  - État global `currentLang`
  - Fonction `t(key: string)` pour récupérer les traductions
- Ajouter LanguageSwitcher à la Navbar

**Livrable**: Navigation SPA fonctionnelle avec changement de langue

### PHASE 5 — Jeu Pong Local

**Objectif**: Pong jouable localement, deux joueurs sur le même clavier

#### 5.1 Moteur de Jeu
**frontend/src/components/game/**:
- `PongCanvas.ts` - Crée le canvas et démarre la boucle de jeu
- `engine.ts` - Boucle requestAnimationFrame, met à jour les positions de la balle et des raquettes
- `ball.ts`, `paddle.ts`, `collision.ts` - Physique du jeu

#### 5.2 Contrôles
- **Joueur 1**: Touches W / S
- **Joueur 2**: Touches Flèche Haut / Flèche Bas
- Vitesse de raquette égale pour les deux joueurs

#### 5.3 Intégration Tournoi
- GamePage reçoit `matchId`
- À la fin du jeu:
  - Afficher l'écran des résultats
  - Appeler POST `/matches/:id/result`

**Livrable**: Créer des tournois, démarrer des matchs, jouer localement, sauvegarder les résultats

### PHASE 6 — Matchmaking & UX Tournoi

**Objectif**: Expérience de tournoi visible et utilisable

#### 6.1 Écran Lobby
- Liste des tournois actifs
- Bouton "Créer un tournoi"
- Bouton "Rejoindre un tournoi"

#### 6.2 Écran Tournoi
- Afficher la liste des joueurs (pseudonymes)
- Afficher l'ordre des parties (bracket simple ou liste)
- Bouton "Jouer la prochaine partie" → navigue vers `/game/:matchId`

**Livrable**: Flux de tournoi visuellement compréhensible

### PHASE 7 — Infrastructure WebSocket (Joueurs Distants)

**Objectif**: Permettre le jeu à distance entre 2 utilisateurs sur différents PC

#### 7.1 Backend WebSocket
**backend/src/ws/game.ws.ts**:
- Enregistrer les clients par `matchId`
- Événements:
  - `join_match` - Associer le socket avec un joueur (player1/player2)
  - `input` - Recevoir les pressions de touches (haut/bas/arrêt)
  - `state_update` - Diffuser l'état du jeu

**Approche serveur autoritaire**:
- Le backend gère la physique de la balle et des raquettes
- Le frontend envoie uniquement les entrées (pressions de touches)
- Le backend envoie l'état (positions de la balle et des raquettes)

#### 7.2 Client WebSocket Frontend
**services/ws.ts**:
- Se connecter à `wss://host/game`
- Envoyer les entrées lors des pressions de touches
- Mettre à jour le moteur avec l'état du serveur

#### 7.3 Fallback
- En cas de déconnexion d'un joueur: Terminer le match, marquer W.O. (forfait) dans le backend

**Livrable**: Deux utilisateurs sur différentes machines peuvent jouer à distance via WebSocket

### PHASE 8 — Chat en Direct

**Objectif**: Chat en temps réel + blocage d'utilisateurs + invitations de jeu + notifications

#### 8.1 Backend WebSocket Chat
**ws/chat.ws.ts**:
- Authentifier chaque socket avec JWT
- Événements:
  - `message` - Texte, destination (direct ou salle)
  - `block_user` - Mettre à jour la table `blocked_users`
  - `invite_to_game` - Envoyer une invitation avec `matchId` ou `tournamentId`
  - `tournament_notification` - Notifier du prochain jeu

**routes/chat.route.ts**:
- GET `/chat/history/:userId` - Récupérer l'historique du chat

#### 8.2 Frontend ChatPanel
- Liste des conversations (amis)
- Fonctionnalités de la fenêtre de chat:
  - Envoi de messages
  - Bouton "Bloquer l'utilisateur"
  - Bouton "Inviter au Pong"
- Bannière de notification: "Votre prochain jeu est contre @Utilisateur – Jouer maintenant"

**Livrable**: Messagerie en temps réel, blocage d'utilisateurs, invitations de jeu, notifications de match

### PHASE 9 — Statistiques Utilisateurs & Tableaux de Bord

**Objectif**: Page de statistiques par utilisateur + par jeu

#### 9.1 Backend
**stats.model.ts** - Calculer:
- Total de parties, victoires, défaites
- Taux de victoire
- Dernières X parties

**routes/user.route.ts**:
- GET `/users/:id/stats`
- GET `/stats/global` (optionnel)

#### 9.2 Frontend StatsDashboard
**components/dashboard/StatsDashboard.ts**:
- Afficher les stats avec des graphiques simples
- Utiliser `<canvas>` ou `<svg>` pour la visualisation
- Éviter les bibliothèques graphiques lourdes

**Livrable**: Page de stats affichant les parties jouées, victoires, défaites, historique récent

### PHASE 10 — Blockchain (Avalanche + Solidity)

**Objectif**: Stocker les scores de tournoi sur la blockchain Avalanche

#### 10.1 Contrat Solidity
**blockchain/contracts/TournamentScores.sol**:
```solidity
struct Score {
  address player;
  uint256 wins;
  uint256 losses;
}
mapping(uint256 => Score[]) scoresByTournament;
function storeScores(uint256 tournamentId, Score[]) {...}
```
- Déployer sur le testnet Avalanche en utilisant Hardhat

#### 10.2 Intégration Backend
**blockchain.route.ts**:
- POST `/blockchain/tournaments/:id/publish`:
  - Récupérer les résultats finaux du tournoi depuis la base de données
  - Construire un tableau de scores
  - Appeler la fonction du contrat
  - Sauvegarder le `tx_hash` dans la table `blockchain_scores`

#### 10.3 Frontend
**TournamentPage**:
- Afficher le statut: "Non publié / Publié ✅ (tx: 0x...)"
- Bouton "Publier sur la blockchain" (créateur du tournoi uniquement)

**Livrable**: Les tournois terminés peuvent publier les scores sur Avalanche et afficher le hash de transaction

### PHASE 11 — Sécurité, HTTPS et Finitions

**Objectif**: Satisfaire TOUTES les exigences de sécurité

#### 11.1 HTTPS
- Générer un certificat auto-signé pour le développement
- Configurer Fastify pour utiliser HTTPS
- S'assurer que:
  - Le frontend consomme l'API via `https://`
  - Le WebSocket utilise `wss://`

#### 11.2 Protections de Sécurité
**Validation des Entrées**:
- Valider toutes les entrées côté backend (taille, types, regex)

**Prévention des Injections SQL**:
- Ne jamais concaténer les chaînes avec les données utilisateur
- Utiliser des requêtes préparées/paramètres

**Prévention XSS**:
- Échapper le contenu avant injection dans le DOM
- Utiliser `textContent` au lieu de `innerHTML` pour le contenu utilisateur

**Sécurité JWT**:
- Tokens avec expiration
- Optionnel: Implémentation du refresh token

#### 11.3 Gestion des Erreurs
- Aucune erreur JavaScript dans la console du navigateur
- Réponses d'erreur standardisées: `{ error: "message" }`

**Livrable**: Application sécurisée, prête pour la production

### PHASE 12 — Packaging & Documentation

**Objectif**: Projet prêt pour l'évaluation

#### Liste de Vérification Finale
- [ ] La SPA fonctionne avec la navigation avant/arrière du navigateur
- [ ] Jeux locaux et distants fonctionnels
- [ ] Système de tournois complet
- [ ] Chat en direct opérationnel
- [ ] Statistiques utilisateurs accessibles
- [ ] Support multi-langue (i18n)
- [ ] Intégration blockchain fonctionnelle
- [ ] Toutes les mesures de sécurité implémentées

**Livrable**: Application entièrement documentée, prête pour le déploiement

## Routes API

### Authentification
- POST `/auth/register` - Enregistrer un nouvel utilisateur
- POST `/auth/login` - Connexion et réception du JWT

### Utilisateurs
- GET `/users/me` - Obtenir l'utilisateur actuel
- PATCH `/users/me` - Mettre à jour l'utilisateur actuel
- POST `/users/me/avatar` - Télécharger un avatar
- GET `/users/:id` - Obtenir un utilisateur par ID
- POST `/users/:id/friends` - Ajouter un ami
- GET `/users/me/friends` - Obtenir la liste d'amis
- GET `/users/:id/stats` - Obtenir les statistiques de l'utilisateur

### Tournois
- POST `/tournaments` - Créer un tournoi
- POST `/tournaments/:id/join` - Rejoindre un tournoi
- POST `/tournaments/:id/start` - Démarrer un tournoi
- GET `/tournaments/:id` - Obtenir les détails du tournoi

### Matchs
- GET `/matches/:id` - Obtenir les détails du match
- POST `/matches/:id/result` - Soumettre le résultat du match

### Chat
- GET `/chat/history/:userId` - Obtenir l'historique du chat

### Blockchain
- POST `/blockchain/tournaments/:id/publish` - Publier les scores sur la blockchain

### Santé
- GET `/health` - Vérification de l'état

## Flux de Test

1. **Configuration**: `docker compose up --build`
2. **Enregistrer** deux utilisateurs via `/auth/register`
3. **Connexion** des deux utilisateurs pour obtenir les tokens JWT
4. **Créer un Tournoi** avec l'utilisateur 1
5. **Rejoindre le Tournoi** avec l'utilisateur 2
6. **Démarrer le Tournoi** pour générer les matchs
7. **Jouer** localement ou à distance via WebSocket
8. **Soumettre les Résultats** pour mettre à jour les stats
9. **Voir les Stats** sur les profils utilisateurs
10. **Publier sur la Blockchain** lorsque le tournoi se termine

## Licence

Ce projet fait partie du cursus 42.

---

**42 Luxembourg** - Projet ft_transcendence
