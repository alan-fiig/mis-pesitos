export function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function openMonthHistory(
  navigation: any,
  yearMonth: string,
  type: "income" | "expense",
  categories: string[] = [],
) {
  navigation.navigate("History", {
    filters: { dateFrom: yearMonth, dateTo: yearMonth, categories },
    type,
  });
}
