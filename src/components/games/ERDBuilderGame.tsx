import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Database, ArrowRight, Star, Lightbulb } from "lucide-react";

interface ERDChallenge {
  id: number;
  scenario: string;
  entities: string[];
  correctRelationship: string;
  options: string[];
  hint: string;
  explanation: string;
}

const challenges: ERDChallenge[] = [
  {
    id: 1,
    scenario: "A Customer can place many Orders, but each Order belongs to one Customer.",
    entities: ["Customer", "Order"],
    correctRelationship: "1:M (One-to-Many)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "Think: Can ONE customer have MANY orders?",
    explanation: "One Customer → Many Orders. The 'many' side (Order) holds the foreign key!"
  },
  {
    id: 2,
    scenario: "Each Student can enroll in multiple Courses, and each Course can have multiple Students.",
    entities: ["Student", "Course"],
    correctRelationship: "M:N (Many-to-Many)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "Can multiple students be in one course? Can one student take multiple courses?",
    explanation: "Many-to-Many needs a junction table: 'Enrollment' with StudentID and CourseID!"
  },
  {
    id: 3,
    scenario: "Each Employee has exactly one Employee Profile, and each Profile belongs to exactly one Employee.",
    entities: ["Employee", "Profile"],
    correctRelationship: "1:1 (One-to-One)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "Is it exactly one on BOTH sides?",
    explanation: "One-to-One relationship. Often used to split large tables or for optional data!"
  },
  {
    id: 4,
    scenario: "A Department has many Employees, but each Employee works in only one Department.",
    entities: ["Department", "Employee"],
    correctRelationship: "1:M (One-to-Many)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "Which side has 'many'?",
    explanation: "Department (1) → Employee (Many). Employee table has DepartmentID foreign key!"
  },
  {
    id: 5,
    scenario: "An Author can write many Books, and a Book can have multiple Authors.",
    entities: ["Author", "Book"],
    correctRelationship: "M:N (Many-to-Many)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "Co-authored books exist! Can authors write multiple books?",
    explanation: "Many-to-Many! Create 'AuthorBook' junction table with AuthorID and BookID!"
  },
  {
    id: 6,
    scenario: "Each Order contains many Order Lines (products), but each Order Line belongs to exactly one Order.",
    entities: ["Order", "OrderLine"],
    correctRelationship: "1:M (One-to-Many)",
    options: ["1:1 (One-to-One)", "1:M (One-to-Many)", "M:N (Many-to-Many)"],
    hint: "OrderLine is a WEAK entity - depends on Order!",
    explanation: "OrderLine can't exist without Order. It's a weak entity (double rectangle in ERD)!"
  },
];

export const ERDBuilderGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctRelationship;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === challenge.correctRelationship) {
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

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">ERD Master!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key Memory Tips:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• 1:M = Foreign key on the "Many" side</li>
            <li>• M:N = Needs a junction table</li>
            <li>• Crow's foot 🦶 = Many</li>
            <li>• Weak entity = Double rectangle</li>
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
          <Database className="w-6 h-6 text-primary" />
          ERD Builder - Challenge {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          Score: {score}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
        </div>

        {/* Entities Visualization */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-primary/20 px-4 py-2 rounded-lg font-bold text-primary border-2 border-primary">
            {challenge.entities[0]}
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="bg-secondary/50 px-4 py-2 rounded-lg font-bold text-secondary-foreground">
            ?
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="bg-primary/20 px-4 py-2 rounded-lg font-bold text-primary border-2 border-primary">
            {challenge.entities[1]}
          </div>
        </div>

        {/* Hint Button */}
        {!showHint && !showResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(true)}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Need a hint? (-10 points)
          </Button>
        )}

        {showHint && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
          >
            💡 {challenge.hint}
          </motion.div>
        )}

        {/* Options */}
        <div className="grid gap-3">
          {challenge.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === challenge.correctRelationship;
            
            return (
              <motion.button
                key={option}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? isCorrectOption
                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                      : isSelected
                      ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                      : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Result & Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
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
          <Button onClick={handleNext} className="w-full">
            {currentChallenge < challenges.length - 1 ? "Next Challenge" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ERDBuilderGame;
