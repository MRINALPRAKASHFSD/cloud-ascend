import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/projects")({ component: ProjectsAdmin });

type Project = {
  id: string; title: string; slug: string | null; category: string; lifecycle: string;
  description: string | null; cover_url: string | null; gradient: string | null; stack: string[];
  github_url: string | null; website_url: string | null; featured: boolean;
  status: "draft" | "published"; publish_at: string | null; sort_order: number;
};

const defaults: Partial<Project> = {
  title: "", slug: "", category: "Web", lifecycle: "Live", description: "", cover_url: null,
  gradient: "linear-gradient(135deg,#7DD3FC,#3B6FE0)", stack: [], github_url: "", website_url: "",
  featured: false, status: "draft", publish_at: null, sort_order: 0,
};

function ProjectsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<Project>("projects");
  const ed = useEditorState<Partial<Project>>(defaults);
  const [busy, setBusy] = useState(false);
  const [stackRaw, setStackRaw] = useState("");

  const openNew = () => { ed.openNew(); setStackRaw(""); };
  const openEdit = (p: Project) => { ed.openEdit(p); setStackRaw((p.stack ?? []).join(", ")); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const stack = stackRaw.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = { ...ed.value, stack };
      if (payload.slug === "") payload.slug = null;
      if (payload.publish_at === "") payload.publish_at = null;
      await save(payload);
      ed.setOpen(false);
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Projects" description="Everything built by the Center — shipped in the open." action={<NewButton onClick={openNew} label="New project" />} />

      {list.data && list.data.length > 0 ? (
        <SortableList
          items={list.data}
          onReorder={reorder}
          renderItem={(p) => (
            <div className="flex items-center gap-4">
              <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded-xl sm:block" style={{ background: p.gradient ?? undefined }}>
                {p.cover_url && <img src={p.cover_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} publishAt={p.publish_at} />
                  {p.featured && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-amber-300"><Star className="h-3 w-3" />Featured</span>}
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category} · {p.lifecycle}</span>
                </div>
                <h3 className="mt-0.5 truncate text-sm font-medium">{p.title}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => confirm(`Delete ${p.title}?`) && remove(p.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No projects yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit project" : "New project"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Cover image (optional)"><ImageUpload value={ed.value.cover_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, cover_url: url })} folder="projects" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><Input required value={ed.value.title ?? ""} onChange={(e) => ed.setValue({ ...ed.value, title: e.target.value })} /></Field>
            <Field label="Slug"><Input value={ed.value.slug ?? ""} onChange={(e) => ed.setValue({ ...ed.value, slug: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select value={ed.value.category ?? "Web"} onChange={(e) => ed.setValue({ ...ed.value, category: e.target.value })}>
                <option>AI</option><option>Infra</option><option>Web</option><option>Research</option>
              </Select>
            </Field>
            <Field label="Lifecycle">
              <Select value={ed.value.lifecycle ?? "Live"} onChange={(e) => ed.setValue({ ...ed.value, lifecycle: e.target.value })}>
                <option>Live</option><option>Beta</option><option>R&D</option>
              </Select>
            </Field>
          </div>
          <Field label="Description"><Textarea rows={3} value={ed.value.description ?? ""} onChange={(e) => ed.setValue({ ...ed.value, description: e.target.value })} /></Field>
          <Field label="Stack" hint="Comma-separated."><Input value={stackRaw} onChange={(e) => setStackRaw(e.target.value)} placeholder="Next.js, tRPC, Postgres" /></Field>
          <Field label="Gradient CSS"><Input value={ed.value.gradient ?? ""} onChange={(e) => ed.setValue({ ...ed.value, gradient: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub URL"><Input value={ed.value.github_url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, github_url: e.target.value })} /></Field>
            <Field label="Website URL"><Input value={ed.value.website_url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, website_url: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
              <input type="checkbox" checked={!!ed.value.featured} onChange={(e) => ed.setValue({ ...ed.value, featured: e.target.checked })} />
              Featured (spans 2 columns)
            </label>
            <Field label="Status">
              <Select value={ed.value.status ?? "draft"} onChange={(e) => ed.setValue({ ...ed.value, status: e.target.value as "draft" | "published" })}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </Select>
            </Field>
          </div>
        </form>
      </EditorSheet>
    </div>
  );
}
