-- Tabela, políticas e totais de curtidas da vitrine.
-- Cole no SQL Editor do mesmo projeto do formulário (o que está no .env.local).

create table if not exists public.project_likes (
  project_slug text not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  primary key (project_slug, visitor_hash)
);

alter table public.project_likes drop constraint if exists project_likes_slug_check;
alter table public.project_likes add constraint project_likes_slug_check check (
  project_slug in ('tyairo', 'metrika8', 'sekai', 'eltroca', 'fuelflow', 'gestomagico', 'ovitrampas')
);

alter table public.project_likes drop constraint if exists project_likes_visitor_hash_len;
alter table public.project_likes add constraint project_likes_visitor_hash_len check (
  char_length(visitor_hash) between 16 and 128
);

alter table public.project_likes enable row level security;

revoke all on table public.project_likes from anon, authenticated, public;
grant select, insert, delete on table public.project_likes to anon, authenticated;

drop policy if exists project_likes_select_public on public.project_likes;
create policy project_likes_select_public
  on public.project_likes
  for select
  to anon, authenticated
  using (true);

drop policy if exists project_likes_insert_public on public.project_likes;
create policy project_likes_insert_public
  on public.project_likes
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists project_likes_delete_public on public.project_likes;
create policy project_likes_delete_public
  on public.project_likes
  for delete
  to anon, authenticated
  using (true);

create or replace view public.project_like_counts
with (security_invoker = false)
as
select project_slug, count(*)::integer as like_count
from public.project_likes
group by project_slug;

grant select on public.project_like_counts to anon, authenticated;
