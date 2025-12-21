import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { ArrowRight, RotateCcw, Check, X, Brain, Lightbulb, Star } from "lucide-react";

interface Flashcard {
  id: string;
  mnemonic: string;
  meaning: string;
  example: string;
  category: "loops" | "conditionals" | "methods" | "oop" | "data";
  visual: string;
  hint: string;
}

const flashcards: Flashcard[] = [
  // Loop Mnemonics
  {
    id: "ficu",
    mnemonic: "F-I-C-U",
    meaning: "For loop structure: for(Init; Condition; Update)",
    example: "for (int i = 0; i < 10; i++)",
    category: "loops",
    visual: "🔄",
    hint: "F=for, I=initialize, C=condition, U=update"
  },
  {
    id: "wc",
    mnemonic: "W-C",
    meaning: "While loop: While(Condition) - check BEFORE running",
    example: "while (count < 10) { count++; }",
    category: "loops",
    visual: "⏳",
    hint: "While Checks first, then runs body"
  },
  {
    id: "dwc",
    mnemonic: "D-W-C",
    meaning: "Do-While: Do first, While Check after",
    example: "do { x++; } while (x < 5);",
    category: "loops",
    visual: "🎯",
    hint: "Does at least once, then Checks"
  },
  {
    id: "foreach",
    mnemonic: "FE-TS",
    meaning: "For-Each: Type : Source (no index needed)",
    example: "for (String s : array)",
    category: "loops",
    visual: "📦",
    hint: "For Each item of Type in Source"
  },
  
  // Conditional Mnemonics
  {
    id: "ife",
    mnemonic: "I-E-E",
    meaning: "If-ElseIf-Else: Check order matters!",
    example: "if (x > 10) {} else if (x > 5) {} else {}",
    category: "conditionals",
    visual: "🔀",
    hint: "If first, ElseIf middle, Else last"
  },
  {
    id: "scdb",
    mnemonic: "S-C-D-B",
    meaning: "Switch-Case-Default-Break",
    example: "switch(x) { case 1: break; default: }",
    category: "conditionals",
    visual: "🎛️",
    hint: "Switch opens, Cases match, Default catches, Break exits"
  },
  {
    id: "ternary",
    mnemonic: "C?T:F",
    meaning: "Ternary: Condition ? True : False",
    example: "String result = (age >= 18) ? \"adult\" : \"minor\";",
    category: "conditionals",
    visual: "⚖️",
    hint: "Condition ? what if True : what if False"
  },
  {
    id: "andor",
    mnemonic: "&&=ALL ||=ANY",
    meaning: "AND needs ALL true, OR needs ANY true",
    example: "(a && b) vs (a || b)",
    category: "conditionals",
    visual: "🔗",
    hint: "Double ampersand=both, Double pipe=either"
  },

  // Method Mnemonics
  {
    id: "mrap",
    mnemonic: "M-R-A-P",
    meaning: "Method: Modifier Return-type Access Parameters",
    example: "public int calculate(int x, int y)",
    category: "methods",
    visual: "🔧",
    hint: "Modifier first, Return type, name, (Parameters)"
  },
  {
    id: "void",
    mnemonic: "VOID = Victory Over Input Data",
    meaning: "void means method returns nothing",
    example: "public void sayHello() { }",
    category: "methods",
    visual: "🚫",
    hint: "Void = no return value"
  },
  {
    id: "static",
    mnemonic: "STATIC = Shared To All Instances Class",
    meaning: "static belongs to class, not instance",
    example: "public static int count = 0;",
    category: "methods",
    visual: "🏛️",
    hint: "Static = class-level, shared by all objects"
  },
  {
    id: "return",
    mnemonic: "R-E-T",
    meaning: "Return Exits and Transfers value back",
    example: "return sum;",
    category: "methods",
    visual: "↩️",
    hint: "Return = exit method and give back value"
  },

  // OOP Mnemonics
  {
    id: "pie",
    mnemonic: "P-I-E",
    meaning: "OOP Pillars: Polymorphism, Inheritance, Encapsulation",
    example: "class Dog extends Animal { }",
    category: "oop",
    visual: "🥧",
    hint: "Remember PIE for the three pillars"
  },
  {
    id: "apie",
    mnemonic: "A-PIE",
    meaning: "Abstraction + PIE = 4 OOP pillars",
    example: "abstract class Shape { abstract void draw(); }",
    category: "oop",
    visual: "🍰",
    hint: "A=hide complexity, PIE=poly/inherit/encap"
  },
  {
    id: "new",
    mnemonic: "N-E-W",
    meaning: "New = Navigate to memory, Establish object, Wire constructor",
    example: "Dog myDog = new Dog();",
    category: "oop",
    visual: "🆕",
    hint: "new creates fresh object in memory"
  },
  {
    id: "this",
    mnemonic: "THIS = The Host Instance Self",
    meaning: "this refers to current object instance",
    example: "this.name = name;",
    category: "oop",
    visual: "👆",
    hint: "this = me, the current object"
  },

  // Data Structure Mnemonics
  {
    id: "array",
    mnemonic: "A-F-I",
    meaning: "Array: Fixed-size, Indexed from 0",
    example: "int[] nums = new int[5];",
    category: "data",
    visual: "📊",
    hint: "Arrays are Fixed, Index starts at 0"
  },
  {
    id: "list",
    mnemonic: "L-D-G",
    meaning: "List: Dynamic size, Grows automatically",
    example: "List<String> list = new ArrayList<>();",
    category: "data",
    visual: "📋",
    hint: "Lists are Dynamic and Grow as needed"
  },
  {
    id: "map",
    mnemonic: "K-V-P",
    meaning: "Map: Key-Value Pairs",
    example: "Map<String, Integer> map = new HashMap<>();",
    category: "data",
    visual: "🗺️",
    hint: "Maps store Key-Value Pairs"
  },
  {
    id: "set",
    mnemonic: "U-N-D",
    meaning: "Set: Unique, No Duplicates",
    example: "Set<String> unique = new HashSet<>();",
    category: "data",
    visual: "⭕",
    hint: "Sets only keep Unique items, No Duplicates"
  },
];

