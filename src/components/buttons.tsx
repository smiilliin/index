import styled from "styled-components";

const Button = styled.button`
  background-color: transparent;
  width: 100px;
  height: 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background-color: var(--second-color);
  }
`;

export { Button };
