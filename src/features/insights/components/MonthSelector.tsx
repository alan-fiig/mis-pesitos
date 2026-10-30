import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import type { YearMonth } from "../hooks/useMonthlyExpenses";

interface Props {
  months: YearMonth[];
  value: YearMonth;
  onChange: (month: YearMonth) => void;
}

function monthLabel({ y, m }: YearMonth): string {
  return new Date(y, m - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function MonthSelector({ months, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const isSelected = (month: YearMonth) =>
    month.y === value.y && month.m === value.m;

  return (
    <View style={{ alignSelf: "flex-end" }}>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.dark_gray,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={[textStyles.label_md, { color: colors.text }]}>
          {monthLabel(value)}
        </Text>
        <AntDesign name="down" size={12} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            paddingHorizontal: 40,
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.dark_gray,
              borderRadius: 16,
              padding: 8,
              maxHeight: 400,
            }}
            onPress={() => {}}
          >
            <ScrollView>
              {months.map((month) => (
                <TouchableOpacity
                  key={`${month.y}-${month.m}`}
                  onPress={() => {
                    onChange(month);
                    setOpen(false);
                  }}
                  style={{
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: isSelected(month)
                      ? colors.primary
                      : "transparent",
                  }}
                >
                  <Text
                    style={[
                      textStyles.label_md,
                      {
                        color: isSelected(month)
                          ? colors.background
                          : colors.text,
                        fontWeight: isSelected(month) ? "700" : "500",
                      },
                    ]}
                  >
                    {monthLabel(month)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
