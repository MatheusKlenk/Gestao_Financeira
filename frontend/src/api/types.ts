export type LoginResponse = {
  token: string;
  nome: string;
  role: string;
};

export type UsuarioDto = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

export type ContaDto = {
  id: number;
  nome: string;
  saldo: number;
  usuarioId: number;
  nomeUsuario: string;
};

export type TransacaoDto = {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  data: string;
  contaId: number;
  nomeConta: string;
};
