import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../shared/theme/colors";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPressFilters: () => void;
  hasActiveFilters: boolean;
}

export function SearchBar({ searchQuery, onSearchChange, onPressFilters, hasActiveFilters }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 40 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.dark_gray,
          borderRadius: 12,
          paddingLeft: 12,
        }}
      >
        <Ionicons name="search" size={20} color={colors.text} />
        <TextInput
          style={{
            flex: 1,
            color: colors.text,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
          placeholder="Search transactions"
          placeholderTextColor={colors.text}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      {/* Este boton debe abrir un modal con filtros de busqueda, como fecha, categoria, monto, etc. */}
      <TouchableOpacity
        onPress={onPressFilters}
        style={{
          backgroundColor: colors.dark_gray,
          borderRadius: 12,
          width: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="tune" size={24} color={colors.text} />
        {hasActiveFilters && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.dark_gray,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
