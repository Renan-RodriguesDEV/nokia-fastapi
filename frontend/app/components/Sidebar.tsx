"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Carregar preferência de tema ao montar
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newIsDark = !isDarkMode;

    if (newIsDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDarkMode(newIsDark);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Links para Cliente
  const clientLinks = [
    {
      icon: "🛍️",
      label: "Meus Produtos",
      href: "/products",
      color: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    {
      icon: "🛒",
      label: "Meu Carrinho",
      href: "/carts",
      color: "hover:text-green-500 dark:hover:text-green-400",
    },
    {
      icon: "📋",
      label: "Minhas Compras",
      href: "/sales",
      color: "hover:text-purple-500 dark:hover:text-purple-400",
    },
  ];

  // Links para Admin
  const adminLinks = [
    {
      icon: "📦",
      label: "Gerenciar Produtos",
      href: "/products",
      color: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    {
      icon: "👥",
      label: "Gerenciar Usuários",
      href: "/users",
      color: "hover:text-red-500 dark:hover:text-red-400",
    },
    {
      icon: "💰",
      label: "Histórico de Vendas",
      href: "/sales",
      color: "hover:text-green-500 dark:hover:text-green-400",
    },
  ];

  const links = user?.is_admin ? adminLinks : clientLinks;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 shadow-lg transition-all duration-300 z-30 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex-shrink-0">
              <span className="text-lg">🍞</span>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  Padaria
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  FastAPI
                </p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 ${link.color}`}
                title={link.label}
              >
                <span className="text-lg flex-shrink-0">{link.icon}</span>
                {isOpen && (
                  <span className="text-sm font-medium">{link.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Info & Actions */}
          <div className="space-y-3 border-t border-gray-200 dark:border-slate-700 pt-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
              title="Alternar tema"
            >
              <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
              {isOpen && (
                <span className="text-sm font-medium">
                  {isDarkMode ? "Claro" : "Escuro"}
                </span>
              )}
            </button>

            {/* User Profile */}
            {isOpen && user && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Logado como
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.is_admin ? "👑 Administrador" : "👤 Cliente"}
                </p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
              title="Sair"
            >
              <span className="text-lg">🚪</span>
              {isOpen && <span className="text-sm font-medium">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-6 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
        title={isOpen ? "Recolher" : "Expandir"}
      >
        <svg
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
    </>
  );
}
