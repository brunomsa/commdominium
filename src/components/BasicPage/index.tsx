import React, { PropsWithChildren, useCallback } from 'react';
import Router from 'next/router';

import { pageKey } from '../../utils/types';

import Header from '../Header';

import * as styled from './styles';

interface Props {
  pageKey: pageKey;
}

const BasicPage = ({ pageKey, children }: PropsWithChildren<Props>) => {
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

  return (
    <styled.BasicPage>
      <Header selectedKey={pageKey} onChange={(key) => goTo(key)} />
      <main>{children}</main>
    </styled.BasicPage>
  );
};

export default BasicPage;
