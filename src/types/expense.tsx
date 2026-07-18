export type TransactionType = "income" | "expense";

export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  name?: string;
  description?: string;
  date: string;
  installment_group?: string;
  installment_index?: number;
  installment_total?: number;
}
