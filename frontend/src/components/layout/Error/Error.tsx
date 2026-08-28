import type { ReactNode } from "react";
import styled from "styled-components";

const StyledErrorWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 5rem;
  gap: 1rem;

  h1 {
    font-size: 4rem;
    color: var(--text-h);
  }
`;

export function GenericError({
  title,
  message,
}: {
  title: string;
  message: ReactNode;
}) {
  return (
    <StyledErrorWrapper>
      <h1>{title}</h1>
      {message}
    </StyledErrorWrapper>
  );
}
