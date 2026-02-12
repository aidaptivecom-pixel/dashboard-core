"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_BLUE_RATE = 1440;
const LS_KEY_BLUE = "finanzas_blue_rate";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
}

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
  payment_method: string | null;
  due_date: string | null;
  receipt_url: string | null;
  paid: boolean;
  paid_date: string | null;
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
  payment_method: string | null;
  receipt_url: string | null;
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
  payment_method: string | null;
  receipt_url: string | null;
  paid: boolean;
  paid_date: string | null;
}

export type ItemType = "expense" | "debt" | "income";
export type StatusFilter = "all" | "paid" | "overdue" | "upcoming" | "ontime";
export type SortField = "due_date" | "amount" | "paid_date";

export interface UnifiedItem {
  id: string;
  date: number | null;
  fullDate?: string | null;
  dueDate?: string | null;
  description: string;
  amount: number;
  currency: "ARS" | "USD";
  amountARS: number;
  amountConverted: number;
  convertedCurrency: "ARS" | "USD";
  type: ItemType;
  category?: string;
  status?: string;
  paymentMethod?: string | null;
  receiptUrl?: string | null;
  paid: boolean;
  paidDate?: string | null;
  recurrent?: boolean;
  rawItem: Expense | Debt | Income;
}

function toARS(amount: number, currency: string, rate: number): number {
  return currency === "USD" ? amount * rate : amount;
}

function toUSD(amount: number, currency: string, rate: number): number {
  return currency === "ARS" ? amount / rate : amount;
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr + "T00:00:00");
  return d.getFullYear() === year && d.getMonth() === month;
}

export function getItemStatus(item: UnifiedItem): "paid" | "overdue" | "upcoming" | "ontime" {
  if (item.paid) return "paid";
  const due = item.dueDate;
  if (!due) return "ontime";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dueD = new Date(due + "T00:00:00");
  if (dueD < now) return "overdue";
  const week = new Date(now);
  week.setDate(week.getDate() + 7);
  if (dueD <= week) return "upcoming";
  return "ontime";
}

