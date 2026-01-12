# 📚 API Documentation - Frontend

## Estrutura dos APIs

A API foi dividida em módulos por funcionalidade para facilitar manutenção e organização:

### Arquivos Disponíveis

```
lib/api/
├── index.ts          # Exporta todos os APIs
├── auth.ts           # 🔐 Autenticação (login, forgot-password, reset-password)
├── users.ts          # 👥 Gerenciamento de usuários
├── products.ts       # 🛒 Gerenciamento de produtos
├── cart.ts           # 🛒 Carrinho de compras
└── sales.ts          # 💰 Vendas/Compras
```

## Como Usar

### 1. Autenticação

```typescript
import { authApi } from "@/lib/api";

// Login
const response = await authApi.login({
  username: "user@example.com",
  password: "password123",
});

const { access_token, refresh_token } = response;
localStorage.setItem("access_token", access_token);

// Solicitar reset de senha
await authApi.forgotPassword({ username: "user@example.com" });

// Reset de senha com token
await authApi.resetPassword({
  username: "user@example.com",
  password: "newpassword123",
  token: "codigo-de-reset",
});
```

### 2. Gerenciamento de Usuários

```typescript
import { usersApi } from "@/lib/api";

const token = localStorage.getItem("access_token");

// Buscar usuário atual
const currentUser = await usersApi.getCurrentUser(token);

// Buscar todos os usuários (Admin)
const allUsers = await usersApi.getAllUsers(token);

// Criar novo usuário (Registro)
const newUser = await usersApi.createUser({
  name: "João Silva",
  username: "joao@example.com",
  password: "senha123",
  telephone: "(11) 99999-9999",
  is_admin: false,
});

// Atualizar usuário
await usersApi.updateUser(
  userId,
  {
    name: "João Silva Atualizado",
  },
  token
);

// Deletar usuário
await usersApi.deleteUser(userId, token);
```

### 3. Gerenciamento de Produtos

```typescript
import { productsApi } from "@/lib/api";

const token = localStorage.getItem("access_token");

// Buscar todos os produtos
const products = await productsApi.getAllProducts(token);

// Buscar um produto específico
const product = await productsApi.getProduct(productId, token);

// Criar produto (Admin)
const newProduct = await productsApi.createProduct(
  {
    name: "Pão Francês",
    description: "Pão francês fresco diariamente",
    price: 5.5,
    stock: 100,
  },
  token
);

// Atualizar produto (Admin)
await productsApi.updateProduct(
  productId,
  {
    price: 6.0,
    stock: 95,
  },
  token
);

// Deletar produto (Admin)
await productsApi.deleteProduct(productId, token);

// Upload de imagem
const file = new File(["content"], "pao.jpg");
await productsApi.uploadProductImage(productId, file, token);
```

### 4. Carrinho de Compras

```typescript
import { cartApi } from "@/lib/api";

const token = localStorage.getItem("access_token");

// Adicionar item ao carrinho
const cartItem = await cartApi.addToCart(
  {
    user_id: userId,
    product_id: productId,
    quantity: 2,
  },
  token
);

// Atualizar quantidade
await cartApi.updateCartItem(
  cartItemId,
  {
    quantity: 5,
  },
  token
);

// Remover item
await cartApi.removeFromCart(cartItemId, token);
```

### 5. Vendas/Compras

```typescript
import { salesApi } from "@/lib/api";

const token = localStorage.getItem("access_token");

// Buscar todas as vendas (Admin)
const allSales = await salesApi.getAllSales(token);

// Buscar vendas com filtros
const filteredSales = await salesApi.getSalesFiltered(
  {
    user_id: userId,
    was_paid: true,
  },
  token
);

// Buscar uma venda específica
const sale = await salesApi.getSale(saleId, token);

// Criar venda (Finalizar compra)
const newSale = await salesApi.createSale(
  {
    user_id: userId,
    product_id: productId,
    quantity: 2,
    was_paid: true,
  },
  token
);
```

## Exemplo Completo em um Componente

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { productsApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      productsApi
        .getAllProducts(token)
        .then((data) => {
          if (data.detail) {
            setError(data.detail);
          } else {
            setProducts(data);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Produtos</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>R$ {product.price}</p>
          <p>Estoque: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

## Tratamento de Erros

Todos os endpoints retornam uma resposta da API. Sempre verifique se há um campo `detail` que indica um erro:

```typescript
try {
  const response = await usersApi.getCurrentUser(token);
  if (response.detail) {
    // Erro retornado pela API
    console.error(response.detail);
  } else {
    // Sucesso
    console.log(response);
  }
} catch (error) {
  // Erro de rede
  console.error(error);
}
```

## Variáveis de Ambiente

Certifique-se que o arquivo `.env.local` está configurado:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Se não definido, o padrão é `http://localhost:8000`.

## Próximos Passos

1. ✅ API dividida em módulos
2. ✅ Índice centralizado para imports
3. ⏳ Implementar páginas de Produtos, Carrinho, Vendas e Usuários
4. ⏳ Adicionar validação de formulários com bibliotecas como `zod` ou `yup`
5. ⏳ Implementar tratamento de erros global
6. ⏳ Adicionar cache com React Query ou SWR
