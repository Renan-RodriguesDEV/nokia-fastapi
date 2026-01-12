/**
 * 👥 USUÁRIOS - API endpoints para gerenciamento de usuários
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const usersApi = {
  /**
   * Buscar usuário autenticado atual
   * @param token - JWT access token
   * @returns Dados do usuário logado
   */
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  /**
   * Buscar todos os usuários (Admin)
   * @param token - JWT access token
   * @returns Array de usuários
   */
  getAllUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  /**
   * Criar novo usuário (Public - Registro)
   * @param data - { name, username (email), password, telephone?, is_admin? }
   * @returns Dados do usuário criado
   */
  createUser: async (data: {
    name: string;
    username: string;
    password: string;
    telephone?: string;
    is_admin?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Atualizar usuário
   * @param userId - ID do usuário
   * @param data - Dados a atualizar
   * @param token - JWT access token
   * @returns Dados atualizados
   */
  updateUser: async (
    userId: number,
    data: Partial<{
      name: string;
      username: string;
      password: string;
      telephone: string;
      token:string|undefined;
    }>,
    token: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/users/update/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Deletar usuário (Admin)
   * @param userId - ID do usuário
   * @param token - JWT access token
   * @returns true se deletado com sucesso
   */
  deleteUser: async (userId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 204;
  },
};
