import React, { forwardRef } from "react";
import styled from "styled-components";
import { Button } from "./components/buttons";
import { FlexCenterContainer } from "./components/containers";
import { Link } from "./components/link";

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
const repositories: (IImageRepository | IIFrameRepository)[] = [
  {
    name: "domain-coloring",
    description: "A program that shows complex function domain coloring",
    links: ["https://github.com/smiilliin/domain-coloring"],
    src: "/repositories/domain-coloring",
    type: "iframe",
  },
  {
    name: "deep-bricks",
    description: "Deep-learning with bricks and modules",
    links: [
      "https://github.com/smiilliin/deep-bricks",
      "https://smiilliin.com/repositories/deep-bricks",
    ],
    src: "/repositories/deep-bricks/screenshot.png",
    type: "image",
    alt: "screenshot.png",
  },
  {
    name: "classcard-hack",
    description: "classcard message hacking",
    links: ["https://github.com/smiilliin/classcard-hack"],
    src: "/repositories/classcard-hack/score.png",
    alt: "score.png",
    type: "image",
  },
  {
    name: "relativity-simulator",
    description: "Special Relativity Simulator",
    links: ["https://github.com/smiilliin/relativity-simulator"],
    src: "/repositories/relativity-simulator",
    type: "iframe",
  },
  {
    name: "workwatch-learning",
    description:
      "This is the work period and work time prediction algorithm to be included in WorkWatch",
    links: [
      "https://github.com/smiilliin/workwatch-learning",
      "https://velog.io/@smiilliin/주기-시간-예측-알고리즘",
    ],
    src: "/repositories/workwatch-learning/screenshot.png",
    alt: "screenshot.png",
    type: "image",
    maxWidth: 550,
  },
  {
    name: "gradation-wall",
    description: "Gradation wallpaper",
    links: ["https://github.com/smiilliin/gradation-wall"],
    src: "/repositories/gradation-wall",
    type: "iframe",
  },
  {
    name: "gaussian-simulator",
    description:
      "Approximate a discrete distribution to a Gaussian distribution",
    links: ["https://github.com/smiilliin/gaussian-simulator"],
    src: "/repositories/gaussian-simulator",
    type: "iframe",
  },
  {
    name: "NOPF-(core, server)",
    description:
      "Instead of connecting via port forwarding, connect using TCP hole punching.",
    links: [
      "https://github.com/smiilliin/nopf-core",
      "https://github.com/smiilliin/nopf-server",
    ],
    src: "/repositories/nopf/nopf-core.png",
    alt: "nopf-core.png",
    type: "image",
    maxWidth: 650,
  },
  {
    name: "asciiart",
    description:
      "Converts an image to a string ASCII string image, or displays the screen as a string image in real time.",
    links: ["https://github.com/smiilliin/asciiart"],
    src: "/repositories/asciiart/result.gif",
    alt: "result.gif",
    type: "image",
  },
  {
    name: "genetic-algorithm",
    description: "Genetic algorithm library",
    links: [
      "https://github.com/smiilliin/genetic-algorithm",
      "https://www.npmjs.com/package/@smiilliin/genetic-algorithm",
    ],
    src: "/repositories/genetic-algorithm/screenshot.png",
    alt: "screenshot.png",
    type: "image",
    maxWidth: 550,
  },
  {
    name: "token-generation",
    description: "Disable the refresh token",
    links: [
      "https://github.com/smiilliin/token-generation",
      "https://velog.io/@smiilliin/token-generation-구조",
      "https://www.npmjs.com/package/token-generation",
    ],
    src: "/repositories/token-generation/token.png",
    alt: "token.png",
    type: "image",
    maxWidth: 550,
  },
  {
    name: "sum-compress",
    description: "Encrypt and Decrypt with Sum-Compress",
    links: ["https://github.com/smiilliin/sum-compress"],
    src: "/repositories/sum-compress/file.png",
    alt: "comparison.png",
    type: "image",
    maxWidth: 550,
  },
  {
    name: "school-lunch",
    description: "upload school lunch to instagram",
    links: [
      "https://github.com/smiilliin/school-lunch",
      "https://www.instagram.com/neungjulunch/",
    ],
    src: "/repositories/school-lunch/screenshot.png",
    alt: "screenshot.png",
    type: "image",
    maxWidth: 550,
  },

  {
    name: "hiragana-learn",
    description: "Learn hiragana easily",
    links: [
      "https://github.com/smiilliin/index/tree/master/src/routes/hiragana",
    ],
    src: "/hiragana",
    type: "iframe",
  },
  {
    name: "ballinball",
    description: "simulation of a small ball colliding inside a big ball",
    links: ["https://github.com/smiilliin/ballinball"],
    src: "/repositories/ballinball",
    type: "iframe",
  },
  {
    name: "collision",
    description: "elastic collision simulation",
    links: ["https://github.com/smiilliin/collision"],
    src: "/repositories/collision",
    type: "iframe",
  },
  {
    name: "custom-lifegame",
    description:
      "Life game where you can change the live, death, and tickSpeed values",
    links: ["https://github.com/smiilliin/custom-lifegame"],
    src: "/repositories/custom-lifegame",
    type: "iframe",
  },
  {
    name: "mathcard",
    description: "solve math problem easily",
    links: ["https://github.com/smiilliin/mathcard"],
    src: "/repositories/mathcard/mathcard.png",
    alt: "mathcard.png",
    type: "image",
  },
  {
    name: "quicklink",
    description: "Quickly opens links",
    links: ["https://github.com/smiilliin/quicklink"],
    src: "/repositories/quicklink/quicklink.png",
    alt: "quicklink.png",
    type: "image",
    maxWidth: 350,
  },
  {
    name: "cozywall",
    description: "a cozy wallpaper program",
    links: [
      "https://github.com/smiilliin/cozywall",
      "https://smiilliin.com/repositories/cozywall",
    ],
    alt: "cozywall.gif",
    src: "/repositories/cozywall/cozywall.gif",
    type: "image",
  },
  {
    name: "save-alert",
    description: "This program helps you remember to save.",
    links: ["https://github.com/smiilliin/save-alert"],
    src: "/repositories/save-alert/save-alert.gif",
    type: "image",
    alt: "save-alert.gif",
    maxWidth: 750,
  },
  {
    name: "balls",
    description: "floating balls on the screen",
    links: ["https://github.com/smiilliin/balls"],
    src: "/repositories/balls",
    type: "iframe",
  },
  {
    name: "shoot",
    description: "simple shooting game",
    links: [
      "https://github.com/smiilliin/shoot",
      "https://smiilliin.com/repositories/shoot",
    ],
    src: "/repositories/shoot/shoot.png",
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
const PageButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const PageButton = styled(Button)`
  width: 50px;
  height: 50px;
  font-size: 30px;
`;
const FitIframeEmbed = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
const _FitIframe = ({
  className,
  src,
}: {
  className?: string;
  src: string;
}) => {
  return (
    <div className={className}>
      <FitIframeEmbed src={src}></FitIframeEmbed>
    </div>
  );
};
const FitIframe = styled(_FitIframe)`
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  aspect-ratio: 16 / 9;
  position: relative;
`;
const FitImage = styled.img`
  max-width: 1000px;
  width: 100%;
  object-fit: contain;
`;
const _RepositoryContainer = forwardRef(
  (
    {
      className,
      page,
      style,
    }: {
      className?: string;
      page: number;
      style?: React.CSSProperties;
    },
    ref
  ) => {
    return (
      <FlexCenterContainer
        className={className}
        ref={ref as React.Ref<HTMLDivElement>}
        style={style}
      >
        {repositories.slice(page * 5, (page + 1) * 5).map((repository) => {
          return (
            <div style={{ width: "100%" }} key={repository.name}>
              <div style={{ marginBottom: 10 }}>
                <h2>{repository.name}</h2>
                <h4>{repository.description}</h4>
                {repository.links.map((link) => (
                  <div key={link}>
                    <Link href={link} target="_blank" rel="noopener noreferrer">
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
            </div>
          );
        })}
      </FlexCenterContainer>
    );
  }
);
_RepositoryContainer.displayName = "_RepositoryContainer";

const RepositoryContainer = styled(_RepositoryContainer)`
  gap: 100px;
`;
const PageSelecter = ({
  page,
  changePage,
  style,
}: {
  page: number;
  changePage: (page: number) => void;
  style?: React.CSSProperties;
}) => {
  return (
    <FlexCenterContainer style={style}>
      <PageButtonContainer>
        {new Array(Math.floor((repositories.length - 1) / 5 + 1))
          .fill(0)
          .map((_, i) => i + 1)
          .map((i) => (
            <PageButton
              key={i}
              style={page == i - 1 ? { backgroundColor: "skyblue" } : {}}
              onClick={() => changePage(i - 1)}
            >
              {i}
            </PageButton>
          ))}
      </PageButtonContainer>
    </FlexCenterContainer>
  );
};

export {
  repositories,
  PageButton,
  PageButtonContainer,
  RepositoryContainer,
  PageSelecter,
};
