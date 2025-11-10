import { create } from "zustand";
import { useTokenStorage } from "./useTokenStorage";
import { jwtDecode } from "jwt-decode";
import { AuthData, AuthStore, JwtPayload } from "@/types";

export const useAuthStore = create<AuthStore>((set, get) => {
  const { getAccessToken, removeAccessToken } = useTokenStorage();

  return {
    user: null,
    token: null,
    loading: false,
    setUser: (data) => set({ user: data }),
    logout: () => {
      removeAccessToken();
      set({ user: null, token: null, loading: false });
    },
    validateSession: async () => {
      set({ loading: true });
      try {
        const currentToken = await getAccessToken();
        if (!currentToken) {
          throw new Error("No token found");
        }
        const decoded = jwtDecode<JwtPayload>(currentToken);

        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        const userData: AuthData = {
          id: decoded.id,
          full_name: decoded.full_name || "",
          email: decoded.email,
          role: decoded.role,
        };

        set({ user: userData, token: currentToken });
      } catch (error) {
        get().logout();
      } finally {
        set({ loading: false });
      }
    },
  };
});
