/**
 * Privacy-friendly, opt-in analytics.
 *
 * Design rules (do not weaken):
 *  - Opt-in only: nothing is recorded until the learner explicitly grants consent.
 *  - No PII: no user id, email, name, free text, IP or device fingerprint is stored.
 *  - Local-first: events stay in this browser (localStorage), capped and rotated.
 *  - Anonymous + rotating: events carry a daily-rotating random id, not a stable one.
 *  - Revocable: withdrawing consent erases every stored event immediately.
 */

export type AnalyticsConsent = "granted" | "denied";

export type AnalyticsEventName = "lesson_completed" | "retention_ping";

export interface AnalyticsEvent {
  /** Event name (fixed enum, never free text). */
  name: AnalyticsEventName;
  /** Day bucket (YYYY-MM-DD) instead of a precise timestamp. */
  day: string;
  /** Rotating anonymous id, changes every day. */
  anonId: string;
  /** Non-identifying numeric/enum properties only. */
  props: Record<string, string | number | boolean>;
}

const CONSENT_KEY = "aiblty-analytics-consent";
const EVENTS_KEY = "aiblty-analytics-events";
const ANON_KEY = "aiblty-analytics-anon";
const FIRST_DAY_KEY = "aiblty-analytics-first-day";
const MAX_EVENTS = 200;

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function store(): Store | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    }
  } catch {
    /* fall through */
  }
  return Math.random().toString(36).slice(2, 18);
}

/** Current consent. Defaults to "denied" — analytics is strictly opt-in. */
export function getConsent(): AnalyticsConsent {
  const s = store();
  return s?.getItem(CONSENT_KEY) === "granted" ? "granted" : "denied";
}

export function hasConsent(): boolean {
  return getConsent() === "granted";
}

/** Grant or revoke consent. Revoking wipes all locally stored analytics data. */
export function setConsent(consent: AnalyticsConsent): void {
  const s = store();
  if (!s) return;
  if (consent === "granted") {
    s.setItem(CONSENT_KEY, "granted");
  } else {
    s.setItem(CONSENT_KEY, "denied");
    clearAnalyticsData();
  }
}

/** Remove every stored analytics artefact (events + rotating id + cohort day). */
export function clearAnalyticsData(): void {
  const s = store();
  if (!s) return;
  s.removeItem(EVENTS_KEY);
  s.removeItem(ANON_KEY);
  s.removeItem(FIRST_DAY_KEY);
}

function anonId(day: string): string {
  const s = store();
  if (!s) return "anon";
  const raw = s.getItem(ANON_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { day: string; id: string };
      if (parsed.day === day && parsed.id) return parsed.id;
    } catch {
      /* regenerate below */
    }
  }
  const id = randomId();
  s.setItem(ANON_KEY, JSON.stringify({ day, id }));
  return id;
}

export function getEvents(): AnalyticsEvent[] {
  const s = store();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s.getItem(EVENTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function record(name: AnalyticsEventName, props: Record<string, string | number | boolean>, now = new Date()): AnalyticsEvent | null {
  if (!hasConsent()) return null;
  const s = store();
  if (!s) return null;
  const day = today(now);
  const event: AnalyticsEvent = { name, day, anonId: anonId(day), props };
  const events = [...getEvents(), event].slice(-MAX_EVENTS);
  try {
    s.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    return null;
  }
  return event;
}

/** Coarse buckets keep scores non-identifying. */
function scoreBucket(score: number): string {
  if (score >= 90) return "90-100";
  if (score >= 70) return "70-89";
  if (score >= 50) return "50-69";
  return "0-49";
}

/**
 * Lesson completion event. Only module id, a hashed-free lesson slug and coarse
 * buckets are stored — never answers, code, timing traces or user identity.
 */
export function trackLessonCompleted(input: {
  moduleId: string;
  lessonId: string;
  score: number;
  stepCount?: number;
}): AnalyticsEvent | null {
  return record("lesson_completed", {
    module_id: input.moduleId,
    lesson_id: input.lessonId,
    score_bucket: scoreBucket(input.score),
    steps: Math.max(0, Math.round(input.stepCount ?? 0)),
  });
}

/**
 * Retention event: one per day at most. Stores only cohort age in days and the
 * current streak length, so retention curves can be computed without identity.
 */
export function trackRetentionPing(streakDays = 0, now = new Date()): AnalyticsEvent | null {
  if (!hasConsent()) return null;
  const s = store();
  if (!s) return null;
  const day = today(now);
  if (getEvents().some((e) => e.name === "retention_ping" && e.day === day)) return null;

  let firstDay = s.getItem(FIRST_DAY_KEY);
  if (!firstDay) {
    firstDay = day;
    s.setItem(FIRST_DAY_KEY, firstDay);
  }
  const daysSinceFirst = Math.max(
    0,
    Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${firstDay}T00:00:00Z`)) / 86_400_000),
  );

  return record("retention_ping", {
    days_since_first_use: daysSinceFirst,
    streak_days: Math.max(0, Math.round(streakDays)),
    returning: daysSinceFirst > 0,
  }, now);
}

/** Aggregated, human-readable summary for the Settings "what we store" panel. */
export function getAnalyticsSummary() {
  const events = getEvents();
  return {
    total: events.length,
    lessonsCompleted: events.filter((e) => e.name === "lesson_completed").length,
    activeDays: new Set(events.filter((e) => e.name === "retention_ping").map((e) => e.day)).size,
  };
}
