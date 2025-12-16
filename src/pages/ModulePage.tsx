import { forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Star } from "lucide-react";

// Comprehensive lessons matching the reference app style
const moduleLessons: Record<string, { id: string; title: string; description: string; icon: string; xpReward: number; completed: boolean }[]> = {
  "java-foundations": [
    { id: "hello-world", title: "Hello World!", description: "Write your first Java program", icon: "🚀", xpReward: 50, completed: false },
    { id: "variables", title: "Variables", description: "Learn to store data in boxes", icon: "📦", xpReward: 75, completed: false },
    { id: "data-types", title: "Data Types", description: "Different kinds of data", icon: "🎨", xpReward: 100, completed: false },
    { id: "operators", title: "Operators", description: "Math and comparison operations", icon: "➕", xpReward: 100, completed: false },
    { id: "strings", title: "Strings", description: "Working with text", icon: "📝", xpReward: 100, completed: false },
    { id: "if-statements", title: "If Statements", description: "Make your code choose", icon: "🔀", xpReward: 100, completed: false },
    { id: "else-elseif", title: "Else & Else If", description: "More choices!", icon: "🌟", xpReward: 100, completed: false },
    { id: "for-loops", title: "For Loops", description: "Repeat things easily", icon: "🔄", xpReward: 125, completed: false },
    { id: "while-loops", title: "While Loops", description: "Loop until done", icon: "🎯", xpReward: 125, completed: false },
    { id: "methods", title: "Methods", description: "Reusable code blocks", icon: "🔧", xpReward: 150, completed: false },
    { id: "arrays", title: "Arrays", description: "Store multiple values", icon: "📊", xpReward: 150, completed: false },
    { id: "classes", title: "Classes & Objects", description: "Object-oriented basics", icon: "🏗️", xpReward: 200, completed: false },
    { id: "inheritance", title: "Inheritance", description: "Extending classes", icon: "👨‍👧", xpReward: 200, completed: false },
    { id: "interfaces", title: "Interfaces", description: "Define contracts", icon: "📋", xpReward: 200, completed: false },
    { id: "exceptions", title: "Exception Handling", description: "Handle errors gracefully", icon: "⚠️", xpReward: 175, completed: false },
    { id: "collections", title: "Collections", description: "Lists, Sets, and Maps", icon: "📚", xpReward: 225, completed: false },
  ],
  "systems-analysis": [
    { id: "what-is-system", title: "What is a System?", description: "Understanding systems and boundaries", icon: "🌐", xpReward: 50, completed: false },
    { id: "stakeholders", title: "Finding Stakeholders", description: "Who uses the system?", icon: "👥", xpReward: 75, completed: false },
    { id: "requirements", title: "Gathering Requirements", description: "What should the system do?", icon: "📋", xpReward: 100, completed: false },
    { id: "use-cases", title: "Use Cases", description: "Describing user interactions", icon: "🎭", xpReward: 100, completed: false },
    { id: "process-flow", title: "Process Flowcharts", description: "Visualizing workflows", icon: "📊", xpReward: 125, completed: false },
    { id: "data-modelling", title: "Data Modelling", description: "Entity relationships", icon: "🔗", xpReward: 150, completed: false },
    { id: "sdlc", title: "SDLC", description: "Software development lifecycle", icon: "🔄", xpReward: 150, completed: false },
    { id: "risk-controls", title: "Risks & Controls", description: "Managing project risks", icon: "🛡️", xpReward: 125, completed: false },
  ],
  "math-computing": [
    { id: "number-systems", title: "Number Systems", description: "Binary, decimal, and hex", icon: "🔢", xpReward: 75, completed: false },
    { id: "logic-gates", title: "Logic & Truth", description: "AND, OR, NOT operations", icon: "🚦", xpReward: 100, completed: false },
    { id: "sets", title: "Sets & Groups", description: "Collections of things", icon: "⭕", xpReward: 100, completed: false },
    { id: "probability", title: "Probability", description: "Chance and likelihood", icon: "🎲", xpReward: 125, completed: false },
    { id: "patterns", title: "Patterns & Sequences", description: "Finding the next number", icon: "🔮", xpReward: 100, completed: false },
    { id: "graphs-trees", title: "Graphs & Trees", description: "Connected structures", icon: "🌳", xpReward: 150, completed: false },
    { id: "complexity", title: "Big-O Notation", description: "Fast vs slow algorithms", icon: "⏱️", xpReward: 175, completed: false },
  ],
};

const moduleInfo: Record<string, { title: string; icon: string; color: string }> = {
  "java-foundations": { title: "Java Basics", icon: "☕", color: "primary" },
  "systems-analysis": { title: "Systems Analysis", icon: "🌌", color: "accent" },
  "math-computing": { title: "Math for Computing", icon: "✨", color: "secondary" },
};

const ModulePage = forwardRef<HTMLDivElement>((_, ref) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { playSound } = useGame();

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

  const completedLessons = lessons.filter((l) => l.completed).length;

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
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 gap-2"
          >
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
          <h1 className="text-3xl font-black text-foreground mb-2">
            {info.title}
          </h1>
          <p className="text-muted-foreground">
            {completedLessons}/{lessons.length} Complete
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
            const isLocked = index > 0 && !lessons[index - 1].completed;

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
                  } ${lesson.completed ? "border-success/50 bg-success/5" : ""}`}
                  onClick={() => !isLocked && handleStartLesson(lesson.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      lesson.completed
                        ? "bg-success/20"
                        : isLocked
                        ? "bg-muted"
                        : "bg-primary/10"
                    }`}>
                      {lesson.completed ? (
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
                    {!isLocked && !lesson.completed && (
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
