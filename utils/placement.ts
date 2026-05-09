import { REGIONS, type RegionBenchmark } from "@/config/regions";
import type { WealthStepId } from "@/types/audit";

export interface PlacementInput {
  pictureComplete: boolean;
  savingsRate: number;
  hasHighInterestDebt: boolean;
  debtDirection: "none" | "new" | "rising" | "declining" | "unknown";
  runwayMonths: number;
  deploymentRate: number;
  region: RegionBenchmark | undefined;
}

/**
 * Core placement engine preserved from the Spent Audit prototype,
 * adapted so “Building vs Compounding” splits on runway gate + deployment.
 */
export function calculateWealthStep(i: PlacementInput): WealthStepId {
  const [stable] = i.region?.runwayMonths ?? ([3, 6] as [number, number]);
  const runwayGate = Math.max(3, stable);

  if (!i.pictureComplete) return 1;
  if (i.savingsRate <= 0) return 2;

  const debtDeclining =
    i.debtDirection === "declining" || i.debtDirection === "none";
  const hasDrag = i.hasHighInterestDebt && !debtDeclining;
  const fragileRunwayDuringDebtPaydown =
    i.hasHighInterestDebt &&
    i.debtDirection === "declining" &&
    i.runwayMonths < 1;

  if (hasDrag || fragileRunwayDuringDebtPaydown) return 3;

  if (i.runwayMonths < runwayGate) return 4;
  if (i.deploymentRate <= 0) return 4;
  return 5;
}

export function getRegion(id: string): RegionBenchmark | undefined {
  return REGIONS.find((r) => r.id === id);
}
