import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { colors } from "../shared/theme/colors";
import { BottomTabs } from "./BottomTabs";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <BottomTabs />
    </NavigationContainer>
  );
}
