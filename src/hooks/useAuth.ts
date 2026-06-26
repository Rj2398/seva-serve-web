import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "@/config/api";
import { KEYS } from "@/config/constant";
import { setUserInfo } from "@/store/slices/userSlice";

// TypeScript interface for the login input payload
interface LoginPayload {
  email: string;
  password?: string;
}

export default function useAuth() {
  const dispatch = useDispatch();

  const { mutateAsync: loginUser, isPending: isLoading } = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: LoginPayload) => {
      const response = await api.post("login", payload);
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Instantly save response data to Redux global state
      dispatch(setUserInfo(data));

      // 2. Persist to localStorage so the interceptor can grab the token on page refreshes
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.USER_INFO, JSON.stringify(data));
      }
    },
  });

  return {
    loginUser,
    isLoading,
  };
}
