import { View, TextInput, Text } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function formatAmount(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 2) return `${intPart}.${parts.slice(1).join("")}`;
  if (parts.length === 2) return `${intPart}.${parts[1]}`;
  return intPart;
}

export function parseAmount(formatted: string): string {
  return formatted.replace(/,/g, "");
}

export function AmountInput({ value, onChange, error }: Props) {
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignSelf: "center",
          paddingVertical: 20,
        }}
      >
        <Text
          style={[
            textStyles.headline_lg,
            { color: colors.primary, marginRight: 12 },
          ]}
        >
          $
        </Text>
        <TextInput
          value={value}
          onChangeText={(text) => onChange(formatAmount(text))}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={colors.light__gray}
          style={[
            textStyles.headline_lg,
            {
              color: "white",
              textAlign: "center",
              paddingLeft: 28,
            },
          ]}
        />
      </View>
      {error && (
        <Text
          style={[
            textStyles.label_md,
            { color: colors.secondary, marginTop: 6 },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
