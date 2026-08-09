import React, { useEffect, useMemo, useState } from "react";
import { View, Text, SectionList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../../shared/theme/colors";
import { textStyles } from "../../../shared/theme/typography";
import { useTransactionsStore } from "../../../store/transactionsStore";
import { useToast } from "../../../shared/context/ToastContext";
import { TransactionCard } from "../../../shared/components/TransactionCard";
import { TransactionDetailModal } from "../../../shared/components/TransactionDetailModal";
import { formatDateHeader } from "../../../shared/utils/transactions";
import { SearchBar } from "../components/SearchBar";
import { FilterChips } from "../components/FilterChips";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { AdvancedFiltersModal, type HistoryFilters } from "../components/AdvancedFiltersModal";
import type { Expense } from "../../../types/expense";
import type { TypeFilter } from "../components/FilterChips";

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const transactions = useTransactionsStore((s) => s.transactions);
  const loadTransactions = useTransactionsStore((s) => s.loadTransactions);
  const removeTransaction = useTransactionsStore((s) => s.removeTransaction);
  const setEditingTransaction = useTransactionsStore((s) => s.setEditingTransaction);
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({ categories: [] });
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);

  const handleEdit = (t: Expense) => {
    setEditingTransaction(t);
    navigation.navigate("Transactions");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await removeTransaction(deleteTarget.id);
      showToast({ type: "success", title: "Deleted" });
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to delete" });
    }
    setDeleteTarget(null);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const params = route.params as
      | { filters?: HistoryFilters; type?: TypeFilter }
      | undefined;
    if (params?.filters) {
      setFilters(params.filters);
    }
    if (params?.type) {
      setTypeFilter(params.type);
    }
    if (params?.filters || params?.type) {
      navigation.setParams({ filters: undefined, type: undefined });
    }
  }, [route.params]);

  const filteredTransactions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let filtered = transactions.filter((t) => t.date <= today);
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((t) => t.date.slice(0, 7) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => t.date.slice(0, 7) <= filters.dateTo!);
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter((t) => filters.categories.includes(t.category));
    }
    if (filters.minAmount != null) {
      filtered = filtered.filter((t) => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount != null) {
      filtered = filtered.filter((t) => t.amount <= filters.maxAmount!);
    }
    return filtered;
  }, [transactions, searchQuery, typeFilter, filters]);

  const sections = useMemo(() => {
    const map = new Map<string, typeof filteredTransactions>();
    for (const t of filteredTransactions) {
      const key = t.date.slice(0, 10);
      const group = map.get(key);
      if (group) {
        group.push(t);
      } else {
        map.set(key, [t]);
      }
    }
    const sorted = [...map.entries()].sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
    );
    return sorted.map(([key, data]) => ({
      title: formatDateHeader(key),
      data,
    }));
  }, [filteredTransactions]);

  const hasActiveFilters =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    filters.categories.length > 0 ||
    filters.minAmount != null ||
    filters.maxAmount != null;

  const filtersSection = (
    <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPressFilters={() => setFiltersVisible(true)}
        hasActiveFilters={hasActiveFilters}
      />
      <FilterChips active={typeFilter} onChange={setTypeFilter} />
    </View>
  );

  if (transactions.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {filtersSection}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={[textStyles.body_md, { color: colors.text }]}>
            No transactions yet
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {filtersSection}

        {filteredTransactions.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={[textStyles.body_md, { color: colors.text }]}>
              No transactions match your search
            </Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={[
                  textStyles.label_lg,
                  { color: colors.text, marginTop: 12, marginBottom: 12 },
                ]}
              >
                {title}
              </Text>
            )}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 8 }}>
                <TransactionCard
                  transaction={item}
                  showDate={false}
                  onPress={() => setSelectedTransaction(item)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => setDeleteTarget(item)}
                />
              </View>
            )}
          />
        )}
      </View>

      <ConfirmDeleteModal
        visible={deleteTarget !== null}
        transactionName={deleteTarget?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <AdvancedFiltersModal
        visible={filtersVisible}
        initialFilters={filters}
        onClose={() => setFiltersVisible(false)}
        onApply={(f) => setFilters(f)}
      />

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}
