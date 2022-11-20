import React, { SetStateAction, useContext, useMemo, useState } from 'react';

import Router from 'next/router';

import { Avatar, Badge, Button, Popover } from 'antd';
import {
  BellOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { AuthContext } from '../../contexts/AuthContext';
import { UserTypes } from '../../services/userType';
import { MenuOptionsType, PageKey } from '../../utils/types';

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
  menuOptions: MenuOptionsType[];
  selectedKey: string;
  loggedUserType: UserTypes;
  onChange: (key: string) => void;
  setMenuVisibility: React.Dispatch<SetStateAction<boolean>>;
}

function Header({ selectedKey, loggedUserType, onChange, setMenuVisibility }: Props) {
  const { user, signOut } = useContext(AuthContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedKey);

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
        <div className="profile-menu">
          {profileMenuOptions.map((op) => (
            <div onClick={() => onProfileMenuClick[op.key]()}>
              {op.icon}
              <a>{op.label}</a>
            </div>
          ))}
        </div>
      </styled.ProfileSettings>
    );
  }, [onProfileMenuClick, profileMenuOptions, user]);

  return (
    <styled.Header>
      <div>
        <img className="logo" src="/logo.png" />
        <nav>
          {menuOptions.filter(Boolean).map((option) => (
            <a
              key={option.key}
              className={['item', selectedItem === option.key ? 'selected' : null].join(' ')}
              onClick={() => {
                setSelectedItem(option.key);
                onChange(option.key);
              }}
            >
              {option.label}
            </a>
          ))}
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
        <Button className="nav-btn" icon={<MenuOutlined />} onClick={() => setMenuVisibility(true)} />
      </div>
    </styled.Header>
  );
}

export default Header;
