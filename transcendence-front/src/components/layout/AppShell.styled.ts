import styled from "styled-components";


export const Shell = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
`;

export const Main = styled.main`
  padding: ${({ theme }) => theme.space(3)};
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
`;