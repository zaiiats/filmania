import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Button from "@/components/reusable/Button";
import AuthCard, {
  ButtonsGroup,
  CheckBoxGroup,
  FormGroup,
  StyledForm,
  VerticalFormGroup,
} from "@/components/auth/AuthCard";
import { userLoginSchema } from "@/utils/validation";
import { useLoginMutation } from "@/hooks/useLoginMutation";

type LoginFormValues = z.infer<typeof userLoginSchema>;

export default function Login() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "Zaiiats",
      email: "zaiats@email.com",
      isSaved: true,
    },
  });

  const { mutate } = useLoginMutation();

  async function onSubmit(data: LoginFormValues) {
    mutate(data);
    reset();
  }

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
          <label htmlFor="email">Email</label>
          <input
            placeholder="Input text..."
            type="text"
            {...register("email")}
          />
          <p>{errors?.email && errors?.email.message}</p>
        </FormGroup>
        <VerticalFormGroup>
          <label htmlFor="isSaved">Is saved</label>
          <CheckBoxGroup type="checkbox" {...register("isSaved")} />
        </VerticalFormGroup>
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
