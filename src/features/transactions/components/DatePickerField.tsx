import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function DatePickerField({ value, onChange }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          backgroundColor: colors.dark_gray,
          borderRadius: 16,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <AntDesign name="calendar" size={22} color={colors.primary} />
          <Text style={[textStyles.label_lg, { color: colors.text }]}>
            {formatDate(value)}
          </Text>
        </View>
        <AntDesign name="down" size={16} color={colors.text} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
