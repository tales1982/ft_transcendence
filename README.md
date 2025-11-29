# ft_transcendence
42Luxembourg

OVERVIEW OF THE REPO STRUCTURE

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

PHASE 0 — Preparation

Objective: To get everything aligned before coding.

Read the entire subject (already done).

en.subject-transcendence

Create the ft_transcendence repository.

Configure .gitignore (node_modules, dist, .env, etc.).

Create empty backend/, frontend/, and blockchain/ files.

PHASE 1 — Infrastructure & Docker base (no logic yet)

Objective: To have a `docker compose up` command that starts up the static backend and frontend.

1.1 Basic Node + Fastify Backend

Inside backend/:

npm init -y

Dependencies:

fastify, fastify-plugin, fastify-websocket or @fastify/websocket

typescript, ts-node-dev, @types/node

Create:

tsconfig.json

src/index.ts with:

Fastify server creation

GET route /health returning { status: "ok" }

Serving static files from the frontend/dist folder (later).

1.2 Configured TS + bundler + Tailwind Frontend

In frontend/:

You can use Vite (only as a bundler, not a UI framework): npm create vite@latest → TypeScript template.

Add Tailwind (as per docs) – remember it's a module requirement.

Create a test page with Hello Pong.

1.3 Initial Docker

Dockerfile in the root directory:

Base Node image

Build frontend → copy frontend/dist into backend/public

Build backend → run node dist/index.js

docker-compose.yml:

An app service that builds this Dockerfile

Exposes https://localhost:8443 (HTTPS will be adjusted in the security phase)

Delivery of this phase:

docker compose up starts Fastify serving the simple SPA.

PHASE 2 — SQLite + Data Model

Objective: have database created and connector ready.

2.1 Define Schema

Create backend/schema.sql with the minimum tables:

users

friends

tournaments

tournament_players

matches

messages

blocked_users

blockchain_scores

2.2 Database Plugin

In backend/src/plugins/db.ts:

Use better-sqlite3 or sqlite3 (small, acceptable library).

Open the file, e.g., data/database.sqlite.

On initialization:

Run schema.sql if the database is empty.

Export instance to use in models.

Delivery of this phase:

Server starts, connects to SQLite, GET /health confirms.

PHASE 3 — REST Core Backend (Auth, Users, Tournament, Matches)

Objective: to have a stable REST API for the frontend to consume.

3.1 Auth + User Management (Basic Part)

In routes/auth.route.ts:

POST /auth/register

POST /auth/login

In plugins/auth.ts:

Configure JWT (e.g., fastify-jwt).

Use the authGuard middleware to protect routes.

In routes/user.route.ts:

GET /users/me

PATCH /users/me

POST /users/me/avatar (simple upload or URL only)

GET /users/:id

POST /users/:id/friends (add friend)

GET /users/me/friends

3.2 Tournaments and Matches

In routes/tournament.route.ts:

POST /tournaments (create)

POST /tournaments/:id/join (join tournament)

POST /tournaments/:id/start (generate match list)

GET /tournaments/:id (details + matches)

In routes/match.route.ts:

GET /matches/:id

POST /matches/:id/result (receive final score, update user wins/losses, save history)

Delivery of this phase:

You can do it via Postman:

Register user

Log in and get token

Create tournament, enter, start, save match result.

PHASE 4 — Base SPA Frontend (router + empty pages + i18n)

Objective: to have basic navigation and layout.

4.1 Manual Router (History API)

Create frontend/src/router.ts:

Route map: /login, /lobby, /tournament/:id, /game/:matchId, /profile/:id, /stats.

navigate(path) which performs history.pushState + page render.

main.ts:

Initializes Tailwind

Registers listener window.onpopstate to switch pages.

4.2 Layout + Pages

components/layout/Navbar.ts (link to Home, Profile, Logout)

pages/LoginPage.ts

pages/LobbyPage.ts

pages/TournamentPage.ts

pages/GamePage.ts

pages/ProfilePage.ts

pages/StatsPage.ts

Each page currently only shows a title and some mock buttons.

4.3 Multi-language Module (min. 3)

i18n/en.ts, i18n/fr.ts, i18n/pt.ts with string objects.

i18n/index.ts with:

global state currentLang

function t(key: string) that retrieves from the current dictionary.

Add a LanguageSwitcher to the Navbar.

Deliverables for this phase:

Functional SPA navigation

Basic text language changes (Login, Logout, etc.)

PHASE 5 — Local Pong (required by the subject)

Objective: Locally playable Pong game, two players on the same keyboard.

en.subject-transcedent

5.1 Game Engine

In frontend/src/components/game/:

PongCanvas.ts

Creates the canvas and starts the loop

engine.ts

Loop with requestAnimationFrame

Updates ball and paddle positions

ball.ts, paddle.ts, collision.ts

All physics

5.2 Controls

Player 1: W / S keys

Player 2: ArrowUp / ArrowDown keys

Paddle speed is the same for both.

5.3 Tournament Integration

GamePage receives matchId.

Upon completion of the game:

Displays results screen.

Calls POST /matches/:id/result in the backend.

Delivery of this phase:

