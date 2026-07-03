-- LabSul - Schema do banco de dados (Supabase / Postgres)
-- Tabelas: cordeis, livros, eventos, admin_audit_log
-- Rode este script inteiro no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists cordeis (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text,
  ano int,
  descricao text,
  capa_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
  );

create table if not exists livros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text,
  categoria text,
  descricao text,
  capa_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
  );

create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data_evento date,
  horario text,
  local text,
  imagem_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
  );

create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  acao text not null,
  tabela text not null,
  registro_id uuid,
  detalhes jsonb,
  created_at timestamptz default now()
  );

alter table cordeis enable row level security;
alter table livros enable row level security;
alter table eventos enable row level security;
alter table admin_audit_log enable row level security;

create policy "leitura_publica_cordeis" on cordeis for select using (true);
create policy "leitura_publica_livros" on livros for select using (true);
create policy "leitura_publica_eventos" on eventos for select using (true);

-- Nao criamos policies de insert/update/delete para o publico de proposito.
-- Somente o backend (api/assistant.js), usando a service_role key guardada
-- em variavel de ambiente no servidor, pode escrever nessas tabelas.
