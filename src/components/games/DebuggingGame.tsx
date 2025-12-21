import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { Bug, Check, X, Lightbulb, ArrowRight, RotateCcw, Zap } from "lucide-react";

interface BugChallenge {
  id: string;
  title: string;
  buggyCode: string;
  fixedCode: string;
  bugLine: number;
  explanation: string;
  hint: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const challenges: BugChallenge[] = [
  // Loop Bugs
  {
    id: "infinite-loop",
    title: "Infinite Loop",
    buggyCode: `for (int i = 0; i < 10; i--) {
  System.out.println(i);
}`,
    fixedCode: `for (int i = 0; i < 10; i++) {
  System.out.println(i);
}`,
    bugLine: 1,
    explanation: "i-- decrements instead of increments, so i will never reach 10. Use i++ to increment.",
    hint: "Check the update part of the for loop - which direction is i going?",
    category: "loops",
    difficulty: "easy"
  },
  {
    id: "off-by-one",
    title: "Off-by-One Error",
    buggyCode: `String[] names = {"A", "B", "C"};
for (int i = 0; i <= names.length; i++) {
  System.out.println(names[i]);
}`,
    fixedCode: `String[] names = {"A", "B", "C"};
for (int i = 0; i < names.length; i++) {
  System.out.println(names[i]);
}`,
    bugLine: 2,
    explanation: "Using <= with array.length causes ArrayIndexOutOfBoundsException. Arrays are 0-indexed, so use < not <=.",
    hint: "If array has 3 items, valid indexes are 0, 1, 2. What's names.length?",
    category: "loops",
    difficulty: "easy"
  },
  {
    id: "while-never-ends",
    title: "While Never Terminates",
    buggyCode: `int count = 0;
while (count < 5) {
  System.out.println(count);
}`,
    fixedCode: `int count = 0;
while (count < 5) {
  System.out.println(count);
  count++;
}`,
    bugLine: 3,
    explanation: "Missing count++ inside the loop means count stays 0 forever. Always update loop variables!",
    hint: "What changes count? Will it ever reach 5?",
    category: "loops",
    difficulty: "easy"
  },

  // Conditional Bugs
  {
    id: "assignment-vs-equals",
    title: "Assignment vs Comparison",
    buggyCode: `int x = 5;
if (x = 10) {
  System.out.println("Ten!");
}`,
    fixedCode: `int x = 5;
if (x == 10) {
  System.out.println("Ten!");
}`,
    bugLine: 2,
    explanation: "Single = is assignment, == is comparison. 'x = 10' assigns 10 to x, doesn't compare.",
    hint: "= assigns a value, == checks if equal",
    category: "conditionals",
    difficulty: "easy"
  },
  {
    id: "missing-break",
    title: "Missing Break Statement",
    buggyCode: `switch (day) {
  case "MON":
    System.out.println("Monday");
  case "TUE":
    System.out.println("Tuesday");
    break;
}`,
    fixedCode: `switch (day) {
  case "MON":
    System.out.println("Monday");
    break;
  case "TUE":
    System.out.println("Tuesday");
    break;
}`,
    bugLine: 3,
    explanation: "Without break, code 'falls through' to next case. Monday would print both 'Monday' AND 'Tuesday'!",
    hint: "What stops execution in a switch case?",
    category: "conditionals",
    difficulty: "medium"
  },
  {
    id: "string-equals",
    title: "String Comparison Error",
    buggyCode: `String name = "Alice";
if (name == "Alice") {
  System.out.println("Found!");
}`,
    fixedCode: `String name = "Alice";
if (name.equals("Alice")) {
  System.out.println("Found!");
}`,
    bugLine: 2,
    explanation: "== compares object references, not content. Use .equals() to compare String values.",
    hint: "How do you properly compare String contents in Java?",
    category: "conditionals",
    difficulty: "medium"
  },

  // Method Bugs
  {
    id: "missing-return",
    title: "Missing Return Statement",
    buggyCode: `public int add(int a, int b) {
  int sum = a + b;
}`,
    fixedCode: `public int add(int a, int b) {
  int sum = a + b;
  return sum;
}`,
    bugLine: 2,
    explanation: "Method declares 'int' return type but never returns anything. Add 'return sum;' at the end.",
    hint: "What should a method with 'int' return type give back?",
    category: "methods",
    difficulty: "easy"
  },
  {
    id: "static-non-static",
    title: "Static Context Error",
    buggyCode: `public class App {
  int value = 10;
  public static void main(String[] args) {
    System.out.println(value);
  }
}`,
    fixedCode: `public class App {
  static int value = 10;
  public static void main(String[] args) {
    System.out.println(value);
  }
}`,
    bugLine: 2,
    explanation: "Static methods can't access non-static variables directly. Make 'value' static or create an instance.",
    hint: "Static belongs to class, non-static belongs to objects",
    category: "methods",
    difficulty: "medium"
  },

  // OOP Bugs
  {
    id: "null-pointer",
    title: "Null Pointer Exception",
    buggyCode: `String text = null;
int length = text.length();`,
    fixedCode: `String text = null;
if (text != null) {
  int length = text.length();
}`,
    bugLine: 2,
    explanation: "Calling methods on null throws NullPointerException. Always check for null first!",
    hint: "What happens when you call a method on 'nothing'?",
    category: "oop",
    difficulty: "easy"
  },
  {
    id: "constructor-void",
    title: "Constructor Error",
    buggyCode: `class Dog {
  String name;
  void Dog(String n) {
    name = n;
  }
}`,
    fixedCode: `class Dog {
  String name;
  Dog(String n) {
    name = n;
  }
}`,
    bugLine: 3,
    explanation: "Constructors don't have return types! 'void Dog' makes it a regular method, not a constructor.",
    hint: "What's different about constructor declarations?",
    category: "oop",
    difficulty: "medium"
  },
  {
    id: "super-call",
    title: "Missing Super Call",
    buggyCode: `class Animal {
  String name;
  Animal(String n) { name = n; }
}
class Dog extends Animal {
  Dog(String n) {
    System.out.println("Dog created");
  }
}`,
    fixedCode: `class Animal {
  String name;
  Animal(String n) { name = n; }
}
class Dog extends Animal {
  Dog(String n) {
    super(n);
    System.out.println("Dog created");
  }
}`,
    bugLine: 7,
    explanation: "When parent has a parameterized constructor, child must call super() first.",
    hint: "Parent needs parameters - who calls the parent constructor?",
    category: "oop",
    difficulty: "hard"
  },

  // Data Structure Bugs
  {
    id: "array-index",
    title: "Array Index Out of Bounds",
    buggyCode: `int[] nums = new int[3];
nums[3] = 10;`,
    fixedCode: `int[] nums = new int[3];
nums[2] = 10;`,
    bugLine: 2,
    explanation: "Array of size 3 has indexes 0, 1, 2. Index 3 is out of bounds!",
    hint: "Array indexes start at 0. What's the max index for size 3?",
    category: "data",
    difficulty: "easy"
  },
  {
    id: "concurrent-modification",
    title: "Concurrent Modification",
    buggyCode: `List<String> list = new ArrayList<>();
list.add("A"); list.add("B");
for (String s : list) {
  list.remove(s);
}`,
    fixedCode: `List<String> list = new ArrayList<>();
list.add("A"); list.add("B");
Iterator<String> it = list.iterator();
while (it.hasNext()) {
  it.next();
  it.remove();
}`,
    bugLine: 4,
    explanation: "Can't modify a list while iterating with for-each. Use Iterator.remove() instead.",
    hint: "Removing during for-each breaks the iteration",
    category: "data",
    difficulty: "hard"
  },
];

const difficultyColors = {
  easy: "bg-success/20 text-success border-success/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  hard: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function DebuggingGame() {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [guessedLine, setGuessedLine] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentChallenge = challenges[currentIndex];
  const codeLines = currentChallenge.buggyCode.split('\n');

  const handleLineClick = useCallback((lineNum: number) => {
    if (showFix) return;
    
    setGuessedLine(lineNum);
    
    if (lineNum === currentChallenge.bugLine) {
      playSound("success");
      setScore(s => s + (showHint ? 5 : 10));
      setShowFix(true);
      if (!completed.includes(currentChallenge.id)) {
        setCompleted([...completed, currentChallenge.id]);
      }
    } else {
      playSound("error");
    }
  }, [currentChallenge, showHint, showFix, completed, playSound]);

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHint(false);
      setShowFix(false);
      setGuessedLine(null);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setShowHint(false);
    setShowFix(false);
    setGuessedLine(null);
    setScore(0);
    setCompleted([]);
    setIsComplete(false);
    playSound("click");
  };

