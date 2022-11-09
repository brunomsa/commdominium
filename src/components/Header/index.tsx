import React, { useContext, useMemo, useState } from 'react';

import { Avatar, Badge, Menu, Popover } from 'antd';
import {
  BellOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { pageKey } from '../../utils/types';
import EmptyState from '../EmptyState';
import { AuthContext } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import * as styled from './styles';

type menuOptionsType = {
  key: pageKey;
  label: string;
};

const menuOptions: menuOptionsType[] = [
  { key: pageKey.HOME, label: 'Início' },
  { key: pageKey.CONDOMINIUMS, label: 'Condomínios' },
  { key: pageKey.PAYMENT, label: 'Financeiro' },
  { key: pageKey.NOTICES, label: 'Avisos ' },
  { key: pageKey.USERS, label: 'Usuários' },
];

const profileMenuOptions = [
  { key: 'edit', label: 'Editar perfil', icon: <SettingOutlined /> },
  { key: 'myCond', label: 'Meu condomínio', icon: <HomeOutlined /> },
  { key: 'changePassword', label: 'Alterar a senha', icon: <LockOutlined /> },
  { key: 'logout', label: 'Sair', icon: <LogoutOutlined /> },
];

interface Props {
  selectedKey: string;
  onChange: (key: string) => void;
}

function Header({ selectedKey, onChange }: Props) {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const onProfileMenuClick: Record<string, () => void> = {
    edit: () => console.log('edit'),
    myCond: () => console.log('myCond'),
    changePassword: () => console.log('changePassword'),
    logout: () => console.log('logout'),
  };

  const profileSettings = useMemo(() => {
    return (
      <styled.ProfileSettings>
        {user && (
          <>
            <h3>{user.fullname}</h3>
            <div className="email">{user.email}</div>
          </>
        )}
        <Menu
          theme="dark"
          mode="inline"
          items={profileMenuOptions}
          style={{ marginTop: 8 }}
          onClick={({ key }) => onProfileMenuClick[key]()}
        />
      </styled.ProfileSettings>
    );
  }, [user]);

  return (
    <styled.Header>
      <div>
        <div className="logo">Commdominium</div>
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
          <Badge color={theme.colors.primary}>
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
