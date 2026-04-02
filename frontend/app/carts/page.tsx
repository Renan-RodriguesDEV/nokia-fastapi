"use client";

import { cartApi } from "@/lib/api/cart";
import { salesApi } from "@/lib/api/sales";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Backbutton } from "@/app/components/Backbutton";

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  count: number;
  was_purchased: boolean;
  created_at: string;
  product?: {
    id: number;
    name: string;
    price: number;
  };
}

export default function CartsPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  const loadCart = useCallback(async () => {
    if (!token || !user) return;

    try {
      setLoadingData(true);
      setError(null);

      const filters: { user_id?: number; product_id?: number } = {};
      if (!user?.is_admin && user?.id) {
        filters.user_id = user.id;
      }

      const data = await cartApi.getCart(filters, token);

      // Validação adicional: garantir que clientes só veem seus próprios itens
      let filteredData = Array.isArray(data) ? data : [];
      if (!user?.is_admin && user?.id) {
        filteredData = filteredData.filter((item) => item.user_id === user.id);
      }

      setCartItems(filteredData);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      setError("Erro ao carregar carrinho.");
      setCartItems([]);
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
      loadCart();
    }
  }, [isAuthenticated, isLoading, user, token, router, loadCart]);

  const handleBuyCart = async (cartItem: CartItem) => {
    if (!token || !user || !cartItem.product) return;

    setPurchasingId(cartItem.id);

    try {
      // Criar venda
      const saleData = {
        user_id: user.id,
        product_id: cartItem.product_id,
        count: cartItem.count,
        was_paid: false,
      };

      await salesApi.createSale(saleData, token);

      // Deletar carrinho
      await cartApi.removeFromCart(cartItem.id, token);

      // Recarregar carrinho
      await loadCart();

      setError(null);
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      setError("Erro ao finalizar compra.");
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRemoveCart = async (cartId: number) => {
    if (!token) return;

    try {
      await cartApi.removeFromCart(cartId, token);
      await loadCart();
    } catch (err) {
      console.error("Erro ao remover do carrinho:", err);
      setError("Erro ao remover item do carrinho.");
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const totalItems = cartItems.length;
  const totalValue = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.count,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="z-40 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.is_admin ? "🛒 Carrinho de Clientes" : "🛒 Meu Carrinho"}
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

        {cartItems.length === 0 ? (
          <div className="p-8 text-center text-gray-700">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {user?.is_admin
                ? "Nenhum carrinho registrado"
                : "Seu carrinho está vazio"}
            </h2>
            <p className="text-gray-700">
              {user?.is_admin
                ? "Nenhum cliente tem itens no carrinho."
                : "Adicione produtos do catálogo para começar suas compras!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Tabela */}
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
                        Preço Unit.
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          #{item.id}
                        </td>
                        {user?.is_admin && (
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                            Usuário #{item.user_id}
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.product?.name || `Produto #${item.product_id}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {item.count}x
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          R$ {(item.product?.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                          R${" "}
                          {((item.product?.price || 0) * item.count).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleBuyCart(item)}
                            disabled={purchasingId === item.id || !item.product}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-xs font-semibold rounded transition"
                          >
                            {purchasingId === item.id ? "⏳" : "✓ Comprar"}
                          </button>
                          <button
                            onClick={() => handleRemoveCart(item.id)}
                            disabled={purchasingId === item.id}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xs font-semibold rounded transition"
                          >
                            🗑️ Remover
                          </button>
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
                  Total de Itens
                </p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Valor Total
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  R$ {totalValue.toFixed(2)}
                </p>
              </div>
              {!user?.is_admin && (
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-700 rounded-xl shadow-lg p-6 border border-blue-300 dark:border-blue-800">
                  <p className="text-sm text-white/90 mb-3">
                    Quer finalizar suas compras?
                  </p>
                  <button
                    onClick={() => {
                      cartItems.forEach((item) => handleBuyCart(item));
                    }}
                    disabled={purchasingId !== null || cartItems.length === 0}
                    className="w-full px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 font-bold rounded-lg transition"
                  >
                    💳 Finalizar Todas as Compras
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
