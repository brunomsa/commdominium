import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';

import { Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { getApiClient } from '../../services/axios';
import { User } from '../../services/user';
import { Condominuim } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { BasicPage, TableList } from '../../components';
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { ApiError } from '../../services/api';

interface DataType {
  key: string;
  name: string;
  email: string;
  condominium: string;
  block: string;
  building: string;
  number: string;
  userType: string;
  status: string;
}

interface Props {
  users?: User[];
  condominiums?: Condominuim[];
  userTypes?: UserType[];
  ok: boolean;
  messageError?: ApiError;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Nome',
    key: 'name',
    dataIndex: 'name',
    showSorterTooltip: false,
    width: 250,
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'E-mail',
    key: 'email',
    dataIndex: 'email',
    showSorterTooltip: false,
    width: 250,
    sorter: (a, b) => a.email.length - b.email.length,
  },
  {
    title: 'Condomínio',
    key: 'condominium',
    dataIndex: 'condominium',
    showSorterTooltip: false,
    width: 200,
    sorter: (a, b) => a.condominium.length - b.condominium.length,
  },
  {
    title: 'Tipo de usuário',
    dataIndex: 'userType',
    showSorterTooltip: false,
    width: 180,
    sorter: (a, b) => a.userType.length - b.userType.length,
  },
  {
    title: 'Bloco',
    dataIndex: 'block',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.block.length - b.block.length,
  },
  {
    title: 'Prédio',
    dataIndex: 'building',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.building.length - b.building.length,
  },
  {
    title: 'Número',
    dataIndex: 'number',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.number.length - b.number.length,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    showSorterTooltip: false,
    width: 120,
    sorter: (a, b) => a.status.length - b.status.length,
  },
];

function Users({ users, condominiums, userTypes, ok, messageError }: Props) {
  const getCondominiumById = useCallback((id: number) => condominiums?.find((cond) => cond.id === id), [condominiums]);
  const getUserTypeById = useCallback((id: number) => userTypes?.find((cond) => cond.id === id), [userTypes]);

  useEffect(() => {
    if (!ok && messageError) {
      message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    return users?.map((user) => ({
      key: user.fullname,
      name: user.fullname,
      email: user.email,
      condominium: getCondominiumById(user.id_condominium).name,
      userType: getUserTypeById(user.id_condominium).type,
      building: user.building ? user.building : '-',
      block: user.block ? user.block : '-',
      number: user.number,
      status: user.active ? 'Ativo' : 'Desativo',
    }));
  }, [users]);

  return (
    <>
      <Head>
        <title>Usuários</title>
      </Head>

      <BasicPage pageKey="users">
        <div style={{ width: '100%', textAlign: 'end', marginBottom: 32 }}>
          <Button type="primary" onClick={() => Router.push('/usuarios/cadastrar')}>
            Novo Usuário
          </Button>
        </div>
        <TableList columns={columns} data={data} />
      </BasicPage>
    </>
  );
}

export default Users;

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
    const { data: users } = await apiClient.get<Omit<User, 'password'>[]>('/user/findAll');
    const { data: condominiums } = await apiClient.get<Condominuim[]>('/condominium/findAll');
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

    return {
      props: {
        ok: true,
        users: users,
        condominiums: condominiums,
        userTypes: userTypes,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      return { props: { ok: false, messageError: err.response.data as ApiError } };
    } else {
      return {
        props: {
          ok: false,
          messageError: { error: `Um inesperado erro ocorreu: ${error}` },
        },
      };
    }
  }
};
