import { View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

export default function InsightCard() {
  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 20,
        gap: 5,
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

      <View style={{ backgroundColor: colors.light__gray, height: 155 }}></View>
    </View>
  );
}
