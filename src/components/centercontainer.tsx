import styled from "styled-components";

const CenterContainer = styled.div`
  overflow-y: auto;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;

export default CenterContainer;
