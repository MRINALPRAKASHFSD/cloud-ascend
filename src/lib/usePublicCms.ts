import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Shared query defaults for all public CMS reads.
// - Cache aggressively so navigation is instant.
// - `placeholderData` = hardcoded fallback → zero layout shift; when DB
//   returns data or the request errors we swap to real data / keep fallback.
const QUERY_DEFAULTS = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  refetchOnWindowFocus: false,
  retry: 1,
} as const;

function usePublicList<T>(table: string, order: { column: string; ascending?: boolean }[], fallback: T[]) {
  const q = useQuery<T[]>({
    queryKey: ["public", table],
    queryFn: async () => {
      let query = supabase.from(table as never).select("*");
      for (const o of order) query = query.order(o.column, { ascending: o.ascending ?? true });
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as T[];
    },
    ...QUERY_DEFAULTS,
    placeholderData: fallback,
  });
  const data = (q.data && q.data.length > 0 ? q.data : fallback) as T[];
  return {
    data,
    isLoading: q.isLoading,
    isError: q.isError,
    isFallback: !q.data || q.data.length === 0,
    isEmpty: !q.isLoading && !q.isError && (q.data?.length ?? 0) === 0,
  };
}

// ---------- Events ----------
export type PublicEvent = {
  id: string;
  title: string;
  summary: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  tag: string | null;
  sort_order: number;
};
export function usePublicEvents(fallback: PublicEvent[]) {
  return usePublicList<PublicEvent>("events", [
    { column: "sort_order", ascending: true },
    { column: "starts_at", ascending: true },
  ], fallback);
}

// ---------- Members ----------
export type PublicMember = {
  id: string;
  name: string;
  role_label: string;
  position: string | null;
  skills: string[];
  hue: number;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  avatar_url: string | null;
};
export function usePublicMembers(fallback: PublicMember[]) {
  return usePublicList<PublicMember>("members", [{ column: "sort_order" }], fallback);
}

// ---------- Projects ----------
export type PublicProject = {
  id: string;
  title: string;
  category: string;
  lifecycle: string;
  description: string | null;
  stack: string[];
  gradient: string | null;
  featured: boolean;
  github_url: string | null;
  website_url: string | null;
};
export function usePublicProjects(fallback: PublicProject[]) {
  return usePublicList<PublicProject>("projects", [{ column: "sort_order" }], fallback);
}

// ---------- Gallery ----------
export type PublicGalleryItem = {
  id: string;
  title: string;
  image_url: string | null;
  gradient: string | null;
  height: number;
};
export function usePublicGallery(fallback: PublicGalleryItem[]) {
  return usePublicList<PublicGalleryItem>("gallery_items", [{ column: "sort_order" }], fallback);
}

// ---------- Achievements ----------
export type PublicAchievement = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  metric_value: string | null;
  metric_label: string | null;
  awarded_on: string | null;
};
export function usePublicAchievements(fallback: PublicAchievement[]) {
  return usePublicList<PublicAchievement>("achievements", [{ column: "sort_order" }], fallback);
}

// ---------- Testimonials ----------
export type PublicTestimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar_url: string | null;
};
export function usePublicTestimonials(fallback: PublicTestimonial[]) {
  return usePublicList<PublicTestimonial>("testimonials", [{ column: "sort_order" }], fallback);
}

// ---------- Hero Stats ----------
export type PublicHeroStat = {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  sort_order: number;
};
export function usePublicHeroStats(fallback: PublicHeroStat[]) {
  const q = useQuery<PublicHeroStat[]>({
    queryKey: ["public", "hero_stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_stats").select("*").eq("visible", true).order("sort_order");
      if (error) throw error;
      return (data ?? []) as PublicHeroStat[];
    },
    ...QUERY_DEFAULTS,
    placeholderData: fallback,
  });
  return {
    data: (q.data && q.data.length > 0 ? q.data : fallback) as PublicHeroStat[],
    isLoading: q.isLoading,
    isError: q.isError,
  };
}

// ---------- Contact Info (singleton) ----------
export type PublicContactInfo = {
  email: string | null;
  phone: string | null;
  address: string | null;
  map_url: string | null;
  hours: string | null;
  socials: Record<string, string>;
};
export function usePublicContactInfo(fallback: PublicContactInfo) {
  const q = useQuery<PublicContactInfo>({
    queryKey: ["public", "contact_info"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      if (!data) return fallback;
      return {
        email: data.email,
        phone: data.phone,
        address: data.address,
        map_url: data.map_url,
        hours: data.hours,
        socials: (data.socials as Record<string, string>) ?? {},
      };
    },
    ...QUERY_DEFAULTS,
    placeholderData: fallback,
  });
  const hasReal = q.data && (q.data.email || q.data.phone || q.data.address);
  return { data: (hasReal ? q.data! : fallback), isLoading: q.isLoading, isError: q.isError };
}

// ---------- Footer Links ----------
export type PublicFooterLink = {
  id: string;
  section: string;
  label: string;
  url: string;
  external: boolean;
  sort_order: number;
};
export function usePublicFooterLinks(fallback: PublicFooterLink[]) {
  const q = useQuery<PublicFooterLink[]>({
    queryKey: ["public", "footer_links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_links")
        .select("*")
        .eq("visible", true)
        .order("section")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as PublicFooterLink[];
    },
    ...QUERY_DEFAULTS,
    placeholderData: fallback,
  });
  const data = (q.data && q.data.length > 0 ? q.data : fallback) as PublicFooterLink[];
  return { data, isLoading: q.isLoading, isError: q.isError };
}
