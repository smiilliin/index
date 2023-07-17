import Head from "next/head";
import {
  FormEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import CenterContainer from "@/components/centercontainer";
import { ButtonInput } from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { AuthAPI } from "@smiilliin/auth-api";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import Message from "@/components/message";
import styled from "styled-components";

const Title = styled.h2`
  color: var(--font-second-color);
  margin-bottom: 10px;
`;

export default ({ refreshToken }: { refreshToken: string | null }) => {
  const [authAPI, setAuthAPI] = useState<AuthAPI>();
  const [message, setMessage] = useState("");
  const inputStyle = { width: "100%", height: "40px" };

  useEffect(() => {
    (async () => {
      if (refreshToken) window.location.href = "/";

      const lang = window.navigator.language.split("-")[0];
      const authAPI = new AuthAPI("/api");

      await authAPI.load(lang);
      setAuthAPI(authAPI);
    })();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authAPI) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;

    try {
      const refreshToken: string = await authAPI.login(id, password);
      await authAPI.getAccessToken(refreshToken);
      window.location.href = "/";
    } catch (err: any) {
      setMessage(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
          </Form>
        </CenterContainer>
      </main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { "refresh-token": refreshToken } = cookies(context);

  return {
    props: {
      refreshToken: refreshToken || null,
    },
  };
}
