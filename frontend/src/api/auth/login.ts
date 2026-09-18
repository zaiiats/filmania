import { axiosInstance } from "@/lib/axios";

export const login = async ({
  username,
  password,
  isSaved,
}: {
  username: string;
  password: string;
  isSaved: boolean;
}) => {
  const data = await axiosInstance.post("/auth/login", {
    username,
    password,
    isSaved,
  });

  console.log(data.data);
  

  // const data = {
  //   data: {
  //     accessToken: "33452345124efasdf4321",
  //     userData: {
  //       username: "George",
  //       password: "George123@gmail.com",
  //       profilePicture: "https://picsum.photos/id/237/200/300",
  //     },
  //   },
  // };

  return data.data;
};
