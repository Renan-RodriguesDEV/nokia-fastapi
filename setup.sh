#!/bin/bash
# 🚀 Setup Script - Padaria FastAPI

echo "🍞 Bem-vindo ao Padaria FastAPI Setup!"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para checklist
check_item() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

echo ""
echo "📋 PRÉ-REQUISITOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar Python
python3 --version > /dev/null 2>&1
check_item "Python 3 instalado"

# Verificar pip
pip --version > /dev/null 2>&1
check_item "pip instalado"

# Verificar Node
node --version > /dev/null 2>&1
check_item "Node.js instalado"

# Verificar npm
npm --version > /dev/null 2>&1
check_item "npm instalado"

echo ""
echo "📦 INSTALAÇÃO BACKEND:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend
echo -e "${YELLOW}📥 Instalando dependências Python...${NC}"
pip install -r requirements.txt > /dev/null 2>&1
check_item "Dependências Python instaladas"

echo ""
echo "📦 INSTALAÇÃO FRONTEND:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd ../frontend
echo -e "${YELLOW}📥 Instalando dependências Node...${NC}"
npm install > /dev/null 2>&1
check_item "Dependências Node instaladas"

# Verificar .env.local
if [ -f ".env.local" ]; then
    check_item ".env.local existe"
else
    echo -e "${YELLOW}⚠️  Criando .env.local...${NC}"
    cp .env.local.example .env.local
    check_item ".env.local criado"
fi

echo ""
echo "✨ CONFIGURAÇÃO CONCLUÍDA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Para iniciar o projeto:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   ${GREEN}cd backend${NC}"
echo "   ${GREEN}uvicorn app:app --reload${NC}"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   ${GREEN}cd frontend${NC}"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "   Depois acesse:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentação:"
echo "   - QUICK_START.md          (Comece aqui!)"
echo "   - AUTENTICACAO_GUIA.md    (Detalhes técnicos)"
echo "   - IMPLEMENTACAO_GUIA.md   (Próximos passos)"
echo "   - RESUMO_IMPLEMENTACAO.md (Visão completa)"
echo ""
echo "🎉 Bom desenvolvimento!"
