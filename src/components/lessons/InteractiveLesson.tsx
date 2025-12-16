import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LessonStep {
  type: "typing" | "quiz";
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prompt?: string;
  codeToType?: string;
  question?: string;
  codeExample?: string;
  options?: { label: string; text: string }[];
  correctAnswer?: string;
  explanation: string;
}

interface LessonData {
  id: string;
  title: string;
  steps: LessonStep[];
  xpReward: number;
}

// Comprehensive lesson content
const lessonsData: Record<string, LessonData> = {
  "hello-world": {
    id: "hello-world",
    title: "Hello World!",
    xpReward: 50,
    steps: [
      { type: "typing", title: "Hello World", difficulty: "easy", prompt: "Type your first Java program!", codeToType: 'System.out.println("Hello World!");', explanation: "println() prints text and moves to a new line." },
      { type: "quiz", title: "Hello World!", difficulty: "easy", question: "What do we use to print text in Java?", options: [{ label: "A", text: "print()" }, { label: "B", text: "System.out.println()" }, { label: "C", text: "console.log()" }], correctAnswer: "B", explanation: "System.out.println() is Java's way to print to console!" },
      { type: "typing", title: "Print Message", difficulty: "easy", prompt: "Print your own message!", codeToType: 'System.out.println("I love coding!");', explanation: "You can print any text inside the quotes!" },
    ],
  },
  "variables": {
    id: "variables",
    title: "Variables",
    xpReward: 75,
    steps: [
      { type: "typing", title: "Variables", difficulty: "easy", prompt: "Create a variable to store a number!", codeToType: "int age = 10;", explanation: "Variables are like boxes that hold values. 'int' means integer." },
      { type: "quiz", title: "Variables", difficulty: "easy", question: "What type stores whole numbers?", options: [{ label: "A", text: "String" }, { label: "B", text: "int" }, { label: "C", text: "double" }], correctAnswer: "B", explanation: "int stores whole numbers like 1, 2, 100!" },
      { type: "typing", title: "String Variable", difficulty: "easy", prompt: "Create a variable for your name!", codeToType: 'String name = "Alex";', explanation: "String stores text in double quotes." },
    ],
  },
  "data-types": {
    id: "data-types",
    title: "Data Types",
    xpReward: 100,
    steps: [
      { type: "typing", title: "Data Types", difficulty: "easy", prompt: "Create a decimal number!", codeToType: "double price = 9.99;", explanation: "double stores decimal numbers like 9.99 or 3.14." },
      { type: "quiz", title: "Data Types", difficulty: "medium", question: "Which type stores true/false?", options: [{ label: "A", text: "boolean" }, { label: "B", text: "int" }, { label: "C", text: "char" }], correctAnswer: "A", explanation: "boolean stores true or false values!" },
      { type: "typing", title: "Boolean", difficulty: "easy", prompt: "Create a boolean variable!", codeToType: "boolean isHappy = true;", explanation: "Booleans are perfect for yes/no decisions." },
    ],
  },
  "if-statements": {
    id: "if-statements",
    title: "If Statements",
    xpReward: 100,
    steps: [
      { type: "typing", title: "If Statement", difficulty: "medium", prompt: "Write a simple if statement!", codeToType: "if (x == 5) { }", explanation: "if checks a condition and runs code if true." },
      { type: "quiz", title: "If Statements", difficulty: "medium", question: "What does == mean?", options: [{ label: "A", text: "Assign value" }, { label: "B", text: "Check equality" }, { label: "C", text: "Not equal" }], correctAnswer: "B", explanation: "== checks if two values are equal!" },
      { type: "typing", title: "If-Else", difficulty: "medium", prompt: "Write an if-else statement!", codeToType: "if (score > 50) { } else { }", explanation: "else runs when the if condition is false." },
    ],
  },
  "for-loops": {
    id: "for-loops",
    title: "For Loops",
    xpReward: 125,
    steps: [
      { type: "typing", title: "For Loop", difficulty: "medium", prompt: "Create a loop from 0 to 4!", codeToType: "for (int i = 0; i < 5; i++) { }", explanation: "For loops repeat code a specific number of times." },
      { type: "quiz", title: "For Loops", difficulty: "medium", question: "What does i++ do?", options: [{ label: "A", text: "Subtract 1" }, { label: "B", text: "Add 1" }, { label: "C", text: "Multiply by 2" }], correctAnswer: "B", explanation: "i++ adds 1 to i after each loop!" },
    ],
  },
  "while-loops": {
    id: "while-loops",
    title: "While Loops",
    xpReward: 125,
    steps: [
      { type: "typing", title: "While Loop", difficulty: "medium", prompt: "Create a while loop!", codeToType: "while (x < 10) { x++; }", explanation: "While loops repeat while a condition is true." },
      { type: "quiz", title: "While Loops", difficulty: "medium", question: "When does a while loop stop?", options: [{ label: "A", text: "After 5 times" }, { label: "B", text: "When condition is false" }, { label: "C", text: "Never" }], correctAnswer: "B", explanation: "While loops stop when their condition becomes false!" },
    ],
  },
  "methods": {
    id: "methods",
    title: "Methods",
    xpReward: 150,
    steps: [
      { type: "typing", title: "Methods", difficulty: "medium", prompt: "Create a simple method!", codeToType: "public void sayHello() { }", explanation: "Methods are reusable blocks of code." },
      { type: "quiz", title: "Methods", difficulty: "medium", question: "What does 'void' mean?", options: [{ label: "A", text: "Returns a number" }, { label: "B", text: "Returns nothing" }, { label: "C", text: "Private method" }], correctAnswer: "B", explanation: "void means the method doesn't return anything!" },
    ],
  },
  "arrays": {
    id: "arrays",
    title: "Arrays",
    xpReward: 150,
    steps: [
      { type: "typing", title: "Arrays", difficulty: "medium", prompt: "Create an array of numbers!", codeToType: "int[] numbers = {1, 2, 3};", explanation: "Arrays store multiple values of the same type." },
      { type: "quiz", title: "Arrays", difficulty: "medium", question: "Array indexes start at?", options: [{ label: "A", text: "0" }, { label: "B", text: "1" }, { label: "C", text: "-1" }], correctAnswer: "A", explanation: "Arrays start at index 0, not 1!" },
    ],
  },
};

