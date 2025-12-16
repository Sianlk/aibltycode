import { forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useProgress } from "@/hooks/useProgress";
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Star } from "lucide-react";

// Comprehensive lessons matching the curriculum
const moduleLessons: Record<string, { id: string; title: string; description: string; icon: string; xpReward: number }[]> = {
  "java-foundations": [
    { id: "hello-world", title: "Hello World!", description: "Write your first Java program", icon: "🚀", xpReward: 50 },
    { id: "variables", title: "Variables", description: "Store data in boxes", icon: "📦", xpReward: 75 },
    { id: "data-types", title: "Data Types", description: "Different kinds of data", icon: "🎨", xpReward: 100 },
    { id: "operators", title: "Operators", description: "Math and comparison", icon: "➕", xpReward: 100 },
    { id: "strings", title: "Strings", description: "Working with text", icon: "📝", xpReward: 100 },
    { id: "if-statements", title: "If Statements", description: "Make choices", icon: "🔀", xpReward: 100 },
    { id: "else-elseif", title: "Else & Else If", description: "More choices!", icon: "🌟", xpReward: 100 },
    { id: "for-loops", title: "For Loops", description: "Repeat code", icon: "🔄", xpReward: 125 },
    { id: "while-loops", title: "While Loops", description: "Loop until done", icon: "🎯", xpReward: 125 },
    { id: "methods", title: "Methods", description: "Reusable code", icon: "🔧", xpReward: 150 },
    { id: "arrays", title: "Arrays", description: "Multiple values", icon: "📊", xpReward: 150 },
    { id: "classes", title: "Classes & Objects", description: "OOP basics", icon: "🏗️", xpReward: 200 },
    { id: "inheritance", title: "Inheritance", description: "Extending classes", icon: "👨‍👧", xpReward: 200 },
    { id: "interfaces", title: "Interfaces", description: "Define contracts", icon: "📋", xpReward: 200 },
    { id: "exceptions", title: "Exception Handling", description: "Handle errors", icon: "⚠️", xpReward: 175 },
    { id: "collections", title: "Collections", description: "Lists, Sets, Maps", icon: "📚", xpReward: 225 },
  ],
  "systems-analysis": [
    { id: "what-is-system", title: "What is a System?", description: "Systems and boundaries", icon: "🌐", xpReward: 50 },
    { id: "stakeholders", title: "Finding Stakeholders", description: "Who uses the system?", icon: "👥", xpReward: 75 },
    { id: "requirements", title: "Gathering Requirements", description: "What should it do?", icon: "📋", xpReward: 100 },
    { id: "use-cases", title: "Use Cases", description: "User interactions", icon: "🎭", xpReward: 100 },
    { id: "process-flow", title: "Process Flowcharts", description: "Visualizing workflows", icon: "📊", xpReward: 125 },
    { id: "data-modelling", title: "Data Modelling", description: "Entity relationships", icon: "🔗", xpReward: 150 },
    { id: "sdlc", title: "SDLC", description: "Development lifecycle", icon: "🔄", xpReward: 150 },
    { id: "risk-controls", title: "Risks & Controls", description: "Managing risks", icon: "🛡️", xpReward: 125 },
  ],
  "math-computing": [
    { id: "number-systems", title: "Number Systems", description: "Binary, hex, decimal", icon: "🔢", xpReward: 75 },
    { id: "logic-gates", title: "Logic & Truth", description: "AND, OR, NOT", icon: "🚦", xpReward: 100 },
    { id: "sets", title: "Sets & Groups", description: "Collections", icon: "⭕", xpReward: 100 },
    { id: "probability", title: "Probability", description: "Chance and likelihood", icon: "🎲", xpReward: 125 },
    { id: "patterns", title: "Patterns", description: "Sequences", icon: "🔮", xpReward: 100 },
    { id: "graphs-trees", title: "Graphs & Trees", description: "Connected structures", icon: "🌳", xpReward: 150 },
    { id: "complexity", title: "Big-O Notation", description: "Algorithm speed", icon: "⏱️", xpReward: 175 },
  ],
};

const moduleInfo: Record<string, { title: string; icon: string }> = {
  "java-foundations": { title: "Java Basics", icon: "☕" },
  "systems-analysis": { title: "Systems Analysis", icon: "🌌" },
  "math-computing": { title: "Math for Computing", icon: "✨" },
};

const ModulePage = forwardRef<HTMLDivElement>((_, ref) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { playSound } = useGame();
  const { isLessonCompleted, loading } = useProgress();

  const info = moduleId ? moduleInfo[moduleId] : null;
  const lessons = moduleId ? moduleLessons[moduleId] || [] : [];

  if (!info) {
    return (
      <div ref={ref} className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Module not found</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;

  const handleStartLesson = (lessonId: string) => {
    playSound("click");
    navigate(`/lesson/${moduleId}/${lessonId}`);
  };

  const handleBack = () => {
    playSound("click");
    navigate("/dashboard");
  };

  return (
    <div ref={ref} className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Back Button */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Module Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">{info.icon}</div>
          <h1 className="text-3xl font-black text-foreground mb-2">{info.title}</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${completedCount}/${lessons.length} Complete`}
          </p>
        </motion.div>

        {/* Lessons List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const prevCompleted = index === 0 || isLessonCompleted(lessons[index - 1].id);
            const isLocked = index > 0 && !prevCompleted;

            return (
              <motion.div
                key={lesson.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isLocked ? "opacity-50" : ""
                  } ${completed ? "border-success/50 bg-success/5" : ""}`}
                  onClick={() => !isLocked && handleStartLesson(lesson.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      completed ? "bg-success/20" : isLocked ? "bg-muted" : "bg-primary/10"
                    }`}>
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        lesson.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      <Star className="w-3 h-3" />
                      {lesson.xpReward} XP
                    </div>

                    {/* Play Button */}
                    {!isLocked && !completed && (
                      <PlayCircle className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
});

ModulePage.displayName = "ModulePage";

export default ModulePage;
