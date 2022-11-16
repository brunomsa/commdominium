import React, { useContext, useMemo, useState } from 'react';
import Router from 'next/router';

import { Avatar, Badge, Menu, Popover } from 'antd';
import {
  BellOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { AuthContext } from '../../contexts/AuthContext';
import { UserTypes } from '../../services/userType';
import { pageKey } from '../../utils/types';

import EmptyState from '../EmptyState';

import theme from '../../styles/theme';
import * as styled from './styles';

const profileMenuOptions = [
  { key: 'myProfile', label: 'Editar perfil', icon: <SettingOutlined /> },
  { key: 'myCond', label: 'Meu condomínio', icon: <HomeOutlined /> },
  { key: 'changePassword', label: 'Alterar a senha', icon: <LockOutlined /> },
  { key: 'logout', label: 'Sair', icon: <LogoutOutlined /> },
];

interface Props {
  selectedKey: string;
  loggedUserType: UserTypes;
  onChange: (key: string) => void;
}

function Header({ selectedKey, loggedUserType, onChange }: Props) {
  const { user, signOut } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuOptions = useMemo(() => {
    return [
      { key: pageKey.HOME, label: 'Início' },
      loggedUserType !== UserTypes.RESIDENT && { key: pageKey.PAYMENT, label: 'Financeiro' },
      { key: pageKey.NOTICES, label: 'Avisos ' },
      { key: pageKey.COMPLAINTS, label: 'Reclamações' },
      loggedUserType !== UserTypes.RESIDENT && { key: pageKey.RESIDENTS, label: 'Moradores' },
      loggedUserType === UserTypes.ADMIN && { key: pageKey.CONDOMINIUMS, label: 'Condomínios' },
      loggedUserType === UserTypes.ADMIN && { key: pageKey.USERS, label: 'Usuários' },
    ];
  }, [loggedUserType]);

  const onProfileMenuClick: Record<string, () => void> = {
    myProfile: () => Router.push('/meu-perfil'),
    myCond: () => console.log('myCond'),
    changePassword: () => console.log('changePassword'),
    logout: signOut,
  };

  const profileSettings = useMemo(() => {
    return (
      <styled.ProfileSettings>
        <h3>{user?.fullname}</h3>
        <div className="email">{user?.email}</div>
        <Menu
          theme="dark"
          mode="inline"
          items={profileMenuOptions}
          style={{ marginTop: 8 }}
          onClick={({ key }) => onProfileMenuClick[key]()}
        />
      </styled.ProfileSettings>
    );
  }, [onProfileMenuClick, profileMenuOptions, user]);

  return (
    <styled.Header>
      <div>
        <img className="logo" src="/logo.png" />
        <nav>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={[selectedKey]}
            items={menuOptions}
            onClick={({ key }) => onChange(key)}
          />
        </nav>
      </div>

      <div className="profile">
        <Popover
          content={<EmptyState description="Sem novas notificações" />}
          placement="bottomLeft"
          trigger="click"
          showArrow
          open={showNotifications}
          onOpenChange={(visible) => setShowNotifications(visible)}
        >
          <Badge color={theme.colors.PRIMARY}>
            <BellOutlined style={{ cursor: 'pointer' }} />
          </Badge>
        </Popover>
        <Popover
          content={profileSettings}
          placement="bottomLeft"
          trigger="click"
          showArrow
          open={showProfile}
          onOpenChange={(visible) => setShowProfile(visible)}
        >
          <Avatar size={40} icon={<UserOutlined />} src={user?.avatarArchive} />
        </Popover>
      </div>
    </styled.Header>
  );
}

export default Header;
