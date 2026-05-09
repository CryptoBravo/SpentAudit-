"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { initPostHog, posthog } from "@/lib/analytics/posthogClient";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
  }, []);

  // Manual pageview capture for App Router navigations.
  useEffect(() => {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!host || !key) return;

    // Avoid useSearchParams() to keep static prerenders happy; window is accurate in the browser.
    const url = typeof window !== "undefined" ? window.location.href : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname]);

  return <>{children}</>;
}

