# ft_transcendence

> A real-time multiplayer Pong game platform with tournaments, live chat, and blockchain integration.

**42 Luxembourg**

## Overview

ft_transcendence is a full-stack web application that brings the classic Pong game into the modern era with real-time multiplayer capabilities, tournament management, live chat, and blockchain-based score storage.

## Tech Stack

- **Frontend**: TypeScript SPA + Tailwind CSS + Canvas API
- **Backend**: Fastify + SQLite + WebSocket + JWT
- **Blockchain**: Avalanche + Solidity (Hardhat)
- **Infrastructure**: Docker + Docker Compose

## Repository Structure

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

## Features

- **Multiplayer Pong Game**: Real-time gameplay using WebSocket
- **Tournament System**: Create and join tournaments with automatic matchmaking
- **Live Chat**: Real-time messaging with friend system and user blocking
- **User Profiles**: Customizable profiles with avatars and friend management
- **Statistics Dashboard**: Track wins, losses, and game history
- **Blockchain Integration**: Tournament scores stored on Avalanche blockchain
- **Internationalization**: Support for multiple languages (EN, FR, PT)
- **Secure Authentication**: JWT-based authentication with HTTPS

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ft_transcendence.git
cd ft_transcendence

# Start the application
docker compose up --build
```

The application will be available at `https://localhost:8443`

## Development Phases

### PHASE 0 — Preparation

**Objective**: Get everything aligned before coding

- Read the entire subject
- Create the ft_transcendence repository
- Configure .gitignore (node_modules, dist, .env, etc.)
- Create empty backend/, frontend/, and blockchain/ directories

### PHASE 1 — Infrastructure & Docker Base

**Objective**: Have `docker compose up` start the backend and frontend

#### 1.1 Basic Node + Fastify Backend
- Initialize project in `backend/`
- Dependencies: fastify, fastify-plugin, @fastify/websocket, typescript, ts-node-dev
- Create `tsconfig.json`
- Create `src/index.ts` with:
  - Fastify server creation
  - GET `/health` route returning `{ status: "ok" }`
  - Static file serving from frontend/dist

#### 1.2 Configured TS + Bundler + Tailwind Frontend
- Use Vite as bundler: `npm create vite@latest`
- Add Tailwind CSS
- Create test page with "Hello Pong"

#### 1.3 Initial Docker
- **Dockerfile**: Base Node image, build frontend, build backend
- **docker-compose.yml**: App service exposing `https://localhost:8443`

**Deliverable**: `docker compose up` starts Fastify serving the simple SPA

### PHASE 2 — SQLite + Data Model

**Objective**: Have database created and connector ready

#### 2.1 Define Schema
Create `backend/schema.sql` with tables:
- `users`
- `friends`
- `tournaments`
- `tournament_players`
- `matches`
- `messages`
- `blocked_users`
- `blockchain_scores`

#### 2.2 Database Plugin
- Use better-sqlite3 or sqlite3
- Create `backend/src/plugins/db.ts`
- Open `data/database.sqlite`
- Run schema.sql on initialization if database is empty
- Export instance for models

**Deliverable**: Server starts, connects to SQLite, GET `/health` confirms

### PHASE 3 — REST Core Backend

**Objective**: Stable REST API for the frontend

#### 3.1 Auth + User Management
**routes/auth.route.ts**:
- POST `/auth/register`
- POST `/auth/login`

**plugins/auth.ts**:
- Configure JWT (fastify-jwt)
- Implement authGuard middleware

**routes/user.route.ts**:
- GET `/users/me`
- PATCH `/users/me`
- POST `/users/me/avatar`
- GET `/users/:id`
- POST `/users/:id/friends`
- GET `/users/me/friends`

#### 3.2 Tournaments and Matches
**routes/tournament.route.ts**:
- POST `/tournaments` - Create tournament
- POST `/tournaments/:id/join` - Join tournament
- POST `/tournaments/:id/start` - Generate match list
- GET `/tournaments/:id` - Get details + matches

**routes/match.route.ts**:
- GET `/matches/:id`
- POST `/matches/:id/result` - Save final score and update stats

