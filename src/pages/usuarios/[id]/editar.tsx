import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../../components';
import { Condominuim } from '../../../services/condominium';
import { UserType } from '../../../services/userType';
import { getApiClient } from '../../../services/axios';
import { getUserById, updateUser, User, UserData } from '../../../services/user';

import * as styled from '../../../styles/pages/Users';
import theme from '../../../styles/theme';

interface Props {
  user?: User;
  condominiums?: Condominuim[];
  userTypes?: UserType[];
}

function EditUser({ user, condominiums, userTypes }: Props) {
  const { id: itemId } = useRouter().query;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserData) => {
    setLoading(true);

    const { confirm, ...userData } = values;
    const { ok, error } = await updateUser({ ...userData, id: Number(itemId) });
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
        <title>Editar Usuários</title>
      </Head>

      <BasicPage pageKey="create-user">
        <h1>Editar Usuário</h1>
        <UserSettings
          initialValues={user}
          condominiums={condominiums}
          userTypes={userTypes}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </BasicPage>
    </styled.Users>
  );
}

export default EditUser;

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

  const { id } = ctx.query;
  const { data: user } = await getUserById(Number(id));
  const { data: condominiums } = await apiClient.get<Condominuim[]>('/condominium/findAll');
  const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

  return {
    props: {
      user,
      condominiums,
      userTypes,
    },
  };
};
