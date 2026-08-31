import dayjs from "dayjs";
import z from "zod";

const usernameSchema = z
  .string()
  .min(5, "username_min_length")
  .max(30, "username_max_length");

const emailSchema = z.email("not_email");

const dateOfBirth = z.string().refine(
  (val) => {
    const passedDate = dayjs(val);
    if (!passedDate.isValid()) {
      return false;
    }

    const diff = dayjs().diff(passedDate, "year");
    return diff >= 18;
  },
  { error: "invalid_date" },
); //min(getMinYear());

export const userLoginSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  isSaved: z.boolean(),
});

export const userSignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  dateOfBirth: dateOfBirth,
});

export type SignupFormValues = z.infer<typeof userSignupSchema>;