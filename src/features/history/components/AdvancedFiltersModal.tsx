import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { textStyles } from "../../../shared/theme/typography";
import { colors } from "../../../shared/theme/colors";
import { formatAmount, parseAmount } from "../../transactions/components/AmountInput";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type Category,
  type IconFamily,
} from "../../transactions/categories";

export interface HistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  categories: string[];
  minAmount?: number;
  maxAmount?: number;
}

interface Props {
  visible: boolean;
  initialFilters: HistoryFilters;
  onClose: () => void;
  onApply: (filters: HistoryFilters) => void;
}

const { height: screenHeight } = Dimensions.get("window");

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ALL_CATEGORIES: Category[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
].filter(
  (cat, index, self) => self.findIndex((c) => c.label === cat.label) === index,
);

const MAX_VISIBLE_CATEGORIES = 5;

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
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
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

function MonthPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (ym?: string) => void;
}) {
  const [year, setYear] = useState(() => {
    if (value) return Number(value.slice(0, 4));
    return new Date().getFullYear();
  });

  useEffect(() => {
    if (value) setYear(Number(value.slice(0, 4)));
  }, [value]);

  const formatYearMonth = (y: number, m: number) =>
    `${y}-${String(m).padStart(2, "0")}`;

  return (
    <View
      style={{
        backgroundColor: colors.dark_gray,
        borderRadius: 16,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => setYear((y) => y - 1)}
          style={{ padding: 4 }}
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[textStyles.label_md, { color: colors.text, fontWeight: "700" }]}>
          {year}
        </Text>
        <TouchableOpacity
          onPress={() => setYear((y) => y + 1)}
          style={{ padding: 4 }}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
        {MONTHS.map((month, index) => {
          const monthNum = index + 1;
          const ym = formatYearMonth(year, monthNum);
          const isSelected = value === ym;
          return (
            <TouchableOpacity
              key={month}
              onPress={() => onChange(isSelected ? undefined : ym)}
              style={{
                width: "25%",
                paddingVertical: 8,
                marginVertical: 2,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: isSelected ? colors.primary : colors.light__gray,
              }}
            >
              <Text
                style={[
                  textStyles.label_sm,
                  { color: isSelected ? "#fff" : colors.text },
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function AdvancedFiltersModal({ visible, initialFilters, onClose, onApply }: Props) {
  const [dateFrom, setDateFrom] = useState<string | undefined>(initialFilters.dateFrom);
  const [dateTo, setDateTo] = useState<string | undefined>(initialFilters.dateTo);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [minAmount, setMinAmount] = useState(
    initialFilters.minAmount != null ? formatAmount(String(initialFilters.minAmount)) : "",
  );
  const [maxAmount, setMaxAmount] = useState(
    initialFilters.maxAmount != null ? formatAmount(String(initialFilters.maxAmount)) : "",
  );

  const translateY = useRef(new Animated.Value(-screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setDateFrom(initialFilters.dateFrom);
      setDateTo(initialFilters.dateTo);
      setSelectedCategories(initialFilters.categories);
      setMinAmount(
        initialFilters.minAmount != null ? formatAmount(String(initialFilters.minAmount)) : "",
      );
      setMaxAmount(
        initialFilters.maxAmount != null ? formatAmount(String(initialFilters.maxAmount)) : "",
      );
      translateY.setValue(-screenHeight);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  const handleClear = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedCategories([]);
    setMinAmount("");
    setMaxAmount("");
  };

  const handleApply = () => {
    const min = parseAmount(minAmount);
    const max = parseAmount(maxAmount);
    onApply({
      dateFrom,
      dateTo,
      categories: selectedCategories,
      minAmount: min ? Number(min) : undefined,
      maxAmount: max ? Number(max) : undefined,
    });
    onClose();
  };

  const hasActiveFilters =
    !!dateFrom ||
    !!dateTo ||
    selectedCategories.length > 0 ||
    minAmount !== "" ||
    maxAmount !== "";

  const visibleCategories = categoriesExpanded
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, MAX_VISIBLE_CATEGORIES);

  const hasMore = ALL_CATEGORIES.length > MAX_VISIBLE_CATEGORIES;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} onPress={onClose}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            opacity,
            backgroundColor: colors.background,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
            paddingTop: 12,
            maxHeight: "85%",
          }}
        >
          <Pressable onPress={() => {}}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text style={[textStyles.headline_md, { color: colors.text }]}>
                Advanced Filters
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.dark_gray,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[textStyles.label_lg, { color: colors.text, marginBottom: 10 }]}>
                Date
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[textStyles.label_sm, { color: colors.text, marginBottom: 6 }]}>
                    From
                  </Text>
                  <MonthPicker value={dateFrom} onChange={setDateFrom} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[textStyles.label_sm, { color: colors.text, marginBottom: 6 }]}>
                    To
                  </Text>
                  <MonthPicker value={dateTo} onChange={setDateTo} />
                </View>
              </View>

              <Text style={[textStyles.label_lg, { color: colors.text, marginTop: 24, marginBottom: 10 }]}>
                Categories
              </Text>
              <Text style={[textStyles.body_sm, { color: colors.text, marginBottom: 10 }]}>
                {selectedCategories.length === 0
                  ? "Showing all categories"
                  : `${selectedCategories.length} selected`}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {visibleCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.label);
                  return (
                    <TouchableOpacity
                      key={cat.label}
                      onPress={() => toggleCategory(cat.label)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: isSelected ? colors.primary : colors.dark_gray,
                        borderRadius: 9999,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                      }}
                    >
                      <IconRenderer
                        family={cat.iconFamily}
                        name={cat.icon}
                        size={16}
                        color={isSelected ? "#fff" : colors.text}
                      />
                      <Text
                        style={[
                          textStyles.label_md,
                          { color: isSelected ? "#fff" : colors.text },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {hasMore && (
                  <TouchableOpacity
                    onPress={() => setCategoriesExpanded((prev) => !prev)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: colors.dark_gray,
                      borderRadius: 9999,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}
                  >
                    <AntDesign
                      name={categoriesExpanded ? "arrow-up" : "ellipsis"}
                      size={16}
                      color={colors.text}
                    />
                    <Text style={[textStyles.label_md, { color: colors.text }]}>
                      {categoriesExpanded ? "See less" : "See more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={[textStyles.label_lg, { color: colors.text, marginTop: 24, marginBottom: 10 }]}>
                Amount
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[textStyles.label_sm, { color: colors.text, marginBottom: 6 }]}>
                    Min
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.dark_gray,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                    }}
                  >
                    <Text style={[textStyles.label_lg, { color: colors.primary, marginRight: 6 }]}>
                      $
                    </Text>
                    <TextInput
                      value={minAmount}
                      onChangeText={(text) => setMinAmount(formatAmount(text))}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor={colors.light__gray}
                      style={{
                        flex: 1,
                        color: colors.text,
                        paddingVertical: 12,
                        fontSize: 16,
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[textStyles.label_sm, { color: colors.text, marginBottom: 6 }]}>
                    Max
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.dark_gray,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                    }}
                  >
                    <Text style={[textStyles.label_lg, { color: colors.primary, marginRight: 6 }]}>
                      $
                    </Text>
                    <TextInput
                      value={maxAmount}
                      onChangeText={(text) => setMaxAmount(formatAmount(text))}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor={colors.light__gray}
                      style={{
                        flex: 1,
                        color: colors.text,
                        paddingVertical: 12,
                        fontSize: 16,
                      }}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity
                onPress={handleClear}
                disabled={!hasActiveFilters}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: colors.dark_gray,
                  opacity: hasActiveFilters ? 1 : 0.5,
                }}
              >
                <Text style={[textStyles.label_md, { color: colors.text }]}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: colors.primary,
                }}
              >
                <Text style={[textStyles.label_md, { color: "#fff" }]}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
