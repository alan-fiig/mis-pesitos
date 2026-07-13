import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  title?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function TittleTransaction({ title = "New Transaction", isEditing, onCancel }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
      }}
    >
      {isEditing && (
        <TouchableOpacity
          onPress={onCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            position: "absolute",
            right: 0,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.light__gray,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="close" size={18} color={colors.text} />
        </TouchableOpacity>
      )}
      <Text style={[textStyles.headline_md, { color: "white" }]}>
        {title}
      </Text>
    </View>
  );
}
