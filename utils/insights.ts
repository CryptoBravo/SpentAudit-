import type { AuditCalculations } from "@/types/audit";
import type { WealthStepContent } from "@/config/wealthSteps";

export interface StrengthWeakness {
  strength: string;
  weakness: string;
}

/** Tone: inside the problem, calm, personal — avoids guru swagger. */
export function deriveStrengthWeakness(
  calc: AuditCalculations,
  stepContent: WealthStepContent,
): StrengthWeakness {
  const anchors: StrengthWeakness = {
    strength: "",
    weakness: "",
  };

  anchors.weakness = pickWeakness(calc);
  anchors.strength = pickStrength(calc);

  if (!anchors.strength) {
    anchors.strength =
      stepContent.emotionalDiagnosis.split("—")[0]?.trim() ??
      "You're further along than the story you tell yourself on bad days.";
  }
  if (!anchors.weakness) {
    anchors.weakness =
      "The next layer is consistency: small repeated actions beat one perfect week.";
  }

  return anchors;
}

function pickWeakness(calc: AuditCalculations): string {
  if (calc.savingsRate <= 0) {
    return "Cash flow is tight enough that the month ends before your intentions do — margin has to come first.";
  }
  if (calc.runwayMonths < 1 && calc.monthlyEssentials > 0) {
    return "Your runway is thinner than it feels when everything goes right — one shock can force expensive decisions.";
  }
  if (calc.totalDebtExMortgage > 0 && calc.debtDirection === "rising") {
    return "Debt is still expanding, which quietly raises the bar for every other goal you care about.";
  }
  if (calc.deploymentRate <= 0 && calc.savingsRate > 5) {
    return "You're holding ground with savings, but not yet translating stability into long-horizon ownership.";
  }
  if (calc.liquidityRatio < 0.05 && calc.totalAssets > 0) {
    return "Most of your balance sheet is illiquid — strong on paper, slow in a crisis.";
  }
  if (calc.surplus < 0) {
    return "After obligations and deployment, the month still lands underwater — the gap is the truth to respect.";
  }
  return "";
}

function pickStrength(calc: AuditCalculations): string {
  if (calc.netWorth > 0 && calc.savingsRate > 0) {
    return "You're carrying positive net worth and a positive margin — that's a real foundation, even if it doesn't feel glamorous.";
  }
  if (calc.runwayMonths >= 6) {
    return "You've built enough runway to think in weeks instead of hours when something breaks.";
  }
  if (calc.debtDirection === "declining" && calc.totalDebtExMortgage > 0) {
    return "Debt is moving the right direction — that kind of momentum is underrated because it isn't loud.";
  }
  if (calc.deploymentRate >= 10) {
    return "You're consistently shipping money into ownership — boring in the best way.";
  }
  if (calc.savingsRate >= 15) {
    return "Your savings rate has real teeth — it gives you options most people only describe.";
  }
  return "";
}
