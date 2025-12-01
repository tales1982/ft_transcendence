# Modules

Overview

## Web

- Major module: Use a framework to build the backend.
  - Covered by README?: Yes
  - Notes: See README PHASE 1.1 — Basic Node + Fastify Backend

- Minor module: Use a framework or a toolkit to build the frontend.
  - Covered by README?: Yes
  - Notes: See README PHASE 1.2 — Vite + Tailwind setup

- Minor module: Use a database for the backend.
  - Covered by README?: Yes
  - Notes: See README PHASE 2 — SQLite + schema.sql

- Major module: Store the score of a tournament in the Blockchain.
  - Covered by README?: Partial
  - Notes: See README PHASE 10 — Blockchain contracts and publish endpoint (requires implementation)

## User Management

- Major module: Standard user management, authentication, users across tournaments.
  - Covered by README?: Yes
  - Notes: See README PHASE 3 — Auth + User Management routes

- Major module: Implementing a remote authentication.
  - Covered by README?: No
  - Notes: Remote/OAuth flows are not defined in README

## Gameplay and user experience

- Major module: Remote players
  - Covered by README?: Yes
  - Notes: See README PHASE 7 — WebSocket Infrastructure (Remote Players)

- Major module: Multiplayer (more than 2 players in the same game).
  - Covered by README?: Partial
  - Notes: README focuses on 2-player Pong; >2 requires design changes

- Major module: Add another game with user history and matchmaking.
  - Covered by README?: No
  - Notes: README centers on Pong only

- Minor module: Game customization options.
  - Covered by README?: No
  - Notes: Not specified in README

- Major module: Live chat.
  - Covered by README?: Yes
  - Notes: See README PHASE 8 — Chat + invites + blocking

## AI-Algo

- Major module: Introduce an AI opponent.
  - Covered by README?: No
  - Notes: Not present in README

- Minor module: User and game stats dashboards
  - Covered by README?: Yes
  - Notes: See README PHASE 9 — Stats endpoints + dashboard

## Cybersecurity

- Major module: Implement WAF/ModSecurity with a hardened configuration and HashiCorp Vault for secrets management.
  - Covered by README?: No
  - Notes: README covers JWT/HTTPS/input validation but not WAF/Vault

- Minor module: GDPR compliance options with user anonymization, local data management, and Account Deletion.
  - Covered by README?: No
  - Notes: GDPR checklist not included in README

- Major module: Implement Two-Factor Authentication (2FA) and JWT.
  - Covered by README?: Partial
  - Notes: JWT present (PHASE 3); 2FA not defined

## Devops

- Major module: Infrastructure setup for log management.
  - Covered by README?: No
  - Notes: ELK stack not included in README phases

- Minor module: Monitoring system.
  - Covered by README?: No
  - Notes: Prometheus/Grafana not included in README

- Major module: Designing the backend as microservices.
  - Covered by README?: No
  - Notes: README assumes monolith Fastify backend

## Graphics

- Major module: Use advanced 3D techniques.
  - Covered by README?: No
  - Notes: README implements 2D Canvas Pong only

## Accessibility

- Minor module: Support on all devices.
  - Covered by README?: Partial
  - Notes: Responsive frontend guidance exists but no detailed accessibility plan

- Minor module: Expanding browser compatibility.
  - Covered by README?: No
  - Notes: Browser compatibility testing not specified

- Minor module: Supports multiple languages.
  - Covered by README?: Yes
  - Notes: See README PHASE 1.2 — `i18n/en.ts`, `fr.ts`, `pt.ts`

- Minor module: Add accessibility features for visually impaired users.
  - Covered by README?: No
  - Notes: ARIA/screen-reader guidelines not present

- Minor module: Server-Side Rendering (SSR) integration.
  - Covered by README?: No
  - Notes: README targets SPA (Vite)

## Server-Side Pong

- Major module: Replace basic Pong with server-side Pong and implement an API.
  - Covered by README?: No
  - Notes: README uses server-authoritative WebSocket but not full server-side-only engine/API

- Major module: Enabling Pong gameplay via CLI against web users with API integration.
  - Covered by README?: No
  - Notes: CLI gameplay is an extension beyond README

## Coverage counts and scoring (per your rules)

- Inclusive (count modules with `Covered by README?: Yes` or `Partial`):
  - Majors: 5
  - Minors: 6
  - Equivalent majors: 5 + (6 / 2) = 8
  - Mandatory Part: 7 points required
  - Bonus Part: Major = 10 points, Minor = 5 points, Max 25 points. We have 10/25 points left from mandatory right now.