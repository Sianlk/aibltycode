import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Table, Star, Lightbulb } from "lucide-react";

interface ExcelChallenge {
  id: number;
  scenario: string;
  cellData?: string[][];
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "formulas" | "functions" | "advanced";
}

const challenges: ExcelChallenge[] = [
  // Basic Formulas
  {
    id: 1,
    scenario: "Cell A1=10, A2=20. What formula in A3 adds them together?",
    cellData: [["10"], ["20"], ["?"]],
    correctAnswer: "=A1+A2",
    options: ["=A1+A2", "=SUM(A1,A2)", "=ADD(A1:A2)", "A1+A2"],
    hint: "Use the = sign to start a formula, then reference cells",
    explanation: "=A1+A2 adds the values. =SUM(A1:A2) also works! But formulas MUST start with =",
    category: "formulas"
  },
  {
    id: 2,
    scenario: "You need to multiply B1 by B2 and divide by B3. What formula?",
    correctAnswer: "=B1*B2/B3",
    options: ["=B1*B2/B3", "=MULTIPLY(B1,B2)/B3", "=B1xB2/B3", "B1*B2/B3"],
    hint: "Use * for multiply, / for divide",
    explanation: "=B1*B2/B3 follows order of operations. * is multiplication in Excel, not x!",
    category: "formulas"
  },
  // Functions
  {
    id: 3,
    scenario: "Sum all values from A1 to A100. What's the most efficient formula?",
    correctAnswer: "=SUM(A1:A100)",
    options: ["=SUM(A1:A100)", "=A1+A2+A3+...+A100", "=TOTAL(A1:A100)", "=ADD(A1:A100)"],
    hint: "SUM is the function for adding ranges",
    explanation: "=SUM(A1:A100) adds all 100 cells! The colon (:) means 'through' - A1 through A100.",
    category: "functions"
  },
  {
    id: 4,
    scenario: "Find the average of cells C1 to C10. Which function?",
    correctAnswer: "=AVERAGE(C1:C10)",
    options: ["=AVERAGE(C1:C10)", "=AVG(C1:C10)", "=MEAN(C1:C10)", "=SUM(C1:C10)/10"],
    hint: "The function is spelled out fully",
    explanation: "=AVERAGE(C1:C10) calculates the mean. Note: AVG doesn't exist in Excel!",
    category: "functions"
  },
  {
    id: 5,
    scenario: "Count how many cells in D1:D50 contain numbers. Which function?",
    correctAnswer: "=COUNT(D1:D50)",
    options: ["=COUNT(D1:D50)", "=COUNTA(D1:D50)", "=COUNTNUM(D1:D50)", "=LEN(D1:D50)"],
    hint: "COUNT counts numbers, COUNTA counts non-empty cells",
    explanation: "COUNT counts numeric values only. COUNTA counts ALL non-empty cells including text!",
    category: "functions"
  },
  {
    id: 6,
    scenario: "Find the highest value in range E1:E100. Which function?",
    correctAnswer: "=MAX(E1:E100)",
    options: ["=MAX(E1:E100)", "=HIGHEST(E1:E100)", "=TOP(E1:E100)", "=LARGE(E1:E100)"],
    hint: "Think 'maximum'",
    explanation: "=MAX finds the largest value. MIN finds the smallest. LARGE(range,n) finds nth largest.",
    category: "functions"
  },
  // Advanced Functions
  {
    id: 7,
    scenario: "If A1>100, show 'High', otherwise show 'Low'. Which formula?",
    correctAnswer: '=IF(A1>100,"High","Low")',
    options: ['=IF(A1>100,"High","Low")', '=WHEN(A1>100,"High","Low")', '=CHECK(A1>100,"High","Low")', 'IF A1>100 THEN "High"'],
    hint: "IF(condition, value_if_true, value_if_false)",
    explanation: "IF is Excel's decision maker! Syntax: IF(test, true_result, false_result)",
    category: "advanced"
  },
  {
    id: 8,
    scenario: "Look up a value in column A and return matching value from column B. Which function?",
    correctAnswer: "=VLOOKUP(value,A:B,2,FALSE)",
    options: ["=VLOOKUP(value,A:B,2,FALSE)", "=SEARCH(value,A:B)", "=FIND(value,A,B)", "=LOOKUP(value,A:B)"],
    hint: "V stands for Vertical lookup",
    explanation: "VLOOKUP searches vertically. Arguments: lookup_value, table, column_index, exact_match(FALSE)",
    category: "advanced"
  },
  {
    id: 9,
    scenario: "Combine text from A1 ('Hello') and B1 ('World') with a space. Which formula?",
    correctAnswer: '=A1&" "&B1',
    options: ['=A1&" "&B1', '=CONCAT(A1," ",B1)', '=A1+" "+B1', '=JOIN(A1,B1)'],
    hint: "& is the text concatenation operator",
    explanation: '& joins text. =A1&" "&B1 gives "Hello World". CONCAT and CONCATENATE also work!',
    category: "advanced"
  },
  {
    id: 10,
    scenario: "Count cells in A1:A100 that contain the text 'Sales'. Which function?",
    correctAnswer: '=COUNTIF(A1:A100,"Sales")',
    options: ['=COUNTIF(A1:A100,"Sales")', '=COUNT(A1:A100,"Sales")', '=COUNTTEXT(A1:A100,"Sales")', '=FIND("Sales",A1:A100)'],
    hint: "COUNT + IF = COUNTIF for conditional counting",
    explanation: "COUNTIF counts cells matching a condition. SUMIF adds values matching a condition!",
    category: "advanced"
  },
  {
    id: 11,
    scenario: "Sum values in B1:B100 where corresponding A1:A100 = 'Region1'. Which function?",
    correctAnswer: '=SUMIF(A1:A100,"Region1",B1:B100)',
    options: ['=SUMIF(A1:A100,"Region1",B1:B100)', '=SUM(A1:A100="Region1",B1:B100)', '=SUMWHEN(A1:A100,"Region1",B1:B100)', '=SUM(IF(A="Region1",B))'],
    hint: "SUMIF has three arguments: range, criteria, sum_range",
    explanation: "SUMIF(criteria_range, criteria, sum_range) - adds B values where A equals 'Region1'",
    category: "advanced"
  },
  {
    id: 12,
    scenario: "What does the $ symbol do in $A$1?",
    correctAnswer: "Makes the reference absolute (doesn't change when copied)",
    options: [
      "Makes the reference absolute (doesn't change when copied)",
      "Multiplies the cell by currency",
      "Formats as currency",
      "Locks the cell from editing"
    ],
    hint: "Think about what happens when you copy a formula",
    explanation: "$A$1 is absolute - won't change when copied. A1 is relative - changes with position!",
    category: "advanced"
  },
];

