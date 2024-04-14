import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import CenterContainer from "@/components/centercontainer";
import { DoneModal, hiraganaData } from ".";
import { ButtonStyle } from "@/components/button";

const Container = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 8fr) minmax(0, 1fr);
  width: calc(100vw - 100px);
  max-width: 600px;
  height: 500px;
  align-items: center;
  border-radius: 20px;
  border: 1px solid gray;
  overflow-y: hidden;
  position: relative;
  padding-bottom: 30px;
`;
const PronunP = styled.p`
  font-size: 50px;
`;
const BottomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const Progress = styled.p`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const SelectButton = styled.button`
  ${ButtonStyle}
  width: 45px;
  height: 45px;
  font-weight: 500;
  font-size: 40px;
`;

const EventContainer = styled.span`
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--second-color);
  border-radius: 50%;
  cursor: pointer;
`;
const EventDisplayer = styled.span`
  font-size: 70px;
  font-weight: 600;
`;
const Good = styled(EventDisplayer)`
  color: green;
`;
const Bad = styled(EventDisplayer)`
  color: red;
`;

const Hiragana = () => {
  const [cards, cardsCount, cardsCopy] = useMemo(() => {
    const hiragana = Object.entries(hiraganaData);
    const result = [];

    while (hiragana.length != 0) {
      const pickIndex = Math.floor(Math.random() * hiragana.length);

      result.push(hiragana[pickIndex]);
      hiragana.splice(pickIndex, 1);
    }
    return [result, result.length, [...result]];
  }, [hiraganaData]);
  const [currentCard, setCurrentCard] = useState<[string, string]>(["", ""]);

  const [progress, setProgress] = useState(0);
  const [failedCard, setFailedCard] = useState<[string, string][]>([]);

  const [selectList, setSelectList] = useState<[string, string][]>([]);

  const [pickEvent, setPickEvent] = useState<boolean | null>(null);

  const pickCard = useCallback(
    (card: [string, string], ignore?: boolean) => {
      if (card[0] != currentCard[0]) {
        failedCard.push(currentCard);
        setFailedCard([...failedCard]);
        if (!ignore) setPickEvent(false);
      } else {
        if (!ignore) setPickEvent(true);
      }

      if (!ignore) {
        setTimeout(() => {
          setPickEvent(null);
        }, 1000);
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
    },
    [cards, setCurrentCard, progress, setProgress, failedCard, currentCard]
  );
  useEffect(() => {
    const filteredCards = cardsCopy.filter(([key]) => key != currentCard[0]);
    const result = [];

    for (let i = 0; i < 5; i++) {
      const currentIndex = Math.floor(Math.random() * filteredCards.length);
      result.push(filteredCards[currentIndex]);

      filteredCards.splice(currentIndex, 1);
    }
    result[Math.floor(Math.random() * 5)] = currentCard;

    setSelectList(result);
  }, [currentCard, cardsCopy, setSelectList]);

  useEffect(() => {
    pickCard(currentCard, true);
  }, []);

  return (
    <>
      <Head>
        <title>발음</title>
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
            {pickEvent != null ? (
              <EventContainer>
                {pickEvent == true ? (
                  <Good className="material-symbols-outlined">done</Good>
                ) : (
                  <></>
                )}
                {pickEvent == false ? (
                  <Bad className="material-symbols-outlined">close</Bad>
                ) : (
                  <></>
                )}
              </EventContainer>
            ) : (
              <></>
            )}

            <PronunP>{currentCard[1]}</PronunP>
            <BottomContainer>
              <SelectButton
                onClick={() => pickCard(selectList?.[0] || ["", ""])}
              >
                {selectList?.[0]?.[0]}
              </SelectButton>
              <SelectButton
                onClick={() => pickCard(selectList?.[1] || ["", ""])}
              >
                {selectList?.[1]?.[0]}
              </SelectButton>
              <SelectButton
                onClick={() => pickCard(selectList?.[2] || ["", ""])}
              >
                {selectList?.[2]?.[0]}
              </SelectButton>
              <SelectButton
                onClick={() => pickCard(selectList?.[3] || ["", ""])}
              >
                {selectList?.[3]?.[0]}
              </SelectButton>
              <SelectButton
                onClick={() => pickCard(selectList?.[4] || ["", ""])}
              >
                {selectList?.[4]?.[0]}
              </SelectButton>
            </BottomContainer>
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
