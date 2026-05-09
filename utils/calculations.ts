import type {
  AssetAllocationPct,
  AuditCalculations,
  AuditFormState,
  DebtDirection,
} from "@/types/audit";

function n(v: string): number {
  const x = Number.parseInt(v.replace(/\D/g, ""), 10);
  return Number.isFinite(x) ? x : 0;
}

export function isFinancialPictureComplete(state: AuditFormState): boolean {
  const requiredNumeric = [
    state.monthlyIncome,
    state.householdAdditionalIncome,
    state.monthlyExpenses,
    state.savingsAmount,
    state.monthlyEssentials,
    state.assetCashLiquid,
    state.assetInvestments,
    state.assetRetirement,
    state.assetPropertyEquity,
    state.assetBusinessEquity,
    state.assetVehicles,
    state.assetOther,
    state.liabilityCreditCards,
    state.liabilityStudentLoans,
    state.liabilityMortgage,
    state.liabilityCarLoans,
    state.liabilityPersonal,
    state.liabilityTax,
    state.liabilityOther,
    state.debtThreeMonthsAgo,
    state.monthlyInvested,
    state.hoursPerWeek,
    state.workExpenses,
  ];
  if (requiredNumeric.some((f) => f === "")) return false;
  if (state.region === "" || state.currency === "" || state.scope === "") return false;
  if (state.dependents === "") return false;
  if (state.hasHighInterest === null) return false;
  if (state.investingAutomated === null) return false;
  if (state.incomeStability === "") return false;
  if (state.investingFrequency === "") return false;
  if (state.debtStress === "") return false;
  if (state.financialConfidence === "") return false;
  if (state.financialSystems === "") return false;
  return n(state.monthlyIncome) > 0;
}

export function computeAuditCalculations(state: AuditFormState): AuditCalculations {
  const primaryIncome = n(state.monthlyIncome);
  const householdAdd = n(state.householdAdditionalIncome);
  const monthlyIncome = primaryIncome + householdAdd;
  const workExp = n(state.workExpenses);
  const adjustedIncome = Math.max(0, primaryIncome - workExp) + householdAdd;
  /** Expenses keyed to household scale (best-effort: user enters for chosen scope). */
  const monthlyExpenses = n(state.monthlyExpenses);

  const cash = n(state.assetCashLiquid);
  const inv = n(state.assetInvestments);
  const ret = n(state.assetRetirement);
  const prop = n(state.assetPropertyEquity);
  const biz = n(state.assetBusinessEquity);
  const veh = n(state.assetVehicles);
  const oth = n(state.assetOther);
  const totalAssets = cash + inv + ret + prop + biz + veh + oth;

  const cc = n(state.liabilityCreditCards);
  const st = n(state.liabilityStudentLoans);
  const mort = n(state.liabilityMortgage);
  const car = n(state.liabilityCarLoans);
  const pers = n(state.liabilityPersonal);
  const tax = n(state.liabilityTax);
  const lo = n(state.liabilityOther);
  const totalLiabilities = cc + st + mort + car + pers + tax + lo;
  const totalDebtExMortgage = cc + st + car + pers + tax + lo;
  const netWorth = totalAssets - totalLiabilities;

  const invested = n(state.monthlyInvested);
  const essentials = Math.max(0, n(state.monthlyEssentials));
  const liquidCash = cash;
  const runwayMonths = essentials > 0 ? liquidCash / essentials : 0;

  const hours = Math.max(0, n(state.hoursPerWeek)) || 40;
  const weeklyIncome = adjustedIncome * (12 / 52);
  const realHourlyWage = hours > 0 ? weeklyIncome / hours : 0;

  const savingsNumerator =
    adjustedIncome > 0 ? Math.max(0, adjustedIncome - monthlyExpenses) : 0;
  const savingsRate =
    monthlyIncome > 0 ? (savingsNumerator / monthlyIncome) * 100 : 0;

  const deploymentRate = monthlyIncome > 0 ? (invested / monthlyIncome) * 100 : 0;
  const surplus = adjustedIncome - monthlyExpenses - invested;

  const debt90 = n(state.debtThreeMonthsAgo);

  let debtDirection: DebtDirection = "unknown";
  if (totalDebtExMortgage <= 0) debtDirection = "none";
  else if (debt90 <= 0 && totalDebtExMortgage > 0) debtDirection = "new";
  else if (totalDebtExMortgage >= debt90) debtDirection = "rising";
  else debtDirection = "declining";

  const liquidityRatio = totalAssets > 0 ? liquidCash / totalAssets : 0;
  const allocation = computeAllocation({
    cash,
    inv,
    ret,
    prop,
    biz,
    veh,
    oth,
  });

  return {
    monthlyIncome,
    adjustedIncome,
    monthlyExpenses,
    monthlyEssentials: essentials,
    savingsAmount: savingsNumerator,
    savingsRate,
    netWorth,
    totalAssets,
    totalLiabilities,
    liquidCash,
    runwayMonths,
    deploymentRate,
    surplus,
    totalDebtExMortgage,
    totalDebtInclusive: totalDebtExMortgage,
    debtThreeMonthsAgo: debt90,
    debtDirection,
    realHourlyWage,
    liquidityRatio,
    allocation,
  };
}

function computeAllocation(slice: {
  cash: number;
  inv: number;
  ret: number;
  prop: number;
  biz: number;
  veh: number;
  oth: number;
}): AssetAllocationPct {
  const sum =
    slice.cash +
    slice.inv +
    slice.ret +
    slice.prop +
    slice.biz +
    slice.veh +
    slice.oth;
  if (sum <= 0) {
    return {
      cash: 0,
      investments: 0,
      retirement: 0,
      property: 0,
      business: 0,
      vehicles: 0,
      other: 0,
    };
  }
  const pct = (x: number) => Math.round((x / sum) * 1000) / 10;
  return {
    cash: pct(slice.cash),
    investments: pct(slice.inv),
    retirement: pct(slice.ret),
    property: pct(slice.prop),
    business: pct(slice.biz),
    vehicles: pct(slice.veh),
    other: pct(slice.oth),
  };
}
