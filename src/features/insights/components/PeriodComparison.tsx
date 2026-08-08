import { View, Text } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { textStyles } from "../../../shared/theme/typography";
import { useMonthlyExpenses } from "../hooks/useMonthlyExpenses";

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function PeriodLine({ ratio, color }: { ratio: number; color: string }) {
  return (
    <View
      style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.light__gray,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          borderRadius: 4,
          backgroundColor: color,
          width: `${ratio * 100}%`,
        }}
      />
    </View>
  );
}

function PeriodRow({
  label,
  amount,
  color,
  ratio,
}: {
  label: string;
  amount: number;
  color: string;
  ratio: number;
}) {
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[textStyles.label_md, { color: colors.text }]}>
          {label}
        </Text>
        <Text style={[textStyles.label_md, { color: colors.text }]}>
          {formatAmount(amount)}
        </Text>
      </View>
      <PeriodLine ratio={ratio} color={color} />
    </View>
  );
}

export function PeriodComparison() {
  const { currentTotal, previousTotal } = useMonthlyExpenses();

  const maxMonth = Math.max(currentTotal, previousTotal);
  const ratio = maxMonth > 0 ? (value: number) => value / maxMonth : () => 0;

  const average = (currentTotal + previousTotal) / 2;

  return (
    <View
      style={{
        alignSelf: "stretch",
        marginTop: 20,
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 16,
      }}
    >
      <Text style={[textStyles.label_lg, { color: "white" }]}>
        Period Comparison
      </Text>

      <PeriodRow
        label="This Month"
        amount={currentTotal}
        color={colors.primary}
        ratio={ratio(currentTotal)}
      />

      <PeriodRow
        label="Last Month"
        amount={previousTotal}
        color="#6B7280"
        ratio={ratio(previousTotal)}
      />

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.light__gray,
          paddingTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[textStyles.label_md, { color: colors.text }]}>
          Avg. Monthly Spend
        </Text>
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          {formatAmount(average)}
        </Text>
      </View>
    </View>
  );
}
