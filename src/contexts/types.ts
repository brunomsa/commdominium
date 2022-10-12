export type SignInData = {
  email: string;
  password: string;
};

export type SignInError = {
  error: string;
};

export type User = {
  id: number;
  id_condominium: number;
  id_userType: number;
  active: boolean;
  block: string;
  building: string;
  createdAt: string;
  email: string;
  fullname: string;
  number: string;
  updatedAt: string;
};
