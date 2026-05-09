import { NextResponse } from "next/server";

type SubscribeRequest = {
  email: string;
  wealth_step: string;
  region: string;
  source: string;
};

function requireBeehiivEnv() {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey) throw new Error("Missing env var: BEEHIIV_API_KEY");
  if (!publicationId) throw new Error("Missing env var: BEEHIIV_PUBLICATION_ID");

  return { apiKey, publicationId } as const;
}

function toCustomFields(payload: SubscribeRequest) {
  // Note: Beehiiv discards custom fields that don't already exist in the publication.
  return [
    { name: "wealth_step", value: payload.wealth_step },
    { name: "region", value: payload.region },
    { name: "source", value: payload.source },
  ];
}

async function beehiivFetch(apiKey: string, url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;
  return { res, json } as const;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SubscribeRequest>;

    const email = (body.email ?? "").trim().toLowerCase();
    const wealth_step = String(body.wealth_step ?? "").trim();
    const region = String(body.region ?? "").trim();
    const source = String(body.source ?? "").trim() || "audit";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const { apiKey, publicationId } = requireBeehiivEnv();
    const base = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;

    // 1) Try create (works for new subscribers; also easiest path).
    const create = await beehiivFetch(apiKey, base, {
      method: "POST",
      body: JSON.stringify({
        email,
        utm_source: "audit",
        send_welcome_email: false,
        reactivate_existing: false,
        custom_fields: toCustomFields({ email, wealth_step, region, source }),
      }),
    });

    if (create.res.ok) {
      return NextResponse.json({ ok: true });
    }

    // 2) If it already exists, fetch by email and patch custom fields.
    const byEmailUrl = `${base}/by_email/${encodeURIComponent(email)}`;
    const existing = await beehiivFetch(apiKey, byEmailUrl, { method: "GET" });

    if (!existing.res.ok) {
      return NextResponse.json({ ok: false, error: "Beehiiv error." }, { status: 502 });
    }

    const subscriptionId = (existing.json as any)?.data?.id as string | undefined;
    if (!subscriptionId) {
      return NextResponse.json({ ok: false, error: "Beehiiv error." }, { status: 502 });
    }

    const patchUrl = `${base}/${subscriptionId}`;
    const patch = await beehiivFetch(apiKey, patchUrl, {
      method: "PATCH",
      body: JSON.stringify({
        custom_fields: toCustomFields({ email, wealth_step, region, source }),
      }),
    });

    if (!patch.res.ok) {
      return NextResponse.json({ ok: false, error: "Beehiiv error." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

