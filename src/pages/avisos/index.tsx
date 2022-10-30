import React, { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

import { Button, Comment, Drawer, List, message, Modal, Radio } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

import { BasicPage, NoticeSettings } from '../../components';
import { catchPageError, getApiClient } from '../../services/axios';
import { createNotice, deleteNotice, Notice, updateNotice } from '../../services/notice';
import { findNoticeTypeById, NoticeType, NoticeTypes } from '../../services/noticeType';
import { recoverUserInfo } from '../../services/auth';
import { pageKey } from '../../utils/types';
import { toDayjs } from '../../utils/toDayjs';

interface Props {
  notices: Notice[];
  noticeTypes: NoticeType[];
  condominiumId: number;
}

const MAX_NOTICES = 10;
const NOTICE_MODE_DEFAULT = NoticeTypes.HANDOUT;

function Notices({ notices: initialNotices, noticeTypes, condominiumId }: Props) {
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
    setFilteredNotices(notices.filter((n) => findNoticeTypeById(noticeTypes, n.id_noticeType)?.type === noticeMode));
  }, [notices, noticeTypes, noticeMode]);

  const handleCreate = useCallback(
    async (values: Omit<Notice, 'id'>) => {
      setLoading(true);
      const { ok, error, data: newNotice } = await createNotice({ ...values, id_condominium: condominiumId });
      if (!ok && error) {
        setLoading(false);

        return message.error(error.error);
      }

      setNotices((prev) => [newNotice, ...prev]);
      setShowNoticeSettings(false);
      setLoading(false);
      message.success('Aviso criado com sucesso!');
    },
    [condominiumId]
  );

  const handleUpdate = useCallback(
    async (values: Omit<Notice, 'id'>) => {
      setLoading(true);

      const { ok, error } = await updateNotice({ ...values, id: noticeSelected.id });
      if (!ok && error) {
        setLoading(false);

        return message.error(error.error);
      }

      setNotices((prev) =>
        prev.map((n) => {
          if (n.id === noticeSelected.id) {
            n = { ...n, ...values };
          }
          return n;
        })
      );

      setShowNoticeSettings(false);
      setLoading(false);
      setNoticeSelected(undefined);
      message.success('Aviso editado com sucesso!');
    },
    [noticeSelected]
  );

  const handleDelete = useCallback(async (id: number) => {
    const { ok, data, error } = await deleteNotice(id);
    if (error) {
      if (!ok) {
        return message.error(error.error);
      }
      if (ok) {
        return message.warning(error.error);
      }
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
      onOk: async () => await handleDelete(id),
      onCancel: () => {},
    });
  };
  console.log(noticeSelected);
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
          style={{ width: '100%', textAlign: 'center' }}
          onChange={(e) => setNoticeMode(e.target.value)}
        >
          <Radio.Button value={NoticeTypes.HANDOUT}>Comunicados</Radio.Button>
          <Radio.Button value={NoticeTypes.MEETING}>Reuniões</Radio.Button>
        </Radio.Group>
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={filteredNotices}
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
                <Button className="delete" icon={<DeleteOutlined />} onClick={() => confirmDeleteModal(notice.id)} />,
              ]}
            >
              <Comment
                avatar={<UserOutlined />}
                content={<p>{notice.message}</p>}
                datetime={<span>{toDayjs(notice.updatedAt).fromNow()}</span>}
              />
            </List.Item>
          )}
        />
        <Drawer
          title="Novo Aviso"
          placement="right"
          destroyOnClose
          open={showNoticeSettings}
          onClose={() => setShowNoticeSettings(false)}
        >
          <NoticeSettings
            loading={loading}
            noticeTypes={noticeTypes}
            initialValues={noticeSelected}
            onSubmit={noticeSelected ? handleUpdate : handleCreate}
            onCancel={() => {
              setNoticeSelected(undefined);
              setShowNoticeSettings(false);
            }}
          />
        </Drawer>
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
    const { data: allNotices } = await apiClient.get<Notice[]>('/notices/findAll');
    const { data: noticeTypes } = await apiClient.get<NoticeType[]>('/noticeType/findAll');
    const { data: user } = await recoverUserInfo(token);
    const notices = allNotices.filter((n) => n.id_condominium === user.id_condominium);

    return {
      props: {
        ok: true,
        notices,
        noticeTypes,
        condominiumId: user.id_condominium,
      },
    };
  } catch (error) {
    catchPageError(error);
  }
};
