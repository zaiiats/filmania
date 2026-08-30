interface ButtonInterface {
  size?: "small" | "big";
  variant?: "outline" | "filled";
  onClick?: () => void;
  children: ReactNode;
  type?: "submit" | "reset" | "button";
  style?: CSSProperties;
  isDisabled?: boolean;
}

import type { CSSProperties, ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button<{
  $size: ButtonInterface["size"];
  $variant: ButtonInterface["variant"];
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-button);
  padding: 0.5rem 0.65rem;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  background-color: ${({ $variant }) => {
    return $variant === "outline" ? "var(--bg)" : "var(--text-h)";
  }};
  color: ${({ $variant }) => {
    return $variant === "outline" ? "var(--text-h)" : "var(--bg)";
  }};
  font-weight: ${({ $variant }) => {
    return $variant === "outline" ? "400" : "600";
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
  variant = "outline",
  onClick,
  type = "button",
  isDisabled = false,
  children,
  style,
}: ButtonInterface) {
  return (
    <StyledButton
      style={style}
      type={type}
      $size={size}
      $variant={variant}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </StyledButton>
  );
}
