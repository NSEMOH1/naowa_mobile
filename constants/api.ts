import axios from "axios";

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
  paystackKey: process.env.EXPO_PUBLIC_PAYSTACK_TEST_KEY || "",
  paystackSecretKey: process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY || "",
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
