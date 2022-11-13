import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, CondominiumSettings } from '../../../components';
import { Condominium, getCondominiumById, updateCondominium } from '../../../services/condominium';
import { catchPageError } from '../../../services/axios';
import { pageKey } from '../../../utils/types';

import * as styled from '../../../styles/pages/FormSettings';
import theme from '../../../styles/theme';

interface Props {
  condominium?: Condominium;
}

function EditCondominium({ condominium }: Props) {
  const { id: itemId } = useRouter().query;

  const [loading, setLoading] = useState(false);

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
          top: `${theme.header.height}px`,
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

      <BasicPage pageKey={pageKey.CONDOMINIUMS}>
        <h1>Editar Condomínio</h1>
        <CondominiumSettings initialValues={condominium} loading={loading} onSubmit={handleSubmit} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default EditCondominium;

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

  try {
    const { id } = ctx.query;
    const { data: condominium } = await getCondominiumById(Number(id));

    return {
      props: {
        condominium,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
