export type IncomeStability = "stable" | "uneven" | "unpredictable";

export type InvestingFrequency = "never" | "sporadic" | "monthly" | "automated";

export type StressLevel = "low" | "moderate" | "high";

export type FinancialSystems = "none" | "informal" | "documented" | "automated";

export type Scope = "me" | "shared" | "wider";

export type DebtDirection = "none" | "new" | "rising" | "declining" | "unknown";

export type WealthStepId = 1 | 2 | 3 | 4 | 5;

export type WealthStepSlug =
  | "financial-fracture"
  | "survival-mode"
  | "stabilizing"
  | "building"
  | "compounding";

/** Single source of truth for the audit form (session-persisted) */
export interface AuditFormState {
  region: string;
  currency: string;
  scope: Scope | "";
  dependents: string;
  monthlyIncome: string;
  householdAdditionalIncome: string;
  incomeStability: IncomeStability | "";
  hoursPerWeek: string;
  workExpenses: string;
  monthlyExpenses: string;
  savingsAmount: string;
  monthlyEssentials: string;
  assetCashLiquid: string;
  assetInvestments: string;
  assetRetirement: string;
  assetPropertyEquity: string;
  assetBusinessEquity: string;
  assetVehicles: string;
  assetOther: string;
  liabilityCreditCards: string;
  liabilityStudentLoans: string;
  liabilityMortgage: string;
  liabilityCarLoans: string;
  liabilityPersonal: string;
  liabilityTax: string;
  liabilityOther: string;
  /** Approximate consumer/non-mortgage debt 90 days ago (for velocity) */
  debtThreeMonthsAgo: string;
  hasHighInterest: boolean | null;
  monthlyInvested: string;
  investingAutomated: boolean | null;
  investingFrequency: InvestingFrequency | "";
  debtStress: StressLevel | "";
  financialConfidence: StressLevel | "";
  financialSystems: FinancialSystems | "";
}

export interface AuditCalculations {
  monthlyIncome: number;
  adjustedIncome: number;
  monthlyExpenses: number;
  monthlyEssentials: number;
  savingsAmount: number;
  savingsRate: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  liquidCash: number;
  runwayMonths: number;
  deploymentRate: number;
  surplus: number;
  totalDebtExMortgage: number;
  totalDebtInclusive: number;
  debtThreeMonthsAgo: number;
  debtDirection: DebtDirection;
  realHourlyWage: number;
  liquidityRatio: number;
  allocation: AssetAllocationPct;
}

export interface AssetAllocationPct {
  cash: number;
  investments: number;
  retirement: number;
  property: number;
  business: number;
  vehicles: number;
  other: number;
}

export interface PlacementContext {
  step: WealthStepId;
  slug: WealthStepSlug;
  runwayTargetRange: [number, number];
  savingsBenchmark: string;
  runwayBenchmark: string;
  debtBenchmark: string | null;
  deploymentBenchmark: string;
}

export const INITIAL_AUDIT_STATE: AuditFormState = {
  region: "",
  currency: "",
  scope: "",
  dependents: "",
  monthlyIncome: "",
  householdAdditionalIncome: "",
  incomeStability: "",
  hoursPerWeek: "",
  workExpenses: "",
  monthlyExpenses: "",
  savingsAmount: "",
  monthlyEssentials: "",
  assetCashLiquid: "",
  assetInvestments: "",
  assetRetirement: "",
  assetPropertyEquity: "",
  assetBusinessEquity: "",
  assetVehicles: "",
  assetOther: "",
  liabilityCreditCards: "",
  liabilityStudentLoans: "",
  liabilityMortgage: "",
  liabilityCarLoans: "",
  liabilityPersonal: "",
  liabilityTax: "",
  liabilityOther: "",
  debtThreeMonthsAgo: "",
  hasHighInterest: null,
  monthlyInvested: "",
  investingAutomated: null,
  investingFrequency: "",
  debtStress: "",
  financialConfidence: "",
  financialSystems: "",
};

export interface BeehiivSubmissionPayload {
  email: string;
  wealthStep: WealthStepSlug;
  region: string;
  currency: string;
  timestamp: string;
  /** Segment-friendly optional fields */
  investingFrequency?: string;
  dependents?: string;
}
