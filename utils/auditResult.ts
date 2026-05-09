import { getWealthStep } from "@/config/wealthSteps";
import type { AuditFormState, WealthStepId, WealthStepSlug } from "@/types/audit";
import {
  debtVelocityLabel,
  deploymentLabel,
  runwayLabel,
  savingsLabel,
} from "@/utils/benchmarks";
import { computeAuditCalculations, isFinancialPictureComplete } from "@/utils/calculations";
import { getRegion, type PlacementInput, calculateWealthStep } from "@/utils/placement";

export interface AuditResultModel {
  calc: ReturnType<typeof computeAuditCalculations>;
  step: WealthStepId;
  slug: WealthStepSlug;
  pictureComplete: boolean;
  savingsBenchmark: string;
  runwayBenchmark: string;
  debtBenchmark: string | null;
  deploymentBenchmark: string;
  claimHoursPerMonth: number;
  debtHoursLife: number;
}

export function deriveAuditResult(state: AuditFormState): AuditResultModel {
  const calc = computeAuditCalculations(state);
  const pictureComplete = isFinancialPictureComplete(state);
  const region = getRegion(state.region);

  const placementIn: PlacementInput = {
    pictureComplete,
    savingsRate: calc.savingsRate,
    hasHighInterestDebt: state.hasHighInterest === true,
    debtDirection: calc.debtDirection,
    runwayMonths: calc.runwayMonths,
    deploymentRate: calc.deploymentRate,
    region,
  };

  const step = calculateWealthStep(placementIn);
  const content = getWealthStep(step);

  const savingsFam = region?.savingsFamily ?? "mid";
  const rr = region?.runwayMonths ?? ([3, 6] as [number, number]);

  const debtBenchmark =
    calc.totalDebtExMortgage <= 0
      ? null
      : debtVelocityLabel(calc.totalDebtExMortgage, calc.debtThreeMonthsAgo);

  const claimHoursPerMonth =
    calc.realHourlyWage > 0 && calc.monthlyExpenses > 0
      ? Math.round(calc.monthlyExpenses / calc.realHourlyWage)
      : 0;
  const debtHoursLife =
    calc.realHourlyWage > 0 && calc.totalDebtExMortgage > 0
      ? Math.round(calc.totalDebtExMortgage / calc.realHourlyWage)
      : 0;

  return {
    calc,
    step,
    slug: content.slug,
    pictureComplete,
    savingsBenchmark: savingsLabel(calc.savingsRate, savingsFam),
    runwayBenchmark: runwayLabel(calc.runwayMonths, rr),
    debtBenchmark,
    deploymentBenchmark: deploymentLabel(
      calc.deploymentRate,
      state.investingAutomated === true,
    ),
    claimHoursPerMonth,
    debtHoursLife,
  };
}
