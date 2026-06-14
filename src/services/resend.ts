/**
 * Email delivery via Resend. Falls back to a mock (logs + pretends to send)
 * when RESEND_API_KEY is unset, so outreach flows run end-to-end in dev.
 */

export type SendInput = {
  to: string;
  subject: string;
  /** Plain-text body; converted to simple HTML with an unsubscribe footer. */
  text: string;
  unsubscribeUrl?: string;
};

export type SendResult = {
  ok: boolean;
  id?: string;
  error?: string;
  mocked?: boolean;
};

export function isResendEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

function toHtml(text: string, unsubscribeUrl?: string): string {
  const body = text
    .split("\n")
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : "<br/>"))
    .join("");
  const footer = unsubscribeUrl
    ? `<hr/><p style="font-size:12px;color:#888">If you'd rather not hear from us, <a href="${unsubscribeUrl}">unsubscribe</a>.</p>`
    : "";
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.5">${body}${footer}</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendEmail(input: SendInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.log(`[resend:mock] would send to ${input.to}: "${input.subject}"`);
    return { ok: true, id: `mock_${Date.now()}`, mocked: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: toHtml(input.text, input.unsubscribeUrl),
        ...(input.unsubscribeUrl
          ? { headers: { "List-Unsubscribe": `<${input.unsubscribeUrl}>` } }
          : {}),
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
    }
    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
