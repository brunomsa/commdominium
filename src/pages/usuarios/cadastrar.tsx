import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../components';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { createUser, UserForm } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { Condominium } from '../../services/condominium';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/FormSettings';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  loggedUserType?: UserTypes;
  condominiums?: Condominium[];
  userTypes?: UserType[];
  ok: boolean;
  messageError?: ApiError;
}

let showError = false;

function CreateUser({ loggedUserType, condominiums, userTypes, ok, messageError }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

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
          top: `${theme.header.HEIGHT}px`,
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

      <BasicPage pageKey={pageKey.USERS} loggedUserType={loggedUserType}>
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
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');
    const { data: loggedUser } = await recoverUserInfo(token);
    const loggedUserType = findUserTypeById(userTypes, loggedUser.id_userType)?.type;

    if (loggedUserType !== UserTypes.ADMIN) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');

    return {
      props: {
        ok: true,
        loggedUserType,
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
