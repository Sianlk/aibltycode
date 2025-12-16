import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, BookOpen, Code, Gamepad2, Lightbulb } from "lucide-react";

// Sample lesson content
const lessonContent = {
  j1: {
    title: "Variables & Types",
    story: "Captain Nova needs to store the ship's fuel level. Let's learn how to save data in Java!",
    content: `Variables are like labeled containers that hold values.

In Java, every variable has a **type** that tells what kind of data it holds:
- \`int\` - whole numbers (like 42)
- \`double\` - decimal numbers (like 3.14)
- \`String\` - text (like "Hello")
- \`boolean\` - true or false`,
    example: `// Creating variables
int fuelLevel = 100;
double temperature = 23.5;
String shipName = "Nova One";
boolean enginesOn = true;`,
    challenge: {
      question: "Which type would you use to store a player's name?",
      options: ["int", "double", "String", "boolean"],
      correctIndex: 2,
      explanation: "String is used for text data like names, messages, and labels.",
    },
    recap: [
      "Variables store data with a name",
      "Every variable has a type (int, double, String, boolean)",
      "Choose the right type for your data",
    ],
  },
};

type LessonStep = "story" | "content" | "example" | "challenge" | "recap";

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { gameMode, addXp, playSound } = useGame();
  
  const [currentStep, setCurrentStep] = useState<LessonStep>("story");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // For demo, use j1 content
  const lesson = lessonContent.j1;
  
  const steps: LessonStep[] = ["story", "content", "example", "challenge", "recap"];
  const stepIndex = steps.indexOf(currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const stepIcons = {
    story: "📖",
    content: "📚",
    example: "💻",
    challenge: "🎮",
    recap: "✨",
  };

  const handleNext = () => {
    playSound("click");
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      // Lesson complete
      addXp(25);
      playSound("levelUp");
      navigate(`/module/${moduleId}`);
    }
  };

  const handlePrevious = () => {
    playSound("click");
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === lesson.challenge.correctIndex) {
      playSound("success");
      addXp(10);
    } else {
      playSound("error");
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case "story":
        return (
          <motion.div
            key="story"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center py-8"
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {lesson.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {lesson.story}
            </p>
          </motion.div>
        );

      case "content":
        return (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Learn</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              {lesson.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph.split(/(`[^`]+`)/).map((part, j) =>
                    part.startsWith("`") && part.endsWith("`") ? (
                      <code key={j} className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-sm">
                        {part.slice(1, -1)}
                      </code>
                    ) : part.split(/(\*\*[^*]+\*\*)/).map((subpart, k) =>
                      subpart.startsWith("**") && subpart.endsWith("**") ? (
                        <strong key={k} className="text-foreground font-bold">
                          {subpart.slice(2, -2)}
                        </strong>
                      ) : (
                        subpart
                      )
                    )
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        );

      case "example":
        return (
          <motion.div
            key="example"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-success" />
              <h3 className="text-lg font-bold text-foreground">Example Code</h3>
            </div>
            <pre className="p-4 rounded-lg bg-muted border border-border overflow-x-auto">
              <code className="text-sm font-mono text-foreground">
                {lesson.example}
              </code>
            </pre>
            {gameMode === "kid" && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-primary">
                    Each line creates a variable with a name, type, and value!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "challenge":
        return (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-bold text-foreground">Challenge Time!</h3>
            </div>
            <p className="text-foreground font-medium mb-4">
              {lesson.challenge.question}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {lesson.challenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-4 rounded-lg font-mono text-sm transition-all ${
                    showResult
                      ? index === lesson.challenge.correctIndex
                        ? "bg-success/20 border-2 border-success text-success"
                        : selectedAnswer === index
                        ? "bg-destructive/20 border-2 border-destructive text-destructive"
                        : "bg-muted border-2 border-border opacity-50"
                      : selectedAnswer === index
                      ? "bg-primary/20 border-2 border-primary text-primary"
                      : "bg-muted border-2 border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            
            {!showResult && (
              <Button
                variant="hero"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="w-full"
              >
                Check Answer
              </Button>
            )}

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`p-4 rounded-lg ${
                    selectedAnswer === lesson.challenge.correctIndex
                      ? "bg-success/10 border border-success/30"
                      : "bg-destructive/10 border border-destructive/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selectedAnswer === lesson.challenge.correctIndex ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-bold ${
                        selectedAnswer === lesson.challenge.correctIndex
                          ? "text-success"
                          : "text-destructive"
                      }`}>
                        {selectedAnswer === lesson.challenge.correctIndex
                          ? "Correct! +10 XP 🎉"
                          : "Not quite right"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lesson.challenge.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case "recap":
        return (
          <motion.div
            key="recap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-4 text-center"
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              ✨
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              Quick Recap
            </h3>
            <div className="space-y-3 max-w-md mx-auto text-left">
              {lesson.recap.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30"
                >
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/module/${moduleId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Module
          </Button>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    i <= stepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepIcons[step]}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Lesson Content */}
        <Card variant="glow">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={stepIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant={currentStep === "recap" ? "success" : "default"}
                onClick={handleNext}
                disabled={currentStep === "challenge" && !showResult}
              >
                {currentStep === "recap" ? (
                  <>
                    Complete Lesson
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
