# 🍞 Padaria FastAPI - Guia de Autenticação e Autorização

## 📋 Visão Geral

Este projeto implementa um sistema completo de autenticação e autorização com controle de acesso baseado no tipo de usuário (Admin vs Cliente).

## 🔐 Fluxo de Autenticação

### 1. **Login**

- Usuário acessa `/login`
- Insere credenciais (usuário e senha)
- Sistema faz requisição ao backend: `POST /auth/login`
- Backend valida credenciais e retorna tokens JWT
- Tokens são armazenados no `localStorage`
- Usuário é redirecionado para a home (`/`)

### 2. **Registro**

- Novo usuário acessa `/register`
- Preenche formulário com dados
- Sistema faz requisição ao backend: `POST /users/create`
- Novo usuário é criado como **Cliente** (não Admin)
- Usuário é redirecionado para `/login`

### 3. **Autenticação Contínua**

- O hook `useAuth()` verifica se existe token no `localStorage` ao montar
- Se houver token, busca dados do usuário em `GET /users/me`
- Token é incluído em headers de autorização: `Authorization: Bearer {token}`

## 👥 Controle de Acesso por Tipo de Usuário

### 👤 Cliente

**Permissões:**

- ✅ Visualizar produtos
- ✅ Adicionar itens ao carrinho
- ✅ Realizar compras
- ✅ Visualizar histórico de compras pessoais

**Restrições:**

- ❌ Não pode gerenciar produtos
- ❌ Não pode visualizar/gerenciar usuários
- ❌ Não pode acessar relatórios de vendas globais

**Funcionalidades Disponíveis:**

- 🛍️ Meus Produtos
- 🛒 Meu Carrinho
- 📋 Minhas Compras

### 👑 Administrador

**Permissões:**

- ✅ Criar, atualizar e deletar produtos
- ✅ Visualizar todos os usuários
- ✅ Administrar contas de usuários
- ✅ Visualizar todas as vendas
- ✅ Acessar relatórios e análises

**Restrições:**

- ❌ Não pode realizar compras
- ❌ Não pode adicionar itens ao carrinho

**Funcionalidades Disponíveis:**

- 📦 Gerenciar Produtos
- 👥 Gerenciar Usuários
- 💰 Histórico de Vendas

## 🗂️ Estrutura de Arquivos

### Frontend

```
frontend/
├── app/
│   ├── page.tsx                 # Home Page (protegida)
│   ├── login/
│   │   └── page.tsx            # Página de Login
│   ├── register/
│   │   └── page.tsx            # Página de Registro
│   ├── products/
│   │   └── page.tsx            # Lista de Produtos
│   ├── users/
│   │   └── page.tsx            # Gerenciar Usuários (Admin)
│   ├── sales/
│   │   └── page.tsx            # Histórico de Vendas
│   └── carts/
│       └── page.tsx            # Carrinho (Cliente)
├── components/
│   ├── Header.tsx              # Header reutilizável
│   ├── ProtectedRoute.tsx       # Wrapper para rotas protegidas
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── hooks/
│   └── useAuth.ts              # Hook de autenticação
├── middleware.ts                # Proteção de rotas
└── .env.local.example           # Variáveis de ambiente

```

### Backend

```
backend/
├── auth/
│   └── auth.py                 # Funções de autenticação JWT
├── routes/
│   ├── auth.py                 # Endpoints de login/token
│   ├── users.py                # Endpoints de usuários
│   ├── products.py             # Endpoints de produtos
│   ├── sales.py                # Endpoints de vendas
│   └── cart.py                 # Endpoints de carrinho
├── db/
│   ├── entities.py             # Modelos do banco
│   └── connection.py           # Conexão com BD
├── schemas/
│   ├── user.py                 # Schemas de validação
│   ├── token.py
│   └── ...
└── services/
    └── token.py                # Serviços de token
```

## 🚀 Como Usar

### Configurar Variáveis de Ambiente

1. **Frontend** - Criar `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. **Backend** - Está em `backend/.env` (se houver)

### Iniciar o Projeto

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## 🔑 Endpoints de Autenticação

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Obter Usuário Atual

```http
GET /users/me
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@email.com",
  "is_admin": false
}
```

### Criar Usuário

```http
POST /users/create
Content-Type: application/json

{
  "username": "novo_usuario",
  "email": "novo@email.com",
  "password": "senha123",
  "is_admin": false
}
```

## 🛡️ Proteção de Rotas

### Middleware (`middleware.ts`)

O middleware protege automaticamente todas as rotas, exceto:

- `/login`
- `/register`
- `/forgot-password`

Usuários sem token são redirecionados para `/login`.

### Hook useAuth

```typescript
const { user, token, isAuthenticated, login, logout, isLoading } = useAuth();

// Usar em componentes
if (!isAuthenticated) {
  return <redirect to="/login" />;
}
```

## 🎯 Fluxo de Autorização no Frontend

1. **Componente Home** verifica tipo de usuário
2. Renderiza diferentes funcionalidades baseado em `user.is_admin`
3. Links são gerados dinamicamente
4. Clientes veem: Produtos, Carrinho, Minhas Compras
5. Admins veem: Gerenciar Produtos, Usuários, Vendas

## 🔄 Renovação de Token

O sistema usa:

- **Access Token**: Curta duração (padrão: alguns minutos)
- **Refresh Token**: Longa duração (padrão: 7 dias)

Quando o access token expirar, use o refresh token para obter um novo:

```http
POST /auth/token
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

## 🚨 Tratamento de Erros

- **401 Unauthorized**: Token inválido/expirado → Redirecionar para `/login`
- **403 Forbidden**: Usuário sem permissão → Mostrar mensagem de erro
- **404 Not Found**: Recurso não existe
- **500 Server Error**: Erro no servidor

## 💡 Dicas de Segurança

1. ✅ Senhas são hashadas no backend (bcrypt)
2. ✅ Tokens JWT com expiração
3. ✅ Proteção CORS (configurar no backend)
4. ✅ Validação de entrada em ambos os lados
5. ✅ Proteção contra XSS e CSRF
6. ✅ Tokens armazenados no `localStorage` (considerar usar HttpOnly cookies em produção)

## 📱 Responsividade

Todos os componentes são responsivos:

- ✅ Mobile-first design
- ✅ Tailwind CSS
- ✅ Grid layouts automáticos
- ✅ Modo dark suportado

## 🔗 Próximas Funcionalidades

- [ ] Redefinição de senha
- [ ] Autenticação OAuth (Google, GitHub)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Auditoria de login
- [ ] Gestão de sessões múltiplas

---

**Última atualização:** Janeiro 2026
