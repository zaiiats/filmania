import z from "zod";

const usernameSchema = z.string().trim().min(5).max(30);

const passwordSchema = z
  .string()
  .min(8, "password_min_length")
  .max(100, "password_max_length");

const emailSchema = z.email();

const dateOfBirth = z.iso.datetime();

export const userSignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  dateOfBirth: dateOfBirth,
  password: passwordSchema,
});

export const userLoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  isSaved: z.boolean(),
});

export const userVerifyEmailSchema = z.object({
  token: z.string(),
  email: emailSchema,
});

export const createReviewSchema = z.object({
  review:z.string(),
  
})

export type UserSignupType = z.infer<typeof userSignupSchema>;
export type UserLoginType = z.infer<typeof userLoginSchema>;
export type UserVerifyEmailType = z.infer<typeof userVerifyEmailSchema>;
