import type { RegionBenchmark } from "@/config/regions";

export function savingsLabel(rate: number, family: RegionBenchmark["savingsFamily"]): string {
  if (rate < 0) return "Unstable";
  if (family === "high") {
    if (rate < 5) return "Fragile";
    if (rate < 15) return "Building";
    return "Strong";
  }
  if (family === "mid") {
    if (rate < 5) return "Fragile";
    if (rate < 10) return "Building";
    return "Strong";
  }
  if (rate < 3) return "Fragile";
  if (rate < 8) return "Building";
  return "Strong";
}

export function runwayLabel(months: number, [stable, secure]: [number, number]): string {
  if (months < 1) return "Fragile";
  if (months < stable) return "Stabilizing";
  if (months < secure) return "Secure";
  return "Resilient";
}

export function debtVelocityLabel(
  current: number,
  threeMonthsAgo: number,
): string | null {
  if (current <= 0) return null;
  if (!threeMonthsAgo || threeMonthsAgo <= 0) return "Maintaining";
  const reduction = (threeMonthsAgo - current) / threeMonthsAgo;
  if (reduction <= 0) return "Maintaining";
  if (reduction < 0.06) return "Eliminating";
  return "Reclaiming";
}

export function deploymentLabel(rate: number, automated: boolean): string {
  let base: string;
  if (rate === 0) base = "Not investing";
  else if (rate < 10) base = "Starting";
  else base = "Building ownership";
  if (automated && base !== "Not investing") return `${base} (automated)`;
  return base;
}
