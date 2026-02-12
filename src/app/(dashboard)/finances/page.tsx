"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  CircleDollarSign,
} from "lucide-react";
import { useFinances } from "@/hooks/useFinances";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatMoney(amount: number, currency?: string): string {
  if (currency === "USD") {
    return `US$ ${amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
  }
  return `$ ${amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

function formatARS(amount: number): string {
  return `$ ${amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

const TYPE_COLORS = {
  expense: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  debt: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  income: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

const TYPE_LABELS = { expense: "Gasto", debt: "Deuda", income: "Ingreso" };

const CATEGORY_COLORS: Record<string, string> = {
  alquiler: "#3B82F6",
  salario: "#8B5CF6",
  servicios: "#06B6D4",
  impuestos: "#F59E0B",
  hosting: "#10B981",
  tarjetas: "#EC4899",
  comida: "#F97316",
  transporte: "#6366F1",
  otros: "#94A3B8",
};

export default function FinancesPage() {
  const {
    loading,
    selectedMonth,
    setSelectedMonth,
    totalExpensesARS,
    totalDebtsARS,
    totalIncomeARS,
    gap,
    semaphore,
    timeline,
    categoryBreakdown,
    monthDebts,
    blueRate,
  } = useFinances();

  const prevMonth = () => {
    setSelectedMonth((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  };

  const nextMonth = () => {
    setSelectedMonth((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
  };

  const semaphoreIcon =
    semaphore === "green" ? "🟢" : semaphore === "yellow" ? "🟡" : "🔴";

  const maxCategoryValue = categoryBreakdown.length > 0 ? categoryBreakdown[0].value : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Wallet className="h-7 w-7 text-primary" />
            Finanzas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dólar blue: {formatARS(blueRate)}
          </p>
        </div>

        {/* Month Toggle */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-2 py-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            Gastos mensuales
          </div>
          <p className="text-xl font-bold text-rose-400">{formatARS(totalExpensesARS)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Deudas del mes
          </div>
          <p className="text-xl font-bold text-amber-400">{formatARS(totalDebtsARS)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Ingresos esperados
          </div>
          <p className="text-xl font-bold text-emerald-400">{formatARS(totalIncomeARS)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="text-base">{semaphoreIcon}</span>
            Balance
          </div>
          <p className={`text-xl font-bold ${gap >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatARS(gap)}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                Timeline de pagos
              </h2>
            </div>
            <div className="divide-y divide-border">
              {timeline.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Sin movimientos este mes
                </div>
              ) : (
                timeline.map((item) => {
                  const colors = TYPE_COLORS[item.type];
                  const isPaid = item.status === "paid";
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`flex items-center gap-4 p-3 px-4 ${isPaid ? "opacity-50" : ""}`}
                    >
                      <div className="w-8 text-center">
                        <span className="text-sm font-mono text-muted-foreground">
                          {item.date ?? "—"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isPaid ? "line-through" : ""}`}>
                          {item.description}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {TYPE_LABELS[item.type]}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-semibold ${colors.text}`}>
                          {item.type === "income" ? "+" : "-"}{formatMoney(item.amount, item.currency)}
                        </p>
                        {item.currency === "USD" && (
                          <p className="text-xs text-muted-foreground">≈ {formatARS(item.amountARS)}</p>
                        )}
                      </div>
                      {isPaid && <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Debts */}
          {monthDebts.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Deudas
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {monthDebts.map((d) => {
                  const progress = d.total_amount > 0 ? (d.amount_paid / d.total_amount) * 100 : 0;
                  return (
                    <div key={d.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{d.description}</p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatMoney(d.amount_paid, d.currency)} / {formatMoney(d.total_amount, d.currency)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {d.due_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Vence: {new Date(d.due_date + "T00:00:00").toLocaleDateString("es-AR")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          <div className="rounded-xl border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-sm">Gastos por categoría</h2>
            </div>
            <div className="p-4 space-y-3">
              {categoryBreakdown.map((cat) => {
                const pct = (cat.value / maxCategoryValue) * 100;
                const color = CATEGORY_COLORS[cat.name] || CATEGORY_COLORS.otros;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{formatARS(cat.value)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
