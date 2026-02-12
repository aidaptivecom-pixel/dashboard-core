"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const BLUE_RATE = 1440;

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: "ARS" | "USD";
  due_day: number | null;
  category: string;
  recurrent: boolean;
  active: boolean;
  notes: string | null;
}

export interface Debt {
  id: string;
  description: string;
  total_amount: number;
  amount_paid: number;
  currency: "ARS" | "USD";
  due_date: string;
  status: string;
  priority: string;
  creditor: string | null;
  notes: string | null;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  currency: "ARS" | "USD";
  expected_date: string;
  probability: string;
  status: string;
  category: string;
  notes: string | null;
}

interface TimelineItem {
  id: string;
  date: number | null; // day of month
  fullDate?: string;
  description: string;
  amount: number;
  currency: "ARS" | "USD";
  amountARS: number;
  type: "expense" | "debt" | "income";
  category?: string;
  status?: string;
}

function toARS(amount: number, currency: string): number {
  return currency === "USD" ? amount * BLUE_RATE : amount;
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr + "T00:00:00");
  return d.getFullYear() === year && d.getMonth() === month;
}

export function useFinances() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const [expRes, debtRes, incRes] = await Promise.all([
      supabase.from("financial_expenses").select("*").eq("active", true),
      supabase.from("financial_debts").select("*"),
      supabase.from("financial_income").select("*"),
    ]);
    if (expRes.data) setExpenses(expRes.data);
    if (debtRes.data) setDebts(debtRes.data);
    if (incRes.data) setIncome(incRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthDebts = useMemo(
    () => debts.filter((d) => d.due_date && isInMonth(d.due_date, selectedMonth.year, selectedMonth.month)),
    [debts, selectedMonth]
  );

  const monthIncome = useMemo(
    () => income.filter((i) => i.expected_date && isInMonth(i.expected_date, selectedMonth.year, selectedMonth.month)),
    [income, selectedMonth]
  );

  const totalExpensesARS = useMemo(
    () => expenses.reduce((sum, e) => sum + toARS(e.amount, e.currency), 0),
    [expenses]
  );

  const totalDebtsARS = useMemo(
    () => monthDebts.reduce((sum, d) => sum + toARS(d.total_amount - d.amount_paid, d.currency), 0),
    [monthDebts]
  );

  const totalIncomeARS = useMemo(
    () => monthIncome.reduce((sum, i) => sum + toARS(i.amount, i.currency), 0),
    [monthIncome]
  );

  const gap = totalIncomeARS - totalExpensesARS - totalDebtsARS;
  const marginPercent = totalIncomeARS > 0 ? (gap / totalIncomeARS) * 100 : -100;

  const semaphore: "green" | "yellow" | "red" =
    gap < 0 ? "red" : marginPercent < 20 ? "yellow" : "green";

  const timeline = useMemo((): TimelineItem[] => {
    const items: TimelineItem[] = [];

    expenses.forEach((e) => {
      items.push({
        id: e.id,
        date: e.due_day,
        description: e.name,
        amount: e.amount,
        currency: e.currency,
        amountARS: toARS(e.amount, e.currency),
        type: "expense",
        category: e.category,
      });
    });

    monthDebts.forEach((d) => {
      const day = d.due_date ? new Date(d.due_date + "T00:00:00").getDate() : null;
      items.push({
        id: d.id,
        date: day,
        fullDate: d.due_date,
        description: d.description,
        amount: d.total_amount - d.amount_paid,
        currency: d.currency,
        amountARS: toARS(d.total_amount - d.amount_paid, d.currency),
        type: "debt",
        status: d.status,
      });
    });

    monthIncome.forEach((i) => {
      const day = i.expected_date ? new Date(i.expected_date + "T00:00:00").getDate() : null;
      items.push({
        id: i.id,
        date: day,
        fullDate: i.expected_date,
        description: i.source,
        amount: i.amount,
        currency: i.currency,
        amountARS: toARS(i.amount, i.currency),
        type: "income",
        status: i.status,
      });
    });

    items.sort((a, b) => (a.date ?? 31) - (b.date ?? 31));
    return items;
  }, [expenses, monthDebts, monthIncome]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "otros";
      map[cat] = (map[cat] || 0) + toARS(e.amount, e.currency);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  return {
    expenses,
    debts,
    income,
    monthDebts,
    monthIncome,
    loading,
    selectedMonth,
    setSelectedMonth,
    totalExpensesARS,
    totalDebtsARS,
    totalIncomeARS,
    gap,
    marginPercent,
    semaphore,
    timeline,
    categoryBreakdown,
    blueRate: BLUE_RATE,
  };
}
