import { View, TextInput } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function NoteInput({ value, onChange }: Props) {
  return (
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
        placeholder="Add a note (optional)"
        placeholderTextColor={colors.light__gray}
        multiline
        numberOfLines={3}
        style={[
          textStyles.label_lg,
          { color: colors.text, minHeight: 60, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
