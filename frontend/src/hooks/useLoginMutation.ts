import { api } from "@/api/api";
import { login, useTypedDispatch } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface BackendErrorInterface {
  message: string;
  errors: Record<string, string>;
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();

  return useMutation<{ success: boolean }, AxiosError<BackendErrorInterface>>({
    mutationFn: api.login,
    retry: 1,
    gcTime: 0,
    onSuccess: (data) => {
      const accessToken = data?.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate("/");
      }

      dispatch(login(data.userData));
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
