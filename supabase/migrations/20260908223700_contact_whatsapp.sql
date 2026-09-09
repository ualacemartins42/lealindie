-- WhatsApp opcional em contact_messages + nova assinatura de submit_contact

alter table public.contact_messages
  add column if not exists whatsapp text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_messages_whatsapp_len'
      and conrelid = 'public.contact_messages'::regclass
  ) then
    alter table public.contact_messages
      add constraint contact_messages_whatsapp_len
      check (whatsapp is null or char_length(whatsapp) between 8 and 32);
  end if;
end $$;

drop function if exists public.submit_contact(text, text, text, text, text, text);
drop function if exists private.submit_contact(text, text, text, text, text, text);

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

revoke all on function private.submit_contact(text, text, text, text, text, text, text) from public;
revoke all on function public.submit_contact(text, text, text, text, text, text, text) from public;
grant execute on function private.submit_contact(text, text, text, text, text, text, text) to postgres, service_role;
grant execute on function public.submit_contact(text, text, text, text, text, text, text) to anon, authenticated;
