// src/api/api.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { KEYS, baseURL } from "@/config/constant";

const api = axios.create({
  baseURL,
});

// Request Interceptor (Appends Bearer Tokens safely in the browser)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem(KEYS.USER_INFO);
      const storedUser = savedUser ? JSON.parse(savedUser) : null;
      token = storedUser?.token;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor (Cleans up error objects and catches 401 logouts)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    const customError = {
      message:
        (error.response?.data as any)?.data?.message ||
        (error.response?.data as any)?.message ||
        "Something went wrong. Please try again later.",
      status: error.response?.status,
    };

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(KEYS.USER_INFO);
        window.location.href = "/login";
      }
    }

    return Promise.reject(customError);
  }
);

export { api };
