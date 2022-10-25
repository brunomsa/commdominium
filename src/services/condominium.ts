import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';

export type Condominium = {
  id: number;
  name: string;
  state?: string;
  city?: string;
  street: string;
  number: string;
};

export function getCondominiumById(condominiums: Condominium[], id: number) {
  return condominiums?.find((cond) => cond.id === id);
}

export async function createCondominium(cond: Omit<Condominium, 'id'>): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.post<Condominium>(`${BASE_API_URL}/condominium/register`, cond);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
