export interface RegionBenchmark {
  id: string;
  label: string;
  savingsFamily: "low" | "mid" | "high";
  debtCutoffAprPct: number;
  runwayMonths: [number, number];
}

export const REGIONS: RegionBenchmark[] = [
  {
    id: "na",
    label: "North America (US, Canada)",
    savingsFamily: "mid",
    debtCutoffAprPct: 8,
    runwayMonths: [3, 6],
  },
  {
    id: "wn_eu",
    label: "Western/Northern Europe (UK, Germany, France, Nordics, Benelux)",
    savingsFamily: "high",
    debtCutoffAprPct: 8,
    runwayMonths: [2, 4],
  },
  {
    id: "se_eu",
    label: "Southern/Eastern Europe (Spain, Italy, Poland, Czechia)",
    savingsFamily: "mid",
    debtCutoffAprPct: 10,
    runwayMonths: [3, 6],
  },
  {
    id: "dev_apac",
    label: "Developed Asia-Pacific (Japan, Korea, Singapore, Australia, NZ)",
    savingsFamily: "high",
    debtCutoffAprPct: 8,
    runwayMonths: [3, 6],
  },
  {
    id: "greater_china",
    label: "Greater China (Mainland, Hong Kong, Taiwan)",
    savingsFamily: "high",
    debtCutoffAprPct: 8,
    runwayMonths: [3, 6],
  },
  {
    id: "me",
    label: "Middle East (UAE, Saudi Arabia, Israel)",
    savingsFamily: "mid",
    debtCutoffAprPct: 10,
    runwayMonths: [3, 6],
  },
  {
    id: "sea",
    label: "Southeast Asia (Philippines, Indonesia, Vietnam, Thailand, Malaysia)",
    savingsFamily: "low",
    debtCutoffAprPct: 12,
    runwayMonths: [3, 6],
  },
  {
    id: "latam",
    label: "Latin America (Mexico, Brazil, Argentina, Chile, Colombia)",
    savingsFamily: "low",
    debtCutoffAprPct: 15,
    runwayMonths: [4, 8],
  },
  {
    id: "ssa",
    label: "Sub-Saharan Africa (Nigeria, Kenya, South Africa, Ghana)",
    savingsFamily: "low",
    debtCutoffAprPct: 15,
    runwayMonths: [4, 8],
  },
  {
    id: "sa",
    label: "South Asia (India, Pakistan, Bangladesh)",
    savingsFamily: "low",
    debtCutoffAprPct: 15,
    runwayMonths: [4, 8],
  },
];

export const CURRENCIES = [
  "USD",
  "CAD",
  "GBP",
  "EUR",
  "JPY",
  "KRW",
  "SGD",
  "AUD",
  "NZD",
  "HKD",
  "CNY",
  "TWD",
  "AED",
  "SAR",
  "ILS",
  "PHP",
  "IDR",
  "VND",
  "THB",
  "MYR",
  "MXN",
  "BRL",
  "ARS",
  "CLP",
  "COP",
  "NGN",
  "KES",
  "ZAR",
  "GHS",
  "INR",
  "PKR",
  "BDT",
] as const;
