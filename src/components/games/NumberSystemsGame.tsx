import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useGame } from "@/contexts/GameContext";
import { 
  Calculator, CheckCircle, XCircle, Lightbulb, Zap,
  Binary, Hash, RotateCcw, ArrowRight
} from "lucide-react";

interface NumberChallenge {
  id: number;
  type: "binary-to-decimal" | "decimal-to-binary" | "hex-to-decimal" | "decimal-to-hex" | "binary-to-hex" | "twos-complement";
  question: string;
  correctAnswer: string;
  hint: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const challenges: NumberChallenge[] = [
  // Binary to Decimal (Easy)
  {
    id: 1,
    type: "binary-to-decimal",
    question: "Convert 1010 (binary) to decimal",
    correctAnswer: "10",
    hint: "Each position represents a power of 2: 8,4,2,1",
    explanation: "1010 = 1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10. Remember: 8,4,2,1 pattern!",
    difficulty: "easy"
  },
  {
    id: 2,
    type: "binary-to-decimal",
    question: "Convert 1111 (binary) to decimal",
    correctAnswer: "15",
    hint: "All bits are 1, add all powers of 2",
    explanation: "1111 = 8+4+2+1 = 15. Maximum 4-bit value! (2^4 - 1 = 15)",
    difficulty: "easy"
  },
  {
    id: 3,
    type: "binary-to-decimal",
    question: "Convert 10000000 (binary) to decimal",
    correctAnswer: "128",
    hint: "Only the leftmost bit is 1. What power of 2 is that?",
    explanation: "10000000 = 2^7 = 128. The highest bit in a byte!",
    difficulty: "easy"
  },
  // Decimal to Binary (Easy-Medium)
  {
    id: 4,
    type: "decimal-to-binary",
    question: "Convert 7 (decimal) to binary",
    correctAnswer: "111",
    hint: "7 = 4 + 2 + 1. Which bits are set?",
    explanation: "7 = 4+2+1 = 111 in binary. One less than 8 (1000)!",
    difficulty: "easy"
  },
  {
    id: 5,
    type: "decimal-to-binary",
    question: "Convert 25 (decimal) to binary",
    correctAnswer: "11001",
    hint: "25 = 16 + 8 + 1. Divide by 2 repeatedly.",
    explanation: "25 = 16+8+1 = 11001. Method: 25÷2=12r1, 12÷2=6r0, 6÷2=3r0, 3÷2=1r1, 1÷2=0r1 → read backwards!",
    difficulty: "medium"
  },
  {
    id: 6,
    type: "decimal-to-binary",
    question: "Convert 255 (decimal) to binary",
    correctAnswer: "11111111",
    hint: "This is the maximum value for one byte",
    explanation: "255 = 2^8 - 1 = 11111111. Eight 1s! Maximum unsigned byte value.",
    difficulty: "medium"
  },
  // Hexadecimal (Medium)
  {
    id: 7,
    type: "hex-to-decimal",
    question: "Convert 1F (hexadecimal) to decimal",
    correctAnswer: "31",
    hint: "F = 15 in decimal. 1F = 1×16 + F×1",
    explanation: "1F = 1×16 + 15×1 = 16 + 15 = 31. Hex digits: 0-9, A=10, B=11, C=12, D=13, E=14, F=15",
    difficulty: "medium"
  },
  {
    id: 8,
    type: "hex-to-decimal",
    question: "Convert FF (hexadecimal) to decimal",
    correctAnswer: "255",
    hint: "FF is the maximum 2-digit hex number",
    explanation: "FF = 15×16 + 15×1 = 240 + 15 = 255. Maximum byte value in hex!",
    difficulty: "medium"
  },
  {
    id: 9,
    type: "decimal-to-hex",
    question: "Convert 200 (decimal) to hexadecimal",
    correctAnswer: "C8",
    hint: "200 ÷ 16 = 12 remainder 8. 12 in hex is...",
    explanation: "200 = 12×16 + 8 = C8. 12 in hex = C. So 200 = 0xC8",
    difficulty: "medium"
  },
  // Binary-Hex Conversion (Medium-Hard)
  {
    id: 10,
    type: "binary-to-hex",
    question: "Convert 11110000 (binary) to hexadecimal",
    correctAnswer: "F0",
    hint: "Split into groups of 4 bits: 1111 0000",
    explanation: "1111 = F (15), 0000 = 0. So 11110000 = F0. Each hex digit = 4 binary bits!",
    difficulty: "medium"
  },
  {
    id: 11,
    type: "binary-to-hex",
    question: "Convert 10101010 (binary) to hexadecimal",
    correctAnswer: "AA",
    hint: "Split: 1010 1010. What's 1010 in hex?",
    explanation: "1010 = 10 = A. Both groups are 1010, so 10101010 = AA",
    difficulty: "medium"
  },
  // Two's Complement (Hard)
  {
    id: 12,
    type: "twos-complement",
    question: "What is -5 in 8-bit two's complement?",
    correctAnswer: "11111011",
    hint: "Step 1: 5 = 00000101. Step 2: Invert bits. Step 3: Add 1",
    explanation: "5 = 00000101 → Invert: 11111010 → Add 1: 11111011 = -5. Two's complement: invert and add 1!",
    difficulty: "hard"
  },
  {
    id: 13,
    type: "twos-complement",
    question: "In 8-bit two's complement, what decimal does 10000000 represent?",
    correctAnswer: "-128",
    hint: "The leftmost bit is the sign bit. 10000000 is the most negative 8-bit number",
    explanation: "10000000 = -128. It's the minimum 8-bit signed value. Range: -128 to +127",
    difficulty: "hard"
  },
  // Advanced
  {
    id: 14,
    type: "hex-to-decimal",
    question: "Convert 0x100 (hexadecimal) to decimal",
    correctAnswer: "256",
    hint: "0x100 = 1×16² + 0×16¹ + 0×16⁰",
    explanation: "100 (hex) = 1×256 + 0×16 + 0×1 = 256. This is 2^8!",
    difficulty: "hard"
  },
  {
    id: 15,
    type: "decimal-to-binary",
    question: "What is 2^10 in binary?",
    correctAnswer: "10000000000",
    hint: "2^n in binary is 1 followed by n zeros",
    explanation: "2^10 = 1024 = 1 followed by 10 zeros: 10000000000. Pattern: 2^n has the 1 in position n!",
    difficulty: "hard"
  },
];

const NumberSystemsGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const isCorrect = userAnswer.toUpperCase().trim() === challenge?.correctAnswer.toUpperCase();
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim() || showResult) return;
    setShowResult(true);

    if (userAnswer.toUpperCase().trim() === challenge.correctAnswer.toUpperCase()) {
      playSound("success");
      const points = (showHint ? 15 : 25) * (streak + 1);
      setScore(s => s + points);
      setStreak(s => s + 1);
      addXp(10);
    } else {
      playSound("error");
      setStreak(0);
    }
  }, [userAnswer, challenge, showHint, streak, playSound, addXp, showResult]);

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setUserAnswer("");
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
  };

  const difficultyColors = {
    easy: "bg-success/20 text-success",
    medium: "bg-warning/20 text-warning",
    hard: "bg-destructive/20 text-destructive"
  };

  const typeLabels = {
    "binary-to-decimal": "Binary → Decimal",
    "decimal-to-binary": "Decimal → Binary",
    "hex-to-decimal": "Hex → Decimal",
    "decimal-to-hex": "Decimal → Hex",
    "binary-to-hex": "Binary → Hex",
    "twos-complement": "Two's Complement"
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🔢</div>
        <h2 className="text-3xl font-bold mb-4">Number Systems Master!</h2>
        <p className="text-xl text-muted-foreground mb-2">Score: {score} points</p>
        <p className="text-muted-foreground mb-6">Best Streak: {streak}x</p>

        <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="font-bold mb-4">Quick Reference:</h4>
          <div className="space-y-2 text-sm text-left">
            <div className="bg-muted/50 p-2 rounded">
              <strong>Binary Weights:</strong> 128, 64, 32, 16, 8, 4, 2, 1
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <strong>Hex Digits:</strong> 0-9, A=10, B=11, C=12, D=13, E=14, F=15
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <strong>Two's Complement:</strong> Invert bits, add 1
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <strong>1 Hex digit = 4 Binary bits</strong> (nibble)
            </div>
          </div>
        </div>

        <Button size="lg" onClick={resetGame} className="gap-2">
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {currentIndex + 1}/{challenges.length}
          </Badge>
          <Badge className={difficultyColors[challenge.difficulty]}>
            {challenge.difficulty}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Binary className="w-3 h-3" />
            {typeLabels[challenge.type]}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <Badge className="bg-warning/20 text-warning gap-1">
              <Zap className="w-3 h-3" />
              {streak}x
            </Badge>
          )}
          <Badge variant="secondary" className="text-lg px-4">
            {score} pts
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Number Systems Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground font-medium text-lg">{challenge.question}</p>
          </div>

          {/* Binary Reference Helper */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Binary Position Values (8-bit):</p>
            <div className="flex justify-between font-mono text-sm">
              {[128, 64, 32, 16, 8, 4, 2, 1].map((val, i) => (
                <div key={i} className="text-center">
                  <div className="text-primary font-bold">{val}</div>
                  <div className="text-xs text-muted-foreground">2^{7-i}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Answer:</label>
            <div className="flex gap-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="font-mono text-lg"
                disabled={showResult}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {!showResult && (
                <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
                  Check
                </Button>
              )}
            </div>
          </div>

          {!showHint && !showResult && (
            <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Need a hint? (-10 points)
            </Button>
          )}

          {showHint && !showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm"
            >
              💡 {challenge.hint}
            </motion.div>
          )}

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? "bg-success/10 border border-success/30"
                    : "bg-destructive/10 border border-destructive/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold mb-1">
                      {isCorrect ? "🎯 Correct!" : `Answer: ${challenge.correctAnswer}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showResult && (
            <Button onClick={nextChallenge} className="w-full gap-2">
              {currentIndex < challenges.length - 1 ? "Next Challenge" : "See Results"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberSystemsGame;
