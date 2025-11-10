import { useEffect } from "react";
import { useSavingsBalanceStore } from "@/store/savings";

export const useSavingsBalance = (autoFetch = true) => {
  const { balance, loading, error, fetchSavingsBalance } =
    useSavingsBalanceStore();

  useEffect(() => {
    if (autoFetch && !balance && !loading) {
      const timer = setTimeout(() => {
        fetchSavingsBalance();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoFetch, balance, loading, fetchSavingsBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchSavingsBalance,
  };
};
