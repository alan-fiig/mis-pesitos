import * as XLSX from "xlsx";
import type { Expense, TransactionType } from "../../../types/expense";

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
  installment_group: "installment_group",
  installment_index: "installment_index",
  installment_total: "installment_total",
};

export function buildWorkbookBase64(transactions: Expense[]): string {
  const rows = transactions.map((t) => ({
    date: t.date.slice(0, 10),
    type: t.type,
    category: t.category,
    name: t.name ?? "",
    description: t.description ?? "",
    amount: t.amount,
    installment_group: t.installment_group ?? "",
    installment_index: t.installment_index ?? "",
    installment_total: t.installment_total ?? "",
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
  return rawRows.map((raw, i) => parseRow(raw, i, now));
}

function parseRow(
  raw: Record<string, unknown>,
  index: number,
  now: string,
): Expense {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const field = HEADER_ALIASES[normalizeHeader(key)];
    if (field) row[field] = value;
  }
  const rowNumber = index + 2; // header is row 1 in the sheet

  const date = parseDate(row.date);
  const type = parseType(row.type);
  const category = String(row.category ?? "").trim();
  const amount = parseAmount(row.amount);

  if (!date) throw new Error(`Row ${rowNumber}: invalid date`);
  if (!type) throw new Error(`Row ${rowNumber}: type must be income or expense`);
  if (!category) throw new Error(`Row ${rowNumber}: missing category`);
  if (amount == null) throw new Error(`Row ${rowNumber}: invalid amount`);

  const expense: Expense = { id: now + index, type, amount, category, date };
  const name = String(row.name ?? "").trim();
  const description = String(row.description ?? "").trim();
  if (name) expense.name = name;
  if (description) expense.description = description;

  const group = String(row.installment_group ?? "").trim();
  if (group) {
    expense.installment_group = group;
    const idx = toInt(row.installment_index);
    const total = toInt(row.installment_total);
    if (idx != null) expense.installment_index = idx;
    if (total != null) expense.installment_total = total;
  }
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
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof v === "number" && v > 0) {
    // Excel serial date (days since 1899-12-30)
    return new Date(Math.round((v - 25569) * 86400000))
      .toISOString()
      .slice(0, 10);
  }
  if (typeof v === "string") {
    const s = v.trim();
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
    if (iso) {
      return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    }
    const latam = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/.exec(s);
    if (latam) {
      return `${latam[3]}-${latam[2].padStart(2, "0")}-${latam[1].padStart(2, "0")}`;
    }
  }
  return null;
}

function parseType(v: unknown): TransactionType | null {
  const s = String(v ?? "").trim().toLowerCase();
  if (["expense", "gasto", "gastos", "egreso"].includes(s)) return "expense";
  if (["income", "ingreso", "ingresos"].includes(s)) return "income";
  return null;
}

function parseAmount(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function toInt(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isInteger(n) ? n : null;
}
