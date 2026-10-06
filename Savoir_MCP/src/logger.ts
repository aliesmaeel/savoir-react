/**
 * Minimal structured JSON logger.
 *
 * Rule: callers log only operational metadata (tool name, outcome, duration,
 * status codes). Never pass tool arguments, contact details, CMS bodies or
 * headers. As a second line of defence, known personal-data keys are redacted
 * and email/phone-like strings are masked.
 */

type Level = "debug" | "info" | "warn" | "error";
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const SENSITIVE_KEYS = /^(name|email|phone|message|authorization|cookie|token|secret|password|confirmation_token|body|args|arguments)$/i;
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// Digits joined by spaces, dashes or parentheses (not dots, so IPs and versions survive).
const PHONE = /\+?\d[\d\s()-]{7,}\d/g;

export interface Logger {
  debug(msg: string, fields?: Record<string, unknown>): void;
  info(msg: string, fields?: Record<string, unknown>): void;
  warn(msg: string, fields?: Record<string, unknown>): void;
  error(msg: string, fields?: Record<string, unknown>): void;
}

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[truncated]";
  if (typeof value === "string") {
    return value.replace(EMAIL, "[email]").replace(PHONE, "[phone]").slice(0, 500);
  }
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => redact(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEYS.test(k) ? "[redacted]" : redact(v, depth + 1);
    }
    return out;
  }
  return value;
}

export function createLogger(level: Level = "info", sink: (line: string) => void = (l) => process.stdout.write(l + "\n")): Logger {
  const emit = (lvl: Level, msg: string, fields?: Record<string, unknown>) => {
    if (ORDER[lvl] < ORDER[level]) return;
    const safe = fields ? (redact(fields) as Record<string, unknown>) : {};
    sink(JSON.stringify({ ts: new Date().toISOString(), level: lvl, msg, ...safe }));
  };
  return {
    debug: (m, f) => emit("debug", m, f),
    info: (m, f) => emit("info", m, f),
    warn: (m, f) => emit("warn", m, f),
    error: (m, f) => emit("error", m, f),
  };
}

export const silentLogger: Logger = { debug() {}, info() {}, warn() {}, error() {} };
