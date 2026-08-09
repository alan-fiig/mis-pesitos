import { Dimensions, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BarChart } from "react-native-gifted-charts";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { useTransactionsStore } from "../../../store/transactionsStore";
import type { Expense } from "../../../types/expense";
import { openMonthHistory } from "../../../shared/utils/historyFilters";

const { width: screenWidth } = Dimensions.get("window");

const Y_AXIS_WIDTH = 35;
const CHART_WIDTH = screenWidth - 80;
const BAR_CHART_WIDTH = CHART_WIDTH - Y_AXIS_WIDTH;
const SIDE_MARGIN = 4;
const ITEM_SPACING = 4;

const MONTH_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

function parseDate(t: Expense): Date {
  return t.date.length === 10
    ? new Date(t.date + "T00:00:00")
    : new Date(t.date);
}

export default function InsightCard() {
  const navigation = useNavigation<any>();
  const transactions = useTransactionsStore((s) => s.transactions);
  const year = new Date().getFullYear();

  const monthly = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));

  for (const t of transactions) {
    const d = parseDate(t);
    if (d.getFullYear() !== year) continue;
    const totals = monthly[d.getMonth()];
    if (t.type === "income") {
      totals.income += t.amount;
    } else if (t.type === "expense") {
      totals.expense += t.amount;
    }
  }

  const monthsWithData = monthly
    .map((totals, m) => ({ ...totals, month: m }))
    .filter(({ income, expense }) => income > 0 || expense > 0);

  const N = monthsWithData.length * 2;
  const barWidth =
    N > 0
      ? (BAR_CHART_WIDTH - 2 * SIDE_MARGIN - (N - 1) * ITEM_SPACING) / N
      : 0;
  const labelShift = (barWidth + ITEM_SPACING) / 2;

  const openMonthHistoryPress = (type: "income" | "expense", month: number) => {
    const ym = `${year}-${String(month + 1).padStart(2, "0")}`;
    openMonthHistory(navigation, ym, type);
  };

  const data = monthsWithData.flatMap(({ income, expense, month }) => [
    {
      value: income,
      frontColor: colors.primary,
      labelComponent: () => (
        <Text
          style={{
            width: barWidth + ITEM_SPACING,
            textAlign: "center",
            color: colors.text,
            fontSize: 10,
            transform: [{ translateX: labelShift }],
          }}
        >
          {MONTH_LABELS[month]}
        </Text>
      ),
      onPress: () => openMonthHistoryPress("income", month),
    },
    {
      value: expense,
      frontColor: colors.tertiary,
      onPress: () => openMonthHistoryPress("expense", month),
    },
  ]);

  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 5,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          Income vs Expenses
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <FontAwesome name="circle" size={12} color={colors.primary} />
          <Text style={[textStyles.label_sm, { color: colors.text }]}>
            Income
          </Text>
          <FontAwesome name="circle" size={12} color={colors.tertiary} />
          <Text style={[textStyles.label_sm, { color: colors.text }]}>
            Expenses
          </Text>
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={[textStyles.label_md, { color: colors.text }]}>
          No data for {year}
        </Text>
      ) : (
        <BarChart
          data={data}
          width={BAR_CHART_WIDTH}
          yAxisLabelWidth={Y_AXIS_WIDTH}
          height={155}
          barWidth={barWidth}
          spacing={ITEM_SPACING}
          initialSpacing={SIDE_MARGIN}
          endSpacing={SIDE_MARGIN}
          barBorderRadius={6}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={colors.light__gray}
          yAxisColor={colors.light__gray}
          yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.text, fontSize: 10 }}
          rulesColor={colors.light__gray}
          backgroundColor="transparent"
        />
      )}
    </View>
  );
}
