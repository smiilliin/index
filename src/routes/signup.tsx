import React, { useEffect } from "react";
import styled from "styled-components";
import { CenterContainer } from "../components/containers";
import { useIntl } from "react-intl";
import { Checkbox } from "../components/checkbox";

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
  src: "/repositories/gradation-wall",
}))`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: -1;
  border: 0;
`;
const Signup = () => {
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: "signup" });
  }, []);

  return (
    <>
      <Iframe></Iframe>
      <CenterContainer>
        {/* <Message>{message}</Message> */}
        <Form spellCheck="false">
          <Input
            placeholder={
              intl.formatMessage({ id: "id" }) +
              intl.formatMessage({ id: "idrequirement" })
            }
            name="id"
            type="text"
          />
          <Input
            placeholder={intl.formatMessage({ id: "password" })}
            name="password"
            type="password"
          />
          <Input
            placeholder={intl.formatMessage({ id: "passwordcheck" })}
            name="passwordCheck"
            type="password"
          />
          {/* <ReCAPTCHA
            theme="dark"
            sitekey={recaptchaPublicKey}
            ref={recaptcha}
          ></ReCAPTCHA> */}
          <InputButton value={intl.formatMessage({ id: "signup" })} />
          <Checkbox name="keepLoggedin">
            {intl.formatMessage({ id: "keeploggedin" })}
          </Checkbox>
        </Form>
      </CenterContainer>
    </>
  );
};
export default Signup;
