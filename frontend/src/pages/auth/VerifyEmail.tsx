import AuthCard, { ButtonsGroup } from "@/components/auth/AuthCard";
import Button from "@/components/reusable/Button";
import { useResendVerifyEmailMutation } from "@/hooks/auth/useResendVerifyEmailMutation";
import { useVerifyEmailMutation } from "@/hooks/auth/useVerifyEmailMutation";
import { AxiosError } from "axios";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlotsContainer = styled.ul`
  display: flex;
  gap: 1rem;
  color: var(--text-h);
  font-size: 1.3rem;
`;

const Slot = styled.li<{ $isActive: boolean }>`
  width: 45px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  background-color: var(--bg);
  border: ${({ $isActive }) =>
    $isActive ? "var(--border-button)" : "1px solid #888"};
`;

const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>("");
  const [isShowingResend, setIsShowingResend] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { isPending: verifyEmailIsPending, mutate: verifyEmailMutate } =
    useVerifyEmailMutation();

  const { isPending: resendEmailIsPending, mutate: resendEmailMutate } =
    useResendVerifyEmailMutation();

  const onReset = () => {
    setOtp("");
  };

  const onSubmit = () => {
    if (otp.trim().length !== OTP_LENGTH) return;

    if (!email) {
      toast.error("No email provided");
      return;
    }
    verifyEmailMutate(
      { otp, email },
      {
        onError: (error: unknown) => {
          if (error instanceof AxiosError && error?.response?.data.message) {
            setIsShowingResend(true);
          }
          onReset();
        },
      },
    );
  };

  const onResend = () => {
    if (!email) {
      toast.error("No email provided");
      return;
    }
    resendEmailMutate(email);
    setIsShowingResend(false);
  };

  return (
    <StyledWrapper>
      <AuthCard title="Verify email">
        <OTPInput
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          inputMode="numeric"
          pattern={REGEXP_ONLY_DIGITS}
          render={({ slots }) => {
            return (
              <SlotsContainer>
                {slots.map((slot, idx) => {
                  return (
                    <Slot $isActive={slot.isActive} key={idx}>
                      {slot.char !== null && <div>{slot.char}</div>}
                    </Slot>
                  );
                })}
              </SlotsContainer>
            );
          }}
        />
        <ButtonsGroup>
          <Button
            style={{ width: "100%" }}
            type="reset"
            onClick={onReset}
            isDisabled={verifyEmailIsPending || resendEmailIsPending}
          >
            Reset
          </Button>
          <Button
            style={{ width: "100%" }}
            type="submit"
            onClick={onSubmit}
            variant="filled"
            isDisabled={verifyEmailIsPending || resendEmailIsPending}
          >
            Verify
          </Button>
        </ButtonsGroup>

        {isShowingResend && (
          <Button
            style={{ width: "100%", marginTop: "32px" }}
            type="submit"
            onClick={onResend}
            variant="outline"
            isDisabled={verifyEmailIsPending || resendEmailIsPending}
          >
            Resend Verification
          </Button>
        )}
      </AuthCard>
    </StyledWrapper>
  );
}
