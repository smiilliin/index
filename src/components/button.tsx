import styled from "styled-components";

const ButtonStyle = `
  border-radius: 10px;
  width: var(--button-width);
  height: 25px;
  cursor: pointer;
  background-color: #121414;
  border: none;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  margin-left: var(--button-margin);
  margin-right: var(--button-margin);

  &:hover {
    background-color: var(--second-color);
  }
`;
const Button = styled.a`
  ${ButtonStyle}
`;
const ButtonInput = styled.input`
  ${ButtonStyle}
`;

export { Button, ButtonInput, ButtonStyle };
