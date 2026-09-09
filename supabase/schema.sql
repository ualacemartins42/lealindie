-- =============================================================================
-- Leal Indie — schema de métricas, likes e contato
-- Cole este arquivo no SQL Editor do Supabase (ou rode via CLI de migrations).
-- =============================================================================

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  visitor_hash text not null,
  path text not null default '/',
  created_at timestamptz not null default now(),
  constraint page_views_visitor_hash_len check (
    char_length(visitor_hash) between 16 and 128
  ),
  constraint page_views_path_len check (char_length(path) between 1 and 200)
);

create index if not exists page_views_visitor_created_idx
  on public.page_views (visitor_hash, created_at desc);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create table if not exists public.project_likes (
  id bigint generated always as identity primary key,
  project_slug text not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  constraint project_likes_slug_check check (
    project_slug in ('tyairo', 'metrika8', 'sekai', 'eltroca', 'fuelflow')
  ),
  constraint project_likes_visitor_hash_len check (
    char_length(visitor_hash) between 16 and 128
  ),
  constraint project_likes_unique unique (project_slug, visitor_hash)
);

create index if not exists project_likes_slug_idx
  on public.project_likes (project_slug);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  subject text not null default 'Contato',
  whatsapp text,
  message text not null,
  visitor_hash text,
  created_at timestamptz not null default now(),
  constraint contact_messages_name_len check (char_length(name) between 2 and 120),
  constraint contact_messages_email_len check (char_length(email) between 5 and 255),
  constraint contact_messages_subject_len check (char_length(subject) between 2 and 120),
  constraint contact_messages_whatsapp_len check (
    whatsapp is null or char_length(whatsapp) between 8 and 32
  ),
  constraint contact_messages_message_len check (char_length(message) between 10 and 4000),
  constraint contact_messages_email_format check (
    email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
  )
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_visitor_created_idx
  on public.contact_messages (visitor_hash, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS: tabelas expostas, mas sem policies de SELECT/UPDATE/DELETE para anon.
-- Toda leitura/escrita pública passa por RPCs SECURITY DEFINER no schema private.
-- -----------------------------------------------------------------------------

alter table public.page_views enable row level security;
alter table public.page_views force row level security;

alter table public.project_likes enable row level security;
alter table public.project_likes force row level security;

alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

revoke all on table public.page_views from anon, authenticated, public;
revoke all on table public.project_likes from anon, authenticated, public;
revoke all on table public.contact_messages from anon, authenticated, public;

-- Apenas service_role (dashboard / webhooks) lê as linhas brutas.
grant select, insert, delete on table public.page_views to service_role;
grant select, insert, delete on table public.project_likes to service_role;
grant select, insert on table public.contact_messages to service_role;

-- -----------------------------------------------------------------------------
-- Funções privadas (não expostas na Data API)
-- -----------------------------------------------------------------------------

create or replace function private.register_page_view(
  p_visitor_hash text,
  p_path text default '/'
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count bigint;
  v_window constant interval := interval '30 minutes';
  v_path text;
begin
  if p_visitor_hash is null
     or char_length(p_visitor_hash) < 16
     or char_length(p_visitor_hash) > 128 then
    raise exception 'invalid visitor hash' using errcode = '22023';
  end if;

  v_path := left(coalesce(nullif(trim(p_path), ''), '/'), 200);

  if not exists (
    select 1
    from public.page_views as pv
    where pv.visitor_hash = p_visitor_hash
      and pv.created_at > now() - v_window
  ) then
    insert into public.page_views (visitor_hash, path)
    values (p_visitor_hash, v_path);
  end if;

  select count(*) into v_count from public.page_views;
  return v_count;
end;
$$;

create or replace function private.toggle_project_like(
  p_project_slug text,
  p_visitor_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_liked boolean;
  v_count integer;
begin
  if p_visitor_hash is null
     or char_length(p_visitor_hash) < 16
     or char_length(p_visitor_hash) > 128 then
    raise exception 'invalid visitor hash' using errcode = '22023';
  end if;

  if p_project_slug not in ('tyairo', 'metrika8', 'sekai', 'eltroca', 'fuelflow') then
    raise exception 'invalid project slug' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.project_likes as pl
    where pl.project_slug = p_project_slug
      and pl.visitor_hash = p_visitor_hash
  ) then
    delete from public.project_likes as pl
    where pl.project_slug = p_project_slug
      and pl.visitor_hash = p_visitor_hash;
    v_liked := false;
  else
    insert into public.project_likes (project_slug, visitor_hash)
    values (p_project_slug, p_visitor_hash);
    v_liked := true;
  end if;

  select count(*)::integer into v_count
  from public.project_likes as pl
  where pl.project_slug = p_project_slug;

  return jsonb_build_object('liked', v_liked, 'count', v_count);
end;
$$;

create or replace function private.get_site_metrics(p_visitor_hash text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_total_views bigint;
  v_unique_visitors bigint;
  v_total_likes bigint;
  v_likes_by_project jsonb;
  v_liked_slugs jsonb;
begin
  select count(*) into v_total_views from public.page_views;
  select count(distinct visitor_hash) into v_unique_visitors from public.page_views;
  select count(*) into v_total_likes from public.project_likes;

  select coalesce(jsonb_object_agg(project_slug, like_count), '{}'::jsonb)
  into v_likes_by_project
  from (
    select project_slug, count(*)::integer as like_count
    from public.project_likes
    group by project_slug
  ) as counts;

  if p_visitor_hash is not null and char_length(p_visitor_hash) between 16 and 128 then
    select coalesce(jsonb_agg(project_slug), '[]'::jsonb)
    into v_liked_slugs
    from public.project_likes
    where visitor_hash = p_visitor_hash;
  else
    v_liked_slugs := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'total_views', v_total_views,
    'unique_visitors', v_unique_visitors,
    'total_likes', v_total_likes,
    'likes_by_project', v_likes_by_project,
    'liked_slugs', v_liked_slugs
  );
end;
$$;

create or replace function private.submit_contact(
  p_name text,
  p_email text,
  p_subject text,
  p_message text,
  p_visitor_hash text default null,
  p_honeypot text default null,
  p_whatsapp text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_email text;
  v_subject text;
  v_message text;
  v_whatsapp text;
  v_window constant interval := interval '5 minutes';
begin
  -- Honeypot: bots preenchem campos ocultos. Resposta idêntica à de sucesso.
  if p_honeypot is not null and length(trim(p_honeypot)) > 0 then
    return jsonb_build_object('ok', true);
  end if;

  v_name := left(trim(p_name), 120);
  v_email := lower(left(trim(p_email), 255));
  v_subject := left(coalesce(nullif(trim(p_subject), ''), 'Contato'), 120);
  v_message := left(trim(p_message), 4000);
  v_whatsapp := nullif(left(trim(coalesce(p_whatsapp, '')), 32), '');

  if char_length(v_name) < 2
     or char_length(v_email) < 5
     or char_length(v_message) < 10 then
    raise exception 'invalid contact payload' using errcode = '22023';
  end if;

  if v_whatsapp is not null and char_length(v_whatsapp) < 8 then
    raise exception 'invalid contact payload' using errcode = '22023';
  end if;

  if p_visitor_hash is not null
     and char_length(p_visitor_hash) between 16 and 128
     and exists (
       select 1
       from public.contact_messages as cm
       where cm.visitor_hash = p_visitor_hash
         and cm.created_at > now() - v_window
     ) then
    raise exception 'rate limited' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (
    name,
    email,
    subject,
    whatsapp,
    message,
    visitor_hash
  )
  values (
    v_name,
    v_email,
    v_subject,
    v_whatsapp,
    v_message,
    case
      when p_visitor_hash is not null
           and char_length(p_visitor_hash) between 16 and 128
        then p_visitor_hash
      else null
    end
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function private.register_page_view(text, text) from public;
revoke all on function private.toggle_project_like(text, text) from public;
revoke all on function private.get_site_metrics(text) from public;
revoke all on function private.submit_contact(text, text, text, text, text, text, text) from public;

grant execute on function private.register_page_view(text, text) to postgres, service_role;
grant execute on function private.toggle_project_like(text, text) to postgres, service_role;
grant execute on function private.get_site_metrics(text) to postgres, service_role;
grant execute on function private.submit_contact(text, text, text, text, text, text, text) to postgres, service_role;

-- -----------------------------------------------------------------------------
-- Wrappers públicos (únicos endpoints chamáveis pelo anon key)
-- -----------------------------------------------------------------------------

create or replace function public.register_page_view(
  p_visitor_hash text,
  p_path text default '/'
)
returns bigint
language sql
security definer
set search_path = ''
as $$
  select private.register_page_view(p_visitor_hash, p_path);
$$;

create or replace function public.toggle_project_like(
  p_project_slug text,
  p_visitor_hash text
)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select private.toggle_project_like(p_project_slug, p_visitor_hash);
$$;

create or replace function public.get_site_metrics(p_visitor_hash text default null)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select private.get_site_metrics(p_visitor_hash);
$$;

create or replace function public.submit_contact(
  p_name text,
  p_email text,
  p_subject text,
  p_message text,
  p_visitor_hash text default null,
  p_honeypot text default null,
  p_whatsapp text default null
)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select private.submit_contact(
    p_name,
    p_email,
    p_subject,
    p_message,
    p_visitor_hash,
    p_honeypot,
    p_whatsapp
  );
$$;

revoke all on function public.register_page_view(text, text) from public;
revoke all on function public.toggle_project_like(text, text) from public;
revoke all on function public.get_site_metrics(text) from public;
revoke all on function public.submit_contact(text, text, text, text, text, text, text) from public;

grant execute on function public.register_page_view(text, text) to anon, authenticated;
grant execute on function public.toggle_project_like(text, text) to anon, authenticated;
grant execute on function public.get_site_metrics(text) to anon, authenticated;
grant execute on function public.submit_contact(text, text, text, text, text, text, text) to anon, authenticated;

-- E-mail transacional: configure um Database Webhook no insert de
-- public.contact_messages apontando para Resend, Postmark ou uma Edge Function.