**Deliverable**: Complete user flow via Postman (register → login → create tournament → join → start → save result)

### PHASE 4 — Base SPA Frontend

**Objective**: Basic navigation and layout

#### 4.1 Manual Router (History API)
**frontend/src/router.ts**:
- Route map: `/login`, `/lobby`, `/tournament/:id`, `/game/:matchId`, `/profile/:id`, `/stats`
- `navigate(path)` using `history.pushState`
- Register `window.onpopstate` listener in `main.ts`

#### 4.2 Layout + Pages
- `components/layout/Navbar.ts` - Navigation (Home, Profile, Logout)
- `pages/LoginPage.ts`
- `pages/LobbyPage.ts`
- `pages/TournamentPage.ts`
- `pages/GamePage.ts`
- `pages/ProfilePage.ts`
- `pages/StatsPage.ts`

#### 4.3 Multi-language Module
- Create `i18n/en.ts`, `i18n/fr.ts`, `i18n/pt.ts`
- Create `i18n/index.ts` with:
  - Global state `currentLang`
  - Function `t(key: string)` to retrieve translations
- Add LanguageSwitcher to Navbar

**Deliverable**: Functional SPA navigation with language switching

### PHASE 5 — Local Pong Game

**Objective**: Locally playable Pong, two players on same keyboard

