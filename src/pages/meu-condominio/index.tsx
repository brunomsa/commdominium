import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { Button, message } from 'antd';

import { BasicPage } from '../../components';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { Condominium, getCondominiumById } from '../../services/condominium';
import { toCapitalize } from '../../utils/toCapitalize';
import { User } from '../../services/user';

interface Props {
  loggedUserType?: UserTypes;
  condominium?: Condominium;
  assignee?: User;
  ok: boolean;
  messageError?: ApiError;
}

function MyCondominium({ loggedUserType, condominium, assignee, ok, messageError }: Props) {
  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  return (
    <>
      <Head>
        <title>Meu Condomínio</title>
      </Head>

      <BasicPage loggedUserType={loggedUserType}>
        <h1>{toCapitalize(condominium.name)}</h1>

        <div style={{ margin: '56px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {assignee && <div>Síndico: {toCapitalize(assignee.fullname)}</div>}
          {condominium.state && <div>Estado: {condominium.state}</div>}
          {condominium.city && <div>Cidade: {condominium.city}</div>}
          <div>Rua: {condominium.street}</div>
          <div>Número: {condominium.number}</div>
        </div>
        <div style={{ textAlign: 'end' }}>
          <Button type="primary" onClick={() => Router.push('/')}>
            Voltar
          </Button>
        </div>
      </BasicPage>
    </>
  );
}

export default MyCondominium;

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

    const { data: condominium } = await getCondominiumById(loggedUser.id_condominium);

    const { data: assignee = [] } = await apiClient.post<User[]>('services/searchCondominiumAssignee', {
      id_condominium: loggedUser.id_condominium,
    });
    console.log(condominium);

    return {
      props: {
        ok: true,
        loggedUserType,
        condominium,
        assignee: assignee?.[0] ?? [],
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
