import { create } from "zustand";
import api from "@/constants/api";
import { LoanBalanceState } from "@/types";

export const useLoanBalanceStore = create<LoanBalanceState>((set, get) => ({
  loans: [],
  summary: {
    totalOutstanding: 0,
    totalPaid: 0,
    activeLoans: 0,
    completedLoans: 0,
    defaultedLoans: 0,
  },
  categories: [],
  loading: false,
  error: null,

  fetchLoanBalances: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/loan/balances`);
      set({
        loans: response.data.data.loans,
        summary: response.data.data.summary,
        categories: response.data.data.categories,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch loan balances",
        loading: false,
      });
    }
  },

  getLoanById: (loanId) => {
    return get().loans.find((loan) => loan.loanId === loanId);
  },

  getCategoryById: (categoryId) => {
    return get().categories.find(
      (category) => category.categoryId === categoryId
    );
  },
  getCollectedAmount: (categoryName: string) => {
    const category = get().categories.find(
      (c) => c.categoryName === categoryName
    );
    return category ? category.collectedAmount : 0;
  },
  getMaxAmount: (categoryName: string) => {
    const category = get().categories.find(
      (c) => c.categoryName === categoryName
    );
    return category ? category.maxAmount : 0;
  },
  getRemainingAmount: (categoryName: string) => {
    const category = get().categories.find(
      (c) => c.categoryName === categoryName
    );
    return category ? category.remainingAmount : 0;
  },

  getChartData: () => {
    const { categories } = get();
    return categories.map((category) => ({
      id: category.categoryId,
      name:
        category.categoryName === "HOME"
          ? "HOME APPLIANCES"
          : category.categoryName,
      amount: `₦${category.maxAmount.toLocaleString()}`,
      collected: category.collectedAmount,
      percentage: category.percentageCollected,
    }));
  },
}));
