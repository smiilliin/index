import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { CenterContainer } from "../components/containers";
import { useIntl } from "react-intl";
import { Checkbox } from "../components/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";
import { checkAccessToken, IStatusResponse, newAccessToken } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../App";

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
  padding-left: 5px;
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
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const navigateNext = useCallback(() => {
    const next = params.get("next");

    if (!next) {
      return navigate("/");
    }
    const goCurrentDomain = new RegExp(`^\\/`).test(next);
    const goOtherDomain = new RegExp(
      `https:\\/\\/[^.]*\\.${process.env.REACT_APP_URL}(?:$|\\/)`
    ).test(next);

    if (goOtherDomain) {
      return (window.location.href = next);
    }
    if (goCurrentDomain) {
      return navigate(next);
    }

    return navigate("/");
  }, [params]);

  useEffect(() => {
    document.title = intl.formatMessage({ id: "signup" });

    checkAccessToken(context).then((accessToken) => {
      if (accessToken) {
        navigateNext();
        return;
      }
    });
  }, []);

  const recaptcha = useRef<ReCAPTCHA>(null);
  const [message, setMessage] = useState("");

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setMessage("");

      const formData = new FormData(event.currentTarget);

      const id = formData.get("id") as string | null;
      const password = formData.get("password") as string | null;
      const keepLoggedin = formData.get("keepLoggedin") != null;

      if (password != formData.get("passwordCheck")) {
        return setMessage(intl.formatMessage({ id: "passwordnotmatch" }));
      }
      if (!id) {
        return setMessage(intl.formatMessage({ id: "inputid" }));
      }
      if (!password) {
        return setMessage(intl.formatMessage({ id: "inputpassword" }));
      }

      const gResponse = recaptcha.current?.getValue();

      if (!gResponse) {
        return setMessage(intl.formatMessage({ id: "checkrecaptcha" }));
      }

      fetch(`https://index-back.${process.env.REACT_APP_URL}/signup`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          gResponse: gResponse,
          id: id,
          password: CryptoJS.SHA256(password).toString(),
          keepLoggedin: keepLoggedin,
        }),
      })
        .then((res) => res.json())
        .then((data: IStatusResponse) => {
          if (!data.status) {
            recaptcha.current?.reset();
            return setMessage(intl.formatMessage({ id: data.reason }));
          }

          newAccessToken().then((accessToken) => {
            context.setAccessToken(accessToken);
            navigateNext();
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [recaptcha, setMessage]
  );

  return (
    <>
      <Iframe></Iframe>
      <CenterContainer>
        <p>{message}</p>
        <Form spellCheck="false" onSubmit={onSubmit}>
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
          <ReCAPTCHA
            theme="dark"
            sitekey="6LfPIBoqAAAAAOJvsfyfCpW7weR32dFJi-F0h7oI"
            ref={recaptcha}
          ></ReCAPTCHA>
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