const categoryColors: Record<string, string> = {
  loops: "bg-primary/20 text-primary border-primary/30",
  conditionals: "bg-accent/20 text-accent border-accent/30",
  methods: "bg-success/20 text-success border-success/30",
  oop: "bg-warning/20 text-warning border-warning/30",
  data: "bg-secondary/20 text-secondary border-secondary/30",
};

const categoryLabels: Record<string, string> = {
  loops: "Loops",
  conditionals: "Conditionals",
  methods: "Methods",
  oop: "OOP",
  data: "Data Structures",
};

export function MnemonicFlashcardGame() {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [learning, setLearning] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((known.length + learning.length) / flashcards.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
    playSound("click");
  }, [isFlipped, playSound]);

  const handleKnow = useCallback(() => {
    if (!known.includes(currentCard.id)) {
      setKnown([...known, currentCard.id]);
    }
    playSound("success");
    nextCard();
  }, [currentCard, known, playSound]);

  const handleLearning = useCallback(() => {
    if (!learning.includes(currentCard.id) && !known.includes(currentCard.id)) {
      setLearning([...learning, currentCard.id]);
    }
    playSound("click");
    nextCard();
  }, [currentCard, learning, known, playSound]);

  const nextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnown([]);
    setLearning([]);
    setShowHint(false);
    setIsComplete(false);
    playSound("click");
  };

  if (isComplete) {
    const accuracy = Math.round((known.length / flashcards.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-3xl font-black text-foreground mb-4">Session Complete!</h2>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="bg-success/10 border-success/30">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">{known.length}</p>
              <p className="text-sm text-muted-foreground">Mastered</p>
            </CardContent>
          </Card>
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-3xl font-bold text-warning">{learning.length}</p>
              <p className="text-sm text-muted-foreground">Learning</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <p className="text-xl text-muted-foreground mb-2">Retention Rate</p>
          <p className="text-5xl font-black text-primary">{accuracy}%</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button size="lg" onClick={resetGame} className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-success">
              <Check className="w-4 h-4" /> {known.length}
            </span>
            <span className="flex items-center gap-1 text-warning">
              <Brain className="w-4 h-4" /> {learning.length}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Category Badge */}
      <div className="flex justify-center mb-4">
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${categoryColors[currentCard.category]}`}>
          {categoryLabels[currentCard.category]}
        </span>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 cursor-pointer mb-6"
        onClick={handleFlip}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`min-h-[320px] ${isFlipped ? 'bg-gradient-to-br from-primary/10 to-accent/10' : 'bg-card'} border-2`}>
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px] text-center">
                {!isFlipped ? (
                  <>
                    <div className="text-6xl mb-6">{currentCard.visual}</div>
                    <h3 className="text-4xl font-black text-primary mb-4 font-mono tracking-wider">
                      {currentCard.mnemonic}
                    </h3>
                    <p className="text-muted-foreground">Tap to reveal meaning</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {currentCard.meaning}
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm text-foreground mb-4 w-full">
                      {currentCard.example}
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{currentCard.hint}"
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hint Button */}
      {!isFlipped && !showHint && (
        <div className="flex justify-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Show Hint
          </Button>
        </div>
      )}
      
      {showHint && !isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 p-3 bg-warning/10 rounded-lg border border-warning/30"
        >
          <p className="text-sm text-warning">{currentCard.hint}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleLearning}
          className="h-16 text-lg gap-2 border-warning text-warning hover:bg-warning/10"
        >
          <Brain className="w-6 h-6" />
          Still Learning
        </Button>
        <Button
          size="lg"
          onClick={handleKnow}
          className="h-16 text-lg gap-2 bg-success hover:bg-success/90"
        >
          <Check className="w-6 h-6" />
          Got It!
        </Button>
      </div>

      {/* Tip */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Tip: Practice daily for best retention. Mnemonics make patterns stick!
      </p>
    </div>
  );
}