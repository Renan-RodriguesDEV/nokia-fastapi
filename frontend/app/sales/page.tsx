"use client";

import { salesApi } from "@/lib/api/sales";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Backbutton } from "@/app/components/Backbutton";

interface Sale {
  id: number;
  user_id: number;
  product_id: number;
  count: number;
  value: number;
  user: {
    name: string;
    username: string;
    password: string;
    telephone?: string;
  };
  product: {
    name: string;
    price: number;
    category: string;
    validity: string;
  };
  was_paid: boolean;
  created_at: string;
}

export default function SalesPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingData(true);
      setError(null);

      let data;
      if (user?.is_admin) {
        // Admin vê todas as vendas
        data = await salesApi.getAllSales(token);
      } else {
        // Cliente vê apenas suas vendas
        data = await salesApi.getSalesFiltered({ user_id: user?.id }, token);
      }

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
      setError("Erro ao carregar histórico de vendas.");
      setSales([]);
    } finally {
      setLoadingData(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && token) {
      loadSales();
    }
  }, [isAuthenticated, isLoading, user, token, router, loadSales]);

  if (isLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.is_admin ? "💰 Histórico de Vendas" : "📋 Minhas Compras"}
          </h1>
          <Backbutton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
            ⚠️ {error}
          </div>
        )}

        {sales.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-slate-700 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {user?.is_admin
                ? "Nenhuma venda registrada"
                : "Você ainda não fez nenhuma compra"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.is_admin
                ? "As vendas aparecerão aqui quando houver transações no sistema."
                : "Comece a explorar nossos produtos e faça sua primeira compra!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        #ID
                      </th>
                      {user?.is_admin && (
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Usuário
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Produto
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Qtde
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Valor Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {sales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          #{sale.id}
                        </td>
                        {user?.is_admin && (
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                            Usuário - {sale.user.name}
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          Produto - {sale.product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {sale.count}x
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                          R$ {sale.value.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              sale.was_paid
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            }`}
                          >
                            {sale.was_paid ? "✓ Pago" : "⏳ Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(sale.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Total de Transações
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sales.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Valor Total
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  R$ {sales.reduce((sum, s) => sum + s.value, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pagos
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {sales.filter((s) => s.was_paid).length}/{sales.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
