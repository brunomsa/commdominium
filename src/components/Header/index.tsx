import React from 'react';

import { Avatar, Badge, Menu } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

import { pageKey } from '../../utils/types';
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

interface Props {
  selectedKey: string;
  onChange: (key: string) => void;
}

function Header({ selectedKey, onChange }: Props) {
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
        <Badge color={theme.colors.primary} count={3}>
          <BellOutlined />
        </Badge>
        <Avatar size={40} icon={<UserOutlined />} />
      </div>
    </styled.Header>
  );
}

export default Header;
