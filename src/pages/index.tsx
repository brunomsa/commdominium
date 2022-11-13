import React, { useContext } from 'react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { AuthContext } from '../contexts/AuthContext';

import { BasicPage } from '../components';
import { pageKey } from '../utils/types';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <BasicPage pageKey={pageKey.HOME}>
        <h1>Olá {user?.fullname}!</h1>
      </BasicPage>
    </>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['commdominium.token']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
