import styled, { createGlobalStyle } from "styled-components";

export const NoAlignCenter = styled.div`
  display: flex;
  width: 100vw;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: 30px;
`;

export const RemoveMinHeight = createGlobalStyle`
  body {
    min-height: auto !important; /* 覆蓋全局樣式 */
  }
`;
