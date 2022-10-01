import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import * as styled from '../styles/pages/Login';
import { AuthContext } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn } = useContext(AuthContext);

  const handleSubmit = async (data) => {
    await signIn(data);
  };

  return (
    <styled.Container>
      <header>
        <h1>Commdominium</h1>
        <p>Faça seu login no sistema</p>
      </header>

      <styled.LoginForm size="large" onFinish={handleSubmit}>
        <div>
          <Form.Item name="email">
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="E-mail"
            />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Senha"
            />
          </Form.Item>
        </div>

        <div className="login-button">
          <Button type="primary" htmlType="submit" size="large">
            Entrar
          </Button>
        </div>
      </styled.LoginForm>
    </styled.Container>
  );
};

export default Login;
