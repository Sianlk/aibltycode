import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, Clock3, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { buildRetentionPlan, evaluateRecall, getDueLocalReviews, getReviewSchedule, scheduleLocalReview } from "@/data/retentionEngine";
import { getLessonById, type LessonData } from "@/data/lessons";
import { useSpacedRepetition } from "@/hooks/useSkillMastery";

interface ReviewLesson {
  lesson: LessonData;
  source: "local" | "cloud";
}

function buildQueue(cloudItems: Array<{ lesson_id?: string | null }> = []): ReviewLesson[] {
  const queue = new Map<string, ReviewLesson>();

  for (const item of getDueLocalReviews()) {
    const lesson = getLessonById(item.lessonId);
    if (lesson) queue.set(lesson.id, { lesson, source: "local" });
  }

  for (const item of cloudItems) {
    if (!item.lesson_id || queue.has(item.lesson_id)) continue;
    const lesson = getLessonById(item.lesson_id);
    if (lesson) queue.set(lesson.id, { lesson, source: "cloud" });
  }

  return [...queue.values()];
}

export default function SpacedRepetitionGame() {
  const { dueItems, loading, recordReview } = useSpacedRepetition();
  const [queueVersion, setQueueVersion] = useState(0);
  const queue = useMemo(() => buildQueue(dueItems), [dueItems, queueVersion]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const current = queue[Math.min(index, Math.max(queue.length - 1, 0))];
  const lesson = current?.lesson;
  const plan = lesson ? buildRetentionPlan(lesson) : null;
  const progress = queue.length ? Math.min(100, Math.round((reviewed / queue.length) * 100)) : 100;

  const resetCard = () => {
    setAnswer("");
    setRevealed(false);
    setFeedback("");
    setStartedAt(Date.now());
  };

  const reveal = () => {
    if (!plan) return;
    const result = evaluateRecall(answer, plan.recall.expectedKeywords, 4, 1);
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    setFeedback(
      result.passed
        ? `Good retrieval${seconds <= 60 ? " — and fast enough for fluent recall." : ". Correct, but repeat it once more later until it comes back inside 60 seconds."}`
        : "Not secure yet. Compare your answer with the memory cue, then rate it honestly so the scheduler brings it back sooner."
    );
    setRevealed(true);
  };

  const rate = async (quality: number) => {
    if (!lesson) return;
    scheduleLocalReview(lesson, quality);
    await recordReview(`${lesson.id}:mastery`, lesson.id, quality);

    setReviewed((value) => value + 1);
    if (quality >= 3) setCorrect((value) => value + 1);

    if (index + 1 < queue.length) {
      setIndex((value) => value + 1);
      resetCard();
      return;
    }

    setQueueVersion((value) => value + 1);
    setIndex(0);
    resetCard();
  };

  if (loading && queue.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your review queue…</div>
      </div>
    );
  }

  if (!lesson || !plan || queue.length === 0) {
    const next = getReviewSchedule()[0];
    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <Card className="overflow-hidden border-emerald-500/30">
          <CardContent className="space-y-5 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <Trophy className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <Badge className="mb-3">Review queue clear</Badge>
              <h2 className="text-2xl font-bold">Nothing is due right now</h2>
              <p className="mt-2 text-muted-foreground">
                Reviews are created automatically when you complete lessons. Correct recalls spread farther apart; forgotten ideas return sooner.
              </p>
            </div>
            {next ? (
              <div className="rounded-xl border bg-muted/30 p-4 text-left">
                <p className="font-semibold">Next scheduled review</p>
                <p className="text-sm text-muted-foreground">
                  {next.title} · {new Date(next.nextReviewAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                Complete any lesson to start your personalised memory schedule.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Universal review queue</p>
            <h1 className="text-2xl font-bold">Fast Recall</h1>
          </div>
          <Badge variant="outline">{queue.length} due</Badge>
        </div>
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{reviewed} reviewed</span>
          <span>{correct} remembered</span>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge>{lesson.category}</Badge>
            <Badge variant="secondary">{current.source === "cloud" ? "synced review" : "scheduled review"}</Badge>
          </div>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl border bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Brain className="h-4 w-4" /> No peeking
            </div>
            <p>{plan.recall.prompt}</p>
          </div>

          <textarea
            className="min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={answer}
            disabled={revealed}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Pull the answer from memory before revealing it…"
            autoFocus
          />

          {!revealed ? (
            <Button className="w-full" size="lg" onClick={reveal} disabled={answer.trim().length < 2}>
              <Clock3 className="mr-2 h-4 w-4" /> Reveal and check recall
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="mb-1 flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> Memory answer</p>
                <p className="text-sm">{plan.recall.answerSummary}</p>
                {plan.keyTerms.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">Key hooks: {plan.keyTerms.slice(0, 5).join(" · ")}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{feedback}</p>
              <div className="grid gap-2 sm:grid-cols-4">
                <Button variant="destructive" onClick={() => rate(1)}><RotateCcw className="mr-1 h-4 w-4" /> Forgot</Button>
                <Button variant="outline" onClick={() => rate(3)}>Hard</Button>
                <Button variant="outline" onClick={() => rate(4)}><CheckCircle2 className="mr-1 h-4 w-4" /> Good</Button>
                <Button onClick={() => rate(5)}>Instant</Button>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Your rating changes the next interval automatically: forgotten ideas return quickly; fluent ideas move farther out.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
