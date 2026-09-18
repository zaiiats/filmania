import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styled from "styled-components";

type ButtonBaseProps<E extends ElementType = "button"> = {
  size?: "small" | "big";
  variant?: "outline" | "filled";
  children: ReactNode;
  type?: "submit" | "reset" | "button";
  isDisabled?: boolean;
  as?: E;
};

type ButtonProps<E extends ElementType = "button"> = ButtonBaseProps<E> &
  ComponentPropsWithoutRef<E>;

const StyledButton = styled.button<{
  $size: ButtonProps["size"];
  $variant: ButtonProps["variant"];
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
  &:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.5;
  }
`;

export default function Button<E extends ElementType = "button">({
  as,
  size = "small",
  variant = "outline",
  type = "button",
  isDisabled = false,
  children,
  ...restProps
}: ButtonProps<E>) {
  const Component = as || "button";

  return (
    <StyledButton
      as={Component}
      type={type}
      $size={size}
      $variant={variant}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
}
