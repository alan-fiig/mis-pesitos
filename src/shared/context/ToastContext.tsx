import { createContext, useCallback, useContext, useReducer } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "../components/Toast";

type ToastData = {
  id: string;
  type: "success" | "error";
  title: string;
  message?: string;
};

interface ToastContextValue {
  showToast: (data: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type Action =
  | { type: "ADD"; toast: ToastData }
  | { type: "REMOVE"; id: string };

function reducer(state: ToastData[], action: Action): ToastData[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

function ToastOverlay({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toasts, dispatch] = useReducer(reducer, []);

  const showToast = useCallback((data: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    dispatch({ type: "ADD", toast: { id, ...data } });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastOverlay>{children}</ToastOverlay>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
