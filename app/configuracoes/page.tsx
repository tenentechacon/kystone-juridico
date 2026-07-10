import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import ConfiguracoesForm from "@/components/ConfiguracoesForm";

function mascarar(chave: string): string {
  if (chave.length <= 8) return "••••••••";
  return `${chave.slice(0, 3)}${"•".repeat(10)}${chave.slice(-4)}`;
}

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("configuracoes_escritorio")
    .select("openai_api_key")
    .eq("tenant_id", user.id)
    .maybeSingle();

  const chaveAtualMascarada = data?.openai_api_key
    ? mascarar(data.openai_api_key)
    : null;

  return (
    <div className="min-h-screen bg-navy-950">
      <AppHeader email={user.email} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Configurações do escritório
          </h1>
          <p className="text-slate-400">
            A chave é usada apenas no seu navegador para chamar a OpenAI ao
            gerar textos com IA. Ela fica salva no banco de dados do
            escritório e nunca aparece em código-fonte.
          </p>
        </div>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
          <ConfiguracoesForm chaveAtualMascarada={chaveAtualMascarada} />
        </div>
      </main>
    </div>
  );
}
