# ft_transcendence

> Uma plataforma de jogo Pong multijogador em tempo real com torneios, chat ao vivo e integração blockchain.

**42 Luxembourg**

## Visão Geral

ft_transcendence é uma aplicação web full-stack que traz o jogo clássico Pong para a era moderna com capacidades multijogador em tempo real, gerenciamento de torneios, chat ao vivo e armazenamento de pontuações em blockchain.

## Stack Tecnológica

- **Frontend**: TypeScript SPA + Tailwind CSS + Canvas API
- **Backend**: Fastify + SQLite + WebSocket + JWT
- **Blockchain**: Avalanche + Solidity (Hardhat)
- **Infraestrutura**: Docker + Docker Compose

## Estrutura do Repositório

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

## Funcionalidades

- **Jogo Pong Multijogador**: Jogabilidade em tempo real usando WebSocket
- **Sistema de Torneios**: Criar e participar de torneios com matchmaking automático
- **Chat ao Vivo**: Mensagens em tempo real com sistema de amigos e bloqueio de usuários
- **Perfis de Usuário**: Perfis personalizáveis com avatares e gerenciamento de amigos
- **Painel de Estatísticas**: Acompanhar vitórias, derrotas e histórico de partidas
- **Integração Blockchain**: Pontuações de torneios armazenadas na blockchain Avalanche
- **Internacionalização**: Suporte para múltiplos idiomas (EN, FR, PT)
- **Autenticação Segura**: Autenticação baseada em JWT com HTTPS

## Início Rápido

```bash
# Clonar o repositório
git clone https://github.com/yourusername/ft_transcendence.git
cd ft_transcendence

# Iniciar a aplicação
docker compose up --build
```

A aplicação estará disponível em `https://localhost:8443`

## Fases de Desenvolvimento

### FASE 0 — Preparação

**Objetivo**: Alinhar tudo antes de codificar

- Ler todo o assunto
- Criar o repositório ft_transcendence
- Configurar .gitignore (node_modules, dist, .env, etc.)
- Criar os diretórios vazios backend/, frontend/, e blockchain/

### FASE 1 — Infraestrutura & Base Docker

**Objetivo**: Ter `docker compose up` iniciando o backend e frontend

#### 1.1 Backend Node + Fastify Básico
- Inicializar projeto em `backend/`
- Dependências: fastify, fastify-plugin, @fastify/websocket, typescript, ts-node-dev
- Criar `tsconfig.json`
- Criar `src/index.ts` com:
  - Criação do servidor Fastify
  - Rota GET `/health` retornando `{ status: "ok" }`
  - Servir arquivos estáticos de frontend/dist

#### 1.2 Frontend TS + Bundler + Tailwind Configurado
- Usar Vite como bundler: `npm create vite@latest`
- Adicionar Tailwind CSS
- Criar página de teste com "Hello Pong"

#### 1.3 Docker Inicial
- **Dockerfile**: Imagem Node base, build frontend, build backend
- **docker-compose.yml**: Serviço app expondo `https://localhost:8443`

**Entregável**: `docker compose up` inicia Fastify servindo a SPA simples

### FASE 2 — SQLite + Modelo de Dados

**Objetivo**: Ter o banco de dados criado e conector pronto

#### 2.1 Definir Schema
Criar `backend/schema.sql` com as tabelas:
- `users`
- `friends`
- `tournaments`
- `tournament_players`
- `matches`
- `messages`
- `blocked_users`
- `blockchain_scores`

#### 2.2 Plugin de Banco de Dados
- Usar better-sqlite3 ou sqlite3
- Criar `backend/src/plugins/db.ts`
- Abrir `data/database.sqlite`
- Executar schema.sql na inicialização se o banco estiver vazio
- Exportar instância para uso em models

**Entregável**: Servidor inicia, conecta ao SQLite, GET `/health` confirma

### FASE 3 — Backend REST Core

**Objetivo**: API REST estável para o frontend

#### 3.1 Auth + Gerenciamento de Usuários
**routes/auth.route.ts**:
- POST `/auth/register`
- POST `/auth/login`

**plugins/auth.ts**:
- Configurar JWT (fastify-jwt)
- Implementar middleware authGuard

**routes/user.route.ts**:
- GET `/users/me`
- PATCH `/users/me`
- POST `/users/me/avatar`
- GET `/users/:id`
- POST `/users/:id/friends`
- GET `/users/me/friends`

#### 3.2 Torneios e Partidas
**routes/tournament.route.ts**:
- POST `/tournaments` - Criar torneio
- POST `/tournaments/:id/join` - Entrar no torneio
- POST `/tournaments/:id/start` - Gerar lista de partidas
- GET `/tournaments/:id` - Obter detalhes + partidas

**routes/match.route.ts**:
- GET `/matches/:id`
- POST `/matches/:id/result` - Salvar pontuação final e atualizar stats

**Entregável**: Fluxo completo de usuário via Postman (registrar → login → criar torneio → entrar → iniciar → salvar resultado)

