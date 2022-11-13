import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, CondominiumSettings } from '../../components';
import { Condominium, createCondominium } from '../../services/condominium';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import * as styled from '../../styles/pages/FormSettings';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

function CreateCondominium() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Omit<Condominium, 'id'>) => {
    setLoading(true);

    const { ok, error } = await createCondominium(values);
    if (!ok && error) {
      setLoading(false);

      return message.error({
        content: error.error,
        style: {
          position: 'absolute',
          right: 10,
          top: `${theme.header.height}px`,
        },
      });
    }

    setLoading(false);
    message.success('Condomínio adicionado com sucesso!');
    Router.push('/condominios');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Cadastrar Condomínios</title>
      </Head>

      <BasicPage pageKey={pageKey.CONDOMINIUMS}>
        <h1>Cadastrar Novo Condomínio</h1>
        <CondominiumSettings loading={loading} onSubmit={handleSubmit} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default CreateCondominium;

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
