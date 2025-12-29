import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Database, Star, Lightbulb } from "lucide-react";

interface SQLChallenge {
  id: number;
  scenario: string;
  tableSchema?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "select" | "filter" | "join" | "aggregate" | "modify";
}

const challenges: SQLChallenge[] = [
  // Basic SELECT
  {
    id: 1,
    scenario: "Select all columns from the 'employees' table.",
    tableSchema: "employees(id, name, department, salary)",
    correctAnswer: "SELECT * FROM employees",
    options: ["SELECT * FROM employees", "GET ALL FROM employees", "SELECT ALL employees", "SHOW employees"],
    hint: "* means 'all columns'",
    explanation: "SELECT * FROM table_name retrieves all columns. * is the wildcard for 'everything'!",
    category: "select"
  },
  {
    id: 2,
    scenario: "Select only the 'name' and 'salary' columns from employees.",
    tableSchema: "employees(id, name, department, salary)",
    correctAnswer: "SELECT name, salary FROM employees",
    options: ["SELECT name, salary FROM employees", "SELECT (name, salary) FROM employees", "GET name, salary FROM employees", "SELECT name AND salary FROM employees"],
    hint: "List column names separated by commas",
    explanation: "SELECT col1, col2 FROM table - no parentheses needed, columns separated by commas.",
    category: "select"
  },
  // WHERE Filtering
  {
    id: 3,
    scenario: "Select employees with salary greater than 50000.",
    tableSchema: "employees(id, name, department, salary)",
    correctAnswer: "SELECT * FROM employees WHERE salary > 50000",
    options: ["SELECT * FROM employees WHERE salary > 50000", "SELECT * FROM employees IF salary > 50000", "SELECT * FROM employees WHEN salary > 50000", "SELECT * FROM employees HAVING salary > 50000"],
    hint: "Use WHERE for filtering rows",
    explanation: "WHERE filters rows before results. HAVING is used after GROUP BY for aggregates.",
    category: "filter"
  },
  {
    id: 4,
    scenario: "Find employees in 'Sales' department OR 'Marketing' department.",
    tableSchema: "employees(id, name, department, salary)",
    correctAnswer: "SELECT * FROM employees WHERE department = 'Sales' OR department = 'Marketing'",
    options: [
      "SELECT * FROM employees WHERE department = 'Sales' OR department = 'Marketing'",
      "SELECT * FROM employees WHERE department = 'Sales' AND department = 'Marketing'",
      "SELECT * FROM employees WHERE department IN 'Sales', 'Marketing'",
      "SELECT * FROM employees IF department = 'Sales' | 'Marketing'"
    ],
    hint: "OR means either condition can be true",
    explanation: "OR returns rows matching either condition. AND requires BOTH to be true. IN('Sales','Marketing') also works!",
    category: "filter"
  },
  {
    id: 5,
    scenario: "Find employees whose name starts with 'J'.",
    correctAnswer: "SELECT * FROM employees WHERE name LIKE 'J%'",
    options: ["SELECT * FROM employees WHERE name LIKE 'J%'", "SELECT * FROM employees WHERE name STARTS 'J'", "SELECT * FROM employees WHERE name = 'J*'", "SELECT * FROM employees WHERE LEFT(name,1) = 'J'"],
    hint: "LIKE with % as wildcard for pattern matching",
    explanation: "LIKE 'J%' matches anything starting with J. % means 'any characters'. _ means 'one character'.",
    category: "filter"
  },
  // Aggregate Functions
  {
    id: 6,
    scenario: "Count the total number of employees.",
    tableSchema: "employees(id, name, department, salary)",
    correctAnswer: "SELECT COUNT(*) FROM employees",
    options: ["SELECT COUNT(*) FROM employees", "SELECT TOTAL(*) FROM employees", "SELECT NUM(*) FROM employees", "COUNT employees"],
    hint: "COUNT is the aggregate function",
    explanation: "COUNT(*) counts all rows. COUNT(column) counts non-null values in that column.",
    category: "aggregate"
  },
  {
    id: 7,
    scenario: "Find the average salary of all employees.",
    correctAnswer: "SELECT AVG(salary) FROM employees",
    options: ["SELECT AVG(salary) FROM employees", "SELECT AVERAGE(salary) FROM employees", "SELECT MEAN(salary) FROM employees", "SELECT SUM(salary)/COUNT(*) FROM employees"],
    hint: "AVG is the aggregate function for average",
    explanation: "AVG(column) calculates the mean. SUM()/COUNT() would also work but AVG is cleaner!",
    category: "aggregate"
  },
  {
    id: 8,
    scenario: "Find the total salary by department (show department and total).",
    correctAnswer: "SELECT department, SUM(salary) FROM employees GROUP BY department",
    options: [
      "SELECT department, SUM(salary) FROM employees GROUP BY department",
      "SELECT department, SUM(salary) FROM employees",
      "SELECT SUM(salary) FROM employees BY department",
      "SELECT department, TOTAL(salary) FROM employees GROUP department"
    ],
    hint: "GROUP BY groups rows for aggregate calculations",
    explanation: "GROUP BY creates groups - SUM(salary) is calculated per group. Every non-aggregate column must be in GROUP BY!",
    category: "aggregate"
  },
  // JOINs
  {
    id: 9,
    scenario: "Join employees with departments table on department_id.",
    tableSchema: "employees(id, name, department_id) + departments(id, dept_name)",
    correctAnswer: "SELECT * FROM employees JOIN departments ON employees.department_id = departments.id",
    options: [
      "SELECT * FROM employees JOIN departments ON employees.department_id = departments.id",
      "SELECT * FROM employees, departments WHERE department_id = id",
      "SELECT * FROM employees MERGE departments",
      "SELECT * FROM employees + departments"
    ],
    hint: "JOIN ... ON specifies how tables connect",
    explanation: "JOIN combines tables. ON specifies the matching condition. This is an INNER JOIN by default.",
    category: "join"
  },
  {
    id: 10,
    scenario: "Get all employees, including those without a department (NULL department_id).",
    correctAnswer: "SELECT * FROM employees LEFT JOIN departments ON employees.department_id = departments.id",
    options: [
      "SELECT * FROM employees LEFT JOIN departments ON employees.department_id = departments.id",
      "SELECT * FROM employees JOIN departments ON employees.department_id = departments.id",
      "SELECT * FROM employees RIGHT JOIN departments ON employees.department_id = departments.id",
      "SELECT * FROM employees OUTER departments"
    ],
    hint: "LEFT JOIN keeps all rows from the left table",
    explanation: "LEFT JOIN keeps ALL left table rows, even without matches. INNER JOIN only keeps matches!",
    category: "join"
  },
  // Data Modification
  {
    id: 11,
    scenario: "Insert a new employee: John, Sales, 55000.",
    correctAnswer: "INSERT INTO employees (name, department, salary) VALUES ('John', 'Sales', 55000)",
    options: [
      "INSERT INTO employees (name, department, salary) VALUES ('John', 'Sales', 55000)",
      "ADD TO employees VALUES ('John', 'Sales', 55000)",
      "INSERT employees SET name='John', department='Sales', salary=55000",
      "CREATE employees ('John', 'Sales', 55000)"
    ],
    hint: "INSERT INTO ... VALUES for adding rows",
    explanation: "INSERT INTO table (columns) VALUES (values) - column order must match value order!",
    category: "modify"
  },
  {
    id: 12,
    scenario: "Give everyone in Sales a 10% raise.",
    correctAnswer: "UPDATE employees SET salary = salary * 1.1 WHERE department = 'Sales'",
    options: [
      "UPDATE employees SET salary = salary * 1.1 WHERE department = 'Sales'",
      "MODIFY employees salary * 1.1 WHERE department = 'Sales'",
      "CHANGE employees SET salary + 10% WHERE department = 'Sales'",
      "UPDATE employees salary = salary * 1.1 IF department = 'Sales'"
    ],
    hint: "UPDATE ... SET ... WHERE for modifying existing rows",
    explanation: "UPDATE table SET column = value WHERE condition. Without WHERE, ALL rows get updated!",
    category: "modify"
  },
  {
    id: 13,
    scenario: "Delete all employees from the 'Temp' department.",
    correctAnswer: "DELETE FROM employees WHERE department = 'Temp'",
    options: [
      "DELETE FROM employees WHERE department = 'Temp'",
      "REMOVE employees WHERE department = 'Temp'",
      "DROP employees WHERE department = 'Temp'",
      "DELETE employees IF department = 'Temp'"
    ],
    hint: "DELETE FROM ... WHERE for removing rows",
    explanation: "DELETE FROM table WHERE condition. Without WHERE, ALL rows are deleted! DROP deletes tables, not rows.",
    category: "modify"
  },
  // Sorting & Limiting
  {
    id: 14,
    scenario: "Get top 5 highest paid employees.",
    correctAnswer: "SELECT * FROM employees ORDER BY salary DESC LIMIT 5",
    options: [
      "SELECT * FROM employees ORDER BY salary DESC LIMIT 5",
      "SELECT TOP 5 * FROM employees ORDER BY salary",
      "SELECT * FROM employees SORT salary DESC LIMIT 5",
      "SELECT FIRST 5 * FROM employees ORDER BY salary DESC"
    ],
    hint: "ORDER BY sorts, LIMIT restricts count",
    explanation: "ORDER BY column DESC (descending) + LIMIT n. Note: TOP 5 is SQL Server syntax, not standard SQL.",
    category: "select"
  },
];

export const SQLQueryGame: React.FC = () => {
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
        <div className="text-6xl mb-4">🗄️</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">SQL Master!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points out of {challenges.length * 25}!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key SQL Commands:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• SELECT ... FROM ... WHERE (query)</li>
            <li>• JOIN ... ON (combine tables)</li>
            <li>• GROUP BY + aggregates (SUM, AVG, COUNT)</li>
            <li>• INSERT, UPDATE, DELETE (modify data)</li>
          </ul>
        </div>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </motion.div>
    );
  }

  const categoryColors: Record<string, string> = {
    select: "bg-blue-500/10 text-blue-600",
    filter: "bg-purple-500/10 text-purple-600",
    join: "bg-green-500/10 text-green-600",
    aggregate: "bg-orange-500/10 text-orange-600",
    modify: "bg-red-500/10 text-red-600",
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6 text-primary" />
          SQL Query Master - {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Score: {score}
          </div>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${categoryColors[challenge.category]}`}>
            {challenge.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
          {challenge.tableSchema && (
            <p className="text-sm text-muted-foreground mt-2 font-mono bg-background/50 p-2 rounded">
              📋 {challenge.tableSchema}
            </p>
          )}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="break-all">{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
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

export default SQLQueryGame;