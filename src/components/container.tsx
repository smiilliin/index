import styled from "styled-components";
import { ReactElement } from "react";
import React from "react";

const Container = styled.div`
  overflow-y: auto;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`;

export default ({ children }: { children: ReactElement<any> | ReactElement<any>[] }) => {
  return <Container>{children}</Container>;
};
