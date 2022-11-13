import React, { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { message } from 'antd';

import { BasicPage, UserSettings } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUser, UserForm } from '../../services/user';

import * as styled from '../../styles/pages/FormSettings';
import theme from '../../styles/theme';

function MyProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserForm) => {
    if (!user) return;

    setLoading(true);
    const { ok, error } = await updateUser({ ...values, id: user.id });
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

    setUser((prev) => ({ ...prev, ...values }));
    setLoading(false);
    message.success('Perfil atualizado com sucesso!');
  };

  return (
    <styled.FormSettings>
      <Head>
        <title>Meu Perfil</title>
      </Head>

      <BasicPage>
        <h1>Meu Perfil</h1>
        <UserSettings initialValues={user} loading={loading} onSubmit={handleSubmit} adminMode={false} />
      </BasicPage>
    </styled.FormSettings>
  );
}

export default MyProfile;

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
