import { View, TextInput, Text } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function NameInput({ value, onChange, error }: Props) {
  return (
    <View>
      <View
        style={{
          backgroundColor: colors.dark_gray,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Transaction name"
          placeholderTextColor={colors.light__gray}
          style={[textStyles.label_lg, { color: colors.text }]}
        />
      </View>
      {error ? (
        <Text
          style={[
            textStyles.body_sm,
            { color: colors.secondary, marginTop: 6 },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
