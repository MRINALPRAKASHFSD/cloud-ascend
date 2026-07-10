import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { SectionHeader, Field, Input, Textarea } from "@/components/admin/ui";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/contact")({ component: ContactAdmin });

type Contact = { email: string; phone: string; address: string; map_url: string; hours: string; socials: Record<string, string> };

function ContactAdmin() {
  const [c, setC] = useState<Contact>({ email: "", phone: "", address: "", map_url: "", hours: "", socials: {} });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [socialsRaw, setSocialsRaw] = useState("");

  useEffect(() => {
    supabase.from("contact_info").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) {
        const socials = (data.socials ?? {}) as Record<string, string>;
        setC({
          email: data.email ?? "", phone: data.phone ?? "", address: data.address ?? "",
          map_url: data.map_url ?? "", hours: data.hours ?? "", socials,
        });
        setSocialsRaw(Object.entries(socials).map(([k, v]) => `${k}=${v}`).join("\n"));
      }
      setLoading(false);
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const socials: Record<string, string> = {};
      socialsRaw.split("\n").forEach((line) => {
        const [k, ...rest] = line.split("=");
        if (k?.trim() && rest.length) socials[k.trim()] = rest.join("=").trim();
      });
      const { error } = await supabase.from("contact_info").update({ ...c, socials }).eq("id", 1);
      if (error) throw error;
      toast.success("Contact info saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader2 className="mx-auto h-6 w-6 animate-spin" />;

  return (
    <div className="space-y-6">
      <SectionHeader title="Contact information" description="Site-wide contact details shown in the footer and contact section." />
      <form onSubmit={onSubmit} className="glass gradient-border space-y-4 rounded-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><Input type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></Field>
        </div>
        <Field label="Address"><Textarea rows={2} value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Map URL (Google Maps)"><Input value={c.map_url} onChange={(e) => setC({ ...c, map_url: e.target.value })} /></Field>
          <Field label="Office hours"><Input value={c.hours} onChange={(e) => setC({ ...c, hours: e.target.value })} placeholder="Mon–Fri · 9am–6pm" /></Field>
        </div>
        <Field label="Social links" hint="One per line, format: platform=https://url">
          <Textarea rows={4} value={socialsRaw} onChange={(e) => setSocialsRaw(e.target.value)} placeholder="linkedin=https://linkedin.com/…&#10;github=https://github.com/…&#10;twitter=https://x.com/…" />
        </Field>
        <div className="flex justify-end">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}
