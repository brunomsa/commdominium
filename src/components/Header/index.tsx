import React from 'react';

import { Avatar, Badge, Col, Menu, Row } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

import * as styled from './styles';

const menuOptions = [
  { key: 'home', label: 'Início' },
  { key: 'condominium', label: 'Condomínio' },
  { key: 'payment', label: 'Pagamento' },
  { key: 'portal', label: 'Portal' },
  { key: 'syndicate', label: 'Sindíco' },
];

function Header() {
  return (
    <styled.Container>
      <Row align="middle">
        <Col span={22}>
          <div className="logo">Logo</div>
          <nav>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['home']}
              items={menuOptions}
            />
          </nav>
        </Col>

        <Col span={2}>
          <div className="profile">
            <Badge count={3}>
              <BellOutlined />
            </Badge>
            <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </Col>
      </Row>
    </styled.Container>
  );
}

export default Header;
