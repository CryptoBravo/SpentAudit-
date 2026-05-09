import type { WealthStepId, WealthStepSlug } from "@/types/audit";

export interface WealthStepContent {
  id: WealthStepId;
  slug: WealthStepSlug;
  headline: string;
  verb: string;
  legacyName: string;
  identity: string;
  interpretation: string;
  emotionalDiagnosis: string;
  nextMove: string;
  benchmarkPositioning: string;
  newsletterAngle: string;
}

export const WEALTH_STEPS: Record<WealthStepId, WealthStepContent> = {
  1: {
    id: 1,
    slug: "financial-fracture",
    headline: "Financial Fracture",
    verb: "Audit",
    legacyName: "Audit Your Finances",
    identity: "I can see what's happening",
    interpretation:
      "You haven't looked at the whole machine yet. That's not a failure — it's where almost everyone starts. The problem is that every decision you make until the audit is complete is made in the fog. This step isn't about fixing anything. It's about turning the lights on.",
    emotionalDiagnosis:
      "You're not \"bad with money.\" You're running a complex life without a single map — and maps only feel dramatic when someone finally asks you to draw one.",
    nextMove:
      "Complete your balance sheet (assets, liabilities, and cash you can touch) this weekend. Not next month. This weekend.",
    benchmarkPositioning:
      "You're before the benchmarks — not beneath them. Visibility is the prerequisite for every number that follows.",
    newsletterAngle: "Clarity-first sequences, issue deep-dives, and async audit openings when you want a second pair of eyes.",
  },
  2: {
    id: 2,
    slug: "survival-mode",
    headline: "Survival Mode",
    verb: "Cut",
    legacyName: "Cut Excess Spending",
    identity: "I can feel every dollar move",
    interpretation:
      "You can see the machine, but money is still leaking faster than you're catching it. Your savings rate tells the truth: every month, more goes out than stays. This isn't about deprivation. It's about finding the recurring drains you've stopped noticing.",
    emotionalDiagnosis:
      "This is the part that feels shameful from the outside and obvious from the inside: you know the shape of the problem. You just haven't had slack to fix it without fear.",
    nextMove:
      "Cancel three subscriptions this week. Pick the three you'd least miss. Do not replace them.",
    benchmarkPositioning:
      "Regional savings targets are upstream of you right now — first restore a positive margin, even a thin one.",
    newsletterAngle: "Leak hunting, friction-aware spending resets, and gentle structure for months that refuse to cooperate.",
  },
  3: {
    id: 3,
    slug: "stabilizing",
    headline: "Stabilizing",
    verb: "Eliminate",
    legacyName: "Eliminate High-Interest Debt",
    identity: "I'm reclaiming hours I sold",
    interpretation:
      "You're carrying debt that's eating what you earn before you earn it. Every month that debt stays, you're paying for purchases you already forgot about. The math is not neutral — high-interest debt negative-compounds faster than most investments positive-compound. This step cannot wait.",
    emotionalDiagnosis:
      "Debt stress isn't character — it's hydraulics. When pressure is high, optimism feels fraudulent. Stabilizing is how you buy back optionality one payment at a time.",
    nextMove:
      "List every high-interest debt by APR. Attack the highest rate first. Keep one month of runway in place while you do it.",
    benchmarkPositioning:
      "Your benchmark is directional: shrinking balances and stopping the acceleration of interest — not perfect optimization.",
    newsletterAngle: "Paydown sequencing, emotional safety rails, and what to ignore until the fire is smaller.",
  },
  4: {
    id: 4,
    slug: "building",
    headline: "Building",
    verb: "Build",
    legacyName: "Build an Emergency Fund",
    identity: "I can't be collapsed by one event",
    interpretation:
      "You've killed the drag — or you're close. Now the question is whether one bad month can undo you. The goal isn't a number on a spreadsheet. It's enough room to think straight when something breaks.",
    emotionalDiagnosis:
      "This is the quiet middle: not glamorous, not finished. It can feel like you're doing everything right and still not \"there yet.\" That's the texture of building.",
    nextMove:
      "Set up automatic transfer to a separate, liquid account. Target your region's runway range. Do not touch it except for true emergencies.",
    benchmarkPositioning:
      "You're tracking toward regional runway targets and preparing deployment — compounding is downstream, not a personality type.",
    newsletterAngle: "Runway construction, calm automation, and turning stability into intentional deployment.",
  },
  5: {
    id: 5,
    slug: "compounding",
    headline: "Compounding",
    verb: "Invest",
    legacyName: "Invest in Assets",
    identity: "My time belongs to me again",
    interpretation:
      "You've built the foundation. Now money has work to do that isn't merely defensive. This is where small, boring, repeated actions quietly become the main story.",
    emotionalDiagnosis:
      "Progress here often feels anticlimactic — statements move slowly while life stays loud. Compounding rewards patience without asking permission.",
    nextMove:
      "Automate a fixed monthly contribution this week. Even a small amount. Consistency beats timing every time.",
    benchmarkPositioning:
      "Deployment rate and automation matter more than cleverness — you're aligning behavior with long-horizon ownership.",
    newsletterAngle: "Deployment discipline, portfolio humility, and staying steady when markets get noisy.",
  },
};

export function getWealthStep(id: WealthStepId): WealthStepContent {
  return WEALTH_STEPS[id];
}
