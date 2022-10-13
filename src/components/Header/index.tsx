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
  { key: 'syndicate', label: 'Síndico' },
];

interface Props {
  selectedKey: string;
  onChange: (key: string) => void;
}

function Header({ selectedKey, onChange }: Props) {
  return (
    <styled.Header>
      <Row align="middle" style={{ height: '100%' }}>
        <Col span={22}>
          <div className="logo">Logo</div>
          <nav>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={[selectedKey]}
              items={menuOptions}
              onClick={({ key }) => onChange(key)}
            />
          </nav>
        </Col>

        <Col span={2}>
          <div className="profile">
            <Badge color={theme.colors.primary} count={3}>
              <BellOutlined />
            </Badge>
            <Avatar size={50} icon={<UserOutlined />} />
          </div>
        </Col>
      </Row>
    </styled.Header>
  );
}

export default Header;
