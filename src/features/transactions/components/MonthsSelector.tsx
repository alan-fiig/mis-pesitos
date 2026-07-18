import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { formatAmount } from "./AmountInput";

interface Props {
  value: number;
  onChange: (months: number) => void;
  amount: string;
  type: "income" | "expense";
}

const MONTH_OPTIONS = [0, 3, 6, 9, 12];

const getMonthLabel = (months: number): string => {
  if (months === 0) return "Sin meses";
  return `${months} meses`;
};

const formatCurrency = (amount: number): string => {
  return formatAmount(amount.toFixed(2));
};

export function MonthsSelector({ value, onChange, amount, type }: Props) {
  if (type !== "expense") return null;

  const amountNum = parseFloat(amount.replace(/,/g, "")) || 0;
  const monthlyAmount = value > 0 ? amountNum / value : 0;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingVertical: 4,
        }}
      >
        {MONTH_OPTIONS.map((months) => (
          <TouchableOpacity
            key={months}
            onPress={() => onChange(months)}
            style={{
              backgroundColor: value === months ? colors.primary : colors.dark_gray,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              minWidth: 90,
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                textStyles.label_md,
                {
                  color: value === months ? colors.background : colors.text,
                  fontWeight: value === months ? "700" : "500",
                },
              ]}
            >
              {getMonthLabel(months)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {value > 0 && amountNum > 0 && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: colors.dark_gray,
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              textStyles.label_md,
              { color: colors.text },
            ]}
          >
            {"$" + formatCurrency(monthlyAmount)}
            <Text style={{ color: colors.icons }}> × </Text>
            <Text style={{ color: colors.primary }}>{value}</Text>
            <Text style={{ color: colors.icons }}> meses = </Text>
            <Text style={{ color: colors.primary }}>
              {"$" + formatCurrency(amountNum)}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}
