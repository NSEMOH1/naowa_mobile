import { useEffect } from "react";
import { useLoanBalanceStore } from "@/store/loan";

export const useLoanBalances = (autoFetch = true) => {
  const {
    loans,
    summary,
    categories,
    loading,
    error,
    fetchLoanBalances,
    getChartData,
    getCollectedAmount,
  } = useLoanBalanceStore();

  // useEffect(() => {
  //   if (autoFetch) {
  //     fetchLoanBalances();
  //   }
  // }, [autoFetch, fetchLoanBalances]);

  return {
    loans,
    summary,
    categories,
    chartData: getChartData,
    getCollectedAmount,
    loading,
    error,
    refetch: fetchLoanBalances,
  };
};
