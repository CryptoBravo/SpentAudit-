"use client";

import { getWealthStep } from "@/config/wealthSteps";
import { REGIONS } from "@/config/regions";
import type { AuditFormState } from "@/types/audit";
import { deriveAuditResult } from "@/utils/auditResult";
import { deriveStrengthWeakness } from "@/utils/insights";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useAnalytics } from "@/hooks/useAnalytics";
import { FooterNav } from "@/components/audit/formPrimitives";
import { useMemo, useState } from "react";

interface AuditResultsProps {
  data: AuditFormState;
  onBack: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuditResults({ data, onBack }: AuditResultsProps) {
  const model = useMemo(() => deriveAuditResult(data), [data]);
  const content = getWealthStep(model.step);
  const sw = deriveStrengthWeakness(model.calc, content);

  const { track } = useAnalytics();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailOk, setEmailOk] = useState(false);

  const currency = data.currency || "USD";
  const fmt = (value: number) =>
    `${Math.round(value).toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
  const region = REGIONS.find((r) => r.id === data.region);

  const savingsWarn = !["Strong", "Building"].includes(model.savingsBenchmark);
  const runwayWarn = !["Secure", "Resilient"].includes(model.runwayBenchmark);

  async function handleEmail() {
    setEmailError(undefined);
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailBusy(true);
    try {
      const trimmedEmail = email.trim();

      try {
        const supabase = getSupabaseBrowserClient();
        const { error: insertError } = await supabase.from("audit_submissions").insert({
          email: trimmedEmail,
          wealth_step: content.slug,
          region: data.region || "unknown",
          source: "audit",
          answers_json: data,
          calculated_metrics_json: model.calc,
        });

        if (insertError) {
          console.error("[audit_submissions.insert] failed", insertError);
          setEmailError("Could not save yet. Try again.");
          return;
        }
      } catch (err) {
        console.error("[audit_submissions.insert] threw", err);
        setEmailError("Could not save yet. Try again.");
        return;
      }

      const sendRes = await fetch("/api/send-audit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          answers: data,
        }),
      });

      const sendJson = (await sendRes.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!sendRes.ok || !sendJson?.ok) {
        console.error("[send-audit-email] failed", sendRes.status, sendJson);
        setEmailError(sendJson?.error ?? "Could not send yet. Try again.");
        return;
      }

      setEmailOk(true);
      track("email_submitted", {
        wealthStep: content.slug,
        region: data.region,
      });
    } finally {
      setEmailBusy(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <div className="audit-no-print mb-10">
        <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-[var(--sage-strong)] uppercase">Your results</p>
      </div>

      <article className="audit-print-root">
        <header className="mb-12 bg-[var(--forest)] px-8 py-10 text-white md:px-10">
          <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-[var(--mint-soft)] uppercase">
            Wealth Build Step {String(model.step).padStart(2, "0")}
          </p>
          <p className="mb-1 text-[13px] font-medium tracking-[0.18em] text-[var(--mint-soft)] uppercase">
            {content.headline}
          </p>
          <h2 className="mb-2 text-4xl tracking-[-0.02em] sm:text-[52px]" style={{ lineHeight: 1.03 }}>
            {content.verb}.
          </h2>
          <p className="mt-6 max-w-prose text-lg italic leading-snug text-[#c9ddd4]">“{content.identity}”</p>
        </header>

        <section className="mb-14 border-l-4 border-[var(--forest)] bg-[var(--wash)] px-6 py-6 text-[16px] leading-relaxed md:px-8">
          {content.interpretation}
        </section>

        <section className="mb-10 grid gap-5 md:grid-cols-2">
          <div className="border border-[var(--line)] bg-white px-6 py-5">
            <h3 className="mb-2 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">Strength</h3>
            <p className="text-[15px] leading-relaxed">{sw.strength}</p>
          </div>
          <div className="border border-[var(--line)] bg-white px-6 py-5">
            <h3 className="mb-2 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">Friction point</h3>
            <p className="text-[15px] leading-relaxed">{sw.weakness}</p>
          </div>
        </section>

        <section className="space-y-4">
          <MetricRow
            label="Net worth"
            value={fmt(model.calc.netWorth)}
            note={model.pictureComplete ? "Assets − liabilities · snapshot only" : "Complete all steps for a pinned number"}
          />
          <MetricRow
            label="Savings rate"
            value={`${model.calc.savingsRate.toFixed(1)}%`}
            benchmark={`${model.savingsBenchmark.toUpperCase()} VS REGIONAL FLOOR`}
            warn={savingsWarn}
          />
          <MetricRow
            label="Runway"
            value={`${model.calc.runwayMonths.toFixed(1)} months`}
            benchmark={`${model.runwayBenchmark.toUpperCase()} · TARGET ${region?.runwayMonths[0] ?? 3}-${region?.runwayMonths[1] ?? 6} MO`}
            warn={runwayWarn}
          />
          <MetricRow
            label="Liquidity ratio"
            value={`${(model.calc.liquidityRatio * 100).toFixed(1)}%`}
            benchmark="Liquid cash ÷ total assets"
          />

          <div className="border border-[var(--line)] bg-white px-6 py-6">
            <div className="mb-5 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">
              Allocation (excluding liabilities)
            </div>
            <ul className="grid gap-2 font-mono text-[12px] text-[var(--ink)]">
              <AllocationLine label="Cash" value={model.calc.allocation.cash} />
              <AllocationLine label="Investments" value={model.calc.allocation.investments} />
              <AllocationLine label="Retirement" value={model.calc.allocation.retirement} />
              <AllocationLine label="Property" value={model.calc.allocation.property} />
              <AllocationLine label="Business" value={model.calc.allocation.business} />
              <AllocationLine label="Vehicles" value={model.calc.allocation.vehicles} />
              <AllocationLine label="Other" value={model.calc.allocation.other} />
            </ul>
          </div>

          {model.calc.totalDebtExMortgage > 0 ? (
            <MetricRow
              label="Debt velocity (90‑day pulse)"
              value={fmt(model.calc.totalDebtExMortgage)}
              benchmark={`${(model.debtBenchmark ?? "TRACKING").toUpperCase()} · ~${model.debtHoursLife.toLocaleString()} HOURS ALREADY COMMITTED`}
              warn={
                model.calc.debtDirection === "rising" ||
                model.calc.debtDirection === "new" ||
                model.debtBenchmark === "Maintaining"
              }
            />
          ) : null}

          <MetricRow
            label="Deployment rate"
            value={`${model.calc.deploymentRate.toFixed(1)}%`}
            benchmark={model.deploymentBenchmark.toUpperCase()}
            warn={model.calc.deploymentRate <= 0}
          />

          <MetricRow
            label="Real hourly wage"
            value={`${fmt(model.calc.realHourlyWage)}/hr`}
            benchmark={`SPEND EATS ~${model.claimHoursPerMonth.toLocaleString()} HOURS / MO AT THIS RATE`}
          />
        </section>

        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-[var(--sage-strong)] uppercase">Emotional read</p>
          <p className="mb-10 text-[16px] leading-relaxed text-[var(--ink)]">{content.emotionalDiagnosis}</p>

          <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-[var(--sage-strong)] uppercase">One next move</p>
          <p className="mb-10 text-[16px] leading-relaxed text-[var(--ink)]">{content.nextMove}</p>

          <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-[var(--sage-strong)] uppercase">Benchmark positioning</p>
          <p className="mb-8 text-[15px] leading-relaxed italic text-[var(--muted)]">{content.benchmarkPositioning}</p>
        </section>

        <footer className="audit-no-print mb-24 mt-14 border border-[var(--line)] bg-[var(--wash)] px-6 py-6">
          {!emailOk ? (
            <>
              <p className="mb-1 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">
                Receive the full financial audit in your inbox.
              </p>
              <p className="mb-6 text-[15px] leading-relaxed text-[var(--ink)]">
                Enter your email and we&apos;ll send your full audit — verdict, core metrics, and next actions.
              </p>
              <label htmlFor="result-email" className="sr-only">
                Email
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="result-email"
                  type="email"
                  autoComplete="email"
                  className={`flex-1 rounded-[2px] border bg-white px-4 py-3 text-[16px] outline-none focus:ring-1 focus:ring-[var(--mint)] ${emailError ? "border-[var(--clay)]" : "border-[var(--line)]"}`}
                  placeholder="you@domain.com"
                  value={email}
                  disabled={emailBusy}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-err" : undefined}
                />
                <button
                  type="button"
                  disabled={emailBusy}
                  onClick={() => void handleEmail()}
                  className="rounded-[2px] bg-[var(--forest)] px-6 py-[14px] font-mono text-[12px] tracking-[0.12em] text-white uppercase outline-none disabled:opacity-45"
                >
                  {emailBusy ? "Saving…" : "Join"}
                </button>
              </div>
              {emailError ? (
                <p id="email-err" className="mt-2 text-[13px] text-[var(--clay)]">
                  {emailError}
                </p>
              ) : (
                <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">No PDFs yet. Responsive email only.</p>
              )}
            </>
          ) : (
            <p className="text-[16px] text-[var(--sage-strong)]">Sent. Check your inbox for the full audit.</p>
          )}
        </footer>

        <FooterNav
          secondary={{ label: "← Adjust answers", onClick: onBack }}
          primary={{ label: "Print / Save PDF →", onClick: handlePrint }}
        />
      </article>
    </>
  );
}

function MetricRow({
  label,
  value,
  benchmark,
  note,
  warn,
}: {
  label: string;
  value: string;
  benchmark?: string;
  note?: string;
  warn?: boolean;
}) {
  return (
    <div className="border border-[var(--line)] bg-white px-6 py-5">
      <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">{label}</div>
      <div className="mb-2 text-3xl tracking-[-0.02em] text-[var(--forest)]">{value}</div>
      {benchmark ? (
        <div className={`font-mono text-[13px] tracking-[0.05em] ${warn ? "text-[var(--clay)]" : "text-[var(--sage-strong)]"}`}>
          {benchmark}
        </div>
      ) : null}
      {note ? <div className="mt-4 text-[13px] text-[var(--muted)] italic">{note}</div> : null}
    </div>
  );
}

function AllocationLine({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-[var(--forest)]">{value.toFixed(1)}%</span>
    </li>
  );
}
