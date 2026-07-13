import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { initDatabase } from "./src/features/transactions/services/database";
import { useTransactionsStore } from "./src/store/transactionsStore";
import { ToastProvider } from "./src/shared/context/ToastContext";
import { colors } from "./src/shared/theme/colors";

export default function App() {
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function boot() {
      try {
        await initDatabase();
        await useTransactionsStore.getState().loadTransactions();
      } catch (e) {
        console.error("[app] initialization error:", e);
        setInitError((e as Error).message);
      } finally {
        setReady(true);
      }
    }
    boot();
  }, []);

  if (!ready) return null;

  if (initError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: colors.secondary, fontSize: 16 }}>
          Database error: {initError}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
