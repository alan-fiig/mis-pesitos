import { useTransactionsStore } from "../../../store/transactionsStore";
import type { Expense } from "../../../types/expense";

export interface YearMonth {
  y: number;
  m: number;
}

function monthOf(dateStr: string): YearMonth {
  const [y, m] = dateStr.split("-").map(Number);
  return { y, m };
}

function isInMonth(t: Expense, y: number, m: number): boolean {
  const date = monthOf(t.date.slice(0, 10));
  return date.y === y && date.m === m;
}

/** Months with at least one expense, never beyond the current month. */
export function useAvailableMonths(): YearMonth[] {
  const transactions = useTransactionsStore((s) => s.transactions);
  const now = new Date();
  const current = { y: now.getFullYear(), m: now.getMonth() + 1 };

  const seen = new Set<number>([current.y * 12 + current.m]);
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = monthOf(t.date.slice(0, 10));
    const key = d.y * 12 + d.m;
    if (key <= current.y * 12 + current.m) seen.add(key);
  }

  return [...seen]
    .sort((a, b) => b - a)
    .map((key) => ({ y: Math.floor((key - 1) / 12), m: ((key - 1) % 12) + 1 }));
}

export function useMonthlyExpenses(target: YearMonth) {
  const transactions = useTransactionsStore((s) => s.transactions);
  const year = target.y;
  const month = target.m;

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
