import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { TransactionType } from "../categories";
import type { Expense } from "../../../types/expense";
import { useTransactionsStore } from "../../../store/transactionsStore";
import { useToast } from "../../../shared/context/ToastContext";

interface FormState {
  type: TransactionType;
  amount: string;
  category: string;
  name: string;
  date: Date;
  note: string;
}

interface FormErrors {
  amount?: string;
  category?: string;
  name?: string;
}

const CATEGORY_DEFAULTS: Record<TransactionType, string> = {
  expense: "Food",
  income: "Salary",
};

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getInitialFields(): FormState {
  return {
    type: "expense",
    amount: "",
    category: CATEGORY_DEFAULTS.expense,
    name: "",
    date: new Date(),
    note: "",
  };
}

export function useTransactionForm() {
  const editingTransaction = useTransactionsStore((s) => s.editingTransaction);
  const setEditingTransaction = useTransactionsStore((s) => s.setEditingTransaction);
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);

  const [fields, setFields] = useState<FormState>(getInitialFields);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingTransaction) {
      setFields({
        type: editingTransaction.type,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        name: editingTransaction.name ?? "",
        date: editingTransaction.date.length === 10
          ? new Date(editingTransaction.date + "T00:00:00")
          : new Date(editingTransaction.date),
        note: editingTransaction.description ?? "",
      });
      setErrors({});
    }
  }, [editingTransaction]);

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setFields((prev) => ({
        ...prev,
        [key]: value,
        ...(key === "type" ? { category: CATEGORY_DEFAULTS[value as TransactionType] } : {}),
      }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const amountNum = parseFloat(fields.amount);
    if (!fields.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (!fields.category) {
      newErrors.category = "Select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields.amount, fields.category]);

  const { showToast } = useToast();

  const isEditing = editingTransaction !== null;

  const submit = useCallback(async (): Promise<boolean> => {
    if (!validate()) return false;

    const typeLabel = fields.type === "income" ? "Income" : "Expense";
    const amount = parseFloat(fields.amount);
    const name = fields.name.trim();

    try {
      if (isEditing) {
        const { id } = editingTransaction;
        await updateTransaction(id, {
          type: fields.type,
          amount,
          category: fields.category,
          name,
          description: fields.note || undefined,
          date: formatLocalDate(fields.date),
        });
        setEditingTransaction(null);
        showToast({
          type: "success",
          title: `${typeLabel} updated`,
          message: `${fields.type === "income" ? "+" : "-"}$${amount.toFixed(2)} · ${name || fields.category}`,
        });
        return true;
      }

      const transaction: Expense = {
        id: Date.now().toString(),
        type: fields.type,
        amount,
        category: fields.category,
        name,
        description: fields.note || undefined,
        date: formatLocalDate(fields.date),
      };

      await addTransaction(transaction);
      setFields(getInitialFields());
      showToast({
        type: "success",
        title: `${typeLabel} saved`,
        message: `${fields.type === "income" ? "+" : "-"}$${amount.toFixed(2)} · ${name || fields.category}`,
      });
      return false;
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to save transaction",
      });
      return false;
    }
  }, [fields, validate, isEditing, editingTransaction, addTransaction, updateTransaction, setEditingTransaction, showToast]);

  const reset = useCallback(() => {
    setFields(getInitialFields());
    setErrors({});
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (editingTransaction) return;
      reset();
    }, [editingTransaction, reset]),
  );

  return { fields, errors, updateField, submit, reset, isEditing };
}
