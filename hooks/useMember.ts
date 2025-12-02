import { useEffect } from "react";
import { useMemberStore } from "../store/user";
import { useAuthStore } from "./useAuth";

export const useMember = (autoFetch = true) => {
  const { user } = useAuthStore();
  const { member, loading, error, fetchMember, clearMember, updateMember } =
    useMemberStore();

  useEffect(() => {
    if (autoFetch && user?.id) {
      fetchMember(user.id);
    }
  }, [autoFetch, fetchMember, user?.id]);

  return {
    member,
    loading,
    error,
    refetch: () => (user?.id ? fetchMember(user.id) : Promise.resolve()),
    clear: clearMember,
    update: (updates: Partial<any>) =>
      user?.id ? updateMember(updates, user.id) : Promise.resolve(),
  };
};
