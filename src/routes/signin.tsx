import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { useIntl } from "react-intl";
import { CenterContainer } from "../components/containers";
import { Checkbox } from "../components/checkbox";
import { Link } from "../components/link";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../App";
import { checkAccessToken, IStatusResponse, newAccessToken } from "../api";
import CryptoJS from "crypto-js";

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
    document.title = intl.formatMessage({ id: "signin" });

    checkAccessToken(context).then((accessToken) => {
      if (accessToken) {
        navigateNext();
        return;
      }
    });
  }, []);

  const [message, setMessage] = useState<string>();

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage("");

      setMessage("");

      const formData = new FormData(event.currentTarget);

      const id = formData.get("id") as string | null;
      const password = formData.get("password") as string | null;
      const keepLoggedin = formData.get("keepLoggedin") != null;

      if (!id) {
        return setMessage(intl.formatMessage({ id: "inputid" }));
      }
      if (!password) {
        return setMessage(intl.formatMessage({ id: "inputpassword" }));
      }

      fetch(`https://index-back.${process.env.REACT_APP_URL}/signin`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          id: id,
          password: CryptoJS.SHA256(password).toString(),
          keepLoggedin: keepLoggedin,
        }),
      })
        .then((res) => res.json())
        .then((data: IStatusResponse) => {
          if (!data.status) {
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
