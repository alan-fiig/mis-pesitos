import { View, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PieChart } from "react-native-gifted-charts";
import { colors } from "../../../shared/theme/colors";
import { textStyles } from "../../../shared/theme/typography";
import { PIE_COLORS } from "../constants";
import { useMonthlyExpenses } from "../hooks/useMonthlyExpenses";

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(change: number): string {
  return `${Math.abs(change).toFixed(1)}%`;
}

export function MonthlyExpensePieChart() {
  const { entries, currentTotal, change } = useMonthlyExpenses();

  const isUp = change !== null && change >= 0;
  const changeColorBackground = isUp ? colors.light_red : colors.light_green;
  const changeColor = isUp ? colors.secondary : colors.primary;
  const triangleName = isUp ? "arrow-up" : ("arrow-down" as const);

  const data = entries.map(([category, value], index) => ({
    value,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
      }}
    >
      {entries.length === 0 ? (
        <View
          style={{
            height: 240,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[textStyles.body_md, { color: colors.text }]}>
            No expenses this month yet
          </Text>
        </View>
      ) : (
        <PieChart
          data={data}
          donut
          radius={150}
          innerRadius={125}
          innerCircleColor={colors.background}
          strokeColor={colors.background}
          strokeWidth={1}
          centerLabelComponent={() => (
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  textStyles.label_md,
                  { color: colors.text, letterSpacing: 1 },
                ]}
              >
                TOTAL SPENT
              </Text>
              <Text
                style={[
                  textStyles.headline_lg,
                  { color: "#FFFFFF", marginTop: 2 },
                ]}
              >
                {formatAmount(currentTotal)}
              </Text>
              <View
                style={{
                  marginTop: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: changeColorBackground,
                  borderRadius: 9999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                {change !== null ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <AntDesign
                      name={triangleName}
                      size={10}
                      color={changeColor}
                    />
                    <Text style={[textStyles.label_sm, { color: changeColor }]}>
                      {formatPercent(change)}
                    </Text>
                  </View>
                ) : null}
                <Text style={[textStyles.label_sm, { color: changeColor }]}>
                  vs last month
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
