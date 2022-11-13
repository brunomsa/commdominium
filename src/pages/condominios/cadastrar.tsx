import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, CondominiumSettings } from '../../components';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { Condominium, createCondominium } from '../../services/condominium';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/FormSettings';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  loggedUserType?: UserTypes;
  ok: boolean;
  messageError?: ApiError;
}

let showError = false;

function CreateCondominium({ loggedUserType, ok, messageError }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const handleSubmit = async (values: Omit<Condominium, 'id'>) => {
    setLoading(true);

    const { ok, error } = await createCondominium(values);
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
    message.success('Condomínio adicionado com sucesso!');
    Router.push('/condominios');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Cadastrar Condomínios</title>
      </Head>

      <BasicPage pageKey={pageKey.CONDOMINIUMS} loggedUserType={loggedUserType}>
        <h1>Cadastrar Novo Condomínio</h1>
        <CondominiumSettings loading={loading} onSubmit={handleSubmit} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default CreateCondominium;

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

    return {
      props: {
        ok: true,
        loggedUserType,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
