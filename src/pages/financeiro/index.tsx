import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { message, Modal, TableColumnsType, TableColumnType } from 'antd';
import { DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, Button, PaymentSettings, TableList } from '../../components';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { BASE_API_URL } from '../../services/constants';
import { createPayment, FormPayment, Payment, updatePayment, verifyBillExistance } from '../../services/payment';
import { User } from '../../services/user';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import theme from '../../styles/theme';
import { AuthContext } from '../../contexts/AuthContext';

interface DataType {
  key: number;
  name: string;
  block: string;
  building: string;
  number: string;
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
    width: 150,
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

function Residents({ loggedUserType, residents, ok, messageError }: Props) {
  const { user: loggedUser } = useContext(AuthContext);

  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  const data: DataType[] = useMemo(() => {
    if (!loggedUser || !residents) return [];

    return residents
      .filter((i) => i.id !== loggedUser.id)
      .map((user) => ({
        key: user.id,
        name: user.fullname,
        building: user.building ? user.building : '-',
        block: user.block ? user.block : '-',
        number: user.number,
      }));
  }, [loggedUser, residents]);

  const actionsColumn: TableColumnType<DataType> = useMemo(() => {
    return {
      align: 'center',
      fixed: 'right',
      width: 50,
      render: (_, record) => (
        <Button
          backgroundColor={theme.colors.GREEN}
          type="primary"
          icon={<DollarOutlined />}
          tooltip="Cadastrar novo boleto"
          onClick={() => {
            setShowPaymentSettings(true);
            setSelectedResidentId(record.key);
          }}
        />
      ),
    };
  }, []);

  const handleUpdate = useCallback(async (values: Payment) => {
    const { ok, error } = await updatePayment(values);
    if (!ok && error) return message.error(error.error);

    setShowPaymentSettings(false);
    message.success('Boleto atualizado com sucesso!');
  }, []);

  const confirmUpadateModal = (values: Payment) => {
    Modal.confirm({
      title: 'Boleto existente',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <p>Ja foi encontrado um boleto para esse usuário neste mês de vencimento.</p>
          <p>Gostaria de atualizar o boleto?</p>
        </>
      ),
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => await handleUpdate(values),
      onCancel: () => {},
    });
  };

  const handleCreate = useCallback(
    async (values: FormPayment) => {
      if (!selectedResidentId) return;

      setLoading(true);
      const { data: billExistance } = await verifyBillExistance(selectedResidentId, values.dueDate);

      if (!billExistance?.length) {
        setLoading(false);
        const { ok, error } = await createPayment({ ...values, id_user: selectedResidentId });
        if (!ok && error) return message.error(error.error);
      } else {
        setLoading(false);
        const paymentData: Payment = {
          ...billExistance[0],
          billArchive: values.billArchive,
        };
        return confirmUpadateModal(paymentData);
      }

      setShowPaymentSettings(false);
      setLoading(false);
      message.success('Boleto cadastrado com sucesso!');
    },
    [confirmUpadateModal, selectedResidentId]
  );

  return (
    <>
      <Head>
        <title>Financeiro</title>
      </Head>

      <BasicPage pageKey={pageKey.PAYMENT} loggedUserType={loggedUserType}>
        <h1 style={{ marginBottom: 32 }}>Cadastrar boletos</h1>
        <TableList columns={columns} data={data} action={actionsColumn} />

        <Modal
          title="Cadastrar Boleto"
          destroyOnClose
          footer={null}
          open={showPaymentSettings}
          onCancel={() => setShowPaymentSettings(false)}
        >
          <PaymentSettings
            loading={loading}
            onSubmit={handleCreate}
            onCancel={() => {
              setShowPaymentSettings(false);
              setSelectedResidentId(undefined);
            }}
          />
        </Modal>
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

    const { data: residents } = await apiClient.post<User[]>(`${BASE_API_URL}/services/findUserList`, {
      id_condominium: loggedUser.id_condominium,
    });
    const filteredResidents =
      loggedUserType === UserTypes.ASSIGNEE
        ? residents?.filter((r) => findUserTypeById(userTypes, r.id_userType).type === UserTypes.RESIDENT)
        : residents;

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
