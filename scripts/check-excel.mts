/**
 * Self-check del parser/exportador de Excel (`pnpm test`, Node >= 23).
 * Cubre los casos que ya rompieron en producción: fechas de texto, montos con
 * coma decimal, montos inválidos y duplicados.
 */
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import {
  buildWorkbookBase64,
  dedupeExpenses,
  parseWorkbookBase64,
} from "../src/features/history/services/excelParse.ts";
import type { Expense } from "../src/types/expense.tsx";

function sheet(rows: unknown[][]): string {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "S");
  return XLSX.write(wb, { type: "base64", bookType: "xlsx" });
}

const sample: Expense[] = [
  { id: "a", type: "expense", amount: 1234.56, category: "Grocery", name: "Súper", date: "2026-10-02" },
  { id: "b", type: "expense", amount: 90, category: "Transport", date: "2026-10-05" },
  { id: "c", type: "income", amount: 5000, category: "Salary", date: "2026-10-01" },
];

// Export -> import: solo gastos, más reciente primero, fecha YYYY-MM-DD.
const roundTrip = parseWorkbookBase64(buildWorkbookBase64(sample));
assert.deepEqual(
  roundTrip.map((t) => t.date),
  ["2026-10-05", "2026-10-02"],
);
const first = roundTrip.find((t) => t.name === "Súper");
assert.ok(first);
assert.equal(first.amount, 1234.56);
assert.equal(first.category, "Grocery");
assert.equal(first.type, "expense");

// Dedupe: ignora el id, compara los campos del negocio.
assert.equal(dedupeExpenses(roundTrip, [{ ...first, id: "otro" }]).length, 1);
assert.equal(dedupeExpenses([first, { ...first, id: "otro" }], []).length, 1);

// Montos de texto en formato mexicano (1,234.56), europeo (1.234,56) y redondeo.
const money = parseWorkbookBase64(
  sheet([
    ["Fecha", "Categoría", "Monto"],
    ["30/10/2026", "Other", "1.234,56"],
    ["2026-10-31", "Other", "1,234.56"],
    ["2026-11-01", "Other", "10.567"],
    ["2026-11-02", "Other", "S/ 1,234"],
  ]),
);
assert.deepEqual(
  money.map((t) => t.amount),
  [1234.56, 1234.56, 10.57, 1234],
);

// Fechas imposibles se rechazan con el número de fila.
assert.throws(
  () => parseWorkbookBase64(sheet([["date", "category", "amount"], ["10/30/2026", "Other", "100"]])),
  /Row 2: invalid date/,
);
assert.throws(
  () => parseWorkbookBase64(sheet([["date", "category", "amount"], ["2026-02-30", "Other", "100"]])),
  /Row 2: invalid date/,
);

// Montos <= 0 se rechazan igual que en el formulario.
assert.throws(
  () => parseWorkbookBase64(sheet([["date", "category", "amount"], ["2026-10-30", "Other", "-120"]])),
  /Row 2: invalid amount/,
);
assert.throws(
  () => parseWorkbookBase64(sheet([["date", "category", "amount"], ["2026-10-30", "Other", "0"]])),
  /Row 2: invalid amount/,
);

// Backups viejos con ingresos: se omiten, no se convierten en gastos.
const legacy = parseWorkbookBase64(
  sheet([
    ["date", "type", "category", "amount"],
    ["2026-10-30", "income", "Salary", "1000"],
    ["2026-10-30", "expense", "Other", "50"],
  ]),
);
assert.equal(legacy.length, 1);
assert.equal(legacy[0].amount, 50);

console.log("excel checks ok");
