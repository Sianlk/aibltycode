import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { Clock, Brain, Check, X, Repeat, Star, Zap } from "lucide-react";

interface Question {
  id: string;
  question: string;
  visual: React.ReactNode;
  answer: string;
  hint: string;
  difficulty: number;
  category: string;
  lastSeen?: number;
  interval: number;
  easeFactor: number;
}

const initialQuestions: Omit<Question, 'lastSeen' | 'interval' | 'easeFactor'>[] = [
  // Loops
  {
    id: "for-order",
    question: "What order for a FOR loop? (4 parts)",
    visual: (
      <div className="flex gap-2 justify-center flex-wrap">
        {["for", "(", "init", ";", "condition", ";", "update", ")"].map((p, i) => (
          <span key={i} className={`px-2 py-1 rounded ${p === ';' || p === '(' || p === ')' ? 'text-muted-foreground' : 'bg-primary/20 text-primary font-mono'}`}>{p}</span>
        ))}
      </div>
    ),
    answer: "F.I.C.U. → for(Initialize; Condition; Update)",
    hint: "Think: For I Can Understand",
    difficulty: 1,
    category: "loops"
  },
  {
    id: "while-vs-do",
    question: "WHILE checks _____, DO-WHILE checks _____",
    visual: (
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="font-mono text-sm">while(?) { }</div>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-mono text-sm">do { } while(?)</div>
        </div>
      </div>
    ),
    answer: "WHILE checks BEFORE, DO-WHILE checks AFTER (runs at least once!)",
    hint: "DO = Does first, then checks",
    difficulty: 2,
    category: "loops"
  },
  {
    id: "foreach-syntax",
    question: "Complete: for(Type item : _____)",
    visual: (
      <div className="font-mono bg-muted/50 p-4 rounded-lg text-center">
        for(<span className="text-accent">String</span> name : <span className="text-warning">?????</span>)
      </div>
    ),
    answer: "Collection/Array - the SOURCE to iterate over",
    hint: "For Each item of Type in ___",
    difficulty: 1,
    category: "loops"
  },

  // Conditionals
  {
    id: "switch-break",
    question: "What happens without BREAK in a switch case?",
    visual: (
      <div className="font-mono text-sm bg-muted/50 p-3 rounded-lg">
        <div>case 1: doA();</div>
        <div className="text-destructive">// no break!</div>
        <div>case 2: doB();</div>
      </div>
    ),
    answer: "FALL-THROUGH: continues executing next case(s) until break or end",
    hint: "It 'falls' down to the next case",
    difficulty: 2,
    category: "conditionals"
  },
  {
    id: "ternary-parts",
    question: "Name the 3 parts of a ternary operator",
    visual: (
      <div className="flex items-center justify-center gap-2 text-2xl font-mono">
        <span className="text-primary">?</span>
        <span className="mx-4 text-warning">?</span>
        <span className="text-success">:</span>
        <span className="mx-4 text-destructive">?</span>
      </div>
    ),
    answer: "Condition ? TrueValue : FalseValue",
    hint: "C ? T : F",
    difficulty: 1,
    category: "conditionals"
  },
  {
    id: "and-or",
    question: "&& needs _____ true, || needs _____ true",
    visual: (
      <div className="flex justify-center gap-8 text-3xl">
        <div className="text-center">
          <div className="font-mono text-primary">&&</div>
          <div className="text-sm text-muted-foreground">AND</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-accent">||</div>
          <div className="text-sm text-muted-foreground">OR</div>
        </div>
      </div>
    ),
    answer: "&& needs ALL true, || needs ANY (just one) true",
    hint: "AND = All, OR = One",
    difficulty: 1,
    category: "conditionals"
  },

  // Methods
  {
    id: "method-order",
    question: "Method signature order: A.R.N.P. stands for?",
    visual: (
      <div className="font-mono text-center">
        <span className="text-primary">public</span> <span className="text-accent">int</span> <span className="text-warning">add</span>(<span className="text-success">int a, int b</span>)
      </div>
    ),
    answer: "Access, Return type, Name, Parameters",
    hint: "What can see it, what it gives back, what it's called, what it needs",
    difficulty: 2,
    category: "methods"
  },
  {
    id: "void-meaning",
    question: "What does VOID mean as a return type?",
    visual: (
      <div className="font-mono text-center bg-muted/50 p-3 rounded-lg">
        public <span className="text-destructive font-bold">void</span> sayHello() {`{`} ... {`}`}
      </div>
    ),
    answer: "Returns NOTHING - the method performs action but gives no value back",
    hint: "Void = empty/nothing",
    difficulty: 1,
    category: "methods"
  },
  {
    id: "static-meaning",
    question: "STATIC belongs to _____, not _____",
    visual: (
      <div className="flex justify-center gap-8">
        <div className="bg-primary/20 p-3 rounded-lg text-center">
          <div className="text-2xl">🏛️</div>
          <div className="text-sm">Class</div>
        </div>
        <div className="text-2xl">vs</div>
        <div className="bg-accent/20 p-3 rounded-lg text-center">
          <div className="text-2xl">📦</div>
          <div className="text-sm">Object</div>
        </div>
      </div>
    ),
    answer: "Static belongs to CLASS, not individual OBJECT instances",
    hint: "Shared by all, like a class variable everyone can access",
    difficulty: 2,
    category: "methods"
  },

  // OOP
  {
    id: "oop-pillars",
    question: "4 OOP Pillars: A-PIE stands for?",
    visual: (
      <div className="text-6xl text-center">🍰</div>
    ),
    answer: "Abstraction, Polymorphism, Inheritance, Encapsulation",
    hint: "A = hide complexity, PIE = the three classics",
    difficulty: 2,
    category: "oop"
  },
  {
    id: "extends-keyword",
    question: "Child _____ Parent to inherit",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="bg-primary/20 px-4 py-2 rounded-lg">Animal</div>
        <div className="text-xl">↓ ?</div>
        <div className="bg-accent/20 px-4 py-2 rounded-lg">Dog</div>
      </div>
    ),
    answer: "extends - class Dog extends Animal",
    hint: "The child class _____ the parent class",
    difficulty: 1,
    category: "oop"
  },
  {
    id: "constructor-purpose",
    question: "What does a CONSTRUCTOR do?",
    visual: (
      <div className="font-mono text-sm bg-muted/50 p-3 rounded-lg">
        Dog(String name) {`{`}<br/>
        &nbsp;&nbsp;this.name = name;<br/>
        {`}`}
      </div>
    ),
    answer: "Initializes a new object - sets up initial state when created with 'new'",
    hint: "Called when you 'new' an object",
    difficulty: 1,
    category: "oop"
  },

  // Data Structures
  {
    id: "array-vs-list",
    question: "Array is _____ size, ArrayList is _____ size",
    visual: (
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className="w-8 h-8 bg-primary/20 border-2 border-primary rounded" />)}
          </div>
          <div className="text-sm mt-1">Array</div>
        </div>
        <div className="text-center">
          <div className="flex gap-1 items-center">
            {[1,2,3].map(i => <div key={i} className="w-8 h-8 bg-success/20 border-2 border-success rounded" />)}
            <div className="w-8 h-8 border-2 border-dashed border-success/50 rounded flex items-center justify-center text-success">+</div>
          </div>
          <div className="text-sm mt-1">ArrayList</div>
        </div>
      </div>
    ),
    answer: "Array is FIXED size, ArrayList is DYNAMIC (grows/shrinks)",
    hint: "Array = set at creation, ArrayList = flexible",
    difficulty: 1,
    category: "data"
  },
  {
    id: "map-structure",
    question: "HashMap stores data as _____-_____ pairs",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 justify-center">
          <span className="bg-primary/20 px-2 py-1 rounded">"name"</span>
          <span>→</span>
          <span className="bg-accent/20 px-2 py-1 rounded">"Alice"</span>
        </div>
      </div>
    ),
    answer: "KEY-VALUE pairs - look up by key, get value",
    hint: "Like a dictionary: word → definition",
    difficulty: 1,
    category: "data"
  },
  {
    id: "set-property",
    question: "A Set only contains _____ elements",
    visual: (
      <div className="flex justify-center gap-2">
        <span className="bg-accent/20 px-3 py-1 rounded">A</span>
        <span className="bg-accent/20 px-3 py-1 rounded">B</span>
        <span className="bg-destructive/20 px-3 py-1 rounded line-through">A</span>
        <span className="bg-accent/20 px-3 py-1 rounded">C</span>
      </div>
    ),
    answer: "UNIQUE - no duplicates allowed",
    hint: "Set = unique only, duplicates rejected",
    difficulty: 1,
    category: "data"
  },

  // Security
  {
    id: "aaa-security",
    question: "Security A.A.A.: Authentication, Authorization, _____",
    visual: (
      <div className="space-y-2">
        <div className="bg-primary/20 p-2 rounded">✓ Authentication - WHO</div>
        <div className="bg-accent/20 p-2 rounded">✓ Authorization - WHAT</div>
        <div className="bg-warning/20 p-2 rounded">? _____ - LOG</div>
      </div>
    ),
    answer: "Accounting - logging/tracking what was done",
    hint: "The third A tracks activities",
    difficulty: 2,
    category: "security"
  },

  // Systems
  {
    id: "acid-db",
    question: "Database A.C.I.D.: Atomic, Consistent, Isolated, _____",
    visual: (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-primary/20 p-2 rounded">A = All or nothing</div>
        <div className="bg-accent/20 p-2 rounded">C = Valid state</div>
        <div className="bg-warning/20 p-2 rounded">I = No interference</div>
        <div className="bg-success/20 p-2 rounded">D = ?</div>
      </div>
    ),
    answer: "Durable - changes are permanent once committed",
    hint: "D means it lasts forever",
    difficulty: 2,
    category: "systems"
  },
  {
    id: "ipo-system",
    question: "System flow: I.P.O. = Input, _____, Output",
    visual: (
      <div className="flex items-center justify-center gap-4">
        <div className="bg-accent/20 p-3 rounded-lg">📥 IN</div>
        <span>→</span>
        <div className="bg-primary/20 p-3 rounded-lg">⚙️ ?</div>
        <span>→</span>
        <div className="bg-success/20 p-3 rounded-lg">📤 OUT</div>
      </div>
    ),
    answer: "PROCESS - transform input into output",
    hint: "What happens in the middle?",
    difficulty: 1,
    category: "systems"
  },
  {
    id: "mvc-pattern",
    question: "M.V.C. = Model (data), View (display), _____",
    visual: (
      <div className="flex justify-center gap-4">
        <div className="bg-primary/20 p-2 rounded text-center">
          <div>📊</div>
          <div className="text-xs">Model</div>
        </div>
        <div className="bg-accent/20 p-2 rounded text-center">
          <div>👁️</div>
          <div className="text-xs">View</div>
        </div>
        <div className="bg-success/20 p-2 rounded text-center">
          <div>❓</div>
          <div className="text-xs">???</div>
        </div>
      </div>
    ),
    answer: "Controller - handles logic and user input",
    hint: "The brain that controls the flow",
    difficulty: 2,
    category: "systems"
  },
];

