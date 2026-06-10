import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

interface ErrosForm {
  email?: string;
  senha?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<ErrosForm>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validar(): boolean {
    const e: ErrosForm = {};

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

    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validar()) return;

    setLoading(true);

    try {
      await login(email, senha);
      navigate("/contas");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Falha ao autenticar. Verifique email/senha e se a API está rodando.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate style={{ maxWidth: 420 }}>
        <h2 className="page-title">Login</h2>

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
            autoComplete="current-password"
            required
            minLength={6}
          />
          {erros.senha && <span className="form-error">{erros.senha}</span>}
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
