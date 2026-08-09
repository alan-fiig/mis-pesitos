import { useMemo } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import type { Expense } from "../../types/expense";
import { useTransactionsStore } from "../../store/transactionsStore";
import { textStyles } from "../theme/typography";
import { colors } from "../theme/colors";
import {
  ICON_SETS,
  getCategoryIcon,
  formatDate,
  formatAmount,
} from "../utils/transactions";

interface Props {
  visible: boolean;
  transaction: Expense | null;
  onClose: () => void;
}

function DetailRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={[textStyles.body_md, { color: colors.text }]}>{label}</Text>
      <Text style={[textStyles.label_md, { color: valueColor ?? "white" }]}>
        {value}
      </Text>
    </View>
  );
}

export function TransactionDetailModal({
  visible,
  transaction: t,
  onClose,
}: Props) {
  const transactions = useTransactionsStore((s) => s.transactions);

  const installments = useMemo(() => {
    if (!t?.installment_group) return [];
    return transactions
      .filter((tx) => tx.installment_group === t.installment_group)
      .sort((a, b) => (a.installment_index ?? 0) - (b.installment_index ?? 0));
  }, [transactions, t]);

  if (!t) return null;

  const { iconFamily, icon } = getCategoryIcon(t.category, t.type);
  const IconComponent = ICON_SETS[iconFamily as keyof typeof ICON_SETS];
  const iconColor = t.type === "income" ? colors.primary : colors.secondary;
  const typeLabel = t.type === "income" ? "Income" : "Expense";

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{ flex: 1 }}>
        <Pressable
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          ]}
          onPress={onClose}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
            backgroundColor: colors.dark_gray,
            borderRadius: 16,
            padding: 24,
            width: "80%",
            maxWidth: 360,
          }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: colors.light__gray,
                  borderRadius: 9999,
                  padding: 16,
                  width: 64,
                  height: 64,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <IconComponent
                  name={icon as keyof typeof IconComponent.glyphMap}
                  size={32}
                  color={iconColor}
                />
              </View>

              <Text
                style={[
                  textStyles.headline_lg,
                  { color: "white", textAlign: "center" },
                ]}
              >
                {t.name || t.category}
              </Text>

              <Text
                style={[
                  textStyles.body_md,
                  { color: colors.text, marginTop: 4 },
                ]}
              >
                {typeLabel}
              </Text>
            </View>

            <View style={{ gap: 12, marginBottom: 24 }}>
              <DetailRow
                label="Amount"
                value={formatAmount(t.amount, t.type)}
                valueColor={iconColor}
              />
              <DetailRow label="Category" value={t.category} />
              <DetailRow label="Date" value={formatDate(t.date)} />
            </View>

            {installments.length > 0 ? (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={[
                    textStyles.body_md,
                    { color: colors.text, marginBottom: 8 },
                  ]}
                >
                  Months
                </Text>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  <View style={{ gap: 6 }}>
                  {installments.map((inst) => {
                    const isCurrent = inst.id === t.id;
                    return (
                      <View
                        key={inst.id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: isCurrent
                            ? colors.light__gray
                            : "transparent",
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          gap: 10,
                        }}
                      >
                        <Text
                          style={[
                            textStyles.label_md,
                            {
                              color: isCurrent ? "white" : colors.text,
                              width: 20,
                            },
                          ]}
                        >
                          {inst.installment_index}
                        </Text>
                        <Text
                          style={[
                            textStyles.body_md,
                            {
                              color: isCurrent ? "white" : colors.text,
                              flex: 1,
                            },
                          ]}
                        >
                          {formatDate(inst.date)}
                        </Text>
                        <Text
                          style={[
                            textStyles.label_md,
                            {
                              color: isCurrent
                                ? colors.secondary
                                : colors.text,
                            },
                          ]}
                        >
                          {formatAmount(inst.amount, inst.type)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                </ScrollView>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    paddingTop: 8,
                    paddingHorizontal: 10,
                    borderTopWidth: 1,
                    borderTopColor: colors.light__gray,
                    gap: 10,
                  }}
                >
                  <Text
                    style={[textStyles.label_md, { color: "white", width: 20 }]}
                  ></Text>
                  <Text
                    style={[textStyles.body_md, { color: "white", flex: 1 }]}
                  ></Text>
                  <Text style={[textStyles.label_md, { color: iconColor }]}>
                    {formatAmount(
                      installments.reduce((sum, inst) => sum + inst.amount, 0),
                      t.type,
                    )}
                  </Text>
                </View>
              </View>
            ) : null}

            {t.description ? (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={[
                    textStyles.body_md,
                    { color: colors.text, marginBottom: 8 },
                  ]}
                >
                  Note
                </Text>
                <Text style={[textStyles.body_md, { color: "white" }]}>
                  {t.description}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onClose}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: colors.light__gray,
              }}
            >
              <Text style={[textStyles.label_md, { color: colors.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
