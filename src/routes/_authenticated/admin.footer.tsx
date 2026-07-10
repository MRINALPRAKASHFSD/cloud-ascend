import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/footer")({ component: FooterAdmin });

type L = { id: string; section: string; label: string; url: string; external: boolean; visible: boolean; sort_order: number };
const defaults: Partial<L> = { section: "Explore", label: "", url: "", external: false, visible: true, sort_order: 0 };

function FooterAdmin() {
  const { list, save, remove, reorder } = useCmsTable<L>("footer_links");
  const ed = useEditorState<Partial<L>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { await save({ ...ed.value }); ed.setOpen(false); } finally { setBusy(false); } };

  return (
    <div className="space-y-6">
      <SectionHeader title="Footer links" description="Links grouped by section in the site footer." action={<NewButton onClick={ed.openNew} label="New link" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(l) => (
          <div className="flex items-center gap-4">
            <span className="glass rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand">{l.section}</span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium">{l.label}</h3>
              <p className="truncate text-[11px] text-muted-foreground">{l.url}</p>
            </div>
            {l.visible ? <Eye className="h-3.5 w-3.5 text-muted-foreground" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(l)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${l.label}?`) && remove(l.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No footer links yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit link" : "New link"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Section">
            <Select value={ed.value.section ?? "Explore"} onChange={(e) => ed.setValue({ ...ed.value, section: e.target.value })}>
              <option>Explore</option><option>Programs</option><option>Community</option><option>Resources</option><option>Legal</option>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label"><Input required value={ed.value.label ?? ""} onChange={(e) => ed.setValue({ ...ed.value, label: e.target.value })} /></Field>
            <Field label="URL"><Input required value={ed.value.url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, url: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
              <input type="checkbox" checked={!!ed.value.external} onChange={(e) => ed.setValue({ ...ed.value, external: e.target.checked })} />
              External (opens in new tab)
            </label>
            <label className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
              <input type="checkbox" checked={!!ed.value.visible} onChange={(e) => ed.setValue({ ...ed.value, visible: e.target.checked })} />
              Visible
            </label>
          </div>
        </form>
      </EditorSheet>
    </div>
  );
}
