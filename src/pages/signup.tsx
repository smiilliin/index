import Head from "next/head";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CenterContainer from "@/components/centercontainer";
import { ButtonInput } from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { AuthAPI } from "@smiilliin/auth-api";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import Message from "@/components/message";
import { recaptchaPublicKey } from "@/front/static";
import styled from "styled-components";
import StringsManager, { IStrings } from "@/front/stringsManager";
import {
  getLanguage,
  languageCache,
  languageListCache,
} from "@/front/languageCache";
import Checkbox from "@/components/checkbox";

const Title = styled.h2`
  color: var(--font-second-color);
  margin-bottom: 10px;
`;

interface IESignup {
  refreshToken: string | null;
  language: string;
  strings: IStrings;
}
const Signup = ({ refreshToken, language, strings }: IESignup) => {
  const recaptcha = React.useRef<ReCAPTCHA>(null);
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const [message, setMessage] = useState<string | undefined>();
  const inputStyle = { width: "100%", height: "40px" };
  const redirect = useCallback(() => {
    const url = new URL(window.location.toString());
    const nextURLStringEncoded = url.searchParams.get("next");
    if (nextURLStringEncoded) {
      const nextURLString = decodeURIComponent(nextURLStringEncoded);
      const nextURL = new URL(nextURLString);
      const redirectable = /^(?:[\w-]+\.)?smiilliin\.com$/.test(
        nextURL.hostname
      );
      if (redirectable) {
        window.location.href = nextURLString;
        return;
      }
    }
    window.location.href = "/";
  }, []);

  const stringsManager = new StringsManager(strings);

  useEffect(() => {
    (async () => {
      if (refreshToken) redirect();

      await authAPI.load(language);
    })();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;
    const passwordCheck = formData.get("passwordCheck") as string;
    const g_response = recaptcha.current?.getValue();

    if (password !== passwordCheck) {
      setMessage(
        stringsManager.getString("PASSWORD_AND_PASSWORD_CHECK_NOT_EQUALS")
      );
      return;
    }

    try {
      await authAPI.signup(
        id,
        password,
        g_response as string,
        formData.get("keepLoggedin") === "on"
      );
      await authAPI.getAccessToken({});

      redirect();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
        recaptcha.current?.reset();
        console.error(err);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Signup" />
      </Head>
      <main>
        <CenterContainer>
          <Title>SIGNUP</Title>
          <Message>{message}</Message>
          <Form spellCheck="false" onSubmit={submit}>
            <Input
              style={inputStyle}
              placeholder={"ID" + stringsManager.getString("ID_REQUIREMENT")}
              name="id"
              type="text"
            />
            <Input
              style={inputStyle}
              placeholder="PASSWORD"
              name="password"
              type="password"
            />
            <Input
              style={inputStyle}
              placeholder="PASSWORD CHECK"
              name="passwordCheck"
              type="password"
            />
            <ReCAPTCHA
              theme="dark"
              sitekey={recaptchaPublicKey}
              ref={recaptcha}
            ></ReCAPTCHA>
            <ButtonInput style={inputStyle} type="submit" value="SIGNUP" />
            <Checkbox name="keepLoggedin">
              {stringsManager.getString("KEEP_LOGGEDIN")}
            </Checkbox>
          </Form>
        </CenterContainer>
      </main>
    </>
  );
};
export default Signup;

export async function getServerSideProps(context: NextPageContext) {
  const { "refresh-token": refreshToken } = cookies(context);

  const language = getLanguage(context);

  return {
    props: {
      refreshToken: refreshToken || null,
      language: language,
      strings: languageCache(
        languageListCache().findIndex((e) => e === language) !== -1
          ? language
          : "en"
      ),
    } as IESignup,
  };
}
