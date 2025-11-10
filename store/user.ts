import { create } from "zustand";
import api from "@/constants/api";
import { MemberStore } from "@/types";

export const useMemberStore = create<MemberStore>((set) => ({
  member: null,
  loading: false,
  error: null,
  fetchMemberData: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/members/${userId}`);
      set({ member: response.data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Failed to fetch member data",
      });
    }
  },
}));
