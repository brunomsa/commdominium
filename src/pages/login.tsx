import React, { useContext, useState } from 'react';

import { Form, Input } from 'antd';
import { ExclamationCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

import { Button, TextInput } from '../components';
import { AuthContext } from '../contexts/AuthContext';
import { SignInData } from '../contexts/types';

import * as styled from '../styles/pages/Login';

function Login() {
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (data: SignInData) => {
    setIsLoading(true);
    const { ok, error } = await signIn(data);
    if (!ok && error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return (
    <styled.Login>
      <header>
        <img src="/logo.png" />
        <h1>Commdominium</h1>
        <p>Faça seu login no sistema</p>
      </header>

      <styled.LoginForm size="large" onChange={() => setError(undefined)} onFinish={handleSubmit}>
        <div>
          <Form.Item name="email" rules={[{ required: true, message: 'Por favor, informe um e-mail!' }]}>
            <TextInput prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Por favor, informe uma senha!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Senha" />
          </Form.Item>
        </div>

        <div className="login-button">
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            Entrar
          </Button>
        </div>

        {error && (
          <div className="ant-form-item-explain-error" style={{ textAlign: 'center' }}>
            <ExclamationCircleOutlined style={{ fontSize: 18, marginRight: 4 }} />
            {error}
          </div>
        )}
      </styled.LoginForm>
    </styled.Login>
  );
}

export default Login;
