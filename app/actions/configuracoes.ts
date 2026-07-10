"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ConfiguracoesFormState = { error?: string; success?: boolean } | undefined;

export async function salvarChaveOpenAI(
  _prevState: ConfiguracoesFormState,
  formData: FormData
): Promise<ConfiguracoesFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const openaiApiKey = (formData.get("openai_api_key") as string)?.trim();

  // Campo em branco mantém a chave já salva (não sobrescreve com null).
  if (!openaiApiKey) {
    return { success: true };
  }

  const { error } = await supabase
    .from("configuracoes_escritorio")
    .upsert(
      { tenant_id: user.id, openai_api_key: openaiApiKey },
      { onConflict: "tenant_id" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/configuracoes");
  return { success: true };
}
