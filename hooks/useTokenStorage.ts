import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTokenStorage = () => {
  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (e) {
      console.error("Failed to get token:", e);
      return null;
    }
  };

  const setAccessToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (e) {
      console.error("Failed to set token:", e);
    }
  };

  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (e) {
      console.error("Failed to remove token:", e);
    }
  };

  return { getAccessToken, setAccessToken, removeAccessToken };
};
