-- Evitar que `name` se resuelva contra discount_requests.name en la subconsulta.
alter policy public_reads_published_photo_objects on storage.objects
  using (bucket_id = 'visitor-photos' and exists (
    select 1 from public.visitor_photos p
    where p.object_path = storage.objects.name and p.status = 'published'
  ));
alter policy visitor_reads_allowed_objects on storage.objects
  using (
    (bucket_id = 'visitor-photos' and exists (
      select 1 from public.visitor_photos p where p.object_path = storage.objects.name
        and (p.status = 'published' or p.owner_id = (select auth.uid()) or (select private.is_admin()))
    )) or (bucket_id = 'request-documents' and (select private.is_admin()) and exists (
      select 1 from public.discount_requests d
      where d.attachment_path = storage.objects.name and d.submission_status = 'received'
    ))
  );
