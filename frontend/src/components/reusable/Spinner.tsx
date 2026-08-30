import styled from "styled-components";

const StyledWrapper = styled.span`
  --color-1: #fff;
  --color-2: #33cc99;
  --size: 1px;

  width: calc(64 * var(--size));
  height: calc(64 * var(--size));
  border: calc(5 * var(--size)) solid var(--color-1);
  border-bottom-color: var(--color-2);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
`;

export default function Spinner() {
  return <StyledWrapper />;
}
