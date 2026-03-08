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
  { id: 1, scenario: "Select all columns from the 'employees' table.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT * FROM employees", options: ["SELECT * FROM employees", "GET ALL FROM employees", "SELECT ALL employees", "SHOW employees"], hint: "* means 'all columns'", explanation: "SELECT * FROM table_name retrieves all columns. * is the wildcard for 'everything'!", category: "select" },
  { id: 2, scenario: "Select only the 'name' and 'salary' columns from employees.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT name, salary FROM employees", options: ["SELECT name, salary FROM employees", "SELECT (name, salary) FROM employees", "GET name, salary FROM employees", "SELECT name AND salary FROM employees"], hint: "List column names separated by commas", explanation: "SELECT col1, col2 FROM table - no parentheses needed, columns separated by commas.", category: "select" },
  { id: 3, scenario: "Select employees with salary greater than 50000.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT * FROM employees WHERE salary > 50000", options: ["SELECT * FROM employees WHERE salary > 50000", "SELECT * FROM employees IF salary > 50000", "SELECT * FROM employees WHEN salary > 50000", "SELECT * FROM employees HAVING salary > 50000"], hint: "Use WHERE for filtering rows", explanation: "WHERE filters rows before results. HAVING is used after GROUP BY for aggregates.", category: "filter" },
  { id: 4, scenario: "Find employees in 'Sales' department OR 'Marketing' department.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT * FROM employees WHERE department = 'Sales' OR department = 'Marketing'", options: ["SELECT * FROM employees WHERE department = 'Sales' OR department = 'Marketing'", "SELECT * FROM employees WHERE department = 'Sales' AND department = 'Marketing'", "SELECT * FROM employees WHERE department IN 'Sales', 'Marketing'", "SELECT * FROM employees IF department = 'Sales' | 'Marketing'"], hint: "OR means either condition can be true", explanation: "OR returns rows matching either condition. AND requires BOTH to be true. IN('Sales','Marketing') also works!", category: "filter" },
  { id: 5, scenario: "Find employees whose name starts with 'J'.", correctAnswer: "SELECT * FROM employees WHERE name LIKE 'J%'", options: ["SELECT * FROM employees WHERE name LIKE 'J%'", "SELECT * FROM employees WHERE name STARTS 'J'", "SELECT * FROM employees WHERE name = 'J*'", "SELECT * FROM employees WHERE LEFT(name,1) = 'J'"], hint: "LIKE with % as wildcard for pattern matching", explanation: "LIKE 'J%' matches anything starting with J. % means 'any characters'. _ means 'one character'.", category: "filter" },
  // Aggregates
  { id: 6, scenario: "Count the total number of employees.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT COUNT(*) FROM employees", options: ["SELECT COUNT(*) FROM employees", "SELECT TOTAL(*) FROM employees", "SELECT NUM(*) FROM employees", "COUNT employees"], hint: "COUNT is the aggregate function", explanation: "COUNT(*) counts all rows. COUNT(column) counts non-null values in that column.", category: "aggregate" },
  { id: 7, scenario: "Find the average salary of all employees.", correctAnswer: "SELECT AVG(salary) FROM employees", options: ["SELECT AVG(salary) FROM employees", "SELECT AVERAGE(salary) FROM employees", "SELECT MEAN(salary) FROM employees", "SELECT SUM(salary)/COUNT(*) FROM employees"], hint: "AVG is the aggregate function for average", explanation: "AVG(column) calculates the mean. SUM()/COUNT() would also work but AVG is cleaner!", category: "aggregate" },
  { id: 8, scenario: "Find the total salary by department (show department and total).", correctAnswer: "SELECT department, SUM(salary) FROM employees GROUP BY department", options: ["SELECT department, SUM(salary) FROM employees GROUP BY department", "SELECT department, SUM(salary) FROM employees", "SELECT SUM(salary) FROM employees BY department", "SELECT department, TOTAL(salary) FROM employees GROUP department"], hint: "GROUP BY groups rows for aggregate calculations", explanation: "GROUP BY creates groups - SUM(salary) is calculated per group. Every non-aggregate column must be in GROUP BY!", category: "aggregate" },
  // JOINs
  { id: 9, scenario: "Join employees with departments table on department_id.", tableSchema: "employees(id, name, department_id) + departments(id, dept_name)", correctAnswer: "SELECT * FROM employees JOIN departments ON employees.department_id = departments.id", options: ["SELECT * FROM employees JOIN departments ON employees.department_id = departments.id", "SELECT * FROM employees, departments WHERE department_id = id", "SELECT * FROM employees MERGE departments", "SELECT * FROM employees + departments"], hint: "JOIN ... ON specifies how tables connect", explanation: "JOIN combines tables. ON specifies the matching condition. This is an INNER JOIN by default.", category: "join" },
  { id: 10, scenario: "Get all employees, including those without a department (NULL department_id).", correctAnswer: "SELECT * FROM employees LEFT JOIN departments ON employees.department_id = departments.id", options: ["SELECT * FROM employees LEFT JOIN departments ON employees.department_id = departments.id", "SELECT * FROM employees JOIN departments ON employees.department_id = departments.id", "SELECT * FROM employees RIGHT JOIN departments ON employees.department_id = departments.id", "SELECT * FROM employees OUTER departments"], hint: "LEFT JOIN keeps all rows from the left table", explanation: "LEFT JOIN keeps ALL left table rows, even without matches. INNER JOIN only keeps matches!", category: "join" },
  // Data Modification
  { id: 11, scenario: "Insert a new employee: John, Sales, 55000.", correctAnswer: "INSERT INTO employees (name, department, salary) VALUES ('John', 'Sales', 55000)", options: ["INSERT INTO employees (name, department, salary) VALUES ('John', 'Sales', 55000)", "ADD TO employees VALUES ('John', 'Sales', 55000)", "INSERT employees SET name='John', department='Sales', salary=55000", "CREATE employees ('John', 'Sales', 55000)"], hint: "INSERT INTO ... VALUES for adding rows", explanation: "INSERT INTO table (columns) VALUES (values) - column order must match value order!", category: "modify" },
  { id: 12, scenario: "Give everyone in Sales a 10% raise.", correctAnswer: "UPDATE employees SET salary = salary * 1.1 WHERE department = 'Sales'", options: ["UPDATE employees SET salary = salary * 1.1 WHERE department = 'Sales'", "MODIFY employees salary * 1.1 WHERE department = 'Sales'", "CHANGE employees SET salary + 10% WHERE department = 'Sales'", "UPDATE employees salary = salary * 1.1 IF department = 'Sales'"], hint: "UPDATE ... SET ... WHERE for modifying existing rows", explanation: "UPDATE table SET column = value WHERE condition. Without WHERE, ALL rows get updated!", category: "modify" },
  { id: 13, scenario: "Delete all employees from the 'Temp' department.", correctAnswer: "DELETE FROM employees WHERE department = 'Temp'", options: ["DELETE FROM employees WHERE department = 'Temp'", "REMOVE employees WHERE department = 'Temp'", "DROP employees WHERE department = 'Temp'", "DELETE employees IF department = 'Temp'"], hint: "DELETE FROM ... WHERE for removing rows", explanation: "DELETE FROM table WHERE condition. Without WHERE, ALL rows are deleted! DROP deletes tables, not rows.", category: "modify" },
  { id: 14, scenario: "Get top 5 highest paid employees.", correctAnswer: "SELECT * FROM employees ORDER BY salary DESC LIMIT 5", options: ["SELECT * FROM employees ORDER BY salary DESC LIMIT 5", "SELECT TOP 5 * FROM employees ORDER BY salary", "SELECT * FROM employees SORT salary DESC LIMIT 5", "SELECT FIRST 5 * FROM employees ORDER BY salary DESC"], hint: "ORDER BY sorts, LIMIT restricts count", explanation: "ORDER BY column DESC (descending) + LIMIT n. Note: TOP 5 is SQL Server syntax, not standard SQL.", category: "select" },
  // === ADVANCED: Subqueries ===
  { id: 15, scenario: "Find employees who earn more than the average salary.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)", options: ["SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)", "SELECT * FROM employees WHERE salary > AVG(salary)", "SELECT * FROM employees HAVING salary > AVG(salary)", "SELECT * FROM employees WHERE salary > AVERAGE"], hint: "Use a subquery to calculate the average first", explanation: "Subqueries (nested queries) compute values inside parentheses. You can't use AVG() directly in WHERE!", category: "filter" },
  { id: 16, scenario: "Find departments that have more than 5 employees.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5", options: ["SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5", "SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 5 GROUP BY department", "SELECT department FROM employees GROUP BY department WHERE COUNT > 5", "SELECT department, COUNT(*) FROM employees HAVING COUNT(*) > 5"], hint: "HAVING filters after GROUP BY, WHERE filters before", explanation: "HAVING filters groups after aggregation. WHERE filters individual rows before grouping. Mnemonic: WHERE = rows, HAVING = groups!", category: "aggregate" },
  { id: 17, scenario: "Select unique department names from employees.", correctAnswer: "SELECT DISTINCT department FROM employees", options: ["SELECT DISTINCT department FROM employees", "SELECT UNIQUE department FROM employees", "SELECT department FROM employees UNIQUE", "SELECT DIFFERENT department FROM employees"], hint: "DISTINCT removes duplicate values", explanation: "DISTINCT returns only unique values. Without it, you'd see repeated department names!", category: "select" },
  // === JOINs Advanced ===
  { id: 18, scenario: "Show employee names with their manager's name using a self-join.", tableSchema: "employees(id, name, manager_id)", correctAnswer: "SELECT e.name, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id", options: ["SELECT e.name, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id", "SELECT name, manager FROM employees", "SELECT * FROM employees JOIN managers", "SELECT e.name FROM employees e, employees m"], hint: "A table can be joined with itself using aliases", explanation: "Self-joins use aliases (e, m) to reference the same table twice. Essential for hierarchical data like org charts!", category: "join" },
  { id: 19, scenario: "Get all departments and their employee count, including departments with 0 employees.", tableSchema: "departments(id, name) + employees(id, name, dept_id)", correctAnswer: "SELECT d.name, COUNT(e.id) FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.name", options: ["SELECT d.name, COUNT(e.id) FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.name", "SELECT d.name, COUNT(*) FROM departments d JOIN employees e ON d.id = e.dept_id GROUP BY d.name", "SELECT name, COUNT(*) FROM departments GROUP BY name", "SELECT departments.name, employees.count FROM departments, employees"], hint: "LEFT JOIN keeps all departments; COUNT(e.id) counts only matched employees", explanation: "LEFT JOIN ensures all departments appear. COUNT(e.id) returns 0 for unmatched departments, while COUNT(*) would return 1!", category: "join" },
  // === CREATE & ALTER ===
  { id: 20, scenario: "Create a new 'products' table with id, name, and price.", correctAnswer: "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2))", options: ["CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2))", "MAKE TABLE products (id, name, price)", "NEW TABLE products (id INT, name TEXT, price FLOAT)", "CREATE products TABLE (id, name, price)"], hint: "CREATE TABLE with column definitions and data types", explanation: "CREATE TABLE defines structure. PRIMARY KEY ensures uniqueness. DECIMAL(10,2) = 10 digits, 2 decimal places.", category: "modify" },
  { id: 21, scenario: "Add an 'email' column to the employees table.", correctAnswer: "ALTER TABLE employees ADD COLUMN email VARCHAR(255)", options: ["ALTER TABLE employees ADD COLUMN email VARCHAR(255)", "MODIFY TABLE employees ADD email", "UPDATE TABLE employees ADD email VARCHAR", "ADD email TO employees"], hint: "ALTER TABLE changes table structure", explanation: "ALTER TABLE modifies existing tables. ADD COLUMN adds new columns. You can also DROP COLUMN or MODIFY COLUMN.", category: "modify" },
  // === Window Functions ===
  { id: 22, scenario: "Rank employees by salary within each department.", tableSchema: "employees(id, name, department, salary)", correctAnswer: "SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees", options: ["SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees", "SELECT name, department, salary, RANK(salary) FROM employees GROUP BY department", "SELECT name, RANK() FROM employees ORDER BY salary", "SELECT name, department, RANKING(salary) FROM employees"], hint: "Window functions use OVER() with PARTITION BY", explanation: "RANK() OVER (PARTITION BY ... ORDER BY ...) ranks within groups without collapsing rows. Unlike GROUP BY, all rows are kept!", category: "aggregate" },
  { id: 23, scenario: "Calculate a running total of sales ordered by date.", tableSchema: "sales(id, amount, sale_date)", correctAnswer: "SELECT sale_date, amount, SUM(amount) OVER (ORDER BY sale_date) AS running_total FROM sales", options: ["SELECT sale_date, amount, SUM(amount) OVER (ORDER BY sale_date) AS running_total FROM sales", "SELECT sale_date, SUM(amount) FROM sales GROUP BY sale_date", "SELECT sale_date, RUNNING_SUM(amount) FROM sales", "SELECT sale_date, amount + LAG(amount) FROM sales"], hint: "SUM() with OVER() creates a running total", explanation: "Window SUM() OVER (ORDER BY ...) calculates cumulative totals row by row. No GROUP BY needed!", category: "aggregate" },
  // === CTEs & Subqueries ===
  { id: 24, scenario: "Use a CTE to find departments with above-average headcount.", correctAnswer: "WITH dept_counts AS (SELECT department, COUNT(*) AS cnt FROM employees GROUP BY department) SELECT * FROM dept_counts WHERE cnt > (SELECT AVG(cnt) FROM dept_counts)", options: ["WITH dept_counts AS (SELECT department, COUNT(*) AS cnt FROM employees GROUP BY department) SELECT * FROM dept_counts WHERE cnt > (SELECT AVG(cnt) FROM dept_counts)", "SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > AVG(COUNT(*))", "CTE dept_counts = SELECT department, COUNT(*) FROM employees", "WITH AS dept_counts (SELECT department FROM employees)"], hint: "WITH ... AS defines a Common Table Expression", explanation: "CTEs (WITH ... AS) create temporary named result sets. They improve readability and allow self-referencing!", category: "select" },
  { id: 25, scenario: "Find the second highest salary in the company.", correctAnswer: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)", options: ["SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)", "SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1", "SELECT SECOND(salary) FROM employees", "SELECT salary[2] FROM employees"], hint: "Find the max salary that is less than the overall max", explanation: "Nested subquery: inner query finds the max, outer finds the max below it. LIMIT 1 OFFSET 1 also works!", category: "filter" },
  // === Constraints & Indexes ===
  { id: 26, scenario: "Add a foreign key constraint linking orders to customers.", correctAnswer: "ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)", options: ["ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)", "ALTER TABLE orders ADD FOREIGN KEY customer_id = customers.id", "LINK orders.customer_id TO customers.id", "ADD REFERENCE orders(customer_id) -> customers(id)"], hint: "FOREIGN KEY ... REFERENCES links two tables", explanation: "Foreign keys enforce referential integrity. The child table's column must match a primary key in the parent table!", category: "modify" },
  { id: 27, scenario: "Create an index on the 'email' column for faster lookups.", correctAnswer: "CREATE INDEX idx_email ON employees(email)", options: ["CREATE INDEX idx_email ON employees(email)", "ADD INDEX email ON employees", "INDEX employees.email", "ALTER TABLE employees INDEX email"], hint: "Indexes speed up SELECT queries on that column", explanation: "Indexes trade write speed for read speed. Like a book's index — faster to find things but takes space!", category: "modify" },
  // === CASE & COALESCE ===
  { id: 28, scenario: "Categorize employees as 'High', 'Mid', or 'Low' salary.", correctAnswer: "SELECT name, CASE WHEN salary > 80000 THEN 'High' WHEN salary > 50000 THEN 'Mid' ELSE 'Low' END AS tier FROM employees", options: ["SELECT name, CASE WHEN salary > 80000 THEN 'High' WHEN salary > 50000 THEN 'Mid' ELSE 'Low' END AS tier FROM employees", "SELECT name, IF salary > 80000 'High' ELIF > 50000 'Mid' ELSE 'Low' FROM employees", "SELECT name, CATEGORIZE(salary, 'High', 'Mid', 'Low') FROM employees", "SELECT name, salary > 80000 ? 'High' : 'Low' FROM employees"], hint: "CASE WHEN provides conditional logic in SQL", explanation: "CASE WHEN ... THEN ... ELSE ... END is SQL's if-else. Use it in SELECT, WHERE, or ORDER BY!", category: "select" },
  { id: 29, scenario: "Replace NULL phone numbers with 'N/A'.", correctAnswer: "SELECT name, COALESCE(phone, 'N/A') FROM employees", options: ["SELECT name, COALESCE(phone, 'N/A') FROM employees", "SELECT name, IFNULL(phone, 'N/A') FROM employees", "SELECT name, phone OR 'N/A' FROM employees", "SELECT name, DEFAULT(phone, 'N/A') FROM employees"], hint: "COALESCE returns the first non-NULL value", explanation: "COALESCE(val1, val2, ...) returns the first non-NULL argument. Standard SQL! IFNULL is MySQL-specific.", category: "select" },
  // === EXISTS & IN ===
  { id: 30, scenario: "Find employees who have placed at least one order.", tableSchema: "employees(id, name) + orders(id, employee_id, amount)", correctAnswer: "SELECT * FROM employees e WHERE EXISTS (SELECT 1 FROM orders WHERE employee_id = e.id)", options: ["SELECT * FROM employees e WHERE EXISTS (SELECT 1 FROM orders WHERE employee_id = e.id)", "SELECT * FROM employees WHERE id IN orders.employee_id", "SELECT * FROM employees JOIN orders", "SELECT * FROM employees WHERE HAS orders"], hint: "EXISTS checks if the subquery returns any rows", explanation: "EXISTS returns TRUE if the subquery returns at least one row. Often faster than IN for large datasets!", category: "filter" },
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