import { cn } from "@/lib/utils";

export function Sheet({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] bg-[var(--tf-sheet)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
