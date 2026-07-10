import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import ClienteForm from "@/components/ClienteForm";

type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  criado_em: string;
};

export default async function ClientesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("clientes")
    .select("id, nome, telefone, email, criado_em")
    .order("nome", { ascending: true });

  const clientes = (data ?? []) as Cliente[];

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader email={user.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Clientes</h1>
          <p className="text-slate-400">
            {clientes.length} cliente(s) cadastrado(s).
          </p>
        </div>

        <section className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">
            Novo cliente
          </h2>
          <ClienteForm />
        </section>

        <section className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cadastrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-navy-700/40 transition-colors"
                  >
                    <td className="px-5 py-4 text-white font-medium">
                      {c.nome}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {c.telefone ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {c.email ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(c.criado_em).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {clientes.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Nenhum cliente cadastrado ainda.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
