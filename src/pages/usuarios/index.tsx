import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message, Modal, Space, TableColumnType, TableColumnsType, Divider } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, Button, TableList } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { catchPageError, getApiClient } from '../../services/axios';
import { deleteUser, User } from '../../services/user';
import { Condominium, findCondominiumById } from '../../services/condominium';
import { findUserTypeById, UserType } from '../../services/userType';
import { ApiError } from '../../services/api';
import { pageKey } from '../../utils/types';

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
  condominiums?: Condominium[];
  userTypes?: UserType[];
  ok: boolean;
  messageError?: ApiError;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Nome',
    key: 'name',
    dataIndex: 'name',
    showSorterTooltip: false,
    width: 200,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'E-mail',
    key: 'email',
    dataIndex: 'email',
    showSorterTooltip: false,
    width: 200,
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
let showError = false;

function Users({ users: initialUsers, condominiums, userTypes, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
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
        condominium: findCondominiumById(condominiums, user.id_condominium)?.name,
        userType: findUserTypeById(userTypes, user.id_userType)?.type,
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
        return message.error(error.error);
      }
      if (ok) {
        return message.warning(error.error);
      }
    }
    if (ok && data) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return message.success('Usuário excluído com sucesso');
    }
  }, []);

  const confirmDeleteModal = (id: number) => {
    Modal.confirm({
      title: 'Excluir usuário',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja excluir este usuário?',
      okText: 'Sim',
      cancelText: 'Não',
      autoFocusButton: 'cancel',
      onOk: async () => await handleDelete(id),
      onCancel: () => {},
    });
  };

  const actionsColumn: TableColumnType<DataType> = useMemo(() => {
    return {
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => Router.push(`usuarios/${record.key}/editar`)} />
          <Divider type="vertical" style={{ margin: 0 }} />
          <Button className="delete" icon={<DeleteOutlined />} onClick={() => confirmDeleteModal(record.key)} />
        </Space>
      ),
    };
  }, []);

  return (
    <>
      <Head>
        <title>Usuários</title>
      </Head>

      <BasicPage pageKey={pageKey.USERS}>
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
    const { status, data: users } = await apiClient.get<Omit<User, 'password'>[]>('/user/findAll');
    const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

    if (status === 204) {
      return {
        props: {
          ok: false,
          users: [],
          messageError: { error: 'Nenhum usuário encontrado' },
        },
      };
    }

    return {
      props: {
        ok: true,
        users,
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
