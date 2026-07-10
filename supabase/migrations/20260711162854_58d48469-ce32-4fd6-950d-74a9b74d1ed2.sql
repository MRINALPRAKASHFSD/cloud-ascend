
-- =========================
-- ROLES
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles owner update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles owner insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- SHARED HELPERS
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TYPE public.content_status AS ENUM ('draft', 'published');

-- Helper: an item is "live" when published and its publish_at is null or past
-- Used inline in policies: status = 'published' AND (publish_at IS NULL OR publish_at <= now())

-- =========================
-- EVENTS
-- =========================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  summary TEXT,
  description TEXT,
  cover_url TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  tag TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "events admin all" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- MEMBERS
-- =========================
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_label TEXT NOT NULL DEFAULT 'Core',
  position TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  linkedin_url TEXT,
  github_url TEXT,
  email TEXT,
  hue INT NOT NULL DEFAULT 210,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members public read" ON public.members FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "members admin all" ON public.members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- PROJECTS
-- =========================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'Web',
  lifecycle TEXT NOT NULL DEFAULT 'Live',
  description TEXT,
  cover_url TEXT,
  gradient TEXT,
  stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  website_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects public read" ON public.projects FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "projects admin all" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- GALLERY
-- =========================
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  gradient TEXT,
  height INT NOT NULL DEFAULT 280,
  captured_on DATE,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_items FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "gallery admin all" ON public.gallery_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER gallery_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- ACHIEVEMENTS
-- =========================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  metric_value TEXT,
  metric_label TEXT,
  awarded_on DATE,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON public.achievements FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "achievements admin all" ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- ANNOUNCEMENTS
-- =========================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'info',
  pinned BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements public read" ON public.announcements FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()) AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "announcements admin all" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- TESTIMONIALS
-- =========================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  author_role TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "testimonials admin all" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- HERO STATS
-- =========================
CREATE TABLE public.hero_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  suffix TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_stats TO authenticated;
GRANT ALL ON public.hero_stats TO service_role;
ALTER TABLE public.hero_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero_stats public read" ON public.hero_stats FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "hero_stats admin all" ON public.hero_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER hero_stats_updated_at BEFORE UPDATE ON public.hero_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- FACULTY
-- =========================
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faculty TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty TO authenticated;
GRANT ALL ON public.faculty TO service_role;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faculty public read" ON public.faculty FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "faculty admin all" ON public.faculty FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- CONTACT INFO (singleton)
-- =========================
CREATE TABLE public.contact_info (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email TEXT,
  phone TEXT,
  address TEXT,
  map_url TEXT,
  hours TEXT,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact public read" ON public.contact_info FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "contact admin all" ON public.contact_info FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.contact_info (id) VALUES (1) ON CONFLICT DO NOTHING;

-- =========================
-- FOOTER LINKS
-- =========================
CREATE TABLE public.footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  external BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.footer_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_links TO authenticated;
GRANT ALL ON public.footer_links TO service_role;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "footer public read" ON public.footer_links FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "footer admin all" ON public.footer_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER footer_updated_at BEFORE UPDATE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes for admin ordering
CREATE INDEX ON public.events (sort_order, starts_at DESC);
CREATE INDEX ON public.members (sort_order);
CREATE INDEX ON public.projects (sort_order);
CREATE INDEX ON public.gallery_items (sort_order);
CREATE INDEX ON public.achievements (sort_order);
CREATE INDEX ON public.announcements (pinned DESC, sort_order);
CREATE INDEX ON public.testimonials (sort_order);
CREATE INDEX ON public.hero_stats (sort_order);
CREATE INDEX ON public.faculty (sort_order);
CREATE INDEX ON public.footer_links (section, sort_order);
