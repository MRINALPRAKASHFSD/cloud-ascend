import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  aspect?: string; // e.g. "aspect-video"
}

export function ImageUpload({ value, onChange, folder = "misc", aspect = "aspect-video" }: ImageUploadProps) {
  const [busy, setBusy] = useState(false);

  const onFile = useCallback(async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("cms").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("cms").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }, [folder, onChange]);

  return (
    <div className={`glass relative overflow-hidden rounded-2xl ${aspect} w-full`}>
      {value ? (
        <>
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="glass-strong absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : (
        <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span>{busy ? "Uploading…" : "Upload image"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </label>
      )}
    </div>
  );
}
