import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import AIToolsPanel from "@/components/AIToolsPanel";
import { marcarProcessoAtualizado } from "@/app/actions/processos";

type ClienteEmbed = { nome: string } | { nome: string }[] | null;

function nomeCliente(clientes: ClienteEmbed): string {
  if (!clientes) return "Sem cliente";
  if (Array.isArray(clientes)) return clientes[0]?.nome ?? "Sem cliente";
  return clientes.nome;
}

function diasDesde(dataIso: string): number {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export default async function ProcessoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: processo } = await supabase
    .from("processos")
    .select(
      "id, numero_processo, area, status, ultima_atualizacao, criado_em, clientes(nome)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!processo) notFound();

  const dias = diasDesde(processo.ultima_atualizacao);
  const parado = dias > 30;
  const clienteNome = nomeCliente(processo.clientes as ClienteEmbed);

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader email={user.email} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-gold-400 transition-colors"
          >
            &larr; Voltar ao painel
          </Link>
        </div>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">{clienteNome}</h1>
              <p className="text-slate-400 text-sm">
                {processo.numero_processo ?? "Sem número de processo"}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await marcarProcessoAtualizado(processo.id);
              }}
            >
              <button
                type="submit"
                className="text-sm px-4 py-2 rounded-lg border border-navy-700 text-slate-300 hover:border-gold-500/50 hover:text-gold-400 transition-colors"
              >
                Marcar atualizado
              </button>
            </form>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Área
              </div>
              <div className="text-white">{processo.area ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Status
              </div>
              <div className="text-white">{processo.status ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Última atualização
              </div>
              <div className={parado ? "text-red-400 font-semibold" : "text-white"}>
                {dias === 0 ? "Hoje" : `${dias} dia(s) atrás`}
                {parado && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    Parado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Ferramentas de IA
            </h2>
            <p className="text-sm text-slate-400">
              Geração assistida por IA (OpenAI). Revise sempre antes de enviar
              — nada é enviado automaticamente.
            </p>
          </div>
          <AIToolsPanel
            processo={{
              clienteNome,
              numeroProcesso: processo.numero_processo,
              area: processo.area,
              status: processo.status,
              diasParado: dias,
            }}
          />
        </div>
      </main>
    </div>
  );
}
