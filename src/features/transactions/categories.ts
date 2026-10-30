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
  {
    label: "Cashback",
    iconFamily: "MaterialCommunityIcons",
    icon: "cash-check",
  },
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
  { label: "Coffee", iconFamily: "FontAwesome", icon: "coffee" },
  {
    label: "Internet",
    iconFamily: "MaterialCommunityIcons",
    icon: "access-point-network",
  },
  { label: "House", iconFamily: "MaterialIcons", icon: "house" },
  { label: "Hobbies", iconFamily: "Ionicons", icon: "game-controller" },
  { label: "Transport", iconFamily: "FontAwesome", icon: "bus" },
  { label: "Subscription", iconFamily: "AntDesign", icon: "play-circle" },
  { label: "Grocery", iconFamily: "Ionicons", icon: "storefront" },
  { label: "Snacks", iconFamily: "MaterialCommunityIcons", icon: "popcorn" },
  { label: "Clothes", iconFamily: "Ionicons", icon: "shirt" },
  { label: "Gift", iconFamily: "Ionicons", icon: "gift" },
  { label: "Car", iconFamily: "Ionicons", icon: "car" },
  { label: "Phone", iconFamily: "AntDesign", icon: "phone" },
  { label: "Technology", iconFamily: "MaterialIcons", icon: "computer" },
  { label: "Motel", iconFamily: "MaterialIcons", icon: "hotel" },
  { label: "Health", iconFamily: "AntDesign", icon: "heart" },
  { label: "Other", iconFamily: "AntDesign", icon: "question-circle" },
];
