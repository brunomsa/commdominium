import React, { useContext, useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { createUser, UserForm } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { DEFAULT_PASSWORD } from '../../utils/constants';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/FormSettings';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  loggedUserType?: UserTypes;
  residentTypeId?: number;
  ok: boolean;
  messageError?: ApiError;
}

function CreateResident({ loggedUserType, residentTypeId, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const handleSubmit = async (values: Omit<UserForm, 'id_condominium' | 'id_userType'>) => {
    setLoading(true);

    const { confirm, ...userData } = values;
    const { ok, error } = await createUser({
      ...userData,
      password: DEFAULT_PASSWORD,
      id_condominium: loggedUser.id_condominium,
      id_userType: residentTypeId,
    });
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
    message.success('Morador adicionado com sucesso!');
    Router.push('/moradores');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Cadastrar Moradores</title>
      </Head>

      <BasicPage pageKey={pageKey.USERS} loggedUserType={loggedUserType}>
        <h1>Cadastrar Novo Morador</h1>
        <UserSettings loading={loading} onSubmit={handleSubmit} adminMode={false} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default CreateResident;

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
    const { data: userTypes = [] } = await apiClient.get<UserType[]>('/userType/findAll');
    const { data: loggedUser } = await recoverUserInfo(token);
    const loggedUserType = findUserTypeById(userTypes, loggedUser.id_userType)?.type;
    const residentTypeId = userTypes.find((ut) => ut.type === UserTypes.RESIDENT).id;

    if (loggedUserType === UserTypes.RESIDENT) {
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
        residentTypeId,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
