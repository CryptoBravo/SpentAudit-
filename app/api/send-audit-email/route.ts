import { NextResponse } from "next/server";

import { getWealthStep } from "@/config/wealthSteps";
import { REGIONS } from "@/config/regions";
import { deriveStrengthWeakness } from "@/utils/insights";
import { deriveAuditResult } from "@/utils/auditResult";
import type { AuditFormState } from "@/types/audit";

type SendAuditEmailRequest = {
  email: string;
  answers: AuditFormState;
};

function requireResendApiKey() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing env var: RESEND_API_KEY");
  return key;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value: number, currency: string) {
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${formatted} ${currency}`;
}

function buildHtmlEmail(input: {
  headline: string;
  verdictVerb: string;
  identity: string;
  regionLabel: string;
  netWorth: string;
  runwayMonths: string;
  savingsRate: string;
  deploymentRate: string;
  observations: string[];
  nextActions: string[];
}) {
  const forest = "#1f4d3a";
  const ink = "#0f172a";
  const muted = "#475569";
  const wash = "#f3f5f4";
  const line = "#e2e8f0";
  const mintSoft = "#c9ddd4";

  const obs = input.observations
    .slice(0, 3)
    .map((o) => `<li style="margin:0 0 10px 0; padding:0; color:${ink};">${escapeHtml(o)}</li>`)
    .join("");

  const actions = input.nextActions
    .slice(0, 3)
    .map((a) => `<li style="margin:0 0 10px 0; padding:0; color:${ink};">${escapeHtml(a)}</li>`)
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Spent Audit — Your Results</title>
  </head>
  <body style="margin:0; padding:0; background:${wash}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${wash}; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px; background:#ffffff; border:1px solid ${line};">
            <tr>
              <td style="background:${forest}; padding:28px 26px; color:#ffffff;">
                <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:${mintSoft};">
                  ${escapeHtml(input.regionLabel)}
                </div>
                <div style="margin-top:10px; font-size:13px; letter-spacing:0.18em; text-transform:uppercase; color:${mintSoft};">
                  ${escapeHtml(input.headline)}
                </div>
                <div style="margin-top:10px; font-size:44px; line-height:1.05; letter-spacing:-0.02em; font-weight:700;">
                  ${escapeHtml(input.verdictVerb)}.
                </div>
                <div style="margin-top:14px; font-size:16px; font-style:italic; line-height:1.4; color:${mintSoft};">
                  “${escapeHtml(input.identity)}”
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 22px 10px 22px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:14px; border:1px solid ${line};">
                      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                        Net worth
                      </div>
                      <div style="margin-top:8px; font-size:28px; letter-spacing:-0.02em; color:${forest}; font-weight:700;">
                        ${escapeHtml(input.netWorth)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px; border-left:1px solid ${line}; border-right:1px solid ${line}; border-bottom:1px solid ${line};">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="width:50%; padding-right:10px;">
                            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                              Runway
                            </div>
                            <div style="margin-top:6px; font-size:20px; color:${ink}; font-weight:700;">
                              ${escapeHtml(input.runwayMonths)}
                            </div>
                          </td>
                          <td style="width:50%; padding-left:10px;">
                            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                              Savings rate
                            </div>
                            <div style="margin-top:6px; font-size:20px; color:${ink}; font-weight:700;">
                              ${escapeHtml(input.savingsRate)}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="width:50%; padding-right:10px; padding-top:14px;">
                            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                              Deployment rate
                            </div>
                            <div style="margin-top:6px; font-size:20px; color:${ink}; font-weight:700;">
                              ${escapeHtml(input.deploymentRate)}
                            </div>
                          </td>
                          <td style="width:50%; padding-left:10px; padding-top:14px;">
                            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                              Headline verdict
                            </div>
                            <div style="margin-top:6px; font-size:20px; color:${ink}; font-weight:700;">
                              ${escapeHtml(input.headline)}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:6px 22px 4px 22px;">
                <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                  Top observations
                </div>
                <ul style="margin:10px 0 0 18px; padding:0;">
                  ${obs}
                </ul>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 22px 18px 22px;">
                <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${muted};">
                  Next actions
                </div>
                <ul style="margin:10px 0 0 18px; padding:0;">
                  ${actions}
                </ul>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 22px 26px 22px; border-top:1px solid ${line}; color:${muted}; font-size:12px; line-height:1.5;">
                This email is your snapshot. If you want to rerun the audit later, use the same link and refresh your numbers.
              </td>
            </tr>
          </table>
          <div style="margin-top:12px; color:${muted}; font-size:11px;">
            Spent Audit
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendWithResend(input: { to: string; subject: string; html: string }) {
  const apiKey = requireResendApiKey();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Spent Audit <audit@spentmemo.com>",
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) {
    console.error("[resend] send failed", res.status, json);
    throw new Error("Email send failed.");
  }

  return json as unknown;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SendAuditEmailRequest>;
    const email = (body.email ?? "").trim().toLowerCase();
    const answers = body.answers as AuditFormState | undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }
    if (!answers) {
      return NextResponse.json({ ok: false, error: "Missing audit data." }, { status: 400 });
    }

    const result = deriveAuditResult(answers);
    const content = getWealthStep(result.step);
    const sw = deriveStrengthWeakness(result.calc, content);
    const currency = answers.currency || "USD";
    const region = REGIONS.find((r) => r.id === answers.region);

    const observations = [
      sw.strength,
      sw.weakness,
      content.benchmarkPositioning,
    ].filter(Boolean);

    const nextActions = [
      content.nextMove,
      region
        ? `Aim for runway in the ${region.runwayMonths[0]}–${region.runwayMonths[1]} month range before you take bigger risks.`
        : "Aim for a runway range that keeps you calm when something breaks.",
      "Rerun the audit after your next pay cycle to see what actually moved.",
    ].filter(Boolean);

    const html = buildHtmlEmail({
      headline: content.headline,
      verdictVerb: content.verb,
      identity: content.identity,
      regionLabel: region ? `${region.label} · FULL AUDIT` : "FULL AUDIT",
      netWorth: formatMoney(result.calc.netWorth, currency),
      runwayMonths: `${result.calc.runwayMonths.toFixed(1)} months`,
      savingsRate: `${result.calc.savingsRate.toFixed(1)}%`,
      deploymentRate: `${result.calc.deploymentRate.toFixed(1)}%`,
      observations,
      nextActions,
    });

    await sendWithResend({
      to: email,
      subject: `Your Spent Audit — ${content.headline}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

