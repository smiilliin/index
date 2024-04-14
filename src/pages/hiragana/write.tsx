import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import styled from "styled-components";
import CenterContainer from "@/components/centercontainer";
import { DoneModal, Hider, hiraganaData } from ".";

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  width: calc(100vw - 100px);
  max-width: 600px;
  height: 500px;
  align-items: center;
  border-radius: 20px;
  border: 1px solid gray;
  overflow-y: hidden;
  position: relative;
`;
const HiraganaP = styled.p`
  font-size: 100px;
`;
const PronunP = styled.p`
  font-size: 50px;
`;
const CanvasContainer = styled.div`
  grid-column: 1/3;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid gray;
`;
const Canvas = styled.canvas`
  width: 100%;
  height: 90%;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
`;
const Tool = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  user-select: none;
  cursor: pointer;
  height: 10%;
`;
const HiraganaContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const NextContainer = styled.span`
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: absolute;
  right: 10px;
  background-color: var(--second-color);
  border-radius: 50%;
  cursor: pointer;
`;
const Button = styled.span`
  font-size: 35px;
  font-weight: 500;
  user-select: none;
`;
const Progress = styled.p`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Hiragana = () => {
  const [rendered, setRendered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setRendered(true);

    window.addEventListener("resize", () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
      }
    });
  }, [setRendered]);

  const canvasCtx = useMemo<CanvasRenderingContext2D | undefined | null>(() => {
    return canvasRef.current?.getContext("2d");
  }, [rendered]);
  const [pen, setPen] = useState(true);
  const [startedDrawing, setStartedDrawing] = useState(false);

  useEffect(() => {
    if (!canvasCtx || !canvasRef.current) return;

    canvasCtx.canvas.width = canvasCtx.canvas.clientWidth;
    canvasCtx.canvas.height = canvasCtx.canvas.clientHeight;
  }, [canvasCtx]);

  const [opened, setOpened] = useState(false);

  const [cards, cardsCount] = useMemo(() => {
    const hiragana = Object.entries(hiraganaData);
    const result = [];

    while (hiragana.length != 0) {
      const pickIndex = Math.floor(Math.random() * hiragana.length);

      result.push(hiragana[pickIndex]);
      hiragana.splice(pickIndex, 1);
    }
    return [result, result.length];
  }, [hiraganaData]);
  const [currentCard, setCurrentCard] = useState<[string, string]>(["", ""]);

  const [progress, setProgress] = useState(0);
  const [failedCard, setFailedCard] = useState<[string, string][]>([]);

  const hiderRef = useRef<HTMLDivElement>(null);

  const pickCard = useCallback(
    (success: boolean) => {
      if (!success) {
        failedCard.push(currentCard);
        setFailedCard([...failedCard]);
      }

      if (
        (((progress - 1) % 10) + 1 == 10 || progress == cardsCount) &&
        failedCard.length != 0
      ) {
        setCurrentCard(failedCard[0]);
        failedCard.splice(0, 1);
        setFailedCard([...failedCard]);
      } else {
        if (cards.length == 0) return;
        setCurrentCard(cards[0]);
        cards.splice(0, 1);
        setProgress(progress + 1);
      }
      canvasCtx?.clearRect(
        0,
        0,
        canvasRef?.current?.clientWidth || 0,
        canvasRef?.current?.clientHeight || 0
      );
      if (hiderRef.current) hiderRef.current.style.transform = "";
    },
    [
      cards,
      setCurrentCard,
      progress,
      setProgress,
      failedCard,
      currentCard,
      hiderRef,
      canvasCtx,
      canvasRef,
    ]
  );

  useEffect(() => {
    pickCard(true);
  }, []);

  return (
    <>
      <Head>
        <title>쓰기</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, 
  user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#121414" />
        <meta name="description" content="Smile - smiilliin" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </Head>
      <main>
        <CenterContainer>
          <Progress>
            {progress}/{cardsCount}
          </Progress>
          <Container>
            <CanvasContainer>
              <Tool
                className="material-symbols-outlined"
                onClick={() => setPen(true)}
              >
                edit
              </Tool>
              <Tool
                className="material-symbols-outlined"
                onClick={() => setPen(false)}
              >
                ink_eraser
              </Tool>
              <Tool
                className="material-symbols-outlined"
                onClick={() =>
                  canvasCtx?.clearRect(
                    0,
                    0,
                    canvasRef?.current?.clientWidth || 0,
                    canvasRef?.current?.clientHeight || 0
                  )
                }
              >
                delete
              </Tool>
              <Canvas
                ref={canvasRef}
                onPointerDown={(event) => {
                  if (!canvasCtx) return;

                  if (pen) {
                    canvasCtx.lineWidth = 5;
                    canvasCtx.lineCap = "round";
                    canvasCtx.strokeStyle = "#ffffff";
                    canvasCtx.globalCompositeOperation = "source-over";

                    canvasCtx.beginPath();

                    const rect = event.currentTarget.getBoundingClientRect();
                    const mousePos = {
                      x: event.clientX - rect.left,
                      y: event.clientY - rect.top,
                    };

                    canvasCtx.moveTo(mousePos.x, mousePos.y);

                    setStartedDrawing(true);
                  } else {
                    canvasCtx.globalCompositeOperation = "destination-out";
                    canvasCtx.beginPath();
                    setStartedDrawing(true);
                  }
                }}
                onPointerMove={(event) => {
                  if (!canvasCtx) return;

                  const rect = event.currentTarget.getBoundingClientRect();
                  const mousePos = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  };

                  if (pen) {
                    if (!startedDrawing) return;

                    canvasCtx.lineTo(mousePos.x, mousePos.y);

                    canvasCtx.stroke();
                  } else {
                    if (!startedDrawing) return;

                    canvasCtx.arc(
                      mousePos.x,
                      mousePos.y,
                      16,
                      0,
                      Math.PI * 2,
                      false
                    );
                    canvasCtx.fill();
                  }
                }}
                onPointerUp={() => {
                  setStartedDrawing(false);
                }}
                onPointerLeave={() => {
                  setStartedDrawing(false);
                }}
              ></Canvas>
            </CanvasContainer>
            <PronunP>{currentCard[1]}</PronunP>
            <HiraganaContainer>
              <Hider
                opened={opened}
                setOpened={setOpened}
                ref={hiderRef}
              ></Hider>
              <HiraganaP>{currentCard[0]}</HiraganaP>
            </HiraganaContainer>
            <NextContainer>
              <Button
                className="material-symbols-outlined"
                onClick={() => pickCard(true)}
              >
                done
              </Button>
              <Button
                className="material-symbols-outlined"
                onClick={() => pickCard(false)}
              >
                close
              </Button>
            </NextContainer>
          </Container>
        </CenterContainer>
        <DoneModal
          isOpen={cards.length == 0 && failedCard.length == 0}
        ></DoneModal>
      </main>
    </>
  );
};

export default Hiragana;
