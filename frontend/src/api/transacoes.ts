import { http } from './http';
import { TransacaoDto } from './types';

export async function listarTransacoes() {
  const { data } = await http.get<TransacaoDto[]>('/api/Transacao');
  return data;
}

export async function criarTransacao(payload: {
  descricao: string;
  valor: number;
  tipo: string;
  data: string;
  contaId: number;
}) {
  const { data } = await http.post<{ id: number }>('/api/Transacao', payload);
  return data;
}

export async function atualizarTransacao(
  id: number,
  payload: { descricao: string; valor: number; tipo: string; data: string; contaId: number }
) {
  await http.put(`/api/Transacao/${id}`, payload);
}

export async function removerTransacao(id: number) {
  await http.delete(`/api/Transacao/${id}`);
}
