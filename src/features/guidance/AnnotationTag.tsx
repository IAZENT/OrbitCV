interface Props {
  kind: "good" | "bad";
  children: React.ReactNode;
}

export function AnnotationTag({ kind, children }: Props) {
  const isGood = kind === "good";
  return (
    <span
      className={`ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 align-middle text-[10px] font-medium whitespace-nowrap ${
        isGood ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
      }`}
    >
      {isGood ? "✓" : "✕"} {children}
    </span>
  );
}
