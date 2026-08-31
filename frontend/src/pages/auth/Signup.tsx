import AuthCard, {
  ButtonsGroup,
  FormGroup,
  StyledForm,
} from "@/components/auth/AuthCard";
import DatePicker from "@/components/auth/DatePicker";
import Button from "@/components/reusable/Button";
import { useSignupMutation } from "@/hooks/useSignupMutation";
import { userSignupSchema, type SignupFormValues } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function Signup() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(userSignupSchema),
    mode: "onBlur",
    defaultValues: {
      dateOfBirth: "2000-08-06",
      username: "Zaiiats",
      email: "Zaiiats@email.com",
    },
  });

  const { mutate } = useSignupMutation();

  function onSubmit(data: SignupFormValues) {
    mutate(data);
    reset();
  }

  return (
    <AuthCard title="Sign up">
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
        <FormGroup>
          <label htmlFor="date">Date of birth</label>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field: { value, onChange } }) => {
              return <DatePicker value={value} onChange={onChange} />;
            }}
          />
          <p>{errors?.dateOfBirth && errors?.dateOfBirth.message}</p>
        </FormGroup>
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
