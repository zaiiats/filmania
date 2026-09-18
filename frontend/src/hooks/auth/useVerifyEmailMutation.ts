import { api } from "@/api/api";
import type { BackendErrorResponseType } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VerifyEmailParameters {
  otp: string;
  email: string;
}

export function useVerifyEmailMutation() {
  const navigate = useNavigate();
  return useMutation<void, BackendErrorResponseType, VerifyEmailParameters>({
    mutationFn: api.auth.verifyEmail,
    onSuccess: async () => {
      navigate("/login");
    },
    onError: async (error: unknown) => {
      if (error instanceof AxiosError && error?.response?.data.message) {
        toast.error(error?.response?.data.message);
      }
    },
  });
}
