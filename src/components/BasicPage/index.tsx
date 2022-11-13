import React, { PropsWithChildren, useCallback, useContext } from 'react';
import Router from 'next/router';

import { pageKey } from '../../utils/types';

import Header from '../Header';

import * as styled from './styles';
import { AuthContext } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';

interface Props {
  pageKey?: pageKey;
}

const BasicPage = ({ pageKey, children }: PropsWithChildren<Props>) => {
  const { user } = useContext(AuthContext);

  const goTo = useCallback((key: string) => {
    const navigate: Record<pageKey, string> = {
      home: '/',
      condominiums: '/condominios',
      payment: '/financeiro',
      notices: '/avisos',
      complaints: '/reclamacoes',
      users: '/usuarios',
    };
    Router.push(navigate[key]);
  }, []);

  return !user ? (
    <PageLoader />
  ) : (
    <styled.BasicPage>
      <Header selectedKey={pageKey} onChange={(key) => goTo(key)} />
      <main>{children}</main>
    </styled.BasicPage>
  );
};

export default BasicPage;
