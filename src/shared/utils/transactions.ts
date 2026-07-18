import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "../../features/transactions/categories";

export const ICON_SETS = {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
};

export function getCategoryIcon(label: string, type: "income" | "expense") {
  const categories =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const cat = categories.find((c) => c.label === label);
  if (!cat) return { iconFamily: "AntDesign" as const, icon: "questioncircle" };
  return { iconFamily: cat.iconFamily, icon: cat.icon };
}

function parseLocalDate(dateStr: string): Date {
  if (dateStr.length === 10) {
    return new Date(dateStr + "T00:00:00");
  }
  return new Date(dateStr);
}

export function formatDate(iso: string): string {
  const date = parseLocalDate(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compare = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (compare.getTime() === today.getTime()) return "Today";
  if (compare.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateHeader(iso: string): string {
  const date = parseLocalDate(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compare = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (compare.getTime() === today.getTime()) return `Today, ${formatted}`;
  if (compare.getTime() === yesterday.getTime()) return `Yesterday, ${formatted}`;

  return formatted;
}

export function formatAmount(
  amount: number,
  type: "income" | "expense",
): string {
  const prefix = type === "income" ? "+$" : "-$";
  return `${prefix}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
