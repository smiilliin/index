import styled from "styled-components";

const buttonStyle = `
  border-radius: 10px;
  width: var(--button-width);
  height: 25px;
  cursor: pointer;
  background-color: var(--third-color);
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
  ${buttonStyle}
`;
const ButtonInput = styled.input`
  ${buttonStyle}
`;

export { Button, ButtonInput };
