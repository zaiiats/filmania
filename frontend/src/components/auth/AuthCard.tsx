/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import styled from "styled-components";

interface AuthCardInterface {
  title: string;
  children: ReactNode;
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  width: 25rem;
  margin: 5rem auto;

  & > h1 {
    font-size: 2rem;
    color: var(--text-h);
  }

  & > div {
    border: white 1px solid;
    background-color: #222;
    border-radius: 1rem;
    padding: 1.2rem;
    width: 100%;
  }
`;

export default function AuthCard({ children, title }: AuthCardInterface) {
  return (
    <StyledWrapper>
      <h1>{title}</h1>
      <div>{children}</div>
    </StyledWrapper>
  );
}

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.35rem;

  input {
    border: var(--border-button);
    background-color: var(--bg);
    padding: 0.5rem 0.65rem;
    border-radius: var(--border-radius);
    color: var(--text-h);
    width: 100%;
    outline: none;

    :focus {
      border-color: #4f46e5;
    }
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    fill: green;
    filter: invert(1);
  }

  p {
    color: #f04040;
  }
`;

export const ButtonsGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const VerticalFormGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.35rem;
`;

export const CheckBoxGroup = styled.input`
  appearance: none;
  -webkit-appearance: none;

  width: 1.25rem;
  height: 1.25rem;
  border: var(--border-button);
  border-radius: 0.15rem;
  background-color: var(--bg);
  cursor: pointer;

  &:checked {
    background-color: var(--text-h);
  }
`;
