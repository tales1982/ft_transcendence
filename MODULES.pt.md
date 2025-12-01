# Módulos

Visão Geral

## Web

- Módulo maior: Usar um framework para construir o backend.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 1.1 — Backend básico com Node + Fastify

- Módulo menor: Usar um framework ou toolkit para construir o frontend.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 1.2 — Configuração Vite + Tailwind

- Módulo menor: Usar uma base de dados para o backend.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 2 — SQLite + schema.sql

- Módulo maior: Armazenar o score de um torneio na Blockchain.
  - Coberto pelo README?: Parcial
  - Notas: Ver README FASE 10 — Contratos Blockchain e endpoint de publicação (requer implementação)

## Gestão de Utilizadores

- Módulo maior: Gestão padrão de utilizadores, autenticação, utilizadores em vários torneios.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 3 — Rotas de Autenticação + Gestão de Utilizadores

- Módulo maior: Implementar autenticação remota.
  - Coberto pelo README?: Não
  - Notas: Fluxos Remotos/OAuth não definidos no README

## Gameplay e Experiência do Utilizador

- Módulo maior: Jogadores remotos
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 7 — Infraestrutura WebSocket (Jogadores Remotos)

- Módulo maior: Multiplayer (mais de 2 jogadores no mesmo jogo).
  - Coberto pelo README?: Parcial
  - Notas: README foca em Pong para 2 jogadores; >2 requer alterações de design

- Módulo maior: Adicionar outro jogo com histórico e matchmaking.
  - Coberto pelo README?: Não
  - Notas: README cobre apenas Pong

- Módulo menor: Opções de customização do jogo.
  - Coberto pelo README?: Não
  - Notas: Não especificado no README

- Módulo maior: Chat em tempo real.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 8 — Chat + convites + bloqueio

## IA / Algoritmo

- Módulo maior: Introduzir um adversário com IA.
  - Coberto pelo README?: Não
  - Notas: Não presente no README

- Módulo menor: Dashboards de utilizadores e estatísticas de jogo
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 9 — Endpoints de estatísticas + dashboard

## Cibersegurança

- Módulo maior: Implementar WAF/ModSecurity com configuração reforçada e HashiCorp Vault para gestão de segredos.
  - Coberto pelo README?: Não
  - Notas: README cobre JWT/HTTPS/validação de input, mas não WAF/Vault

- Módulo menor: Opções de conformidade GDPR com anonimização de utilizadores, gestão local de dados e eliminação de contas.
  - Coberto pelo README?: Não
  - Notas: Checklist GDPR não incluído no README

- Módulo maior: Implementar Autenticação de Dois Fatores (2FA) e JWT.
  - Coberto pelo README?: Parcial
  - Notas: JWT presente (FASE 3); 2FA não definido

## DevOps

- Módulo maior: Configuração de infraestrutura para gestão de logs.
  - Coberto pelo README?: Não
  - Notas: Stack ELK não incluída nas fases do README

- Módulo menor: Sistema de monitorização.
  - Coberto pelo README?: Não
  - Notas: Prometheus/Grafana não incluídos no README

- Módulo maior: Projetar o backend como microsserviços.
  - Coberto pelo README?: Não
  - Notas: README assume backend monolítico com Fastify

## Gráficos

- Módulo maior: Usar técnicas avançadas de 3D.
  - Coberto pelo README?: Não
  - Notas: README implementa apenas Pong 2D com Canvas

## Acessibilidade

- Módulo menor: Suporte em todos os dispositivos.
  - Coberto pelo README?: Parcial
  - Notas: Existe orientação sobre frontend responsivo, mas sem plano de acessibilidade detalhado

- Módulo menor: Expandir compatibilidade entre navegadores.
  - Coberto pelo README?: Não
  - Notas: Testes de compatibilidade não especificados

- Módulo menor: Suporte a múltiplas línguas.
  - Coberto pelo README?: Sim
  - Notas: Ver README FASE 1.2 — `i18n/en.ts`, `fr.ts`, `pt.ts`

- Módulo menor: Adicionar funcionalidades de acessibilidade para utilizadores com deficiências visuais.
  - Coberto pelo README?: Não
  - Notas: Diretrizes ARIA/screen-reader não presentes

- Módulo menor: Integração de Server-Side Rendering (SSR).
  - Coberto pelo README?: Não
  - Notas: README utiliza SPA (Vite)

## Pong no Servidor

- Módulo maior: Substituir Pong básico por Pong no lado do servidor e implementar uma API.
  - Coberto pelo README?: Não
  - Notas: README usa WebSocket com autoridade no servidor, mas não um motor/API 100% server-side

- Módulo maior: Permitir jogar Pong via CLI contra utilizadores web com integração API.
  - Coberto pelo README?: Não
  - Notas: Jogabilidade via CLI é uma extensão além do README

## Contagem de Cobertura e Pontuação (segundo as tuas regras)

- Inclusivo (conta módulos com `Coberto pelo README?: Sim` ou `Parcial`):
  - Maiores: 5
  - Menores: 6
  - Equivalente a maiores: 5 + (6 / 2) = 8
  - Parte obrigatória: 7 pontos necessários
  - Parte bónus: Maior = 10 pontos, Menor = 5 pontos, Máximo 25 pontos. Neste momento temos 10/25 pontos sobrando da parte obrigatória.
