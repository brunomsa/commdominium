import React, { PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import Router from 'next/router';

import Header from '../Header';
import PageLoader from '../PageLoader';

import { AuthContext } from '../../contexts/AuthContext';
import { UserTypes } from '../../services/userType';
import { PageKey } from '../../utils/types';

import * as styled from './styles';
import MobileMenu from './MobileMenu';

interface Props {
  pageKey?: PageKey;
  loggedUserType: UserTypes;
}

const BasicPage = ({ pageKey, loggedUserType, children }: PropsWithChildren<Props>) => {
  const { user } = useContext(AuthContext);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuOptions = useMemo(() => {
    return [
      { key: PageKey.HOME, label: 'Início' },
      loggedUserType !== UserTypes.RESIDENT && { key: PageKey.PAYMENT, label: 'Financeiro' },
      { key: PageKey.NOTICES, label: 'Avisos' },
      { key: PageKey.COMPLAINTS, label: 'Reclamações' },
      loggedUserType !== UserTypes.RESIDENT && { key: PageKey.RESIDENTS, label: 'Moradores' },
      loggedUserType === UserTypes.ADMIN && { key: PageKey.CONDOMINIUMS, label: 'Condomínios' },
      loggedUserType === UserTypes.ADMIN && { key: PageKey.USERS, label: 'Usuários' },
    ];
  }, [loggedUserType]);

  const goTo = useCallback((key: string) => {
    const navigate: Record<PageKey, string> = {
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
      <MobileMenu
        options={menuOptions}
        menuVisibility={showMobileMenu}
        setMenuVisibility={setShowMobileMenu}
        onClick={goTo}
      />
      <Header
        menuOptions={menuOptions}
        selectedKey={pageKey}
        loggedUserType={loggedUserType}
        onChange={(key) => goTo(key)}
        setMenuVisibility={setShowMobileMenu}
      />
      <main>{children}</main>
    </styled.BasicPage>
  );
};

export default BasicPage;
