import React, { useContext } from 'react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { AuthContext } from '../contexts/AuthContext';

import { BasicPage, PageLoader } from '../components';

function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      {!isAuthenticated || !user ? (
        <PageLoader />
      ) : (
        <BasicPage pageKey="home">
          <div>Olá {user.fullname}!</div>
        </BasicPage>
      )}
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
