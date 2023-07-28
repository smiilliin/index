import styled from "styled-components";

const CheckInput = styled.input.attrs((props) => ({ type: "checkbox" }))`
  margin-right: 5px;
`;

export default ({ children, name }: { children: string; name: string }) => (
  <label>
    <CheckInput name={name}></CheckInput>
    {children}
  </label>
);
