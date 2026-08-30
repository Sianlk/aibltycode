import type { LessonStep } from "./lessons";

type ExpandedProfile = {
  label: string;
  workplace: string;
  analogy: string;
  artifact: string;
  safety: string;
  practical: (title: string, description: string) => string;
};

const profiles: Record<string, ExpandedProfile> = {
  "python-programming": {
    label: "Python engineering",
    workplace: "a real Python project that must be readable, testable and maintainable",
    analogy: "a precise recipe: inputs go in, named steps transform them, and a result comes out",
    artifact: "a small working script plus a test or verification step",
    safety: "validate inputs, handle errors, use a virtual environment, and never hard-code secrets",
    practical: (title, description) => `# PRACTICAL: ${title}\n# Goal: ${description}\n\ndef demonstrate_topic(value):\n    \"\"\"Explain and apply ${title} in one small, testable function.\"\"\"\n    result = value\n    return result\n\nexample = demonstrate_topic(\"practice\")\nprint(example)\n# Next: replace the placeholder transformation with the lesson concept and test an edge case.`,
  },
  "javascript-web": {
    label: "JavaScript and modern web engineering",
    workplace: "a production web feature that must work across devices and remain accessible",
    analogy: "the nervous system of a web page: events are signals and functions decide what happens next",
    artifact: "a working browser feature with a visible result and a verification step",
    safety: "escape untrusted content, validate data, preserve accessibility, and test loading/error states",
    practical: (title, description) => `// PRACTICAL: ${title}\n// Goal: ${description}\n\nfunction demonstrateTopic(input) {\n  const result = input;\n  return result;\n}\n\nconsole.log(demonstrateTopic(\"practice\"));\n// Next: adapt the function or DOM behaviour to demonstrate this lesson, then test one failure case.`,
  },
  "ai-builder": {
    label: "AI product and agent engineering",
    workplace: "an AI assistant or agent that must be useful, measurable, safe and observable in production",
    analogy: "a new employee: it needs a clear job, reliable source material, tools with permissions, checks and supervision",
    artifact: "an AI behaviour contract with inputs, outputs, tools, evaluation cases and monitoring signals",
    safety: "minimise permissions, defend against prompt injection, protect private data, evaluate outputs and monitor drift/cost",
    practical: (title, description) => `AI BUILD CARD — ${title}\nObjective: ${description}\nInput contract: define exactly what the user or system supplies.\nOutput contract: define the required structure and success criteria.\nKnowledge: list approved sources; do not invent missing facts.\nTools: grant only the minimum actions needed.\nEvaluation: write one normal, one edge and one adversarial test.\nMonitoring: record quality, latency, cost and safety failures.\nHuman control: define when the system must stop or escalate.`,
  },
  "digital-marketing": {
    label: "SEO and digital growth",
    workplace: "a real site or campaign where traffic only matters if it reaches the right audience and converts ethically",
    analogy: "a shop on a busy street: technical SEO makes the door reachable, content explains the offer, and analytics shows what people actually do",
    artifact: "a measurable optimisation brief with baseline, change, target metric and review date",
    safety: "avoid deceptive claims, keyword stuffing, spam links and dark patterns; protect analytics consent and user privacy",
    practical: (title, description) => `GROWTH EXPERIMENT — ${title}\nGoal: ${description}\nAudience: define one specific searcher/customer and their intent.\nBaseline: record the current metric before changing anything.\nChange: specify one controlled improvement.\nMeasure: impressions -> clicks -> engagement -> conversion.\nQuality check: useful, accurate, accessible and fast on mobile.\nDecision rule: keep, iterate or revert based on evidence rather than vanity metrics.`,
  },
  "animation-motion": {
    label: "animation and motion design",
    workplace: "an interface or visual sequence where motion must communicate meaning without harming performance or accessibility",
    analogy: "stage direction: timing tells the viewer where to look and what changed",
    artifact: "a motion prototype with purpose, duration, easing, performance and reduced-motion behaviour documented",
    safety: "respect prefers-reduced-motion, avoid seizure-risk flashing, keep interactions responsive and animate transform/opacity where practical",
    practical: (title, description) => `/* PRACTICAL: ${title} — ${description} */\n.motion-demo {\n  transform: translateY(0);\n  opacity: 1;\n  transition: transform 240ms ease, opacity 240ms ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .motion-demo { transition: none; }\n}\n/* Next: adapt timing, easing or keyframes to demonstrate this lesson and explain why the motion exists. */`,
  },
  "software-tools": {
    label: "professional IT, enterprise systems and infrastructure",
    workplace: "a business system where hardware, networks, enterprise applications and legacy services must keep working together",
    analogy: "an airport: many specialised systems exchange information through agreed routes, identities and operating procedures",
    artifact: "a tested runbook containing prerequisites, configuration, verification, rollback and evidence",
    safety: "back up first, use least privilege, document changes, protect credentials, test in a lab and keep a rollback path",
    practical: (title, description) => `OPERATIONS RUNBOOK — ${title}\nPurpose: ${description}\n1. Inventory: record device/app/version, owner and dependencies.\n2. Baseline: capture the working state before change.\n3. Plan: define configuration and compatibility requirements.\n4. Lab test: reproduce safely before production.\n5. Implement: make the smallest controlled change.\n6. Verify: test connectivity, data flow, permissions and logs.\n7. Rollback: restore the known-good state if verification fails.\n8. Evidence: record commands/screenshots/results and update documentation.`,
  },
  "project-delivery": {
    label: "professional project and service delivery",
    workplace: "a real delivery with stakeholders, constraints, risks, evidence and a definition of done",
    analogy: "a journey with a destination, map, checkpoints and rules for changing route without losing control",
    artifact: "a one-page delivery pack linking outcome, scope, work, owners, dependencies, risk, acceptance and metrics",
    safety: "make ownership explicit, surface risks early, control scope changes and never report progress without evidence",
    practical: (title, description) => `DELIVERY CARD — ${title}\nOutcome: ${description}\nScope: write what is IN and explicitly what is OUT.\nMethod: explain why Waterfall, Agile/Scrum, Kanban or hybrid fits this work.\nWork: break the outcome into verifiable deliverables.\nOwners: assign one accountable owner per item.\nDependencies: record blockers and sequencing.\nRisk: probability x impact x mitigation x owner.\nAcceptance: define objective done criteria.\nEvidence: identify the metric, demo, test or sign-off that proves completion.`,
  },
};

