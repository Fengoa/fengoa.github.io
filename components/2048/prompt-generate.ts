/** Prompt → bot script via OpenAI-compatible Chat Completions (token in localStorage). */

export type ScriptMode = "prompt" | "code";

export type GeneratedBot = {
  label: string;
  script: string;
  thinking: string;
  raw: string;
};

const TOKEN_KEY = "oriensx-2048-arena-llm-token";
const BASE_KEY = "oriensx-2048-arena-llm-base";
const MODEL_KEY = "oriensx-2048-arena-llm-model";

export const DEFAULT_LLM_BASE = "https://api.openai.com/v1";
export const DEFAULT_LLM_MODEL = "gpt-4o-mini";

export function loadLlmToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function saveLlmToken(token: string) {
  if (!token.trim()) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token.trim());
}

export function loadLlmBase() {
  if (typeof window === "undefined") return DEFAULT_LLM_BASE;
  return localStorage.getItem(BASE_KEY) || DEFAULT_LLM_BASE;
}

export function saveLlmBase(base: string) {
  const next = base.trim().replace(/\/$/, "") || DEFAULT_LLM_BASE;
  localStorage.setItem(BASE_KEY, next);
}

export function loadLlmModel() {
  if (typeof window === "undefined") return DEFAULT_LLM_MODEL;
  return localStorage.getItem(MODEL_KEY) || DEFAULT_LLM_MODEL;
}

export function saveLlmModel(model: string) {
  const next = model.trim() || DEFAULT_LLM_MODEL;
  localStorage.setItem(MODEL_KEY, next);
}

/** GET {base}/models — OpenAI-compatible model list. */
export async function fetchLlmModels(input: {
  token: string;
  baseUrl?: string;
  signal?: AbortSignal;
}): Promise<string[]> {
  const token = input.token.trim();
  if (!token) throw new Error("Paste an API token first.");

  const base = (input.baseUrl || DEFAULT_LLM_BASE).replace(/\/$/, "");
  const res = await fetch(`${base}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: input.signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = (await res.json()) as { error?: { message?: string } };
      detail = err.error?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      detail
        ? `Models request failed (${res.status}): ${detail}`
        : `Models request failed (${res.status}).`
    );
  }

  const data = (await res.json()) as {
    data?: Array<{ id?: string } | string>;
    models?: Array<{ id?: string; name?: string } | string>;
  };

  const raw = data.data ?? data.models ?? [];
  const ids = raw
    .map((item): string => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        if (typeof item.id === "string") return item.id;
        if ("name" in item && typeof item.name === "string") return item.name;
      }
      return "";
    })
    .map((id) => id.trim())
    .filter(Boolean);

  const unique = [...new Set(ids)].sort((a, b) => a.localeCompare(b));
  if (unique.length === 0) throw new Error("No models returned from this URL.");
  return unique;
}

const SYSTEM_PROMPT = `You write JavaScript bots for a browser 2048 Arena.

Contract (must follow):
- Prefer a sync function chooseMove(board) that returns 'up' | 'down' | 'left' | 'right' or null.
- board is a 4×4 number[][]; 0 means empty.
- Or export async function play(api) and drive the game with:
  api.board(), api.score(), api.over(), api.move(dir), api.sleep(ms), api.log(...).
- No imports, no DOM, no fetch, no Node APIs. Plain browser JS only.

Reply structure:
1) First, a short Thinking section in plain language (what strategy and why).
2) Then the final JavaScript inside one \`\`\`javascript code fence.
Do not put explanation after the code fence.`;

export function extractScript(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:javascript|js)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return trimmed;
}

function labelFromPrompt(prompt: string) {
  const word =
    prompt.trim().split(/\s+/)[0]?.replace(/[^a-zA-Z0-9_\u4e00-\u9fff-]/g, "") ||
    "prompt";
  return word.slice(0, 24).toLowerCase() || "prompt";
}

type StreamHandlers = {
  onThinking?: (full: string) => void;
  onContent?: (full: string) => void;
  signal?: AbortSignal;
};

type Delta = {
  content?: string | null;
  reasoning_content?: string | null;
  reasoning?: string | null;
};

function deltaThinking(delta: Delta) {
  return delta.reasoning_content ?? delta.reasoning ?? "";
}

/**
 * Stream an OpenAI-compatible chat completion. Fills the editor from the
 * final code fence (or raw content if no fence).
 */
export async function generateBotFromPrompt(
  input: {
    prompt: string;
    token: string;
    baseUrl?: string;
    model?: string;
  },
  handlers: StreamHandlers = {}
): Promise<GeneratedBot> {
  const prompt = input.prompt.trim();
  const token = input.token.trim();
  if (!prompt) throw new Error("Enter a strategy prompt.");
  if (!token) throw new Error("Paste an API token first.");

  const base = (input.baseUrl || DEFAULT_LLM_BASE).replace(/\/$/, "");
  const model = input.model || DEFAULT_LLM_MODEL;
  const endpoint = `${base}/chat/completions`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write a 2048 bot for this strategy:\n\n${prompt}`,
        },
      ],
    }),
    signal: handlers.signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = (await res.json()) as { error?: { message?: string } };
      detail = err.error?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      detail
        ? `LLM request failed (${res.status}): ${detail}`
        : `LLM request failed (${res.status}).`
    );
  }

  if (!res.body) throw new Error("LLM response had no body to stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let thinking = "";
  let content = "";
  /** Content before the first code fence — treated as thinking when API has no reasoning field. */
  let preamble = "";
  let inFence = false;
  let sawNativeThinking = false;

  const pushContent = (chunk: string) => {
    if (!chunk) return;
    content += chunk;
    handlers.onContent?.(content);

    if (sawNativeThinking) return;

    // Split streamed markdown: text before ``` → thinking, rest stays in content panel
    if (!inFence) {
      preamble += chunk;
      const fenceAt = preamble.search(/```(?:javascript|js)?/i);
      if (fenceAt >= 0) {
        inFence = true;
        const before = preamble.slice(0, fenceAt).trim();
        if (before) {
          thinking = thinking ? `${thinking}\n${before}` : before;
          handlers.onThinking?.(thinking);
        }
      } else if (preamble.trim()) {
        handlers.onThinking?.(preamble.trim());
      }
    }
  };

  const pushThinking = (chunk: string) => {
    if (!chunk) return;
    sawNativeThinking = true;
    thinking += chunk;
    handlers.onThinking?.(thinking);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          choices?: Array<{ delta?: Delta }>;
        };
        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;
        pushThinking(deltaThinking(delta));
        pushContent(delta.content ?? "");
      } catch {
        // ignore partial JSON
      }
    }
  }

  if (!content.trim() && !thinking.trim()) {
    throw new Error("Model returned an empty stream.");
  }

  const script = extractScript(content);
  if (!/function\s+chooseMove|function\s+play|async\s+function\s+play/.test(script)) {
    throw new Error(
      "Model output missing chooseMove(board) or play(api). Try again."
    );
  }

  return {
    label: labelFromPrompt(prompt),
    script,
    thinking: thinking || preamble.trim(),
    raw: content,
  };
}
