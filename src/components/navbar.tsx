import React from "react";
import styled from "styled-components";
import { Button } from "./button";
import Ranks from "@/components/ranks";

const NavBarContainer = styled.div`
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
  overflow: hidden;
  gap: 10px;
`;
const ID = styled.span`
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface IENavbar {
  id?: string;
  rankStrings?: Array<string>;
}
const NavBar = ({ id, rankStrings }: IENavbar) => {
  return (
    <NavBarContainer>
      <IDRank>
        <ID>{id}</ID>
        <Ranks rankStrings={rankStrings || []}></Ranks>
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
    </NavBarContainer>
  );
};
export default NavBar;
export { ID, IDRank };
