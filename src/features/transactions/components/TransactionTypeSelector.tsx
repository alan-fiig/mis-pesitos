import { View, Text, TouchableOpacity } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import type { TransactionType } from "../categories";

interface Props {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  lockedType?: TransactionType | null;
}

export function TransactionTypeSelector({ value, onChange, lockedType }: Props) {
  const expenseDisabled = lockedType === "income";
  const incomeDisabled = lockedType === "expense";

  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: colors.light__gray,
        padding: 4,
        flexDirection: "row",
        gap: 4,
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => !expenseDisabled && onChange("expense")}
        disabled={expenseDisabled}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingHorizontal: 24,
          paddingVertical: 8,
          borderRadius: 9999,
          backgroundColor:
            value === "expense" ? colors.secondary : "transparent",
          opacity: expenseDisabled ? 0.4 : 1,
        }}
      >
        <Text
          style={[
            textStyles.label_md,
            {
              color: value === "expense" ? "#121212" : colors.secondary,
            },
          ]}
        >
          Expense
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => !incomeDisabled && onChange("income")}
        disabled={incomeDisabled}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingHorizontal: 24,
          paddingVertical: 8,
          borderRadius: 9999,
          backgroundColor: value === "income" ? colors.primary : "transparent",
          opacity: incomeDisabled ? 0.4 : 1,
        }}
      >
        <Text
          style={[
            textStyles.label_md,
            {
              color: value === "income" ? "#121212" : colors.primary,
            },
          ]}
        >
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
}
