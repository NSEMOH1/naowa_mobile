import { create } from "zustand";
import api from "@/constants/api";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  date_of_birth: string;
  bank: {
    account_name: string;
    account_number: string;
    bank_name: string;
  }[];
  next_of_kin: {
    first_name: string;
    last_name: string;
    relationship: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
  }[];
  created_at: string;
  updated_at: string;
}

interface MemberState {
  member: Member | null;
  loading: boolean;
  error: string | null;
  fetchMember: (id: string) => Promise<void>;
  clearMember: () => void;
  updateMember: (updates: any, id: string) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  member: null,
  loading: false,
  error: null,

  fetchMember: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/members/${id}`);
      set({
        member: response.data.user,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch user data",
        loading: false,
      });
    }
  },

  updateMember: async (updates: any, id: string) => {
    try {
      const response = await api.put(`/api/members/${id}`, updates);
      set({ member: response.data.user });
    } catch (error: any) {
      set({
        error: error.message || "Failed to update user data",
        loading: false,
      });
    }
  },

  clearMember: () => {
    set({ member: null });
  },
}));
