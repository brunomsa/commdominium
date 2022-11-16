import { api, ApiResponse } from './api';
import { catchError } from './axios';

export type Complaint = {
  id: number;
  message: string;
  resolved: number | boolean;
  id_user: number;
  fullname: string;
  avatarArchive: string;
  id_condominium: number;
  updatedAt?: string | Date;
};

export enum ComplaintTypes {
  RESOLVED = 'resolved',
  UNRESOLVED = 'unresolved',
}

export type ComplaintForm = Pick<Complaint, 'message'>;

export async function createComplaint(complaint: Omit<Complaint, 'id'>): Promise<ApiResponse<Complaint>> {
  try {
    const { status, data } = await api.post<Complaint>('/complaint/register', complaint);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function getComplaintById(id: number): Promise<ApiResponse<Complaint>> {
  try {
    const { status, data } = await api.post<Complaint>('/complaint/findById', { id });
    if (status === 204) return { ok: true, error: { error: 'Reclamação inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateComplaint(complaint: Complaint): Promise<ApiResponse<Complaint>> {
  try {
    const { status, data } = await api.patch<Complaint>('/complaint/update', complaint);
    if (status === 204) return { ok: true, error: { error: 'Reclamação inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateComplaintStatus(id_complaint: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.patch('/services/updateResolvedStatus', { id_complaint });
    if (status === 204) return { ok: true, error: { error: 'Reclamação inexistente' } };
    if (status === 200) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteComplaint(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>('/complaint/delete', {
      data: { id },
    });
    if (status === 204) return { ok: true, error: { error: 'Reclamação inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
