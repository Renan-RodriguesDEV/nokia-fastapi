"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Conecta ao WebSocket apenas uma vez, no mount do provider
  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/stock`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("[WebSocket] Conectado ao servidor de notificações");
    };

    websocket.onmessage = (event) => {
      // Ignora PING
      if (event.data === "PING") {
        console.log("[WebSocket] Ping recebido");
        return;
      }

      console.log("[WebSocket] Notificação recebida:", event.data);

      const notification: Notification = {
        id: Date.now().toString(),
        message: event.data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
    };

    websocket.onerror = (error) => {
      console.error("[WebSocket] Erro:", error);
    };

    websocket.onclose = () => {
      console.log("[WebSocket] Desconectado");
      // Tenta reconectar após 5 segundos
      setTimeout(() => {
        console.log("[WebSocket] Tentando reconectar...");
      }, 5000);
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications deve ser usado dentro de NotificationProvider"
    );
  }
  return context;
}
