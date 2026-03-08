import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { useProgress } from "@/hooks/useProgress";
import { CheckCircle, XCircle, RotateCcw, Lightbulb, Eye, Brain } from "lucide-react";

// Visual mnemonics for code structures
const mnemonics = {
  ifElse: { symbol: "🔀", mnemonic: "IF = 'Is it true? Fork the path!'", color: "hsl(var(--primary))" },
  forLoop: { symbol: "🔁", mnemonic: "FOR = 'Fixed Ordered Repetition'", color: "hsl(var(--accent))" },
  whileLoop: { symbol: "♾️", mnemonic: "WHILE = 'Wait Here, I'll Loop Eventually'", color: "hsl(var(--secondary))" },
  switchCase: { symbol: "🎛️", mnemonic: "SWITCH = 'Select What I'll Take, Check Handle'", color: "hsl(var(--warning))" },
  method: { symbol: "📦", mnemonic: "METHOD = 'My Easy Tool, Helps Out Daily'", color: "hsl(var(--success))" },
  variable: { symbol: "📥", mnemonic: "VAR = 'Value And Remember'", color: "hsl(var(--info))" },
  tryCatch: { symbol: "🛡️", mnemonic: "TRY = 'Test Risky code, You catch errors!'", color: "hsl(var(--destructive))" },
  array: { symbol: "📊", mnemonic: "ARRAY = 'A Row of Related items, Accessed by index, Yields fast lookup'", color: "hsl(var(--primary))" },
};

// Pattern structure templates with visual guides
const structures = {
  ifElse: {
    pattern: ["if (condition) {", "    // do this", "} else {", "    // do that", "}"],
    visual: "🔍 Check → ✅ Yes path → ❌ No path",
    memory: "i-C-e = if(Condition) { } else { }",
  },
  forLoop: {
    pattern: ["for (int i = 0; i < n; i++) {", "    // repeat n times", "}"],
    visual: "📍 Start → 🔄 Repeat → 🏁 Stop",
    memory: "f-I-C-U = for(Init; Condition; Update)",
  },
  whileLoop: {
    pattern: ["while (condition) {", "    // keep going", "}"],
    visual: "❓ Still true? → 🔄 Yes, continue → 🛑 No, stop",
    memory: "w-C = while(Condition) { }",
  },
  switchCase: {
    pattern: ["switch (value) {", "    case 1:", "        // action", "        break;", "    default:", "        // fallback", "}"],
    visual: "🎯 Match value → 📋 Pick case → 🚪 Break out",
    memory: "s-V-c-B-d = switch(Value) case: break; default:",
  },
  method: {
    pattern: ["public returnType name(params) {", "    // logic", "    return result;", "}"],
    visual: "📥 Input → ⚙️ Process → 📤 Output",
    memory: "R-N-P = ReturnType Name(Params)",
  },
  variable: {
    pattern: ["type name = value;"],
    visual: "📦 Box labeled 'name' containing 'value'",
    memory: "T-N-V = Type Name = Value;",
  },
  tryCatch: {
    pattern: ["try {", "    // risky code", "} catch (Exception e) {", "    // handle error", "}"],
    visual: "🧪 Try → 💥 If error → 🛡️ Catch it",
    memory: "t-R-c-E = try { Risky } catch(Error) { }",
  },
  array: {
    pattern: ["type[] name = new type[size];", "name[0] = value;"],
    visual: "📦📦📦 Boxes numbered 0, 1, 2...",
    memory: "T-N-S = Type[] Name = new Type[Size]",
  },
};

interface PatternChallenge {
  id: string;
  type: "identify" | "complete" | "order" | "debug";
  title: string;
  description: string;
  code: string[];
  options?: string[];
  correctAnswer: string | number | number[];
  mnemonic: keyof typeof mnemonics;
  explanation: string;
  tip: string;
}

