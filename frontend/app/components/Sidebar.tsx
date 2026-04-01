"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Links para Cliente
  const clientLinks = [
    {
      icon: "🏠",
      label: "Pagina Inicial",
      href: "/",
      color: "hover:text-blue-600",
    },
    {
      icon: "🛍️",
      label: "Meus Produtos",
      href: "/products",
      color: "hover:text-blue-600",
    },
    {
      icon: "🛒",
      label: "Meu Carrinho",
      href: "/carts",
      color: "hover:text-blue-600",
    },
    {
      icon: "📋",
      label: "Minhas Compras",
      href: "/sales",
      color: "hover:text-blue-600",
    },
  ];

  // Links para Admin
  const adminLinks = [
    {
      icon: "🏠",
      label: "Pagina Inicial",
      href: "/",
      color: "hover:text-blue-600",
    },
    {
      icon: "📦",
      label: "Gerenciar Produtos",
      href: "/products",
      color: "hover:text-blue-600",
    },
    {
      icon: "👥",
      label: "Gerenciar Usuários",
      href: "/users",
      color: "hover:text-blue-600",
    },
    {
      icon: "💳",
      label: "Gerenciar Vendas",
      href: "/admin/sales",
      color: "hover:text-blue-600",
    },
    {
      icon: "📊",
      label: "Histórico de Vendas",
      href: "/sales",
      color: "hover:text-blue-600",
    },
  ];

  const links = user?.is_admin ? adminLinks : clientLinks;

  return (
    <>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className={`hidden sm:block sm:fixed left-0 top-0 h-screen bg-white border-r border-blue-200 shadow-lg transition-all duration-300 z-30 ${
          isOpen ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-blue-200">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0">
              <span className="text-lg">💄</span>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-900 truncate">
                  Nokia Center
                </h1>
                <p className="text-xs text-gray-600 truncate">
                  Centro de Cosméticos
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 ${link.color}`}
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
          <div className="space-y-3 border-t border-blue-200 pt-4">
            {/* User Profile */}
            {isOpen && user && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Logado como</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-600">
                  {user.is_admin ? "👑 Administrador" : "👤 Cliente"}
                </p>
              </div>
            )}

            {/* Profile Link */}
            <Link
              href="/about"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600"
              title="Meu Perfil"
            >
              <span className="text-lg flex-shrink-0">👤</span>
              {isOpen && (
                <span className="text-sm font-medium">Meu Perfil</span>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-blue-50 hover:bg-blue-100 text-blue-600"
              title="Sair"
            >
              <span className="text-lg">🚪</span>
              {isOpen && <span className="text-sm font-medium">Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
