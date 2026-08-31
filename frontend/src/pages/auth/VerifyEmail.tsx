import AuthCard, { ButtonsGroup } from "@/components/auth/AuthCard";
import Button from "@/components/reusable/Button";
import { useVerifyEmailMutation } from "@/hooks/useVerifyEmailMutation";
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
  const [otp, setOtp] = useState<string>("1");

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { isPending, mutate } = useVerifyEmailMutation();

  const onReset = () => {
    setOtp("");
  };

  const onSubmit = () => {
    if (otp.trim().length !== OTP_LENGTH) return;

    if (!email) {
      toast.error("No email provided");
      return;
    }
    mutate({ otp, email });
    onReset();
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
            isDisabled={isPending}
          >
            Reset
          </Button>
          <Button
            style={{ width: "100%" }}
            type="submit"
            onClick={onSubmit}
            variant="filled"
            isDisabled={isPending}
          >
            Verify
          </Button>
        </ButtonsGroup>
      </AuthCard>
    </StyledWrapper>
  );
}
