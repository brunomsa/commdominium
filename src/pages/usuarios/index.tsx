import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message, Modal, Space, TableColumnType, TableColumnsType, Divider } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, Button, TableList } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { Condominium, findCondominiumById } from '../../services/condominium';
import { deleteUser, User } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { PageKey } from '../../utils/types';

import theme from '../../styles/theme';

interface DataType {
  key: number;
  name: string;
  email: string;
  condominium: string;
  block: string;
  building: string;
  number: string;
  userType: UserTypes;
  status: 'Ativo' | 'Desativo';
}

interface Props {
  loggedUserType?: UserTypes;
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
    filters: [
      { text: UserTypes.ADMIN, value: UserTypes.ADMIN },
      { text: UserTypes.ASSIGNEE, value: UserTypes.ASSIGNEE },
      { text: UserTypes.RESIDENT, value: UserTypes.RESIDENT },
    ],
    onFilter: (value: string, record) => record.userType.includes(value),
    sorter: (a, b) => a.userType.localeCompare(b.userType),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    showSorterTooltip: false,
    width: 120,
    filters: [
      { text: 'Ativo', value: 'Ativo' },
      { text: 'Desativo', value: 'Desativo' },
    ],
    onFilter: (value: string, record) => record.status.includes(value),
    sorter: (a, b) => a.status.localeCompare(b.status),
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
];

function Users({ loggedUserType, users: initialUsers, condominiums, userTypes, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [users, setUsers] = useState<User[]>(initialUsers ?? []);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    if (!users || !loggedUser) return [];
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
      return message.success('Usuário excluído com sucesso!');
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
          <Button
            type="primary"
            icon={<EditOutlined />}
            tooltip="Editar usuário"
            onClick={() => Router.push(`usuarios/${record.key}/editar`)}
          />
          <Divider type="vertical" style={{ margin: 0 }} />
          <Button
            backgroundColor={theme.colors.RED}
            icon={<DeleteOutlined />}
            tooltip="Excluir usuário"
            onClick={() => confirmDeleteModal(record.key)}
          />
        </Space>
      ),
    };
  }, [confirmDeleteModal]);

  return (
    <>
      <Head>
        <title>Usuários</title>
      </Head>

      <BasicPage pageKey={PageKey.USERS} loggedUserType={loggedUserType}>
        <div style={{ textAlign: 'end', marginBottom: 32 }}>
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
    const { data: userTypes = [] } = await apiClient.get<UserType[]>('/userType/findAll');
    const { data: loggedUser } = await recoverUserInfo(token);
    const loggedUserType = findUserTypeById(userTypes, loggedUser.id_userType)?.type;

    if (loggedUserType !== UserTypes.ADMIN) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const { data: users = [] } = await apiClient.get<User[]>('/user/findAll');
    const { data: condominiums = [] } = await apiClient.get<Condominium[]>('/condominium/findAll');

    return {
      props: {
        ok: true,
        loggedUserType,
        users,
        condominiums,
        userTypes,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
