import styled from 'styled-components';
import theme from '../../styles/theme';

export const BasicPage = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${theme.colors.background};

  main {
    padding: 32px ${theme.main.padding_x}px;
  }
`;
