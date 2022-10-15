import React from 'react';

import { Avatar, Badge, Col, Menu, Row } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

import * as styled from './styles';
import theme from '../../styles/theme';

const menuOptions = [
  { key: 'home', label: 'Início' },
  { key: 'condominium', label: 'Condomínio' },
  { key: 'payment', label: 'Pagamento' },
  { key: 'portal', label: 'Portal' },
  { key: 'users', label: 'Usuários' },
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
