import React, { PropsWithChildren, useCallback, useContext } from 'react';
import Router from 'next/router';

import Header from '../Header';
import PageLoader from '../PageLoader';

import { AuthContext } from '../../contexts/AuthContext';
import { UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import * as styled from './styles';

interface Props {
  pageKey?: pageKey;
  loggedUserType: UserTypes;
}

const BasicPage = ({ pageKey, loggedUserType, children }: PropsWithChildren<Props>) => {
  const { user } = useContext(AuthContext);

  const goTo = useCallback((key: string) => {
    const navigate: Record<pageKey, string> = {
      home: '/',
      payment: '/financeiro',
      notices: '/avisos',
      complaints: '/reclamacoes',
      residents: '/moradores',
      condominiums: '/condominios',
      users: '/usuarios',
    };
    Router.push(navigate[key]);
  }, []);

  return !user ? (
    <PageLoader />
  ) : (
    <styled.BasicPage>
      <Header selectedKey={pageKey} loggedUserType={loggedUserType} onChange={(key) => goTo(key)} />
      <main>{children}</main>
    </styled.BasicPage>
  );
};

export default BasicPage;
