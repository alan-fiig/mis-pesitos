import * as XLSX from "xlsx";
import type { Expense, TransactionType } from "../../../types/expense";

// Two expenses are "the same" if every business field matches (imported
// rows regenerate ids, so id can't be the dedupe key).
function businessKey(t: Expense): string {
  return [t.type, t.date.slice(0, 10), t.amount, t.category, t.name ?? "", t.description ?? ""].join("|");
}

/** Drops rows already present in `existing` or repeated within `imported`. */
export function dedupeExpenses(imported: Expense[], existing: Expense[]): Expense[] {
  const keys = new Set(existing.map(businessKey));
  return imported.filter((t) => {
    const key = businessKey(t);
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
}

// Headers accepted on import (normalized: lowercase, no accents).
const HEADER_ALIASES: Record<string, string> = {
  date: "date",
  fecha: "date",
  type: "type",
  tipo: "type",
  category: "category",
  categoria: "category",
  name: "name",
  nombre: "name",
  description: "description",
  descripcion: "description",
  amount: "amount",
  monto: "amount",
  cantidad: "amount",
};

export function buildWorkbookBase64(transactions: Expense[]): string {
  const rows = transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.date.localeCompare(a.date)) // newest first
    .map((t) => ({
      date: t.date.slice(0, 10),
      category: t.category,
      name: t.name ?? "",
      description: t.description ?? "",
      amount: t.amount,
    }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  return XLSX.write(wb, { type: "base64", bookType: "xlsx" });
}

export function parseWorkbookBase64(base64: string): Expense[] {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(base64, { type: "base64", cellDates: true });
  } catch {
    throw new Error("Could not read the Excel file");
  }
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("The file has no sheets");

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
  });
  if (rawRows.length === 0) throw new Error("The sheet is empty");

  const now = Date.now().toString();
  return rawRows
    .map((raw, i) => parseRow(raw, i, now))
    .filter((t): t is Expense => t !== null);
}

function parseRow(
  raw: Record<string, unknown>,
  index: number,
  now: string,
): Expense | null {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const field = HEADER_ALIASES[normalizeHeader(key)];
    if (field) row[field] = value;
  }
  const rowNumber = index + 2; // header is row 1 in the sheet

  // Imports are expenses-only. Rows from older backups marked as income are
  // skipped so they don't silently become expenses.
  if (parseType(row.type) === "income") return null;

  const date = parseDate(row.date);
  const category = String(row.category ?? "").trim();
  const amount = parseAmount(row.amount);

  if (!date) throw new Error(`Row ${rowNumber}: invalid date`);
  if (!category) throw new Error(`Row ${rowNumber}: missing category`);
  // Same rule as the form (useTransactionForm): positive amounts only.
  if (amount == null || amount <= 0) {
    throw new Error(`Row ${rowNumber}: invalid amount`);
  }

  const expense: Expense = {
    id: now + index,
    type: "expense",
    amount,
    category,
    date,
  };
  const name = String(row.name ?? "").trim();
  const description = String(row.description ?? "").trim();
  if (name) expense.name = name;
  if (description) expense.description = description;
  return expense;
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseDate(v: unknown): string | null {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return ymd(v.getFullYear(), v.getMonth() + 1, v.getDate());
  }
  if (typeof v === "number" && v > 0) {
    // Excel serial date (days since 1899-12-30)
    const d = new Date(Math.round((v - 25569) * 86400000));
    return ymd(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  if (typeof v === "string") {
    const s = v.trim();
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
    if (iso) return ymd(+iso[1], +iso[2], +iso[3]);
    const latam = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/.exec(s);
    if (latam) return ymd(+latam[3], +latam[2], +latam[1]);
  }
  return null;
}

/** "YYYY-MM-DD" only when the calendar date exists; null otherwise. */
function ymd(y: number, m: number, d: number): string | null {
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseType(v: unknown): TransactionType | null {
  const s = String(v ?? "").trim().toLowerCase();
  if (["expense", "gasto", "gastos", "egreso"].includes(s)) return "expense";
  if (["income", "ingreso", "ingresos"].includes(s)) return "income";
  return null;
}

function parseAmount(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return roundCents(v);
  if (typeof v === "string") {
    const n = parseFloat(normalizeNumericString(v));
    if (Number.isFinite(n)) return roundCents(n);
  }
  return null;
}

function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}

/** "1.234,56" -> "1234.56"; "1,234.56" and "1234" unchanged. */
function normalizeNumericString(v: string): string {
  const s = v.replace(/[^0-9.,-]/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastDot !== -1 && lastComma > lastDot) {
    return s.replace(/\./g, "").replace(",", "."); // coma decimal europea
  }
  if (lastDot === -1 && lastComma !== -1 && !/^\d{1,3}(,\d{3})+$/.test(s)) {
    return s.replace(",", "."); // "1234,56" -> decimal; "1,234" -> miles
  }
  return s.replace(/,/g, "");
}
