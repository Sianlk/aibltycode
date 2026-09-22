import { describe, expect, it } from "vitest";
import { buildRetentionPlan, evaluateFastRecall, evaluateRecall, nextReviewState, retentionEngineSelfTest } from "./retentionEngine";
import type { LessonData } from "./lessons";

const lesson: LessonData = {
  id: "test-http",
  moduleId: "web-technologies",
  title: "HTTP Requests",
  xpReward: 100,
  category: "Web Technologies",
  steps: [
    {
      type: "quiz",
      title: "Request Method",
      difficulty: "easy",
      question: "Which HTTP method usually retrieves a resource?",
      options: [
        { label: "A", text: "GET" },
        { label: "B", text: "DELETE" },
        { label: "C", text: "PATCH" }
      ],
      correctAnswer: "A",
      explanation: "GET requests retrieve a representation of a resource without asking the server to delete or modify it."
    },
    {
      type: "typing",
      title: "Fetch",
      difficulty: "medium",
      prompt: "Type a minimal fetch call.",
      codeToType: "fetch('/api/items')",
      explanation: "fetch starts an HTTP request from JavaScript."
    }
  ]
};

describe("retention scheduling", () => {
  it("uses the intended 1 day -> 6 day -> expanding successful review sequence", () => {
    const first = nextReviewState(5);
    const second = nextReviewState(5, first);
    const third = nextReviewState(5, second);

    expect(first.repetitions).toBe(1);
    expect(first.intervalDays).toBe(1);
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);
    expect(third.repetitions).toBe(3);
    expect(third.intervalDays).toBeGreaterThan(6);
  });

  it("resets a forgotten item so it returns quickly", () => {
    const mature = { repetitions: 5, intervalDays: 42, easeFactor: 2.5 };
    expect(nextReviewState(2, mature)).toEqual({ repetitions: 0, intervalDays: 1, easeFactor: 2.5 });
  });

  it("passes its built-in scheduler self-test", () => {
    expect(retentionEngineSelfTest()).toEqual([]);
  });
});

describe("retrieval scoring", () => {
  it("requires enough recalled language and a relevant keyword", () => {
    expect(evaluateRecall("GET is used to retrieve a resource from a server", ["get", "retrieve"], 5, 1).passed).toBe(true);
    expect(evaluateRecall("I think I remember something completely different", ["get", "retrieve"], 5, 1).passed).toBe(false);
  });

  it("can validate exact code recall independent of whitespace", () => {
    const challenge = {
      prompt: "Type it",
      expectedKeywords: ["fetch"],
      answerSummary: "fetch('/api/items')",
      codeToType: "fetch('/api/items')"
    };
    expect(evaluateFastRecall(" fetch( '/api/items' ) ", challenge)).toBe(true);
    expect(evaluateFastRecall("axios.get('/api/items')", challenge)).toBe(false);
  });
});

describe("lesson-derived mastery plan", () => {
  it("creates mnemonic, retrieval, child-teach and professional-transfer material from the lesson", () => {
    const plan = buildRetentionPlan(lesson);
    expect(plan.memoryCode).toBe("MIND");
    expect(plan.recall.prompt).toContain("HTTP method");
    expect(plan.recall.answerSummary.toLowerCase()).toContain("get");
    expect(plan.teachBackPrompt).toContain("8-year-old");
    expect(plan.transferPrompt).toContain("Professional transfer");
    expect(plan.keyTerms.length).toBeGreaterThan(0);
  });
});