You can create tournaments, start matches, play locally, and save results.

PHASE 6 — Matchmaking & Tournament UX

Objective: A visible and usable tournament experience.

6.1 Lobby Screen

List of active tournaments

“Create tournament” button

“Join tournament” button

6.2 Tournament Screen

Show player list (aliases)

Show game order (single bracket or list)

“Play next game” button that leads to /game/:matchId.

Deliverables of this phase:

Visually understandable tournament (who plays with whom, game order).

PHASE 7 — WebSocket Infrastructure (Remote Players)

Objective: Allow remote play between 2 users on different PCs.

7.1 WebSocket Backend

In backend/src/ws/game.ws.ts:

Register clients by matchId.

Events:

join_match → associates a socket with a player (player1/player2).

input → receives key presses (up/down/stop).

state_update → broadcasts the game state.

Important decision:

Server authoritative:

Backend handles ball and paddle physics (better for cheaters).

Front end sends only input (key presses).

Backend sends state (ball and paddle position).

7.2 Frontend WebSocket client

services/ws.ts:

Connects to wss://host/game.

Sends input when keys are pressed.

Updates the engine with state from the server.

7.3 Fallback

If the other player disconnects:

End match

Mark a win by default (W.O.) in the backend.

Delivery of this phase:

Two users logged in on different machines can play the same match remotely via WebSocket. PHASE 8 — Live Chat (Major module)

Objective: real-time chat + user blocking + game invitation + notifications.

8.1 Backend WS Chat

ws/chat.ws.ts:

Each socket authenticated with JWT (token sent on connection).

Events:

message: text, destination (direct or room).

block_user: updates blocked_users.

invite_to_game: sends invitation with matchId or tournamentId.

tournament_notification: used by tournament logic to notify about the next game.

routes/chat.route.ts:

GET /chat/history/:userId (retrieves history with someone).

8.2 Frontend ChatPanel

List of conversations (friendly users).

Chat window with:

Message sending.

“Block user” button.

“Invite to Pong” button. Integration with notifications:

When a tournament_notification arrives, display a banner like:

“Your next game is against @Fulano – Play now”.

Delivery of this phase:

Users exchange messages in real time, block each other, send game invitations, and receive notifications of upcoming matches.

PHASE 9 — User Stats & Dashboards (Minor AI-Algo)

Objective: statistics page per user + per game.

9.1 Backend

In stats.model.ts:

Functions to calculate:

Total games, wins, losses

Win rate

Last X games

In routes/user.route.ts:

GET /users/:id/stats

GET /stats/global (optional)

9.2 Frontend StatsDashboard

In components/dashboard/StatsDashboard.ts:

Display numbers and perhaps simple graphs.

Avoid a giant graphics library; you can:

Draw simple graphs with <canvas> or <svg>.

Or use a very small library that only creates graphs, without "solving the entire module".

Deliverable for this phase:

Stats page showing at least: matches played, wins, losses, recent history.

PHASE 10 — Blockchain (Avalanche + Solidity)

Objective: store the final score of a tournament on the Avalanche blockchain.

10.1 Solidity Contract

In blockchain/contracts/TournamentScores.sol:

Simple structure:

struct Score { address player; uint256 wins; uint256 losses; }

mapping(uint256 => Score[]) scoresByTournament;

Function storeScores(uint256 tournamentId, Score[]) (or equivalent).

Deploy on the Avalanche testnet using Hardhat.

10.2 Backend Integration

blockchain.route.ts:

POST /blockchain/tournaments/:id/publish:

Retrieves the final tournament results from the database.

Builds an array of scores.

Calls a function from the contract.

Saves the tx_hash in blockchain_scores.

When to call this?
After the tournament ends (e.g., "Publish to blockchain" button on the tournament screen).

10.3 Frontend

On the TournamentPage:

Show status:

“Not published / Published ✅ (tx: 0x...)”

Button (restricted to the tournament creator) to publish.

Delivery of this phase:

A finished tournament can send its scores to Avalanche and display the tx hash on the frontend.

PHASE 11 — Security, HTTPS, and Final Polishing

Objective: To fulfill ALL security requirements of the subject.

en.subject-transcedent

11.1 HTTPS

Generate a self-signed certificate for development.

Configure Fastify to use HTTPS (not just HTTP).

Ensure that:

Front consumes API via https://

WebSocket uses wss://.

11.2 Protections

All inputs:

Validated on the backend (size, types, regex when needed).

SQL injection:

Never concatenate strings with user data.

Use prepared parameters.

XSS:

Escape content coming from the backend before injecting it into the DOM.

Never innerHTML with API content, prefer textContent.

JWT:

Tokens with expiration.

Refresh token, if desired.

11.3 Errors

No JS errors in the browser console.

Standardized error responses:

{ error: "message" }.

PHASE 12 — Packaging & README

Objective: to get the project ready for evaluation.

README.md explaining:

How to run (docker compose up --build).

Implemented modules and where.

Main API routes.

Game flow (how to test remote, chat, blockchain).

Check:

SPA works with browser back/forward.

Local and remote games work.

Tournament, chat, stats, i18n, blockchain: all accessible.
