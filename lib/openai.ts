// Chamada direta do navegador para a API da OpenAI. A chave nunca fica
// hardcoded no código — é carregada em tempo de execução da tabela
// configuracoes_escritorio (ver components/AIToolsPanel.tsx).
export async function gerarTextoComIA(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Falha ao chamar a OpenAI (${response.status}): ${body.slice(0, 300)}`
    );
  }

  const data = await response.json();
  const texto = data?.choices?.[0]?.message?.content;
  if (!texto) {
    throw new Error("A OpenAI não retornou nenhum conteúdo.");
  }
  return texto as string;
}
