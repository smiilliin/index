import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CenterContainer, FlexCenterContainer } from "../components/containers";
import { Button } from "../components/buttons";
import styled, { keyframes } from "styled-components";
import Explode from "../images/explode.svg";
import { useIntl } from "react-intl";
import Github from "../images/github.svg";
import Gmail from "../images/gmail.ico";
import Instagram from "../images/instagram.ico";
import Velog from "../images/velog.ico";
import { PageSelecter, RepositoryContainer } from "../repositories";
import DownArrowImage from "../images/down-arrow.svg";
import { AppContext } from "../App";
import { checkAccessToken } from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ButtonContainer = styled.div`
  position: fixed;
  width: auto;
  height: auto;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 1;
`;
const ID = styled.span`
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1;
`;
const Icon = styled.img.attrs(() => {
  return { src: Explode };
})`
  margin-bottom: 10px;
  width: 200px;
  height: 200px;
  filter: drop-shadow(0 0 8px #ffcb4c);
`;
const H2 = styled.h2`
  color: gray;
`;
const Scroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: auto;
`;
const Icons = styled.div`
  text-align: center;
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

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
const _DownArrow = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <img
        src={DownArrowImage}
        width={0}
        height={0}
        style={{ width: "100%", height: "100%" }}
        alt="DownArrow"
      ></img>
    </div>
  );
};
const DownArraw = styled(_DownArrow)`
  width: 30px;
  height: 30px;
  animation: ${DownArrowKeyframe} 1s ease-in-out infinite;
  bottom: 0px;
`;

function Index() {
  const intl = useIntl();
  const [page, setPage] = useState(0);
  const [id, setID] = useState<string | null>(null);

  const repositoriesContainer = useRef<HTMLDivElement>(null);
  const changePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      repositoriesContainer.current?.scrollIntoView();
    },
    [setPage]
  );

  const context = useContext(AppContext);

  useEffect(() => {
    document.title = "smiilliin";

    checkAccessToken(context).then((accessToken) => {
      if (accessToken) {
        try {
          const id = jwtDecode<{ id: string }>(accessToken).id;
          if (!id) return;

          setID(id);
        } catch (err) {
          console.error(err);
        }
      } else {
        setID("");
      }
    });
  }, [context]);

  const navigate = useNavigate();

  return (
    <Scroll>
      {id != null && id != "" ? (
        <>
          <ID>{id}</ID>
          <ButtonContainer>
            <Button
              onClick={() => {
                fetch(
                  `https://index-back.${process.env.REACT_APP_URL}/logout`,
                  { method: "POST", credentials: "include" }
                )
                  .then((data) => data.json())
                  .then(() => {
                    context.setAccessToken(null);
                    setID(null);
                  });
              }}
            >
              {intl.formatMessage({ id: "logout" })}
            </Button>
          </ButtonContainer>
        </>
      ) : (
        <></>
      )}
      {id == "" ? (
        <ButtonContainer>
          <Button onClick={() => navigate("/signin")}>
            {intl.formatMessage({ id: "signin" })}
          </Button>
          <Button onClick={() => navigate("/signup")}>
            {intl.formatMessage({ id: "signup" })}
          </Button>
        </ButtonContainer>
      ) : (
        <></>
      )}
      {/* {id != undefined ?  : <></>} */}
      <CenterContainer style={{ height: "calc(100vh - 50px)" }}>
        <Icon></Icon>
        <h1>👋 SMIILLIIN - Smile</h1>
        <H2>{intl.formatMessage({ id: "welcome" })}</H2>

        <Icons>
          <a href="https://github.com/smiilliin">
            <img src={Github} width={30} alt="github"></img>
          </a>
          <a href="https://instagram.com/smiilliin">
            <img src={Instagram} width={30} alt="instagram"></img>
          </a>
          <a href="https://velog.io/@smiilliin/">
            <img src={Velog} width={30} alt="velog"></img>
          </a>
          <a href="mailto:smiilliin00@gamil.com">
            <img src={Gmail} width={30} alt="gmail"></img>
          </a>
        </Icons>
      </CenterContainer>
      <FlexCenterContainer style={{ height: 50 }}>
        <DownArraw></DownArraw>
      </FlexCenterContainer>
      <RepositoryContainer
        style={{ marginTop: 100, marginBottom: 50 }}
        page={page}
        ref={repositoriesContainer}
      ></RepositoryContainer>
      <PageSelecter
        style={{ marginBottom: 20 }}
        page={page}
        changePage={changePage}
      ></PageSelecter>
    </Scroll>
  );
}

export { Index };
