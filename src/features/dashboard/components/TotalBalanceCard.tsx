import { View, Text } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { useTransactionsStore } from "../../../store/transactionsStore";

function formatBalance(amount: number): string {
  const prefix = amount < 0 ? "-$" : "$";
  return `${prefix}${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function TotalBalanceCard() {
  const transactions = useTransactionsStore((s) => s.transactions);

  const balance = transactions.reduce((acc, t) => {
    return acc + (t.type === "income" ? t.amount : -t.amount);
  }, 0);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
      }}
    >
      <Text style={[textStyles.headline_sm, { color: colors.text }]}>
        TOTAL BALANCE
      </Text>
      <Text
        style={[
          textStyles.display_lg,
          { color: balance < 0 ? colors.secondary : "white" },
        ]}
      >
        {formatBalance(balance)}
      </Text>
    </View>
  );
}
