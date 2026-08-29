import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { Clock, Zap, RotateCcw, Trophy } from "lucide-react";

interface SpeedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: "java" | "systems" | "math";
}

const questions: SpeedQuestion[] = [
  {
    id: "1",
    question: "Which keyword creates a variable that cannot change?",
    options: ["var", "final", "static", "const"],
    correctIndex: 1,
    category: "java",
  },
  {
    id: "2",
    question: "What does 'int' store?",
    options: ["Text", "Whole numbers", "Decimals", "True/False"],
    correctIndex: 1,
    category: "java",
  },
  {
    id: "3",
    question: "Which symbol is used for 'equals' comparison?",
    options: ["=", "==", "===", ":="],
    correctIndex: 1,
    category: "java",
  },
  {
    id: "4",
    question: "What is the first step in SDLC?",
    options: ["Testing", "Design", "Requirements", "Deployment"],
    correctIndex: 2,
    category: "systems",
  },
  {
    id: "5",
    question: "What is 2^3?",
    options: ["6", "8", "9", "16"],
    correctIndex: 1,
    category: "math",
  },
  {
    id: "6",
    question: "Which loop runs at least once?",
    options: ["for", "while", "do-while", "foreach"],
    correctIndex: 2,
    category: "java",
  },
  {
    id: "7",
    question: "What does 'void' mean in a method?",
    options: ["Returns nothing", "Returns zero", "Private method", "Static method"],
    correctIndex: 0,
    category: "java",
  },
  {
    id: "8",
    question: "UML stands for?",
    options: ["Unified Model Language", "Universal Modeling Language", "Unified Modeling Language", "User Model Language"],
    correctIndex: 2,
    category: "systems",
  },
  {
    id: "9",
    question: "Which is faster: O(n) or O(n²)?",
    options: ["O(n)", "O(n²)", "Same speed", "Depends on n"],
    correctIndex: 0,
    category: "math",
  },
  {
    id: "10",
    question: "Array index starts at?",
    options: ["1", "0", "-1", "Depends"],
    correctIndex: 1,
    category: "java",
  },
];

const GAME_TIME = 60; // seconds
const STREAK_BONUS = 5;

export function SpeedChallengeGame() {
  const { gameMode, addXp, playSound } = useGame();
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<SpeedQuestion[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shuffle questions on game start
  const startGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setGameState("playing");
    setTimeLeft(GAME_TIME);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswers(0);
    playSound("click");
  };

  // Timer logic
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("finished");
      playSound("levelUp");
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft, playSound]);

  const handleAnswer = (selectedIndex: number) => {
    if (showResult || gameState !== "playing") return;

    const currentQuestion = shuffledQuestions[currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    setShowResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      playSound("success");
      const basePoints = 10;
      const streakBonus = streak * STREAK_BONUS;
      const timeBonus = Math.floor(timeLeft / 10);
      const points = basePoints + streakBonus + timeBonus;
      
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setMaxStreak((prev) => Math.max(prev, streak + 1));
      setCorrectAnswers((prev) => prev + 1);
      addXp(points);
    } else {
      playSound("error");
      setStreak(0);
    }

    // Move to next question after brief delay
    setTimeout(() => {
      setShowResult(null);
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Reshuffle and continue
        setShuffledQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
      }
    }, 500);
  };

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = (timeLeft / GAME_TIME) * 100;

  if (gameState === "ready") {
    return (
      <div className="text-center p-8">
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">
          Speed Challenge
        </h2>
        <p className="text-muted-foreground mb-2">
          Answer as many questions as you can in {GAME_TIME} seconds!
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Build streaks for bonus points 🔥
        </p>
        <Button variant="hero" size="xl" onClick={startGame}>
          <Zap className="w-6 h-6 mr-2" />
          Start Challenge
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          {score >= 200 ? "🏆" : score >= 100 ? "🎉" : "⭐"}
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">
          Times Up!
        </h2>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
          </div>
          <div className="p-4 rounded-lg bg-success/10 border border-success/30">
            <p className="text-sm text-muted-foreground">Correct</p>
            <p className="text-2xl font-bold text-success">{correctAnswers}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-sm text-muted-foreground">Max Streak</p>
            <p className="text-2xl font-bold text-secondary">{maxStreak} 🔥</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-2xl font-bold text-accent">
              {correctAnswers > 0 ? Math.round((correctAnswers / (currentIndex + 1)) * 100) : 0}%
            </p>
          </div>
        </div>
        <Button variant="hero" size="lg" onClick={startGame}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft <= 10
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
            }`}
            animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
          >
            <Clock className="w-5 h-5" />
            <span className="font-bold text-xl">{timeLeft}s</span>
          </motion.div>
          <div className="text-sm">
            <span className="text-muted-foreground">Score:</span>{" "}
            <span className="font-bold text-success">{score}</span>
          </div>
        </div>
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary font-bold"
          >
            🔥 {streak} streak!
          </motion.div>
        )}
      </div>

      {/* Progress bar (time) */}
      <Progress 
        value={progress} 
        className={`h-2 ${timeLeft <= 10 ? "[&>div]:bg-destructive" : ""}`}
      />

      {/* Question Card */}
      {currentQuestion && (
        <Card variant="glow">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className={`px-2 py-0.5 rounded-full ${
                currentQuestion.category === "java" ? "bg-primary/20 text-primary" :
                currentQuestion.category === "systems" ? "bg-accent/20 text-accent" :
                "bg-secondary/20 text-secondary"
              }`}>
                {currentQuestion.category.toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-xl text-foreground">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-4 rounded-lg text-left font-medium transition-all ${
                    showResult
                      ? index === currentQuestion.correctIndex
                        ? "bg-success/20 border-2 border-success text-success"
                        : showResult === "wrong" &&
                          index !== currentQuestion.correctIndex
                        ? "bg-muted border-2 border-border opacity-50"
                        : "bg-muted border-2 border-border"
                      : "bg-muted border-2 border-border hover:border-primary hover:bg-primary/10 cursor-pointer"
                  }`}
                  onClick={() => handleAnswer(index)}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  disabled={showResult !== null}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-foreground">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`text-center p-4 rounded-lg ${
              showResult === "correct"
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            <span className="text-2xl font-bold">
              {showResult === "correct" ? "✓ Correct!" : "✗ Wrong!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
