import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Pin } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { RichEditor } from "@/components/admin/RichEditor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/announcements")({ component: AnnouncementsAdmin });

type N = { id: string; title: string; body: string | null; kind: string; pinned: boolean; expires_at: string | null; status: "draft" | "published"; publish_at: string | null; sort_order: number };
const defaults: Partial<N> = { title: "", body: "", kind: "info", pinned: false, expires_at: null, status: "draft", publish_at: null, sort_order: 0 };

const toDT = (iso?: string | null) => { if (!iso) return ""; const d = new Date(iso); const off = d.getTimezoneOffset() * 60000; return new Date(d.getTime() - off).toISOString().slice(0, 16); };

function AnnouncementsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<N>("announcements");
  const ed = useEditorState<Partial<N>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await save({ ...ed.value }); ed.setOpen(false); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Notices & Announcements" description="Time-sensitive messages shown across the site." action={<NewButton onClick={ed.openNew} label="New announcement" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(a) => (
          <div className="flex items-center gap-4">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${a.kind === "warn" ? "bg-amber-500/15 text-amber-300" : "bg-cyan-500/15 text-cyan-300"}`}>
              {a.pinned ? <Pin className="h-4 w-4" /> : <span className="text-xs uppercase">{a.kind[0]}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><StatusBadge status={a.status} publishAt={a.publish_at} /><span className="text-[10px] uppercase tracking-widest text-muted-foreground">{a.kind}</span></div>
              <h3 className="mt-1 truncate text-sm font-medium">{a.title}</h3>
              {a.expires_at && <p className="text-[11px] text-muted-foreground">Expires {new Date(a.expires_at).toLocaleDateString()}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(a)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${a.title}?`) && remove(a.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No announcements yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit announcement" : "New announcement"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title"><Input required value={ed.value.title ?? ""} onChange={(e) => ed.setValue({ ...ed.value, title: e.target.value })} /></Field>
          <Field label="Body"><RichEditor value={ed.value.body ?? ""} onChange={(v) => ed.setValue({ ...ed.value, body: v })} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Kind">
              <Select value={ed.value.kind ?? "info"} onChange={(e) => ed.setValue({ ...ed.value, kind: e.target.value })}>
                <option value="info">Info</option><option value="warn">Warning</option><option value="success">Success</option>
              </Select>
            </Field>
            <Field label="Publish at"><Input type="datetime-local" value={toDT(ed.value.publish_at)} onChange={(e) => ed.setValue({ ...ed.value, publish_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></Field>
            <Field label="Expires at"><Input type="datetime-local" value={toDT(ed.value.expires_at)} onChange={(e) => ed.setValue({ ...ed.value, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
              <input type="checkbox" checked={!!ed.value.pinned} onChange={(e) => ed.setValue({ ...ed.value, pinned: e.target.checked })} />
              Pin to top
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
