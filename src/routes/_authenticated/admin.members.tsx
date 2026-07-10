import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { SectionHeader, NewButton, SaveButton, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { EditorSheet } from "@/components/admin/EditorSheet";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SortableList } from "@/components/admin/SortableList";
import { useCmsTable, useEditorState } from "@/lib/useCmsTable";

export const Route = createFileRoute("/_authenticated/admin/members")({ component: MembersAdmin });

type Member = {
  id: string; name: string; role_label: string; position: string | null; bio: string | null;
  avatar_url: string | null; skills: string[]; linkedin_url: string | null; github_url: string | null;
  email: string | null; hue: number; status: "draft" | "published"; publish_at: string | null; sort_order: number;
};

const defaults: Partial<Member> = {
  name: "", role_label: "Core", position: "", bio: "", avatar_url: null,
  skills: [], linkedin_url: "", github_url: "", email: "", hue: 210,
  status: "draft", publish_at: null, sort_order: 0,
};

function MembersAdmin() {
  const { list, save, remove, reorder } = useCmsTable<Member>("members");
  const ed = useEditorState<Partial<Member>>(defaults);
  const [busy, setBusy] = useState(false);
  const [skillsRaw, setSkillsRaw] = useState("");

  const openNew = () => { ed.openNew(); setSkillsRaw(""); };
  const openEdit = (m: Member) => { ed.openEdit(m); setSkillsRaw((m.skills ?? []).join(", ")); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const skills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = { ...ed.value, skills };
      if (payload.publish_at === "") payload.publish_at = null;
      await save(payload);
      ed.setOpen(false);
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Members" description="Students, mentors, and faculty listed on the site." action={<NewButton onClick={openNew} label="New member" />} />

      {list.data && list.data.length > 0 ? (
        <SortableList
          items={list.data}
          onReorder={reorder}
          renderItem={(m) => (
            <div className="flex items-center gap-4">
              <div className="glass hidden h-12 w-12 shrink-0 overflow-hidden rounded-full sm:block">
                {m.avatar_url ? <img src={m.avatar_url} alt="" className="h-full w-full object-cover" /> : (
                  <div className="grid h-full w-full place-items-center text-sm font-semibold" style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 62%), hsl(${(m.hue + 25) % 360} 70% 55%))` }}>
                    {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><StatusBadge status={m.status} publishAt={m.publish_at} /><span className="text-[10px] uppercase tracking-widest text-cyan-brand">{m.role_label}</span></div>
                <h3 className="mt-0.5 truncate text-sm font-medium">{m.name}</h3>
                <p className="truncate text-[11px] text-muted-foreground">{m.position}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(m)} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => confirm(`Delete ${m.name}?`) && remove(m.id)} className="glass grid h-8 w-8 place-items-center rounded-full text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        />
      ) : <EmptyState onNew={openNew} label="No members yet." />}

      <EditorSheet open={ed.open} onClose={() => ed.setOpen(false)} title={ed.value.id ? "Edit member" : "New member"} footer={<div className="flex justify-end"><SaveButton busy={busy} /></div>}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Avatar"><ImageUpload value={ed.value.avatar_url ?? null} onChange={(url) => ed.setValue({ ...ed.value, avatar_url: url })} folder="members" aspect="aspect-square" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input required value={ed.value.name ?? ""} onChange={(e) => ed.setValue({ ...ed.value, name: e.target.value })} /></Field>
            <Field label="Role">
              <Select value={ed.value.role_label ?? "Core"} onChange={(e) => ed.setValue({ ...ed.value, role_label: e.target.value })}>
                <option>Lead</option><option>Core</option><option>Mentor</option><option>Faculty</option>
              </Select>
            </Field>
          </div>
          <Field label="Position"><Input value={ed.value.position ?? ""} onChange={(e) => ed.setValue({ ...ed.value, position: e.target.value })} /></Field>
          <Field label="Skills" hint="Comma-separated."><Input value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} placeholder="AWS, Kubernetes, Terraform" /></Field>
          <Field label="Short bio"><Textarea rows={3} value={ed.value.bio ?? ""} onChange={(e) => ed.setValue({ ...ed.value, bio: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL"><Input value={ed.value.linkedin_url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, linkedin_url: e.target.value })} /></Field>
            <Field label="GitHub URL"><Input value={ed.value.github_url ?? ""} onChange={(e) => ed.setValue({ ...ed.value, github_url: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><Input type="email" value={ed.value.email ?? ""} onChange={(e) => ed.setValue({ ...ed.value, email: e.target.value })} /></Field>
            <Field label="Avatar hue (0-359)"><Input type="number" min={0} max={359} value={ed.value.hue ?? 210} onChange={(e) => ed.setValue({ ...ed.value, hue: parseInt(e.target.value || "210", 10) })} /></Field>
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

function EmptyState({ onNew, label }: { onNew: () => void; label: string }) {
  return (
    <div className="glass grid place-items-center rounded-3xl p-16 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <button onClick={onNew} className="mt-3 text-xs text-cyan-brand hover:underline">Create one →</button>
    </div>
  );
}
