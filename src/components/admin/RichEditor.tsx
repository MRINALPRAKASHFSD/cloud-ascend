import { lazy, Suspense } from "react";

const RichEditorImpl = lazy(() =>
  import("./RichEditor.impl").then((m) => ({ default: m.RichEditor }))
);

interface RichEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function RichEditor(props: RichEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="glass rounded-2xl p-4">
          <div className="h-[200px] animate-pulse rounded-xl bg-white/5" />
        </div>
      }
    >
      <RichEditorImpl {...props} />
    </Suspense>
  );
}
