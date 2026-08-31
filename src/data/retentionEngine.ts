import type { LessonData, LessonStep } from "./lessons";

export interface RecallChallenge {
  prompt: string;
  expectedKeywords: string[];
  answerSummary: string;
}

export interface FastRecallChallenge extends RecallChallenge {
  options?: { label: string; text: string }[];
  correctAnswer?: string;
  codeToType?: string;
}

export interface RetentionPlan {
  lessonId: string;
  moduleId: string;
  title: string;
  memoryCode: string;
  childSimpleMeaning: string;
  visualAnchor: string;
  keyTerms: string[];
  recall: RecallChallenge;
  teachBackPrompt: string;
  fastRecall: FastRecallChallenge;
  transferPrompt: string;
}

export interface ReviewScheduleItem {
  lessonId: string;
  moduleId: string;
  title: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  lastQuality: number;
  updatedAt: string;
}

const REVIEW_STORAGE_KEY = "aibltycode-review-schedule-v1";

const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "because", "been", "before", "being", "between",
  "but", "can", "could", "does", "each", "every", "for", "from", "have", "into", "its", "just", "like",
  "more", "most", "not", "only", "other", "our", "out", "over", "same", "should", "that", "the", "their",
  "then", "there", "these", "they", "this", "through", "use", "used", "using", "very", "what", "when",
  "where", "which", "while", "will", "with", "you", "your", "than", "them", "such", "how", "why"
]);