const challenges: PatternChallenge[] = [
  // IF-ELSE pattern challenges
  {
    id: "if1",
    type: "identify",
    title: "Spot the Pattern",
    description: "What control structure is this?",
    code: ["if (age >= 18) {", '    System.out.println("Adult");', "} else {", '    System.out.println("Minor");', "}"],
    options: ["if-else", "for loop", "while loop", "switch"],
    correctAnswer: "if-else",
    mnemonic: "ifElse",
    explanation: "IF-ELSE is a fork in the road! 🔀 If condition is true, go left. Otherwise, go right.",
    tip: "Look for 'if' and 'else' keywords - they always go together like peanut butter and jelly!",
  },
  {
    id: "if2",
    type: "complete",
    title: "Fill the Gap",
    description: "Complete this if-else statement:",
    code: ["_____ (score >= 50) {", '    System.out.println("Pass!");', "} _____ {", '    System.out.println("Try again");', "}"],
    options: ["if / else", "for / while", "switch / case", "do / while"],
    correctAnswer: "if / else",
    mnemonic: "ifElse",
    explanation: "IF checks a condition, ELSE handles the alternative. Simple as yes or no!",
    tip: "🧠 Memory trick: 'IF this, do that, ELSE do other'",
  },
  {
    id: "if3",
    type: "debug",
    title: "Fix the Bug 🐛",
    description: "Which line has the error?",
    code: ["if score > 100 {", '    System.out.println("High score!");', "} else {", '    System.out.println("Keep trying");', "}"],
    options: ["Line 1 - missing parentheses", "Line 2 - wrong method", "Line 3 - wrong keyword", "No error"],
    correctAnswer: "Line 1 - missing parentheses",
    mnemonic: "ifElse",
    explanation: "IF statements ALWAYS need parentheses around the condition: if (condition)",
    tip: "👀 IF = if(Condition) - the () are like safety rails, don't forget them!",
  },
  // FOR LOOP challenges
  {
    id: "for1",
    type: "identify",
    title: "Name This Loop",
    description: "What type of loop counts from 0 to 4?",
    code: ["for (int i = 0; i < 5; i++) {", '    System.out.println("Count: " + i);', "}"],
    options: ["for loop", "while loop", "do-while loop", "infinite loop"],
    correctAnswer: "for loop",
    mnemonic: "forLoop",
    explanation: "FOR loops have 3 parts: Start (int i=0), Stop condition (i<5), Step (i++)",
    tip: "🔁 FOR = 'Fixed Ordered Repetition' - you know exactly how many times!",
  },
  {
    id: "for2",
    type: "complete",
    title: "Complete the Loop",
    description: "Fill in to loop 10 times:",
    code: ["for (int i = 0; _____ ; i++) {", "    // runs 10 times", "}"],
    options: ["i < 10", "i <= 10", "i > 10", "i == 10"],
    correctAnswer: "i < 10",
    mnemonic: "forLoop",
    explanation: "i < 10 means: 0,1,2,3,4,5,6,7,8,9 = exactly 10 iterations!",
    tip: "💡 Count from 0, stop BEFORE 10 = i < 10 (not <=)",
  },
  {
    id: "for3",
    type: "order",
    title: "Order the Parts",
    description: "Put the FOR loop parts in correct order:",
    code: ["for ( ① ; ② ; ③ ) { }"],
    options: ["① Start, ② Condition, ③ Update", "① Condition, ② Start, ③ Update", "① Update, ② Condition, ③ Start"],
    correctAnswer: "① Start, ② Condition, ③ Update",
    mnemonic: "forLoop",
    explanation: "FOR = Start → Check → Do → Update → Check → Do → ... until false!",
    tip: "📝 Remember: 'I See You' = Init, Check, Update (i;c;u)",
  },
  // WHILE LOOP challenges
  {
    id: "while1",
    type: "identify",
    title: "Loop Detective",
    description: "What kind of loop is this?",
    code: ["int count = 0;", "while (count < 3) {", '    System.out.println("Hi!");', "    count++;", "}"],
    options: ["while loop", "for loop", "do-while loop", "switch statement"],
    correctAnswer: "while loop",
    mnemonic: "whileLoop",
    explanation: "WHILE keeps going AS LONG AS the condition is true. It's like asking 'Still going?' each time.",
    tip: "♾️ WHILE = 'Wait Here, I'll Loop Eventually' - keeps asking 'is it still true?'",
  },
  {
    id: "while2",
    type: "debug",
    title: "Infinite Loop Alert! 🚨",
    description: "This loop runs forever. What's missing?",
    code: ["int x = 0;", "while (x < 5) {", "    System.out.println(x);", "    // missing something!", "}"],
    options: ["x++ to increase x", "break statement", "return statement", "Nothing missing"],
    correctAnswer: "x++ to increase x",
    mnemonic: "whileLoop",
    explanation: "Without x++, x stays 0 forever! The condition (x < 5) is always true = infinite loop!",
    tip: "⚠️ WHILE loops need a way to eventually become FALSE, or they run forever!",
  },
  // SWITCH CASE challenges
  {
    id: "switch1",
    type: "identify",
    title: "Control Structure ID",
    description: "What structure handles multiple specific values?",
    code: ["switch (day) {", '    case 1: System.out.println("Monday"); break;', '    case 2: System.out.println("Tuesday"); break;', '    default: System.out.println("Other day");', "}"],
    options: ["switch statement", "if-else chain", "for loop", "while loop"],
    correctAnswer: "switch statement",
    mnemonic: "switchCase",
    explanation: "SWITCH is like a menu! Each 'case' is an option. 'break' exits after a match.",
    tip: "🎛️ SWITCH = multiple choices, like a TV remote selecting channels!",
  },
  {
    id: "switch2",
    type: "complete",
    title: "Don't Forget the Exit!",
    description: "What keyword prevents 'fall-through' to the next case?",
    code: ["switch (grade) {", '    case "A": System.out.println("Excellent!");', "    _____ ;", '    case "B": System.out.println("Good!");', "}"],
    options: ["break", "continue", "return", "stop"],
    correctAnswer: "break",
    mnemonic: "switchCase",
    explanation: "BREAK exits the switch. Without it, code 'falls through' to the next case!",
    tip: "🚪 BREAK = 'I'm done, let me out!' - always use it unless you want fall-through!",
  },
  // COMBINED PATTERN challenges
  {
    id: "combo1",
    type: "identify",
    title: "Quick Fire! 🔥",
    description: "Match: 'I need to repeat something 5 times'",
    code: ["// Which structure?"],
    options: ["for loop", "if-else", "switch", "try-catch"],
    correctAnswer: "for loop",
    mnemonic: "forLoop",
    explanation: "When you know EXACTLY how many times = FOR loop. It's the counting expert!",
    tip: "🔢 Known count → FOR. Unknown count → WHILE.",
  },
  {
    id: "combo2",
    type: "identify",
    title: "Quick Fire! 🔥",
    description: "Match: 'Check if user is logged in, show different pages'",
    code: ["// Which structure?"],
    options: ["if-else", "for loop", "while loop", "switch"],
    correctAnswer: "if-else",
    mnemonic: "ifElse",
    explanation: "Two options (logged in or not) = IF-ELSE. It's the decision maker!",
    tip: "🔀 Yes or No questions → IF-ELSE",
  },
  {
    id: "combo3",
    type: "identify",
    title: "Quick Fire! 🔥",
    description: "Match: 'Handle different menu options (1-5)'",
    code: ["// Which structure?"],
    options: ["switch", "if-else", "for loop", "while loop"],
    correctAnswer: "switch",
    mnemonic: "switchCase",
    explanation: "Multiple specific options = SWITCH. It's the menu handler!",
    tip: "🎛️ Many specific values → SWITCH. Ranges → IF-ELSE",
  },
  // TRY-CATCH challenges
  {
    id: "try1",
    type: "identify",
    title: "Error Handler",
    description: "What structure safely handles potential errors?",
    code: ["try {", "    int x = 10 / 0;", "} catch (ArithmeticException e) {", '    System.out.println("Error!");', "}"],
    options: ["try-catch", "if-else", "switch", "for loop"],
    correctAnswer: "try-catch",
    mnemonic: "tryCatch",
    explanation: "TRY-CATCH wraps risky code and catches errors gracefully instead of crashing!",
    tip: "🛡️ TRY = 'Test Risky code, You catch errors!' — your safety net!",
  },
  {
    id: "try2",
    type: "complete",
    title: "Catch the Error!",
    description: "What goes in the catch block to get the error type?",
    code: ["try {", "    file.read();", "} catch (_____ e) {", '    System.out.println("File error");', "}"],
    options: ["IOException", "int", "String", "void"],
    correctAnswer: "IOException",
    mnemonic: "tryCatch",
    explanation: "Catch blocks need the exception TYPE to know what kind of error to handle.",
    tip: "🎯 Match the exception type: IOException for files, NumberFormatException for parsing!",
  },
  // ARRAY challenges
  {
    id: "arr1",
    type: "identify",
    title: "Data Structure ID",
    description: "What stores multiple values of the same type in numbered boxes?",
    code: ["int[] scores = {90, 85, 72, 95};", "System.out.println(scores[0]);"],
    options: ["Array", "Variable", "Method", "Loop"],
    correctAnswer: "Array",
    mnemonic: "array",
    explanation: "Arrays store multiple values in numbered slots (indexes). scores[0] = first element = 90.",
    tip: "📊 ARRAY = numbered boxes. Index starts at 0, not 1!",
  },
  {
    id: "arr2",
    type: "debug",
    title: "Index Error! 🐛",
    description: "This crashes — why?",
    code: ["String[] names = {\"A\", \"B\", \"C\"};", "System.out.println(names[3]);"],
    options: ["Line 2 - index 3 doesn't exist (max is 2)", "Line 1 - wrong syntax", "No error", "Line 2 - wrong method"],
    correctAnswer: "Line 2 - index 3 doesn't exist (max is 2)",
    mnemonic: "array",
    explanation: "Array of 3 items has indexes 0, 1, 2. Index 3 = ArrayIndexOutOfBoundsException!",
    tip: "⚠️ Max index = array.length - 1. Always check boundaries!",
  },
  // METHOD challenges
  {
    id: "method1",
    type: "identify",
    title: "Reusable Code Block",
    description: "What is this reusable block of code called?",
    code: ["public int add(int a, int b) {", "    return a + b;", "}"],
    options: ["Method", "Loop", "Array", "Variable"],
    correctAnswer: "Method",
    mnemonic: "method",
    explanation: "Methods are reusable code blocks. They take input (parameters) and can return output.",
    tip: "📦 METHOD = 'My Easy Tool, Helps Out Daily' — write once, use many times!",
  },
  {
    id: "method2",
    type: "complete",
    title: "Return Type",
    description: "This method returns a number. What's missing?",
    code: ["public _____ multiply(int a, int b) {", "    return a * b;", "}"],
    options: ["int", "void", "String", "boolean"],
    correctAnswer: "int",
    mnemonic: "method",
    explanation: "The return type must match what's being returned. a * b = integer, so return type = int.",
    tip: "🔄 Return type tells Java what kind of value comes back. void = nothing comes back!",
  },
  // COMBINED advanced
  {
    id: "combo4",
    type: "identify",
    title: "Quick Fire! 🔥",
    description: "Match: 'Reading from a file might fail'",
    code: ["// Which structure?"],
    options: ["try-catch", "for loop", "switch", "if-else"],
    correctAnswer: "try-catch",
    mnemonic: "tryCatch",
    explanation: "Risky operations (file, network, parsing) = TRY-CATCH. Handle failures gracefully!",
    tip: "🛡️ Risky code → try-catch. Decision → if-else. Repetition → loops.",
  },
  {
    id: "combo5",
    type: "identify",
    title: "Quick Fire! 🔥",
    description: "Match: 'Store 100 student names'",
    code: ["// Which structure?"],
    options: ["Array / ArrayList", "Single variable", "Method", "Switch"],
    correctAnswer: "Array / ArrayList",
    mnemonic: "array",
    explanation: "Multiple items of the same type = Array or ArrayList. One variable can't hold 100 names!",
    tip: "📊 Many items → Array. One item → Variable. Reusable code → Method.",
  },
];

