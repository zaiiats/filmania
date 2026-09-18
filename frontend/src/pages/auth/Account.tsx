import { useTypedSelector } from "@/store/store";
import styled from "styled-components";
import Button from "@/components/reusable/Button";
import { useLogoutMutation } from "@/hooks/auth/useLogoutMutation";
import AccountAvatar from "@/components/AccountAvatar";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-h);
`;

const Email = styled.p`
  font-size: 1rem;
`;

export default function Account() {
  const { username, email } = useTypedSelector((store) => store.user);

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate();
  };

  return (
    <StyledWrapper>
      <AccountAvatar />

      <UserInfo>
        <Username>{username}</Username>
        <Email>{email}</Email>
      </UserInfo>

      <Button isDisabled={isPending} onClick={handleLogout}>
        Logout
      </Button>
    </StyledWrapper>
  );
}
