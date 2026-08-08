import React from "react";
import { ScrollView, View } from "react-native";
import TotalBalanceCard from "../components/TotalBalanceCard";
import { IncomeCard, ExpenseCard } from "../components/MetricCard";
import InsightCard from "../components/InsightCard";
import RecentTransactionsCard from "../components/RecentTransactionsCard";

export function DashboardScreen() {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginVertical: 30 }}>
      <View>
        <TotalBalanceCard />
      </View>
      <View style={{ marginBottom: 20, flexDirection: "row", gap: 20 }}>
        <View style={{ flex: 1 }}>
          <IncomeCard />
        </View>
        <View style={{ flex: 1 }}>
          <ExpenseCard />
        </View>
      </View>
      <View style={{ marginBottom: 20 }}>
        <InsightCard />
      </View>
      <RecentTransactionsCard />
    </ScrollView>
  );
}
