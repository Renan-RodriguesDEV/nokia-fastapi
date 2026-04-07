"use client";

import { useAuth } from "@/hooks/useAuth";
import { salesApi } from "@/lib/api/sales";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PeriodMode = "month" | "day";

interface Sale {
  id: number;
  count: number;
  value: number;
  was_paid: boolean;
  created_at: string;
}

const monthOptions = [
  { label: "3 meses", value: 3 },
  { label: "6 meses", value: 6 },
  { label: "12 meses", value: 12 },
];

const dayOptions = [
  { label: "7 dias", value: 7 },
  { label: "15 dias", value: 15 },
  { label: "30 dias", value: 30 },
];

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);

export default function AdminDashboardPage() {
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<PeriodMode>("month");
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router, user]);

  useEffect(() => {
    const loadSales = async () => {
      if (!token || !user?.is_admin) return;

      setIsLoading(true);
      setError("");
      try {
        const result = await salesApi.getAllSales(token);
        setSales(Array.isArray(result) ? result : []);
      } catch {
        setError("Não foi possível carregar as vendas.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, [token, user]);

  const rangeStart = useMemo(() => {
    const base = new Date();
    if (mode === "month") {
      const start = new Date(
        base.getFullYear(),
        base.getMonth() - selectedMonths + 1,
        1,
      );
      start.setHours(0, 0, 0, 0);
      return start;
    }
    const start = new Date(base);
    start.setDate(base.getDate() - selectedDays + 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [mode, selectedDays, selectedMonths]);

  const filteredSales = useMemo(
    () => sales.filter((sale) => new Date(sale.created_at) >= rangeStart),
    [rangeStart, sales],
  );

  const summary = useMemo(() => {
    const totalSales = filteredSales.length;
    const itemsSold = filteredSales.reduce(
      (acc, sale) => acc + Number(sale.count || 0),
      0,
    );
    const grossRevenue = filteredSales.reduce(
      (acc, sale) => acc + Number(sale.value || 0),
      0,
    );
    const paidRevenue = filteredSales
      .filter((sale) => sale.was_paid)
      .reduce((acc, sale) => acc + Number(sale.value || 0), 0);

    return {
      totalSales,
      itemsSold,
      grossRevenue,
      paidRevenue,
      averageTicket: totalSales ? grossRevenue / totalSales : 0,
    };
  }, [filteredSales]);

  const chartData = useMemo(() => {
    const buckets: {
      key: string;
      label: string;
      revenue: number;
      orders: number;
    }[] = [];
    const now = new Date();

    if (mode === "month") {
      for (let i = selectedMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        buckets.push({
          key,
          label: date.toLocaleDateString("pt-BR", {
            month: "short",
            year: "2-digit",
          }),
          revenue: 0,
          orders: 0,
        });
      }

      filteredSales.forEach((sale) => {
        const date = new Date(sale.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const bucket = buckets.find((item) => item.key === key);
        if (bucket) {
          bucket.revenue += Number(sale.value || 0);
          bucket.orders += 1;
        }
      });
    } else {
      for (let i = selectedDays - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        buckets.push({
          key,
          label: date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          revenue: 0,
          orders: 0,
        });
      }

      filteredSales.forEach((sale) => {
        const date = new Date(sale.created_at);
        const key = date.toISOString().slice(0, 10);
        const bucket = buckets.find((item) => item.key === key);
        if (bucket) {
          bucket.revenue += Number(sale.value || 0);
          bucket.orders += 1;
        }
      });
    }

    return buckets;
  }, [filteredSales, mode, selectedDays, selectedMonths]);

  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);
  const maxOrders = Math.max(...chartData.map((item) => item.orders), 1);
  const orderAxisSteps = 4;

  const orderPoints = chartData
    .map((item, index) => {
      const x =
        chartData.length === 1 ? 0 : (index / (chartData.length - 1)) * 100;
      const y = 100 - (item.orders / maxOrders) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-b-2 border-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Dashboard de Vendas
          </h1>
          <p className="text-sm text-blue-700 mt-1">
            Resumo de performance para acompanhamento de vendas e arrecadação.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 uppercase">
                Meses
              </span>
              {monthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setMode("month");
                    setSelectedMonths(option.value);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                    mode === "month" && selectedMonths === option.value
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-blue-700 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 uppercase">
                Dias
              </span>
              {dayOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setMode("day");
                    setSelectedDays(option.value);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                    mode === "day" && selectedDays === option.value
                      ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                      : "bg-white text-amber-700 border-amber-300 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-100 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-blue-700 font-semibold">
              Total de vendas
            </p>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {summary.totalSales}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-green-700 font-semibold">
              Itens vendidos
            </p>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {summary.itemsSold}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-amber-700 font-semibold">Arrecadação</p>
            <p className="text-2xl font-bold text-amber-900 mt-2">
              {currency(summary.grossRevenue)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-purple-700 font-semibold">
              Receita paga
            </p>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {currency(summary.paidRevenue)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-pink-50 border border-pink-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-pink-700 font-semibold">Ticket médio</p>
            <p className="text-2xl font-bold text-pink-900 mt-2">
              {currency(summary.averageTicket)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <article className="bg-white border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-blue-900 mb-4">
              Arrecadação por período
            </h2>
            <div className="h-64 flex items-end gap-2">
              {chartData.map((item) => (
                <div
                  key={item.key}
                  className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition rounded-t-md shadow-sm"
                    style={{
                      minHeight: "3px",
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                    }}
                    title={`${item.label}: ${currency(item.revenue)}`}
                  />
                  <span className="text-[10px] text-blue-700 font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-blue-900 mb-4">
              Quantidade de vendas
            </h2>
            <div className="h-64 w-full rounded-xl bg-blue-50 p-3 flex gap-3">
              <div className="h-full flex flex-col justify-between text-[10px] text-blue-700 font-medium pt-1">
                {Array.from({ length: orderAxisSteps + 1 }).map((_, index) => {
                  const value = Math.round(
                    maxOrders - (maxOrders / orderAxisSteps) * index,
                  );
                  return <span key={index}>{value}</span>;
                })}
              </div>

              <svg viewBox="0 0 100 100" className="w-full h-full">
                {Array.from({ length: orderAxisSteps + 1 }).map((_, index) => {
                  const y = (index / orderAxisSteps) * 100;
                  return (
                    <line
                      key={index}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      stroke="rgb(191 219 254)"
                      strokeOpacity="0.6"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                <polyline
                  fill="none"
                  stroke="rgb(59 130 246)"
                  strokeWidth="2.5"
                  points={orderPoints}
                />
                {chartData.map((item, index) => {
                  const x =
                    chartData.length === 1
                      ? 0
                      : (index / (chartData.length - 1)) * 100;
                  const y = 100 - (item.orders / maxOrders) * 100;
                  return (
                    <circle
                      key={item.key}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="rgb(59 130 246)"
                      stroke="white"
                      strokeWidth="1"
                    >
                      <title>{`${item.label}: ${item.orders} vendas`}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
