import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdaptivePath, reasonLabel, type PathReason } from "@/hooks/useAdaptivePath";
import { CheckCircle2, Flame, RefreshCw, Rocket, Target, TrendingUp, Brain } from "lucide-react";

const REASON_STYLE: Record<PathReason, { icon: typeof Target; tone: string }> = {
  review: { icon: RefreshCw, tone: "bg-warning/15 text-warning border-warning/30" },
  continue: { icon: Flame, tone: "bg-accent/15 text-accent border-accent/30" },
  next: { icon: Target, tone: "bg-primary/15 text-primary border-primary/30" },
  stretch: { icon: Rocket, tone: "bg-success/15 text-success border-success/30" },
};

const MODULE_TITLES: Record<string, string> = {
  "java-foundations": "Programming Foundations",
  "systems-analysis": "Systems Analysis & Design",
  "math-computing": "Maths for Computing",
  cybersecurity: "Cybersecurity",
  "ai-data-science": "AI & Data Science",
  "business-systems": "Business & Digital Systems",
  "game-development": "Game Development",
  "computer-systems": "Computer Systems & Cloud",
  "web-technologies": "Web Technologies",
};

const moduleTitle = (id: string) =>
  MODULE_TITLES[id] ?? id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

export default function LearningPath() {
  const navigate = useNavigate();
  const {
    plan,
    standings,
    totals,
    weakestSkills,
    dueReviewCount,
    dailyGoal,
    completedToday,
    isDone,
    isKidsMode,
    loading,
  } = useAdaptivePath();

  useEffect(() => {
    document.title = "Your Adaptive Learning Path | AIblty";
  }, []);

  const goalPercent = Math.min(100, Math.round((completedToday / dailyGoal) * 100));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl" id="main-content">
        <motion.header
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" aria-hidden="true" />
            {isKidsMode ? "Your Quest Map" : "Your Adaptive Path"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isKidsMode
              ? "Follow the map! Each step is picked just for you."
              : "Rebuilt after every lesson from your accuracy, speed and review timings."}
          </p>
        </motion.header>

        {/* Daily goal */}
        <Card className="mb-6 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  {isKidsMode ? "Today's Quest" : "Today's goal"}
                </CardTitle>
                <CardDescription>
                  {completedToday} of {dailyGoal} steps complete
                </CardDescription>
              </div>
              <div className="text-3xl font-bold text-primary" aria-hidden="true">
                {goalPercent}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress
              value={goalPercent}
              aria-label={`Daily goal ${goalPercent} percent complete`}
            />
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div>
                <div className="text-xl font-bold text-foreground">{totals.completed}</div>
                <div className="text-xs text-muted-foreground">Lessons done</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{totals.percent}%</div>
                <div className="text-xs text-muted-foreground">Curriculum</div>
              </div>
              <div>
                <div className="text-xl font-bold text-warning">{dueReviewCount}</div>
                <div className="text-xs text-muted-foreground">Due to review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended queue */}
        <section aria-labelledby="queue-heading" className="mb-8">
          <h2 id="queue-heading" className="text-xl font-bold text-foreground mb-3">
            {isKidsMode ? "Do these next" : "Recommended next"}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : plan.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Start any course and your personal path will build itself from there.
                <div className="mt-4">
                  <Button onClick={() => navigate("/dashboard")}>Browse courses</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ol className="space-y-3">
              {plan.map((item, index) => {
                const style = REASON_STYLE[item.reason];
                const Icon = style.icon;
                const done = isDone(item.lessonId);
                return (
                  <motion.li
                    key={`${item.moduleId}/${item.lessonId}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className={done ? "opacity-60" : "hover:border-primary/50 transition-colors"}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div
                          className="text-3xl shrink-0"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                            {done && (
                              <CheckCircle2 className="w-4 h-4 text-success" aria-label="Completed" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className={style.tone}>
                              <Icon className="w-3 h-3 mr-1" aria-hidden="true" />
                              {reasonLabel(item.reason)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {moduleTitle(item.moduleId)} · +{item.xpReward} XP
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={done ? "outline" : "default"}
                          onClick={() => navigate(`/lesson/${item.moduleId}/${item.lessonId}`)}
                          aria-label={`${done ? "Revisit" : "Start"} lesson ${item.title}`}
                        >
                          {done ? "Revisit" : "Start"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Weak skills */}
        {weakestSkills.length > 0 && (
          <section aria-labelledby="weak-heading" className="mb-8">
            <h2 id="weak-heading" className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" aria-hidden="true" />
              Targeted practice
            </h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {weakestSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground truncate">
                        {skill.skill_name}
                      </div>
                      <Progress
                        value={Math.round(skill.accuracy)}
                        className="h-2 mt-1"
                        aria-label={`${skill.skill_name} accuracy ${Math.round(skill.accuracy)} percent`}
                      />
                    </div>
                    <span className="text-sm tabular-nums text-muted-foreground w-12 text-right">
                      {Math.round(skill.accuracy)}%
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigate("/game/spaced-rep")}>
                  Drill these now
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Module ladder */}
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="text-xl font-bold text-foreground mb-3">
            Mastery by course
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {standings.map((s) => (
              <Card key={s.moduleId} className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4" onClick={() => navigate(`/module/${s.moduleId}`)}>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {moduleTitle(s.moduleId)}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {s.completed}/{s.total}
                    </span>
                  </div>
                  <Progress
                    value={s.percent}
                    className="h-2"
                    aria-label={`${moduleTitle(s.moduleId)} ${s.percent} percent complete`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
