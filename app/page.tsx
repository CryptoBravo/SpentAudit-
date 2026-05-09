import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-24 sm:py-28">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--sage-strong)] uppercase">Spent Memo</p>
        <h1 className="mt-10 text-[2.125rem] leading-[1.12] tracking-[-0.02em] text-[var(--forest)] sm:text-5xl">
          Financial clarity without obsessive budgeting.
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-[var(--ink)] opacity-95">
          The Spent Audit is a positioning pass — balances, runway, deployment, debt pressure — distilled into language you
          do not need a finance influencer to decipher.
        </p>
        <p className="mt-8 text-[16px] leading-relaxed text-[var(--muted)]">
          About seven deliberate minutes. A placement. One humane next step. Printable when you&apos;re finished.
        </p>
        <div className="mt-14">
          <Link
            className="inline-flex rounded-[2px] bg-[var(--forest)] px-8 py-[14px] font-mono text-[13px] tracking-[0.12em] text-white uppercase no-underline"
            href="/audit"
          >
            Begin the Audit
          </Link>
        </div>
        <footer className="mt-24 border-t border-[var(--line)] pt-10 text-[13px] leading-relaxed text-[var(--muted)]">
          <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">Privacy</p>
          <p className="mt-4 max-w-lg">
            The audit runs in your browser session. Numbers you submit are yours to steward — route them through newsletter
            sign-up only if you want pacing content that respects where you landed.
          </p>
        </footer>
      </main>
    </div>
  );
}
