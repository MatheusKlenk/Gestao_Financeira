import React, { useEffect, useMemo, useState } from "react";
import { listarContas } from "../api/contas";
import {
  atualizarTransacao,
  criarTransacao,
  listarTransacoes,
  removerTransacao,
} from "../api/transacoes";
import { ContaDto, TransacaoDto } from "../api/types";

interface ErrosForm {
  descricao?: string;
  valor?: string;
  contaId?: string;
}

export function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<TransacaoDto[]>([]);
  const [contas, setContas] = useState<ContaDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<TransacaoDto | null>(null);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [tipo, setTipo] = useState<string>("credito");
  const [data, setData] = useState<string>(new Date().toISOString().slice(0, 10));
  const [contaId, setContaId] = useState<number>(0);
  const [erros, setErros] = useState<ErrosForm>({});

  const sortedTransacoes = useMemo(
    () =>
      [...transacoes].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
      ),
    [transacoes],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [cts, txs] = await Promise.all([listarContas(), listarTransacoes()]);
      setContas(cts);
      setTransacoes(txs);
      if (cts.length > 0 && contaId === 0) {
        setContaId(cts[0].id);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditing(null);
    setDescricao("");
    setValor(0);
    setTipo("credito");
    setData(new Date().toISOString().slice(0, 10));
    setContaId(contas[0]?.id ?? 0);
    setErros({});
  }

  function validar(): boolean {
    const e: ErrosForm = {};

    if (!descricao.trim()) {
      e.descricao = "A descrição é obrigatória.";
    } else if (descricao.trim().length < 3) {
      e.descricao = "A descrição deve ter no mínimo 3 caracteres.";
    }

    if (!valor || isNaN(Number(valor))) {
      e.valor = "Informe um valor válido.";
    } else if (Number(valor) <= 0) {
      e.valor = "O valor deve ser maior que zero.";
    }

    if (!contaId || contaId === 0) {
      e.contaId = "Selecione uma conta.";
    }

    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validar()) return;

    try {
      const payload = {
        descricao,
        valor: Number(valor),
        tipo,
        data: new Date(data).toISOString(),
        contaId: Number(contaId),
      };

      if (editing) {
        await atualizarTransacao(editing.id, payload);
      } else {
        await criarTransacao(payload);
      }

      resetForm();
      await refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Falha ao salvar transação.",
      );
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Transações</h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              minLength={3}
            />
            {erros.descricao && <span className="form-error">{erros.descricao}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              step="0.01"
              min="0.01"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              required
            />
            {erros.valor && <span className="form-error">{erros.valor}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="credito">Crédito (entrada)</option>
              <option value="debito">Débito (saída)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contaId">Conta</label>
            <select
              id="contaId"
              value={contaId}
              onChange={(e) => setContaId(Number(e.target.value))}
              required
            >
              <option value={0}>Selecione...</option>
              {contas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} — R$ {Number(c.saldo).toFixed(2)}
                </option>
              ))}
            </select>
            {erros.contaId && <span className="form-error">{erros.contaId}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editing ? "Atualizar" : "Criar"}
          </button>
          {editing && (
            <button className="btn-secondary" type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedTransacoes.map((t) => (
          <div key={t.id} className="list-item">
            <div>
              <strong>{t.descricao}</strong>{" "}
              <span className="muted">#{t.id}</span>
              <div className="muted">
                Valor: R$ {Number(t.valor).toFixed(2)}{" "}
                <span style={{ color: t.tipo === "credito" ? "#16a34a" : "#dc2626" }}>
                  ({t.tipo === "credito" ? "▲ crédito" : "▼ débito"})
                </span>
              </div>
              <div className="muted">
                Data: {new Date(t.data).toLocaleDateString("pt-BR")}
              </div>
              <div className="muted">Conta: {t.nomeConta}</div>
            </div>

            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setEditing(t);
                  setDescricao(t.descricao);
                  setValor(Number(t.valor));
                  setTipo(t.tipo);
                  setData(t.data.slice(0, 10));
                  setContaId(t.contaId);
                  setErros({});
                }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Remover transação "${t.descricao}"?`)) return;
                  try {
                    await removerTransacao(t.id);
                    await refresh();
                  } catch (err: any) {
                    setError(
                      err?.response?.data?.message ??
                        err?.message ??
                        "Falha ao remover transação.",
                    );
                  }
                }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {!loading && sortedTransacoes.length === 0 && (
          <div className="empty-state">Nenhuma transação encontrada.</div>
        )}
      </div>
    </div>
  );
}
