import React, { useState } from 'react';

import { DatePicker, Form as AntdForm, Input, Select } from 'antd';

import { NoticeType, NoticeTypes, findNoticeTypeById } from '../../services/noticeType';
import { Notice, NoticeForm } from '../../services/notice';
import { toCapitalize } from '../../utils/toCapitalize';
import { DATE_FORMAT_STRING } from '../../utils/constants';

import Form from '../Form';
import Button from '../Button';
import TextInput from '../TextInput';

import * as styled from './styles';

interface Props {
  loading: boolean;
  noticeTypes?: NoticeType[];
  initialValues?: Notice;
  onSubmit: (values: NoticeForm) => void;
  onCancel: () => void;
}

function NoticeSettings({ loading, noticeTypes, initialValues, onSubmit, onCancel }: Props) {
  const initialType = findNoticeTypeById(noticeTypes, initialValues.id_noticeType)?.type;
  const [type, setType] = useState<NoticeTypes>(initialType);

  return (
    <styled.NoticeSettings>
      <Form layout="vertical" initialValues={initialValues} requiredMark={false} onFinish={onSubmit}>
        <AntdForm.Item
          name="id_noticeType"
          label="Tipo do aviso"
          rules={[{ required: true, message: 'Por favor, informe um tipo de aviso' }]}
        >
          <Select onChange={(value) => setType(findNoticeTypeById(noticeTypes, value).type)}>
            {noticeTypes?.map((nt) => (
              <Select.Option key={nt.id} value={nt.id}>
                {toCapitalize(nt.type)}
              </Select.Option>
            ))}
          </Select>
        </AntdForm.Item>

        <AntdForm.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: 'Por favor, informe um título' }]}
        >
          <TextInput />
        </AntdForm.Item>

        {type === NoticeTypes.MEETING && (
          <AntdForm.Item
            name="eventDay"
            label="Data da reunião"
            rules={[{ required: type === NoticeTypes.MEETING, message: 'Por favor, informe uma data para a reunião' }]}
          >
            <DatePicker placeholder="Informe uma data" format={DATE_FORMAT_STRING} style={{ width: '50%' }} />
          </AntdForm.Item>
        )}

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

export default NoticeSettings;
