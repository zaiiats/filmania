import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export function useVerifyEmailMutation () {
  return useMutation({
    mutationFn:api.verifyEmail
  })
}