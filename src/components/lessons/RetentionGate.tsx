import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle2, Clock3, Lightbulb, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { getLessonById } from "@/data/lessons";
import {
  buildRetentionPlan,
  evaluateFastRecall,
  evaluateRecall,
  scheduleLocalReview,
  type ReviewScheduleItem
} from "@/data/retentionEngine";
import { useSkillMastery, useSpacedRepetition } from "@/hooks/useSkillMastery";

interface RetentionGateProps {
  lessonId: string;
  onMastered: () => void;
  onExit?: () => void;
}

type GateStage = "memory" | "recall" | "teach" | "fast" | "transfer" | "complete";

const STAGE_LABELS: Record<Exclude<GateStage, "complete">, string> = {
  memory: "1. Memory hook",
  recall: "2. Pull it from memory",
  teach: "3. Teach it simply",
  fast: "4. Fast recall",
  transfer: "5. Use it professionally"
};

function panelClass(passed: boolean): string {
  return passed
    ? "border-emerald-500/40 bg-emerald-500/5"
    : "border-border bg-card";
}

export function RetentionGate({ lessonId, onMastered, onExit }: RetentionGateProps) {
  const lesson = getLessonById(lessonId);
  const plan = useMemo(() => lesson ? buildRetentionPlan(lesson) : null, [lesson]);
  const { recordReview } = useSpacedRepetition();
  const { updateSkillMastery } = useSkillMastery();

  const [stage, setStage] = useState<GateStage>("memory");
  const [answer, setAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [retries, setRetries] = useState(0);
  const [review, setReview] = useState<ReviewScheduleItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [fastAttempt, setFastAttempt] = useState(0);
  const gateStartedAt = useRef(Date.now());
  const fastStartedAt = useRef(Date.now());

  if (!lesson || !plan) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8 text-center">
          <p className="font-semibold">This lesson could not be loaded for mastery review.</p>
          <Button className="mt-4" variant="outline" onClick={onExit}>Go back</Button>
        </CardContent>
      </Card>
    );
  }

  const clearAttempt = () => {
    setAnswer("");
    setSelectedAnswer(null);
    setFeedback("");
  };

  const fail = (message: string) => {
    setRetries((value) => value + 1);
    setFeedback(message);
  };

  const moveTo = (next: GateStage) => {
    clearAttempt();
    if (next === "fast") {
      fastStartedAt.current = Date.now();
      setFastAttempt((value) => value + 1);
    }
    setStage(next);
  };

  const checkRecall = () => {
    const result = evaluateRecall(answer, plan.recall.expectedKeywords, 5, 1);
    if (!result.passed) {
      fail(`Not locked in yet. Say at least 5 words from memory and include a core idea. Hint: ${plan.recall.answerSummary}`);
      return;
    }
    moveTo("teach");
  };

  const checkTeachBack = () => {
    const result = evaluateRecall(answer, plan.keyTerms, 14, 1);
    if (!result.passed) {
      fail(`Make it simpler and fuller: at least 14 words, one key idea, why it matters, and a tiny example. Useful terms: ${plan.keyTerms.slice(0, 4).join(", ")}.`);
      return;
    }
    moveTo("fast");
  };

  const checkFastRecall = () => {
    const elapsed = (Date.now() - fastStartedAt.current) / 1000;
    const challenge = plan.fastRecall;
    let correct = false;

    if (challenge.options && challenge.correctAnswer) {
      correct = selectedAnswer === challenge.correctAnswer;
    } else {
      correct = evaluateFastRecall(answer, challenge);
    }

    if (!correct) {
      fastStartedAt.current = Date.now();
      setFastAttempt((value) => value + 1);
      fail(`That one needs another retrieval. Resetting the 60-second clock. Think: ${challenge.answerSummary}`);
      return;
    }

    if (elapsed > 60) {
      fastStartedAt.current = Date.now();
      setFastAttempt((value) => value + 1);
      setAnswer("");
      setSelectedAnswer(null);
      fail("Correct, but mastery means fast access too. Do it once more from memory in under 60 seconds.");
      return;
    }

    moveTo("transfer");
  };

  const checkTransfer = async () => {
    const result = evaluateRecall(answer, plan.keyTerms, 12, 1);
    if (!result.passed) {
      fail(`Connect the idea to a real task: at least 12 words explaining where you would use it, what you would do, and why. Include one core term such as ${plan.keyTerms.slice(0, 3).join(", ")}.`);
      return;
    }

    setSaving(true);
    const quality = retries === 0 ? 5 : retries <= 2 ? 4 : 3;
    const localReview = scheduleLocalReview(lesson, quality);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - gateStartedAt.current) / 1000));

    await Promise.allSettled([
      recordReview(`${lesson.id}:mastery`, lesson.id, quality),
      updateSkillMastery(lesson.id, lesson.title, lesson.category, true, elapsedSeconds, retries)
    ]);

    setReview(localReview);
    setSaving(false);
    setStage("complete");
    clearAttempt();
  };

  const renderAnswerBox = (placeholder: string) => (
    <textarea
      className="min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      value={answer}
      onChange={(event) => {
        setAnswer(event.target.value);
        setFeedback("");
      }}
      placeholder={placeholder}
      autoFocus
    />
  );

  if (stage === "complete") {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Card className="overflow-hidden border-emerald-500/40">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <Trophy className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <Badge className="mb-3">Mastery cycle complete</Badge>
              <h1 className="text-2xl font-bold">{lesson.title} is now in the review loop</h1>
              <p className="mt-2 text-muted-foreground">
                You recalled it, taught it, retrieved it quickly and transferred it to a real situation.
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4 text-left">
              <p className="font-semibold">Next memory check</p>
              <p className="text-sm text-muted-foreground">
                {review
                  ? `${new Date(review.nextReviewAt).toLocaleDateString()} · interval ${review.intervalDays} day${review.intervalDays === 1 ? "" : "s"}. Correct future reviews expand automatically.`
                  : "Your next review has been scheduled."}
              </p>
            </div>
            <Button size="lg" className="w-full sm:w-auto" onClick={onMastered}>
              Continue learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Retention gate</p>
          <h1 className="text-2xl font-bold">Make {lesson.title} stick</h1>
        </div>
        {onExit && <Button variant="ghost" onClick={onExit}>Exit</Button>}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(Object.keys(STAGE_LABELS) as Array<Exclude<GateStage, "complete">>).map((key) => {
          const order = ["memory", "recall", "teach", "fast", "transfer"] as GateStage[];
          const passed = order.indexOf(key) < order.indexOf(stage);
          const active = key === stage;
          return (
            <div key={key} className={`rounded-lg border p-2 text-xs ${active ? "border-primary bg-primary/5" : panelClass(passed)}`}>
              {passed && <CheckCircle2 className="mb-1 h-4 w-4 text-emerald-600" />}
              <span className={active ? "font-semibold" : "text-muted-foreground"}>{STAGE_LABELS[key]}</span>
            </div>
          );
        })}
      </div>

      {stage === "memory" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> The MIND memory code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4"><strong>M — Meaning</strong><p className="mt-1 text-sm text-muted-foreground">{plan.childSimpleMeaning}</p></div>
              <div className="rounded-xl border p-4"><strong>I — Image</strong><p className="mt-1 text-sm text-muted-foreground">{plan.visualAnchor}</p></div>
              <div className="rounded-xl border p-4"><strong>N — Name it</strong><p className="mt-1 text-sm text-muted-foreground">Say these aloud: {plan.keyTerms.slice(0, 4).join(" · ")}</p></div>
              <div className="rounded-xl border p-4"><strong>D — Do it</strong><p className="mt-1 text-sm text-muted-foreground">Close the lesson, pull the idea from memory, then use it. Retrieval is the test.</p></div>
            </div>
            <div className="rounded-xl bg-primary/5 p-4 text-sm">
              <Lightbulb className="mr-2 inline h-4 w-4" />
              Child-simple rule: if you cannot explain it simply without looking, it is not mastered yet.
            </div>
            <Button className="w-full" size="lg" onClick={() => moveTo("recall")}>I have the hook — test me</Button>
          </CardContent>
        </Card>
      )}

      {stage === "recall" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> No-peeking retrieval</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{plan.recall.prompt}</p>
            {renderAnswerBox("Write what you remember before looking at any hint…")}
            {feedback && <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">{feedback}</p>}
            <Button className="w-full" onClick={checkRecall}>Check my memory</Button>
          </CardContent>
        </Card>
      )}

      {stage === "teach" && (
        <Card>
          <CardHeader><CardTitle>Feynman teach-back</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{plan.teachBackPrompt}</p>
            {renderAnswerBox("Explain it as if a curious child just asked you…")}
            {feedback && <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">{feedback}</p>}
            <Button className="w-full" onClick={checkTeachBack}>Check my explanation</Button>
          </CardContent>
        </Card>
      )}

      {stage === "fast" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5" /> 60-second fast recall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Answer accurately in under 60 seconds.</span>
              <Badge variant="outline">attempt {Math.max(1, fastAttempt)}</Badge>
            </div>
            <p className="font-medium">{plan.fastRecall.prompt}</p>
            {plan.fastRecall.options?.length ? (
              <div className="grid gap-2">
                {plan.fastRecall.options.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedAnswer === option.label ? "default" : "outline"}
                    className="h-auto justify-start whitespace-normal py-3 text-left"
                    onClick={() => {
                      setSelectedAnswer(option.label);
                      setFeedback("");
                    }}
                  >
                    <span className="mr-2 font-bold">{option.label}.</span>{option.text}
                  </Button>
                ))}
              </div>
            ) : renderAnswerBox(plan.fastRecall.codeToType ? "Type the pattern exactly from memory…" : "Answer from memory…")}
            {feedback && <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">{feedback}</p>}
            <Button className="w-full" onClick={checkFastRecall}>Lock in fast recall</Button>
          </CardContent>
        </Card>
      )}

      {stage === "transfer" && (
        <Card>
          <CardHeader><CardTitle>Professional transfer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{plan.transferPrompt}</p>
            {renderAnswerBox("Describe a realistic use, action and reason…")}
            {feedback && <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">{feedback}</p>}
            <Button className="w-full" disabled={saving} onClick={checkTransfer}>
              {saving ? "Saving mastery…" : "Complete mastery cycle"}
            </Button>
          </CardContent>
        </Card>
      )}

      {retries > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5" /> {retries} retrieval retry{retries === 1 ? "" : "ies"} — retries strengthen memory.
        </div>
      )}
    </div>
  );
}
