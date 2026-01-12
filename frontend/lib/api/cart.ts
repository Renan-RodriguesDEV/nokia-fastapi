/**
 * 🛒 CARRINHO - API endpoints para gerenciamento do carrinho de compras
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const cartApi = {
  /**
   * Adicionar item ao carrinho
   * @param data - { user_id, product_id, quantity }
   * @param token - JWT access token
   * @returns Dados do item no carrinho
   */
  addToCart: async (
    data: {
      user_id: number;
      product_id: number;
      quantity: number;
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
   * @param data - { quantity }
   * @param token - JWT access token
   * @returns Dados atualizados
   */
  updateCartItem: async (
    cartId: number,
    data: { quantity: number },
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
