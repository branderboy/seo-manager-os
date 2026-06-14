/**
 * Thin provider abstraction so classification + copy generation can run on
 * OpenAI, Gemini, or a deterministic mock (for local dev / no API key).
 *
 * Every provider exposes a single `complete()` that takes a system + user
 * prompt and returns raw text. Callers parse JSON when they need structure.
 */

export type AiMessage = { role: "system" | "user"; content: string };

export interface AiProvider {
  readonly name: string;
  complete(messages: AiMessage[], opts?: { json?: boolean }): Promise<string>;
}

class OpenAiProvider implements AiProvider {
  readonly name = "openai";
  constructor(
    private apiKey: string,
    private model = process.env.OPENAI_MODEL || "gpt-4o-mini",
  ) {}

  async complete(messages: AiMessage[], opts?: { json?: boolean }): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.3,
        ...(opts?.json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) {
      throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

class GeminiProvider implements AiProvider {
  readonly name = "gemini";
  constructor(
    private apiKey: string,
    private model = process.env.GEMINI_MODEL || "gemini-1.5-flash",
  ) {}

  async complete(messages: AiMessage[], opts?: { json?: boolean }): Promise<string> {
    const system = messages.find((m) => m.role === "system")?.content;
    const userParts = messages.filter((m) => m.role === "user").map((m) => ({ text: m.content }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents: [{ role: "user", parts: userParts }],
        generationConfig: {
          temperature: 0.3,
          ...(opts?.json ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
}

/**
 * Deterministic fallback used when AI_PROVIDER="mock" or no API key is set.
 * Keeps the whole pipeline runnable offline; classification falls back to the
 * keyword heuristic and copy generation returns templated text.
 */
class MockProvider implements AiProvider {
  readonly name = "mock";
  async complete(messages: AiMessage[], opts?: { json?: boolean }): Promise<string> {
    if (opts?.json) {
      return JSON.stringify({ industry: "", sub_industry: "", confidence: 0 });
    }
    const user = messages.find((m) => m.role === "user")?.content ?? "";
    return `Generated draft based on:\n${user.slice(0, 240)}`;
  }
}

let cached: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cached) return cached;
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    cached = new OpenAiProvider(process.env.OPENAI_API_KEY);
  } else if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    cached = new GeminiProvider(process.env.GEMINI_API_KEY);
  } else {
    cached = new MockProvider();
  }
  return cached;
}

/** Tolerant JSON extraction — models sometimes wrap JSON in prose / code fences. */
export function parseJsonLoose<T>(raw: string): T | null {
  if (!raw) return null;
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
