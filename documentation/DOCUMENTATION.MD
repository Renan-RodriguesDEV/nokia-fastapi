# 📚 DOCUMENTAÇÃO COMPLETA - Padaria FastAPI

## Índice

1. [Visão Geral](#visão-geral)
2. [Quick Start](#quick-start)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Autenticação e Autorização](#autenticação-e-autorização)
5. [API REST Completa](#api-rest-completa)
6. [Frontend - Next.js](#frontend---nextjs)
7. [Backend - FastAPI](#backend---fastapi)
8. [Migrações com Alembic](#migrações-com-alembic)
9. [Guia de Implementação](#guia-de-implementação)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

**Padaria FastAPI** é um sistema completo de e-commerce para gerenciar uma padaria com:

- ✅ Frontend moderno em Next.js (React + TypeScript)
- ✅ Backend robusto em FastAPI
- ✅ Autenticação JWT com OAuth2
- ✅ Sistema de autorização com dois tipos de usuário (Cliente e Admin)
- ✅ Persistência relacional via SQLAlchemy
- ✅ Migrações automáticas com Alembic
- ✅ Envio de emails SMTP integrado
- ✅ API REST assíncrona completa

### Estatísticas do Projeto

| Métrica                | Valor |
| ---------------------- | ----- |
| Arquivos Criados       | 20+   |
| Linhas de Código       | 3000+ |
| Linhas de Documentação | 2000+ |
| Páginas Implementadas  | 8     |
| Endpoints de API       | 25+   |
| Componentes React      | 4+    |
| Rotas Protegidas       | 5+    |

---

## Quick Start

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL (ou SQLite para desenvolvimento)

### Instalação Rápida

#### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bakery-fastapi.git
cd bakery-fastapi
```

#### 2. Configure o Backend

```bash
cd backend

# Crie um ambiente virtual
python -m venv .venv
.venv\Scripts\activate   # Windows
source .venv/bin/activate # macOS/Linux

# Instale as dependências
pip install -r requirements.txt

# Configure o arquivo .env
cp .env.example .env
# Edite .env com suas credenciais

# Execute as migrações
alembic upgrade head

# Inicie o servidor
uvicorn app:app --reload
```

O backend estará disponível em `http://localhost:8000`

#### 3. Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

#### 4. Acesse a aplicação

Abra seu navegador em `http://localhost:3000` e comece a usar!

---

## Arquitetura do Projeto

### Estrutura de Diretórios

```
bakery-fastapi/
├── backend/
│   ├── app.py                      # Aplicação FastAPI principal
│   ├── requirements.txt            # Dependências Python
│   ├── alembic.ini                # Configuração de migrações
│   ├── .env                       # Variáveis de ambiente
│   ├── auth/                      # Módulo de autenticação
│   │   └── auth.py               # JWT, OAuth2, bcrypt
│   ├── config/
│   │   └── config.py             # Configurações da aplicação
│   ├── db/
│   │   ├── base.py               # Base para ORM
│   │   ├── connection.py         # Conexão com banco
│   │   └── entities.py           # Modelos SQLAlchemy
│   ├── routes/
│   │   ├── auth.py               # Endpoints de autenticação
│   │   ├── users.py              # CRUD de usuários
│   │   ├── products.py           # CRUD de produtos
│   │   ├── sales.py              # Gerenciar vendas
│   │   └── cart.py               # Gerenciar carrinho
│   ├── schemas/
│   │   ├── user.py               # Schema Pydantic User
│   │   ├── product.py            # Schema Pydantic Product
│   │   ├── sale.py               # Schema Pydantic Sale
│   │   ├── cart.py               # Schema Pydantic Cart
│   │   └── token.py              # Schema JWT
│   ├── services/
│   │   ├── email.py              # Serviço SMTP
│   │   ├── sales.py              # Lógica de vendas
│   │   └── token.py              # Gerenciar tokens
│   ├── exceptions/
│   │   └── handle_exceptions.py  # Tratamento de erros
│   └── migrations/
│       ├── env.py
│       └── versions/
│           └── *.py              # Arquivos de migração
│
├── frontend/
│   ├── package.json              # Dependências Node.js
│   ├── tsconfig.json            # Configuração TypeScript
│   ├── next.config.ts           # Configuração Next.js
│   ├── middleware.ts            # Middleware de proteção
│   ├── .env.local               # Variáveis de ambiente
│   ├── app/
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Home/Dashboard
│   │   ├── login/
│   │   │   └── page.tsx         # Página de login
│   │   ├── register/
│   │   │   └── page.tsx         # Página de registro
│   │   ├── products/
│   │   │   └── page.tsx         # Lista de produtos
│   │   ├── users/
│   │   │   └── page.tsx         # Gerenciar usuários (Admin)
│   │   ├── sales/
│   │   │   └── page.tsx         # Histórico de vendas
│   │   └── carts/
│   │       └── page.tsx         # Carrinho de compras
│   ├── components/
│   │   ├── Header.tsx           # Header reutilizável
│   │   └── ProtectedRoute.tsx   # Wrapper de proteção
│   ├── hooks/
│   │   └── useAuth.ts           # Hook de autenticação
│   ├── lib/
│   │   └── api/
│   │       ├── index.ts         # Export central
│   │       ├── auth.ts          # Funções de autenticação
│   │       ├── users.ts         # Funções de usuários
│   │       ├── products.ts      # Funções de produtos
│   │       ├── sales.ts         # Funções de vendas
│   │       └── cart.ts          # Funções de carrinho
│   └── public/                  # Arquivos estáticos
│
└── documentation/
    └── DOCUMENTATION.MD         # Este arquivo
```

---

## Autenticação e Autorização

### Sistema de Autenticação

O projeto implementa autenticação OAuth2/JWT com os seguintes componentes:

#### 1. **Geração de Tokens**

```typescript
// Frontend
const response = await fetch("http://localhost:8000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

const data = await response.json();
// Retorna:
// {
//   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
//   "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
//   "token_type": "bearer"
// }
```

#### 2. **Armazenamento de Tokens**

```typescript
// localStorage
localStorage.setItem("access_token", access_token);
localStorage.setItem("refresh_token", refresh_token);
```

#### 3. **Uso de Tokens em Requisições**

```typescript
const headers = {
  Authorization: `Bearer ${access_token}`,
  "Content-Type": "application/json",
};

fetch("/api/users/me", { headers });
```

### Sistema de Autorização

Dois tipos de usuários com permissões diferentes:

#### 👤 Cliente

**Permissões:**

- Ver produtos
- Adicionar ao carrinho
- Realizar compras
- Ver histórico de compras pessoais

**Rotas Disponíveis:**

- GET `/products/all` - Ver produtos
- POST `/cart/create` - Adicionar ao carrinho
- GET `/cart/all` - Ver carrinho
- POST `/sales/create` - Realizar compra
- GET `/sales/all?user_id={id}` - Histórico pessoal

#### 👑 Administrador

**Permissões:**

- Criar/editar/deletar produtos
- Ver todos os usuários
- Gerenciar contas
- Ver todas as vendas
- Gerar relatórios

**Rotas Disponíveis:**

- GET/POST/PUT/DELETE `/products/*` - Gerenciar produtos
- GET/PUT/DELETE `/users/*` - Gerenciar usuários
- GET `/sales/all` - Ver todas as vendas

### Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Insere credenciais (username, password)
   ↓
3. POST /auth/login
   ↓
4. Backend valida credenciais
   ├─ Sucesso → Retorna tokens JWT
   └─ Falha → Retorna erro 401
   ↓
5. Frontend armazena tokens em localStorage
   ↓
6. GET /users/me com Bearer token
   ↓
7. Backend retorna dados do usuário
   ↓
8. Frontend renderiza home conforme is_admin
   ├─ Cliente → Dashboard cliente
   └─ Admin → Dashboard admin
```

---

## API REST Completa

### Endpoints de Autenticação

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "usuario@email.com",
  "password": "senha123"
}

Response:
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

#### Recuperar Senha

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "username": "usuario@email.com"
}

Response:
{
  "message": "Email enviado com código de reset"
}
```

#### Reset de Senha

```http
POST /auth/reset-password
Content-Type: application/json

{
  "username": "usuario@email.com",
  "password": "nova_senha",
  "token": "codigo-reset"
}

Response:
{
  "message": "Senha alterada com sucesso"
}
```

### Endpoints de Usuários

#### Listar Todos (Admin)

```http
GET /users/all
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "João Silva",
    "username": "joao@example.com",
    "telephone": "(11) 9999-9999",
    "is_admin": false,
    "created_at": "2026-01-12T10:00:00"
  }
]
```

#### Usuário Atual

```http
GET /users/me
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "name": "João Silva",
  "username": "joao@example.com",
  "telephone": "(11) 9999-9999",
  "is_admin": false,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Criar Usuário

```http
POST /users/create
Content-Type: application/json

{
  "name": "João Silva",
  "username": "joao@example.com",
  "password": "senha123",
  "telephone": "(11) 9999-9999",
  "is_admin": false
}

Response:
{
  "id": 1,
  "name": "João Silva",
  "username": "joao@example.com",
  "telephone": "(11) 9999-9999",
  "is_admin": false,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Atualizar Usuário

```http
PATCH /users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "telephone": "(11) 8888-8888"
}

Response:
{
  "id": 1,
  "name": "João Silva Atualizado",
  "username": "joao@example.com",
  "telephone": "(11) 8888-8888",
  "is_admin": false,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Deletar Usuário

```http
DELETE /users/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Usuário deletado com sucesso"
}
```

### Endpoints de Produtos

#### Listar Produtos

```http
GET /products/all
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "Pão Francês",
    "description": "Pão francês fresco",
    "price": 5.50,
    "stock": 100,
    "category": "pães",
    "image_url": "https://...",
    "created_at": "2026-01-12T10:00:00"
  }
]
```

#### Criar Produto (Admin)

```http
POST /products/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Pão Francês",
  "description": "Pão francês fresco",
  "price": 5.50,
  "stock": 100,
  "category": "pães"
}

Response:
{
  "id": 1,
  "name": "Pão Francês",
  "description": "Pão francês fresco",
  "price": 5.50,
  "stock": 100,
  "category": "pães",
  "image_url": null,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Atualizar Produto (Admin)

```http
PUT /products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Pão Francês Premium",
  "price": 6.50,
  "stock": 150
}

Response:
{
  "id": 1,
  "name": "Pão Francês Premium",
  "description": "Pão francês fresco",
  "price": 6.50,
  "stock": 150,
  "category": "pães",
  "image_url": null,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Deletar Produto (Admin)

```http
DELETE /products/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Produto deletado com sucesso"
}
```

### Endpoints de Carrinho

#### Listar Carrinho

```http
GET /cart/all
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2,
    "created_at": "2026-01-12T10:00:00"
  }
]
```

#### Adicionar ao Carrinho

```http
POST /cart/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": 1,
  "product_id": 1,
  "quantity": 2
}

Response:
{
  "id": 1,
  "user_id": 1,
  "product_id": 1,
  "quantity": 2,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Atualizar Quantidade

```http
PUT /cart/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 5
}

Response:
{
  "id": 1,
  "user_id": 1,
  "product_id": 1,
  "quantity": 5,
  "created_at": "2026-01-12T10:00:00"
}
```

#### Remover do Carrinho

```http
DELETE /cart/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Item removido do carrinho"
}
```

### Endpoints de Vendas

#### Listar Vendas

```http
GET /sales/all
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2,
    "total_price": 11.00,
    "payment_status": "pending",
    "created_at": "2026-01-12T10:00:00"
  }
]
```

#### Criar Venda

```http
POST /sales/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": 1,
  "product_id": 1,
  "quantity": 2,
  "total_price": 11.00
}

Response:
{
  "id": 1,
  "user_id": 1,
  "product_id": 1,
  "quantity": 2,
  "total_price": 11.00,
  "payment_status": "pending",
  "created_at": "2026-01-12T10:00:00"
}
```

---

## Frontend - Next.js

### Configuração

#### Variáveis de Ambiente

Crie `.env.local` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev", // Inicia servidor de desenvolvimento
    "build": "next build", // Build para produção
    "start": "next start", // Inicia servidor de produção
    "lint": "eslint" // Verifica erros de lint
  }
}
```

### Hook useAuth

O hook `useAuth()` gerencia toda a autenticação do frontend:

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, isAuthenticated, token, login, logout, isLoading } = useAuth();

  if (isLoading) return <p>Carregando...</p>;

  if (!isAuthenticated) return <p>Faça login</p>;

  return (
    <div>
      <p>Bem-vindo, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

**Métodos disponíveis:**

- `login(username, password)` - Realiza login
- `logout()` - Faz logout
- `register(name, username, password, telephone)` - Cria novo usuário

**Estados disponíveis:**

- `user` - Dados do usuário atual
- `token` - Token JWT armazenado
- `isAuthenticated` - Booleano se está logado
- `isLoading` - Booleano se está carregando

### Componentes

#### Header

Componente reutilizável que mostra nome do usuário, tipo e opções de logout:

```typescript
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>Conteúdo da página</main>
    </>
  );
}
```

#### ProtectedRoute

Wrapper para proteger componentes ou páginas:

```typescript
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <h1>Painel Admin</h1>
      {/* Conteúdo só visível para admin */}
    </ProtectedRoute>
  );
}
```

### Páginas Implementadas

#### `/login` - Autenticação

```typescript
// Componentes:
// - Input para username
// - Input para password
// - Botão de login
// - Link para registro
// - Link para recuperar senha