#### 5.1 Game Engine
**frontend/src/components/game/**:
- `PongCanvas.ts` - Creates canvas and starts game loop
- `engine.ts` - requestAnimationFrame loop, updates ball and paddle positions
- `ball.ts`, `paddle.ts`, `collision.ts` - Game physics

#### 5.2 Controls
- **Player 1**: W / S keys
- **Player 2**: Arrow Up / Arrow Down keys
- Equal paddle speed for both players

#### 5.3 Tournament Integration
- GamePage receives `matchId`
- On game completion:
  - Display results screen
  - Call POST `/matches/:id/result`

**Deliverable**: Create tournaments, start matches, play locally, save results

### PHASE 6 — Matchmaking & Tournament UX

**Objective**: Visible and usable tournament experience

#### 6.1 Lobby Screen
- List of active tournaments
- "Create tournament" button
- "Join tournament" button

#### 6.2 Tournament Screen
- Show player list (aliases)
- Show game order (single bracket or list)
- "Play next game" button → navigates to `/game/:matchId`

**Deliverable**: Visually understandable tournament flow

### PHASE 7 — WebSocket Infrastructure (Remote Players)

**Objective**: Allow remote play between 2 users on different PCs

#### 7.1 WebSocket Backend
**backend/src/ws/game.ws.ts**:
- Register clients by `matchId`
- Events:
  - `join_match` - Associate socket with player (player1/player2)
  - `input` - Receive key presses (up/down/stop)
  - `state_update` - Broadcast game state

**Server-authoritative approach**:
- Backend handles ball and paddle physics
- Frontend sends only input (key presses)
- Backend sends state (ball and paddle positions)

#### 7.2 Frontend WebSocket Client
**services/ws.ts**:
- Connect to `wss://host/game`
- Send input on key press
- Update engine with server state

#### 7.3 Fallback
- On player disconnect: End match, mark W.O. (walkover) in backend

**Deliverable**: Two users on different machines can play remotely via WebSocket

**Objective**: Real-time chat + user blocking + game invitations + notifications

#### 8.1 Backend WebSocket Chat
**ws/chat.ws.ts**:
- Authenticate each socket with JWT
- Events:
  - `message` - Text, destination (direct or room)
  - `block_user` - Update `blocked_users` table
  - `invite_to_game` - Send invitation with `matchId` or `tournamentId`
  - `tournament_notification` - Notify about next game

**routes/chat.route.ts**:
- GET `/chat/history/:userId` - Retrieve chat history

#### 8.2 Frontend ChatPanel
- List of conversations (friends)
- Chat window features:
  - Message sending
  - "Block user" button
  - "Invite to Pong" button
- Notification banner: "Your next game is against @User – Play now"

**Deliverable**: Real-time messaging, user blocking, game invitations, match notifications

### PHASE 9 — User Stats & Dashboards

**Objective**: Statistics page per user + per game

#### 9.1 Backend
**stats.model.ts** - Calculate:
- Total games, wins, losses
- Win rate
- Last X games

**routes/user.route.ts**:
- GET `/users/:id/stats`
- GET `/stats/global` (optional)

#### 9.2 Frontend StatsDashboard
**components/dashboard/StatsDashboard.ts**:
- Display stats with simple graphs
- Use `<canvas>` or `<svg>` for visualization
- Avoid heavy graphics libraries

**Deliverable**: Stats page showing matches played, wins, losses, recent history

### PHASE 10 — Blockchain (Avalanche + Solidity)

**Objective**: Store tournament scores on Avalanche blockchain

#### 10.1 Solidity Contract
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
- Deploy on Avalanche testnet using Hardhat

#### 10.2 Backend Integration
**blockchain.route.ts**:
- POST `/blockchain/tournaments/:id/publish`:
  - Retrieve final tournament results from database
  - Build array of scores
  - Call contract function
  - Save `tx_hash` in `blockchain_scores` table

#### 10.3 Frontend
**TournamentPage**:
- Show status: "Not published / Published ✅ (tx: 0x...)"
- "Publish to blockchain" button (tournament creator only)

**Deliverable**: Completed tournaments can publish scores to Avalanche and display tx hash

### PHASE 11 — Security, HTTPS, and Final Polishing

**Objective**: Fulfill ALL security requirements

#### 11.1 HTTPS
- Generate self-signed certificate for development
- Configure Fastify to use HTTPS
- Ensure:
  - Frontend consumes API via `https://`
  - WebSocket uses `wss://`

#### 11.2 Security Protections
**Input Validation**:
- Validate all inputs on backend (size, types, regex)

**SQL Injection Prevention**:
- Never concatenate strings with user data
- Use prepared statements/parameters

**XSS Prevention**:
- Escape content before injecting into DOM
- Use `textContent` instead of `innerHTML` for user content

**JWT Security**:
- Tokens with expiration
- Optional: Refresh token implementation

#### 11.3 Error Handling
- No JavaScript errors in browser console
- Standardized error responses: `{ error: "message" }`

**Deliverable**: Secure, production-ready application

### PHASE 12 — Packaging & Documentation

**Objective**: Project ready for evaluation

#### Final Checklist
- [ ] SPA works with browser back/forward navigation
- [ ] Local and remote games functional
- [ ] Tournament system complete
- [ ] Live chat operational
- [ ] User stats accessible
- [ ] Multi-language support (i18n)
- [ ] Blockchain integration working
- [ ] All security measures implemented

**Deliverable**: Fully documented, deployment-ready application

## API Routes

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login and receive JWT

### Users
- GET `/users/me` - Get current user
- PATCH `/users/me` - Update current user
- POST `/users/me/avatar` - Upload avatar
- GET `/users/:id` - Get user by ID
- POST `/users/:id/friends` - Add friend
- GET `/users/me/friends` - Get friends list
- GET `/users/:id/stats` - Get user statistics

### Tournaments
- POST `/tournaments` - Create tournament
- POST `/tournaments/:id/join` - Join tournament
- POST `/tournaments/:id/start` - Start tournament
- GET `/tournaments/:id` - Get tournament details

### Matches
- GET `/matches/:id` - Get match details
- POST `/matches/:id/result` - Submit match result

### Chat
- GET `/chat/history/:userId` - Get chat history

### Blockchain
- POST `/blockchain/tournaments/:id/publish` - Publish scores to blockchain

### Health
- GET `/health` - Health check

## Testing Flow

1. **Setup**: `docker compose up --build`
2. **Register** two users via `/auth/register`
3. **Login** both users to get JWT tokens
4. **Create Tournament** with user 1
5. **Join Tournament** with user 2
6. **Start Tournament** to generate matches
7. **Play Game** locally or remotely via WebSocket
8. **Submit Results** to update stats
9. **View Stats** on user profiles
10. **Publish to Blockchain** when tournament completes

## License

This project is part of the 42 curriculum.

---

**42 Luxembourg** - ft_transcendence project
