import React, { CSSProperties, PropsWithChildren } from 'react';
import { ButtonProps, Tooltip } from 'antd';

import * as styled from './styles';
interface Props extends ButtonProps {
  tooltip?: string;
  backgroundColor?: CSSProperties['backgroundColor'];
}

function Button({ children, tooltip, backgroundColor, ...buttonProps }: PropsWithChildren<Props>) {
  return (
    <Tooltip title={tooltip}>
      <styled.Button {...buttonProps} background={backgroundColor}>
        {children}
      </styled.Button>
    </Tooltip>
  );
}

export default Button;
