import Head from "next/head";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import CenterContainer from "@/components/centercontainer";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import Navbar from "@/components/navbar";
import { jwtParser } from "@/front/jwtParser";
import { AuthAPI, TokenKeeper } from "@smiilliin/auth-api";
import smile from "@/front/smile.svg";
import StringsManager, { IStrings } from "@/front/stringsManager";

const BigTitle = styled.h1`
  color: var(--title-color);
`;
const SmallTitle = styled.h2`
  color: var(--font-second-color);
`;
const Icons = styled.div`
  text-align: center;
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export default ({
  accessToken,
  refreshToken,
}: {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}) => {
  const [id, setID] = useState<string>();

  const [authAPI, setAuthAPI] = useState<AuthAPI>();
  const [tokenKeeper, setTokenKeeper] = useState<TokenKeeper>();

  const [strings, setStrings] = useState<IStrings>();
  const stringsManager = new StringsManager(strings, setStrings);

  useEffect(() => {
    if (refreshToken) {
      setID(jwtParser(refreshToken)?.id);
    }
  }, [refreshToken]);
  useEffect(() => {
    (async () => {
      const lang = window.navigator.language.split("-")[0];
      setAuthAPI(new AuthAPI(lang, "/api"));

      stringsManager.load(lang);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!refreshToken) return;
      if (!authAPI) return;

      if (!accessToken) {
        accessToken = await authAPI.getAccessToken(refreshToken);
      }

      setTokenKeeper(new TokenKeeper(authAPI, refreshToken, accessToken));
    })();
  }, [authAPI]);
  useEffect(() => {
    if (!tokenKeeper) return;
    tokenKeeper.setTokenInterval();
  }, [tokenKeeper]);

  return (
    <>
      <Head>
        <title>Smile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CenterContainer>
          <Navbar id={id}></Navbar>
          <img src={smile.src} width="200px" alt="icon"></img>
          <BigTitle>👋 SMIILLIIN - Smile</BigTitle>
          <SmallTitle>{stringsManager.getString("HELLO")}</SmallTitle>
          <Icons>
            <a href="https://github.com/smiilliin">
              <img src="https://github.githubassets.com/favicons/favicon-dark.svg" width="30px" />
            </a>
            <a href="https://instagram.com/smiilliin">
              <img src="https://instagram.com/favicon.ico" width="30px" />
            </a>
            <a href="mailto:smiilliindeveloper@gamil.com">
              <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" width="30px" />
            </a>
          </Icons>
        </CenterContainer>
      </main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { "access-token": accessToken, "refresh-token": refreshToken } = cookies(context);

  return {
    props: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
}
