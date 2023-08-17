import styled from "styled-components";

const Input = styled.input.attrs(() => ({
  autoComplete: "off",
}))`
  border-radius: 10px;
  border: var(--second-color) solid 1px;
  width: 100px;
  background-color: transparent;
`;

export default Input;
