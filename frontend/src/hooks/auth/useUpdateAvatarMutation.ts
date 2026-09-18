import { api } from "@/api/api";
import type { BackendErrorResponseType } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAvatarMutation = () => {
  return useMutation<void, BackendErrorResponseType, File>({
    mutationFn: api.auth.updateAvatar,
    onSuccess: () => (window.location.href = "/account"),
  });
};
