#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           🔍 Transcendence - Diagnóstico                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Porta $port ($service) está em uso${NC}"
        echo -e "   ${YELLOW}Execute: lsof -i :$port${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Porta $port ($service) está disponível${NC}"
        return 0
    fi
}

# Função para verificar espaço em disco
check_disk_space() {
    local available=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G//')
    echo -e "${BLUE}💾 Espaço disponível: ${available}GB${NC}"

    if (( $(echo "$available < 5" | bc -l) )); then
        echo -e "${RED}⚠️  Pouco espaço em disco! Recomendado: 5GB+${NC}"
        echo -e "   ${YELLOW}Execute: docker system prune -af${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Espaço em disco suficiente${NC}"
        return 0
    fi
}

# Função para verificar Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker não está instalado${NC}"
        return 1
    fi

    if ! docker ps &> /dev/null; then
        echo -e "${RED}❌ Docker não está rodando ou sem permissões${NC}"
        echo -e "   ${YELLOW}Execute: sudo service docker start${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Docker está funcionando${NC}"
    echo -e "   Versão: $(docker --version | cut -d' ' -f3)"
    return 0
}

# Função para verificar containers
check_containers() {
    echo ""
    echo -e "${BLUE}📦 Status dos Containers:${NC}"
    docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo -e "${YELLOW}Nenhum container rodando${NC}"
}

# Função para verificar volumes
check_volumes() {
    echo ""
    echo -e "${BLUE}💿 Volumes Docker:${NC}"
    local volumes=$(docker volume ls -q | grep ft_transcendence | wc -l)
    echo -e "   Total: $volumes volumes"

    if [ $volumes -gt 0 ]; then
        docker volume ls | grep ft_transcendence
    fi
}

# Função para verificar logs de erro
check_logs() {
    echo ""
    echo -e "${BLUE}📋 Logs recentes (últimos erros):${NC}"

    for service in vault postgres backend frontend; do
        if docker compose ps -q $service &> /dev/null; then
            local errors=$(docker compose logs $service 2>&1 | grep -i "error\|fatal\|fail" | tail -2)
            if [ ! -z "$errors" ]; then
                echo -e "${RED}❌ $service:${NC}"
                echo "$errors" | sed 's/^/   /'
            fi
        fi
    done
}

# Executar verificações
echo -e "${BLUE}🔍 Verificando ambiente...${NC}"
echo ""

check_docker
echo ""

echo -e "${BLUE}🔌 Verificando portas:${NC}"
check_port 3000 "Frontend"
check_port 8080 "Backend"
check_port 5433 "PostgreSQL"
check_port 8200 "Vault"
check_port 5050 "pgAdmin"
echo ""

check_disk_space
echo ""

# Verificar uso de recursos do Docker
echo -e "${BLUE}📊 Uso de recursos Docker:${NC}"
docker system df 2>/dev/null || echo -e "${YELLOW}Não foi possível verificar${NC}"
echo ""

check_containers
check_volumes
check_logs

# Sugestões
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           💡 Sugestões de Solução                            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Se houver erros, tente:${NC}"
echo ""
echo -e "1. ${GREEN}Limpar e reiniciar:${NC}"
echo -e "   make clean"
echo -e "   docker system prune -af --volumes"
echo -e "   make up"
echo ""
echo -e "2. ${GREEN}Ver logs detalhados:${NC}"
echo -e "   docker compose logs vault"
echo -e "   docker compose logs postgres"
echo ""
echo -e "3. ${GREEN}Iniciar serviços individualmente:${NC}"
echo -e "   docker compose up -d vault"
echo -e "   docker compose up -d postgres"
echo -e "   docker compose up -d"
echo ""
echo -e "4. ${GREEN}Ver guia completo:${NC}"
echo -e "   cat TROUBLESHOOTING_42.md"
echo ""
