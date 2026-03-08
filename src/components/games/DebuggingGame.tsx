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

// Mnemonic: B.U.G.S = Boundary errors, Uninitialized vars, Grammar mistakes, Scope issues

const challenges: BugChallenge[] = [
  // === LOOP BUGS ===
  { id: "infinite-loop", title: "Infinite Loop", buggyCode: `for (int i = 0; i < 10; i--) {\n  System.out.println(i);\n}`, fixedCode: `for (int i = 0; i < 10; i++) {\n  System.out.println(i);\n}`, bugLine: 1, explanation: "i-- decrements instead of increments, so i will never reach 10. Use i++ to increment.", hint: "Check the update part of the for loop - which direction is i going?", category: "loops", difficulty: "easy" },
  { id: "off-by-one", title: "Off-by-One Error", buggyCode: `String[] names = {"A", "B", "C"};\nfor (int i = 0; i <= names.length; i++) {\n  System.out.println(names[i]);\n}`, fixedCode: `String[] names = {"A", "B", "C"};\nfor (int i = 0; i < names.length; i++) {\n  System.out.println(names[i]);\n}`, bugLine: 2, explanation: "Using <= with array.length causes ArrayIndexOutOfBoundsException. Arrays are 0-indexed, so use < not <=.", hint: "If array has 3 items, valid indexes are 0, 1, 2. What's names.length?", category: "loops", difficulty: "easy" },
  { id: "while-never-ends", title: "While Never Terminates", buggyCode: `int count = 0;\nwhile (count < 5) {\n  System.out.println(count);\n}`, fixedCode: `int count = 0;\nwhile (count < 5) {\n  System.out.println(count);\n  count++;\n}`, bugLine: 3, explanation: "Missing count++ inside the loop means count stays 0 forever. Always update loop variables!", hint: "What changes count? Will it ever reach 5?", category: "loops", difficulty: "easy" },
  { id: "wrong-loop-var", title: "Wrong Loop Variable", buggyCode: `for (int i = 0; i < 5; i++) {\n  for (int j = 0; j < 3; i++) {\n    System.out.println(i + "," + j);\n  }\n}`, fixedCode: `for (int i = 0; i < 5; i++) {\n  for (int j = 0; j < 3; j++) {\n    System.out.println(i + "," + j);\n  }\n}`, bugLine: 2, explanation: "Inner loop increments i instead of j! j never changes, creating an infinite inner loop.", hint: "Which variable should the inner loop update?", category: "loops", difficulty: "medium" },

  // === CONDITIONAL BUGS ===
  { id: "assignment-vs-equals", title: "Assignment vs Comparison", buggyCode: `int x = 5;\nif (x = 10) {\n  System.out.println("Ten!");\n}`, fixedCode: `int x = 5;\nif (x == 10) {\n  System.out.println("Ten!");\n}`, bugLine: 2, explanation: "Single = is assignment, == is comparison. 'x = 10' assigns 10 to x, doesn't compare.", hint: "= assigns a value, == checks if equal", category: "conditionals", difficulty: "easy" },
  { id: "missing-break", title: "Missing Break Statement", buggyCode: `switch (day) {\n  case "MON":\n    System.out.println("Monday");\n  case "TUE":\n    System.out.println("Tuesday");\n    break;\n}`, fixedCode: `switch (day) {\n  case "MON":\n    System.out.println("Monday");\n    break;\n  case "TUE":\n    System.out.println("Tuesday");\n    break;\n}`, bugLine: 3, explanation: "Without break, code 'falls through' to next case. Monday would print both 'Monday' AND 'Tuesday'!", hint: "What stops execution in a switch case?", category: "conditionals", difficulty: "medium" },
  { id: "string-equals", title: "String Comparison Error", buggyCode: `String name = "Alice";\nif (name == "Alice") {\n  System.out.println("Found!");\n}`, fixedCode: `String name = "Alice";\nif (name.equals("Alice")) {\n  System.out.println("Found!");\n}`, bugLine: 2, explanation: "== compares object references, not content. Use .equals() to compare String values.", hint: "How do you properly compare String contents in Java?", category: "conditionals", difficulty: "medium" },
  { id: "logic-operator", title: "Wrong Logic Operator", buggyCode: `if (age > 18 & age < 65) {\n  System.out.println("Working age");\n}`, fixedCode: `if (age > 18 && age < 65) {\n  System.out.println("Working age");\n}`, bugLine: 1, explanation: "& is bitwise AND (evaluates both sides). && is logical AND (short-circuits). Use && for conditions!", hint: "Single & vs double && — which is for boolean logic?", category: "conditionals", difficulty: "medium" },

  // === METHOD BUGS ===
  { id: "missing-return", title: "Missing Return Statement", buggyCode: `public int add(int a, int b) {\n  int sum = a + b;\n}`, fixedCode: `public int add(int a, int b) {\n  int sum = a + b;\n  return sum;\n}`, bugLine: 2, explanation: "Method declares 'int' return type but never returns anything. Add 'return sum;' at the end.", hint: "What should a method with 'int' return type give back?", category: "methods", difficulty: "easy" },
  { id: "static-non-static", title: "Static Context Error", buggyCode: `public class App {\n  int value = 10;\n  public static void main(String[] args) {\n    System.out.println(value);\n  }\n}`, fixedCode: `public class App {\n  static int value = 10;\n  public static void main(String[] args) {\n    System.out.println(value);\n  }\n}`, bugLine: 2, explanation: "Static methods can't access non-static variables directly. Make 'value' static or create an instance.", hint: "Static belongs to class, non-static belongs to objects", category: "methods", difficulty: "medium" },
  { id: "void-return", title: "Returning from Void", buggyCode: `public void greet() {\n  return "Hello!";\n}`, fixedCode: `public String greet() {\n  return "Hello!";\n}`, bugLine: 1, explanation: "void methods can't return values. Change return type to String if you need to return text.", hint: "Can a void method return a value?", category: "methods", difficulty: "easy" },

  // === OOP BUGS ===
  { id: "null-pointer", title: "Null Pointer Exception", buggyCode: `String text = null;\nint length = text.length();`, fixedCode: `String text = null;\nif (text != null) {\n  int length = text.length();\n}`, bugLine: 2, explanation: "Calling methods on null throws NullPointerException. Always check for null first!", hint: "What happens when you call a method on 'nothing'?", category: "oop", difficulty: "easy" },
  { id: "constructor-void", title: "Constructor Error", buggyCode: `class Dog {\n  String name;\n  void Dog(String n) {\n    name = n;\n  }\n}`, fixedCode: `class Dog {\n  String name;\n  Dog(String n) {\n    name = n;\n  }\n}`, bugLine: 3, explanation: "Constructors don't have return types! 'void Dog' makes it a regular method, not a constructor.", hint: "What's different about constructor declarations?", category: "oop", difficulty: "medium" },
  { id: "super-call", title: "Missing Super Call", buggyCode: `class Animal {\n  String name;\n  Animal(String n) { name = n; }\n}\nclass Dog extends Animal {\n  Dog(String n) {\n    System.out.println("Dog created");\n  }\n}`, fixedCode: `class Animal {\n  String name;\n  Animal(String n) { name = n; }\n}\nclass Dog extends Animal {\n  Dog(String n) {\n    super(n);\n    System.out.println("Dog created");\n  }\n}`, bugLine: 7, explanation: "When parent has a parameterized constructor, child must call super() first.", hint: "Parent needs parameters - who calls the parent constructor?", category: "oop", difficulty: "hard" },
  { id: "private-access", title: "Private Access Error", buggyCode: `class Account {\n  private double balance = 100;\n}\nclass Main {\n  void test() {\n    Account a = new Account();\n    a.balance = 200;\n  }\n}`, fixedCode: `class Account {\n  private double balance = 100;\n  public void setBalance(double b) { balance = b; }\n}\nclass Main {\n  void test() {\n    Account a = new Account();\n    a.setBalance(200);\n  }\n}`, bugLine: 7, explanation: "Private fields can't be accessed outside the class. Use getters/setters for encapsulation!", hint: "What does 'private' mean for external access?", category: "oop", difficulty: "medium" },
  { id: "missing-override", title: "Override Without @Override", buggyCode: `class Animal {\n  public void speak() { }\n}\nclass Dog extends Animal {\n  public void speek() {\n    System.out.println("Woof!");\n  }\n}`, fixedCode: `class Animal {\n  public void speak() { }\n}\nclass Dog extends Animal {\n  @Override\n  public void speak() {\n    System.out.println("Woof!");\n  }\n}`, bugLine: 5, explanation: "Typo 'speek' creates a NEW method instead of overriding. @Override annotation catches this at compile time!", hint: "Is the method name spelled exactly like the parent's?", category: "oop", difficulty: "hard" },

  // === DATA STRUCTURE BUGS ===
  { id: "array-index", title: "Array Index Out of Bounds", buggyCode: `int[] nums = new int[3];\nnums[3] = 10;`, fixedCode: `int[] nums = new int[3];\nnums[2] = 10;`, bugLine: 2, explanation: "Array of size 3 has indexes 0, 1, 2. Index 3 is out of bounds!", hint: "Array indexes start at 0. What's the max index for size 3?", category: "data", difficulty: "easy" },
  { id: "concurrent-modification", title: "Concurrent Modification", buggyCode: `List<String> list = new ArrayList<>();\nlist.add("A"); list.add("B");\nfor (String s : list) {\n  list.remove(s);\n}`, fixedCode: `List<String> list = new ArrayList<>();\nlist.add("A"); list.add("B");\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n  it.next();\n  it.remove();\n}`, bugLine: 4, explanation: "Can't modify a list while iterating with for-each. Use Iterator.remove() instead.", hint: "Removing during for-each breaks the iteration", category: "data", difficulty: "hard" },

  // === EXCEPTION BUGS ===
  { id: "catch-order", title: "Wrong Catch Order", buggyCode: `try {\n  int x = 10 / 0;\n} catch (Exception e) {\n} catch (ArithmeticException e) {\n}`, fixedCode: `try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n} catch (Exception e) {\n}`, bugLine: 4, explanation: "Catch specific exceptions first! Exception catches everything, making ArithmeticException unreachable.", hint: "Put the most specific exception first", category: "exceptions", difficulty: "hard" },
  { id: "unhandled-checked", title: "Unhandled Checked Exception", buggyCode: `public void readFile() {\n  FileReader fr = new FileReader("data.txt");\n}`, fixedCode: `public void readFile() throws IOException {\n  FileReader fr = new FileReader("data.txt");\n}`, bugLine: 1, explanation: "FileReader throws a checked exception (IOException). Must either try-catch or declare 'throws IOException'.", hint: "Checked exceptions must be handled or declared", category: "exceptions", difficulty: "medium" },
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