import React, { PropsWithChildren, useCallback } from 'react';
import Router from 'next/router';

import Header from '../Header';

import * as styled from './styles';

interface Props {
  menuKey: string;
}

const BasicPage = ({ menuKey, children }: PropsWithChildren<Props>) => {
  const goTo = useCallback((key: string) => {
    const navigate: Record<string, string> = {
      home: '/',
      condominium: '/condominio',
      payment: '/pagamento',
      portal: '/portal',
      syndicate: '/sindico',
    };
    Router.push(navigate[key]);
  }, []);

  return (
    <styled.BasicPage>
      <Header selectedKey={menuKey} onChange={(key) => goTo(key)} />
      {children}
    </styled.BasicPage>
  );
};

export default BasicPage;
