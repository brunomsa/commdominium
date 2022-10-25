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

export function findCondominiumById(condominiums: Condominium[], id: number) {
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

export async function getCondominiumById(id: number): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.post<Condominium>(`${BASE_API_URL}/condominium/findById`, { id });
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateCondominium(condominium: Omit<Condominium, 'active'>): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.patch<Condominium>(`${BASE_API_URL}/condominium/update`, condominium);
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteCondominium(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>(`${BASE_API_URL}/condominium/delete`, {
      data: { id },
    });
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