// Funcionalidade:
// 1. Usuário insere credenciais
// 2. onClick → login() do useAuth
// 3. Sucesso → Redireciona para /
// 4. Erro → Mostra mensagem de erro
```

#### `/register` - Registro de Novo Usuário

```typescript
// Campos:
// - Nome completo
// - Email (username)
// - Telefone (opcional)
// - Senha
// - Confirmar senha

// Validações:
// - Email válido
// - Senhas coincidem
// - Números de telefone válidos

// Funcionalidade:
// 1. Valida formulário
// 2. POST /users/create
// 3. Sucesso → Redireciona para /login
// 4. Erro → Mostra mensagem
```

#### `/` - Home/Dashboard

```typescript
// Cliente vê:
// - Botão "Meus Produtos"
// - Botão "Meu Carrinho"
// - Botão "Minhas Compras"
// - Bem-vindo personalizado

// Admin vê:
// - Botão "Gerenciar Produtos"
// - Botão "Gerenciar Usuários"
// - Botão "Histórico de Vendas"
// - Dashboard com estatísticas

// Middleware:
// - Redireciona para /login se não autenticado
```

#### `/products` - Produtos

```typescript
// Cliente:
// - Lista de produtos com descrição e preço
// - Botão "Adicionar ao Carrinho"
// - Filtros por categoria

