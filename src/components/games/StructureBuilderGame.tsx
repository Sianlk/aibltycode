import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { useProgress } from "@/hooks/useProgress";
import { CheckCircle, XCircle, RotateCcw, GripVertical, Zap, BookOpen } from "lucide-react";

// Code structure templates with common abbreviations
const structurePatterns = {
  variable: {
    abbr: "T n = v;",
    meaning: "Type name = value;",
    example: 'String s = "Hello";',
    tip: "📥 T-n-v: Type, name, value - like filling a labeled box!",
  },
  ifStatement: {
    abbr: "if(C) { A } else { B }",
    meaning: "if(Condition) { Action } else { Backup }",
    example: 'if(x > 0) { print("Positive"); } else { print("Not positive"); }',
    tip: "🔀 i-C-e: if → Check → else → Alternative",
  },
  forLoop: {
    abbr: "for(I; C; U) { A }",
    meaning: "for(Init; Condition; Update) { Action }",
    example: 'for(int i=0; i<5; i++) { print(i); }',
    tip: "🔁 f-I-C-U: for → Init → Condition → Update (I-See-You!)",
  },
  whileLoop: {
    abbr: "while(C) { A; U; }",
    meaning: "while(Condition) { Action; Update; }",
    example: 'while(x < 10) { print(x); x++; }',
    tip: "♾️ w-C-A-U: while → Condition → Action → Update (don't forget Update!)",
  },
  method: {
    abbr: "M R n(P) { B; return r; }",
    meaning: "Modifier ReturnType name(Params) { Body; return result; }",
    example: "public int add(int a, int b) { return a + b; }",
    tip: "📦 M-R-n-P-B: Modifier, Return, name, Params, Body",
  },
  switchCase: {
    abbr: "switch(V) { case X: A; break; default: D; }",
    meaning: "switch(Value) { case Match: Action; break; default: Default; }",
    example: 'switch(day) { case 1: print("Mon"); break; default: print("Other"); }',
    tip: "🎛️ s-V-c-b-d: switch → Value → case → break → default",
  },
};

interface BuilderChallenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  pieces: { id: string; code: string; category: string }[];
  correctOrder: string[];
  pattern: keyof typeof structurePatterns;
  explanation: string;
}

