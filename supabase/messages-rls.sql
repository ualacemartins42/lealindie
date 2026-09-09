-- Políticas para o formulário gravar em public.messages via chave anon.
-- Cole no SQL Editor do projeto ligado ao site.

alter table public.messages enable row level security;

revoke all on table public.messages from anon, authenticated, public;
grant insert on table public.messages to anon, authenticated;

drop policy if exists messages_insert_public on public.messages;
create policy messages_insert_public
  on public.messages
  for insert
  to anon, authenticated
  with check (true);
