import React, { useCallback, useState } from 'react';
import Router from 'next/router';

import { Button, Input, Form as AntdForm, Select, message, Upload as AntdUpload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadOutlined } from '@ant-design/icons';

import { toCapitalize } from '../../utils/toCapitalize';
import { Condominium } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { UserForm } from '../../services/user';
import Form from '../Form';
import Upload from '../Upload';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  condominiums?: Condominium[];
  userTypes?: UserType[];
  loading: boolean;
  initialValues?: UserForm;
  onSubmit: (values: UserForm) => void;
}

function UserSettings({ initialValues, condominiums, userTypes, loading, onSubmit }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const isValid = file.type === 'image/png';
    if (!isValid) {
      message.error(`${file.name} não é um arquivo do tipo PNG`);
    }
    return isValid || AntdUpload.LIST_IGNORE;
  }, []);

  return (
    <>
      <Form
        className="form"
        initialValues={initialValues}
        onFinish={(values) => onSubmit({ ...values, avatarArchive: avatarUrl ?? initialValues.avatarArchive })}
      >
        <AntdForm.Item name="fullname" rules={[{ required: true, message: 'Por favor, informe um nome' }]} hasFeedback>
          <Input placeholder="Nome" />
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
          </>
        )}

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

        <AntdForm.Item name="avatarArchive">
          <Upload
            onChange={(file) => setAvatarUrl(file)}
            uploadProps={{
              listType: 'picture',
              beforeUpload: handleBeforeUpload,
            }}
          >
            <Button icon={<UploadOutlined />}>Carregar foto de perfil</Button>
          </Upload>
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