const challenges: BuilderChallenge[] = [
  {
    id: "b1",
    title: "Build a Variable",
    description: "Arrange the pieces to create a String variable",
    goal: "Store the text 'Hello' in a variable called message",
    pieces: [
      { id: "1", code: '"Hello"', category: "value" },
      { id: "2", code: "String", category: "type" },
      { id: "3", code: "=", category: "operator" },
      { id: "4", code: ";", category: "end" },
      { id: "5", code: "message", category: "name" },
    ],
    correctOrder: ["2", "5", "3", "1", "4"],
    pattern: "variable",
    explanation: "Type first (String), then name (message), equals sign, value, semicolon. T-n-=v;",
  },
  {
    id: "b2",
    title: "Build an IF Statement",
    description: "Create an if statement to check if score is above 50",
    goal: "Print 'Pass' if score >= 50",
    pieces: [
      { id: "1", code: "if", category: "keyword" },
      { id: "2", code: "(score >= 50)", category: "condition" },
      { id: "3", code: "{", category: "open" },
      { id: "4", code: 'System.out.println("Pass");', category: "action" },
      { id: "5", code: "}", category: "close" },
    ],
    correctOrder: ["1", "2", "3", "4", "5"],
    pattern: "ifStatement",
    explanation: "IF → (Condition) → { Action }. The condition goes in parentheses!",
  },
  {
    id: "b3",
    title: "Build a FOR Loop",
    description: "Create a loop that counts from 0 to 4",
    goal: "Print numbers 0, 1, 2, 3, 4",
    pieces: [
      { id: "1", code: "for", category: "keyword" },
      { id: "2", code: "(int i = 0;", category: "init" },
      { id: "3", code: "i < 5;", category: "condition" },
      { id: "4", code: "i++)", category: "update" },
      { id: "5", code: "{ System.out.println(i); }", category: "body" },
    ],
    correctOrder: ["1", "2", "3", "4", "5"],
    pattern: "forLoop",
    explanation: "FOR → (Init; Condition; Update) → { Body }. Remember I-C-U order!",
  },
  {
    id: "b4",
    title: "Build a WHILE Loop",
    description: "Create a while loop that runs while count < 3",
    goal: "Print 'Hi' three times",
    pieces: [
      { id: "1", code: "while", category: "keyword" },
      { id: "2", code: "(count < 3)", category: "condition" },
      { id: "3", code: "{", category: "open" },
      { id: "4", code: 'System.out.println("Hi");', category: "action" },
      { id: "5", code: "count++;", category: "update" },
      { id: "6", code: "}", category: "close" },
    ],
    correctOrder: ["1", "2", "3", "4", "5", "6"],
    pattern: "whileLoop",
    explanation: "WHILE → (Condition) → { Action + Update }. Don't forget the update or it loops forever!",
  },
  {
    id: "b5",
    title: "Build a Method",
    description: "Create a method that adds two numbers",
    goal: "Method returns sum of a and b",
    pieces: [
      { id: "1", code: "public", category: "modifier" },
      { id: "2", code: "int", category: "return" },
      { id: "3", code: "add", category: "name" },
      { id: "4", code: "(int a, int b)", category: "params" },
      { id: "5", code: "{ return a + b; }", category: "body" },
    ],
    correctOrder: ["1", "2", "3", "4", "5"],
    pattern: "method",
    explanation: "Modifier → ReturnType → name → (Params) → { Body }. M-R-n-P-B!",
  },
  {
    id: "b6",
    title: "Build a SWITCH Statement",
    description: "Create a switch to handle day numbers",
    goal: "Print day names for 1, 2, or default 'Other'",
    pieces: [
      { id: "1", code: "switch (day) {", category: "header" },
      { id: "2", code: 'case 1: System.out.println("Monday");', category: "case1" },
      { id: "3", code: "break;", category: "break1" },
      { id: "4", code: 'case 2: System.out.println("Tuesday");', category: "case2" },
      { id: "5", code: "break;", category: "break2" },
      { id: "6", code: 'default: System.out.println("Other");', category: "default" },
      { id: "7", code: "}", category: "close" },
    ],
    correctOrder: ["1", "2", "3", "4", "5", "6", "7"],
    pattern: "switchCase",
    explanation: "SWITCH → cases with breaks → default → close. Each case needs a break!",
  },
];

const categoryColors: Record<string, string> = {
  keyword: "bg-primary/20 border-primary/40 text-primary",
  type: "bg-accent/20 border-accent/40 text-accent",
  name: "bg-secondary/20 border-secondary/40 text-secondary",
  value: "bg-success/20 border-success/40 text-success",
  operator: "bg-warning/20 border-warning/40 text-warning",
  condition: "bg-info/20 border-info/40 text-info",
  action: "bg-success/20 border-success/40 text-success",
  body: "bg-muted border-border text-foreground",
  end: "bg-muted-foreground/20 border-muted-foreground/40 text-muted-foreground",
  open: "bg-muted border-border text-foreground",
  close: "bg-muted border-border text-foreground",
  init: "bg-primary/20 border-primary/40 text-primary",
  update: "bg-warning/20 border-warning/40 text-warning",
  modifier: "bg-accent/20 border-accent/40 text-accent",
  return: "bg-info/20 border-info/40 text-info",
  params: "bg-secondary/20 border-secondary/40 text-secondary",
  header: "bg-primary/20 border-primary/40 text-primary",
  case1: "bg-success/20 border-success/40 text-success",
  case2: "bg-success/20 border-success/40 text-success",
  break1: "bg-warning/20 border-warning/40 text-warning",
  break2: "bg-warning/20 border-warning/40 text-warning",
  default: "bg-muted-foreground/20 border-muted-foreground/40 text-muted-foreground",
};

