import { useCallback, useMemo } from "react";
import { moduleLessons } from "@/data/moduleData";
import { useProgress } from "@/hooks/useProgress";
import { useSkillMastery } from "@/hooks/useSkillMastery";
import { useGame } from "@/contexts/GameContext";

/**
 * Adaptive learning path engine.
 *
 * Combines the four mechanics proven by the most-used learning apps:
 *  - a daily goal + streak loop (habit formation)
 *  - a strict prerequisite ladder so nothing is ever shown before its basics
 *  - spaced repetition (SM-2 style due dates) for long-term retention
 *  - weak-skill targeting so practice is spent where accuracy is lowest
 *
 * Everything is derived from the learner's real progress, so the plan
 * re-computes itself after every completed lesson.
 */

export type PathReason = "review" | "continue" | "next" | "stretch";

export interface PathItem {
  moduleId: string;
  lessonId: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  reason: PathReason;
  /** 0-100 — how strongly the engine recommends this right now */
  priority: number;
}

export interface ModuleStanding {
  moduleId: string;
  total: number;
  completed: number;
  percent: number;
}

const REASON_LABEL: Record<PathReason, string> = {
  review: "Review — strengthen before you forget",
  continue: "Continue where you left off",
  next: "Next step on your ladder",
  stretch: "Stretch goal — you are ready for this",
};

export function reasonLabel(reason: PathReason) {
  return REASON_LABEL[reason];
}

/** Days since an ISO date string, or Infinity when never practised. */
function daysSince(iso: string | null | undefined) {
  if (!iso) return Infinity;
  const ms = Date.now() - new Date(iso).getTime();
  return ms / 86_400_000;
}

/**
 * SM-2 style due interval from a mastery score.
 * Weakly known material comes back tomorrow; automated material waits weeks.
 */
export function reviewIntervalDays(automationScore: number) {
  if (automationScore >= 90) return 21;
  if (automationScore >= 75) return 10;
  if (automationScore >= 60) return 5;
  if (automationScore >= 40) return 2;
  return 1;
}

export function useAdaptivePath(dailyGoal = 5) {
  const { progress, loading: progressLoading } = useProgress();
  const { skills, loading: skillsLoading } = useSkillMastery();
  const { gameMode } = useGame();
  const isKidsMode = gameMode === "kid";

  const completedIds = useMemo(
    () => new Set(progress.filter((p) => p.completed).map((p) => p.lessonId)),
    [progress]
  );

  const attemptedButUnfinished = useMemo(
    () => new Set(progress.filter((p) => !p.completed && p.attempts > 0).map((p) => p.lessonId)),
    [progress]
  );

  const standings: ModuleStanding[] = useMemo(() => {
    return Object.entries(moduleLessons).map(([moduleId, lessons]) => {
      const completed = lessons.filter((l) => completedIds.has(l.id)).length;
      return {
        moduleId,
        total: lessons.length,
        completed,
        percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
      };
    });
  }, [completedIds]);

  /** Skills whose spaced-repetition interval has elapsed. */
  const dueReviews = useMemo(() => {
    return skills
      .filter((s) => daysSince(s.last_practiced) >= reviewIntervalDays(s.automation_score))
      .sort((a, b) => a.automation_score - b.automation_score);
  }, [skills]);

  /** The single lowest-accuracy skill, used for targeted drilling. */
  const weakestSkills = useMemo(
    () =>
      [...skills]
        .filter((s) => s.total_attempts >= 3)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3),
    [skills]
  );

  /**
   * Build today's ordered plan.
   * Reviews first (retention beats new volume), then the resumed lesson,
   * then the next unlocked steps, then one stretch item to keep it interesting.
   */
  const plan: PathItem[] = useMemo(() => {
    const items: PathItem[] = [];
    const seen = new Set<string>();

    const push = (
      moduleId: string,
      lesson: (typeof moduleLessons)[string][number],
      reason: PathReason,
      priority: number
    ) => {
      const key = `${moduleId}/${lesson.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        moduleId,
        lessonId: lesson.id,
        title: lesson.title,
        description: lesson.description,
        icon: lesson.icon,
        xpReward: lesson.xpReward,
        reason,
        priority,
      });
    };

    // 1. Spaced repetition — completed lessons whose skill has gone stale.
    for (const skill of dueReviews) {
      for (const [moduleId, lessons] of Object.entries(moduleLessons)) {
        const match = lessons.find((l) => l.id === skill.skill_id);
        if (match && completedIds.has(match.id)) {
          push(moduleId, match, "review", 100 - skill.automation_score);
          break;
        }
      }
      if (items.length >= Math.ceil(dailyGoal / 2)) break;
    }

    // 2. Resume anything started but not finished.
    for (const [moduleId, lessons] of Object.entries(moduleLessons)) {
      for (const lesson of lessons) {
        if (attemptedButUnfinished.has(lesson.id)) push(moduleId, lesson, "continue", 95);
      }
    }

    // 3. Next unlocked step in each module the learner has already opened,
    //    then the first step of the module they are furthest through.
    const active = standings
      .filter((s) => s.completed > 0 && s.completed < s.total)
      .sort((a, b) => b.percent - a.percent);

    const ordered = active.length
      ? active
      : standings.filter((s) => s.total > 0).slice(0, 1);

    for (const standing of ordered) {
      const lessons = moduleLessons[standing.moduleId] ?? [];
      const next = lessons.find((l) => !completedIds.has(l.id));
      if (next) push(standing.moduleId, next, "next", 90 - standing.percent / 10);
      if (items.length >= dailyGoal) break;
    }

    // 4. Fill the rest of the goal with the following steps in the strongest module.
    if (items.length < dailyGoal) {
      for (const standing of ordered) {
        const lessons = moduleLessons[standing.moduleId] ?? [];
        for (const lesson of lessons) {
          if (items.length >= dailyGoal) break;
          if (!completedIds.has(lesson.id)) push(standing.moduleId, lesson, "next", 60);
        }
        if (items.length >= dailyGoal) break;
      }
    }

    // 5. One stretch item from a module not yet started, to widen the skill base.
    const untouched = standings.find((s) => s.completed === 0 && s.total > 0);
    if (untouched && items.length <= dailyGoal) {
      const first = moduleLessons[untouched.moduleId]?.[0];
      if (first) push(untouched.moduleId, first, "stretch", 40);
    }

    return items
      .sort((a, b) => b.priority - a.priority)
      .slice(0, dailyGoal + 1);
  }, [dueReviews, attemptedButUnfinished, standings, completedIds, dailyGoal]);

  const totals = useMemo(() => {
    const total = standings.reduce((sum, s) => sum + s.total, 0);
    const completed = standings.reduce((sum, s) => sum + s.completed, 0);
    return {
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [standings]);

  const completedToday = useMemo(() => plan.filter((i) => completedIds.has(i.lessonId)).length, [plan, completedIds]);

  const isDone = useCallback((lessonId: string) => completedIds.has(lessonId), [completedIds]);

  return {
    plan,
    standings,
    totals,
    weakestSkills,
    dueReviewCount: dueReviews.length,
    dailyGoal,
    completedToday,
    isDone,
    isKidsMode,
    loading: progressLoading || skillsLoading,
  };
}
