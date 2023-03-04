import Head from "next/head";
import { FormEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
import CenterContainer from "@/components/centercontainer";
import { ButtonInput } from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { AuthAPI } from "@smiilliin/auth-api";
import { authHost } from "@/static";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import ReCAPTCHA from "react-google-recaptcha";
import { env } from "@/env";
import React from "react";
import Message from "@/components/message";

export default function Login({ refreshToken }: { refreshToken?: string }) {
  const recaptcha = React.useRef<ReCAPTCHA>();
  const [authAPI, setAuthAPI] = useState<AuthAPI>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (refreshToken) window.location.href = "/";

    const lang = window.navigator.language.split("-")[0];
    setAuthAPI(new AuthAPI(lang, authHost));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authAPI) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;
    const g_response = recaptcha.current?.getValue();

    try {
      const refreshToken: string = await authAPI.signup(id, password, g_response as string);
      localStorage.setItem("access-token", await authAPI.getAccessToken(refreshToken));
      window.location.href = "/";
    } catch (err: any) {
      setMessage(err.message);
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
        <CenterContainer nav={true}>
          <Message>{message}</Message>
          <Form spellCheck="false" onSubmit={submit}>
            <Input style={{ width: "100%", height: "40px" }} placeholder="ID" name="id" type="text" />
            <Input style={{ width: "100%", height: "40px" }} placeholder="PASSWORD" name="password" type="password" />
            <ReCAPTCHA
              theme="dark"
              sitekey={env.recaptcha_public_key}
              ref={recaptcha as React.RefObject<ReCAPTCHA>}
            ></ReCAPTCHA>
            <ButtonInput style={{ width: "100%", height: "40px" }} type="submit" value="SIGNUP" />
          </Form>
        </CenterContainer>
      </main>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { "refresh-token": refreshToken } = cookies(context);

  return {
    props: {
      refreshToken: refreshToken ? refreshToken : null,
    },
  };
}
