import React, { useRef } from "react";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
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
// const DownArrow = styled.image.attrs(() => ({ src: DownArrowImage }))`
//   width: 30px;
//   height: 30px;
// `;
const DownArrowKeyframe = keyframes`
  0% {
    translate: 0px 0px;
    scale: 1;
  }
  50% {
    translate: 0px 10px;
    scale: 1.5;
  }
`;
const DownArrowContainer = styled.div`
  width: 30px;
  height: 30px;
  animation: ${DownArrowKeyframe} 1s ease-in-out infinite;
`;
const DownArrow = () => {
  return (
    <DownArrowContainer>
      <Image
        src={DownArrowImage}
        width={0}
        height={0}
        style={{ width: "100%", height: "100%" }}
        alt="DownArrow"
      ></Image>
    </DownArrowContainer>
  );
};
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
interface IRepository {
  name: string;
  description: string;
  links: string[];
}
interface IImageRepository extends IRepository {
  type: "image";
  src: string;
  alt?: string;
  maxWidth?: number;
}
interface IIFrameRepository extends IRepository {
  type: "iframe";
  src: string;
}

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
  }, [mouseX, mouseY]);
  const repositories: (IImageRepository | IIFrameRepository)[] = [
    {
      name: "domain-coloring",
      description: "A program that shows complex function domain coloring",
      links: ["https://github.com/smiilliin/domain-coloring"],
      src: "/domain-coloring",
      type: "iframe",
    },
    {
      name: "collision",
      description: "elastic collision simulation",
      links: ["https://github.com/smiilliin/collision"],
      src: "/collision",
      type: "iframe",
    },
    {
      name: "ballinball",
      description: "simulation of a small ball colliding inside a big ball",
      links: ["https://github.com/smiilliin/ballinball"],
      src: "/ballinball",
      type: "iframe",
    },
    {
      name: "custom-lifegame",
      description:
        "Life game where you can change the live, death, and tickSpeed values",
      links: ["https://github.com/smiilliin/custom-lifegame"],
      src: "/custom-lifegame",
      type: "iframe",
    },
    {
      name: "classcard-hack",
      description: "classcard message hacking",
      links: ["https://github.com/smiilliin/classcard-hack"],
      src: "/classcard-hack/score.png",
      alt: "score.png",
      type: "image",
    },
    {
      name: "asciiart",
      description:
        "Converts an image to a string ASCII string image, or displays the screen as a string image in real time.",
      links: ["https://github.com/smiilliin/asciiart"],
      src: "/asciiart/result.gif",
      alt: "result.gif",
      type: "image",
    },
    {
      name: "NOPF-(core, server)",
      description:
        "Instead of connecting via port forwarding, connect using TCP hole punching.",
      links: [
        "https://github.com/smiilliin/nopf-core",
        "https://github.com/smiilliin/nopf-server",
      ],
      src: "/nopf/nopf-core.png",
      alt: "nopf-core.png",
      type: "image",
      maxWidth: 650,
    },
    {
      name: "token-generation",
      description: "Disable the refresh token",
      links: ["https://github.com/smiilliin/token-generation"],
      src: "/token-generation/token.png",
      alt: "token.png",
      type: "image",
      maxWidth: 550,
    },
    {
      name: "mathcard",
      description: "solve math problem easily",
      links: ["https://github.com/smiilliin/mathcard"],
      src: "/mathcard/mathcard.png",
      alt: "mathcard.png",
      type: "image",
    },
    {
      name: "quicklink",
      description: "solve math problem easily",
      links: ["https://github.com/smiilliin/quicklink"],
      src: "/quicklink/quicklink.png",
      alt: "quicklink.png",
      type: "image",
      maxWidth: 350,
    },
    {
      name: "cozywall",
      description: "a cozy wallpaper program",
      links: ["https://github.com/smiilliin/cozywall"],
      src: "/cozywall",
      type: "iframe",
    },
    {
      name: "save-alert",
      description: "This program helps you remember to save.",
      links: ["https://github.com/smiilliin/save-alert"],
      src: "/save-alert/save-alert.gif",
      type: "image",
      alt: "save-alert.gif",
      maxWidth: 750,
    },
    {
      name: "balls",
      description: "floating balls on the screen",
      links: ["https://github.com/smiilliin/balls"],
      src: "/cozywall",
      type: "iframe",
    },
    {
      name: "shoot",
      description: "simple shooting game",
      links: ["https://github.com/smiilliin/shoot", "https://smiilliin/shoot"],
      src: "/shoot/shoot.png",
      type: "image",
      alt: "shoot.png",
    },
    {
      name: "sf",
      description: "simple format",
      links: ["https://github.com/smiilliin/sf"],
      src: "/sf",
      type: "iframe",
    },
  ];

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
        <CenterContainer style={{ height: "calc(100vh - 50px)" }}>
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
            <a href="https://velog.io/@smiilliin/">
              <img src="https://velog.io/favicon.ico" width="30px" />
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
          <DownArrow></DownArrow>
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
          {repositories.map((repository) => {
            return (
              <RepositoryContainer key={repository.name}>
                <div style={{ marginBottom: 10 }}>
                  <h2>{repository.name}</h2>
                  <h4>{repository.description}</h4>
                  {repository.links.map((link) => (
                    <div key={link}>
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </Link>
                    </div>
                  ))}
                </div>
                {repository.type == "iframe" ? (
                  <FitIframe src={repository.src}></FitIframe>
                ) : (
                  <FitImage
                    src={repository.src}
                    alt={repository.alt}
                    style={{ maxWidth: repository.maxWidth }}
                  ></FitImage>
                )}
              </RepositoryContainer>
            );
            // }
            // return <></>;
          })}
        </ColumnCenterContainer>
      </ScrollMain>
    </>
  );
};
export default Index;

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
