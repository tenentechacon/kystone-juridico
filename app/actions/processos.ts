"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProcessoFormState = { error?: string } | undefined;

export async function criarProcesso(
  _prevState: ProcessoFormState,
  formData: FormData
): Promise<ProcessoFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clienteId = formData.get("cliente_id") as string;
  const numeroProcesso = (formData.get("numero_processo") as string) || null;
  const area = (formData.get("area") as string) || null;
  const status = (formData.get("status") as string) || null;

  if (!clienteId) {
    return { error: "Selecione um cliente." };
  }

  const { error } = await supabase.from("processos").insert({
    tenant_id: user.id,
    cliente_id: clienteId,
    numero_processo: numeroProcesso,
    area,
    status,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function marcarProcessoAtualizado(processoId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("processos")
    .update({ ultima_atualizacao: new Date().toISOString() })
    .eq("id", processoId);

  revalidatePath("/dashboard");
  revalidatePath(`/processos/${processoId}`);
}
