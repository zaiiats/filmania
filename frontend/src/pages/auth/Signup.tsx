import AuthCard, {
  ButtonsGroup,
  FormGroup,
  StyledForm,
} from "@/components/auth/AuthCard";
import DatePicker from "@/components/auth/DatePicker";
import Button from "@/components/reusable/Button";
import { useSignupMutation } from "@/hooks/auth/useSignupMutation";
import { userSignupSchema, type SignupFormValues } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Signup() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(userSignupSchema),
    mode: "onBlur",
    defaultValues: {
      dateOfBirth: "2000-08-06",
      username: "Zaiiats",
      email: "oleksandr.zaiats.kb.2023@lpnu.ua",
      password: "pass123$",
    },
  });

  const navigate = useNavigate();

  const { mutate, error } = useSignupMutation();

  const email = useWatch({ control: control, name: "email" });

  function onSubmit(data: SignupFormValues) {
    mutate(data);
    reset();
  }

  useEffect(() => {
    if (error?.response?.data) {
      const errorFields = error.response.data.params;
      if (errorFields && Array.isArray(errorFields)) {
        errorFields.forEach((field) => {
          setError(field.name as keyof SignupFormValues, {
            message: field.code,
          });
        });
      } else {
        if (error?.response?.data.message === "verify_email") {
          navigate(`/verify-email?email=${email}`);
        }
        toast.error(error?.response?.data.message);
      }
    }
  }, [error, setError, email, navigate]);

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
          <label htmlFor="password">Password</label>
          <input
            placeholder="Input password..."
            type="text"
            {...register("password")}
          />
          <p>{errors?.password && errors?.password.message}</p>
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
