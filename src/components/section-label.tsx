type Props = {
  index: string;
  label: string;
  className?: string;
};

/** Moodboard pattern: “01 Hero” muted numbered label */
export function SectionLabel({ index, label, className = "" }: Props) {
  return (
    <p
      className={`text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--ps-meta)] ${className}`}
    >
      <span className="text-[var(--ps-primary)]">{index}</span>
      <span className="mx-2 text-[var(--ps-line)]">·</span>
      {label}
    </p>
  );
}
