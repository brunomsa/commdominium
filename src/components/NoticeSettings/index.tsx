import React from 'react';

import { Button, Form as AntdForm, Input, Select } from 'antd';

import Form from '../Form';
import { NoticeType } from '../../services/noticeType';
import { Notice } from '../../services/notice';
import { toCapitalize } from '../../utils/toCapitalize';

interface Props {
  loading: boolean;
  noticeTypes?: NoticeType[];
  onSubmit: (values: Notice) => void;
}

function NoticeSettings({ loading, noticeTypes, onSubmit }: Props) {
  return (
    <Form layout="vertical" requiredMark={false} onFinish={onSubmit}>
      <AntdForm.Item
        name="message"
        label="Mensagem"
        rules={[{ required: true, message: 'Por favor, informe uma mensagem' }]}
      >
        <Input.TextArea style={{ height: 80, resize: 'none' }} />
      </AntdForm.Item>

      <AntdForm.Item
        name="id_noticeType"
        label="Tipo do aviso"
        rules={[{ required: true, message: 'Por favor, informe um tipo de aviso' }]}
      >
        <Select>
          {noticeTypes?.map((nt) => (
            <Select.Option key={nt.id} value={nt.id}>
              {toCapitalize(nt.type)}
            </Select.Option>
          ))}
        </Select>
      </AntdForm.Item>

      <AntdForm.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Salvar
        </Button>
      </AntdForm.Item>
    </Form>
  );
}

export default NoticeSettings;
