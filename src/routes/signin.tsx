import React, { FormEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useIntl } from "react-intl";
import { CenterContainer } from "../components/containers";
import { Checkbox } from "../components/checkbox";
import { Link } from "../components/link";

const Form = styled.form`
  width: 300px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const Input = styled.input.attrs(() => ({
  autoComplete: "off",
}))`
  border-radius: 10px;
  border: var(--second-color) solid 1px;
  width: 100px;
  background-color: transparent;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  height: 40px;
  color: white;
  &::placeholder {
    color: white;
  }
`;
const InputButton = styled.input.attrs(() => ({ type: "submit" }))`
  background-color: transparent;
  width: 100%;
  height: 40px;
  border: 1px solid var(--second-color)
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid var(--second-color);

  &:hover {
    background-color: var(--second-color);
  }
`;
const Iframe = styled.iframe.attrs(() => ({
  src: "/repositories/gaussian-simulator",
}))`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: -1;
  border: 0;
`;

const Signin = () => {
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: "signin" });
  }, []);

  const [message, setMessage] = useState<string>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setMessage("");
      setMessage("ERROR: 그냥 에러");
    },
    [setMessage]
  );

  return (
    <>
      <Iframe></Iframe>
      <CenterContainer>
        <p>{message}</p>
        <Form spellCheck="false" onSubmit={onSubmit}>
          <Input
            placeholder={intl.formatMessage({ id: "id" })}
            name="id"
            type="text"
          />
          <Input
            placeholder={intl.formatMessage({ id: "password" })}
            name="password"
            type="password"
          />
          <InputButton value={intl.formatMessage({ id: "signin" })} />
          <Checkbox name="keepLoggedin">
            {intl.formatMessage({ id: "keeploggedin" })}
          </Checkbox>
          <Link href="/signup">{intl.formatMessage({ id: "signup" })}</Link>
        </Form>
      </CenterContainer>
    </>
  );
};
export default Signin;
