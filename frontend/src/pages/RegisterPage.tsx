import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../api/usuarios";

interface ErrosForm {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erros, setErros] = useState<ErrosForm>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validar(): boolean {
    const e: ErrosForm = {};

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

    if (!senha) {
      e.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      e.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (!confirmarSenha) {
      e.confirmarSenha = "Confirme a senha.";
    } else if (senha !== confirmarSenha) {
      e.confirmarSenha = "As senhas não coincidem.";
    }

    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validar()) return;

    setLoading(true);

    try {
      await cadastrarUsuario({ nome, email, senha });
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Falha ao cadastrar usuário.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
        <h2 className="page-title">Cadastro de Usuário</h2>

        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            minLength={3}
          />
          {erros.nome && <span className="form-error">{erros.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          {erros.email && <span className="form-error">{erros.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
          {erros.senha && <span className="form-error">{erros.senha}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
            required
          />
          {erros.confirmarSenha && <span className="form-error">{erros.confirmarSenha}</span>}
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
