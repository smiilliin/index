import React, { useCallback } from "react";
import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
import CenterContainer from "@/components/centercontainer";
import { ButtonInput } from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { AuthAPI } from "@smiilliin/auth-api";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import Message from "@/components/message";
import styled from "styled-components";
import Checkbox from "@/components/checkbox";
import {
  getLanguage,
  languageCache,
  languageListCache,
} from "@/front/languageCache";
import StringsManager, { IStrings } from "@/front/stringsManager";
import Link from "@/components/link";

const Title = styled.h2`
  color: var(--font-second-color);
  margin-bottom: 10px;
`;
interface IELogin {
  refreshToken: string | null;
  language: string;
  strings: IStrings;
}
const Login = ({ refreshToken, language, strings }: IELogin) => {
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const [message, setMessage] = useState<string>();
  const inputStyle = { width: "100%", height: "40px" };
  const stringsManager = useMemo(() => new StringsManager(strings), [strings]);
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

    try {
      await authAPI.login(id, password, formData.get("keepLoggedin") === "on");
      await authAPI.getAccessToken({});
      redirect();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
        console.error(err);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Login" />
      </Head>
      <main>
        <CenterContainer>
          <Title>LOGIN</Title>
          <Message>{message}</Message>
          <Form spellCheck="false" onSubmit={submit}>
            <Input style={inputStyle} placeholder="ID" name="id" type="text" />
            <Input
              style={inputStyle}
              placeholder="PASSWORD"
              name="password"
              type="password"
            />
            <ButtonInput style={inputStyle} type="submit" value="LOGIN" />
            <Checkbox name="keepLoggedin">
              {stringsManager.getString("KEEP_LOGGEDIN")}
            </Checkbox>
            <Link href="/signup">{stringsManager.getString("SIGNUP")}</Link>
          </Form>
        </CenterContainer>
      </main>
    </>
  );
};
export default Login;

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
    } as IELogin,
  };
}
