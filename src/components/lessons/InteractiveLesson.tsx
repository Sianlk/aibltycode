import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { useProgress } from "@/hooks/useProgress";
import { getLessonById, LessonStep } from "@/data/lessons";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { trackLessonCompleted } from "@/lib/privacyAnalytics";

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface InteractiveLessonProps {
  lessonId?: string;
  onComplete?: () => void;
  onExit?: () => void;
}

export function InteractiveLesson({ lessonId: propLessonId, onComplete, onExit }: InteractiveLessonProps) {
  const navigate = useNavigate();
  const params = useParams<{ moduleId: string; lessonId: string }>();
  const lessonId = propLessonId || params.lessonId || "hello-world";
  const moduleId = params.moduleId || "java-foundations";
  
  const { playSound, addXp } = useGame();
  const { completeLesson } = useProgress();
  const lesson = getLessonById(lessonId);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const codeDisplayRef = useRef<HTMLDivElement>(null);
  
  // Shuffle options once per step - memoized by step index
  const shuffledOptions = useMemo(() => {
    if (!lesson) return [];
    const step = lesson.steps[currentStepIndex];
    if (step?.type === "quiz" && step.options) {
      return shuffleArray(step.options);
    }
    return step?.options || [];
  }, [lesson, currentStepIndex]);
  
  if (!lesson) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-muted-foreground">Lesson not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </Card>
    );
  }
  
  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex) / lesson.steps.length) * 100;
  
  const handleExit = () => {
    playSound("click");
    if (onExit) onExit();
    else navigate(`/module/${moduleId}`);
  };
  
  const normalizeCode = (code: string) => code.replace(/\s+/g, " ").trim();
  
  const handleTypingCheck = () => {
    if (!currentStep.codeToType) return;
    const correct = normalizeCode(userInput) === normalizeCode(currentStep.codeToType);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setTotalScore(prev => prev + 20);
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
      setTotalScore(prev => prev + 15);
      playSound("success");
    } else {
      playSound("error");
    }
  };
  
  const handleNext = async () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setUserInput("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      playSound("click");
    } else {
      // Lesson complete - save progress
      const finalScore = totalScore + (isCorrect ? 15 : 0);
      addXp(lesson.xpReward);
      playSound("levelUp");
      
      // Save to database
      await completeLesson(moduleId, lessonId, finalScore);

      // Opt-in analytics only (no-op unless the learner granted consent)
      trackLessonCompleted({ moduleId, lessonId, score: finalScore, stepCount: lesson.steps.length });

      if (onComplete) onComplete();
      else navigate(`/module/${moduleId}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleExit} className="text-muted-foreground gap-2">
            <ArrowLeft className="w-4 h-4" />
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
                    
                    {/* Code Display - auto-scrolling */}
                    <div 
                      ref={codeDisplayRef}
                      className="font-mono text-base sm:text-lg p-5 rounded-xl bg-accent/60 text-accent-foreground overflow-x-auto scroll-smooth"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {currentStep.codeToType?.split("").map((char, i) => {
                        const typedChar = userInput[i];
                        let cls = "text-muted-foreground/60";
                        if (typedChar !== undefined) {
                          cls = typedChar === char ? "text-primary font-bold" : "text-destructive bg-destructive/20";
                        } else if (i === userInput.length) {
                          cls = "border-l-2 border-primary animate-pulse bg-primary/10";
                        }
                        return (
                          <span 
                            key={i} 
                            className={cls}
                            ref={i === userInput.length ? (el) => el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }) : undefined}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        );
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
                      {shuffledOptions.map((opt) => {
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
                        {currentStepIndex < lesson.steps.length - 1 ? "Continue" : `Complete (+${lesson.xpReward} XP)`}
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
