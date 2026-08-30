import { api } from "@/api/api";
import { login, useTypedDispatch } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useLoginMutation() {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();

  return useMutation({
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
  });
}
