import React from "react";
import styled from "styled-components";
import { Button } from "./button";

const NavBar = styled.div`
  position: sticky;
  top: 0px;
  left: 0px;
  padding-top: 8px;
  background-color: var(--second-color);
  width: 100vw;
  height: 40px;
  padding-left: 10px;
  display: grid;
  grid-template-columns: 1fr calc((var(--button-width) + var(--button-margin) * 2) * 2);
`;
const Buttons = styled.div`
  text-align: right;
`;

export default ({ id }: { id?: string }) => {
  return (
    <NavBar>
      {id ? <p>{id}</p> : <div></div>}

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
