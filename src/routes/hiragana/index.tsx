import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { CenterContainer } from "../../components/containers";
import { Link } from "../../components/link";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  padding-top: 50px;
  padding-bottom: 20px;
`;
const Title = styled.p`
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: 800;
`;
const Background1 = styled.p`
  position: fixed;
  left: max(15px, 3vw);
  top: 20vh;
  font-size: 150px;
  transform: rotate(-15deg);
  z-index: -1;
  pointer-events: none;
  opacity: 0.2;
`;
const Background2 = styled.p`
  position: fixed;
  right: max(25px, 5vw);
  top: 40vh;
  font-size: 80px;
  transform: rotate(15deg);
  z-index: -1;
  pointer-events: none;
  opacity: 0.15;
`;

const Index = () => {
  const hiraganaRef = useRef<HTMLInputElement>(null);
  const ttakRef = useRef<HTMLInputElement>(null);
  const [currentText, setCurrentText] = useState("ひ");
  const [currentPron, setCurrentPron] = useState("hi");

  useEffect(() => {
    const allHiragana = [
      ...Object.keys(hiraganaData),
      ...Object.keys(hiraganaTtakData),
    ];
    const allHiraganaPron = [
      ...Object.values(hiraganaData),
      ...Object.values(hiraganaTtakData),
    ];

    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * allHiragana.length);
      setCurrentText(allHiragana[index]);
      setCurrentPron(allHiraganaPron[index]);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setCurrentText]);

  const redirectTo = (link: string) => {
    let flag = 0;

    if (hiraganaRef.current?.checked) {
      flag |= 1 << 0;
    }
    if (ttakRef.current?.checked) {
      flag |= 1 << 1;
    }
    if (flag == 0) {
      alert("아무것도 선택하지 않을 수 없습니다.");
      return;
    }

    window.location.href = `${link}?flag=${flag}`;
  };

  return (
    <>
      <Background1>{currentText}</Background1>
      <Background2>{currentPron}</Background2>
      <CenterContainer>
        <Title>히라가나 공부하기</Title>
        <Container>
          <Link onClick={() => redirectTo("/hiragana/pron")}>발음</Link>
          <Link onClick={() => redirectTo("/hiragana/hiragana")}>히라가나</Link>
          <Link onClick={() => redirectTo("/hiragana/write")}>쓰기</Link>
        </Container>
        <Container>
          <label>
            <input
              type="checkbox"
              ref={hiraganaRef}
              defaultChecked={true}
            ></input>
            <span>히라가나</span>
          </label>
          <label>
            <input type="checkbox" ref={ttakRef}></input>
            <span>탁음&반탁음</span>
          </label>
        </Container>
      </CenterContainer>
    </>
  );
};

interface IEDoneModal {
  isOpen: boolean;
}
const DoneModal = ({ isOpen }: IEDoneModal) => {
  const hiraganaRef = useRef<HTMLInputElement>(null);
  const ttakRef = useRef<HTMLInputElement>(null);
  const redirectTo = (link: string) => {
    let flag = 0;

    if (hiraganaRef.current?.checked) {
      flag |= 1 << 0;
    }
    if (ttakRef.current?.checked) {
      flag |= 1 << 1;
    }
    if (flag == 0) {
      alert("아무것도 선택하지 않을 수 없습니다.");
      return;
    }

    window.location.href = `${link}?flag=${flag}`;
  };

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
          height: 300,
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
        <h2>학습을 완료했습니다🔥</h2>
        <Link onClick={() => location.reload()}>새로고침</Link>
      </div>
      <Container>
        <Link onClick={() => redirectTo("/hiragana/pron")}>발음</Link>
        <Link onClick={() => redirectTo("/hiragana/hiragana")}>히라가나</Link>
        <Link onClick={() => redirectTo("/hiragana/write")}>쓰기</Link>
      </Container>
      <Container>
        <label>
          <input
            type="checkbox"
            ref={hiraganaRef}
            defaultChecked={true}
          ></input>
          <span>히라가나</span>
        </label>
        <label>
          <input type="checkbox" ref={ttakRef}></input>
          <span>탁음&반탁음</span>
        </label>
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
  text-align: center;
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
  を: "wo",
  ん: "n",
};
const hiraganaTtakData = {
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
};

export default Index;

export { hiraganaData, hiraganaTtakData };
