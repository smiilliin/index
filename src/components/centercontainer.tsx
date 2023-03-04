import styled from "styled-components";
import { ReactElement } from "react";
import React from "react";

const NavCenterContainer = styled.div`
  overflow-y: auto;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - var(--nav-size));
`;
const CenterContainer = styled.div`
  overflow-y: auto;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh);
`;

export default ({ nav, children }: { nav?: boolean; children: ReactElement<any> | ReactElement<any>[] }) => {
  if (nav) {
    return <NavCenterContainer>{children}</NavCenterContainer>;
  } else {
    return <CenterContainer>{children}</CenterContainer>;
  }
};
