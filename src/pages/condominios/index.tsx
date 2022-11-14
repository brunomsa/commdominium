import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import { Divider, message, Modal, Space, TableColumnsType, TableColumnType } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, Button, TableList } from '../../components';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { Condominium, deleteCondominium } from '../../services/condominium';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';

interface DataType {
  key: number;
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
}

interface Props {
  loggedUserType?: UserTypes;
  condominiums?: Condominium[];
  ok: boolean;
  messageError?: ApiError;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Nome',
    key: 'name',
    dataIndex: 'name',
    width: 200,
    showSorterTooltip: false,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Estado',
    key: 'state',
    dataIndex: 'state',
    width: 180,
    showSorterTooltip: false,
    sorter: (a, b) => a.state.localeCompare(b.state),
  },
  {
    title: 'Cidade',
    key: 'city',
    dataIndex: 'city',
    width: 180,
    showSorterTooltip: false,
    sorter: (a, b) => a.city.localeCompare(b.city),
  },
  {
    title: 'Rua',
    key: 'street',
    dataIndex: 'street',
    width: 180,
    showSorterTooltip: false,
    sorter: (a, b) => a.street.localeCompare(b.street),
  },
  {
    title: 'Número',
    dataIndex: 'number',
    showSorterTooltip: false,
    align: 'center',
    width: 100,
    sorter: (a, b) => a.number.localeCompare(b.number),
  },
];
let showError = false;

function Condominiums({ loggedUserType, condominiums: initialCondominiums, ok, messageError }: Props) {
  const [condominiums, setCondominiums] = useState<Condominium[]>(initialCondominiums);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    if (!condominiums) return;
    return condominiums.map((cond) => ({
      key: cond.id,
      name: cond.name,
      state: cond.state,
      city: cond.city,
      street: cond.street,
      number: cond.number,
    }));
  }, [condominiums]);

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteCondominium(id);
    if (error) {
      if (!ok) {
        return message.error(error.error);
      }
      if (ok) {
        return message.warning(error.error);
      }
    }
    if (ok && data) {
      setCondominiums((prev) => prev.filter((cond) => cond.id !== id));
      return message.success('Condomínio excluído com sucesso!');
    }
  }, []);

  const confirmDeleteModal = (id: number) => {
    Modal.confirm({
      title: 'Excluir condomínio',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja excluir este condomínio?',
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
      width: 125,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => Router.push(`condominios/${record.key}/editar`)}
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
        <title>Condomínios</title>
      </Head>

      <BasicPage pageKey={pageKey.CONDOMINIUMS} loggedUserType={loggedUserType}>
        <div style={{ width: '100%', textAlign: 'end', marginBottom: 32 }}>
          <Button type="primary" onClick={() => Router.push('/condominios/cadastrar')}>
            Novo Condomínio
          </Button>
        </div>
        <TableList columns={columns} data={data} action={actionsColumn} />
      </BasicPage>
    </>
  );
}

export default Condominiums;

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
    const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');
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
    const { status, data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');

    if (status === 204) {
      return {
        props: {
          ok: false,
          condominiums: [],
          messageError: { error: 'Nenhum condomínio encontrado' },
        },
      };
    }

    return {
      props: {
        ok: true,
        loggedUserType,
        condominiums,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
