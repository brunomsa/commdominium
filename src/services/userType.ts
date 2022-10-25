export enum UserTypes {
  ADMIN = 'Admin',
  SYNDIC = 'Síndico',
  RESIDENT = 'Morador',
}
export type UserType = {
  id: number;
  type: UserTypes;
};

export function findUserTypeById(userTypes: UserType[], id: number) {
  return userTypes?.find((type) => type.id === id);
}
