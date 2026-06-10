import React from "react";

export function HomePage() {
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL ?? "https://localhost:5234";

  return (
    <div className="page">
      <div className="card">
        <h2 className="page-title">Gestão Financeira</h2>
        <p>
          <strong>URL da API:</strong> <code>{baseUrl}</code>
        </p>
        <p className="muted">
          Sistema de gestão financeira pessoal. Cadastre suas contas bancárias e
          registre receitas e despesas para acompanhar seu saldo em tempo real.
          Acesse o login para começar.
        </p>
      </div>
    </div>
  );
}
