import type { ReactNode } from "react";

interface EditorialLayoutProps {
  wordmarkHref?: string;
  step?: { current: number; total: number } | null;
  children: ReactNode;
}

export function EditorialLayout({ wordmarkHref = "/", step, children }: EditorialLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <main className="mx-auto flex min-h-screen max-w-[720px] flex-col px-5 pb-24 pt-10 sm:px-8 md:pb-28 md:pt-12">
        <header className="mb-10 flex items-baseline justify-between border-b border-[var(--line)] pb-4 print:hidden">
          <a
            href={wordmarkHref}
            className="font-mono text-[11px] tracking-[0.18em] text-[var(--sage-strong)] uppercase no-underline"
          >
            Spent Memo
          </a>
          {step ? (
            <span className="font-mono text-[11px] text-[var(--muted)]">
              Step {step.current} / {step.total}
            </span>
          ) : null}
        </header>
        {step ? (
          <div className="mb-8 flex gap-1 print:hidden" role="progressbar" aria-label="Audit progress">
            {Array.from({ length: step.total }, (_, i) => (
              <span
                key={String(i)}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  i < step.current ? "bg-[var(--forest)]" : "bg-[var(--line)]"
                }`}
              />
            ))}
          </div>
        ) : null}
        <div>{children}</div>
      </main>
    </div>
  );
}
