import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../../components';
import { Condominium } from '../../../services/condominium';
import { UserType } from '../../../services/userType';
import { catchPageError, getApiClient } from '../../../services/axios';
import { getUserById, updateUser, User, UserForm } from '../../../services/user';
import { pageKey } from '../../../utils/types';

import * as styled from '../../../styles/pages/FormSettings';
import theme from '../../../styles/theme';

interface Props {
  user?: User;
  condominiums?: Condominium[];
  userTypes?: UserType[];
}

function EditUser({ user, condominiums, userTypes }: Props) {
  const { id: itemId } = useRouter().query;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserForm) => {
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
          top: `${theme.header.HEIGHT}px`,
        },
      });
    }

    setLoading(false);
    message.success('Usuário atualizado com sucesso!');
    Router.push('/usuarios');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Editar Usuários</title>
      </Head>

      <BasicPage pageKey={pageKey.USERS}>
        <h1>Editar Usuário</h1>
        <UserSettings
          initialValues={user}
          condominiums={condominiums}
          userTypes={userTypes}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </BasicPage>
    </styled.FormSettings>
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

  try {
    const { id } = ctx.query;
    const { data: user } = await getUserById(Number(id));
    const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

    return {
      props: {
        user,
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