// Admin:
// - Lista de produtos com estoque
// - Botão "Editar"
// - Botão "Deletar"
// - Botão "Criar Novo"
// - Modal de criação/edição
```

#### `/carts` - Carrinho

```typescript
// Funcionalidade:
// - Lista itens do carrinho
// - Mostrar quantidade e preço unitário
// - Campo para atualizar quantidade
// - Botão para remover item
// - Cálculo de total
// - Botão para finalizar compra
// - Botão para continuar comprando
```

#### `/sales` - Vendas/Compras

```typescript
// Cliente:
// - Histórico pessoal de compras
// - Data, produtos, total, status
// - Filtros por data/status

// Admin:
// - Histórico completo de vendas
// - Detalhes do cliente
// - Dados de pagamento
// - Opções de atualizar status
```

#### `/users` - Gerenciar Usuários (Admin)

```typescript
// Funcionalidade:
// - Lista todos os usuários
// - Mostrar tipo (cliente/admin)
// - Data de criação
// - Botão para editar
// - Botão para deletar
// - Modal para criar novo usuário
```

### API Client (lib/api/)

Módulos especializados para chamadas à API:

```typescript
// auth.ts
import { authApi } from "@/lib/api";

await authApi.login(username, password);
await authApi.forgotPassword(username);
await authApi.resetPassword(username, password, token);

