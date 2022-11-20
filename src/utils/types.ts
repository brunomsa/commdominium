export enum PageKey {
  HOME = 'home',
  PAYMENT = 'payment',
  NOTICES = 'notices',
  COMPLAINTS = 'complaints',
  RESIDENTS = 'residents',
  CONDOMINIUMS = 'condominiums',
  USERS = 'users',
  LOGIN = 'login',
  MY_PROFILE = 'myProfile',
}

export type MenuOptionsType = {
  key: PageKey;
  label: string;
};
