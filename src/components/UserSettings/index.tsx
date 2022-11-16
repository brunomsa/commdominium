import React, { useCallback, useState } from 'react';
import Router from 'next/router';

import { Input, Form as AntdForm, Select, message, Upload as AntdUpload, Checkbox } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

import { toCapitalize } from '../../utils/toCapitalize';
import { Condominium } from '../../services/condominium';
import { UserType } from '../../services/userType';
import { UserForm } from '../../services/user';

import Form from '../Form';
import Upload from '../Upload';
import Button from '../Button';
import TextInput from '../TextInput';

const URL_BACKGROUND =
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';

interface Props {
  condominiums?: Condominium[];
  userTypes?: UserType[];
  loading: boolean;
  initialValues?: UserForm;
  adminMode?: boolean;
  onSubmit: (values: UserForm) => void;
}

function UserSettings({ initialValues, condominiums, userTypes, loading, adminMode = true, onSubmit }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [userStatus, setUserStatus] = useState('Ativo');

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const isValid = file.type === 'image/png';
    if (!isValid) {
      message.error(`${file.name} não é um arquivo do tipo PNG`);
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (isValid && !isLt1M) {
      message.error('A imagem deve ser menor que 1MB');
    }
    return (isValid && isLt1M) || AntdUpload.LIST_IGNORE;
  }, []);

  const onChangeStatus = useCallback((checked: boolean) => {
    if (!checked) setUserStatus('Desativo');
    else setUserStatus('Ativo');
  }, []);

  return (
    <>
      <Form
        className="form"
        layout="vertical"
        requiredMark={false}
        initialValues={initialValues}
        onFinish={(values) =>
          onSubmit({
            ...values,
            avatarArchive: avatarUrl ?? initialValues?.avatarArchive,
            active: userStatus === 'Ativo',
          })
        }
      >
        <AntdForm.Item
          name="fullname"
          label="Nome"
          rules={[{ required: true, message: 'Por favor, informe um nome' }]}
          tooltip={{ title: 'Digite o nome completo', icon: <InfoCircleOutlined /> }}
          hasFeedback
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="email"
          label="E-mail"
          rules={[
            { type: 'email', message: 'Informe um e-mail válido!' },
            { required: true, message: 'Por favor, informe um e-mail!' },
          ]}
          tooltip={{ title: 'Digite o e-mail', icon: <InfoCircleOutlined /> }}
          hasFeedback
        >
          <TextInput type="email" />
        </AntdForm.Item>

        {!initialValues && adminMode && (
          <>
            <AntdForm.Item
              name="password"
              label="Senha"
              rules={[
                {
                  required: true,
                  message: 'Por favor, informe uma senha!',
                },
              ]}
              tooltip={{ title: 'Digite a senha', icon: <InfoCircleOutlined /> }}
              hasFeedback
            >
              <Input.Password />
            </AntdForm.Item>
            <AntdForm.Item
              name="confirm"
              label="Confirme a senha"
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
              tooltip={{ title: 'Digite a confirmação da senha', icon: <InfoCircleOutlined /> }}
            >
              <Input.Password />
            </AntdForm.Item>
          </>
        )}

        {adminMode && (
          <>
            <AntdForm.Item
              name="id_userType"
              label="Tipo do usuário"
              rules={[{ required: true, message: 'Por favor, informe um tipo de usuário' }]}
              tooltip={{ title: 'Selecione o tipe de usuário', icon: <InfoCircleOutlined /> }}
            >
              <Select>
                {userTypes?.map((ut) => (
                  <Select.Option key={ut.id} value={ut.id}>
                    {toCapitalize(ut.type)}
                  </Select.Option>
                ))}
              </Select>
            </AntdForm.Item>

            <AntdForm.Item
              name="id_condominium"
              label="Condomínio"
              tooltip={{ title: 'Selecione o condomínio', icon: <InfoCircleOutlined /> }}
            >
              <Select
                showSearch
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
          </>
        )}

        <AntdForm.Item
          name="number"
          label="Número"
          rules={[{ required: true, message: 'Por favor, informe um número do apartamento ou casa' }]}
          tooltip={{ title: 'Digite o número do apartamento ou casa', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="block"
          label="Bloco"
          tooltip={{ title: 'Digite o bloco do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item
          name="building"
          label="Prédio"
          tooltip={{ title: 'Digite o prédio do condomínio', icon: <InfoCircleOutlined /> }}
        >
          <TextInput />
        </AntdForm.Item>

        <AntdForm.Item name="active" label="Status" tooltip={{ title: 'Status do usuário' }}>
          <Checkbox defaultChecked onChange={(event) => onChangeStatus(event.target.checked)}>
            {userStatus}
          </Checkbox>
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
          {adminMode && (
            <Button type="ghost" style={{ marginRight: 16, marginBottom: 16 }} onClick={() => Router.push('/usuarios')}>
              Cancelar
            </Button>
          )}
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
