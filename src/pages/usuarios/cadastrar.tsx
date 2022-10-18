import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { BasicPage } from '../../components';
import { Button, Form, Input, message, Select } from 'antd';

import { createUser, User } from '../../services/user';
import { getApiClient } from '../../services/axios';
import { Condominuim } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { toCapitalize } from '../../utils/toCapitalize';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/Users';
import Router from 'next/router';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface UserData extends User {
  confirm: string;
}

interface Props {
  condominiums: Condominuim[];
  userTypes: UserType[];
}

function CreateUser({ condominiums, userTypes }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: UserData) => {
    setIsLoading(true);

    const { id, confirm, ...userData } = values;
    const { ok, error } = await createUser(userData);
    if (!ok && error) {
      message.error({
        content: error.error,
        style: {
          position: 'absolute',
          right: 10,
          top: `${theme.header.height}px`,
        },
      });
    }

    setIsLoading(false);
    message.success({
      content: 'Usuário adicionado com sucesso!',
      style: {
        position: 'absolute',
        right: 10,
        top: `${theme.header.height}px`,
      },
    });
    Router.push('/usuarios');
  };

  return (
    <styled.Users>
      <Head>
        <title>Usuários - Criar</title>
      </Head>

      <BasicPage pageKey="create-user">
        <h1>Cadastrar Novo Usuário</h1>
        <Form className="form" onFinish={handleSubmit} autoComplete="off">
          <Form.Item name="fullname" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
            <Input placeholder="Nome" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Informe um e-mail válido!' },
              { required: true, message: 'Por favor, informe um e-mail!' },
            ]}
            hasFeedback
          >
            <Input type="search" placeholder="E-mail" />
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
            <Input.Password placeholder="Senha" />
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
            <Input.Password placeholder="Confirme a senha" />
          </Form.Item>
          <Form.Item name="id_userType" rules={[{ required: true, message: 'Por favor, informe um tipo de usuário' }]}>
            <Select placeholder="Tipo do usuário">
              {userTypes
                .filter((i) => i.type !== 'admin')
                .map((ut) => (
                  <Select.Option key={ut.id} value={ut.id}>
                    {toCapitalize(ut.type)}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="id_condominium">
            <Select
              showSearch
              placeholder="Condomínio"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {condominiums.map((cond) => (
                <Select.Option key={cond.id} value={cond.id}>
                  {cond.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="block">
            <Input placeholder="Bloco" />
          </Form.Item>

          <Form.Item name="building">
            <Input placeholder="Prédio" />
          </Form.Item>

          <Form.Item name="number" rules={[{ required: true, message: 'Por favor, informe um número' }]}>
            <Input placeholder="Número" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>

        <img className="background-image" src={URL_BACKGROUND} />
      </BasicPage>
    </styled.Users>
  );
}

export default CreateUser;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getApiClient(ctx);
  const { ['commdominium.token']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { data: condominiums } = await apiClient.get<Condominuim[]>('/condominium/findAll');
  const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

  return {
    props: {
      condominiums,
      userTypes,
    },
  };
};
