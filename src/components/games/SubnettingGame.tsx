import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { 
  Network, CheckCircle, XCircle, Lightbulb, Zap, 
  Calculator, Binary, Globe, Server
} from "lucide-react";

interface SubnettingChallenge {
  id: number;
  type: "subnet-mask" | "network-address" | "hosts" | "cidr" | "binary";
  question: string;
  context?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: SubnettingChallenge[] = [
  // Binary Basics
  {
    id: 1,
    type: "binary",
    question: "What is 192 in binary?",
    options: ["11000000", "10110000", "11110000", "10100000"],
    correctAnswer: "11000000",
    hint: "192 = 128 + 64. What bits are set?",
    explanation: "192 = 128 + 64 = 2^7 + 2^6 = 11000000. The pattern: 128,64,32,16,8,4,2,1",
    difficulty: "easy"
  },
  {
    id: 2,
    type: "binary",
    question: "What decimal number is 11111111 in binary?",
    options: ["255", "256", "128", "254"],
    correctAnswer: "255",
    hint: "All 8 bits are 1. What's 128+64+32+16+8+4+2+1?",
    explanation: "11111111 = 255. This is the maximum value for one octet - important for subnet masks!",
    difficulty: "easy"
  },
  // Subnet Mask Basics
  {
    id: 3,
    type: "subnet-mask",
    question: "What is the default subnet mask for a Class C network (e.g., 192.168.1.0)?",
    options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
    correctAnswer: "255.255.255.0",
    hint: "Class C uses the first 3 octets for network",
    explanation: "Class C: 255.255.255.0 (/24). First 3 octets = network, last octet = hosts. 254 usable hosts!",
    difficulty: "easy"
  },
  {
    id: 4,
    type: "cidr",
    question: "What does /24 mean in CIDR notation (e.g., 192.168.1.0/24)?",
    options: ["24 network bits", "24 host bits", "24 subnets", "24 hosts"],
    correctAnswer: "24 network bits",
    hint: "The number after / tells you how many bits are for the network",
    explanation: "/24 means 24 bits for network portion. 32-24=8 bits for hosts = 2^8-2 = 254 usable hosts!",
    difficulty: "easy"
  },
  // Host Calculations
  {
    id: 5,
    type: "hosts",
    question: "How many usable host addresses in a /24 network?",
    options: ["254", "256", "255", "252"],
    correctAnswer: "254",
    hint: "Formula: 2^(host bits) - 2. Why -2?",
    explanation: "2^8 - 2 = 254. We subtract 2: one for network address (all 0s) and one for broadcast (all 1s)!",
    difficulty: "easy"
  },
  {
    id: 6,
    type: "hosts",
    question: "How many usable hosts in a /26 subnet?",
    options: ["62", "64", "30", "126"],
    correctAnswer: "62",
    hint: "/26 = 26 network bits, so 32-26 = 6 host bits",
    explanation: "6 host bits: 2^6 - 2 = 64 - 2 = 62 usable hosts. Network + broadcast always reserved!",
    difficulty: "medium"
  },
  // Network Address
  {
    id: 7,
    type: "network-address",
    question: "What is the network address for 192.168.5.130/24?",
    options: ["192.168.5.0", "192.168.5.128", "192.168.0.0", "192.168.5.255"],
    correctAnswer: "192.168.5.0",
    hint: "/24 means last octet is all hosts. Set host bits to 0 for network address.",
    explanation: "For /24, the last octet is hosts. Network address has all host bits = 0, so 192.168.5.0",
    difficulty: "medium"
  },
  {
    id: 8,
    type: "network-address",
    question: "What is the network address for 10.0.50.200/8?",
    options: ["10.0.0.0", "10.0.50.0", "10.0.50.200", "0.0.0.0"],
    correctAnswer: "10.0.0.0",
    hint: "/8 means only first octet is network",
    explanation: "Class A (/8): Only first octet is network. Everything else = hosts. Network = 10.0.0.0",
    difficulty: "medium"
  },
  // CIDR Conversions
  {
    id: 9,
    type: "cidr",
    question: "What subnet mask equals /27?",
    options: ["255.255.255.224", "255.255.255.192", "255.255.255.128", "255.255.255.240"],
    correctAnswer: "255.255.255.224",
    hint: "/27 = 27 ones. Last octet has 3 ones: 128+64+32 = ?",
    explanation: "27 network bits = 24 + 3 extra. Last octet: 11100000 = 128+64+32 = 224!",
    difficulty: "medium"
  },
  {
    id: 10,
    type: "cidr",
    question: "Convert 255.255.255.128 to CIDR notation",
    options: ["/25", "/26", "/24", "/27"],
    correctAnswer: "/25",
    hint: "Count the 1s. 128 = 10000000 (one 1)",
    explanation: "255.255.255 = 24 ones. 128 = 10000000 = 1 more one. Total: 24 + 1 = /25",
    difficulty: "medium"
  },
  // Advanced - Subnetting
  {
    id: 11,
    type: "network-address",
    question: "What is the network address for 172.16.45.33/28?",
    options: ["172.16.45.32", "172.16.45.0", "172.16.45.16", "172.16.45.48"],
    correctAnswer: "172.16.45.32",
    hint: "/28 gives 16 addresses per subnet. 33 is in which block of 16?",
    explanation: "/28 = subnets of 16 (256/16). Blocks: 0,16,32,48. 33 falls in the 32-47 range. Network = .32",
    difficulty: "hard"
  },
  {
    id: 12,
    type: "hosts",
    question: "A company needs 50 hosts per subnet. What's the minimum CIDR prefix?",
    options: ["/26", "/25", "/27", "/24"],
    correctAnswer: "/26",
    hint: "Need at least 50 hosts. What's the smallest power of 2 >= 52?",
    explanation: "/27=30 hosts (too small), /26=62 hosts (✓). Always account for network + broadcast (+2)!",
    difficulty: "hard"
  },
];

const SubnettingGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const shuffledOptions = useMemo(() => {
    return shuffleArray(challenge.options);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === challenge.correctAnswer) {
      playSound("success");
      const points = (showHint ? 15 : 25) * (streak + 1);
      setScore(s => s + points);
      setStreak(s => s + 1);
      addXp(10);
    } else {
      playSound("error");
      setStreak(0);
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
  };

  const difficultyColors = {
    easy: "bg-success/20 text-success border-success/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    hard: "bg-destructive/20 text-destructive border-destructive/30"
  };

  const typeIcons = {
    "subnet-mask": <Globe className="w-4 h-4" />,
    "network-address": <Server className="w-4 h-4" />,
    "hosts": <Network className="w-4 h-4" />,
    "cidr": <Binary className="w-4 h-4" />,
    "binary": <Calculator className="w-4 h-4" />
  };

  if (gameComplete) {
    const accuracy = Math.round((score / (challenges.length * 25 * 3)) * 100);
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🌐</div>
        <h2 className="text-3xl font-bold mb-4">Subnetting Expert!</h2>
        <p className="text-xl text-muted-foreground mb-2">Score: {score} points</p>
        
        <div className="bg-primary/10 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="font-bold text-primary mb-3">Key Formulas:</h4>
          <div className="text-left space-y-2 text-sm">
            <div className="bg-muted/50 rounded p-2">
              <strong>Usable Hosts:</strong> 2^(32 - CIDR) - 2
            </div>
            <div className="bg-muted/50 rounded p-2">
              <strong>Subnets:</strong> 2^(borrowed bits)
            </div>
            <div className="bg-muted/50 rounded p-2">
              <strong>Block Size:</strong> 256 - last subnet mask octet
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{challenges.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{streak}</p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <Button size="lg" onClick={resetGame} className="gap-2">
          <Network className="w-5 h-5" />
          Practice Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {currentIndex + 1}/{challenges.length}
          </Badge>
          <Badge className={difficultyColors[challenge.difficulty]}>
            {challenge.difficulty}
          </Badge>
          <Badge variant="outline" className="gap-1">
            {typeIcons[challenge.type]}
            {challenge.type.replace("-", " ")}
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
            <Network className="w-5 h-5 text-primary" />
            IP Subnetting Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground font-medium">{challenge.question}</p>
            {challenge.context && (
              <p className="text-sm text-muted-foreground mt-2">{challenge.context}</p>
            )}
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

          <div className="grid gap-3">
            {shuffledOptions.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === challenge.correctAnswer;

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 text-left font-mono transition-all ${
                    showResult
                      ? isCorrectOption
                        ? "bg-success/20 border-success"
                        : isSelected
                        ? "bg-destructive/20 border-destructive"
                        : "bg-muted/50 border-muted"
                      : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

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
                <p className="font-bold mb-2">
                  {isCorrect ? "🎯 Correct!" : "❌ Not quite!"}
                </p>
                <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {showResult && (
            <Button onClick={nextChallenge} className="w-full">
              {currentIndex < challenges.length - 1 ? "Next Challenge" : "See Results"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubnettingGame;