export const ExcelMasterGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

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

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Excel Master!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points out of {challenges.length * 25}!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key Excel Tips:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• All formulas start with = sign</li>
            <li>• SUM, AVERAGE, COUNT, MAX, MIN are essential</li>
            <li>• IF for decisions, VLOOKUP for searching</li>
            <li>• $ makes references absolute</li>
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
          <Table className="w-6 h-6 text-primary" />
          Excel Master - Challenge {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Score: {score}
          </div>
          <span className="px-2 py-0.5 bg-primary/10 rounded text-xs capitalize">{challenge.category}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
        </div>

        {/* Cell Visualization if present */}
        {challenge.cellData && (
          <div className="flex justify-center">
            <div className="bg-card border rounded overflow-hidden">
              <div className="grid grid-cols-1 divide-y">
                {challenge.cellData.map((row, i) => (
                  <div key={i} className="flex">
                    <div className="w-8 bg-muted text-center text-xs py-2 border-r">A{i + 1}</div>
                    <div className={`w-20 text-center py-2 font-mono ${row[0] === '?' ? 'text-primary font-bold' : ''}`}>
                      {row[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
            const isCorrectOption = option === challenge.correctAnswer;
            
            return (
              <motion.button
                key={option}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all font-mono text-sm ${
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
                  <span>{option}</span>
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

export default ExcelMasterGame;