import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BACKEND_URL = "http://localhost:3001/api/v1";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // fulfilled
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // rejected
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response.config.url);
    if (response.config.url === "/auth/login") {
      const csrfCookie = document.cookie
        .split(";")
        .find((cookie) => /csrf_token/.test(cookie))
        ?.split("=")[1];

      if (csrfCookie) {
        axiosInstance.defaults.headers.common["x-csrf-token"] = csrfCookie;
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const ogRequest = error.config as AxiosError["config"] & {
      _retry: boolean;
    };

    if (error?.response?.status === 401 && ogRequest?._retry !== true) {
      ogRequest._retry = true;

      try {
        const data = await axios.get(`${BACKEND_URL}/auth/refresh`);

        const accessToken = data.data.accessToken;

        localStorage.setItem("accessToken", accessToken);

        ogRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(ogRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } else if (error.response?.status.toString().startsWith("5")) {
      toast.error("Server Error");
    }
    return Promise.reject(error);
  },
);

export const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    Accept: "application/json",
  },
});

interface BackendErrorInterface {
  message: string;
  status: string;
  params: { name: string; code: string }[];
}

export type BackendErrorResponseType = AxiosError<BackendErrorInterface>;