// users.ts
import { usersApi } from "@/lib/api";

await usersApi.getCurrentUser(token);
await usersApi.getAllUsers(token);
await usersApi.createUser(userData);
await usersApi.updateUser(userId, data, token);
await usersApi.deleteUser(userId, token);

// products.ts
import { productsApi } from "@/lib/api";

await productsApi.getAllProducts(token);
await productsApi.getProduct(productId, token);
await productsApi.createProduct(data, token);
await productsApi.updateProduct(productId, data, token);
await productsApi.deleteProduct(productId, token);

// cart.ts
import { cartApi } from "@/lib/api";

await cartApi.getCart(token);
await cartApi.addToCart(userId, productId, quantity, token);
await cartApi.updateCartItem(itemId, quantity, token);
await cartApi.removeFromCart(itemId, token);

// sales.ts
import { salesApi } from "@/lib/api";

await salesApi.getAllSales(userId, token);
await salesApi.createSale(saleData, token);
```

---

## Backend - FastAPI

### Configuração

#### Variáveis de Ambiente (.env)

```ini
# Banco de Dados
DB_URL=postgresql+psycopg2://user:password@localhost:5432/padaria

# Autenticação
SECRET_KEY=sua-chave-secreta-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_TIME=4320

# Debug
DEBUG=TRUE

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
```

#### requirements.txt

```
fastapi==0.109.2
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
python-dotenv==1.0.0
bcrypt==4.1.1
pyjwt==2.8.1
python-multipart==0.0.6
alembic==1.13.1
psycopg2-binary==2.9.9
```

### Estrutura de Rotas

#### auth.py

Endpoints de autenticação:

```python
# POST /auth/login
# Parâmetros: username, password
# Retorna: access_token, refresh_token, token_type

