export type SignInData = {
  login: string;
  password: string;
};

export type SignInError = {
  error: string;
};

export type User = {
  IDcondominio: number;
  IDtipo_usuario: number;
  IDusuario: number;
  ativo: boolean;
  bloco: string;
  createdAt: string;
  login: string;
  nome: string;
  numero: string;
  predio: string;
  senha: string;
  updatedAt: string;
};
