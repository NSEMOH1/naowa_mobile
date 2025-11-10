import axios from "axios";

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
  paystackKey: "pk_test_85df7be5df5514e6966c2fce715825daf8e07612",
  paystackSecretKey: "sk_test_24b6190e77c8a4370778aa82c6164a93467a346b",
};

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

interface API {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
}

export const setupInterceptors = ({ getAccessToken, setAccessToken }: API) => {
  api.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    async (response) => {
      const accessToken = response.data?.token;
      if (accessToken) {
        await setAccessToken(accessToken);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default api;
