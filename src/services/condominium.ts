import { api, ApiResponse } from './api';
import { catchError } from './axios';

export type Condominium = {
  id: number;
  name: string;
  state?: string;
  city?: string;
  street: string;
  number: string;
};

export function findCondominiumById(condominiums?: Condominium[], id?: number): Condominium | undefined {
  return condominiums?.find((cond) => cond.id === id);
}

export async function createCondominium(cond: Omit<Condominium, 'id'>): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.post<Condominium>('/condominium/register', cond);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function getCondominiumById(id: number): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.post<Condominium>('/condominium/findById', { id });
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateCondominium(condominium: Condominium): Promise<ApiResponse<Condominium>> {
  try {
    const { status, data } = await api.patch<Condominium>('/condominium/update', condominium);
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteCondominium(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>('/condominium/delete', {
      data: { id },
    });
    if (status === 204) return { ok: true, error: { error: 'Condomínio inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
