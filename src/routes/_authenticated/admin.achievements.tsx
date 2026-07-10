import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Trophy } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/achievements")({ component: AchievementsAdmin });

type A = { id: string; title: string; description: string | null; icon: string | null; metric_value: string | null; metric_label: string | null; awarded_on: string | null; status: "draft" | "published"; publish_at: string | null; sort_order: number };
const defaults: Partial<A> = { title: "", description: "", icon: "trophy", metric_value: "", metric_label: "", awarded_on: null, status: "draft", publish_at: null, sort_order: 0 };

function AchievementsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<A>("achievements");
  const ed = useEditorState<Partial<A>>(defaults);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const p = { ...ed.value };
      if (p.awarded_on === "") p.awarded_on = null;
      await save(p); ed.setOpen(false);
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Achievements" description="Awards, certifications, and milestones." action={<NewButton onClick={ed.openNew} label="New achievement" />} />
      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(a) => (
          <div className="flex items-center gap-4">
            <div className="glass grid h-12 w-12 shrink-0 place-items-center rounded-xl"><Trophy className="h-4 w-4 text-amber-300" /></div>
            <div className="min-w-0 flex-1">
              <StatusBadge status={a.status} publishAt={a.publish_at} />
              <h3 className="mt-1 truncate text-sm font-medium">{a.title}</h3>
              {a.metric_value && <p className="text-[11px] text-muted-foreground">{a.metric_value} {a.metric_label}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(a)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${a.title}?`) && remove(a.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No achievements yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit achievement" : "New achievement"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title"><Input required value={ed.value.title ?? ""} onChange={(e) => ed.setValue({ ...ed.value, title: e.target.value })} /></Field>
          <Field label="Description"><Textarea rows={3} value={ed.value.description ?? ""} onChange={(e) => ed.setValue({ ...ed.value, description: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Metric value" hint="e.g. 150"><Input value={ed.value.metric_value ?? ""} onChange={(e) => ed.setValue({ ...ed.value, metric_value: e.target.value })} /></Field>
            <Field label="Metric label" hint="e.g. certifications issued"><Input value={ed.value.metric_label ?? ""} onChange={(e) => ed.setValue({ ...ed.value, metric_label: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icon name (lucide)"><Input value={ed.value.icon ?? ""} onChange={(e) => ed.setValue({ ...ed.value, icon: e.target.value })} placeholder="trophy, award, star" /></Field>
            <Field label="Awarded on"><Input type="date" value={ed.value.awarded_on ?? ""} onChange={(e) => ed.setValue({ ...ed.value, awarded_on: e.target.value || null })} /></Field>
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
