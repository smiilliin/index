import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { DoneModal, hiraganaData, hiraganaTtakData } from ".";
import { useSearchParams } from "react-router-dom";
import { CenterContainer } from "../../components/containers";
import { Button } from "../../components/buttons";
import "./icon.css";

const Container = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 8fr) minmax(0, 1fr);
  width: calc(100vw - 100px);
  max-width: 600px;
  height: 500px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid gray;
  overflow-y: hidden;
  position: relative;
  padding-bottom: 30px;
`;
const PronunP = styled.p`
  font-size: 80px;
  text-align: center;
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
const SelectButton = styled(Button)`
  width: 45px;
  height: 45px;
  font-weight: 500;
  font-size: 30px;
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
  font-size: 70px !important;
  font-weight: 600;
`;
const Good = styled(EventDisplayer)`
  color: green;
`;
const Bad = styled(EventDisplayer)`
  color: red;
`;

const Hiragana = () => {
  const [params] = useSearchParams();

  const [cards, cardsCount, cardsCopy] = useMemo(() => {
    const flag = Number(params.get("flag") || 0);
    let hiragana: [string, string][] = [];

    if (flag & (1 << 0)) {
      hiragana = Object.entries(hiraganaData);
    }
    if (flag & (1 << 1)) {
      hiragana = [...hiragana, ...Object.entries(hiraganaTtakData)];
    }

    const result = [];

    while (hiragana.length != 0) {
      const pickIndex = Math.floor(Math.random() * hiragana.length);

      result.push(hiragana[pickIndex]);
      hiragana.splice(pickIndex, 1);
    }
    return [result, result.length, [...result]];
  }, [hiraganaData, params, hiraganaTtakData]);
  const [currentCard, setCurrentCard] = useState<[string, string]>(["", ""]);

  const [progress, setProgress] = useState(0);
  const [failedCard, setFailedCard] = useState<[string, string][]>([]);

  const [selectList, setSelectList] = useState<[string, string][]>([]);

  const [pickEvent, setPickEvent] = useState<boolean | null>(null);
  const [eventTimeout, setEventTimeout] = useState<NodeJS.Timeout | null>(null);
  const [done, setDone] = useState(false);

  const pickCard = useCallback(
    (card: [string, string], ignore?: boolean) => {
      if (card[1] != currentCard[1]) {
        failedCard.push(currentCard);
        setFailedCard([...failedCard]);
        if (!ignore) setPickEvent(false);
      } else {
        if (!ignore) setPickEvent(true);
      }

      if (!ignore) {
        if (eventTimeout) clearTimeout(eventTimeout);

        setEventTimeout(
          setTimeout(() => {
            setPickEvent(null);
            setEventTimeout(null);
          }, 1000)
        );
      }

      if (
        (((progress - 1) % 10) + 1 == 10 || progress == cardsCount) &&
        failedCard.length != 0
      ) {
        if (failedCard.length == 0) {
          setDone(true);
          return;
        }

        setCurrentCard([...failedCard[0]]);
        failedCard.splice(0, 1);
        setFailedCard([...failedCard]);
      } else {
        if (cards.length == 0) {
          setDone(true);
          return;
        }

        setCurrentCard([...cards[0]]);
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
    if (cards.length == 0) return;

    pickCard(currentCard, true);
  }, [cards]);

  return (
    <>
      <CenterContainer>
        <Progress>
          {progress - failedCard.length}/{cardsCount} -{" "}
          {Math.floor((progress - 1) / 10) + 1}세트
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
            <SelectButton onClick={() => pickCard(selectList?.[0] || ["", ""])}>
              {selectList?.[0]?.[0]}
            </SelectButton>
            <SelectButton onClick={() => pickCard(selectList?.[1] || ["", ""])}>
              {selectList?.[1]?.[0]}
            </SelectButton>
            <SelectButton onClick={() => pickCard(selectList?.[2] || ["", ""])}>
              {selectList?.[2]?.[0]}
            </SelectButton>
            <SelectButton onClick={() => pickCard(selectList?.[3] || ["", ""])}>
              {selectList?.[3]?.[0]}
            </SelectButton>
            <SelectButton onClick={() => pickCard(selectList?.[4] || ["", ""])}>
              {selectList?.[4]?.[0]}
            </SelectButton>
          </BottomContainer>
        </Container>
      </CenterContainer>
      <DoneModal isOpen={done}></DoneModal>
    </>
  );
};

export default Hiragana;
