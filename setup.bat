@echo off
REM 🚀 Setup Script para Windows - Padaria FastAPI

setlocal enabledelayedexpansion

cls
echo.
echo 🍞 Bem-vindo ao Padaria FastAPI Setup para Windows!
echo.
echo ═══════════════════════════════════════════════════════════════

REM Cores não são suportadas nativamente em batch, usaremos símbolos

echo.
echo 📋 VERIFICANDO PRÉ-REQUISITOS:
echo ───────────────────────────────────────────────────────────────

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado
    echo   Baixe em: https://www.python.org/downloads/
    pause
    exit /b 1
) else (
    echo ✅ Python instalado
)

REM Verificar pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip não encontrado
    pause
    exit /b 1
) else (
    echo ✅ pip instalado
)

REM Verificar Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado
    echo   Baixe em: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js instalado
)

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado
    pause
    exit /b 1
) else (
    echo ✅ npm instalado
)

echo.
echo 📦 INSTALANDO BACKEND:
echo ───────────────────────────────────────────────────────────────

cd backend
if exist requirements.txt (
    echo 📥 Instalando dependências Python...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências Python
        pause
        exit /b 1
    ) else (
        echo ✅ Dependências Python instaladas
    )
) else (
    echo ❌ requirements.txt não encontrado
    pause
    exit /b 1
)

echo.
echo 📦 INSTALANDO FRONTEND:
echo ───────────────────────────────────────────────────────────────

cd ..\frontend
if exist package.json (
    echo 📥 Instalando dependências Node...
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências Node
        pause
        exit /b 1
    ) else (
        echo ✅ Dependências Node instaladas
    )
) else (
    echo ❌ package.json não encontrado
    pause
    exit /b 1
)

REM Verificar .env.local
if exist .env.local (
    echo ✅ .env.local existe
) else (
    echo ⚠️  Criando .env.local...
    if exist .env.local.example (
        copy .env.local.example .env.local
        echo ✅ .env.local criado
    ) else (
        echo ❌ .env.local.example não encontrado
    )
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo ✨ CONFIGURAÇÃO CONCLUÍDA!
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🚀 Para iniciar o projeto:
echo.
echo   PASSO 1 - Abra um Terminal e execute:
echo   ────────────────────────────────────────────────
echo   cd backend
echo   uvicorn app:app --reload
echo.
echo   Você verá:
echo   INFO:     Uvicorn running on http://127.0.0.1:8000
echo.

echo   PASSO 2 - Abra outro Terminal e execute:
echo   ────────────────────────────────────────────────
echo   cd frontend
echo   npm run dev
echo.
echo   Você verá:
echo   ▲ Next.js 14.x.x
echo   - Local: http://localhost:3000
echo.

echo   PASSO 3 - Acesse o Site
echo   ────────────────────────────────────────────────
echo   Abra seu navegador em: http://localhost:3000
echo.

echo ═══════════════════════════════════════════════════════════════
echo 📚 Documentação:
echo   
echo   1. QUICK_START.md
echo      → Guia rápido para começar
echo   
echo   2. AUTENTICACAO_GUIA.md
echo      → Detalhes técnicos do sistema
echo   
echo   3. IMPLEMENTACAO_GUIA.md
echo      → Como completar as funcionalidades
echo   
echo   4. RESUMO_IMPLEMENTACAO.md
echo      → Visão geral completa
echo.

echo ═══════════════════════════════════════════════════════════════
echo 🆘 PROBLEMAS COMUNS:
echo.
echo ❌ "python não é reconhecido como comando"
echo   → Reinstale Python com "Add to PATH" marcado
echo.
echo ❌ "npm not found"
echo   → Reinstale Node.js com npm incluído
echo.
echo ❌ "ModuleNotFoundError"
echo   → Execute: pip install -r requirements.txt
echo.
echo ❌ "npm ERR!"
echo   → Execute: npm install
echo.

echo ═══════════════════════════════════════════════════════════════
echo 🎉 Bom desenvolvimento!
echo ═══════════════════════════════════════════════════════════════

pause
