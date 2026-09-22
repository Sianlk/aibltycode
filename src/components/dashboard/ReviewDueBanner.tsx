import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDueLocalReviews, getReviewSchedule } from "@/data/retentionEngine";

export function ReviewDueBanner() {
  const navigate = useNavigate();
  const [dueCount, setDueCount] = useState(0);
  const [nextReview, setNextReview] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const due = getDueLocalReviews();
    const schedule = getReviewSchedule();
    setDueCount(due.length);
    setNextReview(schedule[0]?.nextReviewAt ?? null);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refresh]);

  if (dueCount === 0 && !nextReview) return null;

  return (
    <div className={`mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${dueCount > 0 ? "border-primary/40 bg-primary/5" : "bg-card"}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          {dueCount > 0 ? <Brain className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-semibold">
            {dueCount > 0 ? `${dueCount} memory review${dueCount === 1 ? "" : "s"} due` : "Memory reviews are scheduled"}
          </p>
          <p className="text-sm text-muted-foreground">
            {dueCount > 0
              ? "A few minutes of retrieval now protects what you learned from fading."
              : `Next review: ${new Date(nextReview!).toLocaleString()}`}
          </p>
        </div>
      </div>
      <Button onClick={() => navigate("/game/spaced-rep")}>{dueCount > 0 ? "Review now" : "View schedule"}</Button>
    </div>
  );
}
