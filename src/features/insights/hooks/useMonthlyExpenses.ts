import { useTransactionsStore } from "../../../store/transactionsStore";
import type { Expense } from "../../../types/expense";

function monthOf(dateStr: string): { y: number; m: number } {
  const [y, m] = dateStr.split("-").map(Number);
  return { y, m };
}

function isInMonth(t: Expense, y: number, m: number): boolean {
  const date = monthOf(t.date.slice(0, 10));
  return date.y === y && date.m === m;
}

export function useMonthlyExpenses() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };

  const byCategory = new Map<string, number>();
  let currentTotal = 0;
  let previousTotal = 0;

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    if (isInMonth(t, year, month)) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
      currentTotal += t.amount;
    } else if (isInMonth(t, prev.y, prev.m)) {
      previousTotal += t.amount;
    }
  }

  const entries = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  const change =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : null;

  return { entries, currentTotal, previousTotal, change };
}
