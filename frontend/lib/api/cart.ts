/**
 * 🛒 CARRINHO - API endpoints para gerenciamento do carrinho de compras
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const cartApi = {
  /**
   * Buscar carrinhos do usuário ou todos (admin)
   * @param filters - { user_id?, product_id? }
   * @param token - JWT access token
   * @returns Array de itens no carrinho
   */
  getCart: async (
    filters: {
      user_id?: number;
      product_id?: number;
    },
    token: string
  ) => {
    const params = new URLSearchParams();
    if (filters.user_id) params.append('user_id', filters.user_id.toString());
    if (filters.product_id) params.append('product_id', filters.product_id.toString());

    const response = await fetch(
      `${API_BASE_URL}/cart/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  /**
   * Adicionar item ao carrinho
   * @param data - { user_id, product_id, count }
   * @param token - JWT access token
   * @returns Dados do item no carrinho
   */
  addToCart: async (
    data: {
      user_id: number;
      product_id: number;
      count: number;
    },
    token: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/cart/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Atualizar quantidade do item no carrinho
   * @param cartId - ID do item no carrinho
   * @param data - { count }
   * @param token - JWT access token
   * @returns Dados atualizados
   */
  updateCartItem: async (
    cartId: number,
    data: { count: number },
    token: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/cart/update/${cartId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Remover item do carrinho
   * @param cartId - ID do item no carrinho
   * @param token - JWT access token
   * @returns true se removido com sucesso
   */
  removeFromCart: async (cartId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/cart/delete/${cartId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 204;
  },
};
