import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactionsStore } from "../../../store/transactionsStore";
import { TransactionTypeSelector } from "../components/TransactionTypeSelector";
import { AmountInput } from "../components/AmountInput";
import { CategorySelector } from "../components/CategorySelector";
import { DatePickerField } from "../components/DatePickerField";
import { NoteInput } from "../components/NoteInput";
import { NameInput } from "../components/NameInput";
import { SaveButton } from "../components/SaveButton";
import TittleTransaction from "../components/TittleTransaction";

export function TransactionsScreen() {
  const navigation = useNavigation<any>();
  const setEditingTransaction = useTransactionsStore((s) => s.setEditingTransaction);
  const { fields, errors, updateField, submit, isEditing } = useTransactionForm();

  const handleCancel = () => {
    setEditingTransaction(null);
    navigation.navigate("History");
  };

  const handleSubmit = async () => {
    const wasEditing = await submit();
    if (wasEditing) {
      navigation.navigate("History");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginVertical: 30 }}>
        <View>
          <TittleTransaction
            title={isEditing ? "Edit Transaction" : "New Transaction"}
            isEditing={isEditing}
            onCancel={handleCancel}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TransactionTypeSelector
            value={fields.type}
            onChange={(type) => updateField("type", type)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <AmountInput
            value={fields.amount}
            onChange={(amount) => updateField("amount", amount)}
            error={errors.amount}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <CategorySelector
            type={fields.type}
            value={fields.category}
            onChange={(category) => updateField("category", category)}
            error={errors.category}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <NameInput
            value={fields.name}
            onChange={(name) => updateField("name", name)}
            error={errors.name}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <DatePickerField
            value={fields.date}
            onChange={(date) => updateField("date", date)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <NoteInput
            value={fields.note}
            onChange={(note) => updateField("note", note)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <SaveButton
            onPress={handleSubmit}
            disabled={false}
            label={isEditing ? "Update transaction" : "Save transaction"}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
