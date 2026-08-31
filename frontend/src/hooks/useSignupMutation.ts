import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: api.signup,
    onSuccess(_, { email }) {
      navigate(`/verify-email?email=${email}`);
    },
  });
}
