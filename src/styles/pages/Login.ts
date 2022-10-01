import styled from 'styled-components';
import { Form } from 'antd';

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
`;

export const LoginForm = styled(Form)`
  width: 450px;
  height: 450px;
  padding: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #202024;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  .ant-form-item-control-input-content {
    > input,
    > span {
      height: 60px;
      border: none;
      background: #121214;
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
`;
