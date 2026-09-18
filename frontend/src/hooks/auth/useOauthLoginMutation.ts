import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export function useOauthLoginMutation() {
  return useMutation({
    mutationFn: api.auth.oauthLogin,
  });
}
