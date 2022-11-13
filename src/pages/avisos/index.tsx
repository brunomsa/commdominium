import React, { useCallback, useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import moment from 'moment';

import { Avatar, Comment, List, message, Modal, Radio } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

import { BasicPage, Button, NoticeSettings } from '../../components';
import { catchPageError, getApiClient } from '../../services/axios';
import { ApiError } from '../../services/api';
import { recoverUserInfo } from '../../services/auth';
import { createNotice, deleteNotice, Notice, NoticeForm, updateNotice } from '../../services/notice';
import { findNoticeTypeById, NoticeType, NoticeTypes } from '../../services/noticeType';
import { pageKey } from '../../utils/types';
import { toDayjs } from '../../utils/toDayjs';
import { DATE_FORMAT_STRING } from '../../utils/constants';
import { orderByDate } from '../../utils/orderByDate';
import { User } from '../../services/user';
import { Condominium, getCondominiumById } from '../../services/condominium';
import theme from '../../styles/theme';

interface Props {
  notices?: Notice[];
  noticeTypes?: NoticeType[];
  condominium?: Condominium;
  assignee?: User;
  ok: boolean;
  messageError?: ApiError;
}

const MAX_NOTICES = 10;
const NOTICE_MODE_DEFAULT = NoticeTypes.HANDOUT;
let showError = false;

function Notices({ notices: initialNotices, noticeTypes, condominium, assignee, ok, messageError }: Props) {
  const initialFilteredNotices = initialNotices.filter(
    (n) => findNoticeTypeById(noticeTypes, n.id_noticeType)?.type === NOTICE_MODE_DEFAULT
  );

  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>(initialFilteredNotices);
  const [noticeSelected, setNoticeSelected] = useState<Notice>();

  const [noticeMode, setNoticeMode] = useState<NoticeTypes>(NOTICE_MODE_DEFAULT);

  const [showNoticeSettings, setShowNoticeSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ok && messageError && !showError) {
      showError = true;
      return message.error(messageError.error);
    }
  }, [ok, messageError]);

  useEffect(() => {
    setFilteredNotices(notices.filter((n) => findNoticeTypeById(noticeTypes, n.id_noticeType)?.type === noticeMode));
  }, [notices, noticeTypes, noticeMode]);

  const handleCreate = useCallback(
    async (values: NoticeForm) => {
      if (!condominium) return;
      setLoading(true);
      const { ok, error, data: newNotice } = await createNotice({ ...values, id_condominium: condominium.id });
      if (!ok && error) {
        setLoading(false);

        return message.error(error.error);
      }

      setNotices((prev) => [newNotice, ...prev]);
      setShowNoticeSettings(false);
      setLoading(false);
      message.success('Aviso criado com sucesso!');
    },
    [condominium?.id]
  );

  const handleUpdate = useCallback(
    async (values: NoticeForm) => {
      setLoading(true);
      const noticeData: Notice = {
        ...values,
        id: noticeSelected.id,
        eventDay: values.eventDay.format('YYYY-MM-DD'),
      };

      const { ok, error } = await updateNotice(noticeData);
      if (!ok && error) {
        setLoading(false);

        return message.error(error.error);
      }

      setNotices((prev) =>
        prev.map((n) => {
          if (n.id === noticeSelected.id) {
            n = { ...n, ...values, updatedAt: new Date() };
          }
          return n;
        })
      );

      setShowNoticeSettings(false);
      setLoading(false);
      setNoticeSelected(undefined);
      message.success('Aviso atualizado com sucesso!');
    },
    [noticeSelected]
  );

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteNotice(id);
    if (error) {
      if (!ok) return message.error(error.error);

      if (ok) return message.warning(error.error);
    }
    if (ok && data) {
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      return message.success('Aviso excluído com sucesso');
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

  return (
    <>
      <Head>
        <title>Avisos</title>
      </Head>

      <BasicPage pageKey={pageKey.NOTICES}>
        <div style={{ width: '100%', textAlign: 'end', marginBottom: 32 }}>
          <Button type="primary" onClick={() => setShowNoticeSettings(true)}>
            Criar Aviso
          </Button>
        </div>
        <Radio.Group
          defaultValue={NOTICE_MODE_DEFAULT}
          buttonStyle="solid"
          style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}
          onChange={(e) => setNoticeMode(e.target.value)}
        >
          <Radio.Button value={NoticeTypes.HANDOUT}>Avisos</Radio.Button>
          <Radio.Button value={NoticeTypes.MEETING}>Reuniões</Radio.Button>
        </Radio.Group>
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={orderByDate(filteredNotices)}
          pagination={filteredNotices.length > MAX_NOTICES ? { pageSize: MAX_NOTICES } : undefined}
          renderItem={(notice) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setShowNoticeSettings(true);
                    setNoticeSelected(notice);
                  }}
                />,
                <Button
                  backgroundColor={theme.colors.RED}
                  icon={<DeleteOutlined />}
                  onClick={() => confirmDeleteModal(notice.id)}
                />,
              ]}
            >
              <Comment
                avatar={assignee?.avatarArchive ? <Avatar src={assignee.avatarArchive} /> : <UserOutlined />}
                author={condominium?.name}
                content={
                  <>
                    <h2>{notice.title}</h2>
                    {notice.eventDay && <p>Dia: {moment(notice.eventDay).utcOffset(3).format(DATE_FORMAT_STRING)}</p>}
                    <p>{notice.message}</p>
                  </>
                }
                datetime={<span>{toDayjs(notice.updatedAt).fromNow()}</span>}
              />
            </List.Item>
          )}
        />
        <Modal
          title={!noticeSelected ? 'Novo Aviso' : 'Editar Aviso'}
          destroyOnClose
          footer={null}
          open={showNoticeSettings}
          onCancel={() => {
            setNoticeSelected(undefined);
            setShowNoticeSettings(false);
          }}
        >
          <NoticeSettings
            loading={loading}
            noticeTypes={noticeTypes}
            initialValues={{ ...noticeSelected, eventDay: moment(noticeSelected?.eventDay).utcOffset(3) }}
            onSubmit={noticeSelected ? handleUpdate : handleCreate}
            onCancel={() => {
              setNoticeSelected(undefined);
              setShowNoticeSettings(false);
            }}
          />
        </Modal>
      </BasicPage>
    </>
  );
}

export default Notices;

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
    const { status, data: notices } = await apiClient.post<Notice[]>('/services/findAllOrderedNotices', {
      id_condominium: user.id_condominium,
    });
    const { data: noticeTypes } = await apiClient.get<NoticeType[]>('/noticeType/findAll');
    const { data: condominium } = await getCondominiumById(user.id_condominium);
    const { data: assignee } = await apiClient.post<User[]>('services/searchCondominiumAssignee', {
      id_condominium: user.id_condominium,
    });

    if (status === 204) {
      return {
        props: {
          ok: false,
          notices: [],
          messageError: { error: 'Nenhum aviso encontrado' },
        },
      };
    }

    return {
      props: {
        ok: true,
        notices,
        noticeTypes,
        condominium: condominium,
        assignee: assignee[0],
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
