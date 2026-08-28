import styled from "styled-components";
import Logo from "./Logo";

const StyledFooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding:2rem 0;
`;

export default function Footer() {
  return (
    <StyledFooterWrapper>
      <Logo size="big" />
    </StyledFooterWrapper>
  );
}
