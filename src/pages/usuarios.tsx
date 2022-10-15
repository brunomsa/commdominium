import React, { useCallback } from 'react';
import Head from 'next/head';

import { BasicPage } from '../components';
import { Button, Form, Input, Select } from 'antd';

import * as styled from '../styles/pages/Users';
import { User } from '../contexts/types';
import { createUser } from '../services/user';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface UserData extends User {
  confirm: string;
}

function Users() {
  const handleSubmit = useCallback(async (values: UserData) => {
    const { id, confirm, ...userData } = values;
    console.log(userData);
    await createUser(userData);
  }, []);

  return (
    <styled.Users>
      <Head>
        <title>Usuários</title>
      </Head>

      <BasicPage menuKey="users">
        <h1>Cadastrar Novo Usuário</h1>
        <Form className="form" onFinish={handleSubmit}>
          <Form.Item name="fullname" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
            <Input placeholder="Nome" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Informe um e-mail válido!' },
              { required: true, message: 'Por favor, informe um e-mail!' },
            ]}
            hasFeedback
          >
            <Input placeholder="E-mail" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor, informe uma senha!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Senha" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Por favor, confirme sua senha!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As duas senhas informadas precisam ser iguais!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirme a senha" autoComplete="off" />
          </Form.Item>
          <Form.Item name="id_userType" rules={[{ required: true, message: 'Por favor, informe um tipo de usuário' }]}>
            <Select placeholder="Tipo do usuário">
              <Select.Option value="2">Síndico</Select.Option>
              <Select.Option value="3">Morador</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="id_condominuim">
            <Select placeholder="Condomínio">
              <Select.Option value="1">Residencial Suiça</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="block">
            <Input placeholder="Bloco" autoComplete="off" />
          </Form.Item>

          <Form.Item name="building">
            <Input placeholder="Prédio" autoComplete="off" />
          </Form.Item>

          <Form.Item name="number" rules={[{ required: true, message: 'Por favor, informe um número' }]}>
            <Input placeholder="Número" autoComplete="off" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
        <img className="background-image" src={URL_BACKGROUND} />
      </BasicPage>
    </styled.Users>
  );
}

export default Users;
