"use client";

import { useActionState } from "react";
import { criarProcesso, type ProcessoFormState } from "@/app/actions/processos";

const AREAS = ["Cível", "Trabalhista", "Família", "Tributário", "Empresarial", "Criminal"];
const STATUS_OPCOES = [
  "Em andamento",
  "Aguardando documentação",
  "Aguardando decisão judicial",
  "Concluído",
  "Suspenso",
];

export default function ProcessoForm({
  clientes,
}: {
  clientes: { id: string; nome: string }[];
}) {
  const [state, formAction, isPending] = useActionState<
    ProcessoFormState,
    FormData
  >(criarProcesso, undefined);

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Cliente
        </label>
        <select
          name="cliente_id"
          required
          defaultValue=""
          className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
        >
          <option value="" disabled>
            Selecione um cliente
          </option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        {clientes.length === 0 && (
          <p className="text-xs text-slate-500 mt-1.5">
            Nenhum cliente cadastrado.{" "}
            <a href="/clientes" className="underline hover:text-gold-400">
              Cadastre um cliente
            </a>{" "}
            antes de criar um processo.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Número do processo
        </label>
        <input
          name="numero_processo"
          placeholder="0000000-00.0000.0.00.0000"
          className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Área
        </label>
        <select
          name="area"
          defaultValue=""
          className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
        >
          <option value="">Não informada</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Status
        </label>
        <select
          name="status"
          defaultValue="Em andamento"
          className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
        >
          {STATUS_OPCOES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || clientes.length === 0}
        className="px-5 py-3 rounded-xl font-semibold bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? "Salvando…" : "Cadastrar processo"}
      </button>
    </form>
  );
}
