import React, { useCallback, useContext, useEffect, useState } from 'react';

import moment from 'moment';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { Alert, message } from 'antd';
import { AuditOutlined, BulbOutlined } from '@ant-design/icons';

import { BasicPage, SwitchCard } from '../components';
import { AuthContext } from '../contexts/AuthContext';
import { ApiError } from '../services/api';
import { recoverUserInfo } from '../services/auth';
import { catchPageError, getApiClient } from '../services/axios';
import { Complaint, ComplaintTypes } from '../services/complaint';
import { Condominium, getCondominiumById } from '../services/condominium';
import { Notice } from '../services/notice';
import { findNoticeTypeById, NoticeType, NoticeTypes } from '../services/noticeType';
import { Payment } from '../services/payment';
import { User } from '../services/user';
import { findUserTypeById, UserType, UserTypes } from '../services/userType';
import { PageKey } from '../utils/types';

import * as styled from '../styles/pages/Home';

interface Props {
  loggedUserType?: UserTypes;
  condominium?: Condominium;
  assignee?: User;
  recentBill?: Payment;
  noticeTypes?: NoticeType[];
  notices?: Notice[];
  complaints?: Complaint[];
  ok: boolean;
  messageError?: ApiError;
}
const TODAY = new Date();
const NOTICE_MODE_DEFAULT = NoticeTypes.HANDOUT;
const COMPLAINT_MODE_DEFAULT = ComplaintTypes.UNRESOLVED;

function Home({
  loggedUserType,
  condominium,
  assignee,
  recentBill,
  noticeTypes,
  notices,
  complaints,
  ok,
  messageError,
}: Props) {
  const { user } = useContext(AuthContext);

  const initialFilteredComplaints = complaints?.filter((c) => !c.resolved);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialFilteredComplaints ?? []);

  const initialFilteredNotice = notices?.filter(
    (n) => findNoticeTypeById(noticeTypes, n?.id_noticeType)?.type === NOTICE_MODE_DEFAULT
  );
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>(initialFilteredNotice ?? []);

  const [noticeMode, setNoticeMode] = useState<NoticeTypes>(NOTICE_MODE_DEFAULT);
  const [complaintMode, setComplaintMode] = useState<ComplaintTypes>(COMPLAINT_MODE_DEFAULT);

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

  useEffect(() => {
    if (!notices || !noticeTypes) return;
    setFilteredNotices(notices.filter((n) => findNoticeTypeById(noticeTypes, n.id_noticeType)?.type === noticeMode));
  }, [notices, noticeTypes, noticeMode]);

  const handleComplaintSwitchChange = useCallback((checked: boolean) => {
    if (!checked) setComplaintMode(ComplaintTypes.RESOLVED);
    else setComplaintMode(COMPLAINT_MODE_DEFAULT);
  }, []);

  const handleNoticeSwitchChange = useCallback((checked: boolean) => {
    if (!checked) setNoticeMode(NoticeTypes.MEETING);
    else setNoticeMode(NOTICE_MODE_DEFAULT);
  }, []);

  return (
    <styled.Home>
      <Head>
        <title>Início</title>
      </Head>

      <BasicPage pageKey={PageKey.HOME} loggedUserType={loggedUserType}>
        <h1 style={{ marginBottom: 32 }}>Olá, {user?.fullname.split(' ')[0]}!</h1>

        {recentBill?.billArchive && (
          <Alert
            message={<h2 className="alertTitle">Boleto disponível</h2>}
            description={
              <p>
                Clique
                <a href={recentBill.billArchive} download="Boleto.pdf" style={{ padding: '0 4px' }}>
                  aqui
                </a>
                para fazer o download do boleto mais recente.
              </p>
            }
            type="info"
            showIcon
            closable
            style={{ marginBottom: 32 }}
          />
        )}

        <div className="cards">
          <SwitchCard<Notice>
            itens={filteredNotices}
            headerTitle="Avisos recentes"
            headerIcon={<BulbOutlined />}
            checkedChildren="Comunicados"
            unCheckedChildren="Reuniões"
            onSwitchChange={handleNoticeSwitchChange}
            urlButton="/avisos"
            condominiumName={condominium?.name}
            avatarAssigneeUrl={assignee?.avatarArchive}
          />
          <SwitchCard<Complaint>
            itens={filteredComplaints}
            headerTitle="Reclamações recentes"
            headerIcon={<AuditOutlined />}
            checkedChildren="Não resolvidas"
            unCheckedChildren="Resolvidas"
            onSwitchChange={handleComplaintSwitchChange}
            urlButton="/reclamacoes"
          />
        </div>
      </BasicPage>
    </styled.Home>
  );
}

export default Home;

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

    const { data: condominium } = await getCondominiumById(loggedUser.id_condominium);
    const { data: assignee = [] } = await apiClient.post<User[]>('services/searchCondominiumAssignee', {
      id_condominium: loggedUser.id_condominium,
    });

    const { data: payments = [] } = await apiClient.post<Payment[]>('services/findAllOrderedPayments', {
      id_user: loggedUser.id,
    });
    const monthPayment = payments.filter((p) => moment(p.dueDate).month() === TODAY.getMonth());

    const { data: noticeTypes = [] } = await apiClient.get<NoticeType[]>('/noticeType/findAll');
    const { data: notices = [] } = await apiClient.post<Notice[]>('/services/findAllOrderedNotices', {
      id_condominium: loggedUser.id_condominium,
    });

    const { data: complaints = [] } = await apiClient.post<Complaint[]>('/services/findAllComplaints', {
      id_condominium: loggedUser.id_condominium,
    });
    const filteredComplaints =
      loggedUserType === UserTypes.RESIDENT ? complaints.filter((c) => c.id_user === loggedUser.id) : complaints;

    return {
      props: {
        ok: true,
        loggedUserType,
        condominium: condominium,
        assignee: assignee?.[0] ?? [],
        recentBill: monthPayment?.[0] ?? [],
        noticeTypes: noticeTypes,
        notices: notices,
        complaints: filteredComplaints.slice(0, 5),
      },
    };
  } catch (error) {
    return catchPageError(error);
  }
};
