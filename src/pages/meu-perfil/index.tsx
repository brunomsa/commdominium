import React, { useContext, useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { recoverUserInfo } from '../../services/auth';
import { ApiError } from '../../services/api';
import { catchPageError, getApiClient } from '../../services/axios';
import { updateUser, UserForm } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';

import * as styled from '../../styles/pages/FormSettings';
import theme from '../../styles/theme';

interface Props {
  loggedUserType?: UserTypes;
  ok: boolean;
  messageError?: ApiError;
}

function MyProfile({ loggedUserType, ok, messageError }: Props) {
  const { user: loggedUser, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const handleSubmit = async (values: Omit<UserForm, 'id_condominium' | 'id_userType'>) => {
    if (!loggedUser) return;

    setLoading(true);
    const { ok, error } = await updateUser({ ...loggedUser, ...values });
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

    setUser((prev) => ({ ...prev, ...values }));
    setLoading(false);
    message.success('Perfil atualizado com sucesso!');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Meu Perfil</title>
      </Head>

      <BasicPage loggedUserType={loggedUserType}>
        <h1>Meu Perfil</h1>
        <UserSettings initialValues={loggedUser} loading={loading} onSubmit={handleSubmit} adminMode={false} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default MyProfile;

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

    return {
      props: {
        ok: true,
        loggedUserType,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
