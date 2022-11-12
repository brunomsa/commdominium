import React, { CSSProperties, PropsWithChildren } from 'react';
import { Button as AntdButton, ButtonProps } from 'antd';

import * as styled from './styles';

type Props = ButtonProps & { backgroundColor?: CSSProperties['backgroundColor'] };

function Button({ children, backgroundColor, ...buttonProps }: PropsWithChildren<Props>) {
  return (
    <styled.Button {...buttonProps} background={backgroundColor}>
      {children}
    </styled.Button>
  );
}

export default Button;
