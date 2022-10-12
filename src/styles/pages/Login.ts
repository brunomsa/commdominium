import styled from 'styled-components';
import { Form } from 'antd';

import theme from '../theme';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;

  h1 {
    text-transform: uppercase;
    font-size: 60px;
    margin-top: 40px;
  }
  p {
    font-size: 35px;
  }

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 50px;
    justify-content: center;

    p {
      text-align: center;
    }
  }
`;

export const LoginForm = styled(Form)`
  width: 450px;
  height: 450px;
  padding: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: ${theme.colors.dark_grey};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    caret-color: ${theme.colors.text};
    -webkit-text-fill-color: ${theme.colors.text} !important;
    -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.background} inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .ant-form-item-control-input-content {
    > input,
    > span {
      height: 60px;
      border: none;
      background-color: ${theme.colors.background} !important;
    }
  }

  .login-button {
    display: flex;
    justify-content: center;

    button {
      width: 250px;
      height: 50px;
      text-transform: uppercase;
    }
  }

  .error {
    color: red;
    text-align: center;
    font-size: 16px;
  }
`;
