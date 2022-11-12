import React from 'react';

import { Form as AntdForm, Input } from 'antd';

import { Complaint, ComplaintForm } from '../../services/complaint';

import Form from '../Form';
import Button from '../Button';

import * as styled from './styles';

interface Props {
  loading: boolean;
  initialValues?: Complaint;
  onSubmit: (values: ComplaintForm) => void;
  onCancel: () => void;
}

function ComplaintSettings({ loading, initialValues, onSubmit, onCancel }: Props) {
  return (
    <styled.NoticeSettings>
      <Form layout="vertical" initialValues={initialValues} requiredMark={false} onFinish={onSubmit}>
        <AntdForm.Item
          name="message"
          label="Mensagem"
          rules={[{ required: true, message: 'Por favor, informe uma mensagem' }]}
        >
          <Input.TextArea style={{ height: 80, resize: 'none' }} />
        </AntdForm.Item>

        <AntdForm.Item style={{ marginTop: 48 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginBottom: 16 }} block>
            Salvar
          </Button>
          <Button type="ghost" block onClick={onCancel}>
            Cancelar
          </Button>
        </AntdForm.Item>
      </Form>
    </styled.NoticeSettings>
  );
}

export default ComplaintSettings;
