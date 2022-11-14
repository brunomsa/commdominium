import styled from 'styled-components';
import { Button as AntdButton } from 'antd';
import { CSSProperties } from 'react';
import theme from '../../styles/theme';

interface Props {
  background?: CSSProperties['backgroundColor'];
}

export const Button = styled(AntdButton)<Props>`
  &.ant-btn {
    color: ${theme.colors.TEXT};
    background-color: ${({ background }) => background};
    border: ${({ background }) => background};

    :hover {
      background-color: ${({ background }) => `${background}70`};
    }
  }
`;