// Default lesson for unimplemented content
const defaultLesson: LessonData = {
  id: "default",
  title: "Coming Soon",
  xpReward: 25,
  steps: [
    { type: "quiz", title: "Preview", difficulty: "easy", question: "This lesson is being prepared!", options: [{ label: "A", text: "I'm excited!" }, { label: "B", text: "Can't wait!" }], correctAnswer: "A", explanation: "More lessons coming soon!" },
  ],
};

interface InteractiveLessonProps {
  lessonId?: string;
  onComplete?: () => void;
  onExit?: () => void;
}

export function InteractiveLesson({ lessonId = "hello-world", onComplete, onExit }: InteractiveLessonProps) {
  const navigate = useNavigate();
  const { playSound, addXp } = useGame();
  const lesson = lessonsData[lessonId || "hello-world"] || defaultLesson;
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex) / lesson.steps.length) * 100;
  
  const handleExit = () => {
    playSound("click");
    if (onExit) onExit();
    else navigate("/dashboard");
  };
  
  const normalizeCode = (code: string) => code.replace(/\s+/g, " ").trim();
  
  const handleTypingCheck = () => {
    if (!currentStep.codeToType) return;
    const correct = normalizeCode(userInput) === normalizeCode(currentStep.codeToType);
    setIsCorrect(correct);
    setShowResult(true);
    playSound(correct ? "success" : "error");
  };
  
  const handleQuizAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };
  
  const handleQuizCheck = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === currentStep.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    playSound(correct ? "success" : "error");
  };
  
  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setUserInput("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      playSound("click");
    } else {
      addXp(lesson.xpReward);
      playSound("levelUp");
      if (onComplete) onComplete();
      else navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleExit} className="text-muted-foreground">
            Exit
          </Button>
          <span className="font-bold text-foreground">{currentStep.title}</span>
          <span className="text-sm text-muted-foreground">{currentStepIndex + 1}/{lesson.steps.length}</span>
        </div>
        <div className="h-1 bg-muted">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">{currentStep.title}</h2>
                  <Badge variant="outline" className={
                    currentStep.difficulty === "easy" ? "bg-success/10 text-success border-success/30" :
                    currentStep.difficulty === "medium" ? "bg-warning/10 text-warning border-warning/30" :
                    "bg-destructive/10 text-destructive border-destructive/30"
                  }>
                    {currentStep.difficulty}
                  </Badge>
                </div>
                
                {/* Typing Challenge */}
                {currentStep.type === "typing" && (
                  <div className="space-y-5">
                    <p className="text-muted-foreground">{currentStep.prompt}</p>
                    
                    {/* Code Display */}
                    <div className="font-mono text-base sm:text-lg p-5 rounded-xl bg-accent/60 text-accent-foreground overflow-x-auto">
                      {currentStep.codeToType?.split("").map((char, i) => {
                        const typedChar = userInput[i];
                        let cls = "text-muted-foreground/60";
                        if (typedChar !== undefined) {
                          cls = typedChar === char ? "text-primary" : "text-destructive bg-destructive/20";
                        } else if (i === userInput.length) {
                          cls = "border-l-2 border-primary animate-pulse";
                        }
                        return <span key={i} className={cls}>{char === " " ? "\u00A0" : char}</span>;
                      })}
                    </div>
                    
                    {/* Input */}
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !showResult && handleTypingCheck()}
                      placeholder="Start typing here..."
                      disabled={showResult}
                      className="w-full px-5 py-4 text-base font-mono rounded-xl border-2 border-primary/40 bg-card focus:border-primary focus:outline-none"
                      autoFocus
                    />
                    
                    {!showResult && (
                      <Button onClick={handleTypingCheck} className="w-full h-12" disabled={!userInput.trim()}>
                        Check
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Quiz */}
                {currentStep.type === "quiz" && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-foreground">{currentStep.question}</h3>
                    
                    {currentStep.codeExample && (
                      <div className="p-4 rounded-lg bg-accent/50 font-mono text-sm">
                        <code>{currentStep.codeExample}</code>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {currentStep.options?.map((opt) => {
                        const isSelected = selectedAnswer === opt.label;
                        const isCorrectAns = opt.label === currentStep.correctAnswer;
                        let cls = "border-2 border-border bg-card hover:border-primary/50";
                        if (showResult) {
                          cls = isCorrectAns ? "border-2 border-success bg-success/10" :
                                isSelected ? "border-2 border-destructive bg-destructive/10" :
                                "border-2 border-border bg-card opacity-50";
                        } else if (isSelected) {
                          cls = "border-2 border-primary bg-primary/10";
                        }
                        
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleQuizAnswer(opt.label)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${cls}`}
                          >
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                              ${showResult && isCorrectAns ? "bg-success text-white" : ""}
                              ${showResult && isSelected && !isCorrectAns ? "bg-destructive text-white" : ""}
                              ${!showResult && isSelected ? "bg-primary text-white" : ""}
                              ${!showResult && !isSelected ? "bg-muted text-muted-foreground" : ""}
                              ${showResult && !isSelected && !isCorrectAns ? "bg-muted text-muted-foreground" : ""}
                            `}>
                              {opt.label}
                            </span>
                            <span className="font-medium text-foreground text-left">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    
                    {!showResult && (
                      <Button onClick={handleQuizCheck} className="w-full h-12" disabled={!selectedAnswer}>
                        Check Answer
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-destructive" />}
                        <div>
                          <p className={`font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                            {isCorrect ? "Correct! 🎉" : "Not quite right"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{currentStep.explanation}</p>
                        </div>
                      </div>
                      <Button onClick={handleNext} className="w-full mt-4">
                        {currentStepIndex < lesson.steps.length - 1 ? "Continue" : "Complete Lesson"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
