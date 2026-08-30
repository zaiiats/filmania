import AuthCard, {
  ButtonsGroup,
  FormGroup,
  StyledForm,
} from "@/components/auth/AuthCard";
import DatePicker from "@/components/auth/DatePicker";
import Button from "@/components/reusable/Button";
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
      date: "",
      username: "",
      email: "",
    },
  });

  function onSubmit(data: SignupFormValues) {
    console.log(data);
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
            name="date"
            control={control}
            render={({ field: { value, onChange } }) => {
              return <DatePicker value={value} onChange={onChange} />;
            }}
          />
          <p>{errors?.date && errors?.date.message}</p>
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
