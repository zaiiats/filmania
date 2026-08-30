import axios, { AxiosError } from "axios";

const BACKEND_URL = "localhost:3000";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: import.meta.env.PROD, // uncomment we are sure
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
    return response;
  },
  async (error: AxiosError) => {
    const ogRequest = error.config as AxiosError["config"] & {
      _retry: boolean;
    };

    const refreshToken = localStorage.getItem("refreshToken");

    if (
      refreshToken &&
      error?.response?.status === 401 &&
      ogRequest?._retry !== true
    ) {
      ogRequest._retry = true;

      try {
        const data = await axios.post(`${BACKEND_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

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
    }
    return Promise.reject(error);
  },
);
