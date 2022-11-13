import React, { Ref } from 'react';

import { Input, InputProps, InputRef, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface Props extends InputProps {
  ref?: Ref<InputRef>;
  help?: string;
}

function TextInput({ ref, help, ...inputProps }: Props) {
  return (
    <Input
      ref={ref}
      {...inputProps}
      suffix={
        help && (
          <Tooltip title={help}>
            <InfoCircleOutlined />
          </Tooltip>
        )
      }
    />
  );
}

export default TextInput;
