import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../../../shared/theme/colors";
import { textStyles } from "../../../shared/theme/typography";
import {
  currentYearMonth,
  openMonthHistory,
} from "../../../shared/utils/historyFilters";

export interface CategoryBreakdownEntry {
  category: string;
  amount: number;
  color: string;
}

interface Props {
  entries: CategoryBreakdownEntry[];
  total: number;
}

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(percent: number): string {
  return `${percent.toFixed(1)}%`;
}

export function CategoryBreakdown({ entries, total }: Props) {
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState(false);
  const visibleEntries = expanded ? entries : entries.slice(0, 5);
  const hasMore = entries.length > 5;

  return (
    <View
      style={{
        alignSelf: "stretch",
        marginTop: 20,
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 12,
      }}
    >
      <Text style={[textStyles.label_lg, { color: "white" }]}>
        Spending by Category
      </Text>
      {visibleEntries.map(({ category, amount, color }) => {
        const percent = (amount / total) * 100;
        return (
          <TouchableOpacity
            key={category}
            onPress={() =>
              openMonthHistory(navigation, currentYearMonth(), "expense", [
                category,
              ])
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: color,
              }}
            />
            <Text
              style={[textStyles.body_md, { color: colors.text, flex: 1 }]}
              numberOfLines={1}
            >
              {category}
            </Text>
            <Text
              style={[
                textStyles.body_md,
                { color: colors.text, width: 55, textAlign: "right" },
              ]}
            >
              {formatPercent(percent)}
            </Text>
            <Text
              style={[
                textStyles.body_md,
                { color: colors.text, width: 100, textAlign: "right" },
              ]}
            >
              {formatAmount(amount)}
            </Text>
          </TouchableOpacity>
        );
      })}
      {hasMore && (
        <TouchableOpacity
          onPress={() => setExpanded((prev) => !prev)}
          style={{
            marginTop: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: colors.light__gray,
            borderRadius: 9999,
            paddingHorizontal: 20,
            paddingVertical: 8,
            alignSelf: "flex-start",
          }}
        >
          <Text style={[textStyles.label_md, { color: colors.primary }]}>
            {expanded ? "Show less" : "Show more"}
          </Text>
          <AntDesign
            name={expanded ? "up" : "down"}
            size={12}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