export default function StructureBuilderGame() {
  const { addXp, playSound } = useGame();
  const { saveGameScore } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<typeof challenges[0]["pieces"]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showPattern, setShowPattern] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentChallenge = challenges[currentIndex];
  const currentPattern = structurePatterns[currentChallenge.pattern];
  const progress = ((currentIndex + (isCorrect ? 1 : 0)) / challenges.length) * 100;

  // Initialize shuffled items
  useState(() => {
    shufflePieces();
  });

  function shufflePieces() {
    const shuffled = [...currentChallenge.pieces].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(0);
    setShowPattern(false);
  }

  // Reset when challenge changes
  useState(() => {
    if (currentIndex > 0) shufflePieces();
  });

  const checkAnswer = useCallback(() => {
    const currentOrder = items.map((item) => item.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(currentChallenge.correctOrder);
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts((prev) => prev + 1);

    if (correct) {
      playSound("success");
      const points = Math.max(20 - attempts * 3 - (showPattern ? 5 : 0), 5);
      setScore((prev) => prev + points);
      addXp(points);
    } else {
      playSound("error");
    }
  }, [items, currentChallenge, attempts, showPattern, playSound, addXp]);

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextChal = challenges[currentIndex + 1];
      const shuffled = [...nextChal.pieces].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setShowResult(false);
      setIsCorrect(false);
      setAttempts(0);
      setShowPattern(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
      saveGameScore({
        gameType: "structure-builder",
        score,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        accuracy: (score / (challenges.length * 20)) * 100,
      });
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    const shuffled = [...challenges[0].pieces].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setScore(0);
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(0);
    setShowPattern(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
        <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}>🏗️</motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">Structure Architect!</h2>
        <p className="text-xl text-muted-foreground mb-4">Final Score: <span className="text-primary font-bold">{score}</span></p>
        
        {/* Quick reference */}
        <div className="bg-card rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Quick Reference:
          </h3>
          <div className="space-y-2 text-xs font-mono">
            {Object.entries(structurePatterns).slice(0, 4).map(([key, val]) => (
              <div key={key} className="p-2 bg-muted rounded">
                <span className="text-primary">{val.abbr}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button variant="default" size="lg" onClick={resetGame}>
          <RotateCcw className="w-5 h-5 mr-2" />Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-sm"><span className="text-muted-foreground">Build:</span> <span className="font-bold text-primary">{currentIndex + 1}/{challenges.length}</span></div>
          <div className="text-sm"><span className="text-muted-foreground">Score:</span> <span className="font-bold text-success">{score}</span></div>
        </div>
        <Progress value={progress} className="w-32 h-2" />
      </div>

      {/* Pattern Helper */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPattern(!showPattern)}
          className="text-xs"
        >
          <Zap className="w-3 h-3 mr-1" />
          {showPattern ? "Hide" : "Show"} Pattern
        </Button>
        {attempts > 1 && !isCorrect && (
          <span className="text-xs text-warning">Hint: Check the pattern!</span>
        )}
      </div>

      <AnimatePresence>
        {showPattern && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/10 rounded-xl p-4 border border-primary/30"
          >
            <p className="font-mono text-sm text-primary mb-1">{currentPattern.abbr}</p>
            <p className="text-xs text-muted-foreground">{currentPattern.meaning}</p>
            <p className="text-xs text-muted-foreground mt-2 italic">💡 {currentPattern.tip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            🏗️ {currentChallenge.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm">{currentChallenge.description}</p>
          <p className="text-xs text-primary mt-1">🎯 Goal: {currentChallenge.goal}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Draggable Code Pieces */}
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
                className={`flex items-center gap-3 p-3 rounded-lg font-mono text-sm cursor-grab active:cursor-grabbing transition-all border-2 ${
                  categoryColors[item.category] || "bg-muted border-border text-foreground"
                }`}
                whileDrag={{ scale: 1.02, boxShadow: "0 0 20px hsla(var(--primary) / 0.3)" }}
              >
                <GripVertical className="w-4 h-4 opacity-50 flex-shrink-0" />
                <span className="w-5 h-5 rounded-full bg-background/50 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <code className="flex-1">{item.code}</code>
                <span className="text-[10px] uppercase opacity-50">{item.category}</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`p-4 rounded-lg ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? <CheckCircle className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />}
                  <div>
                    <p className={`font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                      {isCorrect ? "Perfect Build! 🎉" : "Not quite right, rearrange and try again!"}
                    </p>
                    {isCorrect && (
                      <p className="text-sm text-muted-foreground mt-1">{currentChallenge.explanation}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            {isCorrect ? (
              <Button onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? "Next Build →" : "Finish! 🎉"}
              </Button>
            ) : (
              <Button onClick={checkAnswer}>Check Build</Button>
            )}
            {!isCorrect && (
              <Button variant="ghost" onClick={shufflePieces}>Shuffle</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
