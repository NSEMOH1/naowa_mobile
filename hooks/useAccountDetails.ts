import { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { config } from "@/constants/api";

interface AccountDetailsData {
  account_number: string;
  account_name: string;
  bank_id: number;
}

interface AccountDetailsResponse {
  status: boolean;
  message: string;
  data?: AccountDetailsData;
}

const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] =
    useState<AccountDetailsData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const secretKey = config.paystackSecretKey;

  const fetchAccountDetails = useCallback(
    debounce(async (accountNumber: string, bankCode: string) => {
      const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
      try {
        setIsLoading(true);
        setError("");
        const response = await axios.get<AccountDetailsResponse>(url, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        });
        console.log(
          "Paystack API Response:",
          JSON.stringify(response.data, null, 2)
        );
        if (response.data.status && response.data.data?.account_name) {
          setAccountDetails(response.data.data);
        } else {
          setError(
            response.data.message.includes("Test mode daily limit")
              ? "Test mode limit exceeded. Please use test bank code (e.g., 001) or try again later."
              : response.data.message || "Invalid account details returned."
          );
          setAccountDetails(null);
        }
      } catch (err: any) {
        console.error("Paystack API Error:", err);
        let errorMessage = "Failed to verify account details.";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message.includes(
            "Test mode daily limit"
          )
            ? "Test mode limit exceeded. Please use test bank code (e.g., 001) or try again later."
            : err.response.data.message;
        } else if (err.request) {
          errorMessage =
            "Network error. Please check your internet connection.";
        }
        setError(errorMessage);
        setAccountDetails(null);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  return { accountDetails, error, isLoading, fetchAccountDetails };
};

export default useAccountDetails;
