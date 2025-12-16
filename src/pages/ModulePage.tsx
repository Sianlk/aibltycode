import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Clock } from "lucide-react";

// Sample lessons data
const moduleLessons: Record<string, { id: string; title: string; description: string; duration: string; completed: boolean }[]> = {
  "java-foundations": [
    { id: "j1", title: "Variables & Types", description: "Learn how to store data in Java", duration: "5 min", completed: false },
    { id: "j2", title: "Your First Program", description: "Write and run Hello World", duration: "8 min", completed: false },
    { id: "j3", title: "Numbers & Math", description: "Basic arithmetic operations", duration: "6 min", completed: false },
    { id: "j4", title: "Text & Strings", description: "Working with text data", duration: "7 min", completed: false },
    { id: "j5", title: "Making Decisions", description: "If statements and conditions", duration: "10 min", completed: false },
    { id: "j6", title: "Loops & Repetition", description: "Repeat code with for and while", duration: "12 min", completed: false },
  ],
  "systems-analysis": [
    { id: "s1", title: "What is a System?", description: "Understanding systems and boundaries", duration: "5 min", completed: false },
    { id: "s2", title: "Finding Stakeholders", description: "Who uses the system?", duration: "6 min", completed: false },
    { id: "s3", title: "Gathering Requirements", description: "What should the system do?", duration: "8 min", completed: false },
    { id: "s4", title: "Use Cases", description: "Describing user interactions", duration: "10 min", completed: false },
    { id: "s5", title: "Process Flowcharts", description: "Visualizing workflows", duration: "12 min", completed: false },
  ],
  "math-computing": [
    { id: "m1", title: "Number Basics", description: "Binary, decimal, and hex", duration: "6 min", completed: false },
    { id: "m2", title: "Logic & Truth", description: "AND, OR, NOT operations", duration: "8 min", completed: false },
    { id: "m3", title: "Sets & Groups", description: "Collections of things", duration: "7 min", completed: false },
    { id: "m4", title: "Patterns & Sequences", description: "Finding the next number", duration: "5 min", completed: false },
    { id: "m5", title: "Fast vs Slow", description: "Introduction to complexity", duration: "10 min", completed: false },
  ],
};

const moduleColors: Record<string, { text: string; bg: string; border: string }> = {
  "java-foundations": { text: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  "systems-analysis": { text: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  "math-computing": { text: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30" },
};

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { modules, gameMode, playSound } = useGame();

  const currentModule = modules.find((m) => m.id === moduleId);
  const lessons = moduleId ? moduleLessons[moduleId] || [] : [];
  const colors = moduleId ? moduleColors[moduleId] || moduleColors["java-foundations"] : moduleColors["java-foundations"];

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Module not found</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const completedLessons = lessons.filter((l) => l.completed).length;
  const moduleProgress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const handleStartLesson = (lessonId: string) => {
    playSound("click");
    // In a full implementation, this would navigate to the lesson
    // For now, show coming soon
    navigate(`/lesson/${moduleId}/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Module Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center text-4xl`}>
              {currentModule.icon}
            </div>
            <div className="flex-1">
              <h1 className={`text-3xl font-black ${colors.text} mb-1`}>
                {currentModule.title}
              </h1>
              <p className="text-muted-foreground">{currentModule.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Module Progress</span>
              <span className={`text-sm font-bold ${colors.text}`}>
                {completedLessons}/{lessons.length} lessons
              </span>
            </div>
            <Progress value={moduleProgress} className="h-3" />
          </Card>
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            {gameMode === "kid" ? "🎯 " : ""}Lessons
          </h2>
          <div className="grid gap-4">
            {lessons.map((lesson, index) => {
              const isLocked = index > 0 && !lessons[index - 1].completed;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card
                    variant={lesson.completed ? "glow" : "default"}
                    className={`cursor-pointer transition-all hover:shadow-glow-sm ${
                      isLocked ? "opacity-60" : ""
                    } ${lesson.completed ? colors.border : ""}`}
                    onClick={() => !isLocked && handleStartLesson(lesson.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        lesson.completed
                          ? "bg-success/20 text-success"
                          : isLocked
                          ? "bg-muted text-muted-foreground"
                          : `${colors.bg} ${colors.text}`
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <span className="text-xl font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </div>
                        {!isLocked && !lesson.completed && (
                          <Button variant="ghost" size="icon" className={colors.text}>
                            <PlayCircle className="w-6 h-6" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
