import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/hero-stats")({ component: HeroStatsAdmin });

type S = { id: string; label: string; value: number; suffix: string | null; visible: boolean; sort_order: number };
const defaults: Partial<S> = { label: "", value: 0, suffix: "", visible: true, sort_order: 0 };

function HeroStatsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<S>("hero_stats");
  const ed = useEditorState<Partial<S>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); try { await save({ ...ed.value }); ed.setOpen(false); } finally { setBusy(false); } };
  const toggleVisible = async (s: S) => save({ id: s.id, visible: !s.visible } as Partial<S>);

  return (
    <div className="space-y-6">
      <SectionHeader title="Hero statistics" description="Numbers shown in the hero section — members, projects, certifications, etc." action={<NewButton onClick={ed.openNew} label="New stat" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(s) => (
          <div className="flex items-center gap-4">
            <div className="glass grid h-14 w-20 shrink-0 place-items-center rounded-xl">
              <div className="text-lg font-semibold tabular-nums">{s.value}{s.suffix}</div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium">{s.label}</h3>
              <p className="text-[11px] text-muted-foreground">{s.visible ? "Visible" : "Hidden"}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleVisible(s)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">{s.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
              <button onClick={() => ed.openEdit(s)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${s.label}?`) && remove(s.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No stats yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit stat" : "New stat"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Label"><Input required value={ed.value.label ?? ""} onChange={(e) => ed.setValue({ ...ed.value, label: e.target.value })} placeholder="Active members" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Value"><Input type="number" required value={ed.value.value ?? 0} onChange={(e) => ed.setValue({ ...ed.value, value: parseFloat(e.target.value || "0") })} /></Field>
            <Field label="Suffix" hint="+, %, k, M …"><Input value={ed.value.suffix ?? ""} onChange={(e) => ed.setValue({ ...ed.value, suffix: e.target.value })} /></Field>
          </div>
          <label className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
            <input type="checkbox" checked={!!ed.value.visible} onChange={(e) => ed.setValue({ ...ed.value, visible: e.target.checked })} />
            Visible on site
          </label>
        </form>
      </EditorSheet>
    </div>
  );
}
