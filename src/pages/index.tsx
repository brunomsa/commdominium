import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import * as styled from '../styles/pages/Home';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Spin } from 'antd';
import { GetServerSideProps } from 'next';
import { getApiClient } from '../services/axios';

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

          <h1>Home</h1>
          <div>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <img src={user?.avatar_url} />
          </div>
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
