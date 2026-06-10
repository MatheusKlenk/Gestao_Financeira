import React, { useEffect, useState } from "react";
import {
  atualizarUsuario,
  listarUsuarios,
  removerUsuario,
} from "../api/usuarios";
import {
  listarContasPorUsuario,
  criarConta,
  atualizarConta,
  removerConta,
} from "../api/contas";
import { ContaDto, UsuarioDto } from "../api/types";
import { getUsuarioId } from "../api/auth";

// ─── Admin ────────────────────────────────────────────────────────────────────

interface ErrosUsuario {
  nome?: string;
  email?: string;
}

function AdminUsuariosView() {
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioDto | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("USUARIO");
  const [erros, setErros] = useState<ErrosUsuario>({});

  async function carregarUsuarios() {
    setLoading(true);
    try {
      const lista = await listarUsuarios();
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
      setUsuarios(lista);
    } catch {
      setErro("Erro ao carregar usuários");
    }
    setLoading(false);
  }

  useEffect(() => { carregarUsuarios(); }, []);

  function limparFormulario() {
    setUsuarioEditando(null);
    setNome("");
    setEmail("");
    setSenha("");
    setRole("USUARIO");
    setErros({});
  }

  function validar(): boolean {
    const e: ErrosUsuario = {};

    if (!nome.trim()) {
      e.nome = "O nome é obrigatório.";
    } else if (nome.trim().length < 3) {
      e.nome = "O nome deve ter no mínimo 3 caracteres.";
    }

    if (!email.trim()) {
      e.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Informe um e-mail válido.";
    }

    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioEditando) return;
    if (!validar()) return;

    try {
      await atualizarUsuario(usuarioEditando.id, { nome, email, senha, role });
      limparFormulario();
      carregarUsuarios();
    } catch {
      setErro("Erro ao atualizar usuário");
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Gerenciar Usuários</h2>

      {usuarioEditando && (
        <form className="card" onSubmit={salvar} noValidate>
          <h3>Editando: {usuarioEditando.nome}</h3>

          <div className="form-group">
            <label htmlFor="u-nome">Nome</label>
            <input
              id="u-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={3}
            />
            {erros.nome && <span className="form-error">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="u-email">Email</label>
            <input
              id="u-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erros.email && <span className="form-error">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="u-senha">Senha</label>
            <input
              id="u-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="u-role">Perfil</label>
            <select id="u-role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USUARIO">Usuário</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="btn-primary">Salvar</button>
          <button type="button" className="btn-secondary" onClick={limparFormulario}>
            Cancelar
          </button>
        </form>
      )}

      {erro && <div className="form-error">{erro}</div>}
      {loading && <div className="loading">Carregando...</div>}

      {usuarios.map((u) => (
        <div key={u.id} className="list-item">
          <div>
            <strong>{u.nome}</strong>
            <div>{u.email}</div>
            <div>{u.role}</div>
          </div>
          <div>
            <button
              className="btn-outline"
              onClick={() => {
                setUsuarioEditando(u);
                setNome(u.nome);
                setEmail(u.email);
                setSenha("");
                setRole(u.role);
                setErros({});
              }}
            >
              Editar
            </button>
            <button
              className="btn-danger"
              onClick={async () => {
                if (!window.confirm("Deseja remover este usuário?")) return;
                try {
                  await removerUsuario(u.id);
                  carregarUsuarios();
                } catch {
                  setErro("Erro ao remover usuário");
                }
              }}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Usuário comum ────────────────────────────────────────────────────────────

interface ErrosConta {
  nome?: string;
  saldo?: string;
}

function MinhasContasView() {
  const usuarioId = getUsuarioId();

  const [contas, setContas] = useState<ContaDto[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [contaEditando, setContaEditando] = useState<ContaDto | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState("");
  const [erros, setErros] = useState<ErrosConta>({});

  async function carregarContas() {
    setLoading(true);
    try {
      const lista = await listarContasPorUsuario(usuarioId);
      setContas(lista);
    } catch {
      setErro("Erro ao carregar contas");
    }
    setLoading(false);
  }

  useEffect(() => { carregarContas(); }, []);

  function limparFormulario() {
    setContaEditando(null);
    setMostrarFormulario(false);
    setNome("");
    setSaldo("");
    setErros({});
  }

  function validar(): boolean {
    const e: ErrosConta = {};

    if (!nome.trim()) {
      e.nome = "O nome da conta é obrigatório.";
    } else if (nome.trim().length < 3) {
      e.nome = "O nome deve ter no mínimo 3 caracteres.";
    }

    if (saldo === "" || isNaN(parseFloat(saldo))) {
      e.saldo = "Informe um saldo numérico válido.";
    }

    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function salvarConta(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    try {
      const valor = parseFloat(saldo);
      if (contaEditando) {
        await atualizarConta(contaEditando.id, { nome, saldo: valor, usuarioId });
      } else {
        await criarConta({ nome, saldo: valor, usuarioId });
      }
      limparFormulario();
      carregarContas();
    } catch {
      setErro("Erro ao salvar conta");
    }
  }

  const totalSaldo = contas.reduce((acc, c) => acc + c.saldo, 0);

  return (
    <div className="page">
      <h2 className="page-title">Minhas Contas</h2>

      <h3>Saldo Total: R$ {totalSaldo.toFixed(2)}</h3>

      {mostrarFormulario && (
        <form className="card" onSubmit={salvarConta} noValidate>
          <div className="form-group">
            <label htmlFor="c-nome">Nome da Conta</label>
            <input
              id="c-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={3}
            />
            {erros.nome && <span className="form-error">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="c-saldo">Saldo</label>
            <input
              id="c-saldo"
              type="number"
              step="0.01"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              required
            />
            {erros.saldo && <span className="form-error">{erros.saldo}</span>}
          </div>

          <button className="btn-primary">
            {contaEditando ? "Salvar" : "Criar Conta"}
          </button>
          <button type="button" className="btn-secondary" onClick={limparFormulario}>
            Cancelar
          </button>
        </form>
      )}

      {!mostrarFormulario && (
        <button
          className="btn-primary"
          onClick={() => {
            setContaEditando(null);
            setNome("");
            setSaldo("");
            setMostrarFormulario(true);
          }}
        >
          Nova Conta
        </button>
      )}

      {erro && <div className="form-error">{erro}</div>}
      {loading && <div className="loading">Carregando...</div>}

      {contas.map((c) => (
        <div key={c.id} className="list-item">
          <div>
            <strong>{c.nome}</strong>
            <div>R$ {c.saldo}</div>
          </div>
          <div>
            <button
              className="btn-outline"
              onClick={() => {
                setContaEditando(c);
                setNome(c.nome);
                setSaldo(String(c.saldo));
                setMostrarFormulario(true);
              }}
            >
              Editar
            </button>
            <button
              className="btn-danger"
              onClick={async () => {
                if (!window.confirm("Deseja remover esta conta?")) return;
                try {
                  await removerConta(c.id);
                  carregarContas();
                } catch {
                  setErro("Erro ao remover conta");
                }
              }}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ContasPage() {
  const isAdmin = localStorage.getItem("role") === "ADMIN";
  return isAdmin ? <AdminUsuariosView /> : <MinhasContasView />;
}
