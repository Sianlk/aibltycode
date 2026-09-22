/**
 * Offline write queue.
 *
 * Lesson completions and game scores are user-critical writes. When the device
 * is offline (or the request fails), we persist the intent locally and replay
 * it once connectivity returns, so progress is never silently lost.
 */

const QUEUE_KEY = "aiblty-offline-queue";
const MAX_ITEMS = 500;

export type QueuedWrite =
  | { kind: "lesson"; moduleId: string; lessonId: string; score: number; at: number }
  | { kind: "game"; gameType: string; score: number; timeTaken?: number; accuracy?: number; at: number };

function read(): QueuedWrite[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: QueuedWrite[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-MAX_ITEMS)));
  } catch {
    /* storage full or blocked — nothing else we can do */
  }
}

export function getQueue(): QueuedWrite[] {
  return read();
}

export function enqueue(item: QueuedWrite) {
  const items = read();
  if (item.kind === "lesson") {
    // Keep only the best score per lesson to avoid unbounded duplicates.
    const idx = items.findIndex((i) => i.kind === "lesson" && i.lessonId === item.lessonId);
    if (idx >= 0) {
      const prev = items[idx] as Extract<QueuedWrite, { kind: "lesson" }>;
      items[idx] = { ...item, score: Math.max(prev.score, item.score) };
      write(items);
      return;
    }
  }
  items.push(item);
  write(items);
}

export function clearQueue() {
  write([]);
}

/** Queued lesson completions, used for optimistic offline progress display. */
export function queuedLessonCompletions() {
  return read().filter((i): i is Extract<QueuedWrite, { kind: "lesson" }> => i.kind === "lesson");
}

/**
 * Replay every queued write. Items that still fail stay in the queue for the
 * next attempt.
 */
export async function flushQueue(handler: (item: QueuedWrite) => Promise<void>) {
  const items = read();
  if (items.length === 0) return 0;
  const remaining: QueuedWrite[] = [];
  let flushed = 0;
  for (const item of items) {
    try {
      await handler(item);
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }
  write(remaining);
  return flushed;
}

export function isOnline() {
  return typeof navigator === "undefined" ? true : navigator.onLine !== false;
}