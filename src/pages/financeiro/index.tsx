import { DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Modal, TableColumnsType, TableColumnType } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BasicPage, PaymentSettings, TableList } from '../../components';
import { api, ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { BASE_API_URL } from '../../services/constants';
import { createPayment, FormPayment, Payment, updatePayment, verifyBillExistance } from '../../services/payment';
import { User } from '../../services/user';
import { pageKey } from '../../utils/types';

interface DataType {
  key: number;
  name: string;
  block: string;
  building: string;
  number: string;
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
];

interface Props {
  residents: User[];
  ok: boolean;
  messageError?: ApiError;
}
let showError = false;

function Residents({ residents, ok, messageError }: Props) {
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    return residents.map((user) => ({
      key: user.id,
      name: user.fullname,
      building: user.building ? user.building : '-',
      block: user.block ? user.block : '-',
      number: user.number,
    }));
  }, [residents]);

  const actionsColumn: TableColumnType<DataType> = useMemo(() => {
    return {
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => {
            setShowPaymentSettings(true);
            setSelectedResidentId(record.key);
          }}
        />
      ),
    };
  }, []);

  const handleUpdate = useCallback(async (values: Payment) => {
    const { ok, error } = await updatePayment({ ...values });
    if (!ok && error) return message.error(error.error);

    message.success('Boleto atualizado com sucesso!');
  }, []);

  const confirmUpadateModal = (values: Payment) => {
    Modal.confirm({
      title: 'Boleto existente',
      icon: <ExclamationCircleOutlined />,
      content:
        'Ja foi encontrado um boleto para esse usuário nesta data de vencimento. \n Gostaria de atualizar o boleto?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => await handleUpdate(values),
      onCancel: () => {},
    });
  };

  const handleCreate = useCallback(
    async (values: FormPayment) => {
      setLoading(true);
      const { data: billExistance } = await verifyBillExistance(selectedResidentId, values.dueDate);

      if (!billExistance) {
        setLoading(false);
        const { ok, error } = await createPayment({ ...values, id_user: selectedResidentId });
        if (!ok && error) return message.error(error.error);
      } else {
        setLoading(false);
        return confirmUpadateModal({ ...billExistance, billArchive: values.billArchive });
      }

      setShowPaymentSettings(false);
      setLoading(false);
      message.success('Boleto cadastrado com sucesso!');
    },
    [confirmUpadateModal, selectedResidentId]
  );

  return (
    <>
      <Head>Financeiro</Head>

      <BasicPage pageKey={pageKey.PAYMENT}>
        <h1>Moradores</h1>
        <TableList columns={columns} data={data} action={actionsColumn} />

        <Drawer
          title="Cadastrar Boleto"
          placement="right"
          destroyOnClose
          open={showPaymentSettings}
          onClose={() => setShowPaymentSettings(false)}
        >
          <PaymentSettings
            loading={loading}
            onSubmit={handleCreate}
            onCancel={() => {
              setShowPaymentSettings(false);
              setSelectedResidentId(undefined);
            }}
          />
        </Drawer>
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
    const { data: user } = await recoverUserInfo(token);

    const { status, data: residents } = await apiClient.post<User>(`${BASE_API_URL}/services/findUserList`, {
      id_condominium: user.id_condominium,
    });

    if (status === 204) {
      return {
        props: {
          ok: false,
          residents: [],
          messageError: { error: 'Nenhum morador encontrado' },
        },
      };
    }

    return {
      props: {
        ok: true,
        residents,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
