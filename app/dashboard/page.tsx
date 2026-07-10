import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import { marcarProcessoAtualizado } from "@/app/actions/processos";

type ClienteEmbed = { nome: string } | { nome: string }[] | null;

type ProcessoRow = {
  id: string;
  numero_processo: string | null;
  area: string | null;
  status: string | null;
  ultima_atualizacao: string;
  clientes: ClienteEmbed;
};

function nomeCliente(clientes: ClienteEmbed): string {
  if (!clientes) return "Sem cliente";
  if (Array.isArray(clientes)) return clientes[0]?.nome ?? "Sem cliente";
  return clientes.nome;
}

function diasDesde(dataIso: string): number {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("processos")
    .select(
      "id, numero_processo, area, status, ultima_atualizacao, clientes(nome)"
    )
    .order("ultima_atualizacao", { ascending: true });

  const processos = (data ?? []) as unknown as ProcessoRow[];

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader email={user.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Painel de Processos
            </h1>
            <p className="text-slate-400">
              {processos.length} processo(s) cadastrado(s).
            </p>
          </div>
          <Link
            href="/processos/novo"
            className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"
          >
            + Novo processo
          </Link>
        </div>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Última atualização
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {processos.map((p) => {
                  const dias = diasDesde(p.ultima_atualizacao);
                  const parado = dias > 30;
                  return (
                    <tr
                      key={p.id}
                      className={
                        parado
                          ? "bg-red-500/10 hover:bg-red-500/15 transition-colors"
                          : "hover:bg-navy-700/40 transition-colors"
                      }
                    >
                      <td className="px-5 py-4 text-white font-medium whitespace-nowrap">
                        {nomeCliente(p.clientes)}
                        {p.numero_processo && (
                          <div className="text-xs text-slate-500 font-normal">
                            {p.numero_processo}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {p.area ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {p.status ?? "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={
                            parado
                              ? "text-red-400 font-semibold"
                              : "text-slate-300"
                          }
                        >
                          {dias === 0 ? "Hoje" : `${dias} dia(s)`}
                        </span>
                        {parado && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                            Parado
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <form
                            action={async () => {
                              "use server";
                              await marcarProcessoAtualizado(p.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="text-xs px-3 py-1.5 rounded-lg border border-navy-700 text-slate-300 hover:border-gold-500/50 hover:text-gold-400 transition-colors"
                            >
                              Marcar atualizado
                            </button>
                          </form>
                          <Link
                            href={`/processos/${p.id}`}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
                          >
                            Ver detalhes
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {processos.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Nenhum processo cadastrado ainda.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
