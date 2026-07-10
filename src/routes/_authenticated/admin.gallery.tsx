import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/gallery")({ component: GalleryAdmin });

type Item = { id: string; title: string; image_url: string | null; gradient: string | null; height: number; captured_on: string | null; status: "draft" | "published"; publish_at: string | null; sort_order: number };
const defaults: Partial<Item> = { title: "", image_url: null, gradient: "linear-gradient(135deg,#7DD3FC,#3B6FE0)", height: 280, captured_on: null, status: "draft", publish_at: null, sort_order: 0 };

function GalleryAdmin() {
  const { list, save, remove, reorder } = useCmsTable<Item>("gallery_items");
  const ed = useEditorState<Partial<Item>>(defaults);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const payload = { ...ed.value };
      if (payload.captured_on === "") payload.captured_on = null;
      await save(payload);
      ed.setOpen(false);
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery" description="Photos, screenshots, and behind-the-scenes shots." action={<NewButton onClick={ed.openNew} label="Add photo" />} />

      {list.data && list.data.length > 0 ? (
        <SortableList items={list.data} onReorder={reorder} renderItem={(it) => (
          <div className="flex items-center gap-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl" style={{ background: it.gradient ?? undefined }}>
              {it.image_url && <img src={it.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <StatusBadge status={it.status} publishAt={it.publish_at} />
              <h3 className="mt-1 truncate text-sm font-medium">{it.title}</h3>
              <p className="text-[11px] text-muted-foreground">Height: {it.height}px{it.captured_on && ` · ${it.captured_on}`}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => ed.openEdit(it)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => confirm(`Delete ${it.title}?`) && remove(it.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )} />
      ) : <div className="glass grid place-items-center rounded-3xl p-16 text-center"><p className="text-sm text-muted-foreground">No photos yet.</p></div>}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit photo" : "New photo"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Image"><ImageUpload value={ed.value.image_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, image_url: url })} folder="gallery" /></Field>
          <Field label="Caption"><Input required value={ed.value.title ?? ""} onChange={(e) => ed.setValue({ ...ed.value, title: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card height (px)"><Input type="number" min={180} max={480} value={ed.value.height ?? 280} onChange={(e) => ed.setValue({ ...ed.value, height: parseInt(e.target.value || "280", 10) })} /></Field>
            <Field label="Captured on"><Input type="date" value={ed.value.captured_on ?? ""} onChange={(e) => ed.setValue({ ...ed.value, captured_on: e.target.value || null })} /></Field>
          </div>
          <Field label="Fallback gradient" hint="Used if no image is uploaded."><Input value={ed.value.gradient ?? ""} onChange={(e) => ed.setValue({ ...ed.value, gradient: e.target.value })} /></Field>
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
