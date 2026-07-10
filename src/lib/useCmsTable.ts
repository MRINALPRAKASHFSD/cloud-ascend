import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Hook wrapping list-fetch + mutations for a CMS table with sort_order. */
export function useCmsTable<T extends { id: string; sort_order: number }>(table: string) {
  const qc = useQueryClient();
  const list = useQuery<T[]>({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as never).select("*").order("sort_order").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries({ queryKey: ["public", table] });
  };

  const save = async (row: Partial<T> & { id?: string }) => {
    const { id, ...rest } = row;
    if (id) {
      const { error } = await supabase.from(table as never).update(rest as never).eq("id", id);
      if (error) throw error;
      toast.success("Saved");
    } else {
      const { error } = await supabase.from(table as never).insert(rest as never);
      if (error) throw error;
      toast.success("Created");
    }
    invalidate();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(table as never).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    invalidate();
  };

  const reorder = async (ids: string[]) => {
    await Promise.all(ids.map((id, idx) => supabase.from(table as never).update({ sort_order: idx } as never).eq("id", id)));
    invalidate();
  };

  return { list, save, remove, reorder };
}

export function useEditorState<T extends object>(defaults: T) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T>(defaults);
  const openNew = () => { setValue(defaults); setOpen(true); };
  const openEdit = (row: T) => { setValue(row); setOpen(true); };
  return { open, setOpen, value, setValue, openNew, openEdit };
}
