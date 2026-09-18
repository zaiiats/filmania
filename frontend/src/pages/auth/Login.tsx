import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/reusable/Button";
import AuthCard, {
  ButtonsGroup,
  CheckBoxGroup,
  FormGroup,
  StyledForm,
  VerticalFormGroup,
} from "@/components/auth/AuthCard";
import { userLoginSchema, type LoginFormValues } from "@/utils/validation";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useOauthLoginMutation } from "@/hooks/auth/useOauthLoginMutation";

export default function Login() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "Zaiiatsw",
      password: "pass123$",
      isSaved: true,
    },
  });  

  const { mutate: loginMutation, error: loginError } = useLoginMutation();

  const { mutate: oauthMutation } = useOauthLoginMutation();

  async function onSubmit(data: LoginFormValues) {
    loginMutation(data);
  }

  useEffect(() => {
    if (loginError?.response?.data) {
      const errorFields = loginError.response.data.params;
      if (errorFields) {
        errorFields.forEach((field) => {
          console.log(field);

          setError(field.name as keyof LoginFormValues, {
            message: field.code,
          });
        });
        console.log(errorFields);
      } else {
        console.log(loginError?.response?.data);

        if (loginError?.response?.data.message === "invalid_credentials") {
          toast.error("invalid_credentials");
        }
      }
    }
  }, [loginError, setError]);

  return (
    <AuthCard title="Login">
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <label htmlFor="usernname">Username</label>
          <input
            placeholder="Input text..."
            type="text"
            {...register("username")}
          />
          <p>{errors?.username && errors?.username.message}</p>
        </FormGroup>
        <FormGroup>
          <label htmlFor="password">Password</label>
          <input
            placeholder="Input password..."
            type="text"
            {...register("password")}
          />
          <p>{errors?.password && errors?.password.message}</p>
        </FormGroup>
        <VerticalFormGroup>
          <label htmlFor="isSaved">Is saved</label>
          <CheckBoxGroup type="checkbox" {...register("isSaved")} />
        </VerticalFormGroup>
        <Button
          style={{ width: "100%" }}
          onClick={() => oauthMutation("google")}
          isDisabled={isLoading}
          as="a"
          href="http://localhost:3001/api/v1/auth/oauth/google"
        >
          Login with Google
        </Button>
        <ButtonsGroup>
          <Button style={{ width: "100%" }} type="reset" isDisabled={isLoading}>
            Reset
          </Button>
          <Button
            style={{ width: "100%" }}
            type="submit"
            variant="filled"
            isDisabled={isLoading}
          >
            Submit
          </Button>
        </ButtonsGroup>
      </StyledForm>
    </AuthCard>
  );
}
