import { axiosInstance } from "@/lib/axios";

export const signup = async ({
  username,
  email,
  dateOfBirth,
}: {
  username: string;
  email: string;
  dateOfBirth: string;
}) => {
  console.log("hi");

  // await axiosInstance.post("/signup", {
  //   username,
  //   email,
  //   dateOfBirth: new Date(dateOfBirth),
  // });

  
};
