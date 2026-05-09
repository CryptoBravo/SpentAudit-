"use client";

import { useCallback } from "react";
import { posthog } from "@/lib/analytics/posthogClient";

export type AnalyticsEventName =
  | "audit_started"
  | "step_completed"
  | "audit_completed"
  | "email_submitted"
  | "report_sent";

export interface AnalyticsPayload {
  stepIndex?: number;
  stepId?: string;
  wealthStep?: string;
  [key: string]: unknown;
}

/**
 * Placeholder analytics hook — wire Segment/GA/Plausible here before launch.
 * Keeping a single callsite prevents event-name drift.
 */
export function useAnalytics() {
  const track = useCallback((name: AnalyticsEventName, payload?: AnalyticsPayload) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- intentional dev-only analytics
      console.info(`[analytics] ${name}`, payload ?? {});
    }

    // If PostHog isn't configured, posthog.capture is a safe no-op.
    posthog.capture(name, payload ?? {});
  }, []);

  return { track };
}
