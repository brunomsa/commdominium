import styled from 'styled-components';
import theme from '../../styles/theme';

export const PageLoader = styled.div`
  .spin {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: ${theme.colors.BACKGROUND};
    opacity: 80%;
    z-index: 1000;

    .ant-spin {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
`;
