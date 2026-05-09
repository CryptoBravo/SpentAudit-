"use client";

import { EditorialLayout } from "@/components/audit/EditorialLayout";
import {
  StepAssets,
  StepCashFlow,
  StepEssentials,
  StepFraming,
  StepIncome,
  StepIntro,
  StepLiabilities,
  StepSystems,
} from "@/components/audit/steps";
import { AuditResults } from "@/components/audit/AuditResults";
import type { AuditFormState } from "@/types/audit";
import { useAuditSession } from "@/hooks/useAuditSession";
import { useAnalytics } from "@/hooks/useAnalytics";
import { deriveAuditResult } from "@/utils/auditResult";
import { useEffect, useMemo, useRef, useState } from "react";

const TOTAL_STEPS = 7;
const PAGE_KEY = "spent-audit:page";

const ASSET_FIELDS: (keyof AuditFormState)[] = [
  "assetCashLiquid",
  "assetInvestments",
  "assetRetirement",
  "assetPropertyEquity",
  "assetBusinessEquity",
  "assetVehicles",
  "assetOther",
];

const LIABILITY_FIELDS: (keyof AuditFormState)[] = [
  "liabilityCreditCards",
  "liabilityStudentLoans",
  "liabilityMortgage",
  "liabilityCarLoans",
  "liabilityPersonal",
  "liabilityTax",
  "liabilityOther",
];

function digitsPositive(value: string): boolean {
  return value !== "" && Number.parseInt(value.replace(/\D/g, ""), 10) > 0;
}

function digitsNonEmpty(value: string): boolean {
  if (value === "") return false;
  return Number.isFinite(Number.parseInt(value.replace(/\D/g, ""), 10));
}

export function AuditFlow() {
  const { data, update, hydrated } = useAuditSession();
  const { track } = useAnalytics();
  const [page, setPage] = useState(0);
  const pageHydrated = useRef(false);
  const completedSent = useRef(false);

  useEffect(() => {
    if (!hydrated || pageHydrated.current) return;
    pageHydrated.current = true;
    try {
      const raw = sessionStorage.getItem(PAGE_KEY);
      if (raw !== null) {
        const n = Number.parseInt(raw, 10);
        if (Number.isFinite(n) && n >= 0 && n <= 8) setPage(n);
      }
    } catch {
      /* ignore */
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(PAGE_KEY, String(page));
    } catch {
      /* ignore */
    }
  }, [hydrated, page]);

  useEffect(() => {
    if (!hydrated) return;
    if (page !== 8) {
      completedSent.current = false;
    }
  }, [hydrated, page]);

  useEffect(() => {
    if (!hydrated || page !== 8) return;
    if (completedSent.current) return;
    completedSent.current = true;
    const result = deriveAuditResult(data);
    track("audit_completed", { wealthStep: result.slug, region: data.region });
  }, [data, hydrated, page, track]);

  const currency = data.currency || "USD";

  const framingOk = useMemo(() => {
    const dep = Number.parseInt(data.dependents.replace(/\D/g, ""), 10);
    return (
      data.region !== "" &&
      data.currency !== "" &&
      data.scope !== "" &&
      data.dependents !== "" &&
      Number.isFinite(dep) &&
      dep >= 0
    );
  }, [data]);

  const incomeOk = useMemo(() => {
    return (
      digitsPositive(data.monthlyIncome) &&
      digitsNonEmpty(data.householdAdditionalIncome) &&
      data.incomeStability !== "" &&
      data.hoursPerWeek !== "" &&
      data.workExpenses !== ""
    );
  }, [data]);

  const cashOk = useMemo(() => digitsNonEmpty(data.monthlyExpenses) && digitsNonEmpty(data.savingsAmount), [data]);

  const assetsOk = useMemo(() => ASSET_FIELDS.every((k) => data[k] !== ""), [data]);

  const essentialsOk = useMemo(() => digitsNonEmpty(data.monthlyEssentials), [data]);

  const liabilitiesOk = useMemo(() => {
    const fields = LIABILITY_FIELDS.every((k) => data[k] !== "");
    const history = data.debtThreeMonthsAgo !== "";
    const flag = data.hasHighInterest !== null;
    return fields && history && flag;
  }, [data]);

  const systemsOk = useMemo(() => {
    return (
      data.monthlyInvested !== "" &&
      data.investingAutomated !== null &&
      data.investingFrequency !== "" &&
      data.debtStress !== "" &&
      data.financialConfidence !== "" &&
      data.financialSystems !== ""
    );
  }, [data]);

  if (!hydrated) {
    return (
      <EditorialLayout step={null}>
        <div className="py-28 text-center font-mono text-[12px] text-[var(--muted)]">Opening your session…</div>
      </EditorialLayout>
    );
  }

  function go(next: number) {
    const prev = page;
    setPage(next);

    if (prev === 0 && next === 1) track("audit_started");
    if (prev >= 1 && prev <= TOTAL_STEPS && next > prev && next <= TOTAL_STEPS + 1) {
      track("step_completed", { stepIndex: prev, stepId: stepSlug(prev) });
    }
  }

  const progress = page >= 1 && page <= TOTAL_STEPS ? { current: page, total: TOTAL_STEPS } : null;

  return (
    <EditorialLayout step={progress}>
      {page === 0 ? <StepIntro onNext={() => go(1)} /> : null}

      {page === 1 ? (
        <StepFraming data={data} update={update} onBack={() => go(0)} onNext={() => go(2)} nextDisabled={!framingOk} />
      ) : null}

      {page === 2 ? (
        <StepIncome
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(1)}
          onNext={() => go(3)}
          nextDisabled={!incomeOk}
        />
      ) : null}

      {page === 3 ? (
        <StepCashFlow
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(2)}
          onNext={() => go(4)}
          nextDisabled={!cashOk}
        />
      ) : null}

      {page === 4 ? (
        <StepAssets
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(3)}
          onNext={() => go(5)}
          nextDisabled={!assetsOk}
        />
      ) : null}

      {page === 5 ? (
        <StepEssentials
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(4)}
          onNext={() => go(6)}
          nextDisabled={!essentialsOk}
        />
      ) : null}

      {page === 6 ? (
        <StepLiabilities
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(5)}
          onNext={() => go(7)}
          nextDisabled={!liabilitiesOk}
        />
      ) : null}

      {page === 7 ? (
        <StepSystems
          currency={currency}
          data={data}
          update={update}
          onBack={() => go(6)}
          onNext={() => go(8)}
          nextDisabled={!systemsOk}
        />
      ) : null}

      {page === 8 ? <AuditResults data={data} onBack={() => go(7)} /> : null}
    </EditorialLayout>
  );
}

function stepSlug(step: number): string {
  const map: Record<number, string> = {
    1: "framing",
    2: "income",
    3: "cashflow",
    4: "assets",
    5: "essentials",
    6: "liabilities",
    7: "systems",
  };
  return map[step] ?? "unknown";
}