### FASE 4 — Frontend SPA Base

**Objetivo**: Navegação e layout básicos

#### 4.1 Roteador Manual (History API)
**frontend/src/router.ts**:
- Mapa de rotas: `/login`, `/lobby`, `/tournament/:id`, `/game/:matchId`, `/profile/:id`, `/stats`
- `navigate(path)` usando `history.pushState`
- Registrar listener `window.onpopstate` em `main.ts`

#### 4.2 Layout + Páginas
- `components/layout/Navbar.ts` - Navegação (Home, Perfil, Logout)
- `pages/LoginPage.ts`
- `pages/LobbyPage.ts`
- `pages/TournamentPage.ts`
- `pages/GamePage.ts`
- `pages/ProfilePage.ts`
- `pages/StatsPage.ts`

#### 4.3 Módulo Multi-idioma
- Criar `i18n/en.ts`, `i18n/fr.ts`, `i18n/pt.ts`
- Criar `i18n/index.ts` com:
  - Estado global `currentLang`
  - Função `t(key: string)` para recuperar traduções
- Adicionar LanguageSwitcher à Navbar

**Entregável**: Navegação SPA funcional com troca de idioma

### FASE 5 — Jogo Pong Local

**Objetivo**: Pong jogável localmente, dois jogadores no mesmo teclado

