import React, { useCallback, useContext, useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { Avatar, Card, Comment, List, message, Modal, Radio } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { BasicPage, Button, ComplaintSettings } from '../../components';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import {
  Complaint,
  ComplaintForm,
  ComplaintTypes,
  createComplaint,
  deleteComplaint,
  updateComplaint,
} from '../../services/complaint';
import { ApiError } from '../../services/api';
import { pageKey } from '../../utils/types';
import { toDayjs } from '../../utils/toDayjs';
import { AuthContext } from '../../contexts/AuthContext';
import { orderByDate } from '../../utils/orderByDate';

interface Props {
  complaints: Complaint[];
  ok: boolean;
  messageError?: ApiError;
}

const MAX_COMPLAINTS = 10;
let showError = false;

function Complaints({ complaints: initialComplaints, ok, messageError }: Props) {
  const { user } = useContext(AuthContext);

  const initialFilteredComplaints = initialComplaints.filter((c) => c.resolved === false);

  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialFilteredComplaints);
  const [complaintSelected, setComplaintSelected] = useState<Complaint>();

  const [complaintMode, setComplaintMode] = useState<ComplaintTypes>(ComplaintTypes.UNRESOLVED);

  const [showComplaintSettings, setShowComplaintSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  useEffect(() => {
    const resolved = complaintMode === ComplaintTypes.RESOLVED;
    setFilteredComplaints(complaints.filter((c) => c.resolved === resolved));
  }, [complaints, complaintMode]);

  const handleCreate = useCallback(
    async (values: ComplaintForm) => {
      setLoading(true);
      const complaintData = {
        ...values,
        id_condominium: user?.id_condominium,
        id_user: user?.id,
        resolved: false,
      };
      const { ok, error, data: newComplaint } = await createComplaint(complaintData);
      if (!ok && error) {
        setLoading(false);

        return message.error(error.error);
      }

      setComplaints((prev) => [newComplaint, ...prev]);
      setShowComplaintSettings(false);
      setLoading(false);
      message.success('Aviso criado com sucesso!');
    },
    [user]
  );

  const handleUpdate = useCallback(
    async (values: ComplaintForm) => {
      setLoading(true);
      const complaintData = {
        ...complaintSelected,
        ...values,
        resolved: false,
      };

      const { ok, error } = await updateComplaint(complaintData);
      if (!ok && error) return message.error(error.error);

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === complaintSelected.id) {
            c = { ...c, ...values, updatedAt: new Date() };
          }
          return c;
        })
      );

      setShowComplaintSettings(false);
      setLoading(false);
      setComplaintSelected(undefined);
      message.success('Reclamação atualizada com sucesso!');
    },
    [complaintSelected]
  );

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteComplaint(id);
    if (error) {
      if (!ok) return message.error(error.error);

      if (ok) return message.warning(error.error);
    }
    if (ok && data) {
      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
      return message.success('Reclamação excluída com sucesso');
    }
  }, []);

  const confirmDeleteModal = (id: number) => {
    Modal.confirm({
      title: 'Excluir reclamação',
      icon: <ExclamationCircleOutlined />,
      content: 'Tem certeza que deseja excluir esta reclamação?',
      okText: 'Sim',
      cancelText: 'Não',
      autoFocusButton: 'cancel',
      onOk: async () => await handleDelete(id),
      onCancel: () => {},
    });
  };

  return (
    <>
      <Head>
        <title>Reclamações</title>
      </Head>

      <BasicPage pageKey={pageKey.COMPLAINTS}>
        <div style={{ width: '100%', textAlign: 'end', marginBottom: 32 }}>
          <Button type="primary" onClick={() => setShowComplaintSettings(true)}>
            Criar Reclamação
          </Button>
        </div>
        <Radio.Group
          defaultValue={ComplaintTypes.UNRESOLVED}
          buttonStyle="solid"
          style={{ width: '100%', textAlign: 'center', marginBottom: 32 }}
          onChange={(e) => setComplaintMode(e.target.value)}
        >
          <Radio.Button value={ComplaintTypes.UNRESOLVED}>Não resolvidas</Radio.Button>
          <Radio.Button value={ComplaintTypes.RESOLVED}>Resolvidas</Radio.Button>
        </Radio.Group>
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={orderByDate(filteredComplaints)}
          pagination={filteredComplaints.length > MAX_COMPLAINTS ? { pageSize: MAX_COMPLAINTS } : undefined}
          renderItem={(complaint) => (
            <Card
              style={{
                boxShadow:
                  '0 1px 2px -2px rgb(0 0 0 / 64%), 0 3px 6px 0 rgb(0 0 0 / 48%), 0 5px 12px 4px rgb(0 0 0 / 36%)',
                marginBottom: 24,
              }}
              bordered={false}
            >
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setShowComplaintSettings(true);
                      setComplaintSelected(complaint);
                    }}
                  />,
                  <Button
                    className="delete"
                    icon={<DeleteOutlined />}
                    onClick={() => confirmDeleteModal(complaint.id)}
                  />,
                ]}
              >
                <Comment
                  author={user?.fullname}
                  avatar={user?.avatarArchive && <Avatar src={user?.avatarArchive} />}
                  content={<p>{complaint.message}</p>}
                  datetime={<span>{toDayjs(complaint.updatedAt).fromNow()}</span>}
                />
              </List.Item>
            </Card>
          )}
        />
        <Modal
          title={!complaintSelected ? 'Nova Reclamação' : 'Editar Reclamação'}
          destroyOnClose
          footer={null}
          open={showComplaintSettings}
          onCancel={() => {
            setComplaintSelected(undefined);
            setShowComplaintSettings(false);
          }}
        >
          <ComplaintSettings
            loading={loading}
            initialValues={{ ...complaintSelected }}
            onSubmit={complaintSelected ? handleUpdate : handleCreate}
            onCancel={() => {
              setComplaintSelected(undefined);
              setShowComplaintSettings(false);
            }}
          />
        </Modal>
      </BasicPage>
    </>
  );
}

export default Complaints;

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
    const { status, data: complaints } = await apiClient.get<Complaint[]>('/complaint/findAll');

    if (status === 204) {
      return {
        props: {
          ok: false,
          complaints: [],
          messageError: { error: 'Nenhuma reclamação encontrada' },
        },
      };
    }

    return {
      props: {
        ok: true,
        complaints: complaints.filter((c) => c.id_condominium === user.id_condominium),
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
