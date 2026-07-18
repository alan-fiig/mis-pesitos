import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type TransactionType,
  type Category,
  type IconFamily,
} from "../categories";

interface Props {
  type: TransactionType;
  value: string;
  onChange: (category: string) => void;
  error?: string;
}

const VISIBLE_COUNT = 7;
const { width: screenWidth } = Dimensions.get("window");
const PARENT_H_PADDING = 40;
const ITEM_MARGIN = 4;
const COLS = 4;
const ITEM_WIDTH =
  (screenWidth - PARENT_H_PADDING - ITEM_MARGIN * 2 * COLS) / COLS;

function IconRenderer({
  family,
  name,
  size,
  color,
}: {
  family: IconFamily;
  name: string;
  size: number;
  color: string;
}) {
  switch (family) {
    case "MaterialCommunityIcons":
      return (
        <MaterialCommunityIcons name={name as any} size={size} color={color} />
      );
    case "MaterialIcons":
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case "Ionicons":
      return <Ionicons name={name as any} size={size} color={color} />;
    case "FontAwesome":
      return <FontAwesome name={name as any} size={size} color={color} />;
    default:
      return <AntDesign name={name as any} size={size} color={color} />;
  }
}

function CategoryItem({
  cat,
  selected,
  onPress,
}: {
  cat: Category;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: ITEM_WIDTH,
        alignItems: "center",
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colors.light__gray,
        margin: 4,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: selected ? colors.primary : colors.light__gray,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconRenderer
          family={cat.iconFamily}
          name={cat.icon}
          size={24}
          color="white"
        />
      </View>
      <Text
        style={[
          textStyles.label_sm,
          {
            color: selected ? colors.primary : colors.text,
            marginTop: 4,
          },
        ]}
      >
        {cat.label}
      </Text>
    </TouchableOpacity>
  );
}

function MoreButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: ITEM_WIDTH,
        alignItems: "center",
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colors.light__gray,
        margin: 4,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.light__gray,
          borderWidth: 1,
          borderColor: colors.light__gray,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="ellipsis" size={24} color="white" />
      </View>
      <Text style={[textStyles.label_sm, { color: colors.text, marginTop: 4 }]}>
        More
      </Text>
    </TouchableOpacity>
  );
}

function LessButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: ITEM_WIDTH,
        alignItems: "center",
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colors.light__gray,
        margin: 4,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.light__gray,
          borderWidth: 1,
          borderColor: colors.light__gray,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="arrow-up" size={24} color="white" />
      </View>
      <Text style={[textStyles.label_sm, { color: colors.text, marginTop: 4 }]}>
        Less
      </Text>
    </TouchableOpacity>
  );
}

function AddButton() {
  return (
    <View
      style={{
        width: ITEM_WIDTH,
        alignItems: "center",
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colors.light__gray,
        margin: 4,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.light__gray,
          borderWidth: 1,
          borderColor: colors.light__gray,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="plus" size={24} color="white" />
      </View>
      <Text style={[textStyles.label_sm, { color: colors.text, marginTop: 4 }]}>
        Add
      </Text>
    </View>
  );
}

export function CategorySelector({ type, value, onChange, error }: Props) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [type]);

  const categories: Category[] =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, VISIBLE_COUNT);

  const hasMore = categories.length > VISIBLE_COUNT;

  return (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {visibleCategories.map((cat) => (
          <CategoryItem
            key={cat.label}
            cat={cat}
            selected={value === cat.label}
            onPress={() => onChange(cat.label)}
          />
        ))}
        {!expanded && hasMore && (
          <MoreButton onPress={() => setExpanded(true)} />
        )}
        {expanded && (
          <>
            <AddButton />
            <LessButton onPress={() => setExpanded(false)} />
          </>
        )}
      </View>

      {error && (
        <Text
          style={[
            textStyles.label_md,
            { color: colors.secondary, marginTop: 6 },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
