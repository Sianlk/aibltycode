import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from "lucide-react";

interface CodeChallenge {
  id: string;
  prompt: string;
  code: string;
  hint: string;
  explanation: string;
}

const challenges: CodeChallenge[] = [
  {
    id: "1",
    prompt: "Create a variable to store your age",
    code: "int age = 10;",
    hint: "Use 'int' for whole numbers",
    explanation: "Variables are like boxes that hold values. 'int' means integer (whole number).",
  },
  {
    id: "2",
    prompt: "Print 'Hello World' to the screen",
    code: 'System.out.println("Hello World");',
    hint: "Use System.out.println()",
    explanation: "println() prints text and moves to a new line. The text goes inside quotes.",
  },
  {
    id: "3",
    prompt: "Create a String variable for your name",
    code: 'String name = "Alex";',
    hint: "String stores text in double quotes",
    explanation: "String is a type for text. Always use double quotes around the text value.",
  },
  {
    id: "4",
    prompt: "Write a simple if statement checking if x equals 5",
    code: "if (x == 5) { }",
    hint: "Use == to compare values",
    explanation: "== checks if two values are equal. = assigns a value. Don't mix them up!",
  },
  {
    id: "5",
    prompt: "Create a for loop that counts from 0 to 4",
    code: "for (int i = 0; i < 5; i++) { }",
    hint: "Start at 0, loop while less than 5",
    explanation: "For loops have 3 parts: start value, condition to continue, and increment.",
  },
];

export function CodeTypingGame() {
  const { gameMode, addXp, playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex + (isCorrect ? 1 : 0)) / challenges.length) * 100;

  const normalizeCode = (code: string) => {
    return code.replace(/\s+/g, " ").trim().toLowerCase();
  };

  const checkAnswer = useCallback(() => {
    const isMatch = normalizeCode(userInput) === normalizeCode(currentChallenge.code);
    setIsCorrect(isMatch);

    if (isMatch) {
      playSound("success");
      const points = showHint ? 5 : 10;
      setScore((prev) => prev + points + streak * 2);
      setStreak((prev) => prev + 1);
      addXp(points);
    } else {
      playSound("error");
      setStreak(0);
    }
  }, [userInput, currentChallenge, showHint, streak, playSound, addXp]);

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
      setIsCorrect(null);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setUserInput("");
    setIsCorrect(null);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isCorrect === null) {
        checkAnswer();
      } else if (isCorrect) {
        nextChallenge();
      }
    }
  };

  if (gameComplete) {
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
          🎉
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">
          Mission Complete!
        </h2>
        <p className="text-xl text-muted-foreground mb-2">
          Final Score: <span className="text-primary font-bold">{score}</span>
        </p>
        <p className="text-muted-foreground mb-6">
          You completed all {challenges.length} challenges!
        </p>
        <Button variant="hero" size="lg" onClick={resetGame}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress and Stats */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Challenge:</span>{" "}
            <span className="font-bold text-primary">
              {currentIndex + 1}/{challenges.length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Score:</span>{" "}
            <span className="font-bold text-success">{score}</span>
          </div>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-sm px-2 py-1 rounded-full bg-secondary/20 text-secondary"
            >
              🔥 {streak} streak!
            </motion.div>
          )}
        </div>
        <Progress value={progress} className="w-32 h-2" />
      </div>

      {/* Challenge Card */}
      <Card variant="glow">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {gameMode === "kid" ? "🎯 " : ""}
            {currentChallenge.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Input */}
          <div className="relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your code here..."
              className="w-full h-24 p-4 font-mono text-sm bg-muted rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors resize-none text-foreground placeholder:text-muted-foreground"
              disabled={isCorrect !== null}
              autoFocus
            />
            {gameMode === "kid" && userInput.length === 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                Press Enter to check ↵
              </div>
            )}
          </div>

          {/* Hint Button */}
          {isCorrect === null && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
                disabled={showHint}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? "Hint shown" : "Need a hint?"}
              </Button>
            </div>
          )}

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3 rounded-lg bg-warning/10 border border-warning/30"
              >
                <p className="text-sm text-warning">
                  💡 {currentChallenge.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Display */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? "bg-success/10 border border-success/30"
                    : "bg-destructive/10 border border-destructive/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                      {isCorrect ? "Perfect! 🎉" : "Not quite right"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Expected:{" "}
                        <code className="px-2 py-1 rounded bg-muted font-mono text-xs">
                          {currentChallenge.code}
                        </code>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {currentChallenge.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isCorrect === null ? (
              <Button variant="hero" onClick={checkAnswer} disabled={!userInput.trim()}>
                Check Answer
              </Button>
            ) : isCorrect ? (
              <Button variant="success" onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? "Next Challenge →" : "Finish! 🎉"}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setUserInput("");
                  setIsCorrect(null);
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
