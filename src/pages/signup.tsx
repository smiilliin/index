import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
import { languageCache, languageListCache } from "@/front/languageCache";
import Checkbox from "@/components/checkbox";

const Title = styled.h2`
  color: var(--font-second-color);
  margin-bottom: 10px;
`;

export default ({
  refreshToken,
  language,
  strings,
}: {
  refreshToken: string | null;
  language: string;
  strings: IStrings;
}) => {
  const recaptcha = React.useRef<ReCAPTCHA>(null);
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const [message, setMessage] = useState<string | undefined>();
  const inputStyle = { width: "100%", height: "40px" };

  const stringsManager = new StringsManager(strings);

  useEffect(() => {
    (async () => {
      if (refreshToken) window.location.href = "/";

      await authAPI.load(language);
    })();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authAPI) return;

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

      const url = new URL(window.location.toString());
      try {
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
      } catch {}
      window.location.href = "/";
    } catch (err: any) {
      setMessage(err.message);
      recaptcha.current?.reset();
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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

export async function getServerSideProps(context: NextPageContext) {
  const { "refresh-token": refreshToken } = cookies(context);

  const language =
    context.req?.headers["accept-language"]
      ?.split(";")?.[0]
      .split(",")?.[0]
      ?.split("-")?.[0] || "en";

  return {
    props: {
      refreshToken: refreshToken || null,
      language: language,
      strings: languageCache(
        languageListCache().findIndex((e) => e === language) !== -1
          ? language
          : "en"
      ),
    },
  };
}
