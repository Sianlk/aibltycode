import { useState, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, RotateCcw, Shuffle, GripVertical } from "lucide-react";

interface OrderingChallenge {
  id: string;
  title: string;
  description: string;
  lines: string[];
  correctOrder: number[];
  explanation: string;
}

const challenges: OrderingChallenge[] = [
  {
    id: "1",
    title: "Print a greeting",
    description: "Put these lines in order to print 'Hello!' to the screen",
    lines: [
      "public static void main(String[] args) {",
      "public class Hello {",
      'System.out.println("Hello!");',
      "}",
      "}",
    ],
    correctOrder: [1, 0, 2, 3, 4],
    explanation: "In Java, the class declaration comes first, then the main method, then the code inside.",
  },
  {
    id: "2",
    title: "Calculate a sum",
    description: "Order these lines to add two numbers and print the result",
    lines: [
      "int sum = a + b;",
      "int a = 5;",
      "int b = 3;",
      "System.out.println(sum);",
    ],
    correctOrder: [1, 2, 0, 3],
    explanation: "Declare variables first, then calculate, then output. Order matters in programming!",
  },
  {
    id: "3",
    title: "If-else statement",
    description: "Arrange this if-else statement correctly",
    lines: [
      '} else {',
      'if (score >= 50) {',
      'System.out.println("Pass!");',
      'System.out.println("Try again");',
      '}',
    ],
    correctOrder: [1, 2, 0, 3, 4],
    explanation: "If statements check a condition. The else block runs when the condition is false.",
  },
  {
    id: "4",
    title: "Simple for loop",
    description: "Put this for loop in the right order",
    lines: [
      "System.out.println(i);",
      "}",
      "for (int i = 0; i < 3; i++) {",
    ],
    correctOrder: [2, 0, 1],
    explanation: "A for loop has the header first, then the body inside curly braces.",
  },
];

export function CodeOrderingGame() {
  const { gameMode, addXp, playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<{ id: string; text: string; originalIndex: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex + (isCorrect ? 1 : 0)) / challenges.length) * 100;

  // Initialize shuffled items
  useEffect(() => {
    shuffleItems();
  }, [currentIndex]);

  const shuffleItems = () => {
    const shuffled = currentChallenge.lines
      .map((text, index) => ({ id: `${index}`, text, originalIndex: index }))
      .sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setIsCorrect(null);
    setAttempts(0);
  };

  const checkAnswer = () => {
    const currentOrder = items.map((item) => item.originalIndex);
    const isMatch = JSON.stringify(currentOrder) === JSON.stringify(currentChallenge.correctOrder);
    
    setIsCorrect(isMatch);
    setAttempts((prev) => prev + 1);

    if (isMatch) {
      playSound("success");
      const points = Math.max(20 - attempts * 5, 5);
      setScore((prev) => prev + points);
      addXp(points);
    } else {
      playSound("error");
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameComplete(false);
    shuffleItems();
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
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">
          Puzzle Master!
        </h2>
        <p className="text-xl text-muted-foreground mb-2">
          Final Score: <span className="text-primary font-bold">{score}</span>
        </p>
        <p className="text-muted-foreground mb-6">
          You solved all {challenges.length} puzzles!
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
            <span className="text-muted-foreground">Puzzle:</span>{" "}
            <span className="font-bold text-primary">
              {currentIndex + 1}/{challenges.length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Score:</span>{" "}
            <span className="font-bold text-success">{score}</span>
          </div>
        </div>
        <Progress value={progress} className="w-32 h-2" />
      </div>

      {/* Challenge Card */}
      <Card variant="glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">
              {gameMode === "kid" ? "🧩 " : ""}
              {currentChallenge.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={shuffleItems}
              disabled={isCorrect === true}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentChallenge.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Draggable Code Lines */}
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="space-y-2"
          >
            {items.map((item, index) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className={`flex items-center gap-3 p-3 rounded-lg font-mono text-sm cursor-grab active:cursor-grabbing transition-colors ${
                  isCorrect === null
                    ? "bg-muted hover:bg-muted/80 border border-border"
                    : isCorrect
                    ? "bg-success/10 border border-success/30"
                    : "bg-muted border border-border"
                }`}
                whileDrag={{ scale: 1.02, boxShadow: "0 0 20px hsla(187, 92%, 50%, 0.3)" }}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <code className="flex-1 text-foreground">{item.text}</code>
              </Reorder.Item>
            ))}
          </Reorder.Group>

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
                      {isCorrect ? "Perfect order! 🎉" : "Not quite right, try again!"}
                    </p>
                    {isCorrect && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {currentChallenge.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isCorrect === true ? (
              <Button variant="success" onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? "Next Puzzle →" : "Finish! 🎉"}
              </Button>
            ) : (
              <Button variant="hero" onClick={checkAnswer}>
                Check Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
