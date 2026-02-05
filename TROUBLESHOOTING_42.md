# Troubleshooting - Escola 42

## Problema: Containers falham ao iniciar

### Diagnóstico Rápido

```bash
# Limpar tudo e tentar novamente
make clean
docker system prune -af --volumes
make up
```

### Verificar logs dos containers que falharam

```bash
# Ver logs do Vault
docker logs transcendence-vault

# Ver logs do PostgreSQL
docker logs transcendence-postgres

# Ver logs de todos os containers
docker compose logs
```

## Soluções Comuns na 42

### 1. Problema de Permissões com Vault

O Vault requer permissões especiais (IPC_LOCK) que podem não estar disponíveis nas máquinas da 42.

**Solução aplicada:** Já foi configurado `SKIP_SETCAP: "true"` no docker-compose.yml

### 2. Portas já em uso

Verificar se as portas estão disponíveis:

```bash
# Verificar portas em uso
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5433  # PostgreSQL
lsof -i :8200  # Vault
lsof -i :5050  # pgAdmin
```

**Solução:** Matar processos ou mudar as portas no docker-compose.yml

### 3. Limites de recursos

As máquinas da 42 podem ter limites de CPU/memória.

```bash
# Verificar recursos do Docker
docker stats

# Verificar espaço em disco
df -h
docker system df
```

**Solução:** Limpar imagens e containers não utilizados:

```bash
docker system prune -af
docker volume prune -f
```

### 4. Problemas com volumes

Se os volumes estiverem corrompidos:

```bash
# Remover volumes específicos
docker volume rm ft_transcendence_postgres-data
docker volume rm ft_transcendence_vault-data
docker volume rm ft_transcendence_pgadmin-data

# Ou remover tudo
make clean
```

## Inicialização Passo a Passo

Se o `make up` continuar falhar, tente iniciar os serviços individualmente:

```bash
# 1. Limpar tudo
make clean

# 2. Iniciar apenas o Vault
docker compose up -d vault
docker logs -f transcendence-vault

# 3. Esperar o Vault ficar saudável (Ctrl+C para sair dos logs)
docker compose ps

# 4. Iniciar o PostgreSQL
docker compose up -d postgres
docker logs -f transcendence-postgres

# 5. Iniciar o restante
docker compose up -d
```

## Modo Simplificado (Sem Vault)

Se o Vault continuar falhando, você pode rodar sem ele temporariamente:

```bash
# Iniciar apenas os serviços essenciais
docker compose up -d postgres backend frontend

# O backend usará as credenciais das variáveis de ambiente
```

## Verificar Status

```bash
# Ver status de todos os containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
```

## Comandos Úteis de Debug

```bash
# Entrar em um container
docker compose exec vault sh
docker compose exec postgres sh
docker compose exec backend sh

# Testar conectividade entre containers
docker compose exec backend ping postgres
docker compose exec backend ping vault

# Ver variáveis de ambiente de um container
docker compose exec backend env

# Reiniciar um serviço específico
docker compose restart vault
docker compose restart postgres
```

## Contato com Suporte

Se nenhuma solução funcionar:

1. Capture os logs completos:
```bash
docker compose logs > logs.txt
```

2. Verifique as informações do sistema:
```bash
docker version
docker compose version
uname -a
```

3. Abra uma issue no repositório com essas informações.
