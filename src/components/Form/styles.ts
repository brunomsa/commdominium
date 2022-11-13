import styled from 'styled-components';
import { Form as AntdForm } from 'antd';

import theme from '../../styles/theme';

export const Form = styled(AntdForm)`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    caret-color: ${theme.colors.TEXT};
    -webkit-text-fill-color: ${theme.colors.TEXT} !important;
    box-shadow: 0 0 0px 1000px ${theme.colors.BACKGROUND} inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .ant-form-item-control-input-content {
    > input,
    > span {
      background-color: ${theme.colors.BACKGROUND} !important;
    }
  }
`;
