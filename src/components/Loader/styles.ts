import styled from 'styled-components';
import theme from '../../styles/theme';

export const Loader = styled.div`
  .spin {
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.background};
    opacity: 50%;

    .ant-spin {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
`;
