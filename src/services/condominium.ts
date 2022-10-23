export type Condominuim = {
  id: number;
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
};

export function getCondominiumById(condominiums: Condominuim[], id: number) {
  return condominiums?.find((cond) => cond.id === id);
}
