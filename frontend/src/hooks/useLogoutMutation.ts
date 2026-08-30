import { api } from "@/api/api";
import { logout, useTypedDispatch } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useLogoutMutation() {
  const dispatch = useTypedDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: api.logout,
    onSettled: () => {
      dispatch(logout());
      localStorage.removeItem("accessToken");
      queryClient.clear();
      navigate("/");
    },
  });
}
