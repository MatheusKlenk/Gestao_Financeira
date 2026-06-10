import { http } from './http';
import { LoginResponse } from './types';

function parseJwtPayload(token: string): Record<string, any> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export async function login(email: string, senha: string) {
  const { data } = await http.post<LoginResponse>('/api/Auth/login', { email, senha });
  localStorage.setItem('token', data.token);
  localStorage.setItem('nome', data.nome);
  localStorage.setItem('role', data.role);

  const payload = parseJwtPayload(data.token);
  const id =
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
    payload['nameid'] ??
    payload['sub'] ??
    '';
  localStorage.setItem('usuarioId', String(id));

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('nome');
  localStorage.removeItem('role');
  localStorage.removeItem('usuarioId');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function getUsuarioId(): number {
  return Number(localStorage.getItem('usuarioId') ?? 0);
}
