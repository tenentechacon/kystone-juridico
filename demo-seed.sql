-- =====================================================================
-- Kystone Jurídico — dados de demonstração
--
-- Execute depois de supabase-setup.sql. Use o SQL Editor do Supabase
-- (roda como owner do banco e ignora o RLS) ou a service role key.
--
-- IMPORTANTE sobre RLS: as policies filtram por tenant_id = auth.uid().
-- Para enxergar estes dados logado no app, o usuário autenticado precisa
-- ter id = '00000000-0000-0000-0000-000000000001'. Crie esse usuário de
-- demonstração no Supabase Auth (Authentication > Users > Add user) e
-- force esse UUID, ou ajuste o tenant_id abaixo para o id de um usuário
-- real já existente.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Clientes (4)
-- ---------------------------------------------------------------------

INSERT INTO clientes (id, tenant_id, nome, telefone, email, criado_em) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Ana Beatriz Souza',     '(11) 98765-4321', 'ana.souza@example.com',     now() - interval '90 days'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Carlos Eduardo Lima',   '(21) 99887-6655', 'carlos.lima@example.com',   now() - interval '75 days'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Fernanda Oliveira Costa','(31) 97654-3210', 'fernanda.costa@example.com', now() - interval '60 days'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'João Pedro Almeida',    '(41) 96543-2109', 'joao.almeida@example.com',  now() - interval '40 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- Processos (5) — 2 parados há mais de 30 dias (destaque vermelho)
-- ---------------------------------------------------------------------

INSERT INTO processos (id, tenant_id, cliente_id, numero_processo, area, status, ultima_atualizacao, criado_em) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001', '0001234-56.2025.8.26.0100', 'Cível',
   'Em andamento', now() - interval '5 days', now() - interval '90 days'),

  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000002', '0002345-67.2025.5.02.0030', 'Trabalhista',
   'Aguardando documentação', now() - interval '45 days', now() - interval '75 days'),

  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000003', '0003456-78.2024.8.26.0002', 'Família',
   'Em andamento', now() - interval '2 days', now() - interval '60 days'),

  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000004', '0004567-89.2024.5.02.0040', 'Tributário',
   'Aguardando decisão judicial', now() - interval '60 days', now() - interval '40 days'),

  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001', '0005678-90.2025.8.26.0100', 'Empresarial',
   'Em andamento', now() - interval '10 days', now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;
