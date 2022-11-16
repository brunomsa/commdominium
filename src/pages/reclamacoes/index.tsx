import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { Avatar, Card, Comment, List, message, Modal, Radio, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { BasicPage, Button, ComplaintSettings } from '../../components';
import { AuthContext } from '../../contexts/AuthContext';
import { recoverUserInfo } from '../../services/auth';
import { catchPageError, getApiClient } from '../../services/axios';
import { ApiError } from '../../services/api';
import {
  Complaint,
  ComplaintForm,
  ComplaintTypes,
  createComplaint,
  deleteComplaint,
  updateComplaint,
  updateComplaintStatus,
} from '../../services/complaint';
import { findUserTypeById, UserType, UserTypes } from '../../services/userType';
import { MAX_ITENS_PAGE } from '../../utils/constants';
import { orderByDate } from '../../utils/orderByDate';
import { pageKey } from '../../utils/types';
import { toDayjs } from '../../utils/toDayjs';

import theme from '../../styles/theme';

interface Props {
  loggedUserType?: UserTypes;
  complaints?: Complaint[];
  ok: boolean;
  messageError?: ApiError;
}

function Complaints({ loggedUserType, complaints: initialComplaints, ok, messageError }: Props) {
  const { user } = useContext(AuthContext);

  const initialFilteredComplaints = initialComplaints?.filter((c) => !c.resolved);

  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints ?? []);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialFilteredComplaints ?? []);
  const [complaintSelected, setComplaintSelected] = useState<Complaint>();

  const [complaintMode, setComplaintMode] = useState<ComplaintTypes>(ComplaintTypes.UNRESOLVED);

  const [showComplaintSettings, setShowComplaintSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError) {
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  useEffect(() => {
    if (!complaints) return;
    const resolved = complaintMode === ComplaintTypes.RESOLVED;
    setFilteredComplaints(complaints.filter((c) => Number(c.resolved) === Number(resolved)));
  }, [complaints, complaintMode]);

  const handleCreate = useCallback(
    async (values: ComplaintForm) => {
      if (!user) return;
      setLoading(true);
      const complaintData = {
        ...values,
        id_condominium: user.id_condominium,
        id_user: user.id,
        fullname: user.fullname,
        avatarArchive: user.avatarArchive,
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
      if (!complaintSelected) return;

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

  const handleUpdateStatus = useCallback(async (id: number) => {
    const { ok, data, error } = await updateComplaintStatus(id);
    if (error) {
      if (!ok) return message.error(error.error);

      if (ok) return message.warning(error.error);
    }
    if (ok && data) {
      setComplaints((prev) =>
        prev.map((complaint) => {
          if (complaint.id === id) {
            complaint.resolved = !complaint.resolved;
          }
          return complaint;
        })
      );

      return message.success('Reclamação atualizada com sucesso!');
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteComplaint(id);
    if (error) {
      if (!ok) return message.error(error.error);

      if (ok) return message.warning(error.error);
    }
    if (ok && data) {
      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
      return message.success('Reclamação excluída com sucesso!');
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

      <BasicPage pageKey={pageKey.COMPLAINTS} loggedUserType={loggedUserType}>
        {loggedUserType !== UserTypes.ASSIGNEE && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            {loggedUserType === UserTypes.RESIDENT && <h1 style={{ minWidth: 'max-content' }}>Minhas Reclamações</h1>}
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button type="primary" onClick={() => setShowComplaintSettings(true)}>
                Criar Reclamação
              </Button>
            </div>
          </div>
        )}

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
          dataSource={orderByDate<Complaint>(filteredComplaints)}
          pagination={filteredComplaints.length > MAX_ITENS_PAGE ? { pageSize: MAX_ITENS_PAGE } : undefined}
          renderItem={(complaint) => (
            <Card style={{ boxShadow: theme.boxShadow, marginBottom: 24 }} bordered={false}>
              <List.Item
                actions={
                  loggedUserType !== UserTypes.ASSIGNEE
                    ? [
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          tooltip="Editar"
                          onClick={() => {
                            setShowComplaintSettings(true);
                            setComplaintSelected(complaint);
                          }}
                        />,
                        <Button
                          backgroundColor={theme.colors.RED}
                          icon={<DeleteOutlined />}
                          tooltip="Excluir"
                          onClick={() => confirmDeleteModal(complaint.id)}
                        />,
                      ]
                    : [
                        <Tooltip
                          title={
                            complaintMode === ComplaintTypes.UNRESOLVED
                              ? 'Marcar como resolvida'
                              : 'Marcar como não resolvida'
                          }
                        >
                          <Button
                            key={complaint.id}
                            type="primary"
                            backgroundColor={
                              complaintMode === ComplaintTypes.UNRESOLVED ? theme.colors.GREEN : theme.colors.RED
                            }
                            icon={
                              complaintMode === ComplaintTypes.UNRESOLVED ? (
                                <CheckCircleOutlined />
                              ) : (
                                <CloseCircleOutlined />
                              )
                            }
                            onClick={() => handleUpdateStatus(complaint.id)}
                          />
                        </Tooltip>,
                      ]
                }
              >
                <Comment
                  author={complaint.fullname}
                  avatar={<Avatar icon={<UserOutlined />} src={complaint?.avatarArchive} />}
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
    const { data: loggedUser } = await recoverUserInfo(token);
    const { data: userTypes = [] } = await apiClient.get<UserType[]>('/userType/findAll');
    const { data: complaints = [] } = await apiClient.post<Complaint[]>('/services/findAllComplaints', {
      id_condominium: loggedUser.id_condominium,
    });

    const loggedUserType = findUserTypeById(userTypes, loggedUser.id_userType)?.type;
    const filteredComplaints =
      loggedUserType === UserTypes.RESIDENT ? complaints?.filter((c) => c.id_user === loggedUser.id) : complaints;

    return {
      props: {
        ok: true,
        loggedUserType,
        complaints: filteredComplaints,
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
