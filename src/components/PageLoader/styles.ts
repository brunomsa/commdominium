import styled from 'styled-components';
import theme from '../../styles/theme';

export const PageLoader = styled.div`
  .spin {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.BACKGROUND};
    opacity: 80%;
    z-index: 1000;
    overflow: none;

    .ant-spin {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
`;
