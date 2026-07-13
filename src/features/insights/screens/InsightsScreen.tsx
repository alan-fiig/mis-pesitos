import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../shared/theme/colors";

export function InsightsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors["on-background"], fontSize: 20 }}>Insights</Text>
    </View>
  );
}
