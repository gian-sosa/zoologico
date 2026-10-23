-- Ejecutar como postgres. Todo se revierte, incluidos los usuarios ficticios.
-- Las secuencias explícitas negativas evitan consumir numeración real del libro.
begin;
do $$
declare
  owner_uuid uuid := gen_random_uuid();
  stranger_uuid uuid := gen_random_uuid();
  admin_uuid uuid := gen_random_uuid();
  photo_uuid uuid := gen_random_uuid();
  pending_uuid uuid := gen_random_uuid();
  document_uuid uuid := gen_random_uuid();
  claim_uuid uuid := gen_random_uuid();
  submission_uuid uuid := gen_random_uuid();
  fixture_uuid uuid;
  found integer;
  i integer;
begin
  insert into auth.users (id, aud, role, email, is_anonymous)
    values (owner_uuid, 'authenticated', 'authenticated', owner_uuid::text || '@example.test', true),
           (stranger_uuid, 'authenticated', 'authenticated', stranger_uuid::text || '@example.test', true),
           (admin_uuid, 'authenticated', 'authenticated', admin_uuid::text || '@unsch.edu.pe', false);
  insert into public.photo_admins(user_id) values (admin_uuid);

  set local role service_role;
  insert into public.visitor_photos(id, owner_id, author, object_path, width, height, byte_size, status)
    values (photo_uuid, owner_uuid, 'Prueba', owner_uuid::text || '/' || photo_uuid::text || '.webp', 100, 100, 1000, 'published'),
           (pending_uuid, owner_uuid, 'Prueba', owner_uuid::text || '/' || pending_uuid::text || '.webp', 100, 100, 1000, 'pending');
  insert into public.discount_requests(id, owner_id, name, email, document_type, subject, message, consent_at)
    values (document_uuid, owner_uuid, 'Prueba local', 'prueba@example.test', 'Solicitud', 'Asunto ficticio', 'Contenido ficticio para verificar permisos.', now());
  insert into public.consumer_claims(id, sequence_number, submission_key, payload_hash, details, provider)
    overriding system value values (claim_uuid, -901, submission_uuid, repeat('a', 64),
    '{"name":"Prueba","document_number":"12345678","address":"Dirección ficticia","kind":"Reclamo","detail":"Detalle ficticio","request":"Pedido ficticio","conformity":true}', '{}');
  begin
    insert into public.consumer_claims(sequence_number, submission_key, payload_hash, details, provider)
      overriding system value select -903, submission_key, payload_hash, details, provider
      from public.consumer_claims where id = claim_uuid;
    raise exception 'FAIL: idempotencia ausente';
  exception when unique_violation then null;
  end;
  begin
    update public.consumer_claims set details = '{}' where id = claim_uuid;
    raise exception 'FAIL: service_role pudo modificar la hoja original';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.consumer_claims where id = claim_uuid;
    raise exception 'FAIL: service_role pudo borrar una reclamación';
  exception when insufficient_privilege then null;
  end;
  -- Hay dos reservas de fotos: diez más completan la cuota de doce.
  for i in 1..10 loop
    fixture_uuid := gen_random_uuid();
    insert into public.visitor_photos(id, owner_id, author, object_path, width, height, byte_size)
      values (fixture_uuid, owner_uuid, 'Prueba', owner_uuid::text || '/' || fixture_uuid::text || '.webp', 100, 100, 1000);
  end loop;
  begin
    fixture_uuid := gen_random_uuid();
    insert into public.visitor_photos(id, owner_id, author, object_path, width, height, byte_size)
      values (fixture_uuid, owner_uuid, 'Prueba', owner_uuid::text || '/' || fixture_uuid::text || '.webp', 100, 100, 1000);
    raise exception 'FAIL: cuota de fotos no aplicada' using errcode = 'P0002';
  exception when raise_exception then null;
  end;
  for i in 1..9 loop
    insert into public.discount_requests(owner_id, name, email, document_type, subject, message, consent_at)
      values (owner_uuid, 'Prueba local', 'prueba@example.test', 'Solicitud', 'Asunto ficticio', 'Contenido ficticio para verificar cuotas.', now());
  end loop;
  begin
    insert into public.discount_requests(owner_id, name, email, document_type, subject, message, consent_at)
      values (owner_uuid, 'Prueba local', 'prueba@example.test', 'Solicitud', 'Asunto ficticio', 'Contenido ficticio para verificar cuotas.', now());
    raise exception 'FAIL: cuota de documentos no aplicada' using errcode = 'P0002';
  exception when raise_exception then null;
  end;

  reset role;
  set local role anon;
  select count(*) into found from public.visitor_photos where id in (photo_uuid, pending_uuid);
  if found <> 1 then raise exception 'FAIL: público accede a fotos sin aprobar'; end if;
  perform price from public.tariff_overrides;
  begin
    perform id from public.consumer_claims;
    raise exception 'FAIL: público lee reclamaciones';
  exception when insufficient_privilege then null;
  end;
  begin
    perform id from public.discount_requests;
    raise exception 'FAIL: público lee documentos';
  exception when insufficient_privilege then null;
  end;

  reset role;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', stranger_uuid, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  set local role authenticated;
  select count(*) into found from public.visitor_photos where id in (photo_uuid, pending_uuid);
  if found <> 1 then raise exception 'FAIL: visitante lee fotos pendientes ajenas'; end if;
  select count(*) into found from public.discount_requests where id = document_uuid;
  if found <> 0 then raise exception 'FAIL: visitante lee datos personales'; end if;
  select count(*) into found from public.consumer_claims where id = claim_uuid;
  if found <> 0 then raise exception 'FAIL: visitante lee reclamaciones'; end if;
  begin
    insert into public.photo_admins(user_id) values (stranger_uuid);
    raise exception 'FAIL: visitante se dio permisos de administrador';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.tariff_overrides(id, price) values ('adulto', 999);
    raise exception 'FAIL: visitante modificó tarifas';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.visitor_photos set status = 'published' where id = pending_uuid;
    raise exception 'FAIL: visitante publicó una foto directamente';
  exception when insufficient_privilege then null;
  end;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', owner_uuid, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  select count(*) into found from public.visitor_photos where id in (photo_uuid, pending_uuid);
  if found <> 2 then raise exception 'FAIL: propietario no ve sus fotos pendientes'; end if;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', admin_uuid, 'role', 'authenticated', 'is_anonymous', false)::text, true);
  if not private.is_admin() then raise exception 'FAIL: membresía no reconocida'; end if;
  select count(*) into found from public.discount_requests where id = document_uuid;
  if found <> 1 then raise exception 'FAIL: administrador no lee documentos'; end if;
  select count(*) into found from public.consumer_claims where id = claim_uuid;
  if found <> 1 then raise exception 'FAIL: administrador no lee reclamaciones'; end if;
  insert into public.tariff_overrides(id, price) values ('adulto', 7)
    on conflict (id) do update set id = excluded.id, price = excluded.price;
  if not exists (select 1 from public.tariff_overrides where id = 'adulto' and price = 7) then
    raise exception 'FAIL: upsert administrativo no funciona';
  end if;
  delete from public.tariff_overrides where id = 'adulto';
  reset role;
  if exists (select 1 from storage.buckets where id in ('visitor-photos', 'request-documents') and public) then
    raise exception 'FAIL: bucket público';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage'
    and policyname = 'visitor_reads_allowed_objects' and qual like '%d.attachment_path = objects.name%') then
    raise exception 'FAIL: política de adjuntos no correlacionada con el objeto';
  end if;
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in ('photo_admins','tariff_overrides','visitor_photos','discount_requests','consumer_claims') and not c.relrowsecurity) then
    raise exception 'FAIL: tabla sin RLS';
  end if;
  raise notice 'PASS: roles, privacidad, cuotas, tarifas, idempotencia, retención y buckets privados';
end;
$$;
rollback;
