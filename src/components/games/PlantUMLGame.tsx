import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Lightbulb, Star, Code2 } from "lucide-react";

interface PlantUMLChallenge {
  id: number;
  scenario: string;
  codeSnippet?: string;
  question: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  mnemonic?: string;
  category: "class" | "sequence" | "usecase" | "activity" | "state" | "component";
}

const challenges: PlantUMLChallenge[] = [
  // Class diagrams
  {
    id: 1, scenario: "You're modeling a Vehicle class with properties.", category: "class",
    codeSnippet: "@startuml\nclass Vehicle {\n  - make: String\n  - model: String\n  + start(): void\n  + stop(): void\n}\n@enduml",
    question: "In PlantUML, what does the '-' symbol before a field mean?",
    correctAnswer: "Private visibility",
    options: ["Private visibility", "Public visibility", "Protected visibility", "Package visibility"],
    hint: "Think: minus = MINUS access, hidden away",
    explanation: "- = private, + = public, # = protected, ~ = package. These match UML visibility standards.",
    mnemonic: "Minus(-) = private (hidden), Plus(+) = public (open), Hash(#) = protected (guarded), Tilde(~) = package"
  },
  {
    id: 2, scenario: "Car extends Vehicle.", category: "class",
    codeSnippet: "Vehicle <|-- Car",
    question: "What does <|-- mean in PlantUML?",
    correctAnswer: "Inheritance (Car extends Vehicle)",
    options: ["Inheritance (Car extends Vehicle)", "Composition", "Dependency", "Association"],
    hint: "The triangle <| points to the PARENT. -- connects them.",
    explanation: "<|-- = inheritance. The open triangle always points to the parent/superclass.",
    mnemonic: "<|-- = 'IS-A' relationship. Triangle points to what it IS."
  },
  {
    id: 3, scenario: "University contains Departments that can't exist alone.", category: "class",
    codeSnippet: "University *-- Department",
    question: "What does *-- represent?",
    correctAnswer: "Composition (strong ownership)",
    options: ["Composition (strong ownership)", "Aggregation (weak ownership)", "Inheritance", "Implementation"],
    hint: "* is FILLED (strong). o would be hollow (weak).",
    explanation: "*-- = composition (filled diamond, strong ownership). o-- = aggregation (hollow diamond, weak ownership).",
    mnemonic: "* = strong Star bond (composition). o = Open, can leave (aggregation)."
  },
  {
    id: 4, scenario: "A class implements an interface.", category: "class",
    codeSnippet: "interface Flyable\nBird ..|> Flyable",
    question: "What does ..|> mean?",
    correctAnswer: "Implementation (realizes an interface)",
    options: ["Implementation (realizes an interface)", "Inheritance", "Dependency", "Association"],
    hint: "Dashed line = weaker than solid. Triangle = generalization.",
    explanation: "..|> = implementation/realization. Dashed line + triangle. Solid <|-- = inheritance.",
    mnemonic: "Dots(..) = 'I PROMISE to implement'. Solid(--) = 'I AM a subtype'."
  },
  // Sequence diagrams
  {
    id: 5, scenario: "Modeling a login flow between User, Server, and Database.", category: "sequence",
    codeSnippet: "User -> Server: login(email, pass)\nServer -> Database: findUser(email)\nDatabase --> Server: user data\nServer --> User: JWT token",
    question: "What does --> (dashed arrow) represent?",
    correctAnswer: "A return/response message",
    options: ["A return/response message", "An asynchronous message", "Object creation", "Self-message"],
    hint: "Dashes = RETURN journey. Solid = outgoing call.",
    explanation: "-> solid = synchronous call. --> dashed = return/response. ->> = async message.",
    mnemonic: "Solid(->) = SEND. Dashed(-->) = SEND BACK."
  },
  {
    id: 6, scenario: "You need to show a conditional block in a sequence diagram.", category: "sequence",
    codeSnippet: "alt valid credentials\n  Server --> User: success\nelse invalid\n  Server --> User: error\nend",
    question: "What keyword creates a conditional block?",
    correctAnswer: "alt/else/end",
    options: ["alt/else/end", "if/then/endif", "switch/case/end", "opt/else/end"],
    hint: "ALTernative paths — like alternative endings",
    explanation: "alt = alternatives (if/else). opt = optional (if without else). loop = repetition. par = parallel.",
    mnemonic: "ALT = ALTernative paths. OPT = OPTional single path. LOOP = repeat."
  },
  {
    id: 7, scenario: "Show an object being created during the sequence.", category: "sequence",
    codeSnippet: 'create Order\nUser -> Order: new Order()',
    question: "What keyword creates a new participant during a sequence?",
    correctAnswer: "create",
    options: ["create", "new", "spawn", "init"],
    hint: "It literally says what it does",
    explanation: "'create' shows a new object being instantiated at that point in the sequence.",
  },
  // Use Case diagrams
  {
    id: 8, scenario: "Building a use case diagram for a library system.", category: "usecase",
    codeSnippet: ':Librarian: --> (Issue Book)\n:Member: --> (Search Catalog)\n(Issue Book) ..> (Verify Member) : <<include>>',
    question: "What does <<include>> mean in use case diagrams?",
    correctAnswer: "The base use case ALWAYS includes the included use case",
    options: [
      "The base use case ALWAYS includes the included use case",
      "The included use case is optional",
      "They are the same use case",
      "It means inheritance"
    ],
    hint: "Include = MUST happen. Extend = CAN happen.",
    explanation: "<<include>> = mandatory sub-behavior. <<extend>> = optional/conditional behavior.",
    mnemonic: "Include = IN every time (mandatory). Extend = EXTRA sometimes (optional)."
  },
  {
    id: 9, scenario: "An admin can do everything a regular user can, plus more.", category: "usecase",
    codeSnippet: ":Admin: --|> :User:",
    question: "What does --|> between actors mean?",
    correctAnswer: "Actor generalization (Admin inherits User's use cases)",
    options: ["Actor generalization (Admin inherits User's use cases)", "Admin creates User", "Admin depends on User", "They are the same actor"],
    hint: "Same triangle as class inheritance — IS-A relationship",
    explanation: "--|> between actors means generalization. Admin IS-A User, so Admin can do everything User can.",
  },
  // Activity diagrams
  {
    id: 10, scenario: "Modeling a checkout process.", category: "activity",
    codeSnippet: "@startuml\nstart\n:Add items to cart;\nif (Cart empty?) then (yes)\n  :Show empty cart message;\n  stop\nelse (no)\n  :Proceed to checkout;\nendif\n:Enter payment;\nstop\n@enduml",
    question: "In PlantUML activity diagrams, how do you write an action?",
    correctAnswer: "Wrap it in colons: :Action;",
    options: ["Wrap it in colons: :Action;", "Use brackets: [Action]", "Use parentheses: (Action)", "Use asterisks: *Action*"],
    hint: "Colons on each side, semicolon at the end",
    explanation: ":Action; defines an action node. start/stop mark entry/exit. if/then/else for decisions.",
    mnemonic: ":Colon; = action in activity diagrams. Think of it as 'saying' the action."
  },
  // State diagrams
  {
    id: 11, scenario: "Modeling an order's lifecycle.", category: "state",
    codeSnippet: "@startuml\n[*] --> Pending\nPending --> Processing : payment received\nProcessing --> Shipped : items packed\nShipped --> Delivered : arrived\nDelivered --> [*]\n@enduml",
    question: "What does [*] represent in a PlantUML state diagram?",
    correctAnswer: "The initial or final pseudo-state",
    options: ["The initial or final pseudo-state", "A comment", "An error state", "A parallel state"],
    hint: "[*] at the top = start. [*] at the bottom = end.",
    explanation: "[*] represents start (when arrows go FROM it) or end (when arrows go TO it) pseudo-states.",
  },
  // Component diagrams
  {
    id: 12, scenario: "Documenting a microservices architecture.", category: "component",
    codeSnippet: "[Auth Service] --> [User DB]\n[API Gateway] --> [Auth Service]\n[API Gateway] --> [Order Service]",
    question: "In PlantUML, how do you define a component?",
    correctAnswer: "Square brackets: [Component Name]",
    options: ["Square brackets: [Component Name]", "Parentheses: (Component Name)", "Curly braces: {Component Name}", "Angle brackets: <Component Name>"],
    hint: "Components are BOXES — square brackets look like boxes",
    explanation: "[Component] defines a component. () = use case. {} = object. <> = stereotype.",
    mnemonic: "[Box] = component, (Oval) = use case, :Stick: = actor"
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

export const PlantUMLGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;
  const shuffledOptions = useMemo(() => shuffleArray(challenge?.options || []), [currentChallenge]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === challenge.correctAnswer) { playSound("success"); setScore(prev => prev + (showHint ? 15 : 25)); }
    else { playSound("error"); }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1); setSelectedAnswer(null); setShowResult(false); setShowHint(false);
    } else { setGameComplete(true); playSound("levelUp"); }
  };

  const catColors: Record<string, string> = {
    class: "bg-primary/10 text-primary", sequence: "bg-accent/10 text-accent-foreground",
    usecase: "bg-success/10 text-success", activity: "bg-warning/10 text-warning",
    state: "bg-secondary/10 text-secondary-foreground", component: "bg-destructive/10 text-destructive",
  };

  if (gameComplete) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">PlantUML Expert!</h2>
        <p className="text-muted-foreground mb-4">You scored {score} out of {challenges.length * 25}!</p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key PlantUML Syntax:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1 font-mono">
            <li>• <code>&lt;|--</code> Inheritance &nbsp; <code>*--</code> Composition &nbsp; <code>o--</code> Aggregation</li>
            <li>• <code>..|&gt;</code> Implementation &nbsp; <code>..&gt;</code> Dependency</li>
            <li>• <code>-&gt;</code> Sync call &nbsp; <code>--&gt;</code> Return &nbsp; <code>-&gt;&gt;</code> Async</li>
            <li>• <code>(UseCase)</code> &nbsp; <code>:Actor:</code> &nbsp; <code>[Component]</code></li>
            <li>• Visibility: <code>-</code>private <code>+</code>public <code>#</code>protected</li>
          </ul>
        </div>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          PlantUML Master — {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> Score: {score}</div>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${catColors[challenge.category]}`}>{challenge.category}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
        </div>

        {challenge.codeSnippet && (
          <div className="bg-card border rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground whitespace-pre-wrap">{challenge.codeSnippet}</pre>
          </div>
        )}

        <div className="bg-card border rounded-lg p-3">
          <p className="text-foreground font-medium text-sm">{challenge.question}</p>
        </div>

        {!showHint && !showResult && (
          <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
            <Lightbulb className="w-4 h-4" /> Hint (-10 pts)
          </Button>
        )}
        {showHint && !showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">💡 {challenge.hint}</motion.div>
        )}

        <div className="grid gap-3">
          {shuffledOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOpt = option === challenge.correctAnswer;
            return (
              <motion.button key={option} whileHover={{ scale: showResult ? 1 : 1.02 }} whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)} disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all text-sm ${
                  showResult ? isCorrectOpt ? "bg-green-500/20 border-green-500" : isSelected ? "bg-red-500/20 border-red-500" : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOpt && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              <p className="font-bold mb-2">{isCorrect ? "🎯 Correct!" : "❌ Not quite!"}</p>
              <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
              {challenge.mnemonic && <p className="text-sm font-medium text-primary mt-2">🧠 Mnemonic: {challenge.mnemonic}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && (
          <Button onClick={handleNext} className="w-full">
            {currentChallenge < challenges.length - 1 ? "Next Challenge" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlantUMLGame;
