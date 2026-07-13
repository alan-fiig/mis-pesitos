import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../shared/theme/colors";

export type TypeFilter = "all" | "income" | "expense";

interface Props {
  active: TypeFilter;
  onChange: (f: TypeFilter) => void;
}

const chips: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expenses" },
];

export function FilterChips({ active, onChange }: Props) {
  return (
    <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
      {chips.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            style={{
              backgroundColor: isActive ? colors.primary : colors.dark_gray,
              borderRadius: 9999,
              paddingHorizontal: 20,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                color: isActive ? "#fff" : colors.text,
                fontWeight: "600",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
