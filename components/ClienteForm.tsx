"use client";

import { useActionState, useRef, useEffect } from "react";
import { criarCliente, type ClienteFormState } from "@/app/actions/clientes";

export default function ClienteForm() {
  const [state, formAction, isPending] = useActionState<
    ClienteFormState,
    FormData
  >(criarCliente, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) return;
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid sm:grid-cols-3 gap-3 items-start"
    >
      <input
        name="nome"
        required
        placeholder="Nome do cliente"
        className="px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
      />
      <input
        name="telefone"
        placeholder="Telefone"
        className="px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        className="px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 text-sm"
      />

      {state?.error && (
        <div className="sm:col-span-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="sm:col-span-3 justify-self-start px-5 py-2.5 rounded-xl font-semibold bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? "Salvando…" : "Adicionar cliente"}
      </button>
    </form>
  );
}
