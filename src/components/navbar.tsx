import React from "react";
import styled from "styled-components";
import { Button } from "./button";
import Ranks from "@/components/ranks";

const NavBar = styled.div`
  // padding-top: 8px;
  background-color: #121414;
  width: 100vw;
  height: 40px;
  padding-left: 10px;
  display: grid;
  position: absolute;
  left: 0;
  top: 0;
  grid-template-columns: 1fr calc(
      (var(--button-width) + var(--button-margin) * 2) * 2
    );
  align-items: center;
`;
const Buttons = styled.div`
  text-align: right;
`;
const IDRank = styled.div`
  display: flex;
  gap: 10px;
`;
const ID = styled.span`
  text-align: left;
`;

interface IENavbar {
  id?: string;
  rankStrings?: Array<string>;
}
export default ({ id, rankStrings }: IENavbar) => {
  return (
    <NavBar>
      <IDRank>
        <ID>{id}</ID>
        <Ranks rankStrings={rankStrings || new Array()}></Ranks>
      </IDRank>

      <Buttons>
        {!id && (
          <>
            <Button href="/login">LOGIN</Button>
            <Button href="/signup">SIGNUP</Button>
          </>
        )}
        {id && <Button href="/logout">LOGOUT</Button>}
      </Buttons>
    </NavBar>
  );
};
export { ID, IDRank };
