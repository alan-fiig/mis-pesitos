import React from "react";
import { ScrollView, View } from "react-native";
import { PIE_COLORS } from "../constants";
import { useMonthlyExpenses } from "../hooks/useMonthlyExpenses";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { MonthlyExpensePieChart } from "../components/MonthlyExpensePieChart";
import { PeriodComparison } from "../components/PeriodComparison";

export function InsightsScreen() {
  const { entries, currentTotal } = useMonthlyExpenses();

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginVertical: 30 }}>
      <View style={{ marginBottom: 20 }}>
        <MonthlyExpensePieChart />
      </View>
      <View style={{ marginBottom: 20 }}>
        {entries.length > 0 && (
          <CategoryBreakdown
            entries={entries.map(([category, amount], index) => ({
              category,
              amount,
              color: PIE_COLORS[index % PIE_COLORS.length],
            }))}
            total={currentTotal}
          />
        )}
      </View>
      <PeriodComparison />
    </ScrollView>
  );
}
