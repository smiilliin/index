import React, { useCallback, useMemo, useRef, useState } from "react";
import CenterContainer from "@/components/centercontainer";
import styled from "styled-components";
import { ButtonStyle } from "@/components/button";
import { IMenu, MenuManager, MenuPosition } from "@/components/menu";
import Input from "@/components/input";
import Head from "next/head";

const Table = styled.div`
  position: fixed;
  right: 20px;
  top: 10px;
  display: flex;
  flex-direction: column;
`;
const History = styled.div`
  position: fixed;
  left: 20px;
  top: 10px;
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  // width: 600px;
  width: calc(100vw - 100px);
  max-width: 600px;
  align-items: center;
`;
const LargeButton = styled.button`
  ${ButtonStyle}
  width: 100%;
  height: 60px;
  font-weight: 600;
  font-size: 20px;
`;
const NormalButton = styled.button`
  ${ButtonStyle}
  width: 100%;
  height: 40px;
  font-weight: 600;
  font-size: 20px;
  margin-top: 10px;
`;
const NormalContainer = styled.div`
  display: flex;
  flex-direction: rows;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;
const SaveMenuContainer = styled.form`
  width: 250px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--second-color);
  display: flex;
  flex-direction: row;
`;
const SaveMenuButton = styled.button`
  ${ButtonStyle}
  width: 100%;
  height: 100%;
  font-weight: 600;
  flex: 1;
  margin: 0;
`;

interface IESaveMenu {
  histories: IHistory[];
  setHistories: React.Dispatch<React.SetStateAction<IHistory[]>>;
  setLostScore: React.Dispatch<number>;
  setCount: React.Dispatch<Map<number, number>>;
  lostScore: number;
}
const SaveMenu = ({
  histories,
  setHistories,
  lostScore,
  setLostScore,
  setCount,
}: IESaveMenu) => {
  const saveHistory = useCallback(
    (name: string, score: number) => {
      histories.push({ name: name, score: score });
      setHistories([...histories]);
      setLostScore(0);
      setCount(new Map());
    },
    [histories, setHistories]
  );
  const scoreRef = useRef<HTMLInputElement>(null);

  return (
    <SaveMenuContainer
      onClick={(event) => event.stopPropagation()}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        type="text"
        name="name"
        placeholder="이름"
        ref={scoreRef}
        style={{ width: "60%", padding: 10 }}
      ></Input>
      <SaveMenuButton
        type="submit"
        onClick={() =>
          saveHistory(scoreRef.current?.value || "", 100 - lostScore)
        }
      >
        일반
      </SaveMenuButton>
      <SaveMenuButton
        type="submit"
        onClick={() =>
          saveHistory(scoreRef.current?.value || "", 50 - lostScore)
        }
      >
        탐구
      </SaveMenuButton>
    </SaveMenuContainer>
  );
};

const ScoreP = styled.p`
  font-weight: 600;
  font-size: 20px;
`;
const CountP = styled.p`
  font-weight: 600;
  font-size: 18px;
`;
const HistoryP = styled.p`
  font-weight: 600;
  font-size: 18px;
`;

interface IHistory {
  name: string;
  score: number;
}

const Score = () => {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [menus, setMenus] = useState<IMenu[]>([]);
  const menuManager = useMemo(
    () => new MenuManager(menus, setMenus),
    [menus, setMenus]
  );
  const [lostScore, setLostScore] = useState(0);
  const [count, setCount] = useState<Map<number, number>>(new Map());
  const addLostScore = useCallback(
    (score: number) => {
      setCount(count.set(score, (count.get(score) || 0) + 1)),
        setLostScore(lostScore + score);
    },
    [count, setCount, lostScore, lostScore]
  );
  const [histories, setHistories] = useState<IHistory[]>([]);
  const menu = (
    <MenuPosition target={saveRef} right={100} top={45}>
      <SaveMenu
        histories={histories}
        setHistories={setHistories}
        lostScore={lostScore}
        setCount={setCount}
        setLostScore={setLostScore}
      ></SaveMenu>
    </MenuPosition>
  );

  return (
    <>
      <Head>
        <title>Score</title>
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
        <Table>
          {Array.from(count).map(([score, count]) => (
            <CountP key={score}>
              -{score}점 {count}개
            </CountP>
          ))}
        </Table>
        <History>
          {histories.map(({ name, score }, i) => (
            <HistoryP key={name + i}>
              {name}: {score}점
            </HistoryP>
          ))}
        </History>
        <CenterContainer>
          <Container>
            <ScoreP>
              {100 - lostScore}점(일반) / {50 - lostScore}점(탐구)
            </ScoreP>
            <LargeButton onClick={() => addLostScore(2)}>2점 틀림</LargeButton>
            <LargeButton onClick={() => addLostScore(4)}>4점 틀림</LargeButton>
            <LargeButton onClick={() => addLostScore(3)}>3점 틀림</LargeButton>
            <LargeButton onClick={() => addLostScore(1)}>1점 틀림</LargeButton>
            <LargeButton onClick={() => addLostScore(5)}>5점 틀림</LargeButton>
            <NormalContainer>
              <NormalButton
                onClick={() => {
                  setLostScore(0);
                  setCount(new Map());
                }}
              >
                점수 초기화
              </NormalButton>
              <NormalButton
                ref={saveRef}
                onClick={(event) => {
                  event.stopPropagation();

                  if (menuManager.getIndex("savemenu") == -1) {
                    menuManager.closeAllMenu();

                    const closeMenu = () => {
                      if (!menuManager.called) {
                        menuManager.called = true;
                        menuManager.closeAllMenu();
                        menuManager.called = false;
                      }
                      document.removeEventListener("click", closeMenu);
                    };
                    document.addEventListener("click", closeMenu);

                    menuManager.addMenu(menu, "savemenu", () => {});
                  }
                }}
              >
                과목 저장
              </NormalButton>
            </NormalContainer>
          </Container>
        </CenterContainer>
        {menuManager.render()}
      </main>
    </>
  );
};

export default Score;
