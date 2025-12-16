import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
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

// Sample lesson data - Hello World
const helloWorldLesson: LessonData = {
  id: "hello-world",
  title: "Hello World!",
  xpReward: 50,
  steps: [
    {
      type: "typing",
      title: "Hello World",
      difficulty: "easy",
      prompt: "Type your first Java program!",
      codeToType: 'System.out.println("Hello World!");',
      explanation: "This is how we print text to the screen in Java!",
    },
    {
      type: "quiz",
      title: "Hello World!",
      difficulty: "easy",
      question: "What do we use to print text in Java?",
      codeExample: 'System.out.println("Hello!");',
      options: [
        { label: "A", text: "print()" },
        { label: "B", text: "System.out.println()" },
        { label: "C", text: "console.log()" },
      ],
      correctAnswer: "B",
      explanation: "System.out.println() is Java's way to print text to the console!",
    },
    {
      type: "typing",
      title: "Print a Message",
      difficulty: "easy",
      prompt: "Print your own message!",
      codeToType: 'System.out.println("I love coding!");',
      explanation: "You can print any text inside the quotes!",
    },
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
  const lesson = helloWorldLesson; // For now, just use hello world
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex) / lesson.steps.length) * 100;
  
  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate("/dashboard");
    }
  };
  
  const normalizeCode = (code: string) => {
    return code.replace(/\s+/g, " ").trim();
  };
  
  const handleTypingCheck = () => {
    if (!currentStep.codeToType) return;
    
    const normalized = normalizeCode(userInput);
    const expected = normalizeCode(currentStep.codeToType);
    const correct = normalized === expected;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound("success");
    } else {
      playSound("error");
    }
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
    
    if (correct) {
      playSound("success");
    } else {
      playSound("error");
    }
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
      // Lesson complete
      addXp(lesson.xpReward);
      playSound("levelUp");
      if (onComplete) {
        onComplete();
      } else {
        navigate("/dashboard");
      }
    }
  };
  
  // Render highlight for typing challenge
  const renderCodeWithHighlight = () => {
    if (!currentStep.codeToType) return null;
    
    const code = currentStep.codeToType;
    const typed = userInput;
    
    return (
      <div className="font-mono text-lg md:text-xl leading-relaxed tracking-wide p-6 rounded-xl bg-accent/50">
        {code.split("").map((char, index) => {
          const typedChar = typed[index];
          let className = "text-muted-foreground/50";
          
          if (typedChar !== undefined) {
            if (typedChar === char) {
              className = "text-primary bg-primary/20";
            } else {
              className = "text-destructive bg-destructive/20";
            }
          } else if (index === typed.length) {
            className = "text-muted-foreground border-l-2 border-primary animate-pulse";
          }
          
          return (
            <span key={index} className={className}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleExit}>
            Exit
          </Button>
          <span className="font-semibold text-foreground">{currentStep.title}</span>
          <span className="text-sm text-muted-foreground">
            {currentStepIndex + 1}/{lesson.steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">{currentStep.title}</h2>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${currentStep.difficulty === "easy" ? "bg-success/10 text-success border-success/30" : ""}
                      ${currentStep.difficulty === "medium" ? "bg-warning/10 text-warning border-warning/30" : ""}
                      ${currentStep.difficulty === "hard" ? "bg-destructive/10 text-destructive border-destructive/30" : ""}
                    `}
                  >
                    {currentStep.difficulty}
                  </Badge>
                </div>
                
                {/* Typing Challenge */}
                {currentStep.type === "typing" && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">{currentStep.prompt}</p>
                    
                    {/* Code to type with highlighting */}
                    {renderCodeWithHighlight()}
                    
                    {/* Input field */}
                    <div className="relative">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !showResult) {
                            handleTypingCheck();
                          }
                        }}
                        placeholder="Start typing here..."
                        disabled={showResult}
                        className="w-full px-6 py-4 text-lg font-mono rounded-xl border-2 border-primary/50 bg-background focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                        autoFocus
                      />
                    </div>
                    
                    {/* Check button */}
                    {!showResult && (
                      <Button 
                        onClick={handleTypingCheck} 
                        className="w-full"
                        disabled={!userInput.trim()}
                      >
                        Check
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Quiz Question */}
                {currentStep.type === "quiz" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {currentStep.question}
                    </h3>
                    
                    {/* Code Example */}
                    {currentStep.codeExample && (
                      <div className="p-4 rounded-lg bg-accent/50 font-mono text-sm flex items-center gap-2">
                        <span className="text-primary">&lt;&gt;</span>
                        <code className="text-foreground">{currentStep.codeExample}</code>
                      </div>
                    )}
                    
                    {/* Options */}
                    <div className="space-y-3">
                      {currentStep.options?.map((option) => {
                        const isSelected = selectedAnswer === option.label;
                        const isCorrectAnswer = option.label === currentStep.correctAnswer;
                        
                        let optionClass = "border-2 border-border bg-card hover:border-primary/50";
                        
                        if (showResult) {
                          if (isCorrectAnswer) {
                            optionClass = "border-2 border-success bg-success/10";
                          } else if (isSelected && !isCorrectAnswer) {
                            optionClass = "border-2 border-destructive bg-destructive/10";
                          } else {
                            optionClass = "border-2 border-border bg-card opacity-50";
                          }
                        } else if (isSelected) {
                          optionClass = "border-2 border-primary bg-primary/10";
                        }
                        
                        return (
                          <motion.button
                            key={option.label}
                            onClick={() => handleQuizAnswer(option.label)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${optionClass}`}
                            whileHover={!showResult ? { scale: 1.01 } : {}}
                            whileTap={!showResult ? { scale: 0.99 } : {}}
                          >
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                              ${showResult && isCorrectAnswer ? "bg-success text-success-foreground" : ""}
                              ${showResult && isSelected && !isCorrectAnswer ? "bg-destructive text-destructive-foreground" : ""}
                              ${!showResult && isSelected ? "bg-primary text-primary-foreground" : ""}
                              ${!showResult && !isSelected ? "bg-muted text-muted-foreground" : ""}
                              ${showResult && !isSelected && !isCorrectAnswer ? "bg-muted text-muted-foreground" : ""}
                            `}>
                              {option.label}
                            </span>
                            <span className="font-medium text-foreground">{option.text}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* Check button */}
                    {!showResult && (
                      <Button 
                        onClick={handleQuizCheck}
                        className="w-full"
                        disabled={!selectedAnswer}
                      >
                        Check Answer
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Result Feedback */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-6 p-4 rounded-xl ${
                        isCorrect
                          ? "bg-success/10 border border-success/30"
                          : "bg-destructive/10 border border-destructive/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                        )}
                        <div>
                          <p className={`font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                            {isCorrect ? "Correct! 🎉" : "Not quite right"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentStep.explanation}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleNext}
                        className="w-full mt-4"
                        variant={isCorrect ? "default" : "secondary"}
                      >
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
