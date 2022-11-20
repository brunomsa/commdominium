import React from 'react';

import Router from 'next/router';

import { Avatar, Button, Comment, List, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { orderByDate } from '../../utils/orderByDate';
import { toDayjs } from '../../utils/toDayjs';

import * as styled from './styles';

interface Props<T = unknown> {
  itens: T[];
  headerTitle: string;
  headerIcon: React.ReactNode;
  checkedChildren: string;
  unCheckedChildren: string;
  urlButton: string;
  condominiumName?: string;
  avatarAssigneeUrl?: string;
  onSwitchChange: (checked: boolean) => void;
}

function SwitchCard<T>({
  itens,
  headerTitle,
  headerIcon,
  checkedChildren,
  unCheckedChildren,
  urlButton,
  condominiumName,
  avatarAssigneeUrl,
  onSwitchChange,
}: Props<T>) {
  return (
    <styled.SwitchCard>
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={orderByDate<any>(itens)}
        header={
          <div className="cardHeader">
            <div>
              {headerIcon}
              <div>{headerTitle}</div>
            </div>
            <Switch
              defaultChecked
              checkedChildren={checkedChildren}
              unCheckedChildren={unCheckedChildren}
              onChange={onSwitchChange}
            />
          </div>
        }
        renderItem={(item) => (
          <List.Item>
            <Comment
              author={condominiumName ?? item.fullname}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={<p>{item.message}</p>}
              datetime={<span>{toDayjs(item.updatedAt).fromNow()}</span>}
            />
          </List.Item>
        )}
      >
        {!!itens?.length && (
          <div className="seeMore-btn">
            <Button type="primary" onClick={() => Router.push(urlButton)}>
              Ver mais
            </Button>
          </div>
        )}
      </List>
    </styled.SwitchCard>
  );
}

export default SwitchCard;
