import React from 'react';
import { GetServerSideProps } from 'next';

import { Button, Input, Form as AntdForm, Select } from 'antd';

import { toCapitalize } from '../../utils/toCapitalize';
import { getApiClient } from '../../services/axios';
import { Condominuim } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { UserData } from '../../services/user';
import Form from '../Form';
import Router from 'next/router';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  condominiums?: Condominuim[];
  userTypes?: UserType[];
  loading: boolean;
  initialValues?: UserData;
  onSubmit: (values: UserData) => void;
}

function UserSettings({ initialValues, condominiums, userTypes, loading, onSubmit }: Props) {
  return (
    <>
      <Form className="form" initialValues={initialValues} onFinish={onSubmit}>
        <AntdForm.Item name="fullname" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
          <Input value="Bruno" placeholder="Nome" />
        </AntdForm.Item>

        <AntdForm.Item
          name="email"
          rules={[
            { type: 'email', message: 'Informe um e-mail válido!' },
            { required: true, message: 'Por favor, informe um e-mail!' },
          ]}
          hasFeedback
        >
          <Input type="email" placeholder="E-mail" />
        </AntdForm.Item>

        {!initialValues && (
          <>
            <AntdForm.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Por favor, informe uma senha!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Senha" />
            </AntdForm.Item>
            <AntdForm.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Por favor, confirme sua senha!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As duas senhas informadas precisam ser iguais!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirme a senha" />
            </AntdForm.Item>

            <AntdForm.Item
              name="id_userType"
              rules={[{ required: true, message: 'Por favor, informe um tipo de usuário' }]}
            >
              <Select placeholder="Tipo do usuário">
                {userTypes?.map((ut) => (
                  <Select.Option key={ut.id} value={ut.id}>
                    {toCapitalize(ut.type)}
                  </Select.Option>
                ))}
              </Select>
            </AntdForm.Item>
          </>
        )}

        <AntdForm.Item name="id_condominium">
          <Select
            showSearch
            placeholder="Condomínio"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {condominiums?.map((cond) => (
              <Select.Option key={cond.id} value={cond.id}>
                {cond.name}
              </Select.Option>
            ))}
          </Select>
        </AntdForm.Item>

        <AntdForm.Item name="block">
          <Input placeholder="Bloco" />
        </AntdForm.Item>

        <AntdForm.Item name="building">
          <Input placeholder="Prédio" />
        </AntdForm.Item>

        <AntdForm.Item name="number" rules={[{ required: true, message: 'Por favor, informe um número' }]}>
          <Input placeholder="Número" />
        </AntdForm.Item>

        <AntdForm.Item>
          <Button type="ghost" style={{ marginRight: 16, marginBottom: 16 }} onClick={() => Router.push('/usuarios')}>
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

export default UserSettings;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getApiClient(ctx);

  const { data: condominiums } = await apiClient.get<Condominuim[]>('/condominium/findAll');
  const { data: userTypes } = await apiClient.get<UserType[]>('/userType/findAll');

  return {
    props: {
      condominiums,
      userTypes,
    },
  };
};
