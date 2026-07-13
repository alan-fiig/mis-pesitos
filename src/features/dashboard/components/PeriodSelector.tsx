import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

const options = ["Daily", "Weekly", "Monthly"];
const { width: windowWidth } = Dimensions.get("window");

export default function InsightCard() {
  const [selected, setSelected] = useState("Monthly");
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [menuRight, setMenuRight] = useState(0);
  const buttonRef = useRef<View>(null);

  const handleOpen = () => {
    buttonRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setMenuTop(y + height + 4);
        setMenuRight(windowWidth - x - width);
        setOpen(true);
      },
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[textStyles.label_lg, { color: colors.text }]}>
          This month's summary
        </Text>
        <TouchableOpacity
          ref={buttonRef}
          onPress={handleOpen}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: colors.dark_gray,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text style={[textStyles.label_md, { color: colors.text }]}>
            {selected}
          </Text>
          <Entypo name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="none">
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
          <View
            style={{
              position: "absolute",
              top: menuTop,
              right: menuRight,
              minWidth: 160,
              backgroundColor: colors.dark_gray,
              borderRadius: 16,
              padding: 8,
            }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor:
                    selected === option ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={[
                    textStyles.label_md,
                    {
                      color: selected === option ? "#121212" : colors.text,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
