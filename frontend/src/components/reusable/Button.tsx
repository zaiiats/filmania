interface ButtonInterface {
  size?: "small" | "big";
  type?: "outline" | "filled";
  onClick?: () => void;
  children: ReactNode;
}

import type { ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button<{
  $size: ButtonInterface["size"];
  $type: ButtonInterface["type"];
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-button);
  padding: 0.5rem 0.65rem;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  background-color: ${({ $type }) => {
    return $type === "outline" ? "var(--bg)" : "var(--text-h)";
  }};
  color: ${({ $type }) => {
    return $type === "outline" ? "var(--text-h)" : "var(--bg)";
  }};
  font-weight: ${({ $type }) => {
    return $type === "outline" ? "400" : "600";
  }};
  transition: var(--transition);

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
`;

export default function Button({
  size = "small",
  type = "outline",
  onClick,
  children,
}: ButtonInterface) {
  return (
    <StyledButton $size={size} $type={type} onClick={onClick}>
      {children}
    </StyledButton>
  );
}
