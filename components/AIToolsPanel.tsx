"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { gerarTextoComIA } from "@/lib/openai";

type ProcessoInfo = {
  clienteNome: string;
  numeroProcesso: string | null;
  area: string | null;
  status: string | null;
  diasParado: number;
};

type Ferramenta = {
  id: string;
  titulo: string;
  descricao: string;
  montarPrompts: (p: ProcessoInfo) => { system: string; user: string };
};

const FERRAMENTAS: Ferramenta[] = [
  {
    id: "acompanhamento",
    titulo: "Gerar mensagem de acompanhamento",
    descricao: "Mensagem cordial para atualizar o cliente sobre o processo.",
    montarPrompts: (p) => ({
      system:
        "Você é assistente de um escritório de advocacia brasileiro. Escreva mensagens curtas, cordiais, profissionais e claras para clientes, sem jargão jurídico excessivo. Nunca prometa resultado de processo.",
      user:
        `Escreva uma mensagem de acompanhamento para enviar ao cliente ${p.clienteNome} ` +
        `sobre o processo ${p.numeroProcesso ?? "(sem número informado)"}, ` +
        `área ${p.area ?? "não informada"}, status atual "${p.status ?? "não informado"}". ` +
        `Já se passaram ${p.diasParado} dia(s) desde a última atualização registrada. ` +
        `A mensagem deve ser breve (até 4 frases), cordial e adequada para envio por WhatsApp ou e-mail.`,
    }),
  },
  {
    id: "golpe",
    titulo: "Gerar alerta de golpe",
    descricao: "Aviso ao cliente sobre golpes comuns na área jurídica.",
    montarPrompts: (p) => ({
      system:
        "Você é assistente de um escritório de advocacia brasileiro escrevendo alertas de segurança para clientes sobre golpes (fraudes) que usam o nome de advogados, tribunais ou órgãos públicos.",
      user:
        `Escreva um alerta curto e claro para o cliente ${p.clienteNome}, explicando que golpistas costumam se passar por advogados ou pelo tribunal ` +
        `para pedir depósitos, PIX ou dados bancários com urgência, alegando taxas, custas ou liberação de valores relacionados a processos judiciais ` +
        `(neste caso, um processo da área ${p.area ?? "jurídica"}). ` +
        `Reforce que o escritório NUNCA solicita pagamentos por PIX/WhatsApp sem contato prévio confirmado, e que qualquer dúvida deve ser confirmada diretamente com o escritório pelos canais oficiais. ` +
        `Tom sério, mas tranquilizador. Até 5 frases.`,
    }),
  },
  {
    id: "post",
    titulo: "Gerar sugestão de post para redes sociais",
    descricao: "Post institucional genérico, sem expor dados do cliente.",
    montarPrompts: (p) => ({
      system:
        "Você é assistente de marketing de um escritório de advocacia brasileiro. Gere sugestões de post para redes sociais (Instagram/LinkedIn) educativos e institucionais. NUNCA inclua nomes de clientes, números de processo ou qualquer dado que identifique um caso real — o conteúdo deve ser genérico e educativo.",
      user:
        `Sugira um post institucional para redes sociais sobre um tema relevante da área de Direito ${p.area ?? ""}, ` +
        `com linguagem acessível ao público leigo, tom profissional e confiável, incluindo uma chamada para contato com o escritório ao final. ` +
        `Não mencione nomes de clientes nem detalhes de casos específicos. Até 6 frases, pode incluir 2-3 hashtags relevantes.`,
    }),
  },
];

export default function AIToolsPanel({ processo }: { processo: ProcessoInfo }) {
  const [apiKey, setApiKey] = useState<string | null | undefined>(undefined);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Record<string, string>>({});
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    async function carregarChave() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("configuracoes_escritorio")
        .select("openai_api_key")
        .eq("tenant_id", user.id)
        .maybeSingle();

      if (ativo) {
        setApiKey(data?.openai_api_key ?? null);
      }
    }
    carregarChave();
    return () => {
      ativo = false;
    };
  }, []);

  async function executar(ferramenta: Ferramenta) {
    if (!apiKey) return;
    setErro(null);
    setLoadingId(ferramenta.id);
    try {
      const { system, user } = ferramenta.montarPrompts(processo);
      const texto = await gerarTextoComIA(apiKey, system, user);
      setResultados((prev) => ({ ...prev, [ferramenta.id]: texto }));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido ao gerar texto.");
    } finally {
      setLoadingId(null);
    }
  }

  async function copiar(id: string) {
    const texto = resultados[id];
    if (!texto) return;
    await navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId((c) => (c === id ? null : c)), 2000);
  }

  if (apiKey === undefined) {
    return (
      <div className="text-sm text-slate-500">Carregando ferramentas de IA…</div>
    );
  }

  if (apiKey === null) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
        Nenhuma chave da OpenAI configurada para este escritório.{" "}
        <Link href="/configuracoes" className="underline hover:text-red-200">
          Configure em Configurações
        </Link>{" "}
        para usar as ferramentas de IA.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {erro && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
          {erro}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        {FERRAMENTAS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => executar(f)}
            disabled={loadingId !== null}
            className="text-left p-4 rounded-xl border border-navy-700 bg-navy-800 hover:border-gold-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="text-sm font-semibold text-white mb-1">
              {loadingId === f.id ? "Gerando…" : f.titulo}
            </div>
            <div className="text-xs text-slate-400">{f.descricao}</div>
          </button>
        ))}
      </div>

      {FERRAMENTAS.filter((f) => resultados[f.id]).map((f) => (
        <div
          key={f.id}
          className="p-4 rounded-xl border border-navy-700 bg-navy-800 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gold-400">
              {f.titulo}
            </span>
            <button
              type="button"
              onClick={() => copiar(f.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              {copiadoId === f.id ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <textarea
            className="w-full min-h-32 rounded-lg bg-navy-900 border border-navy-700 text-white p-3 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30"
            value={resultados[f.id]}
            onChange={(e) =>
              setResultados((prev) => ({ ...prev, [f.id]: e.target.value }))
            }
          />
          <p className="text-xs text-slate-500">
            Revise o texto antes de enviar. Nada é enviado automaticamente.
          </p>
        </div>
      ))}
    </div>
  );
}
