import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Calendar, MapPin } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { RichEditor } from "@/components/admin/RichEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/events")({ component: EventsAdmin });

type Event = {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  tag: string | null;
  status: "draft" | "published";
  publish_at: string | null;
  sort_order: number;
};

const defaults: Partial<Event> = {
  title: "", slug: "", summary: "", description: "", cover_url: null,
  location: "", starts_at: "", ends_at: "", tag: "",
  status: "draft", publish_at: null, sort_order: 0,
};

function EventsAdmin() {
  const { list, save, remove, reorder } = useCmsTable<Event>("events");
  const ed = useEditorState<Partial<Event>>(defaults);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...ed.value };
      // Normalize empty strings to null for date columns
      if (payload.starts_at === "") payload.starts_at = null;
      if (payload.ends_at === "") payload.ends_at = null;
      if (payload.publish_at === "") payload.publish_at = null;
      if (payload.slug === "") payload.slug = null;
      await save(payload);
      ed.setOpen(false);
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  const toDatetimeLocal = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const off = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - off).toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Events"
        description="Workshops, hackathons, and public talks — draft, schedule, and publish."
        action={<NewButton onClick={ed.openNew} label="New event" />}
      />

      {list.data && list.data.length > 0 ? (
        <SortableList
          items={list.data}
          onReorder={reorder}
          renderItem={(ev) => (
            <div className="flex items-center gap-4">
              <div className="glass hidden h-16 w-24 shrink-0 overflow-hidden rounded-xl sm:block">
                {ev.cover_url ? <img src={ev.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={ev.status} publishAt={ev.publish_at} />
                  {ev.tag && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{ev.tag}</span>}
                </div>
                <h3 className="mt-1 truncate text-sm font-medium">{ev.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  {ev.starts_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(ev.starts_at).toLocaleDateString()}</span>}
                  {ev.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => ed.openEdit(ev)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => confirm(`Delete "${ev.title}"?`) && remove(ev.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="glass grid place-items-center rounded-3xl p-16 text-center">
          <p className="text-sm text-muted-foreground">No events yet. Create your first one.</p>
        </div>
      )}

      <EditorSheet
        open={ed.open}
        onClose={() => ed.setOpen(false)}
        title={ed.value.id ? "Edit event" : "New event"}
        footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}
      >
        <form id="event-form" onSubmit={onSubmit} className="space-y-4">
          <Field label="Cover image">
            <ImageUpload value={ed.value.cover_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, cover_url: url })} folder="events" />
          </Field>
          <Field label="Title">
            <Input required value={ed.value.title ?? ""} onChange={(e) => ed.setValue({ ...ed.value, title: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tag"><Input placeholder="Workshop, Talk, Hackathon…" value={ed.value.tag ?? ""} onChange={(e) => ed.setValue({ ...ed.value, tag: e.target.value })} /></Field>
            <Field label="Location"><Input value={ed.value.location ?? ""} onChange={(e) => ed.setValue({ ...ed.value, location: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts at"><Input type="datetime-local" value={toDatetimeLocal(ed.value.starts_at)} onChange={(e) => ed.setValue({ ...ed.value, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></Field>
            <Field label="Ends at"><Input type="datetime-local" value={toDatetimeLocal(ed.value.ends_at)} onChange={(e) => ed.setValue({ ...ed.value, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></Field>
          </div>
          <Field label="Summary" hint="Shown in event cards.">
            <Textarea rows={2} value={ed.value.summary ?? ""} onChange={(e) => ed.setValue({ ...ed.value, summary: e.target.value })} />
          </Field>
          <Field label="Description">
            <RichEditor value={ed.value.description ?? ""} onChange={(v) => ed.setValue({ ...ed.value, description: v })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <Select value={ed.value.status ?? "draft"} onChange={(e) => ed.setValue({ ...ed.value, status: e.target.value as "draft" | "published" })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Field>
            <Field label="Publish at" hint="Leave blank to publish immediately (when status is Published).">
              <Input type="datetime-local" value={toDatetimeLocal(ed.value.publish_at)} onChange={(e) => ed.setValue({ ...ed.value, publish_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </Field>
          </div>
        </form>
      </EditorSheet>
    </div>
  );
}
