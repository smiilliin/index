import React, { useRef } from "react";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import CenterContainer, {
  ColumnCenterContainer,
} from "@/components/centercontainer";
import { NextPageContext } from "next";
import Navbar from "@/components/navbar";
import { AuthAPI, TokenKeeper } from "@smiilliin/auth-api";
import smile from "@/images/smile.svg";
import StringsManager, { IStrings } from "@/front/stringsManager";
import IndexAPI from "@/front/IndexAPI";
import Image from "next/image";
import DownArrowImage from "@/images/down-arrow.svg";
import NewSmile from "@/images/new-smile.png";
import OldSmile from "@/images/old-smile.jpeg";

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
const FitImage = styled.img`
  max-width: 1000px;
  width: 100%;
  object-fit: contain;
`;
const FitIframeContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  aspect-ratio: 16 / 9;
  position: relative;
`;
const FitIframeEmbed = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
interface IEFitIframe {
  src: string;
}
const FitIframe = ({ src }: IEFitIframe) => {
  return (
    <FitIframeContainer>
      <FitIframeEmbed src={src}></FitIframeEmbed>
    </FitIframeContainer>
  );
};
const RepositoryContainer = styled.div`
  width: 100%;
`;

interface IEIndex {
  accessToken: string | null;
  refreshToken: string | null;
  language: string;
  strings: IStrings;
  rankStrings: Array<string>;
  id: string | null;
}
const Index = ({
  accessToken: _accessToken,
  refreshToken,
  language,
  strings,
  rankStrings,
  id,
}: IEIndex) => {
  const authAPI: AuthAPI = useMemo(() => new AuthAPI("/api"), []);
  const indexAPI: IndexAPI = useMemo(() => new IndexAPI("/api"), []);

  const stringsManager = useMemo(() => new StringsManager(strings), [strings]);
  const [accessToken, setAccessToken] = useState(_accessToken);

  useEffect(() => {
    (async () => {
      await authAPI.load(language);
      await indexAPI.load(language);
    })();

    window.onmousemove = (event) => {
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };
  }, []);
  useEffect(() => {
    (async () => {
      if (!authAPI) return;
      if (!refreshToken || !accessToken) return;

      const tokenKeeper = new TokenKeeper(authAPI, refreshToken, accessToken);
      tokenKeeper.watchAccessToken = (_accessToken) => {
        setAccessToken(_accessToken);
      };

      tokenKeeper.setTokenInterval();
    })();
  }, [authAPI]);
  const [mouseX, setMouseX] = useState<number>();
  const [mouseY, setMouseY] = useState<number>();

  const smileRef = useRef<HTMLImageElement>(null);
  const oldSmileRef = useRef<HTMLImageElement>(null);
  const newSmileRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!smileRef.current || !oldSmileRef.current || !newSmileRef.current)
      return;
    if (!mouseX || !mouseY) return;

    const setShadow = (target: HTMLImageElement, color: string) => {
      const rect = target.getBoundingClientRect();
      const centerX = (rect.right + rect.left) / 2;
      const centerY = (rect.bottom + rect.top) / 2;

      const f = (x: number) => 8 * Math.tanh(x / 120);

      target.style.filter = `drop-shadow(${f(mouseX - centerX)}px ${f(
        mouseY - centerY
      )}px 4px ${color})`;
    };
    setShadow(smileRef.current, "#a1a1a1");
    setShadow(oldSmileRef.current, "gray");
    setShadow(newSmileRef.current, "#48392F");
    // oldSmileRef.current.style.filter = "drop-shadow(5px 5px 4px #48392F)";
  }, [mouseX, mouseY]);

  return (
    <>
      <Head>
        <title>Smile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#121414" />
        <meta name="description" content="Smile - smiilliin" />
      </Head>
      <ScrollMain>
        <Navbar
          id={id || undefined}
          rankStrings={rankStrings || undefined}
        ></Navbar>
        <CenterContainer style={{ height: "calc(100vh - 20px)" }}>
          <div
            style={{
              position: "relative",
              marginBottom: "10px",
            }}
          >
            <Image
              src={NewSmile}
              width={200}
              alt="icon"
              style={{
                borderRadius: "50%",
              }}
            ></Image>
            <Image
              src={smile}
              width={200}
              className="overlap"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 1,
                backgroundColor: "black",
                borderRadius: "50%",
              }}
              alt="icon"
            ></Image>
          </div>
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
        <ColumnCenterContainer>
          <Image
            src={DownArrowImage}
            width={20}
            height={20}
            alt="DownArrow-Image"
          ></Image>
        </ColumnCenterContainer>
        <ColumnCenterContainer
          style={{
            paddingTop: "100px",
            paddingBottom: "100px",
            minHeight: "100vh",
            width: "100%",
            gap: "300px",
            justifyContent: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "30px" }}>
              <Image
                src={smile}
                ref={smileRef}
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "black",
                }}
                alt="smile"
              ></Image>
              <Image
                src={OldSmile}
                ref={oldSmileRef}
                width={150}
                height={150}
                style={{ borderRadius: "50%" }}
                alt="OldSmile"
              ></Image>
              <Image
                src={NewSmile}
                ref={newSmileRef}
                width={150}
                height={150}
                style={{ borderRadius: "50%" }}
                alt="NewSmile"
              ></Image>
            </div>
            <h2 style={{ marginTop: 30 }}>
              {stringsManager.getString("MOVE_MOUSE")}
            </h2>
          </div>
          <RepositoryContainer>
            <h2>domain-coloring</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/domain-coloring"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/domain-coloring
              </Link>
            </div>
            <FitIframe src="/domain-coloring"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>collision</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/collision"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/collision
              </Link>
            </div>
            <FitIframe src="/collision"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>ballinball</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/ballinball"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/ballinball
              </Link>
            </div>
            <FitIframe src="/ballinball"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>cozywall</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/cozywall"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/cozywall
              </Link>
            </div>
            <FitIframe src="/cozywall"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>custom-lifegame</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/custom-lifegame"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/custom-lifegame
              </Link>
            </div>
            <FitIframe src="/custom-lifegame"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>classcard-hack</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/classcard-hack"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/classcard-hack
              </Link>
            </div>
            <FitImage
              alt="mathcard.png"
              src="/classcard-hack/score.png"
            ></FitImage>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>asciiart</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/asciiart"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/asciiart
              </Link>
            </div>
            <FitImage alt="result.gif" src="/asciiart/result.gif"></FitImage>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>mathcard</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/mathcard"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/mathcard
              </Link>
            </div>
            <FitImage
              alt="mathcard.png"
              src="/mathcard/mathcard.png"
            ></FitImage>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>quicklink</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/quicklink"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/quicklink
              </Link>
            </div>
            <FitImage
              style={{ maxWidth: "350px" }}
              alt="quicklink.png"
              src="/quicklink/quicklink.png"
            ></FitImage>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>save-alert</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/save-alert"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/save-alert
              </Link>
            </div>
            <FitImage
              style={{ maxWidth: "750px" }}
              alt="save-alert.gif"
              src="/save-alert/save-alert.gif"
            ></FitImage>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>balls</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/balls"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/balls
              </Link>
            </div>
            <FitIframe src="/balls"></FitIframe>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>shoot</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/shoot"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/shoot
              </Link>
            </div>
            <Link
              href="https://smiilliin.com/shoot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FitImage alt="shoot.png" src="/shoot/shoot.png"></FitImage>
            </Link>
          </RepositoryContainer>
          <RepositoryContainer>
            <h2>sf</h2>
            <div>
              <Link
                href="https://github.com/smiilliin/sf"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/smiilliin/sf
              </Link>
            </div>
            <FitIframe src="/sf"></FitIframe>
          </RepositoryContainer>
        </ColumnCenterContainer>
      </ScrollMain>
    </>
  );
};
export default Index;
import {
  getLanguage,
  languageCache,
  languageListCache,
} from "@/front/languageCache";
import { getRank } from "@/back/rank";
import { Rank, getRankStrings } from "@/front/ranks";
import { loadTokens } from "@/front/loadTokens";
import ScrollMain from "@/components/scrollmain";
import Link from "@/components/link";

export async function getServerSideProps(context: NextPageContext) {
  const { accessTokenData, refreshToken, accessToken } = await loadTokens(
    context
  );
  const language = getLanguage(context);

  let rank: Rank | null = null;
  const id = accessTokenData?.id;

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
    } as IEIndex,
  };
}
