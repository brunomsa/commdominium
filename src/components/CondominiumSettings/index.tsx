import React from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

import { Button, Input, Form } from 'antd';

import { getApiClient } from '../../services/axios';
import { Condominium } from '../../services/condominium';
import { UserType } from '../../services/userType';

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
        <Form.Item name="name" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
          <Input placeholder="Nome" />
        </Form.Item>

        <Form.Item name="state">
          <Input placeholder="Estado" />
        </Form.Item>

        <Form.Item name="city">
          <Input placeholder="Cidade" />
        </Form.Item>

        <Form.Item name="street" rules={[{ required: true, message: 'Por favor, informe uma rua' }]}>
          <Input placeholder="Rua" />
        </Form.Item>

        <Form.Item name="number" rules={[{ required: true, message: 'Por favor, informe um número' }]}>
          <Input placeholder="Número" />
        </Form.Item>

        <Form.Item>
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
        </Form.Item>
      </Form>

      <img className="background-image" src={URL_BACKGROUND} />
    </>
  );
}

export default CondominiumSettings;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getApiClient(ctx);

  const { data: condominiums } = await apiClient.get<Condominium[]>('/condominium/findAll');
  const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

  return {
    props: {
      condominiums,
      userTypes,
    },
  };
};
