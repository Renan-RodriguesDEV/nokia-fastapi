# 💄 Frontend - Next.js Nokia Center

Cliente web moderno built com Next.js, React e TypeScript. Interface responsiva com autenticação JWT, proteção de rotas e componentes reutilizáveis para loja de beleza e perfumaria.

## 📋 Visão Geral

Frontend completo com:

- ✅ Autenticação JWT OAuth2
- ✅ Dashboard dinâmico (Cliente vs Admin)
- ✅ 8 páginas totalmente funcionais
- ✅ Hook customizado `useAuth()` para gerenciar estado
- ✅ Componentes reutilizáveis
- ✅ Design responsivo (mobile-first)
- ✅ Suporte a modo dark/light
- ✅ Middleware de proteção de rotas

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com URL do backend

# Inicie em desenvolvimento
npm run dev
```

Frontend rodando em `http://localhost:3000`

## 📁 Estrutura de Diretórios

```
frontend/
├── package.json              # Dependências Node.js
├── tsconfig.json            # Configuração TypeScript
├── next.config.ts           # Configuração Next.js
├── tailwind.config.ts       # Configuração Tailwind
├── middleware.ts            # Middleware de proteção
├── .env.local               # Variáveis de ambiente
├── .env.example             # Template de .env
│
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Home/Dashboard
│   ├── globals.css          # Estilos globais
│   │
│   ├── login/
│   │   └── page.tsx         # Página Login
│   ├── register/
│   │   └── page.tsx         # Página Registro
│   ├── products/
│   │   └── page.tsx         # Catálogo Produtos
│   ├── carts/
│   │   └── page.tsx         # Carrinho
│   ├── sales/
│   │   └── page.tsx         # Histórico Vendas
│   ├── users/
│   │   └── page.tsx         # Gerenciar Usuários (Admin)
│   └── forgot-password/
│       └── page.tsx         # Recuperar Senha
│
├── components/
│   ├── Header.tsx           # Header reutilizável
│   └── ProtectedRoute.tsx   # Wrapper de proteção
│
├── hooks/
│   └── useAuth.ts           # Hook de autenticação
│
├── lib/
│   └── api/
│       ├── index.ts         # Exporta todos APIs
│       ├── auth.ts          # Funções autenticação
│       ├── users.ts         # Funções usuários
│       ├── products.ts      # Funções produtos
│       ├── cart.ts          # Funções carrinho
│       └── sales.ts         # Funções vendas
│
└── public/                  # Arquivos estáticos
```

## 🔧 Configuração

### Variáveis de Ambiente (.env.local)

```bash
# URL do Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Opcional (para futuros usos)
NEXT_PUBLIC_APP_NAME=Nokia Center FastAPI
NEXT_PUBLIC_APP_VERSION=0.0.1
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev", // Servidor dev (hot-reload)
    "build": "next build", // Build produção
    "start": "next start", // Executar build
    "lint": "eslint" // Verificar código
  }
}
```

## 📚 Páginas

### `/login` - Autenticação

Formulário de login para usuários existentes.

**Funcionalidades:**

- ✅ Input username (email)
- ✅ Input password
- ✅ Botão login
- ✅ Link para registro
- ✅ Link para recuperar senha
- ✅ Validação de entrada
- ✅ Mensagens de erro
- ✅ Loading state

### `/register` - Novo Usuário

Formulário para registrar nova conta.

**Campos:**

- Nome completo
- Email (username)
- Telefone (opcional)
- Senha
- Confirmar senha

### `/` - Home/Dashboard

Dashboard principal que se adapta conforme tipo de usuário (Cliente vs Admin).

### `/products` - Catálogo

Lista de produtos com opções diferentes conforme tipo de usuário.

### `/carts` - Carrinho

Gerenciamento do carrinho de compras com cálculo de totais.

### `/sales` - Histórico de Vendas

Histórico personalizado conforme tipo de usuário.

### `/users` - Gerenciar Usuários (Admin)

Página exclusiva para administradores gerenciar usuários.

### `/forgot-password` - Recuperar Senha

Fluxo para resetar senha esquecida.

## 🪝 Hook useAuth

Hook central para gerenciamento de autenticação.

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, token, isAuthenticated, isLoading, login, logout, register } =
  useAuth();
```

**Métodos:** `login()`, `logout()`, `register()`  
**Estados:** `user`, `token`, `isAuthenticated`, `isLoading`, `error`

## 🧩 Componentes

### Header

Header reutilizável com nome do usuário e logout.

### ProtectedRoute

Wrapper para proteger componentes por tipo de usuário.

## 📡 API Client (lib/api)

Módulos especializados para chamadas à API:

- `authApi` - Login, registro, reset
- `usersApi` - CRUD de usuários
- `productsApi` - CRUD de produtos
- `cartApi` - Gerenciar carrinho
- `salesApi` - Histórico de vendas

## 🎨 Styling

Tailwind CSS v4 com suporte a dark mode e responsividade mobile-first.

## 🔐 Proteção de Rotas

Middleware automático + hook useAuth para máxima segurança.

## 🚀 Build e Deploy

```bash
npm run build    # Build para produção
npm start        # Executar build localmente
```

Deploy via Vercel recomendado.

## 🐛 Troubleshooting

**"Cannot find module '@/lib/api'"** → Verifique tsconfig.json  
**"NEXT_PUBLIC_API_URL is undefined"** → Crie .env.local  
**"Blank page after login"** → Verifique DevTools console (F12)  
**"CORS error"** → Backend precisa permitir origin do frontend

## 📖 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Stack Técnico

| Componente   | Versão |
| ------------ | ------ |
| Next.js      | 16+    |
| React        | 19+    |
| TypeScript   | 5+     |
| Tailwind CSS | 4+     |

---

**Status:** Em desenvolvimento ativo  
**Última atualização:** Janeiro 2026  
**Versão:** 0.0.1
