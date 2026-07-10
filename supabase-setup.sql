-- =====================================================================
-- Kystone Jurídico — schema inicial
-- Execute este arquivo no SQL Editor do Supabase (projeto já usado pelo
-- kystone-platform). Roda como owner do banco, então cria as tabelas e
-- políticas sem ser bloqueado pelo RLS que está sendo definido aqui.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  nome text NOT NULL,
  telefone text,
  email text,
  criado_em timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS processos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  cliente_id uuid REFERENCES clientes(id),
  numero_processo text,
  area text,
  status text,
  ultima_atualizacao timestamptz DEFAULT now(),
  criado_em timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS configuracoes_escritorio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  openai_api_key text
);

-- Índices de apoio às consultas por tenant (toda leitura da aplicação
-- filtra por tenant_id, direta ou indiretamente via RLS).
CREATE INDEX IF NOT EXISTS clientes_tenant_id_idx ON clientes(tenant_id);
CREATE INDEX IF NOT EXISTS processos_tenant_id_idx ON processos(tenant_id);
CREATE INDEX IF NOT EXISTS processos_cliente_id_idx ON processos(cliente_id);

-- Uma configuração por escritório (tenant): permite usar upsert
-- (ON CONFLICT tenant_id) na página /configuracoes.
CREATE UNIQUE INDEX IF NOT EXISTS configuracoes_escritorio_tenant_id_key
  ON configuracoes_escritorio(tenant_id);

-- ---------------------------------------------------------------------
-- RLS (Row Level Security — segurança por linha)
-- ---------------------------------------------------------------------

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_escritorio ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Policies (regras de acesso)
-- Cada usuário autenticado só enxerga/edita linhas do próprio tenant,
-- onde tenant_id = auth.uid() (o próprio id do usuário é o id do tenant).
-- Uma policy FOR ALL sem WITH CHECK usa a mesma expressão do USING
-- também para INSERT/UPDATE, mas deixamos o WITH CHECK explícito abaixo
-- para reforçar a intenção.
-- ---------------------------------------------------------------------

CREATE POLICY "tenant_clientes" ON clientes
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "tenant_processos" ON processos
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "tenant_configuracoes" ON configuracoes_escritorio
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());
