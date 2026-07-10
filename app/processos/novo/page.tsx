import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import ProcessoForm from "@/components/ProcessoForm";

export default async function NovoProcessoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("clientes")
    .select("id, nome")
    .order("nome", { ascending: true });

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader email={user.email} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">Novo processo</h1>
        <p className="text-slate-400 mb-8">
          Cadastre um novo processo vinculado a um cliente.
        </p>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
          <ProcessoForm clientes={data ?? []} />
        </div>
      </main>
    </div>
  );
}
