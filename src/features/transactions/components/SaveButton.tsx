import { TouchableOpacity, Text } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  onPress: () => void;
  disabled: boolean;
  label?: string;
}

export function SaveButton({ onPress, disabled, label = "Save transaction" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.light__gray : colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={[
          textStyles.label_lg,
          { color: "#121212" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
