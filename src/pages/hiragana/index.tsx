import CenterContainer from "@/components/centercontainer";
import Link from "@/components/link";
import Head from "next/head";
import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  padding: 50px;
`;
const Title = styled.p`
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: 800;
`;

const Index = () => {
  return (
    <>
      <Head>
        <title>히라가나 배우기</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, 
user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#121414" />
        <meta name="description" content="Smile - smiilliin" />
      </Head>
      <main>
        <CenterContainer>
          <Title>히라가나 공부하기</Title>
          <Container>
            <Link href="/hiragana/pron">발음</Link>
            <Link href="/hiragana/hiragana">히라가나</Link>
            <Link href="/hiragana/write">쓰기</Link>
          </Container>
        </CenterContainer>
      </main>
    </>
  );
};

interface IEDoneModal {
  isOpen: boolean;
}
const DoneModal = ({ isOpen }: IEDoneModal) => {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      style={{
        overlay: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: 500,
          height: 250,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--first-color)",
          border: 0,
          borderRadius: 20,
        },
      }}
      contentLabel="끝났어요!"
      shouldCloseOnOverlayClick={false}
    >
      <div>
        <h2>학습을 완료했습니다</h2>
        <Link onClick={() => location.reload()}>새로고침</Link>
      </div>
      <Container>
        <Link href="/hiragana/pron">발음</Link>
        <Link href="/hiragana/hiragana">히라가나</Link>
        <Link href="/hiragana/write">쓰기</Link>
      </Container>
    </Modal>
  );
};
export { DoneModal };

const HiderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: gray;
  padding-top: 10px;
  font-weight: 500;
  font-size: 50px;
  border-radius: 10px;
  border: 1px solid gray;
  cursor: pointer;
  user-select: none;
  touch-action: none;
`;

interface IEHider {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Hider = forwardRef<HTMLDivElement, IEHider>(
  ({ opened, setOpened }, ref) => {
    const [startedDragging, setStartedDragging] = useState(false);
    const [hidePositionOffset, setHidePositionOffset] = useState(0);

    return (
      <HiderContainer
        ref={ref}
        className="material-symbols-outlined"
        onPointerDown={(event) => {
          setStartedDragging(true);

          const rect = event.currentTarget.getBoundingClientRect();
          setHidePositionOffset(rect.top);
        }}
        onPointerMove={(event) => {
          if (!startedDragging) return;

          let transform = (event.clientY - hidePositionOffset) * 0.9;

          const rect = event.currentTarget.getBoundingClientRect();

          if (transform / rect.height >= 0.8) {
            transform = rect.height * 0.8;
            setOpened(true);
          } else {
            setOpened(false);
          }
          if (transform < 0) transform = 0;

          event.currentTarget.style.transform = `translate(0, ${transform}px)`;
        }}
        onPointerUp={(event) => {
          setStartedDragging(false);

          if (opened) return;
          event.currentTarget.style.transform = "";
        }}
        onPointerLeave={(event) => {
          setStartedDragging(false);

          if (opened) return;
          event.currentTarget.style.transform = "";
        }}
      >
        expand_more
      </HiderContainer>
    );
  }
);
Hider.displayName = "Hider";

export { Hider };

const hiraganaData = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "hu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "o",
  ん: "N",
};

export default Index;

export { hiraganaData };
