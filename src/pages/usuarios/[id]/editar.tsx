import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../../components';
import { ApiError } from '../../../services/api';
import { recoverUserInfo } from '../../../services/auth';
import { catchPageError, getApiClient } from '../../../services/axios';
import { Condominium } from '../../../services/condominium';
import { findUserTypeById, UserType, UserTypes } from '../../../services/userType';
import { getUserById, updateUser, User, UserForm } from '../../../services/user';
import { pageKey } from '../../../utils/types';

import * as styled from '../../../styles/pages/FormSettings';
import theme from '../../../styles/theme';

interface Props {
  loggedUserType?: UserTypes;
  user?: User;
  condominiums?: Condominium[];
  userTypes?: UserType[];
  ok: boolean;
  messageError?: ApiError;
}

function EditUser({ loggedUserType, user, condominiums, userTypes, ok, messageError }: Props) {
  const { id: itemId } = useRouter().query;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

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

      <BasicPage pageKey={pageKey.USERS} loggedUserType={loggedUserType}>
        <h1>Editar Usuário</h1>
        <UserSettings
          initialValues={user}
          condominiums={condominiums ?? []}
          userTypes={userTypes ?? []}
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
    const { data: userTypes = [] } = await apiClient.get<UserType[]>('/userType/findAll');
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
    const { id } = ctx.query;
    const { data: user } = await getUserById(Number(id));
    const { data: condominiums = [] } = await apiClient.get<Condominium[]>('/condominium/findAll');

    return {
      props: {
        ok: true,
        loggedUserType,
        user,
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
