import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { TransactionType } from "../categories";
import type { Expense } from "../../../types/expense";
import { useTransactionsStore } from "../../../store/transactionsStore";
import { useToast } from "../../../shared/context/ToastContext";
import { formatAmount, parseAmount } from "../components/AmountInput";

interface FormState {
  type: TransactionType;
  amount: string;
  category: string;
  name: string;
  date: Date;
  note: string;
  months: number;
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

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getInitialFields(): FormState {
  return {
    type: "expense",
    amount: "",
    category: CATEGORY_DEFAULTS.expense,
    name: "",
    date: new Date(),
    note: "",
    months: 0,
  };
}

function addMonthsToDate(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getInstallmentName(baseName: string, index: number, total: number): string {
  if (!baseName) return `(${index}/${total})`;
  return `${baseName} (${index}/${total})`;
}

export function useTransactionForm() {
  const editingTransaction = useTransactionsStore((s) => s.editingTransaction);
  const setEditingTransaction = useTransactionsStore((s) => s.setEditingTransaction);
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const addTransactions = useTransactionsStore((s) => s.addTransactions);
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const removeTransactionsByGroup = useTransactionsStore((s) => s.removeTransactionsByGroup);
  const getTransactionsByGroup = useTransactionsStore((s) => s.getTransactionsByGroup);

  const [fields, setFields] = useState<FormState>(getInitialFields);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingTransaction) {
      const loadEditingData = async () => {
        let months = 0;
        let groupId = editingTransaction.installment_group;

        let totalAmount = editingTransaction.amount;

        if (groupId) {
          const groupTransactions = await getTransactionsByGroup(groupId);
          if (groupTransactions.length > 0) {
            months = groupTransactions[0].installment_total ?? 0;
            totalAmount = groupTransactions.reduce((sum, t) => sum + t.amount, 0);
          }
        }

        setFields({
          type: editingTransaction.type,
          amount: formatAmount(String(totalAmount)),
          category: editingTransaction.category,
          name: editingTransaction.name?.replace(/\s*\(\d+\/\d+\)$/, "") ?? "",
          date: editingTransaction.date.length === 10
            ? new Date(editingTransaction.date + "T00:00:00")
            : new Date(editingTransaction.date),
          note: editingTransaction.description ?? "",
          months,
        });
        setErrors({});
      };

      loadEditingData();
    }
  }, [editingTransaction, getTransactionsByGroup]);

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

    const amountNum = parseFloat(parseAmount(fields.amount));
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
    const amount = parseFloat(parseAmount(fields.amount));
    const name = fields.name.trim();

    try {
      if (isEditing) {
        const { id, installment_group: existingGroupId } = editingTransaction;

        if (existingGroupId && fields.months > 0) {
          await removeTransactionsByGroup(existingGroupId);

          const groupId = generateUUID();
          const installmentAmount = amount / fields.months;
          const roundedInstallment = Math.round(installmentAmount * 100) / 100;
          const transactions: Expense[] = [];

          for (let i = 0; i < fields.months; i++) {
            const installmentDate = addMonthsToDate(fields.date, i);
            const installmentName = getInstallmentName(name, i + 1, fields.months);
            const installmentAmountRounded = i === fields.months - 1
              ? Math.round((amount - roundedInstallment * (fields.months - 1)) * 100) / 100
              : installmentAmount;

            transactions.push({
              id: i === 0 ? id : Date.now().toString() + i,
              type: fields.type,
              amount: Math.round(installmentAmountRounded * 100) / 100,
              category: fields.category,
              name: installmentName,
              description: fields.note || undefined,
              date: formatLocalDate(installmentDate),
              installment_group: groupId,
              installment_index: i + 1,
              installment_total: fields.months,
            });
          }

          await addTransactions(transactions);
        } else if (existingGroupId && fields.months === 0) {
          await removeTransactionsByGroup(existingGroupId);

          const transaction: Expense = {
            id,
            type: fields.type,
            amount,
            category: fields.category,
            name,
            description: fields.note || undefined,
            date: formatLocalDate(fields.date),
          };

          await addTransaction(transaction);
        } else if (!existingGroupId && fields.months > 0) {
          const groupId = generateUUID();
          const installmentAmount = amount / fields.months;
          const roundedInstallment = Math.round(installmentAmount * 100) / 100;
          const transactions: Expense[] = [];

          for (let i = 0; i < fields.months; i++) {
            const installmentDate = addMonthsToDate(fields.date, i);
            const installmentName = getInstallmentName(name, i + 1, fields.months);
            const installmentAmountRounded = i === fields.months - 1
              ? Math.round((amount - roundedInstallment * (fields.months - 1)) * 100) / 100
              : installmentAmount;

            transactions.push({
              id: i === 0 ? id : Date.now().toString() + i,
              type: fields.type,
              amount: Math.round(installmentAmountRounded * 100) / 100,
              category: fields.category,
              name: installmentName,
              description: fields.note || undefined,
              date: formatLocalDate(installmentDate),
              installment_group: groupId,
              installment_index: i + 1,
              installment_total: fields.months,
            });
          }

          await addTransactions(transactions);
        } else {
          await updateTransaction(id, {
            type: fields.type,
            amount,
            category: fields.category,
            name,
            description: fields.note || undefined,
            date: formatLocalDate(fields.date),
          });
        }

        setEditingTransaction(null);
        showToast({
          type: "success",
          title: `${typeLabel} updated`,
          message: `${fields.type === "income" ? "+" : "-"}$${amount.toFixed(2)} · ${name || fields.category}`,
        });
        return true;
      }

      if (fields.months > 0) {
        const groupId = generateUUID();
        const installmentAmount = amount / fields.months;
        const roundedInstallment = Math.round(installmentAmount * 100) / 100;
        const transactions: Expense[] = [];

        for (let i = 0; i < fields.months; i++) {
          const installmentDate = addMonthsToDate(fields.date, i);
          const installmentName = getInstallmentName(name, i + 1, fields.months);
          const installmentAmountRounded = i === fields.months - 1
            ? Math.round((amount - roundedInstallment * (fields.months - 1)) * 100) / 100
            : installmentAmount;

          transactions.push({
            id: Date.now().toString() + i,
            type: fields.type,
            amount: Math.round(installmentAmountRounded * 100) / 100,
            category: fields.category,
            name: installmentName,
            description: fields.note || undefined,
            date: formatLocalDate(installmentDate),
            installment_group: groupId,
            installment_index: i + 1,
            installment_total: fields.months,
          });
        }

        await addTransactions(transactions);
      } else {
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
      }

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
  }, [fields, validate, isEditing, editingTransaction, addTransaction, addTransactions, updateTransaction, removeTransactionsByGroup, setEditingTransaction, showToast]);

  const reset = useCallback(() => {
    setFields(getInitialFields());
    setErrors({});
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!editingTransaction) {
        reset();
      }
      return () => {
        setEditingTransaction(null);
      };
    }, [editingTransaction, reset, setEditingTransaction]),
  );

  const originalType = editingTransaction?.type ?? null;

  return { fields, errors, updateField, submit, reset, isEditing, originalType };
}
