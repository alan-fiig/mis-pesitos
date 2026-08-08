import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { useTransactionsStore } from "../../../store/transactionsStore";
import { TransactionCard } from "../../../shared/components/TransactionCard";
import { TransactionDetailModal } from "../../../shared/components/TransactionDetailModal";
import type { Expense } from "../../../types/expense";

export default function RecentTransactionsCard() {
  const navigation = useNavigation<any>();
  const transactions = useTransactionsStore((s) => s.transactions);
  const recent = transactions.slice(0, 5);
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);

  if (recent.length === 0) {
    return (
      <View>
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          Recent transactions
        </Text>

        <Text
          style={[
            textStyles.body_md,
            { color: colors.text, marginTop: 16 },
          ]}
        >
          No transactions yet
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          Recent transactions
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <Text style={[textStyles.label_lg, { color: colors.primary }]}>
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {recent.map((t) => (
        <View key={t.id} style={{ marginTop: 20 }}>
          <TransactionCard transaction={t} showDate onPress={() => setSelectedTransaction(t)} />
        </View>
      ))}

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
}
