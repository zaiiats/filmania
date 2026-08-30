import { api } from "@/api/api";
import { login, useTypedDispatch } from "@/store/store";
import { useQuery } from "@tanstack/react-query";

export function useInitAuth() {
  const dispatch = useTypedDispatch();

  return useQuery({
    queryFn: async () => {
      const data = await api.refresh();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);

        dispatch(login(data.userData));

        return data;
      }
    },
    queryKey: ["auth", "init"],
    retry: false,
    refetchOnWindowFocus: false,
  });
}
