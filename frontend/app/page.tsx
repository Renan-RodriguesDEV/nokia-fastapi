"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // 🔍 DEBUG: Monitorar estado na página home
  useEffect(() => {
    console.log(
      `[HOME] isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}, user: ${!!user}`
    );

    if (!isLoading && !isAuthenticated) {
      console.log(
        `[HOME] Usuário não autenticado! Redirecionando para login...`
      );
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 🔍 DEBUG: Verificar quando está no loading
  if (isLoading) {
    console.log(`[HOME] Renderizando loading spinner...`);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // 🔍 DEBUG: Verificar se não está autenticado
  if (!isAuthenticated || !user) {
    console.log(
      `[HOME] Não autenticado ou usuário não carregado. isAuthenticated: ${isAuthenticated}, user: ${!!user}`
    );
    return null;
  }

  console.log(`[HOME] Renderizando home page para usuário: ${user.name}`);

  // Funcionalidades para Cliente
  const clientFeatures = [
    {
      icon: "🛍️",
      title: "Meus Produtos",
      description: "Veja todos os produtos disponíveis para compra",
      href: "/products",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "🛒",
      title: "Meu Carrinho",
      description: "Gerenciar itens do seu carrinho de compras",
      href: "/carts",
      color: "from-green-500 to-green-600",
    },
    {
      icon: "📋",
      title: "Minhas Compras",
      description: "Acompanhe o histórico de suas compras",
      href: "/sales",
      color: "from-purple-500 to-purple-600",
    },
  ];

  // Funcionalidades para Administrador
  const adminFeatures = [
    {
      icon: "📦",
      title: "Gerenciar Produtos",
      description: "Criar, atualizar e deletar produtos do catálogo",
      href: "/products",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "👥",
      title: "Gerenciar Usuários",
      description: "Administrar usuários do sistema",
      href: "/users",
      color: "from-red-500 to-red-600",
    },
    {
      icon: "💰",
      title: "Histórico de Vendas",
      description: "Acompanhar todas as vendas realizadas",
      href: "/sales",
      color: "from-green-500 to-green-600",
    },
  ];

  const features = user.is_admin ? adminFeatures : clientFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <span className="text-lg">🍞</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Padaria FastAPI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.username}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  user.is_admin
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {user.is_admin ? "Administrador" : "Cliente"}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo, {user.username}! 👋
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {user.is_admin
              ? "Você está logado como administrador. Aqui você pode gerenciar todos os aspectos do sistema."
              : "Você está logado como cliente. Aqui você pode visualizar produtos e gerenciar suas compras."}
          </p>
        </div>

        {/* Role-Based Info Section */}
        <div className="mb-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ℹ️ Informações da sua Conta
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-6 border border-blue-200 dark:border-slate-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Email
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.username}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-6 border border-green-200 dark:border-slate-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Tipo de Usuário
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.is_admin ? "👑 Administrador" : "👤 Cliente"}
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {user.is_admin
              ? "⚙️ Funções Administrativas"
              : "🎯 Funcionalidades"}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-slate-700 overflow-hidden cursor-pointer group">
                  {/* Icon Background */}
                  <div
                    className={`bg-gradient-to-br ${feature.color} h-24 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 group-hover:bg-clip-text transition-all">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex items-center text-amber-500 font-semibold group-hover:translate-x-2 transition-transform">
                      Acessar
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Restrictions Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-4">
            🎯 Dicas para Aproveitar
          </h4>
          {user.is_admin ? (
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <span>
                  <strong>Gerenciar Produtos:</strong> Acesse a seção de
                  produtos para criar, editar ou deletar itens do catálogo.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>
                  <strong>Gerenciar Usuários:</strong> Visualize e administre
                  todos os usuários do sistema.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <span>
                  <strong>Acompanhar Vendas:</strong> Monitore todas as
                  transações e vendas realizadas.
                </span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                <span>
                  <strong>Explorar Produtos:</strong> Veja todo o catálogo de
                  produtos disponíveis para compra.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🛒</span>
                <span>
                  <strong>Carrinho Inteligente:</strong> Adicione produtos ao
                  carrinho e customize as quantidades conforme necessário.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span>
                  <strong>Histórico de Compras:</strong> Acompanhe todas as suas
                  compras anteriores e pedidos.
                </span>
              </li>
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Padaria FastAPI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
