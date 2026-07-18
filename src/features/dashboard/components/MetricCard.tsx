import { View, Text } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { useTransactionsStore } from "../../../store/transactionsStore";
import type { Expense } from "../../../types/expense";

function getMonthTotal(
  transactions: Expense[],
  type: "income" | "expense",
  year: number,
  month: number,
): number {
  return transactions
    .filter((t) => {
      const d = t.date.length === 10
        ? new Date(t.date + "T00:00:00")
        : new Date(t.date);
      return t.type === type && d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

function calculateChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? null : 0;
  return ((current - previous) / previous) * 100;
}

function formatAmount(amount: number): string {
  return `$ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function PreviousMonth(year: number, month: number) {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}

export function IncomeCard() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const now = new Date();
  const current = getMonthTotal(transactions, "income", now.getFullYear(), now.getMonth());
  const prev = PreviousMonth(now.getFullYear(), now.getMonth());
  const previous = getMonthTotal(transactions, "income", prev.year, prev.month);
  const change = calculateChange(current, previous);

  const isUp = change !== null && change >= 0;
  const changeColor = isUp ? colors.primary : colors.secondary;
  const triangleName = isUp ? "triangle-up" : "triangle-down" as const;

  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 5,
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <AntDesign name="arrow-up" size={16} color={colors.primary} />
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          Income
        </Text>
      </View>
      <Text style={[textStyles.label_lg, { color: colors.primary }]}>
        {formatAmount(current)}
      </Text>
      {change !== null && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name={triangleName} size={16} color={changeColor} />
          <Text style={[textStyles.label_md, { color: changeColor }]}>
            {Math.abs(change).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}

export function ExpenseCard() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const now = new Date();
  const current = getMonthTotal(transactions, "expense", now.getFullYear(), now.getMonth());
  const prev = PreviousMonth(now.getFullYear(), now.getMonth());
  const previous = getMonthTotal(transactions, "expense", prev.year, prev.month);
  const change = calculateChange(current, previous);

  const isUp = change !== null && change >= 0;
  const changeColor = isUp ? colors.secondary : colors.primary;
  const triangleName = isUp ? "triangle-up" : "triangle-down" as const;

  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 5,
        alignItems: "flex-start",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <AntDesign name="arrow-down" size={16} color={colors.secondary} />
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          Expenses
        </Text>
      </View>
      <Text style={[textStyles.label_lg, { color: colors.secondary }]}>
        {formatAmount(current)}
      </Text>
      {change !== null && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name={triangleName} size={16} color={changeColor} />
          <Text style={[textStyles.label_md, { color: changeColor }]}>
            {Math.abs(change).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}
