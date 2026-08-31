// import { axiosInstance } from "@/lib/axios";

export const login = async ({
  username,
  email,
  isSaved,
}: {
  username: string;
  email: string;
  isSaved: boolean;
}) => {
  // const data = await axiosInstance.post("/login", {
  //   username,
  //   email,
  //   isSaved,
  // });

  console.log(username, email, isSaved);

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

  throw new Error("FUCK YOU BUGAGAGA");

  return data.data;
};
