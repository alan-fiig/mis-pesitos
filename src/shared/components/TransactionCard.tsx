import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import type { Expense } from "../../types/expense";
import { textStyles } from "../theme/typography";
import { colors } from "../theme/colors";
import { ICON_SETS, getCategoryIcon, formatDate, formatAmount } from "../utils/transactions";

interface Props {
  transaction: Expense;
  showDate?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({ transaction: t, showDate = true, onPress, onEdit, onDelete }: Props) {
  const { iconFamily, icon } = getCategoryIcon(t.category, t.type);
  const IconComponent = ICON_SETS[iconFamily as keyof typeof ICON_SETS];
  const iconColor = t.type === "income" ? colors.primary : colors.secondary;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.7}>
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        gap: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: colors.light__gray,
          borderRadius: 9999,
          padding: 10,
          width: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent
          name={icon as keyof typeof IconComponent.glyphMap}
          size={24}
          color={iconColor}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: colors.text }}>
          {t.name || t.category}
        </Text>
        <Text style={{ color: colors.text }}>
          {t.category}{showDate ? ` • ${formatDate(t.date)}` : ""}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text style={[textStyles.label_md, { color: iconColor }]}>
          {formatAmount(t.amount, t.type)}
        </Text>

        {onEdit && onDelete && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            <TouchableOpacity onPress={onEdit}>
              <AntDesign name="edit" size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <AntDesign name="delete" size={18} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
    </TouchableOpacity>
  );
}
