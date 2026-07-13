export type TransactionType = "income" | "expense";
export type IconFamily =
  | "AntDesign"
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Ionicons"
  | "FontAwesome";

export interface Category {
  label: string;
  iconFamily: IconFamily;
  icon: string;
}

export const INCOME_CATEGORIES: Category[] = [
  { label: "Salary", iconFamily: "AntDesign", icon: "wallet" },
  { label: "Freelance", iconFamily: "AntDesign", icon: "laptop" },
];

export const EXPENSE_CATEGORIES: Category[] = [
  {
    label: "Food",
    iconFamily: "MaterialCommunityIcons",
    icon: "food-fork-drink",
  },
  { label: "Gas", iconFamily: "MaterialCommunityIcons", icon: "gas-station" },
  { label: "Supermarket", iconFamily: "AntDesign", icon: "shopping-cart" },
  { label: "Cinema", iconFamily: "MaterialIcons", icon: "theaters" },
  {
    label: "Internet",
    iconFamily: "MaterialCommunityIcons",
    icon: "access-point-network",
  },
  { label: "House", iconFamily: "MaterialIcons", icon: "house" },
  { label: "Pleasure", iconFamily: "AntDesign", icon: "heart" },
  { label: "Transport", iconFamily: "AntDesign", icon: "car" },
  { label: "Subscription", iconFamily: "AntDesign", icon: "play-circle" },
  { label: "Clothes", iconFamily: "Ionicons", icon: "shirt" },
  { label: "Gift", iconFamily: "Ionicons", icon: "gift" },
  { label: "Motel", iconFamily: "MaterialIcons", icon: "hotel" },
  { label: "Other", iconFamily: "AntDesign", icon: "question-circle" },
];
