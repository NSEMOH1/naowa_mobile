import { useEffect } from "react";
import { useBalanceStore } from "@/store/balance";

export const useBalances = () => {
  const { balance, fetchBalance } = useBalanceStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance;
};
