
-- Storage policies for the private "cms" bucket: public read + admin write
CREATE POLICY "cms public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'cms');
CREATE POLICY "cms admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "cms admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "cms admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms' AND public.has_role(auth.uid(), 'admin'));

-- Lock down function execute privileges (security linter warnings)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Set search_path on the plain trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