const quiz = (
  title: string,
  question: string,
  correctText: string,
  wrongB: string,
  wrongC: string,
  explanation: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
): LessonStep => ({
  type: "quiz",
  title,
  difficulty,
  question,
  options: [
    { label: "A", text: correctText },
    { label: "B", text: wrongB },
    { label: "C", text: wrongC },
  ],
  correctAnswer: "A",
  explanation,
});

const typing = (
  title: string,
  prompt: string,
  codeToType: string,
  explanation: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
): LessonStep => ({ type: "typing", title, prompt, codeToType, explanation, difficulty });

/**
 * Gives every expansion-module lesson a subject-aware eight-step mastery cycle.
 * This deliberately uses the lesson metadata as the concept source while making
 * the practice, professional context, risk controls and capstone domain-specific.
 */
export function generateExpandedMasterySteps(
  lessonId: string,
  title: string,
  description: string,
  moduleId: string,
): LessonStep[] | null {
  const profile = profiles[moduleId];
  if (!profile) return null;

  const shortId = lessonId.replace(/^[a-z]+-/, "").replace(/-/g, " ");
  return [
    quiz(
      `Jargon buster: ${title}`,
      `You are starting from zero. What does “${title}” mean in this lesson?`,
      description,
      `A tool you must memorise without understanding`,
      `An optional topic with no real-world use`,
      `${title}: ${description}. Say the definition aloud once before continuing.`,
      "easy",
    ),
    quiz(
      `Mental model: ${title}`,
      `Which mental model best helps a beginner place ${title.toLowerCase()} in ${profile.label}?`,
      `${profile.analogy}. The lesson concept is ${description.toLowerCase()}.`,
      `Treat every system as a black box and skip the fundamentals`,
      `Memorise terminology but never connect it to a real task`,
      `A useful mental model links the new term to something familiar, then replaces the analogy with the precise professional meaning.`,
      "easy",
    ),
    typing(
      `Hands-on lab: ${title}`,
      `Build the starter artefact below, then adapt the final line/checklist item so it demonstrates “${shortId}”.`,
      profile.practical(title, description),
      `This is not a definition-only exercise. You are producing ${profile.artifact}. Save or screenshot the result as evidence.`,
      "medium",
    ),
    quiz(
      `Apply it at work`,
      `You need ${title.toLowerCase()} in ${profile.workplace}. What should you do first?`,
      `Clarify the outcome and constraints, inspect the current state, then apply ${title.toLowerCase()} in a small verifiable step`,
      `Change production immediately and document it later`,
      `Copy the first internet example without checking assumptions`,
      `Professionals reduce uncertainty before change. The goal is a verifiable outcome, not just completing steps.`,
      "medium",
    ),
    typing(
      `Professional checklist`,
      `Type this checklist once, then use it to review your lab result.`,
      `PLAN: objective + inputs + constraints\nBUILD: smallest working application of ${title}\nVERIFY: expected result + edge/failure case\nSECURE: ${profile.safety}\nDOCUMENT: what changed + evidence + rollback/next step`,
      `The checklist turns a classroom concept into a repeatable professional habit.`,
      "medium",
    ),
    quiz(
      `Failure-mode check`,
      `Which approach best prevents a ${title.toLowerCase()} exercise from becoming a fragile production change?`,
      profile.safety,
      `Assume defaults are safe because the demo worked once`,
      `Remove logs and tests to make the project look cleaner`,
      `Expert work includes failure handling, security, observability and rollback—not just the happy path.`,
      "hard",
    ),
    typing(
      `Mini-capstone: prove mastery`,
      `Write the deliverable contract you would hand to a reviewer before calling this topic complete.`,
      `TOPIC: ${title}\nPURPOSE: ${description}\nDELIVERABLE: ${profile.artifact}\nBEGINNER PROOF: explain the term without jargon\nPRACTICAL PROOF: show a working artefact or configuration\nFAILURE PROOF: demonstrate one edge/failure case\nPROFESSIONAL PROOF: document security, verification and next-step/rollback\nTEACH-BACK: explain what you built and why`,
      `A topic is mastered when you can explain it, apply it, test it and teach it back—not when you have merely read it.`,
      "hard",
    ),
    quiz(
      `60-second mastery check`,
      `Without looking back, which answer proves you genuinely understand ${title}?`,
      `I can define it simply, create or configure a small example, verify the result, explain a failure mode and say where it belongs in a real system`,
      `I recognise the words when I see them`,
      `I completed the screen, so I must know it`,
      `That five-part recall test—define, build, verify, fail safely, place in context—is the standard for moving from familiarity to usable skill.`,
      "hard",
    ),
  ];
}
