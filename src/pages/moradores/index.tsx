import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { message, Modal, Space, TableColumnType, TableColumnsType, Divider } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';

import { BasicPage, Button, TableList } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { deleteUser, updateActiveStatus, User } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';

interface DataType {
  key: number;
  name: string;
  block: string;
  building: string;
  number: string;
  status: 'Ativo' | 'Desativo';
}

interface Props {
  loggedUserType?: UserTypes;
  residents?: User[];
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

function Residents({ loggedUserType, residents: initialResidents, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [residents, setResidents] = useState<User[]>(initialResidents ?? []);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    if (!residents || !loggedUser) return [];
    return residents
      .filter((i) => i.id !== loggedUser.id)
      .map((user) => ({
        key: user.id,
        name: user.fullname,
        building: user.building ? user.building : '-',
        block: user.block ? user.block : '-',
        number: user.number,
        status: user.active ? 'Ativo' : 'Desativo',
      }));
  }, [residents, loggedUser]);

  const handleUpdateResidentStatus = useCallback(async (id: number) => {
    const { ok, data, error } = await updateActiveStatus(id);
    if (error) {
      if (!ok) return message.error(error.error);

      if (ok) return message.warning(error.error);
    }
    if (ok && data) {
      setResidents((prev) =>
        prev.map((resident) => {
          if (resident.id === id) {
            resident.active = !resident.active;
          }
          return resident;
        })
      );

      return message.success('Reclamação atualizada com sucesso!');
    }
  }, []);

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
      setResidents((prev) => prev.filter((user) => user.id !== id));
      return message.success('Morador excluído com sucesso!');
    }
  }, []);

  const confirmDeleteModal = (id: number) => {
    Modal.confirm({
      title: 'Excluir morador',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja excluir este morador?',
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
            backgroundColor={record.status === 'Ativo' ? theme.colors.ORANGE : theme.colors.GREEN}
            type="primary"
            icon={record.status === 'Ativo' ? <StopOutlined /> : <CheckCircleOutlined />}
            tooltip={record.status === 'Ativo' ? 'Desativar morador' : 'Ativar morador'}
            onClick={() => handleUpdateResidentStatus(record.key)}
          />
          <Divider type="vertical" style={{ margin: 0 }} />
          <Button
            backgroundColor={theme.colors.RED}
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteModal(record.key)}
          />
        </Space>
      ),
    };
  }, [confirmDeleteModal]);

  return (
    <>
      <Head>
        <title>Moradores</title>
      </Head>

      <BasicPage pageKey={pageKey.RESIDENTS} loggedUserType={loggedUserType}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ minWidth: 'max-content' }}>Moradores</h1>

          <div style={{ width: '100%', textAlign: 'end' }}>
            <Button type="primary" onClick={() => Router.push('/moradores/cadastrar')}>
              Novo Morador
            </Button>
          </div>
        </div>
        <TableList columns={columns} data={data} action={actionsColumn} />
      </BasicPage>
    </>
  );
}

export default Residents;

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

    if (loggedUserType === UserTypes.RESIDENT) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const { data: residents } = await apiClient.post<User[]>('/services/findUserList', {
      id_condominium: loggedUser.id_condominium,
    });
    const filteredResidents = residents.filter(
      (r) => findUserTypeById(userTypes, r.id_userType).type === UserTypes.RESIDENT
    );

    return {
      props: {
        ok: true,
        loggedUserType,
        residents: filteredResidents,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
