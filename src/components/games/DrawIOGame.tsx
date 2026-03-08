import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Lightbulb, Star, PenTool } from "lucide-react";

interface DiagramChallenge {
  id: number;
  scenario: string;
  diagramType: string;
  elements: { label: string; type: "shape" | "connector" | "text"; color: string }[];
  question: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  mnemonic?: string;
  category: "flowcharts" | "uml" | "erd" | "network" | "plantuml";
}

const challenges: DiagramChallenge[] = [
  // Flowcharts
  {
    id: 1, scenario: "You're designing a login process for a website.", diagramType: "Flowchart",
    elements: [
      { label: "Start", type: "shape", color: "bg-green-500/20" },
      { label: "Enter Credentials", type: "shape", color: "bg-primary/20" },
      { label: "Valid?", type: "shape", color: "bg-yellow-500/20" },
      { label: "Dashboard", type: "shape", color: "bg-green-500/20" },
      { label: "Error Message", type: "shape", color: "bg-red-500/20" },
    ],
    question: "What shape represents a decision in a flowchart?",
    correctAnswer: "Diamond (rhombus)",
    options: ["Diamond (rhombus)", "Rectangle", "Circle", "Parallelogram"],
    hint: "Think: decisions have sharp points — they can go either way",
    explanation: "Diamonds represent decisions/branches. Rectangles = processes. Ovals = start/end. Parallelograms = input/output.",
    mnemonic: "D.R.O.P — Diamond=Decision, Rectangle=Operation, Oval=Port (start/end), Parallelogram=Put data in/out",
    category: "flowcharts"
  },
  {
    id: 2, scenario: "You need to show data input from a user.", diagramType: "Flowchart",
    elements: [
      { label: "User Input", type: "shape", color: "bg-accent/20" },
    ],
    question: "Which flowchart shape represents input/output?",
    correctAnswer: "Parallelogram",
    options: ["Parallelogram", "Rectangle", "Diamond", "Hexagon"],
    hint: "It's a tilted rectangle — data flows in at an angle",
    explanation: "Parallelograms represent data input (keyboard, scanner) or output (screen, printer).",
    mnemonic: "Para-IN-ogram — PARALLELogram for data going IN and out",
    category: "flowcharts"
  },
  {
    id: 3, scenario: "You're documenting a process that repeats until a condition is met.", diagramType: "Flowchart",
    elements: [
      { label: "Process", type: "shape", color: "bg-primary/20" },
      { label: "Condition Met?", type: "shape", color: "bg-yellow-500/20" },
    ],
    question: "How do you represent a loop in a flowchart?",
    correctAnswer: "An arrow going back from a decision diamond to an earlier step",
    options: [
      "An arrow going back from a decision diamond to an earlier step",
      "A circular shape",
      "A dotted line",
      "A special loop symbol"
    ],
    hint: "Loops go BACK — the arrow returns to repeat",
    explanation: "Loops use a decision diamond with a 'No' path that loops back to an earlier process step.",
    category: "flowcharts"
  },
  // UML
  {
    id: 4, scenario: "You're designing a class diagram for a school system.", diagramType: "UML Class Diagram",
    elements: [
      { label: "Student", type: "shape", color: "bg-primary/20" },
      { label: "Teacher", type: "shape", color: "bg-accent/20" },
      { label: "Course", type: "shape", color: "bg-success/20" },
    ],
    question: "In UML, what does a solid arrow with an empty triangle head represent?",
    correctAnswer: "Inheritance (generalization)",
    options: ["Inheritance (generalization)", "Association", "Dependency", "Composition"],
    hint: "Think: the triangle POINTS to the parent — children inherit from parents",
    explanation: "Solid line + empty triangle = inheritance. Solid line = association. Dashed = dependency. Filled diamond = composition.",
    mnemonic: "I.A.D.C — Inherit=triangle Arrow, Associate=plain line, Depend=Dashed, Compose=filled Diamond on Container",
    category: "uml"
  },
  {
    id: 5, scenario: "A Student HAS a collection of Grades.", diagramType: "UML Class Diagram",
    elements: [
      { label: "Student", type: "shape", color: "bg-primary/20" },
      { label: "Grade", type: "shape", color: "bg-warning/20" },
    ],
    question: "What UML relationship means 'contains and OWNS' (parts can't exist without the whole)?",
    correctAnswer: "Composition (filled diamond)",
    options: ["Composition (filled diamond)", "Aggregation (empty diamond)", "Association (plain line)", "Dependency (dashed line)"],
    hint: "Filled = strong ownership. Empty = weak ownership.",
    explanation: "Composition (♦) = strong ownership, parts die with the whole. Aggregation (◇) = shared, parts can exist independently.",
    mnemonic: "Filled diamond = FULL ownership (composition). Empty diamond = EMPTY, parts can leave (aggregation).",
    category: "uml"
  },
  {
    id: 6, scenario: "You're creating a sequence diagram for an online purchase.", diagramType: "UML Sequence Diagram",
    elements: [
      { label: "Customer", type: "shape", color: "bg-primary/20" },
      { label: "Cart", type: "shape", color: "bg-accent/20" },
      { label: "Payment", type: "shape", color: "bg-success/20" },
    ],
    question: "What does a dashed arrow represent in a sequence diagram?",
    correctAnswer: "A return/response message",
    options: ["A return/response message", "A new object creation", "A synchronous call", "An actor"],
    hint: "Solid = request going OUT. Dashed = response coming BACK.",
    explanation: "Solid arrows = synchronous calls. Dashed arrows = return messages. Vertical bars = activation (processing time).",
    category: "uml"
  },
  // PlantUML
  {
    id: 7, scenario: "You want to write diagrams as code using PlantUML.", diagramType: "PlantUML",
    elements: [
      { label: "@startuml", type: "text", color: "bg-primary/20" },
      { label: "class Student", type: "text", color: "bg-accent/20" },
      { label: "@enduml", type: "text", color: "bg-primary/20" },
    ],
    question: "What is the correct PlantUML syntax to show Student inherits from Person?",
    correctAnswer: "Person <|-- Student",
    options: ["Person <|-- Student", "Student -> Person", "Student extends Person", "Person #-- Student"],
    hint: "The triangle points to the parent. |-- looks like a triangle on its side.",
    explanation: "<|-- represents inheritance in PlantUML. The triangle (<|) points to the parent class.",
    mnemonic: "Triangle-to-Parent: <|-- (triangle points LEFT to parent)",
    category: "plantuml"
  },
  {
    id: 8, scenario: "You need to write a PlantUML use case diagram.", diagramType: "PlantUML",
    elements: [
      { label: "actor User", type: "text", color: "bg-primary/20" },
      { label: "(Login)", type: "text", color: "bg-accent/20" },
    ],
    question: "In PlantUML, how do you define a use case?",
    correctAnswer: "Wrap it in parentheses: (Login)",
    options: ["Wrap it in parentheses: (Login)", "Use square brackets: [Login]", "Use curly braces: {Login}", "Use angle brackets: <Login>"],
    hint: "Use cases are ovals — parentheses () look like ovals!",
    explanation: "In PlantUML: (UseCase) for use cases, :Actor: for actors, [Component] for components.",
    mnemonic: "(Oval) = use case, :Stick figure: = actor, [Box] = component",
    category: "plantuml"
  },
  {
    id: 9, scenario: "You're drawing a PlantUML sequence diagram.", diagramType: "PlantUML",
    elements: [
      { label: "Alice -> Bob: Hello", type: "text", color: "bg-primary/20" },
      { label: "Bob --> Alice: Hi", type: "text", color: "bg-accent/20" },
    ],
    question: "In PlantUML sequence diagrams, what does --> (dashed arrow) represent?",
    correctAnswer: "A return/response message",
    options: ["A return/response message", "An asynchronous call", "Object creation", "A self-call"],
    hint: "Same as UML: dashed = response coming back",
    explanation: "-> is a solid arrow (call/request). --> is a dashed arrow (return/response). ->> is asynchronous.",
    category: "plantuml"
  },
  // ERD in Draw.io
  {
    id: 10, scenario: "You're building an ERD in Draw.io for an e-commerce system.", diagramType: "ERD (Draw.io)",
    elements: [
      { label: "Customer", type: "shape", color: "bg-primary/20" },
      { label: "Order", type: "shape", color: "bg-accent/20" },
      { label: "Product", type: "shape", color: "bg-success/20" },
    ],
    question: "In Draw.io, what shape palette should you use for ERDs?",
    correctAnswer: "The Entity Relation shape library",
    options: ["The Entity Relation shape library", "The Flowchart library", "The Network library", "The Mockup library"],
    hint: "Draw.io has a dedicated library for database diagrams",
    explanation: "Draw.io (diagrams.net) has dedicated ER shape libraries with entities, attributes, and relationship connectors built in.",
    category: "erd"
  },
  {
    id: 11, scenario: "You need to show a many-to-many relationship between Students and Courses.", diagramType: "ERD",
    elements: [
      { label: "Student", type: "shape", color: "bg-primary/20" },
      { label: "Enrollment", type: "shape", color: "bg-warning/20" },
      { label: "Course", type: "shape", color: "bg-success/20" },
    ],
    question: "How do you resolve a many-to-many relationship in an ERD?",
    correctAnswer: "Create a junction/bridge table between them",
    options: ["Create a junction/bridge table between them", "Add a foreign key directly", "Use a self-referencing table", "It can't be done"],
    hint: "You need a table 'in the middle' that connects both sides",
    explanation: "Junction tables (like Enrollment) break M:N into two 1:N relationships, each with foreign keys to both parent tables.",
    mnemonic: "M:N = Must Need a bridge table",
    category: "erd"
  },
  // Network diagrams
  {
    id: 12, scenario: "You're documenting a company's network topology.", diagramType: "Network Diagram",
    elements: [
      { label: "Router", type: "shape", color: "bg-primary/20" },
      { label: "Switch", type: "shape", color: "bg-accent/20" },
      { label: "Server", type: "shape", color: "bg-success/20" },
      { label: "Firewall", type: "shape", color: "bg-warning/20" },
    ],
    question: "In a network diagram, what connects different networks together?",
    correctAnswer: "Router",
    options: ["Router", "Switch", "Hub", "Access Point"],
    hint: "It ROUTES traffic between networks — it's in the name!",
    explanation: "Routers connect different networks and route packets between them. Switches connect devices within the same network.",
    mnemonic: "Router = Routes between networks. Switch = Switches within a network.",
    category: "network"
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const DrawIOGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

  const shuffledOptions = useMemo(
    () => shuffleArray(challenge?.options || []),
    [currentChallenge]
  );

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(prev => prev + (showHint ? 15 : 25));
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const categoryColors: Record<string, string> = {
    flowcharts: "bg-primary/10 text-primary",
    uml: "bg-accent/10 text-accent",
    erd: "bg-success/10 text-success",
    network: "bg-warning/10 text-warning",
    plantuml: "bg-secondary/10 text-secondary-foreground",
  };

  if (gameComplete) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
        <div className="text-6xl mb-4">📐</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Diagram Master!</h2>
        <p className="text-muted-foreground mb-4">You scored {score} out of {challenges.length * 25}!</p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key Mnemonics:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• <strong>D.R.O.P</strong> — Diamond=Decision, Rectangle=Operation, Oval=Port, Parallelogram=data</li>
            <li>• <strong>I.A.D.C</strong> — Inherit=▷, Associate=—, Depend=---, Compose=♦</li>
            <li>• <strong>PlantUML</strong>: (oval)=use case, :stick:=actor, [box]=component</li>
            <li>• <strong>M:N = Must Need</strong> a bridge table</li>
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
          <PenTool className="w-6 h-6 text-primary" />
          Diagram Master — {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> Score: {score}</div>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${categoryColors[challenge.category]}`}>{challenge.category}</span>
          <span className="text-xs text-muted-foreground">{challenge.diagramType}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
        </div>

        {/* Diagram Elements Preview */}
        <div className="flex flex-wrap gap-2 justify-center">
          {challenge.elements.map((el, i) => (
            <div key={i} className={`px-3 py-2 rounded-lg border text-sm font-mono ${el.color}`}>
              {el.type === "shape" ? `[${el.label}]` : el.label}
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-lg p-3">
          <p className="text-foreground font-medium text-sm">{challenge.question}</p>
        </div>

        {!showHint && !showResult && (
          <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
            <Lightbulb className="w-4 h-4" /> Need a hint? (-10 points)
          </Button>
        )}

        {showHint && !showResult && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
            💡 {challenge.hint}
          </motion.div>
        )}

        <div className="grid gap-3">
          {shuffledOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === challenge.correctAnswer;
            return (
              <motion.button key={option} whileHover={{ scale: showResult ? 1 : 1.02 }} whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)} disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all text-sm ${
                  showResult ? isCorrectOption ? "bg-green-500/20 border-green-500" : isSelected ? "bg-red-500/20 border-red-500" : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
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
              {challenge.mnemonic && (
                <p className="text-sm font-medium text-primary mt-2">🧠 Mnemonic: {challenge.mnemonic}</p>
              )}
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

export default DrawIOGame;
