import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../components';
import { createUser, UserForm } from '../../services/user';
import { catchPageError, getApiClient } from '../../services/axios';
import { Condominium } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/FormSettings';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  condominiums?: Condominium[];
  userTypes?: UserType[];
}

function CreateUser({ condominiums, userTypes }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserForm) => {
    setLoading(true);

    const { confirm, ...userData } = values;
    const { ok, error } = await createUser(userData);
    if (!ok && error) {
      setLoading(false);

      return message.error({
        content: error.error,
        style: {
          position: 'absolute',
          right: 10,
          top: `${theme.header.height}px`,
        },
      });
    }

    setLoading(false);
    message.success('Usuário adicionado com sucesso!');
    Router.push('/usuarios');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Cadastrar Usuários</title>
      </Head>

      <BasicPage pageKey={pageKey.USERS}>
        <h1>Cadastrar Novo Usuário</h1>
        <UserSettings condominiums={condominiums} userTypes={userTypes} loading={loading} onSubmit={handleSubmit} />
      </BasicPage>
    </styled.FormSettings>
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

  try {
    const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

    return {
      props: {
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
