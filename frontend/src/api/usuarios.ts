import { http } from './http';
import { UsuarioDto } from './types';

export async function cadastrarUsuario(payload: {
  nome: string;
  email: string;
  senha: string;
  role?: string;
}) {
  await http.post('/api/Usuario', payload);
}

export async function listarUsuarios() {
  const { data } = await http.get<UsuarioDto[]>('/api/Usuario');
  return data;
}

export async function atualizarUsuario(
  id: number,
  payload: { nome: string; email: string; senha?: string; role: string }
) {
  // Não enviar senha se estiver vazia
  const body = { ...payload };
  if (!body.senha) delete body.senha;
  await http.put(`/api/Usuario/${id}`, body);
}

export async function removerUsuario(id: number) {
  await http.delete(`/api/Usuario/${id}`);
}
