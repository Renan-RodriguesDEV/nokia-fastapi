# 🚀 Guia de Implementação - Sistema de Autenticação e Autorização

## ✅ O que foi implementado

### 1. **Autenticação Completa**

- ✅ Página de Login (`/login`)
- ✅ Página de Registro (`/register`)
- ✅ Hook `useAuth()` para gerenciar autenticação
- ✅ Armazenamento de tokens no `localStorage`
- ✅ Middleware de proteção de rotas

### 2. **Controle de Acesso**

- ✅ Diferenciação entre Cliente e Admin
- ✅ Home page dinâmica baseado no tipo de usuário
- ✅ Proteção de rotas com `useAuth()`
- ✅ Renderização condicional de funcionalidades

### 3. **Interface Moderna**

- ✅ Design responsivo com Tailwind CSS
- ✅ Suporte a modo dark
- ✅ Componentes reutilizáveis
- ✅ Animações e transições suaves
- ✅ Feedback visual completo

### 4. **Páginas Base**

- ✅ Home (`/`) - Dashboard principal
- ✅ Login (`/login`) - Autenticação
- ✅ Registro (`/register`) - Criação de conta
- ✅ Produtos (`/products`) - Lista de produtos
- ✅ Usuários (`/users`) - Gerenciamento (Admin)
- ✅ Vendas (`/sales`) - Histórico
- ✅ Carrinho (`/carts`) - Compras

## 🔧 Próximos Passos para Completar

### 1. **Integração da Página de Produtos**

Local: [frontend/app/products/page.tsx](frontend/app/products/page.tsx)

Já possui:

- ✅ Chamada ao endpoint `/products/all`
- ✅ Tratamento de erros
- ✅ Layout responsivo
- ✅ Controle para Admin vs Cliente

Faltam:

- [ ] Botão "Adicionar ao Carrinho" funcional (POST `/cart/create`)
- [ ] Botão "Editar" para Admin (PUT `/products/{id}`)
- [ ] Botão "Deletar" para Admin (DELETE `/products/{id}`)
- [ ] Modal/formulário de criação de produto para Admin

**Exemplo de implementação:**

```typescript
const handleAddToCart = async (productId: number, quantity: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
        product_id: productId,
        quantity,
      }),
    });
    // ... tratamento
  } catch (error) {
    // ... erro
  }
};
```

### 2. **Implementar Página de Carrinho**

Local: [frontend/app/carts/page.tsx](frontend/app/carts/page.tsx)

Necessário:

- [ ] Listar itens do carrinho do usuário
- [ ] Atualizar quantidade de itens
- [ ] Remover itens (DELETE `/cart/delete/{id}`)
- [ ] Cálculo de total
- [ ] Botão para finalizar compra
- [ ] Integração com endpoint `/cart`

**Endpoints necessários:**

```
GET /cart/all              - Listar carrinho do usuário
POST /cart/create          - Adicionar item
PUT /cart/update/{id}      - Atualizar quantidade
DELETE /cart/delete/{id}   - Remover item
```

### 3. **Implementar Página de Vendas**

Local: [frontend/app/sales/page.tsx](frontend/app/sales/page.tsx)

Necessário:

- [ ] Para Cliente: Mostrar suas compras (filtrar por `user_id`)
- [ ] Para Admin: Mostrar todas as vendas com filtros
- [ ] Detalhes de cada venda
- [ ] Status de pagamento
- [ ] Filtros por período, produto, status

**Exemplo:**

```typescript
const isAdmin = user?.is_admin;
const url = isAdmin
  ? `${API_BASE_URL}/sales/all`
  : `${API_BASE_URL}/sales/all?user_id=${user?.id}`;
```

### 4. **Implementar Página de Usuários (Admin)**

Local: [frontend/app/users/page.tsx](frontend/app/users/page.tsx)

Necessário:

- [ ] Listar todos os usuários
- [ ] Criar novo usuário (POST `/users/create`)
- [ ] Editar usuário (PUT `/users/{id}`)
- [ ] Deletar usuário (DELETE `/users/{id}`)
- [ ] Toggle entre Admin e Cliente
- [ ] Busca/filtros

### 5. **Componente Header Reutilizável**

Local: [frontend/components/Header.tsx](frontend/components/Header.tsx)

Sugestão de uso:

```typescript
// Em cada página protegida, adicione:
import { Header } from "@/components/Header";

export default function Page() {
  return (
    <>
      <Header />
      {/* conteúdo */}
    </>
  );
}
```

### 6. **Recuperação de Senha**

Faltam implementar:

- [ ] Página `/forgot-password`
- [ ] Página `/reset-password`
- [ ] Integração com endpoints:
  - `POST /auth/forgot-password`
  - `PUT /auth/reset-password`

**Exemplo:**

```typescript
// POST /auth/forgot-password
const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
  method: "POST",
  body: JSON.stringify({ username }),
});
const { reset_token } = await response.json();
```

### 7. **Refresh Token (Automático)**

Implementar renovação de token:

```typescript
const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const { access_token } = await response.json();
  localStorage.setItem("access_token", access_token);
};
```

## 📋 Checklist de Configuração

- [ ] Criar arquivo `.env.local` na pasta frontend:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

- [ ] Verificar CORS no backend (deve permitir `http://localhost:3000`)

- [ ] Backend estar rodando em `http://localhost:8000`

- [ ] Banco de dados populado com dados de teste

## 🧪 Dados de Teste

Para testar o sistema, crie usuários:

### Cliente

```json
{
  "username": "cliente1",
  "email": "cliente@email.com",
  "password": "senha123",
  "is_admin": false
}
```

### Administrador

```json
{
  "username": "admin",
  "email": "admin@email.com",
  "password": "senha123",
  "is_admin": true
}
```

## 🎯 Fluxos de Teste

### Teste como Cliente

1. Acesse `/login`
2. Faça login com `cliente1` / `senha123`
3. Veja a home com funcionalidades limitadas
4. Clique em "Produtos"
5. Veja lista de produtos
6. Clique em "Adicionar ao Carrinho"
7. Vá para "Carrinho"
8. Finalize a compra

### Teste como Admin

1. Acesse `/login`
2. Faça login com `admin` / `senha123`
3. Veja a home com funcionalidades de admin
4. Clique em "Gerenciar Produtos"
5. Veja lista e opções de criar/editar/deletar
6. Clique em "Usuários"
7. Veja e gerencie usuários
8. Clique em "Vendas"
9. Veja todas as vendas com filtros

### Teste de Segurança

1. Tente acessar `/users` como cliente → Deve redirecionar para `/`
2. Tente acessar `/products` sem autenticação → Deve redirecionar para `/login`
3. Limpe o token do localStorage → Deve redirecionar para `/login`

## 🐛 Troubleshooting

### Problema: "Erro ao fazer login"

- Verificar se o backend está rodando
- Verificar se a URL da API está correta em `.env.local`
- Verificar CORS no backend

### Problema: "Token inválido"

- Limpar localStorage: `localStorage.clear()`
- Fazer login novamente
- Verificar expiração do token no backend

### Problema: "Acesso negado"

- Verificar se o usuário tem permissão (admin/cliente)
- Verificar os endpoints no backend
- Testar os endpoints diretamente com Postman

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Auth](https://jwt.io/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

---

**Status:** ✅ Autenticação Implementada | ⏳ Funcionalidades em Desenvolvimento

**Última atualização:** Janeiro 2026
