import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { PIE_COLORS } from "../constants";
import {
  useAvailableMonths,
  useMonthlyExpenses,
  type YearMonth,
} from "../hooks/useMonthlyExpenses";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { MonthSelector } from "../components/MonthSelector";
import { MonthlyExpensePieChart } from "../components/MonthlyExpensePieChart";
import { PeriodComparison } from "../components/PeriodComparison";

export function InsightsScreen() {
  const months = useAvailableMonths();
  const [selected, setSelected] = useState<YearMonth>(months[0]);
  const { entries, currentTotal } = useMonthlyExpenses(selected);

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginVertical: 30 }}>
      <View style={{ marginBottom: 20 }}>
        <MonthlyExpensePieChart month={selected} />
      </View>
      <View>
        <MonthSelector
          months={months}
          value={selected}
          onChange={setSelected}
        />
      </View>
      <View>
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
      <PeriodComparison month={selected} />
    </ScrollView>
  );
}
