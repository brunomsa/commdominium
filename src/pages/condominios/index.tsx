import React, { useCallback, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { ApiError } from 'next/dist/server/api-utils';
import { parseCookies } from 'nookies';
import axios, { AxiosError } from 'axios';

import { Button, message, Modal, Space } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, TableList } from '../../components';
import { pageKey } from '../../utils/types';
import { getApiClient } from '../../services/axios';
import { Condominium, deleteCondominium } from '../../services/condominium';

interface DataType {
  key: number;
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
}

interface Props {
  condominiums?: Condominium[];
}

const columns: ColumnsType<DataType> = [
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

function Condominiums({ condominiums: initialCondominiums }: Props) {
  const [condominiums, setCondominiums] = useState<Condominium[]>(initialCondominiums);

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
      return message.success('Condomínio excluído com sucesso');
    }
  }, []);

  const confirmDeleteModal = (id: number) => {
    Modal.confirm({
      title: 'Excluir condomínio',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja excluir este condomínio?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => await handleDelete(id),
      onCancel: () => {},
    });
  };

  const actionsColumn: ColumnType<DataType> = useMemo(() => {
    return {
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => Router.push(`condominios/${record.key}/editar`)}
          />
          <Button className="delete" icon={<DeleteOutlined />} onClick={() => confirmDeleteModal(record.key)} />
        </Space>
      ),
    };
  }, []);

  return (
    <>
      <Head>
        <title>Condomínios</title>
      </Head>

      <BasicPage pageKey={pageKey.CONDOMINIUMS}>
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
    const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');

    return {
      props: {
        ok: true,
        condominiums,
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
