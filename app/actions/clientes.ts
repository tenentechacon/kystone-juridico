"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ClienteFormState = { error?: string } | undefined;

export async function criarCliente(
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nome = (formData.get("nome") as string)?.trim();
  const telefone = (formData.get("telefone") as string) || null;
  const email = (formData.get("email") as string) || null;

  if (!nome) {
    return { error: "Informe o nome do cliente." };
  }

  const { error } = await supabase.from("clientes").insert({
    tenant_id: user.id,
    nome,
    telefone,
    email,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/clientes");
  return undefined;
}
