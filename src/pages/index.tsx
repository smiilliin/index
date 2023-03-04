import Head from "next/head";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
// import styles from '@/styles/Home.module.css'
import Container from "@/components/container";
import CenterContainer from "@/components/centercontainer";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import Navbar from "@/components/navbar";
import { Button } from "@/components/button";
import { jwtParser } from "@/jwtParser";
import { AuthAPI, TokenKeeper } from "@smiilliin/auth-api";
import { authHost } from "@/static";

// const [userName, setUserName] = useState("");

const Icon = () => {
  return <img src="smile.svg" width="150px" alt="icon" />;
};
const BigTitle = styled.h1`
  color: var(--title-color);
`;
const SmallTitle = styled.h2`
  color: var(--font-second-color);
`;
const Buttons = styled.div`
  text-align: center;
  padding-top: 10px;
`;

export default function Index({ refreshToken }: { refreshToken: string }) {
  let id;

  if (refreshToken) {
    id = jwtParser(refreshToken)?.id;
  }

  const [authAPI, setAuthAPI] = useState<AuthAPI>();
  const [tokenKeeper, setTokenKeeper] = useState<TokenKeeper>();

  useEffect(() => {
    (async () => {
      const lang = window.navigator.language.split("-")[0];
      setAuthAPI(new AuthAPI(lang, authHost));
    })();
  }, []);
  useEffect(() => {
    (async () => {
      let accessToken = sessionStorage.getItem("access-token");

      if (!refreshToken) return;
      if (!authAPI) return;

      if (!accessToken) {
        accessToken = await authAPI.getAccessToken(refreshToken);
        sessionStorage.setItem("access-token", accessToken);
      }

      setTokenKeeper(new TokenKeeper(authAPI, refreshToken, accessToken));
    })();
  }, [authAPI]);
  useEffect(() => {
    if (!tokenKeeper) return;
    tokenKeeper.watchAccessToken = (accessToken: string) => {
      sessionStorage.setItem("access-token", accessToken);
    };

    tokenKeeper.setTokenInterval();
  }, [tokenKeeper]);

  return (
    <>
      <Head>
        <title>Smile Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar id={id}></Navbar>
        <CenterContainer nav={true}>
          <Icon></Icon>
          <BigTitle>Smile Developer</BigTitle>
          <SmallTitle>👋Hi! I'm smile developer!</SmallTitle>
          <Buttons>
            <Button href="https://github.com/smiilliin">Github</Button>
          </Buttons>
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
