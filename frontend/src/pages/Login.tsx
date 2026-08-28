import { useRef, useState, type ChangeEvent } from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Login() {
  const errors: Record<string, string> = {};
  const [typed, setTyped] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onChange(e: ChangeEvent) {
    setTyped(
      "value" in e.target && typeof e.target.value === "string"
        ? e.target.value
        : "",
    );

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log("SET");
    }, 500);
  }

  return (
    <StyledWrapper>
      <footer>Login</footer>
      <section>
        <p>Login to your account</p>
        <div>
          <label htmlFor="usernname">Username</label>
          <input
            type="text"
            name="usernname"
            id="usernname"
            value={typed}
            onChange={onChange}
          />
          {errors?.username && errors?.username}
        </div>
      </section>
    </StyledWrapper>
  );
}
