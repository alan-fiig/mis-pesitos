export type TransactionType = "income" | "expense";

export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  name?: string;
  description?: string;
  date: string;
}
