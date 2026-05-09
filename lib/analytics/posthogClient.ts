import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    // Silently no-op if not configured (e.g., local dev).
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // we do this manually for App Router
    autocapture: process.env.NODE_ENV === "development" ? false : true,
    disable_session_recording: false,
  });
}

export { posthog };