# POST /auth/forgot-password
# Parâmetros: username
# Retorna: mensagem de sucesso

# POST /auth/reset-password
# Parâmetros: username, password, token
# Retorna: mensagem de sucesso
```

#### users.py

Endpoints de usuários (CRUD):

```python
# GET /users/all (Admin)
# GET /users/me (Autenticado)
# GET /users/{id} (Admin ou proprietário)
# POST /users/create (Público)
# PATCH /users/{id} (Admin ou proprietário)
# DELETE /users/{id} (Admin ou proprietário)
```

#### products.py

Endpoints de produtos:

```python
# GET /products/all (Público)
# GET /products/{id} (Público)
# POST /products/create (Admin)
# PUT /products/{id} (Admin)
# DELETE /products/{id} (Admin)
```

#### cart.py

Endpoints de carrinho:

```python
# GET /cart/all (Autenticado)
# POST /cart/create (Autenticado)
# PUT /cart/{id} (Autenticado)
# DELETE /cart/{id} (Autenticado)
```

#### sales.py

Endpoints de vendas:

```python
# GET /sales/all (Autenticado)
# POST /sales/create (Autenticado)
# PUT /sales/{id} (Admin)
# GET /sales/{id} (Admin ou proprietário)
```

### Modelos de Dados

#### User

```python
class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String(255), nullable=False)
    username: str = Column(String(255), unique=True, nullable=False)
    password: str = Column(String(255), nullable=False)
    telephone: str = Column(String(20), nullable=True)
    is_admin: bool = Column(Boolean, default=False)
    created_at: datetime = Column(DateTime, default=datetime.now)
