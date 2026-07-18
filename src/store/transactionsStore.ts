import { create } from "zustand";
import type { Expense } from "../types/expense";
import * as db from "../features/transactions/services/database";

interface TransactionsState {
  transactions: Expense[];
  loading: boolean;
  error: string | null;
  editingTransaction: Expense | null;
  loadTransactions: () => Promise<void>;
  addTransaction: (t: Expense) => Promise<void>;
  addTransactions: (transactions: Expense[]) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  removeTransactionsByGroup: (groupId: string) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Omit<Expense, "id">>) => Promise<void>;
  updateTransactionsByGroup: (groupId: string, data: Partial<Omit<Expense, "id">>) => Promise<void>;
  setEditingTransaction: (t: Expense | null) => void;
  getTransactionsByGroup: (groupId: string) => Promise<Expense[]>;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  loading: false,
  error: null,
  editingTransaction: null,

  loadTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const transactions = await db.getAllTransactions();
      set({ transactions, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  setEditingTransaction: (t) => set({ editingTransaction: t }),

  addTransaction: async (t) => {
    await db.insertTransaction(t);
    set((s) => ({ transactions: [t, ...s.transactions] }));
  },

  addTransactions: async (transactions) => {
    for (const t of transactions) {
      await db.insertTransaction(t);
    }
    set((s) => ({ transactions: [...transactions, ...s.transactions] }));
  },

  removeTransaction: async (id) => {
    try {
      await db.deleteTransaction(id);
      set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  removeTransactionsByGroup: async (groupId) => {
    try {
      await db.deleteTransactionsByGroup(groupId);
      set((s) => ({ transactions: s.transactions.filter((t) => t.installment_group !== groupId) }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  updateTransaction: async (id, data) => {
    try {
      await db.updateTransaction(id, data);
      set((s) => ({
        transactions: s.transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t,
        ),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  updateTransactionsByGroup: async (groupId, data) => {
    try {
      const transactions = await db.getTransactionsByGroup(groupId);
      for (const t of transactions) {
        await db.updateTransaction(t.id, data);
      }
      set((s) => ({
        transactions: s.transactions.map((t) =>
          t.installment_group === groupId ? { ...t, ...data } : t,
        ),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  getTransactionsByGroup: async (groupId) => {
    return await db.getTransactionsByGroup(groupId);
  },
}));
