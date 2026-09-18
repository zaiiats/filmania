import { api } from "@/api/api";
import type { BackendErrorResponseType } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useResendVerifyEmailMutation() {
  return useMutation<void, BackendErrorResponseType, string>({
    mutationFn: api.auth.resendVerifyEmail,
    onError: async (error: unknown) => {
      if (error instanceof AxiosError && error?.response?.data.message) {
        toast.error(error?.response?.data.message);
      }
    },
  });
}
