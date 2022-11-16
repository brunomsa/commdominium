import React from 'react';
import Router from 'next/router';

import { Form as AntdForm } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { Condominium } from '../../services/condominium';

import Form from '../Form';
import Button from '../Button';
import TextInput from '../TextInput';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1629224834618-1cf72b367162?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';

interface Props {
  loading: boolean;
  initialValues?: Omit<Condominium, 'id'>;
  onSubmit: (values: Omit<Condominium, 'id'>) => void;
}

function CondominiumSettings({ initialValues, loading, onSubmit }: Props) {
  return (
    <>
      <Form
        className="form"
        layout="vertical"
        requiredMark={false}
        initialValues={initialValues}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <AntdForm.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: 'Por favor, informe um nome' }]}
          tooltip={{ title: 'Digite o nome do condomínio', icon: <InfoCircleOutlined /> }}
          hasFeedback
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="state"
          label="Estado"
          tooltip={{ title: 'Digite o estado do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="city"
          label="Cidade"
          tooltip={{ title: 'Digite a cidade do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="street"
          label="Rua"
          rules={[{ required: true, message: 'Por favor, informe uma rua' }]}
          tooltip={{ title: 'Digite a rua do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="number"
          label="Número"
          rules={[{ required: true, message: 'Por favor, informe um número' }]}
          tooltip={{ title: 'Digite o número do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item>
          <Button
            type="ghost"
            style={{ marginRight: 16, marginBottom: 16 }}
            onClick={() => Router.push('/condominios')}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </AntdForm.Item>
      </Form>

      <img className="background-image" src={URL_BACKGROUND} />
    </>
  );
}

export default CondominiumSettings;
