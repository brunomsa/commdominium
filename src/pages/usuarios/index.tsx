import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

import { Button, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ColumnType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { getApiClient } from '../../services/axios';
import { deleteUser, User } from '../../services/user';
import { Condominuim, getCondominiumById } from '../../services/condominium';
import { getUserTypeById, UserType } from '../../services/userType';
import { AuthContext } from '../../contexts/AuthContext';
import { BasicPage, TableList } from '../../components';
import { ApiError } from '../../services/api';

import theme from '../../styles/theme';

interface DataType {
  key: number;
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
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'E-mail',
    key: 'email',
    dataIndex: 'email',
    showSorterTooltip: false,
    width: 250,
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: 'Condomínio',
    key: 'condominium',
    dataIndex: 'condominium',
    showSorterTooltip: false,
    width: 200,
    sorter: (a, b) => a.condominium.localeCompare(b.condominium),
  },
  {
    title: 'Tipo de usuário',
    dataIndex: 'userType',
    showSorterTooltip: false,
    width: 180,
    sorter: (a, b) => a.userType.localeCompare(b.userType),
  },
  {
    title: 'Bloco',
    dataIndex: 'block',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.block.localeCompare(b.block),
  },
  {
    title: 'Prédio',
    dataIndex: 'building',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.building.localeCompare(b.building),
  },
  {
    title: 'Número',
    dataIndex: 'number',
    showSorterTooltip: false,
    width: 120,
    align: 'center',
    sorter: (a, b) => a.number.localeCompare(b.number),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    showSorterTooltip: false,
    width: 120,
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
];

function Users({ users: initialUsers, condominiums, userTypes, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    console.log({ ok, messageError });
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    if (!users || !loggedUser) return;
    return users
      .filter((i) => i.id !== loggedUser.id)
      .map((user) => ({
        key: user.id,
        name: user.fullname,
        email: user.email,
        condominium: getCondominiumById(condominiums, user.id_condominium)?.name,
        userType: getUserTypeById(userTypes, user.id_userType)?.type,
        building: user.building ? user.building : '-',
        block: user.block ? user.block : '-',
        number: user.number,
        status: user.active ? 'Ativo' : 'Desativo',
      }));
  }, [condominiums, users, userTypes, loggedUser]);

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteUser(id);
    if (error) {
      if (!ok) {
        return message.error({
          content: error.error,
          style: {
            position: 'absolute',
            right: 10,
            top: `${theme.header.height}px`,
          },
        });
      }
      if (ok) {
        return message.warning({
          content: error.error,
          style: {
            position: 'absolute',
            right: 10,
            top: `${theme.header.height}px`,
          },
        });
      }
    }
    if (ok && data) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return message.success({
        content: 'Usuário excluído com sucesso',
        style: {
          position: 'absolute',
          right: 10,
          top: `${theme.header.height}px`,
        },
      });
    }
  }, []);

  const actionsColumn: ColumnType<DataType> = useMemo(() => {
    return {
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">
            <EditOutlined onClick={() => Router.push(`usuarios/${record.key}/editar`)} />
          </Button>
          <Button className="delete" onClick={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    };
  }, []);

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
        <TableList columns={columns} data={data} action={actionsColumn} />
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
        users,
        condominiums,
        userTypes,
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
          messageError: { error: `${error}` },
        },
      };
    }
  }
};
