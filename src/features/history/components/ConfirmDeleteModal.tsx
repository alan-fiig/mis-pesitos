import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";

interface Props {
  visible: boolean;
  transactionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ visible, transactionName, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}
        onPress={onCancel}
      >
        <Pressable
          style={{
            backgroundColor: colors.dark_gray,
            borderRadius: 16,
            padding: 24,
            width: "80%",
            maxWidth: 320,
          }}
          onPress={() => {}}
        >
          <Text style={[textStyles.label_lg, { color: "white", marginBottom: 12 }]}>
            Delete transaction
          </Text>
          <Text style={[textStyles.body_md, { color: colors.text, marginBottom: 24 }]}>
            Are you sure you want to delete "{transactionName}"?
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: colors.light__gray,
              }}
            >
              <Text style={[textStyles.label_md, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: colors.secondary,
              }}
            >
              <Text style={[textStyles.label_md, { color: "#121212" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}