import { TextStyle } from "react-native";

export const textStyles: Record<string, TextStyle> = {
  display_lg: {
    fontSize: 45,
    fontWeight: "700",
    lineHeight: 48,
    letterSpacing: 2,
  },

  headline_lg: {
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 40,
    letterSpacing: -0.01,
  },

  headline_md: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },

  headline_sm: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: 2,
  },

  body_lg: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
  },

  body_md: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },

  body_sm: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },

  label_lg: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },

  label_md: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
  },

  label_sm: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 12,
  },
};
