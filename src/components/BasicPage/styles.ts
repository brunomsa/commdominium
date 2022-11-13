import styled from 'styled-components';
import theme from '../../styles/theme';

export const BasicPage = styled.div`
  height: 100vh;
  background-color: ${theme.colors.BACKGROUND};

  main {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(100% - ${theme.header.HEIGHT}px);
    padding: 32px ${theme.main.PADDING_X}px;
  }
`;
