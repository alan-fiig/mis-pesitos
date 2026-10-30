import { useEffect, useRef } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { textStyles } from "../theme/typography";
import { colors } from "../theme/colors";

type ToastType = "success" | "error";

interface Props {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onDismiss: (id: string) => void;
}

const CONFIG = {
  success: { iconName: "check-circle" as const, accent: colors.primary },
  error: { iconName: "close-circle" as const, accent: colors.secondary },
} as const;

export function Toast({ id, type, title, message, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-120)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const dismissedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cfg = CONFIG[type];

  const autoHide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -120,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss(id));
    }, 3000);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => autoHide());
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 80) {
          dismissedRef.current = true;
          Animated.timing(translateX, {
            toValue: Math.sign(g.dx) * Dimensions.get("window").width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDismiss(id));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => autoHide());
        }
      },
    }),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    autoHide();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, onDismiss, opacity, translateY]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        backgroundColor: colors.dark_gray,
        borderLeftWidth: 4,
        borderLeftColor: cfg.accent,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name={cfg.iconName} size={22} color={cfg.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[textStyles.label_lg, { color: "white" }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {message ? (
          <Text
            style={[textStyles.body_sm, { color: colors.text, marginTop: 2 }]}
            numberOfLines={2}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}
