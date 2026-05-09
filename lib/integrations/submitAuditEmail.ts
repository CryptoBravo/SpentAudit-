import type { BeehiivSubmissionPayload } from "@/types/audit";

export async function submitAuditEmail(payload: BeehiivSubmissionPayload): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const res = await fetch("/api/beehiiv/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        wealth_step: payload.wealthStep,
        region: payload.region,
        source: "audit",
      }),
    });

    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (!res.ok || !json?.ok) {
      return { ok: false, error: json?.error ?? "Could not save yet. Try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save yet. Try again." };
  }
}
