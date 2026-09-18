import { api } from "@/api/api";
import { login, useTypedDispatch } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useRefreshQuery() {
  const dispatch = useTypedDispatch();

  return useQuery({
    queryFn: async () => {
      try {
        const { data } = await api.auth.refresh();

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);

          dispatch(login(data.userData));

          return data;
        }

        return data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return error.response;
        }
        return null;
      }
    },
    queryKey: ["auth", "refresh"],
    retry: false,
    refetchOnWindowFocus: false,
  });
}