function stripCodeNoise(value: string): string {
  return value
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[{}()[\];,:<>="'`]/g, " ")
    .replace(/[_./\\|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text: string, limit = 8): string[] {
  const words = stripCodeNoise(text)
    .toLowerCase()
    .match(/[a-z][a-z0-9+#-]{2,}/g) ?? [];

  const counts = new Map<string, number>();
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function correctOptionText(step?: LessonStep): string {
  if (!step?.correctAnswer || !step.options) return "";
  return step.options.find((option) => option.label === step.correctAnswer)?.text ?? "";
}

function stepKnowledge(step?: LessonStep): string {
  if (!step) return "";
  return [
    step.title,
    step.question,
    step.prompt,
    correctOptionText(step),
    step.codeToType,
    step.correctPlacement,
    step.explanation
  ].filter(Boolean).join(" ");
}

function concise(value: string, max = 220): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trim()}…`;
}

function chooseRecallStep(lesson: LessonData): LessonStep | undefined {
  return lesson.steps.find((step) => step.type === "quiz") ?? lesson.steps[0];
}

function chooseFastStep(lesson: LessonData, recallStep?: LessonStep): LessonStep | undefined {
  return lesson.steps.find((step) => step !== recallStep && step.type === "quiz")
    ?? lesson.steps.find((step) => step !== recallStep && step.type === "typing")
    ?? recallStep
    ?? lesson.steps[0];
}

function makeRecall(step: LessonStep | undefined, lesson: LessonData): RecallChallenge {
  const answer = correctOptionText(step) || step?.codeToType || step?.correctPlacement || step?.explanation || lesson.title;
  const knowledge = `${lesson.title} ${stepKnowledge(step)} ${answer}`;
  const keywords = extractKeywords(knowledge, 6);
  const prompt = step?.question
    ?? step?.prompt
    ?? `Without looking back, explain the most important idea in ${lesson.title}.`;

  return {
    prompt,
    expectedKeywords: keywords,
    answerSummary: concise(`${answer}. ${step?.explanation ?? ""}`)
  };
}

function makeFastRecall(step: LessonStep | undefined, lesson: LessonData): FastRecallChallenge {
  const base = makeRecall(step, lesson);
  if (step?.type === "quiz" && step.options?.length && step.correctAnswer) {
    return {
      ...base,
      prompt: step.question ?? `Choose the correct answer about ${lesson.title}.`,
      options: step.options,
      correctAnswer: step.correctAnswer
    };
  }

  if (step?.type === "typing" && step.codeToType) {
    return {
      ...base,
      prompt: step.prompt ?? `Type the key pattern for ${lesson.title} from memory.`,
      codeToType: step.codeToType
    };
  }

  return base;
}

export function buildRetentionPlan(lesson: LessonData): RetentionPlan {
  const recallStep = chooseRecallStep(lesson);
  const fastStep = chooseFastStep(lesson, recallStep);
  const allKnowledge = [lesson.title, lesson.category, ...lesson.steps.map(stepKnowledge)].join(" ");
  const keyTerms = extractKeywords(allKnowledge, 6);
  const primaryTerm = keyTerms[0] ?? lesson.title;
  const secondaryTerm = keyTerms[1] ?? "example";
  const meaning = concise(recallStep?.explanation || lesson.steps[0]?.explanation || `Learn what ${lesson.title} means and how to use it.`);

  return {
    lessonId: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    memoryCode: "MIND",
    childSimpleMeaning: meaning,
    visualAnchor: `Imagine ${lesson.title} as a bright toolbox. The biggest tool is labelled “${primaryTerm}” and the next is “${secondaryTerm}”. The silly picture is your memory hook.`,
    keyTerms,
    recall: makeRecall(recallStep, lesson),
    teachBackPrompt: `Teach ${lesson.title} to an 8-year-old in your own words. Say what it is, why it matters, and one tiny example. Avoid copying the lesson wording.`,
    fastRecall: makeFastRecall(fastStep, lesson),
    transferPrompt: `Professional transfer: where would you use ${lesson.title} in a real project, job, system, investigation or decision? Explain what you would do and why.`
  };
}

export function normalizeRecall(value: string): string {
  return stripCodeNoise(value).toLowerCase();
}

export function evaluateRecall(
  input: string,
  expectedKeywords: string[],
  minWords = 5,
  minKeywordMatches = 1
): { passed: boolean; wordCount: number; keywordMatches: string[] } {
  const normalized = normalizeRecall(input);
  const words = normalized.split(/\s+/).filter(Boolean);
  const keywordMatches = expectedKeywords.filter((keyword) => normalized.includes(normalizeRecall(keyword)));
  return {
    passed: words.length >= minWords && (expectedKeywords.length === 0 || keywordMatches.length >= Math.min(minKeywordMatches, expectedKeywords.length)),
    wordCount: words.length,
    keywordMatches
  };
}

export function evaluateFastRecall(input: string, challenge: FastRecallChallenge): boolean {
  if (challenge.codeToType) {
    return input.replace(/\s+/g, "").trim() === challenge.codeToType.replace(/\s+/g, "").trim();
  }
  return evaluateRecall(input, challenge.expectedKeywords, 2, 1).passed;
}

function readSchedule(): ReviewScheduleItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSchedule(items: ReviewScheduleItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Learning still works when storage is unavailable; signed-in users also persist to Supabase.
  }
}

export function nextReviewState(
  quality: number,
  previous?: Pick<ReviewScheduleItem, "repetitions" | "intervalDays" | "easeFactor">
): Pick<ReviewScheduleItem, "repetitions" | "intervalDays" | "easeFactor"> {
  const currentEase = previous?.easeFactor ?? 2.5;
  const currentInterval = previous?.intervalDays ?? 1;
  const repetitions = previous?.repetitions ?? 0;

  if (quality < 3) {
    return { repetitions: 0, intervalDays: 1, easeFactor: currentEase };
  }

  const easeFactor = Math.max(1.3, currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const intervalDays = repetitions === 0
    ? 1
    : repetitions === 1
      ? 6
      : Math.max(1, Math.round(currentInterval * easeFactor));

  return { repetitions: repetitions + 1, intervalDays, easeFactor };
}

export function scheduleLocalReview(
  lesson: Pick<LessonData, "id" | "moduleId" | "title">,
  quality: number
): ReviewScheduleItem {
  const schedule = readSchedule();
  const previous = schedule.find((item) => item.lessonId === lesson.id);
  const state = nextReviewState(quality, previous);
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + state.intervalDays);

  const item: ReviewScheduleItem = {
    lessonId: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    repetitions: state.repetitions,
    intervalDays: state.intervalDays,
    easeFactor: state.easeFactor,
    nextReviewAt: nextReview.toISOString(),
    lastQuality: quality,
    updatedAt: now.toISOString()
  };

  writeSchedule([...schedule.filter((entry) => entry.lessonId !== lesson.id), item]);
  return item;
}

export function getReviewSchedule(): ReviewScheduleItem[] {
  return readSchedule().sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
}

export function getDueLocalReviews(now = new Date()): ReviewScheduleItem[] {
  return getReviewSchedule().filter((item) => new Date(item.nextReviewAt).getTime() <= now.getTime());
}

export function retentionEngineSelfTest(): string[] {
  const failures: string[] = [];
  const first = nextReviewState(5);
  const second = nextReviewState(5, first);
  const third = nextReviewState(5, second);
  const failed = nextReviewState(2, third);

  if (first.intervalDays !== 1 || first.repetitions !== 1) failures.push("first review must schedule at 1 day");
  if (second.intervalDays !== 6 || second.repetitions !== 2) failures.push("second review must schedule at 6 days");
  if (third.intervalDays <= second.intervalDays || third.repetitions !== 3) failures.push("mature review interval must expand");
  if (failed.intervalDays !== 1 || failed.repetitions !== 0) failures.push("failed recall must reset to 1 day");
  return failures;
}
