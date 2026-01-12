/**
 * 🔐 AUTENTICAÇÃO - API endpoints para login, logout e recuperação de senha
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authApi = {
  /**
   * Login do usuário
   * @param data - { username: string, password: string }
   * @returns { access_token, refresh_token, token_type }
   */
  login: async (data: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Solicitar reset de senha
   * @param data - { username: string } (email do usuário)
   * @returns Confirmação de envio de email
   */
  forgotPassword: async (data: { username: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Resetar senha com token
   * @param data - { username: string, password: string, token: string }
   * @returns Confirmação de reset
   */
  resetPassword: async (data: {
    username: string;
    password: string;
    token: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
