# 🚀 Quick Start - Escola 42

## Mudanças Aplicadas

Foram feitas correções no projeto para funcionar nas máquinas da escola 42:

### ✅ Correções Aplicadas

1. **Vault**: Removida a capability `IPC_LOCK` que não funciona na 42
2. **Vault**: Adicionado `SKIP_SETCAP=true` para evitar problemas de permissão
3. **Vault**: Removidos volumes de configuração vazios que causavam problemas
4. **PostgreSQL**: Healthcheck melhorado para maior confiabilidade
5. **Scripts**: Adicionados scripts de diagnóstico e troubleshooting

## 📋 Pré-requisitos

```bash
# Verificar se o Docker está instalado e rodando
docker --version
docker ps
```

## 🏃 Iniciar o Projeto

### Opção 1: Start Completo (Recomendado)

```bash
# Limpar ambiente anterior (se existir)
make clean

# Limpar sistema Docker
docker system prune -af --volumes

# Iniciar todos os serviços
make up
```

### Opção 2: Diagnóstico Primeiro

```bash
# Executar diagnóstico
make diagnose

# Se tudo OK, iniciar
make up
```

### Opção 3: Start Gradual (Se houver problemas)

```bash
# Limpar tudo
make clean

# Iniciar Vault primeiro
docker compose up -d vault

# Aguardar 10 segundos e verificar
docker logs transcendence-vault

# Se OK, iniciar PostgreSQL
docker compose up -d postgres

# Aguardar 10 segundos e verificar
docker logs transcendence-postgres

# Se OK, iniciar o resto
docker compose up -d
```

## 🔍 Verificar Status

```bash
# Ver status de todos os containers
docker compose ps

# Ver logs em tempo real
make logs

# Ver logs de um serviço específico
make backend   # ou frontend, postgres
```

## ✅ Acessar os Serviços

Após inicialização bem-sucedida:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Vault UI**: http://localhost:8200 (Token: `transcendence-root-token`)
- **pgAdmin**: http://localhost:5050
  - Email: admin@transcendence.com
  - Senha: admin123
- **PostgreSQL**: localhost:5433
  - User: transcendence
  - Password: transcendence123
  - Database: transcendence

## 🐛 Problemas Comuns

### Container "transcendence-vault" falha

```bash
# Ver o erro específico
docker logs transcendence-vault

# Soluções:
# 1. Limpar volumes
docker volume rm ft_transcendence_vault-data

# 2. Reiniciar apenas o Vault
docker compose restart vault
```

### Container "transcendence-postgres" falha

```bash
# Ver o erro específico
docker logs transcendence-postgres

# Soluções:
# 1. Limpar volumes
docker volume rm ft_transcendence_postgres-data

# 2. Reiniciar
docker compose restart postgres
```

### Portas em uso

```bash
# Verificar qual processo está usando a porta
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :8200  # Vault
lsof -i :5433  # PostgreSQL

# Matar o processo (substitua PID pelo número)
kill -9 PID
```

### Espaço em disco insuficiente

```bash
# Limpar imagens não utilizadas
docker system prune -af

# Limpar volumes não utilizados
docker volume prune -f

# Ver espaço utilizado
docker system df
```

## 📚 Comandos Úteis

```bash
# Ajuda com todos os comandos
make help

# Parar todos os serviços
make down

# Rebuild completo
make rebuild

# Limpar tudo
make clean

# Diagnóstico completo
make diagnose

# Acessar PostgreSQL via CLI
make postgres

# Ver logs de serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f vault
docker compose logs -f postgres
```

## 🆘 Se Nada Funcionar

1. **Capture informações do sistema:**
```bash
docker version
docker compose version
uname -a
```

2. **Capture os logs:**
```bash
docker compose logs > logs.txt
```

3. **Verifique o troubleshooting detalhado:**
```bash
cat TROUBLESHOOTING_42.md
```

4. **Execute o diagnóstico:**
```bash
make diagnose
```

## 🔧 Modo Emergência (Sem Vault)

Se o Vault continuar falhando, você pode rodar temporariamente sem ele:

```bash
# Edite o docker-compose.yml e comente o serviço vault e vault-init

# Ou inicie apenas os serviços essenciais:
docker compose up -d postgres backend frontend
```

O backend usará as credenciais das variáveis de ambiente ao invés do Vault.

## 💡 Dicas

1. **Sempre limpe antes de iniciar**: `make clean && make up`
2. **Use o diagnóstico**: `make diagnose` antes de reportar problemas
3. **Verifique os logs**: Os logs sempre mostram o erro real
4. **Seja paciente**: Os healthchecks podem levar até 30 segundos
5. **Portas alternativas**: Se necessário, mude as portas no docker-compose.yml

## 📞 Suporte

- **Troubleshooting detalhado**: [TROUBLESHOOTING_42.md](TROUBLESHOOTING_42.md)
- **Documentação completa**: [README.md](README.md)
