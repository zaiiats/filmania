import { api } from "@/api/api";
import type { BackendErrorResponseType } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignupParameters {
  username: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation<void, BackendErrorResponseType, SignupParameters>({
    mutationFn: api.auth.signup,
    onSuccess: async (_, { email }) => {
      toast.success("Now verify email!");
      navigate(`/verify-email?email=${email}`);
    },
  });
}
