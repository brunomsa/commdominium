import { Moment } from 'moment';
import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';

export type Payment = {
  id: number;
  billArchive: string;
  dueDate: string;
  paid: boolean;
  id_user: number;
};

export type FormPayment = Omit<Payment, 'id' | 'paid'> & {
  dueDate: Moment;
};

export async function createPayment(payment: FormPayment): Promise<ApiResponse<Payment>> {
  const paymentData: Omit<Payment, 'id'> = {
    ...payment,
    dueDate: payment.dueDate.format('YYYY-MM-DD'),
    paid: false,
  };
  try {
    const { status, data } = await api.post<Payment>(`${BASE_API_URL}/payment/register`, paymentData);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updatePayment(payment: Payment): Promise<ApiResponse<Payment>> {
  try {
    const { status, data } = await api.patch<Payment>(`${BASE_API_URL}/payment/update`, payment);
    if (status === 204) return { ok: true, error: { error: 'Registo de boleto inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function verifyBillExistance(id_user: number, dueDate: Moment): Promise<ApiResponse<Payment>> {
  try {
    const { status, data } = await api.post<Payment>(`${BASE_API_URL}/services/verifyBillExistance`, {
      id_user,
      month: dueDate.get('month') + 1,
      year: dueDate.get('year'),
    });
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
