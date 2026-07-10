"use client";

import { useActionState, useState } from "react";
import {
  salvarChaveOpenAI,
  type ConfiguracoesFormState,
} from "@/app/actions/configuracoes";

export default function ConfiguracoesForm({
  chaveAtualMascarada,
}: {
  chaveAtualMascarada: string | null;
}) {
  const [state, formAction, isPending] = useActionState<
    ConfiguracoesFormState,
    FormData
  >(salvarChaveOpenAI, undefined);
  const [mostrar, setMostrar] = useState(false);

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Chave da API OpenAI
        </label>
        <div className="flex gap-2">
          <input
            name="openai_api_key"
            type={mostrar ? "text" : "password"}
            placeholder={chaveAtualMascarada ?? "sk-..."}
            className="flex-1 px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
          />
          <button
            type="button"
            onClick={() => setMostrar((m) => !m)}
            className="px-3 rounded-xl border border-navy-700 text-xs text-slate-400 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
          >
            {mostrar ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          {chaveAtualMascarada
            ? `Chave atual: ${chaveAtualMascarada}. Deixe em branco para manter a chave atual, ou cole uma nova para substituir.`
            : "Nenhuma chave configurada ainda."}
        </p>
      </div>

      {state?.error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
          Configuração salva com sucesso.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-3 rounded-xl font-semibold bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