```

#### Product

```python
class Product(Base):
    __tablename__ = "products"

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String(255), nullable=False)
    description: str = Column(Text, nullable=True)
    price: float = Column(Float, nullable=False)
    stock: int = Column(Integer, default=0)
    category: str = Column(String(100), nullable=True)
    image_url: str = Column(String(500), nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.now)
```

#### Cart

```python
class Cart(Base):
    __tablename__ = "carts"

    id: int = Column(Integer, primary_key=True)
    user_id: int = Column(Integer, ForeignKey("users.id"))
    product_id: int = Column(Integer, ForeignKey("products.id"))
    quantity: int = Column(Integer, default=1)
    created_at: datetime = Column(DateTime, default=datetime.now)
```

#### Sale

```python
class Sale(Base):
    __tablename__ = "sales"

    id: int = Column(Integer, primary_key=True)
    user_id: int = Column(Integer, ForeignKey("users.id"))
    product_id: int = Column(Integer, ForeignKey("products.id"))
    quantity: int = Column(Integer, nullable=False)
    total_price: float = Column(Float, nullable=False)
    payment_status: str = Column(String(50), default="pending")
    created_at: datetime = Column(DateTime, default=datetime.now)
```

### Serviços

#### email.py

Classe `SenderMail` para envio de emails:

```python
from services.email import SenderMail

# Instanciar
mailer = SenderMail()

# Enviar email simples
await mailer.send(
    to_email="user@example.com",
    subject="Bem-vindo!",
    body="Texto do email"
)

# Enviar email HTML
await mailer.send(
    to_email="user@example.com",
    subject="Bem-vindo!",
    body="<h1>Bem-vindo à Padaria!</h1>",
    is_html=True
)
```

#### token.py

Gerenciar tokens JWT:

```python
from services.token import create_token, verify_token

# Criar token
token = create_token(
    data={"sub": user_id},
    expires_in=3600  # 1 hora
)

# Verificar token
payload = verify_token(token)
user_id = payload.get("sub")
```

---

## Migrações com Alembic

### Configuração Inicial

```bash
# Já configurado no projeto
# Arquivo: backend/alembic.ini
```

### Criar Migração

```bash
cd backend

# Gerar automática (recomendado)
alembic revision --autogenerate -m "Descrição da mudança"

# Criar vazia (para customizações)
alembic revision -m "Descrição da mudança"
```

### Executar Migrações

```bash
# Aplicar todas as pending
alembic upgrade head

# Aplicar até revisão específica
alembic upgrade [revision_id]

# Reverter última migração
alembic downgrade -1

