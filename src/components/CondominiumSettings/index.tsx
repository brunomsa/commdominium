import React from 'react';
import Router from 'next/router';

import { Form as AntdForm } from 'antd';

import { Condominium } from '../../services/condominium';

import Form from '../Form';
import Button from '../Button';
import TextInput from '../TextInput';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

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
          hasFeedback
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item name="state" label="Estado">
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item name="city" label="Cidade">
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item name="street" label="Rua" rules={[{ required: true, message: 'Por favor, informe uma rua' }]}>
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="number"
          label="Número"
          rules={[{ required: true, message: 'Por favor, informe um número' }]}
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
