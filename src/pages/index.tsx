import React, { useContext, useEffect } from 'react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage } from '../components';
import { AuthContext } from '../contexts/AuthContext';
import { ApiError } from '../services/api';
import { recoverUserInfo } from '../services/auth';
import { catchPageError, getApiClient } from '../services/axios';
import { findUserTypeById, UserType, UserTypes } from '../services/userType';
import { pageKey } from '../utils/types';

interface Props {
  loggedUserType?: UserTypes;
  ok: boolean;
  messageError?: ApiError;
}

let showError = false;

function Home({ loggedUserType, ok, messageError }: Props) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <BasicPage pageKey={pageKey.HOME} loggedUserType={loggedUserType}>
        <h1>Olá {user?.fullname}!</h1>
      </BasicPage>
    </>
  );
}

export default Home;

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
