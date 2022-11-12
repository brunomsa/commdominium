import React, { useCallback, useState } from 'react';

import { DatePicker, Form as AntdForm, message, Upload as AntdUpload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadOutlined } from '@ant-design/icons';

import { FormPayment } from '../../services/payment';
import { DATE_FORMAT_STRING } from '../../utils/constants';
import Form from '../Form';
import Upload from '../Upload';
import Button from '../Button';

import * as styled from './styles';
import theme from '../../styles/theme';

interface Props {
  loading: boolean;
  onSubmit: (values: FormPayment) => void;
  onCancel: () => void;
}

function PaymentSettings({ loading, onSubmit, onCancel }: Props) {
  const [bill, setBill] = useState<string>();

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
      message.error(`${file.name} não é um arquivo do tipo PDF`);
    }
    return isPDF || AntdUpload.LIST_IGNORE;
  }, []);

  return (
    <styled.PaymentSettings>
      <Form layout="vertical" requiredMark={false} onFinish={(values) => onSubmit({ ...values, billArchive: bill })}>
        <AntdForm.Item
          name="dueDate"
          rules={[{ required: true, message: 'Por favor, informe uma data de vencimento' }]}
        >
          <DatePicker placeholder="Data de vencimento" format={DATE_FORMAT_STRING} style={{ width: '50%' }} />
        </AntdForm.Item>

        <AntdForm.Item name="billArchive" rules={[{ required: true, message: 'Por favor, informe um boleto' }]}>
          <Upload drag onChange={(file) => setBill(file)} uploadProps={{ beforeUpload: handleBeforeUpload }}>
            <p>
              <UploadOutlined style={{ fontSize: 28, color: theme.colors.primary, marginBottom: 16 }} />
            </p>
            <p>Clique ou arraste o boleto nesta area para enviar</p>
          </Upload>
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
    </styled.PaymentSettings>
  );
}

export default PaymentSettings;