export function useFinances() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [blueRate, setBlueRate] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LS_KEY_BLUE);
      return saved ? Number(saved) : DEFAULT_BLUE_RATE;
    }
    return DEFAULT_BLUE_RATE;
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("due_date");

  const updateBlueRate = useCallback((rate: number) => {
    setBlueRate(rate);
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY_BLUE, String(rate));
    }
  }, []);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const [expRes, debtRes, incRes, catRes] = await Promise.all([
      supabase.from("financial_expenses").select("*").eq("active", true),
      supabase.from("financial_debts").select("*"),
      supabase.from("financial_income").select("*"),
      supabase.from("financial_categories").select("*"),
    ]);
    if (expRes.data) setExpenses(expRes.data);
    if (debtRes.data) setDebts(debtRes.data);
    if (incRes.data) setIncome(incRes.data);
    if (catRes.data) setCategories(catRes.data);
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
    () => expenses.reduce((sum, e) => sum + toARS(e.amount, e.currency, blueRate), 0),
    [expenses, blueRate]
  );

  const totalDebtsARS = useMemo(
    () => monthDebts.reduce((sum, d) => sum + toARS(d.total_amount - d.amount_paid, d.currency, blueRate), 0),
    [monthDebts, blueRate]
  );

  const totalIncomeARS = useMemo(
    () => monthIncome.reduce((sum, i) => sum + toARS(i.amount, i.currency, blueRate), 0),
    [monthIncome, blueRate]
  );

  const gap = totalIncomeARS - totalExpensesARS - totalDebtsARS;
  const marginPercent = totalIncomeARS > 0 ? (gap / totalIncomeARS) * 100 : -100;

  const semaphore: "green" | "yellow" | "red" =
    gap < 0 ? "red" : marginPercent < 20 ? "yellow" : "green";

  const unifiedItems = useMemo((): UnifiedItem[] => {
    const items: UnifiedItem[] = [];

    expenses.forEach((e) => {
      const arsAmt = toARS(e.amount, e.currency, blueRate);
      items.push({
        id: e.id,
        date: e.due_day,
        fullDate: e.paid_date,
        dueDate: e.due_date,
        description: e.name,
        amount: e.amount,
        currency: e.currency,
        amountARS: arsAmt,
        amountConverted: e.currency === "USD" ? arsAmt : toUSD(e.amount, e.currency, blueRate),
        convertedCurrency: e.currency === "USD" ? "ARS" : "USD",
        type: "expense",
        category: e.category,
        paymentMethod: e.payment_method,
        receiptUrl: e.receipt_url,
        paid: e.paid ?? false,
        paidDate: e.paid_date,
        recurrent: e.recurrent,
        rawItem: e,
      });
    });

    monthDebts.forEach((d) => {
      const remaining = d.total_amount - d.amount_paid;
      const arsAmt = toARS(remaining, d.currency, blueRate);
      const day = d.due_date ? new Date(d.due_date + "T00:00:00").getDate() : null;
      items.push({
        id: d.id,
        date: day,
        fullDate: d.due_date,
        dueDate: d.due_date,
        description: d.description,
        amount: remaining,
        currency: d.currency,
        amountARS: arsAmt,
        amountConverted: d.currency === "USD" ? arsAmt : toUSD(remaining, d.currency, blueRate),
        convertedCurrency: d.currency === "USD" ? "ARS" : "USD",
        type: "debt",
        status: d.status,
        paymentMethod: d.payment_method,
        receiptUrl: d.receipt_url,
        paid: d.status === "paid",
        rawItem: d,
      });
    });

    monthIncome.forEach((i) => {
      const arsAmt = toARS(i.amount, i.currency, blueRate);
      const day = i.expected_date ? new Date(i.expected_date + "T00:00:00").getDate() : null;
      items.push({
        id: i.id,
        date: day,
        fullDate: i.expected_date,
        dueDate: i.expected_date,
        description: i.source,
        amount: i.amount,
        currency: i.currency,
        amountARS: arsAmt,
        amountConverted: i.currency === "USD" ? arsAmt : toUSD(i.amount, i.currency, blueRate),
        convertedCurrency: i.currency === "USD" ? "ARS" : "USD",
        type: "income",
        category: i.category,
        status: i.status,
        paymentMethod: i.payment_method,
        receiptUrl: i.receipt_url,
        paid: i.paid ?? false,
        paidDate: i.paid_date,
        rawItem: i,
      });
    });

    return items;
  }, [expenses, monthDebts, monthIncome, blueRate]);

  const filteredItems = useMemo(() => {
    let items = [...unifiedItems];

    if (statusFilter !== "all") {
      items = items.filter((i) => getItemStatus(i) === statusFilter);
    }
    if (typeFilter !== "all") {
      items = items.filter((i) => i.type === typeFilter);
    }
    if (categoryFilter !== "all") {
      items = items.filter((i) => i.category === categoryFilter);
    }
    if (paymentFilter !== "all") {
      items = items.filter((i) => i.paymentMethod === paymentFilter);
    }

    items.sort((a, b) => {
      if (sortField === "due_date") {
        const statusOrder = { overdue: 0, upcoming: 1, ontime: 2, paid: 3 };
        const sa = statusOrder[getItemStatus(a)];
        const sb = statusOrder[getItemStatus(b)];
        if (sa !== sb) return sa - sb;
        const da = a.dueDate || "9999";
        const db = b.dueDate || "9999";
        return da.localeCompare(db);
      }
      if (sortField === "amount") return b.amountARS - a.amountARS;
      if (sortField === "paid_date") {
        const da = a.paidDate || "9999";
        const db = b.paidDate || "9999";
        return da.localeCompare(db);
      }
      return 0;
    });

    return items;
  }, [unifiedItems, statusFilter, typeFilter, categoryFilter, paymentFilter, sortField]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "otros";
      map[cat] = (map[cat] || 0) + toARS(e.amount, e.currency, blueRate);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, blueRate]);

  // CRUD operations
  const togglePaid = useCallback(async (item: UnifiedItem) => {
    const supabase = createClient();
    const newPaid = !item.paid;
    const paidDate = newPaid ? new Date().toISOString().split("T")[0] : null;

    if (item.type === "expense") {
      await supabase.from("financial_expenses").update({ paid: newPaid, paid_date: paidDate }).eq("id", item.id);
    } else if (item.type === "income") {
      await supabase.from("financial_income").update({ paid: newPaid, paid_date: paidDate }).eq("id", item.id);
    } else if (item.type === "debt") {
      await supabase.from("financial_debts").update({ status: newPaid ? "paid" : "pending" }).eq("id", item.id);
    }
    await fetchData();
  }, [fetchData]);

  const insertItem = useCallback(async (type: ItemType, data: Record<string, unknown>) => {
    const supabase = createClient();
    if (type === "expense") {
      await supabase.from("financial_expenses").insert(data);
    } else if (type === "income") {
      await supabase.from("financial_income").insert(data);
    } else {
      await supabase.from("financial_debts").insert(data);
    }
    await fetchData();
  }, [fetchData]);

  const updateItem = useCallback(async (type: ItemType, id: string, data: Record<string, unknown>) => {
    const supabase = createClient();
    if (type === "expense") {
      await supabase.from("financial_expenses").update(data).eq("id", id);
    } else if (type === "income") {
      await supabase.from("financial_income").update(data).eq("id", id);
    } else {
      await supabase.from("financial_debts").update(data).eq("id", id);
    }
    await fetchData();
  }, [fetchData]);

  // Category CRUD
  const addCategory = useCallback(async (name: string, color: string) => {
    const supabase = createClient();
    await supabase.from("financial_categories").insert({
      user_id: "d1b09b1a-919e-43fa-b70b-19b0be37cabe",
      name,
      color,
    });
    await fetchData();
  }, [fetchData]);

  const updateCategory = useCallback(async (id: string, name: string, color: string) => {
    const supabase = createClient();
    await supabase.from("financial_categories").update({ name, color }).eq("id", id);
    await fetchData();
  }, [fetchData]);

  const deleteCategory = useCallback(async (id: string) => {
    const supabase = createClient();
    await supabase.from("financial_categories").delete().eq("id", id);
    await fetchData();
  }, [fetchData]);

  // File upload
  const uploadReceipt = useCallback(async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("receipts").upload(fileName, file);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return data.publicUrl;
  }, []);

  return {
    expenses,
    debts,
    income,
    categories,
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
    unifiedItems,
    filteredItems,
    categoryBreakdown,
    blueRate,
    updateBlueRate,
    // Filters
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    paymentFilter,
    setPaymentFilter,
    sortField,
    setSortField,
    // CRUD
    togglePaid,
    insertItem,
    updateItem,
    addCategory,
    updateCategory,
    deleteCategory,
    uploadReceipt,
    refetch: fetchData,
  };
}