export default function SpacedRepetitionGame() {
  const { playSound } = useGame();
  const [questions, setQuestions] = useState<Question[]>(() => 
    initialQuestions.map(q => ({ ...q, interval: 1, easeFactor: 2.5 }))
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const selectNextQuestion = useCallback(() => {
    // Get due questions (interval passed) or new ones
    const now = Date.now();
    const dueQuestions = questions.filter(q => {
      if (!q.lastSeen) return true;
      const dueTime = q.lastSeen + (q.interval * 60 * 1000); // interval in minutes for demo
      return now >= dueTime;
    });

    if (dueQuestions.length === 0) {
      setSessionComplete(true);
      return;
    }

    // Prioritize by difficulty and randomness
    const sorted = dueQuestions.sort((a, b) => {
      // Prioritize not-yet-seen, then by ease factor (harder first)
      if (!a.lastSeen && b.lastSeen) return -1;
      if (a.lastSeen && !b.lastSeen) return 1;
      return a.easeFactor - b.easeFactor;
    });

    setCurrentQuestion(sorted[0]);
    setShowAnswer(false);
    setShowHint(false);
  }, [questions]);

  useEffect(() => {
    if (!currentQuestion && !sessionComplete) {
      selectNextQuestion();
    }
  }, [currentQuestion, sessionComplete, selectNextQuestion]);

  const handleReveal = () => {
    setShowAnswer(true);
    playSound("click");
  };

  const handleResponse = (quality: number) => {
    if (!currentQuestion) return;

    // SM-2 Algorithm simplified
    let newEaseFactor = currentQuestion.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newInterval = currentQuestion.interval;
    if (quality >= 3) {
      if (currentQuestion.interval === 1) {
        newInterval = 1;
      } else if (currentQuestion.interval === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentQuestion.interval * newEaseFactor);
      }
      setStreak(s => s + 1);
      setCorrectCount(c => c + 1);
      playSound("success");
    } else {
      newInterval = 1;
      setStreak(0);
      playSound("error");
    }

    setQuestions(qs => qs.map(q => 
      q.id === currentQuestion.id 
        ? { ...q, lastSeen: Date.now(), interval: newInterval, easeFactor: newEaseFactor }
        : q
    ));

    setTotalReviewed(t => t + 1);
    setCurrentQuestion(null);
  };

  const resetSession = () => {
    setQuestions(initialQuestions.map(q => ({ ...q, interval: 1, easeFactor: 2.5 })));
    setCurrentQuestion(null);
    setSessionComplete(false);
    setStreak(0);
    setTotalReviewed(0);
    setCorrectCount(0);
    playSound("click");
  };

  if (sessionComplete) {
    const accuracy = totalReviewed > 0 ? Math.round((correctCount / totalReviewed) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🧠</div>
        <h2 className="text-3xl font-black text-foreground mb-4">All Cards Reviewed!</h2>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="bg-success/10 border-success/30">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">{correctCount}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mb-6">
          Come back later to review again. Spaced repetition builds long-term memory!
        </p>

        <Button size="lg" onClick={resetSession} className="gap-2">
          <Repeat className="w-5 h-5" />
          Start Fresh Session
        </Button>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading next card...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-5 h-5" />
            <span className="font-bold">{streak} streak</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="w-5 h-5" />
            <span>{totalReviewed} reviewed</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {questions.filter(q => !q.lastSeen).length} new
        </div>
      </div>

      {/* Progress */}
      <Progress value={(totalReviewed / questions.length) * 100} className="h-2 mb-6" />

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {currentQuestion.category.toUpperCase()}
            </span>
          </div>

          {/* Visual */}
          <div className="mb-6">
            {currentQuestion.visual}
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-foreground text-center mb-6">
            {currentQuestion.question}
          </h3>

          {/* Hint */}
          {!showAnswer && (
            <div className="text-center mb-4">
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-warning/10 border border-warning/30 rounded-lg p-3"
                >
                  <p className="text-warning text-sm">💡 {currentQuestion.hint}</p>
                </motion.div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                  Show Hint
                </Button>
              )}
            </div>
          )}

          {/* Answer or Reveal */}
          {!showAnswer ? (
            <Button onClick={handleReveal} className="w-full" size="lg">
              Reveal Answer
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6">
                <p className="text-foreground font-medium">{currentQuestion.answer}</p>
              </div>

              <p className="text-center text-sm text-muted-foreground mb-4">
                How well did you know this?
              </p>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleResponse(1)}
                  className="h-16 flex-col border-destructive text-destructive hover:bg-destructive/10"
                >
                  <X className="w-5 h-5 mb-1" />
                  <span className="text-xs">Forgot</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse(2)}
                  className="h-16 flex-col border-warning text-warning hover:bg-warning/10"
                >
                  <span className="text-lg mb-1">😕</span>
                  <span className="text-xs">Hard</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse(4)}
                  className="h-16 flex-col border-accent text-accent hover:bg-accent/10"
                >
                  <span className="text-lg mb-1">🙂</span>
                  <span className="text-xs">Good</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse(5)}
                  className="h-16 flex-col border-success text-success hover:bg-success/10"
                >
                  <Check className="w-5 h-5 mb-1" />
                  <span className="text-xs">Easy!</span>
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <p className="text-center text-sm text-muted-foreground">
        🧠 Cards you know well appear less often. Struggling cards repeat more!
      </p>
    </div>
  );
}