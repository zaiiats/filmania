import { useNavigate } from "react-router-dom";
import { GenericError } from "./Error";
import styled from "styled-components";

export default function NotFound() {
  return <GenericError title="Oooops! 404" message={<GoBackNotFound />} />;
}

const StyledGoBackNotFound = styled.div`
  display: flex;
  gap: 0.5rem;

  em {
    color: var(--accent);
    cursor: pointer;
  }
`;



function GoBackNotFound() {
  const navigate = useNavigate();
  return (
    <StyledGoBackNotFound>
      <p>Go back to the</p>
      <em onClick={() => navigate("/")}>Home</em>
    </StyledGoBackNotFound>
  );
}
