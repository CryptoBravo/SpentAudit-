import { CURRENCIES, REGIONS } from "@/config/regions";
import type {
  AuditFormState,
  FinancialSystems,
  IncomeStability,
  InvestingFrequency,
  Scope,
  StressLevel,
} from "@/types/audit";
import {
  CurrencyInput,
  FieldShell,
  FooterNav,
  H1,
  Lead,
  Overline,
} from "@/components/audit/formPrimitives";
import Link from "next/link";

interface StepProps {
  data: AuditFormState;
  update: (p: Partial<AuditFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  currency?: string;
  nextDisabled?: boolean;
}

export function StepIntro({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Overline>The Spent Audit</Overline>
      <H1>Before we begin.</H1>
      <Lead>
        Most people don&apos;t have a money problem. They have a visibility problem. When you can&apos;t see what your
        paycheck does, changing it stays abstract — and abstracts don&apos;t pay rent.
      </Lead>
      <Lead>
        This takes about seven focused minutes. It asks for real numbers. At the end, you&apos;ll see your financial
        position, where you land on our Wealth Build path, one strength, one friction point, and a single next move
        sized for real life.
      </Lead>
      <aside className="mb-14 border-l-4 border-[var(--sage-strong)] bg-[var(--wash)] px-6 py-5 text-[14px] leading-relaxed">
        <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">
          Before you enter numbers
        </p>
        <p>
          We use your answers to calculate your placement and — if you choose — send follow‑up aligned to where you are.
          We collect only what we need, never sell personal financial data to third‑party advertisers, and you can withdraw
          consent anytime via the unsubscribe link or by emailing{" "}
          <span className="font-mono text-[12px]">support@spentmemo.com</span>.
        </p>
      </aside>
      <FooterNav secondary={undefined} primary={{ label: "Begin the Audit →", onClick: onNext }} />
      <div className="mt-10 text-center print:hidden">
        <Link className="font-mono text-[11px] text-[var(--muted)] underline-offset-4 hover:underline" href="/">
          Back to home
        </Link>
      </div>
    </>
  );
}

export function StepFraming({ data, update, onBack, onNext, nextDisabled }: StepProps) {
  return (
    <>
      <Overline>01 — Framing</Overline>
      <H1>Where you are, and what you&apos;re answering for.</H1>
      <Lead>Three quick framing questions. They calibrate benchmarks and keep the numbers honest to your life.</Lead>

      <FieldShell id="region" label="Region" helper="Answer for where your household primarily spends and holds debt.">
        <select
          id="region"
          className="w-full cursor-pointer rounded-[2px] border border-[var(--line)] bg-white px-[14px] py-3 text-[16px] text-[var(--ink)] outline-none focus:ring-1 focus:ring-[var(--mint)]"
          value={data.region}
          onChange={(e) => update({ region: e.target.value })}
        >
          <option value="">Select region…</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell id="currency" label="Currency" helper="Enter all amounts in this currency. Whole numbers only.">
        <select
          id="currency"
          className="w-full cursor-pointer rounded-[2px] border border-[var(--line)] bg-white px-[14px] py-3 text-[16px] outline-none focus:ring-1 focus:ring-[var(--mint)]"
          value={data.currency}
          onChange={(e) => update({ currency: e.target.value })}
        >
          <option value="">Select currency…</option>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell id="dependents" label="Dependents" helper="People who rely on your income for essentials (0 if none).">
        <CurrencyInput id="dependents" value={data.dependents} onDigitsChange={(v) => update({ dependents: v })} />
      </FieldShell>

      <FieldShell id="scope" label="Household boundary" helper="Which system are you answering for?">
        <RadioGroup
          value={data.scope}
          options={[
            { id: "me" as Scope, label: "Me — my income, obligations, and accounts." },
            {
              id: "shared",
              label: "Me + partner — pooled essentials and debts we share.",
            },
            {
              id: "wider",
              label: "Wider household — shared housing & core costs with family or extended unit.",
            },
          ]}
          onChange={(id) => update({ scope: id })}
          name="scope"
        />
      </FieldShell>

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepIncome({ data, update, currency, onBack, onNext, nextDisabled }: StepProps) {
  return (
    <>
      <Overline>02 — Income & time</Overline>
      <H1>What actually reaches you.</H1>
      <Lead>The real wage is not what you earn. It&apos;s what you keep per hour you give away — after the costs of showing up.</Lead>

      <FieldShell
        id="monthlyIncome"
        label={`Primary monthly take‑home (${currency})`}
        helper="Average after tax & mandatory deductions. If self-employed, use owner draw after taxes and reserves."
      >
        <CurrencyInput
          id="monthlyIncome"
          value={data.monthlyIncome}
          onDigitsChange={(v) => update({ monthlyIncome: v })}
        />
      </FieldShell>

      <FieldShell
        id="householdAdditionalIncome"
        label={`Additional household income (${currency})`}
        helper="Partner or pooled income counted in this audit. Enter 0 if none."
      >
        <CurrencyInput
          id="householdAdditionalIncome"
          value={data.householdAdditionalIncome}
          onDigitsChange={(v) => update({ householdAdditionalIncome: v })}
        />
      </FieldShell>

      <FieldShell
        id="incomeStability"
        label="Income stability"
        helper="Rough truth is enough — irregularity shifts how aggressively we judge margin."
      >
        <RadioGroupInColumn
          name="stability"
          value={data.incomeStability}
          onChange={(v) => update({ incomeStability: v as IncomeStability })}
          options={[
            { id: "stable", label: "Stable — predictable month to month" },
            { id: "uneven", label: "Uneven — swings, but roughly knowable" },
            { id: "unpredictable", label: "Unpredictable — hard to forecast" },
          ]}
        />
      </FieldShell>

      <FieldShell
        id="hours"
        label="Hours given to earning per week"
        helper="Include work, commute, recovery, unpaid admin tied to earning. Most people undercount."
      >
        <CurrencyInput id="hours" value={data.hoursPerWeek} onDigitsChange={(v) => update({ hoursPerWeek: v })} />
      </FieldShell>

      <FieldShell
        id="workExpenses"
        label={`Costs of working (${currency})`}
        helper="Commute, work clothes, work meals you wouldn’t otherwise buy — whole numbers."
      >
        <CurrencyInput id="workExpenses" value={data.workExpenses} onDigitsChange={(v) => update({ workExpenses: v })} />
      </FieldShell>

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepCashFlow({ data, update, currency, onBack, onNext, nextDisabled }: StepProps) {
  const primary = Number.parseInt(data.monthlyIncome.replace(/\D/g, ""), 10) || 0;
  const add = Number.parseInt((data.householdAdditionalIncome || "0").replace(/\D/g, ""), 10) || 0;
  const income = primary + add;

  let derivedRate = "";
  if (income > 0) {
    const workExp = Number.parseInt((data.workExpenses || "0").replace(/\D/g, ""), 10) || 0;
    const adj = Math.max(0, primary - workExp) + add;
    const exp = Number.parseInt((data.monthlyExpenses || "0").replace(/\D/g, ""), 10) || 0;
    derivedRate = (((Math.max(0, adj - exp) / income) * 100).toFixed(1)) + "%";
  }

  return (
    <>
      <Overline>03 — Cash flow</Overline>
      <H1>What flows out after tax.</H1>
      <Lead>This is positioning, not budget theater. Monthly spend is obligations + lifestyle — whichever truth you recognize when you scroll your card feed.</Lead>

      <FieldShell
        id="monthlyExpenses"
        label={`Monthly spending (${currency})`}
        helper="Total predictable month spend: essentials + discretionary living — not investing or extra debt paydown beyond minimums."
      >
        <CurrencyInput
          id="monthlyExpenses"
          value={data.monthlyExpenses}
          onDigitsChange={(v) => update({ monthlyExpenses: v })}
        />
      </FieldShell>

      <FieldShell
        id="savingsAmount"
        label={`Amount you typically save (${currency})`}
        helper="Money that stays in accounts on purpose — not accidentally left over. If unsure, estimate conservatively."
      >
        <CurrencyInput
          id="savingsAmount"
          value={data.savingsAmount}
          onDigitsChange={(v) => update({ savingsAmount: v })}
        />
      </FieldShell>

      {derivedRate ? (
        <p className="mb-10 font-mono text-[12px] text-[var(--muted)]">
          Derived savings rate (from primary income, work costs, and spend):{" "}
          <span className="text-[var(--forest)]">{derivedRate}</span>
        </p>
      ) : null}

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepAssets({ data, update, currency, onBack, onNext, nextDisabled }: StepProps) {
  const fields: { key: keyof AuditFormState; label: string; helper: string }[] = [
    {
      key: "assetCashLiquid",
      label: `Cash — liquid (${currency})`,
      helper:
        "Within 48 hours, no penalties. If this is also your runway, enter the full realistic total — we’ll reconcile conceptually downstream.",
    },
    { key: "assetInvestments", label: `Investments (${currency})`, helper: "Taxable brokerage, funds, ETFs, etc." },
    { key: "assetRetirement", label: `Retirement (${currency})`, helper: "401k, IRA, pension, provident equivalents." },
    { key: "assetPropertyEquity", label: `Property equity (${currency})`, helper: "Market value minus mortgage balance." },
    { key: "assetBusinessEquity", label: `Business equity (${currency})`, helper: "Conservative, after debts tied to it." },
    { key: "assetVehicles", label: `Vehicles (${currency})`, helper: "Resale value minus auto loans counted on liability step." },
    { key: "assetOther", label: `Other assets (${currency})`, helper: "Anything meaningful & sellable we'd otherwise miss." },
  ];

  return (
    <>
      <Overline>04 — Assets</Overline>
      <H1>The claimables — what you truly own.</H1>
      <Lead>Use whole numbers. Zero is honest. Guessing upward feels good for five minutes and costs you clarity for months.</Lead>

      {fields.map((f) => (
        <FieldShell key={f.key} id={f.key} label={f.label} helper={f.helper}>
          <CurrencyInput
            id={f.key}
            value={String(data[f.key] ?? "")}
            onDigitsChange={(v) => update({ [f.key]: v } as Partial<AuditFormState>)}
          />
        </FieldShell>
      ))}

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepEssentials({ data, update, currency, onBack, onNext, nextDisabled }: StepProps) {
  return (
    <>
      <Overline>05 — Survival math</Overline>
      <H1>What one bad month actually costs.</H1>
      <Lead>Runway is emotional safety with a denominator. Housing, food, transport, minimums, insurance you can’t drop — not the whole month of life.</Lead>

      <FieldShell
        id="essentials"
        label={`Monthly essentials (${currency})`}
        helper="If income stopped tomorrow, what you must cover to stay housed, fed, mobile, and current on required minimums."
      >
        <CurrencyInput
          id="essentials"
          value={data.monthlyEssentials}
          onDigitsChange={(v) => update({ monthlyEssentials: v })}
        />
      </FieldShell>

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepLiabilities({ data, update, currency, onBack, onNext, nextDisabled }: StepProps) {
  const region = REGIONS.find((r) => r.id === data.region);
  const cutoff = region?.debtCutoffAprPct ?? 8;

  const fields: { key: keyof AuditFormState; label: string; helper: string }[] = [
    { key: "liabilityCreditCards", label: `Credit cards (${currency})`, helper: "Revolving balances as of today." },
    { key: "liabilityStudentLoans", label: `Student loans (${currency})`, helper: "Total remaining principal." },
    { key: "liabilityMortgage", label: `Mortgage (${currency})`, helper: "Outstanding balance on primary / investment property." },
    { key: "liabilityCarLoans", label: `Auto loans (${currency})`, helper: "What you still owe on vehicles." },
    { key: "liabilityPersonal", label: `Personal / BNPL (${currency})`, helper: "Signature loans, family loans, point-of-sale plans." },
    { key: "liabilityTax", label: `Tax debt (${currency})`, helper: "Payment plans with revenue authorities." },
    { key: "liabilityOther", label: `Other liabilities (${currency})`, helper: "Medical liens, 401k loans, anything else material." },
  ];

  return (
    <>
      <Overline>06 — Liabilities</Overline>
      <H1>What future hours are already spent.</H1>
      <Lead>These numbers don’t define you — they define pressure. Precision matters more than pride.</Lead>

      {fields.map((f) => (
        <FieldShell key={f.key} id={f.key} label={f.label} helper={f.helper}>
          <CurrencyInput
            id={f.key}
            value={String(data[f.key] ?? "")}
            onDigitsChange={(v) => update({ [f.key]: v } as Partial<AuditFormState>)}
          />
        </FieldShell>
      ))}

      <FieldShell
        id="debt90"
        label={`Non‑mortgage debt ~90 days ago (${currency})`}
        helper="Best estimate from a statement. Used only to infer whether balances are expanding or shrinking."
      >
        <CurrencyInput
          id="debt90"
          value={data.debtThreeMonthsAgo}
          onDigitsChange={(v) => update({ debtThreeMonthsAgo: v })}
        />
      </FieldShell>

      <FieldShell
        id="hihi"
        label="High‑interest pressure"
        helper={`Do you carry balances above ~${cutoff}% APR (cards, certain personal loans, predatory products) that aren’t paid monthly?`}
      >
        <RadioBool
          name="hihi"
          value={data.hasHighInterest}
          onChange={(v) => update({ hasHighInterest: v })}
          options={[
            { value: true, label: "Yes — at least one of these is active." },
            { value: false, label: "No — below threshold or debt‑free on that front." },
          ]}
        />
      </FieldShell>

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "Next →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

export function StepSystems({
  data,
  update,
  currency = "",
  onBack,
  onNext,
  nextDisabled,
}: StepProps) {
  return (
    <>
      <Overline>07 — Deployment & inner life</Overline>
      <H1>How money moves when you’re not watching.</H1>
      <Lead>Behavioral answers don’t change your math here — they change how hard the math feels, and what support should sound like.</Lead>

      <FieldShell
        id="invested"
        label={`Monthly amount invested (${currency})`}
        helper="Long-horizon only: retirement, brokerage, match, invested HSA. Not savings pile, not extra mortgage."
      >
        <CurrencyInput
          id="invested"
          value={data.monthlyInvested}
          onDigitsChange={(v) => update({ monthlyInvested: v })}
        />
      </FieldShell>

      <FieldShell id="automation" label="Automation" helper="Do contributions happen without a monthly decision?">
        <RadioBool
          name="automation"
          value={data.investingAutomated}
          onChange={(v) => update({ investingAutomated: v })}
          options={[
            { value: true, label: "Yes — scheduled / auto." },
            { value: false, label: "No — manual or not investing yet." },
          ]}
        />
      </FieldShell>

      <FieldShell id="freq" label="Investing frequency (self-report)">
        <RadioGroupInColumn
          name="freq"
          value={data.investingFrequency}
          onChange={(v) => update({ investingFrequency: v as InvestingFrequency })}
          options={[
            { id: "never", label: "Not yet" },
            { id: "sporadic", label: "When there’s extra" },
            { id: "monthly", label: "Most months" },
            { id: "automated", label: "Automated rhythm" },
          ]}
        />
      </FieldShell>

      <FieldShell id="dstress" label="Debt stress (honest)" helper="Subjective — but it predicts how you’ll execute.">
        <RadioGroupInColumn
          name="dstress"
          value={data.debtStress}
          onChange={(v) => update({ debtStress: v as StressLevel })}
          options={[
            { id: "low", label: "Low — annoying, not consuming" },
            { id: "moderate", label: "Moderate — often on my mind" },
            { id: "high", label: "High — affects sleep or decisions" },
          ]}
        />
      </FieldShell>

      <FieldShell id="confidence" label="Financial confidence">
        <RadioGroupInColumn
          name="confidence"
          value={data.financialConfidence}
          onChange={(v) => update({ financialConfidence: v as StressLevel })}
          options={[
            { id: "low", label: "Low — I’m guessing often" },
            { id: "moderate", label: "Moderate — I patch things together" },
            { id: "high", label: "High — I generally trust my setup" },
          ]}
        />
      </FieldShell>

      <FieldShell id="sys" label="Systems you actually use">
        <RadioGroupInColumn
          name="sys"
          value={data.financialSystems}
          onChange={(v) => update({ financialSystems: v as FinancialSystems })}
          options={[
            { id: "none", label: "None deliberate" },
            { id: "informal", label: "Head + scattered notes" },
            { id: "documented", label: "Written / tracked somewhere solid" },
            { id: "automated", label: "Automated stack with review rhythm" },
          ]}
        />
      </FieldShell>

      <FooterNav
        secondary={{ label: "← Back", onClick: onBack! }}
        primary={{ label: "See Results →", disabled: !!nextDisabled, onClick: onNext }}
      />
    </>
  );
}

function RadioGroup({
  options,
  value,
  name,
  onChange,
}: {
  options: { id: Scope; label: string }[];
  value: string;
  name: string;
  onChange: (id: Scope) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          className={`flex cursor-pointer gap-3 rounded-[2px] border px-4 py-3 text-[15px] ${
            value === o.id ? "border-[var(--forest)] bg-[var(--wash)]" : "border-[var(--line)] bg-white"
          }`}
        >
          <input type="radio" className="mt-1 accent-[var(--forest)]" checked={value === o.id} name={name} onChange={() => onChange(o.id)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function RadioBool({
  options,
  value,
  name,
  onChange,
}: {
  options: { value: boolean; label: string }[];
  value: boolean | null;
  name: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <label
          key={String(o.value)}
          className={`flex cursor-pointer gap-3 rounded-[2px] border px-4 py-3 text-[15px] ${
            value === o.value ? "border-[var(--forest)] bg-[var(--wash)]" : "border-[var(--line)] bg-white"
          }`}
        >
          <input type="radio" className="mt-1 accent-[var(--forest)]" checked={value === o.value} name={name} onChange={() => onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroupInColumn<T extends string>({
  options,
  value,
  name,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: string;
  name: string;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          className={`flex cursor-pointer gap-3 rounded-[2px] border px-4 py-3 text-[15px] ${
            value === o.id ? "border-[var(--forest)] bg-[var(--wash)]" : "border-[var(--line)] bg-white"
          }`}
        >
          <input
            type="radio"
            className="mt-1 accent-[var(--forest)]"
            checked={value === o.id}
            name={name}
            onChange={() => onChange(o.id)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
