import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, CondominiumSettings } from '../../../components';
import { ApiError } from '../../../services/api';
import { recoverUserInfo } from '../../../services/auth';
import { catchPageError, getApiClient } from '../../../services/axios';
import { Condominium, getCondominiumById, updateCondominium } from '../../../services/condominium';
import { findUserTypeById, UserType, UserTypes } from '../../../services/userType';
import { pageKey } from '../../../utils/types';

import * as styled from '../../../styles/pages/FormSettings';
import theme from '../../../styles/theme';

interface Props {
  loggedUserType?: UserTypes;
  condominium?: Condominium;
  ok: boolean;
  messageError?: ApiError;
}

function EditCondominium({ loggedUserType, condominium, ok, messageError }: Props) {
  const { id: itemId } = useRouter().query;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const handleSubmit = async (values: Omit<Condominium, 'id'>) => {
    setLoading(true);

    const { ok, error } = await updateCondominium({ ...values, id: Number(itemId) });
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
    message.success('Condomínio atualizado com sucesso!');
    Router.push('/condominios');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Editar Condomínios</title>
      </Head>

      <BasicPage pageKey={pageKey.CONDOMINIUMS} loggedUserType={loggedUserType}>
        <h1>Editar Condomínio</h1>
        <CondominiumSettings initialValues={condominium} loading={loading} onSubmit={handleSubmit} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default EditCondominium;

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
    const { data: condominium } = await getCondominiumById(Number(id));

    return {
      props: {
        ok: true,
        loggedUserType,
        condominium,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
