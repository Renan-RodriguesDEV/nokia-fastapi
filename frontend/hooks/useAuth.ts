'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  telephone?: string;
  token?: string;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const fetchCurrentUser = async (accessToken: string) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Falha ao buscar usuário');
  }
};

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 DEBUG: Monitorar mudanças de estado
  useEffect(() => {
    console.log(`[AUTH-STATE] isLoading: ${isLoading}, token: ${!!token}, user: ${!!user}`);
  }, [isLoading, token, user]);

  // Carregar token do localStorage ao montar o hook
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    console.log(`[AUTH] Hook inicializado. Token encontrado: ${!!storedToken}`);
    
    if (storedToken) {
      console.log(`[AUTH] Validando token armazenado...`);
      // 🔑 IMPORTANTE: Carregar os dados ANTES de setToken para evitar renderizações intermediárias
      fetchCurrentUser(storedToken)
        .then((userData) => {
          console.log(`[AUTH] Token válido! Usuário carregado:`, userData);
          // Armazenar tudo de uma vez para evitar estado intermediário
          setToken(storedToken);
          setUser(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn(`[AUTH] Token inválido ou expirado:`, error.message);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // 🍪 Remover cookie do token inválido
          document.cookie = 'access_token=; path=/; max-age=0';
          
          setToken(null);
          setUser(null);
          setIsLoading(false);
        });
    } else {
      console.log(`[AUTH] Nenhum token encontrado. Usuário não autenticado.`);
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // 🔍 DEBUG: Verificar URL da API
      console.log(`[AUTH] Tentando login em: ${API_BASE_URL}/auth/login`);
      console.log(`[AUTH] Credenciais: username="${username}"`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // 🔍 DEBUG: Verificar resposta da API
      console.log(`[AUTH] Status da resposta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[AUTH] Erro no login:`, errorData);
        throw new Error(errorData.detail || 'Falha no login');
      }

      const data = await response.json();
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      console.log(`[AUTH] Login bem-sucedido! Token armazenado.`);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // 🍪 Armazenar token em cookie para o middleware conseguir ler
      document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 dias
      
      setToken(accessToken);

      // Buscar dados do usuário
      const userData = await fetchCurrentUser(accessToken);
      setUser(userData);
      console.log(`[AUTH] Usuário carregado:`, userData);
    } catch (error) {
      // Limpar dados em caso de erro
      console.error(`[AUTH] Erro durante login:`, error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // 🍪 Remover cookie
      document.cookie = 'access_token=; path=/; max-age=0';
      
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log(`[AUTH] Fazendo logout...`);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // 🍪 Remover cookie do token
    document.cookie = 'access_token=; path=/; max-age=0';
    
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };
}
