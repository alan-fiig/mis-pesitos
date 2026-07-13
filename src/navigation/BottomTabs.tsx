import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DashboardScreen } from "../features/dashboard/screens/DashboardScreen";
import { HistoryScreen } from "../features/history/screens/HistoryScreen";
import { InsightsScreen } from "../features/insights/screens/InsightsScreen";
import { TransactionsScreen } from "../features/transactions/screens/TransactionsScreen";
import { colors } from "../shared/theme/colors";
import { BottomTabParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const iconMap = {
  Dashboard: "wallet-outline",
  History: "time-outline",
  Insights: "bar-chart-outline",
  Transactions: "swap-horizontal-outline",
} as const;

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconMap[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icons,
        tabBarStyle: {
          backgroundColor: colors.dark_gray,
          height: 90,
          paddingTop: 12,
          paddingBottom: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}
