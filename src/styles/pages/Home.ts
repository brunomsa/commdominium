import styled from 'styled-components';
import { Form } from 'antd';
import theme from '../theme';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

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
