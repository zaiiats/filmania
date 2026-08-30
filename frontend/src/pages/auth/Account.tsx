import { useTypedSelector } from "@/store/store";
import styled from "styled-components";
import Button from "@/components/reusable/Button";
import { useLogoutMutation } from "@/hooks/useLogoutMutation";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
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
  const { username, email, profilePicture } = useTypedSelector(
    (store) => store.user,
  );

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate();
  };

  return (
    <StyledWrapper>
      <Avatar
        src={profilePicture || "https://picsum.photos/id/237/200/300"}
        alt={username || "Profile picture"}
      />

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
