import { openDatabaseAsync, type SQLiteBindValue, type SQLiteDatabase } from "expo-sqlite";
import type { Expense } from "../../../types/expense";

let db: SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  if (db) return;
  db = await openDatabaseAsync("mis-pesitos.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execAsync(`ALTER TABLE transactions ADD COLUMN name TEXT NOT NULL DEFAULT '';`);
  } catch {
  }
}

function ensureDb(): SQLiteDatabase {
  if (!db) throw new Error("Database not initialized. Call initDatabase() first.");
  return db;
}

export async function getAllTransactions(): Promise<Expense[]> {
  const database = ensureDb();
  const rows = await database.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM transactions ORDER BY date DESC",
  );
  return rows.map(rowToExpense);
}

export async function getRecentTransactions(limit: number): Promise<Expense[]> {
  const database = ensureDb();
  const rows = await database.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM transactions ORDER BY date DESC LIMIT ?",
    [limit],
  );
  return rows.map(rowToExpense);
}

export async function insertTransaction(t: Expense): Promise<void> {
  const database = ensureDb();
  await database.runAsync(
    "INSERT INTO transactions (id, type, amount, category, name, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [t.id, t.type, t.amount, t.category, t.name ?? '', t.description ?? null, t.date],
  );
}

export async function updateTransaction(
  id: string,
  data: Partial<Omit<Expense, "id">>,
): Promise<void> {
  const database = ensureDb();
  const fields: string[] = [];
  const values: SQLiteBindValue[] = [];

  if (data.type !== undefined) {
    fields.push('type = ?');
    values.push(data.type);
  }
  if (data.amount !== undefined) {
    fields.push('amount = ?');
    values.push(data.amount);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date);
  }

  if (fields.length === 0) return;

  values.push(id);
  await database.runAsync(
    `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
}

export async function deleteTransaction(id: string): Promise<void> {
  const database = ensureDb();
  await database.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
}

function rowToExpense(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id),
    type: row.type as Expense["type"],
    amount: Number(row.amount),
    category: String(row.category),
    name: String(row.name ?? ""),
    description: row.description ? String(row.description) : undefined,
    date: String(row.date),
  };
}
