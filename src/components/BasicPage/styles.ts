import styled from 'styled-components';
import theme from '../../styles/theme';

export const BasicPage = styled.div`
  height: 100vh;
  background-color: ${theme.colors.background};

  main {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(100% - ${theme.header.height}px);
    padding: 32px ${theme.main.padding_x}px;
  }
`;
