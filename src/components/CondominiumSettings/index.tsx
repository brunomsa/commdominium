import React from 'react';
import Router from 'next/router';

import { Button, Input, Form as AntdForm } from 'antd';

import { Condominium } from '../../services/condominium';
import Form from '../Form';

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
      <Form className="form" initialValues={initialValues} onFinish={onSubmit} autoComplete="off">
        <AntdForm.Item name="name" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
          <Input placeholder="Nome" />
        </AntdForm.Item>

        <AntdForm.Item name="state">
          <Input placeholder="Estado" />
        </AntdForm.Item>

        <AntdForm.Item name="city">
          <Input placeholder="Cidade" />
        </AntdForm.Item>

        <AntdForm.Item name="street" rules={[{ required: true, message: 'Por favor, informe uma rua' }]}>
          <Input placeholder="Rua" />
        </AntdForm.Item>

        <AntdForm.Item name="number" rules={[{ required: true, message: 'Por favor, informe um número' }]}>
          <Input placeholder="Número" />
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
