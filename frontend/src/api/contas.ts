import { http } from './http';
import { ContaDto } from './types';

export async function listarContas() {
  const { data } = await http.get<ContaDto[]>('/api/Conta');
  return data;
}

export async function listarContasPorUsuario(usuarioId: number) {
  const { data } = await http.get<ContaDto[]>(`/api/Conta/GetContasById/${usuarioId}`);
  return data;
}

export async function criarConta(payload: { nome: string; saldo: number; usuarioId: number }) {
  const { data } = await http.post<ContaDto>('/api/Conta', payload);
  return data;
}

export async function atualizarConta(id: number, payload: { nome: string; saldo: number; usuarioId: number }) {
  await http.put(`/api/Conta/${id}`, payload);
}

export async function removerConta(id: number) {
  await http.delete(`/api/Conta/${id}`);
}
