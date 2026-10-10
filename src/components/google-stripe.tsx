/** Careful multicolour accent — Google-inspired, not affiliation. */
export function GoogleStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex h-1 w-full overflow-hidden ${className}`}
    >
      <span className="flex-1 bg-[var(--tf-g-blue)]" />
      <span className="flex-1 bg-[var(--tf-g-red)]" />
      <span className="flex-1 bg-[var(--tf-g-yellow)]" />
      <span className="flex-1 bg-[var(--tf-g-green)]" />
    </div>
  );
}
