import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import CenterContainer from "@/components/centercontainer";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import Navbar from "@/components/navbar";
import { jwtParser } from "@/front/jwtParser";
import { AuthAPI, TokenKeeper } from "@smiilliin/auth-api";
import smile from "@/images/smile.svg";
import StringsManager, { IStrings } from "@/front/stringsManager";
import IndexAPI from "@/front/IndexAPI";
import Image from "next/image";

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
interface IEMain {
  accessToken: string | null;
  refreshToken: string | null;
  language: string;
  strings: IStrings;
  rankStrings: Array<string>;
  id: string | null;
}

export default ({
  accessToken,
  refreshToken,
  language,
  strings,
  rankStrings,
  id,
}: IEMain) => {
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const indexAPI: IndexAPI = useMemo(() => new IndexAPI("/api"), []);

  const stringsManager = useMemo(() => new StringsManager(strings), [strings]);

  useEffect(() => {
    (async () => {
      await authAPI.load(language);
      await indexAPI.load(language);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!authAPI) return;
      if (!refreshToken || !accessToken) return;

      const tokenKeeper = new TokenKeeper(authAPI, refreshToken, accessToken);
      tokenKeeper.watchAccessToken = (_accessToken) => {
        accessToken = _accessToken;
      };

      tokenKeeper.setTokenInterval();
    })();
  }, [authAPI]);
  useEffect(() => {
    (async () => {
      if (!indexAPI) return;

      // if (accessToken && ranks.indexOf(String(Rank.ADMIN)) != -1) {
      //   indexAPI.setRank("smile", Rank.ADMIN | Rank.SUPERTHANKS | Rank.CLOUD);
      // }
    })();
  }, [indexAPI]);

  return (
    <>
      <Head>
        <title>Smile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CenterContainer>
          <Navbar
            id={id || undefined}
            rankStrings={rankStrings || undefined}
          ></Navbar>
          <Image src={smile} width={200} alt="icon"></Image>
          <BigTitle>👋 SMIILLIIN - Smile</BigTitle>
          <SmallTitle>{stringsManager.getString("HELLO")}</SmallTitle>
          <Icons>
            <a href="https://github.com/smiilliin">
              <img
                src="https://github.githubassets.com/favicons/favicon-dark.svg"
                width="30px"
              />
            </a>
            <a href="https://instagram.com/smiilliin">
              <img src="https://instagram.com/favicon.ico" width="30px" />
            </a>
            <a href="mailto:smiilliindeveloper@gamil.com">
              <img
                src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
                width="30px"
              />
            </a>
          </Icons>
        </CenterContainer>
      </main>
    </>
  );
};
import { languageCache, languageListCache } from "@/front/languageCache";
import { getRank } from "@/back/rank";
import { Rank, getRankStrings } from "@/front/ranks";
import { IAccessToken, IRefreshToken } from "token-generation";
import { serialize } from "cookie";
import { env } from "@/back/env";

export async function getServerSideProps(context: NextPageContext) {
  let { "access-token": accessToken, "refresh-token": refreshToken } =
    cookies(context);

  let refreshTokenData: IRefreshToken | undefined;
  let accessTokenData: IAccessToken | undefined;

  if (refreshToken) {
    refreshTokenData = jwtParser<IRefreshToken>(refreshToken);

    const refreshTokenExpired = (refreshTokenData?.expires || 0) < Date.now();
    if (refreshTokenExpired) {
      refreshToken = undefined;
    }
  }
  let needNewAccessToken: boolean = true;
  if (accessToken) {
    accessTokenData = jwtParser<IAccessToken>(accessToken);

    needNewAccessToken = (accessTokenData?.expires || 0) < Date.now();
  }

  try {
    if (needNewAccessToken) {
      const authAPI = new AuthAPI("https://smiilliin.com/api");

      accessToken = undefined;
      accessToken = await authAPI.getAccessToken({
        refreshToken: refreshToken,
      });

      context.res?.setHeader(
        "Set-Cookie",
        serialize("access-token", accessToken, {
          httpOnly: true,
          domain: env.cookie_domain,
          path: "/",
          secure: true,
          sameSite: "strict",
        })
      );
    }
  } catch {}
  const language =
    context.req?.headers["accept-language"]
      ?.split(";")?.[0]
      .split(",")?.[0]
      ?.split("-")?.[0] || "en";

  let rank: Rank | null = null;
  let id = accessTokenData?.id;

  if (id) {
    rank = await getRank(id);
    // console.log(await reqlimit(pool, id));
  }

  return {
    props: {
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      language: language,
      id: id || null,
      strings: languageCache(
        languageListCache().findIndex((e) => e === language) !== -1
          ? language
          : "en"
      ),
      rankStrings: rank ? getRankStrings(rank) : null,
    },
  };
}
