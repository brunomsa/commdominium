import React, { useContext } from 'react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { AuthContext } from '../contexts/AuthContext';
import { getApiClient } from '../services/axios';

import { BasicPage, Loader } from '../components';

function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {/* {!isAuthenticated && <Loader />} */}
      <>
        <Head>
          <title>Home</title>
        </Head>

        <BasicPage menuKey="home">
          <div>Olá {user?.fullname ?? 'Bruno'}!</div>
        </BasicPage>
      </>
    </>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getApiClient(ctx);
  const { ['commdominium.token']: token } = parseCookies(ctx);

  // if (!token) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }

  // await apiClient.get('/users');

  return {
    props: {},
  };
};