export default function PatternRecognitionGame() {
  const { gameMode, addXp, playSound } = useGame();
  const { saveGameScore } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex + (showResult && isCorrect ? 1 : 0)) / challenges.length) * 100;
  const currentMnemonic = mnemonics[currentChallenge.mnemonic];

  const checkAnswer = useCallback(() => {
    const correct = selectedAnswer === currentChallenge.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound("success");
      const points = showMnemonic ? 5 : 10 + streak * 2;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      addXp(points);
    } else {
      playSound("error");
      setStreak(0);
    }
  }, [selectedAnswer, currentChallenge, showMnemonic, streak, playSound, addXp]);

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowMnemonic(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
      saveGameScore({
        gameType: "pattern",
        score,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        accuracy: (score / (challenges.length * 10)) * 100,
      });
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowMnemonic(false);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
        <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}>🧠</motion.div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">Pattern Master!</h2>
        <p className="text-xl text-muted-foreground mb-2">Final Score: <span className="text-primary font-bold">{score}</span></p>
        <p className="text-muted-foreground mb-4">Streak bonus: {streak} 🔥</p>
        
        {/* Summary of learned patterns */}
        <div className="bg-card rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Patterns Mastered:
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(mnemonics).slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xl">{val.symbol}</span>
                <span className="text-muted-foreground">{val.mnemonic}</span>
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
      {/* Progress and Stats */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-sm"><span className="text-muted-foreground">Pattern:</span> <span className="font-bold text-primary">{currentIndex + 1}/{challenges.length}</span></div>
          <div className="text-sm"><span className="text-muted-foreground">Score:</span> <span className="font-bold text-success">{score}</span></div>
          {streak > 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm px-2 py-1 rounded-full bg-warning/20 text-warning">🔥 {streak} streak!</motion.div>
          )}
        </div>
        <Progress value={progress} className="w-32 h-2" />
      </div>

      {/* Visual Mnemonic Card */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50"
        style={{ borderColor: currentMnemonic.color }}
      >
        <span className="text-3xl">{currentMnemonic.symbol}</span>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Today's Pattern</p>
          <p className="font-mono text-sm text-foreground">{currentChallenge.mnemonic.toUpperCase()}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setShowMnemonic(!showMnemonic)}
        >
          <Eye className="w-4 h-4 mr-1" />
          {showMnemonic ? "Hide" : "Show"} Memory Trick
        </Button>
      </motion.div>

      <AnimatePresence>
        {showMnemonic && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 rounded-xl bg-primary/10 border border-primary/30"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">{currentMnemonic.mnemonic}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {structures[currentChallenge.mnemonic as keyof typeof structures]?.visual || currentChallenge.tip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {currentChallenge.type === "identify" && "🔍"}
              {currentChallenge.type === "complete" && "✏️"}
              {currentChallenge.type === "order" && "📋"}
              {currentChallenge.type === "debug" && "🐛"}
            </span>
            <CardTitle className="text-lg text-foreground">{currentChallenge.title}</CardTitle>
          </div>
          <p className="text-muted-foreground">{currentChallenge.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Display */}
          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {currentChallenge.code.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-muted-foreground w-6 select-none">{i + 1}</span>
                <pre className="text-foreground">{line}</pre>
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentChallenge.options?.map((option, i) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`p-3 rounded-lg text-left text-sm font-medium transition-all border-2 ${
                  selectedAnswer === option
                    ? showResult
                      ? isCorrect && option === currentChallenge.correctAnswer
                        ? "border-success bg-success/10 text-success"
                        : option === currentChallenge.correctAnswer
                        ? "border-success bg-success/10 text-success"
                        : selectedAnswer === option
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-muted text-muted-foreground"
                      : "border-primary bg-primary/10 text-primary"
                    : showResult && option === currentChallenge.correctAnswer
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-card hover:border-primary/50 text-foreground"
                }`}
              >
                <span className="mr-2 opacity-50">{["A", "B", "C", "D"][i]}</span>
                {option}
              </motion.button>
            ))}
          </div>

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
                      {isCorrect ? "Correct! 🎉" : "Not quite!"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{currentChallenge.explanation}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">💡 {currentChallenge.tip}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            {!showResult ? (
              <Button onClick={checkAnswer} disabled={!selectedAnswer}>Check Answer</Button>
            ) : (
              <Button onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? "Next Pattern →" : "Finish! 🎉"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
