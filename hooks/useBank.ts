import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface PaystackBankResponse {
  status: boolean;
  message: string;
  data: Array<{
    id?: string;
    name: string;
    code?: string;
    [key: string]: any;
  }>;
  meta: {
    next?: string;
    previous?: string;
    perPage: number;
    [key: string]: any;
  };
}

const useBanks = (apiKey: string) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchedCursors, setFetchedCursors] = useState<Set<string>>(new Set());

  const fetchBanks = async (
    cursor: string | null = null,
    retryCount: number = 0
  ): Promise<void> => {
    if (cursor && fetchedCursors.has(cursor)) {
      console.log(`Skipping duplicate fetch for cursor: ${cursor}`);
      return;
    }

    let url = `https://api.paystack.co/bank?country=nigeria&perPage=10&use_cursor=true&pay_with_bank=true`;
    if (cursor) {
      url += `&next=${encodeURIComponent(cursor)}`;
    }

    try {
      const response = await axios.get<PaystackBankResponse>(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const newBanks: Bank[] = response.data.data.map((bank, index) => {
        const id = bank.id || `${bank.code || `unknown-${index}`}-${uuidv4()}`;
        console.log(
          `Bank: ${bank.name}, ID: ${id}, Code: ${bank.code || "missing"}`
        );
        return {
          name: bank.name,
          code: bank.code || `unknown-${uuidv4()}`,
          id,
        };
      });

      const meta = response.data.meta;

      console.log(
        `Fetched ${newBanks.length} banks, cursor: ${
          cursor || "initial"
        }, meta:`,
        meta
      );

      setBanks((prevBanks: Bank[]) => {
        const newBankIds = new Set(newBanks.map((bank) => bank.id));
        const filteredPrevBanks = cursor
          ? prevBanks.filter((bank) => !newBankIds.has(bank.id))
          : [];
        return [...filteredPrevBanks, ...newBanks];
      });

      if (cursor) {
        setFetchedCursors((prev) => {
          const newSet = new Set(prev);
          newSet.add(cursor);
          return newSet;
        });
      }

      setNextCursor(meta.next || null);
      setHasMore(!!meta.next && newBanks.length > 0);
      setError("");
    } catch (err: any) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount);
        console.log(
          `Retrying fetch for cursor ${cursor || "initial"} after ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchBanks(cursor, retryCount + 1);
      }
      console.error("Fetch banks error:", err.response?.data || err.message);
      setError(
        "Error fetching bank list: " +
          (err.response?.data?.message || err.message)
      );
      setBanks([]);
    } finally {
      if (!cursor) {
        setIsLoading(false);
      }
    }
  };

  const loadMoreBanks = async (): Promise<void> => {
    if (hasMore && !isLoading && nextCursor) {
      console.log(`Loading more banks, nextCursor: ${nextCursor}`);
      await fetchBanks(nextCursor);
    }
  };

  useEffect(() => {
    console.log("Initiating initial bank fetch");
    fetchBanks();
  }, []);

  return {
    banks,
    error,
    isLoading,
    loadMoreBanks,
    hasMore,
  };
};

export default useBanks;
