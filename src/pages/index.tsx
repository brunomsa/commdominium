import React, { useContext } from 'react';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { Spin } from 'antd';

import { AuthContext } from '../contexts/AuthContext';
import { getApiClient } from '../services/axios';
import { Header } from '../components';

import * as styled from '../styles/pages/Home';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <styled.Container>
      {!isAuthenticated ? (
        <div className="spin">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Head>
            <title>Home</title>
          </Head>

          <Header />
        </>
      )}
    </styled.Container>
  );
};

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

  // await apiClient.get('/users');

  return {
    props: {},
  };
};
