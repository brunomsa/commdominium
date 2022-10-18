import { FormProps } from 'antd';
import React, { PropsWithChildren } from 'react';

import * as styled from './styles';

function Form({ children, ...props }: PropsWithChildren<FormProps>) {
  return <styled.Form {...props}>{children}</styled.Form>;
}

export default Form;