# Ver status
alembic current
alembic history
```

### Estrutura de Arquivo de Migração

```python
"""description.

Revision ID: xxxxx
Revises: yyyyy
Create Date: 2026-01-12 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'xxxxx'
down_revision = 'yyyyy'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Adicionar coluna
    op.add_column('users', sa.Column('telephone', sa.String(20), nullable=True))

    # Criar índice
    op.create_index('ix_users_username', 'users', ['username'], unique=True)

def downgrade() -> None:
    # Remover índice
    op.drop_index('ix_users_username', table_name='users')

    # Remover coluna
    op.drop_column('users', 'telephone')
```

---

## Guia de Implementação

### Adicionar Nova Funcionalidade

#### 1. Criar Modelo no Backend

Adicione em `backend/db/entities.py`:

```python
class NewEntity(Base):
    __tablename__ = "new_entities"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    # ... outros campos
```

#### 2. Criar Schema Pydantic

Crie `backend/schemas/new_entity.py`:

```python
from pydantic import BaseModel, ConfigDict

class NewEntityCreate(BaseModel):
    name: str
    # ... outros campos

class NewEntityResponse(BaseModel):
    id: int
    name: str
    # ... outros campos

    model_config = ConfigDict(from_attributes=True)
```

#### 3. Criar Endpoints

Crie `backend/routes/new_entity.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import get_db
from db.entities import NewEntity
from schemas.new_entity import NewEntityCreate, NewEntityResponse

router = APIRouter(prefix="/new-entities", tags=["new-entities"])

@router.post("/create", response_model=NewEntityResponse)
async def create(data: NewEntityCreate, db: Session = Depends(get_db)):
    entity = NewEntity(**data.dict())
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity

@router.get("/all", response_model=list[NewEntityResponse])
async def get_all(db: Session = Depends(get_db)):
    return db.query(NewEntity).all()
```

#### 4. Incluir Router em app.py

```python
from routes.new_entity import router as new_entity_router
app.include_router(new_entity_router)
```

#### 5. Criar Migração

```bash
alembic revision --autogenerate -m "Add new_entities table"
alembic upgrade head
```

#### 6. Criar API Client no Frontend

Crie `frontend/lib/api/new_entities.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const newEntitiesApi = {
  async create(data: any, token: string) {
    const response = await fetch(`${API_URL}/new-entities/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getAll(token: string) {
    const response = await fetch(`${API_URL}/new-entities/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
```

#### 7. Criar Página no Frontend

Crie `frontend/app/new-entities/page.tsx`:

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function NewEntities() {
  const { user, token, isAuthenticated } = useAuth();
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEntities();
    }
  }, [isAuthenticated, token]);

  async function fetchEntities() {
    // Implementar lógica
  }

  return (
    <>
      <Header />
      <main>{/* Conteúdo */}</main>
    </>
  );
}
```

---

## Troubleshooting

### Backend

#### "Module not found: sqlalchemy"

```bash
pip install -r requirements.txt
```

#### "Connection refused: localhost:5432"

PostgreSQL não está rodando. Inicie o serviço:

```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

#### "Could not locate a Flask application"

Certifique-se de estar no diretório `backend/`:

```bash
cd backend
uvicorn app:app --reload
```

### Frontend

#### "Cannot find module '@/lib/api'"

Certifique-se de que `tsconfig.json` tem `@` mapeado:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### "NEXT_PUBLIC_API_URL is undefined"

Crie `.env.local` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### "Blank page after login"

Verifique o console do navegador (F12) para erros. Certifique-se de:

1. Backend está rodando em http://localhost:8000
2. Token está sendo salvo em localStorage
3. `useAuth()` está retornando dados

#### "CORS error"

Backend precisa permitir requisições do frontend. Em `backend/app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)
```

### Geral

#### Como resetar o banco de dados?

```bash
# PostgreSQL
dropdb padaria
createdb padaria
alembic upgrade head

# SQLite (desenvolvimento)
rm backend/test.db
alembic upgrade head
```

#### Como criar um usuário admin de teste?

```bash
# Use o Swagger em http://localhost:8000/docs
# 1. POST /users/create com is_admin=true
# 2. OU use psql/pgAdmin para UPDATE users SET is_admin=true WHERE id=1
```

---

## Próximas Etapas

### Priority 1 (Curto Prazo)

- [ ] Implementar validações mais robustas
- [ ] Adicionar upload de imagens de produtos
- [ ] Implementar filtros avançados de produtos
- [ ] Melhorar design do carrinho
- [ ] Integrar gateway de pagamento

### Priority 2 (Médio Prazo)

- [ ] Adicionar testes automatizados (pytest, Vitest)
- [ ] Implementar sistema de notificações por email
- [ ] Adicionar paginação em listas
- [ ] Implementar busca de produtos
- [ ] Adicionar avaliações de produtos

### Priority 3 (Longo Prazo)

- [ ] Deploy em produção (AWS/Heroku/DigitalOcean)
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar logging estruturado
- [ ] Implementar analytics
- [ ] Aplicativo mobile (React Native)

---

## Referências

- [FastAPI Documentação](https://fastapi.tiangolo.com/)
- [Next.js Documentação](https://nextjs.org/docs)
- [SQLAlchemy Documentação](https://docs.sqlalchemy.org/)
- [Alembic Documentação](https://alembic.sqlalchemy.org/)
- [JWT Tutorial](https://jwt.io/introduction)

---

**Última atualização:** Janeiro 2026  
**Status:** Em desenvolvimento ativo  
**Licença:** MIT
