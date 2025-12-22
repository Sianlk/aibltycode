import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { ArrowRight, RotateCcw, Check, X, Brain, Lightbulb, Star, Code, Zap, BookOpen, Terminal, Layers } from "lucide-react";

interface CodingStep {
  step: number;
  code: string;
  description: string;
  color: string;
}

interface Flashcard {
  id: string;
  title: string;
  mnemonic: string;
  icon: string;
  category: "program-structure" | "loops" | "conditionals" | "methods" | "oop" | "data" | "systems" | "security" | "ai" | "maths";
  steps: CodingStep[];
  fullExample: string;
  realWorld: string;
  tip: string;
}

// Step-by-step coding patterns - what to write WHEN
const flashcards: Flashcard[] = [
  // ==================== PROGRAM STRUCTURE ====================
  {
    id: "program-start",
    title: "Starting Any Program",
    mnemonic: "P.I.C.M. = Package → Import → Class → Main",
    icon: "🚀",
    category: "program-structure",
    steps: [
      { step: 1, code: "package com.myapp;", description: "PACKAGE - Where does this file live?", color: "primary" },
      { step: 2, code: "import java.util.*;", description: "IMPORT - What tools do we need?", color: "accent" },
      { step: 3, code: "public class MyApp {", description: "CLASS - What is this thing called?", color: "warning" },
      { step: 4, code: "  public static void main(String[] args) {", description: "MAIN - Where does code start running?", color: "success" },
    ],
    fullExample: `package com.myapp;
import java.util.*;
public class MyApp {
  public static void main(String[] args) {
    // Your code starts here!
  }
}`,
    realWorld: "Like writing a letter: Address (package) → Materials (imports) → Title (class) → Body (main)",
    tip: "Every Java program needs this skeleton. Main is your entry point!"
  },
  {
    id: "variable-declaration",
    title: "Creating Variables",
    mnemonic: "T.N.V. = Type → Name → Value",
    icon: "📦",
    category: "program-structure",
    steps: [
      { step: 1, code: "int", description: "TYPE - What kind of data? (int, String, boolean...)", color: "primary" },
      { step: 2, code: "age", description: "NAME - What should we call it? (camelCase)", color: "accent" },
      { step: 3, code: "= 25;", description: "VALUE - What's inside? (don't forget semicolon!)", color: "success" },
    ],
    fullExample: `int age = 25;
String name = "Alex";
boolean isActive = true;
double price = 19.99;`,
    realWorld: "Like labeling boxes: Box type (int) → Label (age) → Contents (25)",
    tip: "Type comes FIRST in Java. Use camelCase for names!"
  },

  // ==================== FOR LOOP - DETAILED ====================
  {
    id: "for-loop-build",
    title: "Building a FOR Loop",
    mnemonic: "F.I.C.U.B. = For → Init → Check → Update → Body",
    icon: "🔄",
    category: "loops",
    steps: [
      { step: 1, code: "for (", description: "FOR - Start with the keyword", color: "primary" },
      { step: 2, code: "int i = 0;", description: "INIT - Create counter, usually i = 0", color: "accent" },
      { step: 3, code: "i < 10;", description: "CHECK - When to stop? (condition)", color: "warning" },
      { step: 4, code: "i++)", description: "UPDATE - How to change counter (usually i++)", color: "success" },
      { step: 5, code: " { code }", description: "BODY - What to repeat inside { }", color: "secondary" },
    ],
    fullExample: `for (int i = 0; i < 10; i++) {
  System.out.println("Count: " + i);
}`,
    realWorld: "Like counting steps: Start at 0, check if < 10, add 1 each time",
    tip: "i++ means i = i + 1. The loop runs while condition is TRUE!"
  },
  {
    id: "while-loop-build",
    title: "Building a WHILE Loop",
    mnemonic: "W.C.B.U. = While → Check → Body → Update",
    icon: "⏳",
    category: "loops",
    steps: [
      { step: 1, code: "while (", description: "WHILE - The keyword", color: "primary" },
      { step: 2, code: "count < 10)", description: "CHECK - Condition (must become false eventually!)", color: "accent" },
      { step: 3, code: " { code", description: "BODY - What to repeat", color: "warning" },
      { step: 4, code: " count++; }", description: "UPDATE - MUST change condition or infinite loop!", color: "success" },
    ],
    fullExample: `int count = 0;
while (count < 10) {
  System.out.println(count);
  count++;  // CRITICAL: Change the condition!
}`,
    realWorld: "Like waiting: While door is locked, keep knocking. Must unlock eventually!",
    tip: "⚠️ Always update your condition inside the loop or it runs forever!"
  },

  // ==================== CONDITIONALS ====================
  {
    id: "if-else-build",
    title: "Building IF-ELSE",
    mnemonic: "I.C.T.E. = If → Condition → Then → Else",
    icon: "🔀",
    category: "conditionals",
    steps: [
      { step: 1, code: "if (", description: "IF - The keyword", color: "primary" },
      { step: 2, code: "age >= 18)", description: "CONDITION - What are we checking?", color: "accent" },
      { step: 3, code: " { adult(); }", description: "THEN - Do this if TRUE", color: "success" },
      { step: 4, code: " else { minor(); }", description: "ELSE - Do this if FALSE", color: "warning" },
    ],
    fullExample: `if (age >= 18) {
  System.out.println("Can vote!");
} else {
  System.out.println("Too young");
}`,
    realWorld: "Like a bouncer: If age >= 21, enter. Else, turned away.",
    tip: "Use >= (greater or equal), == (equals), != (not equal)"
  },
  {
    id: "switch-build",
    title: "Building SWITCH",
    mnemonic: "S.C.B.D. = Switch → Case → Break → Default",
    icon: "🎛️",
    category: "conditionals",
    steps: [
      { step: 1, code: "switch (day) {", description: "SWITCH - What variable to check?", color: "primary" },
      { step: 2, code: "  case 1:", description: "CASE - Match this value", color: "accent" },
      { step: 3, code: "    code; break;", description: "BREAK - Exit after match (or falls through!)", color: "warning" },
      { step: 4, code: "  default:", description: "DEFAULT - If nothing matches", color: "success" },
    ],
    fullExample: `switch (day) {
  case 1: System.out.println("Monday"); break;
  case 2: System.out.println("Tuesday"); break;
  default: System.out.println("Unknown");
}`,
    realWorld: "Like a vending machine: Press 1 → get chips. Press 2 → get soda.",
    tip: "⚠️ Don't forget BREAK or code falls through to next case!"
  },

  // ==================== METHODS ====================
  {
    id: "method-build",
    title: "Building a METHOD",
    mnemonic: "A.R.N.P.B. = Access → Return → Name → Params → Body",
    icon: "🔧",
    category: "methods",
    steps: [
      { step: 1, code: "public", description: "ACCESS - Who can use it? (public/private)", color: "primary" },
      { step: 2, code: "int", description: "RETURN - What does it give back? (int/void/String)", color: "accent" },
      { step: 3, code: "add", description: "NAME - What's it called? (verb, camelCase)", color: "warning" },
      { step: 4, code: "(int a, int b)", description: "PARAMS - What does it need?", color: "success" },
      { step: 5, code: " { return a + b; }", description: "BODY - What does it do? Return if not void!", color: "secondary" },
    ],
    fullExample: `public int add(int a, int b) {
  return a + b;
}

// Call it:
int result = add(5, 3);  // result = 8`,
    realWorld: "Like a recipe: Who can cook → What it makes → Recipe name → Ingredients → Steps",
    tip: "void means no return. Otherwise MUST return matching type!"
  },
  {
    id: "try-catch-build",
    title: "Building TRY-CATCH",
    mnemonic: "T.C.F. = Try → Catch → Finally",
    icon: "🛡️",
    category: "methods",
    steps: [
      { step: 1, code: "try {", description: "TRY - Risky code that might fail", color: "primary" },
      { step: 2, code: "  riskyCode();", description: "RISKY - File reading, network, parsing...", color: "accent" },
      { step: 3, code: "} catch (Exception e) {", description: "CATCH - Handle the error", color: "warning" },
      { step: 4, code: "} finally {", description: "FINALLY - Always runs (cleanup)", color: "success" },
    ],
    fullExample: `try {
  int result = 10 / 0;  // Risky!
} catch (Exception e) {
  System.out.println("Error: " + e.getMessage());
} finally {
  System.out.println("Done!");  // Always runs
}`,
    realWorld: "Like cooking: Try recipe, Catch if burnt (handle error), Finally clean up",
    tip: "Finally is optional but great for cleanup (closing files, connections)"
  },

  // ==================== OOP ====================
  {
    id: "class-build",
    title: "Building a CLASS",
    mnemonic: "C.F.C.M. = Class → Fields → Constructor → Methods",
    icon: "📦",
    category: "oop",
    steps: [
      { step: 1, code: "public class Dog {", description: "CLASS - Blueprint name (PascalCase)", color: "primary" },
      { step: 2, code: "  private String name;", description: "FIELDS - Data it holds (usually private)", color: "accent" },
      { step: 3, code: "  public Dog(String n) { name = n; }", description: "CONSTRUCTOR - How to create it", color: "warning" },
      { step: 4, code: "  public void bark() { }", description: "METHODS - Actions it can do", color: "success" },
    ],
    fullExample: `public class Dog {
  private String name;
  private int age;
  
  public Dog(String name, int age) {
    this.name = name;
    this.age = age;
  }
  
  public void bark() {
    System.out.println(name + " says Woof!");
  }
}`,
    realWorld: "Like a blueprint: Name (Dog) → Attributes (name, age) → Setup → Actions",
    tip: "Use 'this.name' when parameter has same name as field!"
  },
  {
    id: "inheritance-build",
    title: "Using INHERITANCE",
    mnemonic: "E.S.O. = Extends → Super → Override",
    icon: "🧬",
    category: "oop",
    steps: [
      { step: 1, code: "class Dog extends Animal {", description: "EXTENDS - Child inherits from parent", color: "primary" },
      { step: 2, code: "  super(name);", description: "SUPER - Call parent's constructor", color: "accent" },
      { step: 3, code: "  @Override", description: "OVERRIDE - Replace parent's method", color: "warning" },
      { step: 4, code: "  public void speak() { }", description: "NEW BEHAVIOR - Child's version", color: "success" },
    ],
    fullExample: `class Animal {
  protected String name;
  public Animal(String name) { this.name = name; }
  public void speak() { System.out.println("..."); }
}

class Dog extends Animal {
  public Dog(String name) { super(name); }
  
  @Override
  public void speak() { System.out.println("Woof!"); }
}`,
    realWorld: "Like genetics: Dog extends Animal, inherits traits, can override behavior",
    tip: "@Override helps compiler catch errors if parent method doesn't exist!"
  },

  // ==================== DATA STRUCTURES ====================
  {
    id: "array-build",
    title: "Building an ARRAY",
    mnemonic: "T.N.S.A. = Type → Name → Size → Access",
    icon: "📊",
    category: "data",
    steps: [
      { step: 1, code: "int[]", description: "TYPE - What kind of data? Add []", color: "primary" },
      { step: 2, code: "numbers", description: "NAME - What's it called?", color: "accent" },
      { step: 3, code: "= new int[5];", description: "SIZE - How many slots? (fixed!)", color: "warning" },
      { step: 4, code: "numbers[0] = 10;", description: "ACCESS - Use index starting at 0", color: "success" },
    ],
    fullExample: `// Create array
int[] numbers = new int[5];
numbers[0] = 10;  // First slot

// Or create with values
String[] names = {"Alice", "Bob", "Carol"};
System.out.println(names[1]);  // "Bob"`,
    realWorld: "Like a row of lockers: All same type, numbered 0, 1, 2..., fixed count",
    tip: "Index starts at 0! Array of size 5 has indices 0-4."
  },
  {
    id: "arraylist-build",
    title: "Building an ARRAYLIST",
    mnemonic: "A.L.C.A.G.R. = ArrayList → List → Create → Add → Get → Remove",
    icon: "📝",
    category: "data",
    steps: [
      { step: 1, code: "ArrayList<String>", description: "TYPE - ArrayList with <WrapperType>", color: "primary" },
      { step: 2, code: "names", description: "NAME - What's it called?", color: "accent" },
      { step: 3, code: "= new ArrayList<>();", description: "CREATE - Use diamond <>", color: "warning" },
      { step: 4, code: "names.add(\"Alex\");", description: "ADD/GET/REMOVE - Use methods, not []", color: "success" },
    ],
    fullExample: `ArrayList<String> names = new ArrayList<>();
names.add("Alice");        // Add to end
names.add(0, "Bob");       // Add at index
String first = names.get(0);  // Get by index
names.remove(0);           // Remove by index
int size = names.size();   // Get count`,
    realWorld: "Like a stretchy list: Can grow/shrink, use methods not brackets",
    tip: "Use Integer not int, Double not double in ArrayList<>!"
  },

  // ==================== SYSTEMS ANALYSIS ====================
  {
    id: "sdlc-phases",
    title: "SDLC Phases",
    mnemonic: "R.A.D.I.T.M. = Requirements → Analysis → Design → Implement → Test → Maintain",
    icon: "🔄",
    category: "systems",
    steps: [
      { step: 1, code: "1. Requirements", description: "WHAT does the client need?", color: "primary" },
      { step: 2, code: "2. Analysis", description: "HOW will we solve it?", color: "accent" },
      { step: 3, code: "3. Design", description: "DRAW the solution (UML, wireframes)", color: "warning" },
      { step: 4, code: "4. Implementation", description: "CODE the solution", color: "success" },
      { step: 5, code: "5. Testing", description: "VERIFY it works", color: "secondary" },
      { step: 6, code: "6. Maintenance", description: "FIX and IMPROVE over time", color: "primary" },
    ],
    fullExample: `Requirements → What features?
Analysis → Feasibility study
Design → UML diagrams, database schema
Implementation → Write code
Testing → Unit, integration, UAT
Maintenance → Bug fixes, updates`,
    realWorld: "Like building a house: Plan → Blueprint → Build → Inspect → Repair",
    tip: "Waterfall does this in sequence. Agile does it in short cycles!"
  },
  {
    id: "use-case-build",
    title: "Writing USE CASES",
    mnemonic: "A.P.S.E. = Actor → Precondition → Steps → Extension",
    icon: "🎭",
    category: "systems",
    steps: [
      { step: 1, code: "Actor: Customer", description: "WHO is doing this action?", color: "primary" },
      { step: 2, code: "Precondition: Logged in", description: "WHAT must be true first?", color: "accent" },
      { step: 3, code: "Steps: 1. Select, 2. Pay", description: "HAPPY PATH - normal flow", color: "success" },
      { step: 4, code: "Extension: Payment fails", description: "WHAT IF something goes wrong?", color: "warning" },
    ],
    fullExample: `Use Case: Purchase Item
Actor: Customer
Precondition: User is logged in
Main Flow:
  1. User selects item
  2. User clicks checkout
  3. User enters payment
  4. System confirms order
Extensions:
  3a. Payment fails → Show error`,
    realWorld: "Like a script: Who's acting, what they need, what happens, what if it fails",
    tip: "Always include extensions for errors and edge cases!"
  },

  // ==================== SECURITY ====================
  {
    id: "cia-triad",
    title: "CIA Security Triad",
    mnemonic: "C.I.A. = Confidentiality → Integrity → Availability",
    icon: "🔐",
    category: "security",
    steps: [
      { step: 1, code: "Confidentiality", description: "Only authorized people see data", color: "primary" },
      { step: 2, code: "Integrity", description: "Data cannot be tampered with", color: "accent" },
      { step: 3, code: "Availability", description: "System is up when needed", color: "success" },
    ],
    fullExample: `Confidentiality: Encryption, access control
  → Prevents: Data breaches
  
Integrity: Hashing, digital signatures
  → Prevents: Data tampering
  
Availability: Backups, redundancy
  → Prevents: Downtime, data loss`,
    realWorld: "Like a safe: Keep secrets (C), prevent forgery (I), always accessible (A)",
    tip: "Every security decision balances these three. Can't max all three!"
  },
  {
    id: "auth-vs-authz",
    title: "Authentication vs Authorization",
    mnemonic: "WHO vs WHAT = Identity → Permissions",
    icon: "🎫",
    category: "security",
    steps: [
      { step: 1, code: "Authentication", description: "WHO are you? (Login, password)", color: "primary" },
      { step: 2, code: "Authorization", description: "WHAT can you do? (Permissions)", color: "accent" },
      { step: 3, code: "Example: Login → Role check", description: "First verify identity, then check access", color: "success" },
    ],
    fullExample: `Authentication (AuthN):
  - Password, biometrics, 2FA
  - "Prove you are who you claim"
  
Authorization (AuthZ):
  - Roles, permissions, ACLs
  - "Are you allowed to do this?"
  
Order: AuthN first → then AuthZ`,
    realWorld: "Like a concert: Ticket (AuthN proves identity) → Backstage pass (AuthZ grants access)",
    tip: "You can be authenticated but not authorized for certain actions!"
  },

  // ==================== MATHS ====================
  {
    id: "big-o-notation",
    title: "Big-O Complexity",
    mnemonic: "O(1) < O(log n) < O(n) < O(n²) < O(2^n)",
    icon: "⏱️",
    category: "maths",
    steps: [
      { step: 1, code: "O(1) Constant", description: "Same time regardless of input size", color: "primary" },
      { step: 2, code: "O(log n) Logarithmic", description: "Halving each step (binary search)", color: "accent" },
      { step: 3, code: "O(n) Linear", description: "Time grows with input size", color: "warning" },
      { step: 4, code: "O(n²) Quadratic", description: "Nested loops (slow!)", color: "destructive" },
    ],
    fullExample: `O(1): array[0] - instant
O(log n): binary search - halves each time
O(n): for loop - visits each once
O(n log n): merge sort - efficient sorting
O(n²): nested for loops - avoid if possible!
O(2^n): recursive without memoization`,
    realWorld: "Like finding a book: O(1) know exact spot, O(n) scan shelf, O(n²) compare every pair",
    tip: "Always aim for O(n) or better. O(n²) gets slow fast!"
  },
  {
    id: "binary-conversion",
    title: "Binary Conversion",
    mnemonic: "8-4-2-1 = Place values right to left",
    icon: "🔢",
    category: "maths",
    steps: [
      { step: 1, code: "128 64 32 16 8 4 2 1", description: "Write place values (powers of 2)", color: "primary" },
      { step: 2, code: "Put 1 under values that sum to target", description: "Start from left, use largest that fits", color: "accent" },
      { step: 3, code: "13 = 8+4+1 = 1101", description: "8(1) + 4(1) + 2(0) + 1(1)", color: "success" },
    ],
    fullExample: `Decimal 13 to Binary:
  8 4 2 1
  1 1 0 1  = 1101
  
Binary 1011 to Decimal:
  8 + 0 + 2 + 1 = 11`,
    realWorld: "Like giving change: Use biggest coins first, mark which you used",
    tip: "For binary to decimal: multiply each digit by its place value and add!"
  },

  // ==================== AI / DATA SCIENCE ====================
  {
    id: "ml-workflow",
    title: "ML Workflow",
    mnemonic: "D.P.T.E.D. = Data → Preprocess → Train → Evaluate → Deploy",
    icon: "🤖",
    category: "ai",
    steps: [
      { step: 1, code: "1. Collect Data", description: "Gather training examples", color: "primary" },
      { step: 2, code: "2. Preprocess", description: "Clean, normalize, split train/test", color: "accent" },
      { step: 3, code: "3. Train Model", description: "Algorithm learns patterns", color: "warning" },
      { step: 4, code: "4. Evaluate", description: "Test accuracy on unseen data", color: "success" },
      { step: 5, code: "5. Deploy", description: "Use in production", color: "secondary" },
    ],
    fullExample: `Data: 10,000 labeled images
Preprocess: Resize, normalize 0-1, 80/20 split
Train: CNN learns features
Evaluate: 95% accuracy on test set
Deploy: API endpoint for predictions`,
    realWorld: "Like learning to cook: Get recipes (data), prep (preprocess), practice (train), taste test (evaluate), serve (deploy)",
    tip: "Never evaluate on training data - that's cheating!"
  },
  {
    id: "data-visualization",
    title: "Choosing Charts",
    mnemonic: "C.B.L.P.S. = Comparison → Bar, Trend → Line, Part → Pie, Relation → Scatter",
    icon: "📊",
    category: "ai",
    steps: [
      { step: 1, code: "Comparison → Bar Chart", description: "Compare categories", color: "primary" },
      { step: 2, code: "Trend over Time → Line Chart", description: "Show change over time", color: "accent" },
      { step: 3, code: "Part of Whole → Pie Chart", description: "Show percentages (max 5-7 slices)", color: "warning" },
      { step: 4, code: "Relationship → Scatter Plot", description: "Show correlation between variables", color: "success" },
    ],
    fullExample: `Sales by region → Bar Chart
Revenue 2020-2024 → Line Chart
Market share → Pie Chart
Height vs Weight → Scatter Plot`,
    realWorld: "Like choosing a tool: Different charts for different jobs",
    tip: "When in doubt, bar charts are always readable!"
  },
];

