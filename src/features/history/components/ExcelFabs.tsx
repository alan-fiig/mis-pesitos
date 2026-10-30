import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../shared/theme/colors";

export type ExcelAction = "import" | "export";

interface Props {
  busy: ExcelAction | null;
  onImport: () => void;
  onExport: () => void;
}

export function ExcelFabs({ busy, onImport, onExport }: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        right: 20,
        bottom: 16,
        gap: 12,
      }}
    >
      <Fab
        icon="cloud-upload-outline"
        label="Import transactions from Excel"
        background={colors.secondary}
        loading={busy === "import"}
        disabled={busy !== null}
        onPress={onImport}
      />
      <Fab
        icon="cloud-download-outline"
        label="Export transactions to Excel"
        background={colors.primary}
        loading={busy === "export"}
        disabled={busy !== null}
        onPress={onExport}
      />
    </View>
  );
}

function Fab({
  icon,
  label,
  background,
  loading,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  background: string;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel={label}
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled && !loading ? 0.6 : 1,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Ionicons name={icon} size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );
}
