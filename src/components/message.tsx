import styled from "styled-components";

const Message = styled.span``;

export default ({ children }: { children: string }) => {
  return <Message>{children}</Message>;
};
