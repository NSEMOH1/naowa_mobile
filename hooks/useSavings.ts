import { useEffect } from "react";
import { useSavingsBalanceStore } from "@/store/savings";

export const useSavingsBalance = (autoFetch = true) => {
 const { balance, loading, error, fetchSavingsBalance } = 
  useSavingsBalanceStore();

useEffect(() => {
  if (autoFetch && !loading) {
    const timer = setTimeout(() => {
      fetchSavingsBalance();
    }, 100);

    return () => clearTimeout(timer);
  }
}, [autoFetch, fetchSavingsBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchSavingsBalance,
  };
};
