import type { HistoryFilters } from "../features/history/components/AdvancedFiltersModal";
import type { TypeFilter } from "../features/history/components/FilterChips";

export type BottomTabParamList = {
  Dashboard: undefined;
  History: { filters?: HistoryFilters; type?: TypeFilter } | undefined;
  Insights: undefined;
  Transactions: undefined;
};
