export enum PageKey {
  HOME = 'home',
  PAYMENT = 'payment',
  NOTICES = 'notices',
  COMPLAINTS = 'complaints',
  RESIDENTS = 'residents',
  CONDOMINIUMS = 'condominiums',
  USERS = 'users',
}

export type MenuOptionsType = {
  key: PageKey;
  label: string;
};
