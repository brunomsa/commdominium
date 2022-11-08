import React, { useState } from 'react';

import { Button, DatePicker, Form as AntdForm, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import { UploadOutlined } from '@ant-design/icons';

import Form from '../Form';
import { FormPayment } from '../../services/payment';
import * as styled from './styles';
import { DATE_FORMAT_STRING } from '../../utils/constants';

const getBase64 = (file: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(file);
};

interface Props {
  loading: boolean;
  onSubmit: (values: FormPayment) => void;
  onCancel: () => void;
}

function PaymentSettings({ loading, onSubmit, onCancel }: Props) {
  const [bill, setBill] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setBill(url);
      });
    }
  };

  return (
    <styled.PaymentSettings>
      <Form layout="vertical" requiredMark={false} onFinish={(values) => onSubmit({ ...values, billArchive: bill })}>
        <AntdForm.Item
          name="dueDate"
          rules={[{ required: true, message: 'Por favor, informe uma data de vencimento' }]}
        >
          <DatePicker placeholder="Data de vencimento" format={DATE_FORMAT_STRING} />
        </AntdForm.Item>
        <Upload
          maxCount={1}
          onChange={handleChange}
          onRemove={() => setBill(undefined)}
          progress={{
            strokeColor: {
              '0%': '#108ee9',
              '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
          }}
        >
          <Button block icon={<UploadOutlined />} style={{ height: 50 }}>
            Enviar boleto
          </Button>
        </Upload>

        <AntdForm.Item style={{ marginTop: 48 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginBottom: 16 }} block>
            Salvar
          </Button>
          <Button type="ghost" block onClick={onCancel}>
            Cancelar
          </Button>
        </AntdForm.Item>
      </Form>
    </styled.PaymentSettings>
  );
}

export default PaymentSettings;
