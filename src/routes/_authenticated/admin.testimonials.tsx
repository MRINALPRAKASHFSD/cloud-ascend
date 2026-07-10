import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({ component: TestimonialsAdmin });

type T = { id: string; author: string; author_role: string | null; quote: string; avatar_url: string | null; status: "draft" | "published"; publish_at: string | null; sort_order: number };
const defaults: Partial<T> = { author: "", author_role: "", quote: "", avatar_url: null, status: "draft", publish_at: null, sort_order: 0 };

function TestimonialsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<T>("testimonials");
  const ed = useEditorState<Partial<T>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { await save({ ...ed.value }); ed.setOpen(false); } finally { setBusy(false); } };

  return (
    <div className="space-y-6">
      <SectionHeader title="Testimonials" description="Voices from members, mentors, and partners." action={<NewButton onClick={ed.openNew} label="New testimonial" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(t) => (
          <div className="flex items-center gap-4">
            <div className="glass h-10 w-10 shrink-0 overflow-hidden rounded-full">
              {t.avatar_url ? <img src={t.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xs">{t.author[0]}</div>}
            </div>
            <div className="min-w-0 flex-1">
              <StatusBadge status={t.status} publishAt={t.publish_at} />
              <h3 className="mt-0.5 truncate text-sm font-medium">{t.author} <span className="text-muted-foreground">— {t.author_role}</span></h3>
              <p className="truncate text-[11px] italic text-muted-foreground">"{t.quote}"</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(t)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete testimonial from ${t.author}?`) && remove(t.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No testimonials yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit testimonial" : "New testimonial"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Avatar"><ImageUpload value={ed.value.avatar_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, avatar_url: url })} folder="testimonials" aspect="aspect-square" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author"><Input required value={ed.value.author ?? ""} onChange={(e) => ed.setValue({ ...ed.value, author: e.target.value })} /></Field>
            <Field label="Author role"><Input value={ed.value.author_role ?? ""} onChange={(e) => ed.setValue({ ...ed.value, author_role: e.target.value })} /></Field>
          </div>
          <Field label="Quote"><Textarea rows={4} required value={ed.value.quote ?? ""} onChange={(e) => ed.setValue({ ...ed.value, quote: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={ed.value.status ?? "draft"} onChange={(e) => ed.setValue({ ...ed.value, status: e.target.value as "draft" | "published" })}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </Select>
          </Field>
        </form>
      </EditorSheet>
    </div>
  );
}
