import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/faculty")({ component: FacultyAdmin });

type F = { id: string; name: string; position: string | null; department: string | null; bio: string | null; avatar_url: string | null; email: string | null; linkedin_url: string | null; status: "draft" | "published"; publish_at: string | null; sort_order: number };
const defaults: Partial<F> = { name: "", position: "", department: "", bio: "", avatar_url: null, email: "", linkedin_url: "", status: "draft", publish_at: null, sort_order: 0 };

function FacultyAdmin() {
  const { list, save, remove, reorder } = useCmsTable<F>("faculty");
  const ed = useEditorState<Partial<F>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { await save({ ...ed.value }); ed.setOpen(false); } finally { setBusy(false); } };

  return (
    <div className="space-y-6">
      <SectionHeader title="Faculty" description="Faculty advisors and academic mentors." action={<NewButton onClick={ed.openNew} label="New faculty" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(f) => (
          <div className="flex items-center gap-4">
            <div className="glass h-12 w-12 shrink-0 overflow-hidden rounded-full">
              {f.avatar_url ? <img src={f.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-sm">{f.name[0]}</div>}
            </div>
            <div className="min-w-0 flex-1">
              <StatusBadge status={f.status} publishAt={f.publish_at} />
              <h3 className="mt-0.5 truncate text-sm font-medium">{f.name}</h3>
              <p className="truncate text-[11px] text-muted-foreground">{f.position} · {f.department}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(f)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${f.name}?`) && remove(f.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No faculty yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit faculty" : "New faculty"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Photo"><ImageUpload value={ed.value.avatar_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, avatar_url: url })} folder="faculty" aspect="aspect-square" /></Field>
          <Field label="Name"><Input required value={ed.value.name ?? ""} onChange={(e) => ed.setValue({ ...ed.value, name: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Position"><Input value={ed.value.position ?? ""} onChange={(e) => ed.setValue({ ...ed.value, position: e.target.value })} /></Field>
            <Field label="Department"><Input value={ed.value.department ?? ""} onChange={(e) => ed.setValue({ ...ed.value, department: e.target.value })} /></Field>
          </div>
          <Field label="Bio"><Textarea rows={4} value={ed.value.bio ?? ""} onChange={(e) => ed.setValue({ ...ed.value, bio: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><Input type="email" value={ed.value.email ?? ""} onChange={(e) => ed.setValue({ ...ed.value, email: e.target.value })} /></Field>
            <Field label="LinkedIn"><Input value={ed.value.linkedin_url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, linkedin_url: e.target.value })} /></Field>
          </div>
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