#### 5.1 Motor do Jogo
**frontend/src/components/game/**:
- `PongCanvas.ts` - Cria canvas e inicia loop do jogo
- `engine.ts` - Loop requestAnimationFrame, atualiza posições da bola e raquetes
- `ball.ts`, `paddle.ts`, `collision.ts` - Física do jogo

#### 5.2 Controles
- **Jogador 1**: Teclas W / S
- **Jogador 2**: Teclas Seta para Cima / Seta para Baixo
- Velocidade de raquete igual para ambos jogadores

#### 5.3 Integração com Torneio
- GamePage recebe `matchId`
- Ao completar o jogo:
  - Exibir tela de resultados
  - Chamar POST `/matches/:id/result`

**Entregável**: Criar torneios, iniciar partidas, jogar localmente, salvar resultados

### FASE 6 — Matchmaking & UX de Torneio

**Objetivo**: Experiência de torneio visível e usável

#### 6.1 Tela de Lobby
- Lista de torneios ativos
- Botão "Criar torneio"
- Botão "Entrar no torneio"

#### 6.2 Tela de Torneio
- Mostrar lista de jogadores (apelidos)
- Mostrar ordem de jogos (bracket simples ou lista)
- Botão "Jogar próxima partida" → navega para `/game/:matchId`

**Entregável**: Fluxo de torneio visualmente compreensível

### FASE 7 — Infraestrutura WebSocket (Jogadores Remotos)

**Objetivo**: Permitir jogo remoto entre 2 usuários em PCs diferentes

#### 7.1 Backend WebSocket
**backend/src/ws/game.ws.ts**:
- Registrar clientes por `matchId`
- Eventos:
  - `join_match` - Associar socket com jogador (player1/player2)
  - `input` - Receber pressionamentos de teclas (cima/baixo/parar)
  - `state_update` - Transmitir estado do jogo

**Abordagem servidor-autoritário**:
- Backend gerencia física da bola e raquetes
- Frontend envia apenas entrada (pressionamentos de teclas)
- Backend envia estado (posições da bola e raquetes)

#### 7.2 Cliente WebSocket Frontend
**services/ws.ts**:
- Conectar a `wss://host/game`
- Enviar entrada ao pressionar teclas
- Atualizar motor com estado do servidor

#### 7.3 Fallback
- Em caso de desconexão de jogador: Encerrar partida, marcar W.O. (walkover) no backend

**Entregável**: Dois usuários em máquinas diferentes podem jogar remotamente via WebSocket

### FASE 8 — Chat ao Vivo

**Objetivo**: Chat em tempo real + bloqueio de usuários + convites para jogo + notificações

#### 8.1 Backend WebSocket Chat
**ws/chat.ws.ts**:
- Autenticar cada socket com JWT
- Eventos:
  - `message` - Texto, destino (direto ou sala)
  - `block_user` - Atualizar tabela `blocked_users`
  - `invite_to_game` - Enviar convite com `matchId` ou `tournamentId`
  - `tournament_notification` - Notificar sobre próximo jogo

**routes/chat.route.ts**:
- GET `/chat/history/:userId` - Recuperar histórico do chat

#### 8.2 Frontend ChatPanel
- Lista de conversas (amigos)
- Recursos da janela de chat:
  - Envio de mensagens
  - Botão "Bloquear usuário"
  - Botão "Convidar para Pong"
- Banner de notificação: "Sua próxima partida é contra @Usuário – Jogar agora"

**Entregável**: Mensagens em tempo real, bloqueio de usuários, convites para jogo, notificações de partida

### FASE 9 — Estatísticas de Usuário & Painéis

**Objetivo**: Página de estatísticas por usuário + por jogo

#### 9.1 Backend
**stats.model.ts** - Calcular:
- Total de jogos, vitórias, derrotas
- Taxa de vitória
- Últimos X jogos

**routes/user.route.ts**:
- GET `/users/:id/stats`
- GET `/stats/global` (opcional)

#### 9.2 Frontend StatsDashboard
**components/dashboard/StatsDashboard.ts**:
- Exibir stats com gráficos simples
- Usar `<canvas>` ou `<svg>` para visualização
- Evitar bibliotecas gráficas pesadas

**Entregável**: Página de stats mostrando partidas jogadas, vitórias, derrotas, histórico recente

### FASE 10 — Blockchain (Avalanche + Solidity)

**Objetivo**: Armazenar pontuações de torneio na blockchain Avalanche

#### 10.1 Contrato Solidity
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
- Fazer deploy na testnet Avalanche usando Hardhat

#### 10.2 Integração Backend
**blockchain.route.ts**:
- POST `/blockchain/tournaments/:id/publish`:
  - Recuperar resultados finais do torneio do banco de dados
  - Construir array de pontuações
  - Chamar função do contrato
  - Salvar `tx_hash` na tabela `blockchain_scores`

#### 10.3 Frontend
**TournamentPage**:
- Mostrar status: "Não publicado / Publicado ✅ (tx: 0x...)"
- Botão "Publicar na blockchain" (apenas criador do torneio)

**Entregável**: Torneios concluídos podem publicar pontuações na Avalanche e exibir hash de transação

### FASE 11 — Segurança, HTTPS e Refinamentos Finais

**Objetivo**: Cumprir TODOS os requisitos de segurança

#### 11.1 HTTPS
- Gerar certificado auto-assinado para desenvolvimento
- Configurar Fastify para usar HTTPS
- Garantir que:
  - Frontend consome API via `https://`
  - WebSocket usa `wss://`

#### 11.2 Proteções de Segurança
**Validação de Entrada**:
- Validar todas as entradas no backend (tamanho, tipos, regex)

**Prevenção de Injeção SQL**:
- Nunca concatenar strings com dados do usuário
- Usar prepared statements/parâmetros

**Prevenção XSS**:
- Escapar conteúdo antes de injetar no DOM
- Usar `textContent` ao invés de `innerHTML` para conteúdo de usuário

**Segurança JWT**:
- Tokens com expiração
- Opcional: Implementação de refresh token

#### 11.3 Tratamento de Erros
- Nenhum erro JavaScript no console do navegador
- Respostas de erro padronizadas: `{ error: "message" }`

**Entregável**: Aplicação segura, pronta para produção

### FASE 12 — Empacotamento & Documentação

**Objetivo**: Projeto pronto para avaliação

#### Checklist Final
- [ ] SPA funciona com navegação para frente/trás do navegador
- [ ] Jogos locais e remotos funcionais
- [ ] Sistema de torneios completo
- [ ] Chat ao vivo operacional
- [ ] Estatísticas de usuário acessíveis
- [ ] Suporte multi-idioma (i18n)
- [ ] Integração blockchain funcionando
- [ ] Todas as medidas de segurança implementadas

**Entregável**: Aplicação totalmente documentada, pronta para deploy

## Rotas da API

### Autenticação
- POST `/auth/register` - Registrar novo usuário
- POST `/auth/login` - Login e receber JWT

### Usuários
- GET `/users/me` - Obter usuário atual
- PATCH `/users/me` - Atualizar usuário atual
- POST `/users/me/avatar` - Upload de avatar
- GET `/users/:id` - Obter usuário por ID
- POST `/users/:id/friends` - Adicionar amigo
- GET `/users/me/friends` - Obter lista de amigos
- GET `/users/:id/stats` - Obter estatísticas do usuário

### Torneios
- POST `/tournaments` - Criar torneio
- POST `/tournaments/:id/join` - Entrar no torneio
- POST `/tournaments/:id/start` - Iniciar torneio
- GET `/tournaments/:id` - Obter detalhes do torneio

### Partidas
- GET `/matches/:id` - Obter detalhes da partida
- POST `/matches/:id/result` - Submeter resultado da partida

### Chat
- GET `/chat/history/:userId` - Obter histórico do chat

### Blockchain
- POST `/blockchain/tournaments/:id/publish` - Publicar pontuações na blockchain

### Saúde
- GET `/health` - Verificação de saúde

## Fluxo de Teste

1. **Configuração**: `docker compose up --build`
2. **Registrar** dois usuários via `/auth/register`
3. **Login** de ambos usuários para obter tokens JWT
4. **Criar Torneio** com usuário 1
5. **Entrar no Torneio** com usuário 2
6. **Iniciar Torneio** para gerar partidas
7. **Jogar** localmente ou remotamente via WebSocket
8. **Submeter Resultados** para atualizar stats
9. **Ver Estatísticas** nos perfis de usuário
10. **Publicar na Blockchain** quando o torneio terminar

## Licença

Este projeto faz parte do currículo 42.

---

**42 Luxembourg** - Projeto ft_transcendence
