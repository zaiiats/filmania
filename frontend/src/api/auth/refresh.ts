// import { axiosInstance } from "@/lib/axios";

export const refresh = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return Promise.reject("no_access");
  }

  // const data = await axiosInstance.post(
  //   "/refresh",
  //   {},
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   },
  // );

  const data = {
    data: {
      accessToken: "33452345124efasdf4321",
      userData: {
        username: "George",
        email: "George123@gmail.com",
        profilePicture: "https://picsum.photos/id/237/200/300",
      },
    },
  };

  return data.data;
};
