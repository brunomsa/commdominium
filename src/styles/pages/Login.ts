import styled from 'styled-components';

import { Form } from '../../components';
import theme from '../theme';

export const Login = styled.div`
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

    h1 {
      font-size: 40px;
    }

    p {
      font-size: 25px;
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
  background-color: ${theme.colors.DARK_GREY};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  .ant-form-item-control-input-content {
    > input,
    > span {
      height: 60px;
      border: none;
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

  @media (max-width: 1080px) {
    width: 400px;
    height: 400px;
  }
`;
