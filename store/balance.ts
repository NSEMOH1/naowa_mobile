import { create } from "zustand";
import api from "@/constants/api";

interface Balance {
  id: string;
  loan_balance: number;
  savings_balance: number;
}

interface BalanceState {
  balance: Balance | null;
  fetchBalance: () => Promise<void>;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  fetchBalance: async () => {
    try {
      const response = await api.get("/api/balances");
      set({ balance: response.data });
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  },
}));