const categoryColors: Record<string, string> = {
  "program-structure": "bg-primary/20 text-primary",
  "loops": "bg-accent/20 text-accent",
  "conditionals": "bg-warning/20 text-warning",
  "methods": "bg-success/20 text-success",
  "oop": "bg-secondary/20 text-secondary",
  "data": "bg-primary/20 text-primary",
  "systems": "bg-accent/20 text-accent",
  "security": "bg-destructive/20 text-destructive",
  "ai": "bg-warning/20 text-warning",
  "maths": "bg-success/20 text-success",
};

const categoryLabels: Record<string, string> = {
  "program-structure": "Program Structure",
  "loops": "Loops",
  "conditionals": "Conditionals",
  "methods": "Methods",
  "oop": "OOP",
  "data": "Data Structures",
  "systems": "Systems",
  "security": "Security",
  "ai": "AI & Data",
  "maths": "Maths",
};

export const MnemonicFlashcardGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [learningCards, setLearningCards] = useState<Set<string>>(new Set());
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { playSound } = useGame();

  const currentCard = flashcards[currentIndex];
  const progress = ((knownCards.size + learningCards.size) / flashcards.length) * 100;

  const handleFlip = useCallback(() => {
    playSound("click");
    setFlipped(!flipped);
  }, [flipped, playSound]);

  const handleKnow = useCallback(() => {
    playSound("success");
    setKnownCards(prev => new Set(prev).add(currentCard.id));
    nextCard();
  }, [currentCard, playSound]);

  const handleLearning = useCallback(() => {
    playSound("click");
    setLearningCards(prev => new Set(prev).add(currentCard.id));
    nextCard();
  }, [currentCard, playSound]);

  const nextCard = () => {
    setFlipped(false);
    setShowSteps(false);
    setCurrentStep(0);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleStepThrough = () => {
    playSound("click");
    if (currentStep < currentCard.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSteps(false);
      setCurrentStep(0);
    }
  };

  const startStepMode = () => {
    playSound("click");
    setShowSteps(true);
    setCurrentStep(0);
  };

  const handleReset = () => {
    playSound("click");
    setKnownCards(new Set());
    setLearningCards(new Set());
    setCurrentIndex(0);
    setFlipped(false);
    setShowSteps(false);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black">Code Builder Cards</h1>
          </div>
          <p className="text-muted-foreground">Learn step-by-step coding patterns</p>
          
          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-success">✓ Know: {knownCards.size}</span>
              <span className="text-warning">📚 Learning: {learningCards.size}</span>
              <span className="text-muted-foreground">Remaining: {flashcards.length - knownCards.size - learningCards.size}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Category Badge */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[currentCard.category]}`}>
            {categoryLabels[currentCard.category]}
          </span>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (showSteps ? "-steps" : "")}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="cursor-pointer min-h-[400px] relative overflow-hidden"
              onClick={showSteps ? undefined : handleFlip}
            >
              <CardContent className="p-6">
                {showSteps ? (
                  /* Step-by-step mode */
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{currentCard.icon}</div>
                      <h2 className="text-xl font-bold">{currentCard.title}</h2>
                      <p className="text-primary font-mono text-lg mt-2">{currentCard.mnemonic}</p>
                    </div>

                    <div className="space-y-3 mt-6">
                      {currentCard.steps.map((step, idx) => (
                        <motion.div
                          key={step.step}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ 
                            x: 0, 
                            opacity: idx <= currentStep ? 1 : 0.3,
                            scale: idx === currentStep ? 1.02 : 1
                          }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-3 rounded-lg border-2 ${
                            idx === currentStep 
                              ? `border-${step.color} bg-${step.color}/10` 
                              : 'border-muted bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              idx <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              {step.step}
                            </div>
                            <div>
                              <code className="text-sm font-mono font-bold">{step.code}</code>
                              <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Button 
                      onClick={handleStepThrough} 
                      className="w-full mt-4"
                      variant={currentStep >= currentCard.steps.length - 1 ? "secondary" : "default"}
                    >
                      {currentStep >= currentCard.steps.length - 1 ? (
                        <>Done <Check className="w-4 h-4 ml-2" /></>
                      ) : (
                        <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                ) : !flipped ? (
                  /* Front of card */
                  <div className="text-center space-y-4">
                    <div className="text-6xl">{currentCard.icon}</div>
                    <h2 className="text-2xl font-black">{currentCard.title}</h2>
                    <div className="bg-primary/10 p-4 rounded-xl">
                      <p className="text-xl font-mono font-bold text-primary">{currentCard.mnemonic}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">(tap to see details)</p>
                    
                    <div className="flex justify-center gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); startStepMode(); }}>
                        <Layers className="w-4 h-4 mr-2" /> Step Through
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Back of card */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentCard.icon}</span>
                      <h3 className="font-bold">{currentCard.title}</h3>
                    </div>

                    {/* Steps summary */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Build Order:</div>
                      <div className="flex flex-wrap gap-1">
                        {currentCard.steps.map((step) => (
                          <span key={step.step} className="px-2 py-1 bg-primary/10 rounded text-xs font-mono">
                            {step.code.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Full example */}
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs font-medium">Full Example:</span>
                      </div>
                      <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                        {currentCard.fullExample}
                      </pre>
                    </div>

                    {/* Real world analogy */}
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <span className="text-sm">{currentCard.realWorld}</span>
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-warning/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">{currentCard.tip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        {!showSteps && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center gap-4 mt-6"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleLearning}
              className="gap-2 border-warning text-warning hover:bg-warning/10"
            >
              <BookOpen className="w-5 h-5" />
              Still Learning
            </Button>
            <Button
              size="lg"
              onClick={handleKnow}
              className="gap-2 bg-success hover:bg-success/90"
            >
              <Check className="w-5 h-5" />
              Got It! (+15 XP)
            </Button>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
