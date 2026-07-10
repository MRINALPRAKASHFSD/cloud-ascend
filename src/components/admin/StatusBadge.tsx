export function StatusBadge({ status, publishAt }: { status: string; publishAt?: string | null }) {
  const scheduled = status === "published" && publishAt && new Date(publishAt) > new Date();
  const label = scheduled ? "Scheduled" : status === "published" ? "Live" : "Draft";
  const cls = scheduled
    ? "bg-amber-500/15 text-amber-300 ring-amber-400/30"
    : status === "published"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
      : "bg-white/5 text-muted-foreground ring-white/10";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest ring-1 ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
