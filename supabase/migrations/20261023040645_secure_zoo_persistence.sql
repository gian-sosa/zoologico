-- Compatible con api/*.mjs y src/features/*. Las API son las únicas escritoras
-- de fotos, documentos y reclamaciones; nunca distribuir la service_role.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create table public.photo_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.photo_admins enable row level security;
revoke all on public.photo_admins from public, anon, authenticated, service_role;
grant select on public.photo_admins to authenticated;
grant select, insert, delete on public.photo_admins to service_role;
create policy admin_reads_own_membership on public.photo_admins
  for select to authenticated using (user_id = (select auth.uid()));

-- SECURITY INVOKER: consulta únicamente la membresía visible bajo RLS.
create function private.is_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.photo_admins where user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated, service_role;

create table public.tariff_overrides (
  id text primary key check (id in ('adulto', 'puber', 'ninos', 'park-auto', 'park-mototaxi', 'park-moto')),
  price numeric(10,2) not null check (price >= 0 and price <= 100000),
  updated_at timestamptz not null default now()
);
alter table public.tariff_overrides enable row level security;
revoke all on public.tariff_overrides from public, anon, authenticated, service_role;
grant select on public.tariff_overrides to anon, authenticated;
grant insert (id, price), update (id, price), delete on public.tariff_overrides to authenticated;
grant select, insert, update, delete on public.tariff_overrides to service_role;
create policy public_reads_tariffs on public.tariff_overrides for select to anon, authenticated using (true);
create policy admin_inserts_tariffs on public.tariff_overrides for insert to authenticated
  with check ((select private.is_admin()));
create policy admin_updates_tariffs on public.tariff_overrides for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy admin_deletes_tariffs on public.tariff_overrides for delete to authenticated
  using ((select private.is_admin()));

create function private.touch_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
revoke all on function private.touch_updated_at() from public, anon, authenticated;
create trigger tariff_updated_at before update on public.tariff_overrides
  for each row execute function private.touch_updated_at();

create table public.visitor_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  author text not null check (char_length(btrim(author)) between 1 and 40 and author !~ '[[:cntrl:]]'),
  object_path text not null unique,
  width integer not null check (width between 1 and 1600),
  height integer not null check (height between 1 and 1600),
  byte_size integer not null check (byte_size between 1 and 307200),
  status text not null default 'uploading' check (status in ('uploading', 'pending', 'published', 'rejected', 'deleting')),
  deletion_requested boolean not null default false,
  deletion_requested_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  last_actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (object_path = owner_id::text || '/' || id::text || '.webp'),
  check (deletion_requested = (deletion_requested_at is not null))
);
create index visitor_photos_owner_created_idx on public.visitor_photos(owner_id, created_at desc);
create index visitor_photos_listing_idx on public.visitor_photos(status, created_at desc, id desc);
create index visitor_photos_reviewed_by_idx on public.visitor_photos(reviewed_by);
create index visitor_photos_last_actor_idx on public.visitor_photos(last_actor_id);
alter table public.visitor_photos enable row level security;
revoke all on public.visitor_photos from public, anon, authenticated, service_role;
grant select (id, author, owner_id, object_path, status, deletion_requested, created_at)
  on public.visitor_photos to anon, authenticated;
grant select, insert, update, delete on public.visitor_photos to service_role;
create policy public_reads_published_photos on public.visitor_photos for select to anon
  using (status = 'published');
create policy visitor_reads_accessible_photos on public.visitor_photos for select to authenticated
  using (status = 'published' or owner_id = (select auth.uid()) or (select private.is_admin()));
create trigger photo_updated_at before update on public.visitor_photos
  for each row execute function private.touch_updated_at();

-- Se conserva el nombre histórico utilizado por la aplicación.
create table public.discount_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 2 and 150),
  institution text not null default '' check (char_length(institution) <= 250),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text not null default '' check (char_length(phone) <= 40),
  document_type text not null check (document_type in ('Solicitud', 'Oficio', 'Carta', 'Informe', 'Otro documento')),
  document_number text not null default '' check (char_length(document_number) <= 80),
  subject text not null check (char_length(btrim(subject)) between 5 and 200),
  message text not null check (char_length(btrim(message)) between 20 and 4000),
  attachment_path text unique,
  submission_status text not null default 'received' check (submission_status in ('uploading', 'received')),
  consent_at timestamptz not null,
  "createdAt" timestamptz not null default now(),
  check (attachment_path is null or attachment_path = owner_id::text || '/' || id::text || '.pdf'),
  check (submission_status <> 'uploading' or attachment_path is not null)
);
create index discount_requests_owner_created_idx on public.discount_requests(owner_id, "createdAt" desc);
create index discount_requests_inbox_idx on public.discount_requests(submission_status, "createdAt" desc);
alter table public.discount_requests enable row level security;
revoke all on public.discount_requests from public, anon, authenticated, service_role;
grant select on public.discount_requests to authenticated;
grant select, insert, update, delete on public.discount_requests to service_role;
create policy admin_reads_documents on public.discount_requests for select to authenticated
  using ((select private.is_admin()));

-- Contadores privados: sobreviven a la eliminación de filas y evitan que dos
-- peticiones simultáneas eludan las cuotas. No contienen datos del formulario.
create table private.daily_submissions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('photo', 'document')),
  day date not null,
  total integer not null check (total > 0),
  primary key (owner_id, kind, day)
);
alter table private.daily_submissions enable row level security;
revoke all on private.daily_submissions from public, anon, authenticated;
grant select, insert, update, delete on private.daily_submissions to service_role;
create policy server_manages_quotas on private.daily_submissions for all to service_role
  using (true) with check (true);

create function private.enforce_submission_quota() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare submission_kind text; submitted integer; limit_per_day integer;
begin
  submission_kind := case when tg_table_name = 'visitor_photos' then 'photo' else 'document' end;
  limit_per_day := case when submission_kind = 'photo' then 12 else 10 end;
  insert into private.daily_submissions as counters(owner_id, kind, day, total)
    values (new.owner_id, submission_kind, (now() at time zone 'America/Lima')::date, 1)
    on conflict (owner_id, kind, day) do update set total = counters.total + 1
    returning total into submitted;
  if submitted > limit_per_day then
    raise exception 'Daily submission quota exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_submission_quota() from public, anon, authenticated;
create trigger photo_submission_quota before insert on public.visitor_photos
  for each row execute function private.enforce_submission_quota();
create trigger document_submission_quota before insert on public.discount_requests
  for each row execute function private.enforce_submission_quota();

create table public.consumer_claims (
  id uuid primary key default gen_random_uuid(),
  sequence_number bigint generated always as identity unique,
  code text generated always as ('LR-' || lpad(sequence_number::text, 10, '0')) stored unique,
  submission_key uuid not null unique,
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  details jsonb not null check (jsonb_typeof(details) = 'object' and octet_length(details::text) <= 60000),
  provider jsonb not null check (jsonb_typeof(provider) = 'object' and octet_length(provider::text) <= 16000),
  provider_actions text not null default '' check (char_length(provider_actions) <= 10000),
  response_text text check (char_length(response_text) <= 10000),
  response_sent_at timestamptz,
  receipt_email_status text not null default 'pending' check (receipt_email_status in ('pending', 'sent', 'not_requested')),
  receipt_email_id text,
  receipt_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  check (details ?& array['name','document_number','address','kind','detail','request','conformity']),
  check (jsonb_typeof(details->'conformity') = 'boolean' and details->>'conformity' = 'true'),
  check (details->>'kind' in ('Reclamo', 'Queja'))
);
alter table public.consumer_claims enable row level security;
revoke all on public.consumer_claims from public, anon, authenticated, service_role;
grant select (id, code, created_at, provider, details, receipt_email_status, provider_actions,
  response_text, response_sent_at, sequence_number) on public.consumer_claims to authenticated;
grant select, insert on public.consumer_claims to service_role;
grant update (receipt_email_status, receipt_email_id, receipt_email_sent_at,
  provider_actions, response_text, response_sent_at) on public.consumer_claims to service_role;
revoke all on sequence public.consumer_claims_sequence_number_seq from public, anon, authenticated;
grant usage, select on sequence public.consumer_claims_sequence_number_seq to service_role;
create policy admin_reads_claims on public.consumer_claims for select to authenticated
  using ((select private.is_admin()));

-- Buckets privados: las subidas/eliminaciones se realizan solo mediante las API.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visitor-photos', 'visitor-photos', false, 307200, array['image/webp']),
       ('request-documents', 'request-documents', false, 3145728, array['application/pdf']);

create policy public_reads_published_photo_objects on storage.objects for select to anon
  using (bucket_id = 'visitor-photos' and exists (
    select 1 from public.visitor_photos p where p.object_path = name and p.status = 'published'
  ));
create policy visitor_reads_allowed_objects on storage.objects for select to authenticated
  using (
    (bucket_id = 'visitor-photos' and exists (
      select 1 from public.visitor_photos p where p.object_path = name
        and (p.status = 'published' or p.owner_id = (select auth.uid()) or (select private.is_admin()))
    )) or (bucket_id = 'request-documents' and (select private.is_admin()) and exists (
      select 1 from public.discount_requests d where d.attachment_path = name and d.submission_status = 'received'
    ))
  );

comment on table public.photo_admins is 'Autorización explícita; solo gestión confiable desde SQL/service_role. Nunca autoalta por dominio.';
comment on table public.consumer_claims is 'Datos personales y hoja inmutable; sin borrado mediante Data API. Retención legal gestionada por el responsable.';