  if (isComplete) {
    const accuracy = Math.round((completed.length / challenges.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🐛</div>
        <h2 className="text-3xl font-black text-foreground mb-4">Debugging Complete!</h2>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="bg-success/10 border-success/30">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <Bug className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{completed.length}/{challenges.length}</p>
              <p className="text-sm text-muted-foreground">Bugs Found</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <p className="text-xl text-muted-foreground mb-2">Accuracy</p>
          <p className="text-5xl font-black text-primary">{accuracy}%</p>
        </div>

        <Button size="lg" onClick={resetGame} className="gap-2">
          <RotateCcw className="w-5 h-5" />
          Hunt More Bugs
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-destructive" />
            <span className="text-muted-foreground">Bug {currentIndex + 1}/{challenges.length}</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-5 h-5" />
            <span className="font-bold">{score} pts</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${difficultyColors[currentChallenge.difficulty]}`}>
          {currentChallenge.difficulty}
        </span>
      </div>

      <Progress value={((currentIndex + 1) / challenges.length) * 100} className="h-2 mb-6" />

      {/* Challenge Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Bug className="w-5 h-5 text-destructive" />
            {currentChallenge.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            Category: {currentChallenge.category}
          </p>
          <p className="text-muted-foreground mb-4">
            Click the line with the bug! 🔍
          </p>

          {/* Code Display */}
          <div className="bg-muted/30 rounded-lg overflow-hidden mb-4">
            {codeLines.map((line, index) => {
              const lineNum = index + 1;
              const isBugLine = lineNum === currentChallenge.bugLine;
              const isGuessed = lineNum === guessedLine;
              const isCorrect = showFix && isBugLine;
              const isWrong = isGuessed && !isBugLine;
              
              return (
                <motion.div
                  key={index}
                  onClick={() => handleLineClick(lineNum)}
                  className={`
                    flex items-stretch cursor-pointer transition-all
                    ${!showFix ? 'hover:bg-primary/10' : ''}
                    ${isCorrect ? 'bg-success/20' : ''}
                    ${isWrong ? 'bg-destructive/20' : ''}
                  `}
                  whileHover={!showFix ? { x: 4 } : {}}
                >
                  <div className={`
                    w-10 flex items-center justify-center text-xs font-mono border-r
                    ${isCorrect ? 'bg-success/30 text-success border-success/30' : 'bg-muted text-muted-foreground border-border'}
                    ${isWrong ? 'bg-destructive/30 text-destructive border-destructive/30' : ''}
                  `}>
                    {lineNum}
                  </div>
                  <pre className="flex-1 p-2 font-mono text-sm text-foreground overflow-x-auto">
                    {line || ' '}
                  </pre>
                  {isCorrect && (
                    <div className="flex items-center px-2">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                  )}
                  {isWrong && (
                    <div className="flex items-center px-2">
                      <X className="w-5 h-5 text-destructive" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Hint Button */}
          {!showFix && !showHint && (
            <Button variant="outline" onClick={() => setShowHint(true)} className="w-full gap-2">
              <Lightbulb className="w-4 h-4" />
              Show Hint (-5 pts)
            </Button>
          )}

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && !showFix && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-warning/10 border border-warning/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  <span className="font-bold text-warning">Hint</span>
                </div>
                <p className="text-foreground">{currentChallenge.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fix Explanation */}
          <AnimatePresence>
            {showFix && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                  <h4 className="font-bold text-success mb-2">✓ Bug Found!</h4>
                  <p className="text-foreground mb-4">{currentChallenge.explanation}</p>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-2">Fixed Code:</p>
                    <pre className="font-mono text-sm text-success whitespace-pre-wrap">
                      {currentChallenge.fixedCode}
                    </pre>
                  </div>
                </div>

                <Button onClick={nextChallenge} className="w-full gap-2" size="lg">
                  {currentIndex < challenges.length - 1 ? (
                    <>
                      Next Bug <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    "Complete!"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Tips */}
      <p className="text-center text-sm text-muted-foreground">
        💡 Look for common bugs: off-by-one, missing breaks, wrong operators!
      </p>
    </div>
  );
}