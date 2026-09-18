import { api } from "@/api/api";
import type { BackendErrorResponseType } from "@/lib/axios";
import { login, useTypedDispatch } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  username: string;
  password: string;
  isSaved: boolean;
}

interface LoginResponse {
  data: {
    accessToken: string;
    userData: {
      username: string;
      email: string;
      profilePicture: string;
      id: string;
    };
  };
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();

  return useMutation<LoginResponse, BackendErrorResponseType, LoginCredentials>(
    {
      mutationFn: api.auth.login,
      retry: 0,
      gcTime: 0,
      onSuccess: (data) => {
        console.log(data);

        const accessToken = data?.data?.accessToken;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          navigate("/");
        }

        dispatch(login(data.data.userData));
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          return error.response?.data;
        }
        return null;
      },
    },
  );
}
