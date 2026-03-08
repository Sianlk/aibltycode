import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Table, Star, Lightbulb, BarChart3, Code, Layers } from "lucide-react";

interface ExcelChallenge {
  id: number;
  scenario: string;
  cellData?: string[][];
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  mnemonic?: string;
  category: "formulas" | "functions" | "charts" | "pivot" | "macros" | "advanced" | "conditional" | "data-tools";
}

const challenges: ExcelChallenge[] = [
  // ===== BASIC FORMULAS =====
  {
    id: 1, category: "formulas",
    scenario: "Cell A1=10, A2=20. What formula in A3 adds them together?",
    cellData: [["10"], ["20"], ["?"]],
    correctAnswer: "=A1+A2",
    options: ["=A1+A2", "=SUM(A1,A2)", "=ADD(A1:A2)", "A1+A2"],
    hint: "Use the = sign to start a formula, then reference cells",
    explanation: "=A1+A2 adds the values. =SUM(A1:A2) also works! Formulas MUST start with =",
    mnemonic: "E.Q.U.A.L.S — Every Quality formula Uses an = to Activate Live Spreadsheet calculations"
  },
  {
    id: 2, category: "formulas",
    scenario: "You need to multiply B1 by B2 and divide by B3. What formula?",
    correctAnswer: "=B1*B2/B3",
    options: ["=B1*B2/B3", "=MULTIPLY(B1,B2)/B3", "=B1xB2/B3", "B1*B2/B3"],
    hint: "Use * for multiply, / for divide",
    explanation: "=B1*B2/B3 follows order of operations. * is multiplication in Excel, not x!",
    mnemonic: "M.D.A.S — Multiply (*), Divide (/), Add (+), Subtract (-)"
  },
  {
    id: 3, category: "formulas",
    scenario: "What does the $ symbol do in $A$1?",
    correctAnswer: "Makes the reference absolute (doesn't change when copied)",
    options: [
      "Makes the reference absolute (doesn't change when copied)",
      "Multiplies the cell by currency",
      "Formats as currency",
      "Locks the cell from editing"
    ],
    hint: "Think about what happens when you copy a formula",
    explanation: "$A$1 is absolute — won't change when copied. A1 is relative — changes with position! F4 key toggles between modes.",
    mnemonic: "D.O.L.L.A.R — Doesn't Obviously Let Location Alter References"
  },
  // ===== FUNCTIONS =====
  {
    id: 4, category: "functions",
    scenario: "Sum all values from A1 to A100. What's the most efficient formula?",
    correctAnswer: "=SUM(A1:A100)",
    options: ["=SUM(A1:A100)", "=A1+A2+A3+...+A100", "=TOTAL(A1:A100)", "=ADD(A1:A100)"],
    hint: "SUM is the function for adding ranges",
    explanation: "=SUM(A1:A100) adds all 100 cells! The colon (:) means 'through' — A1 through A100.",
    mnemonic: "S.C.A.M — SUM, COUNT, AVERAGE, MAX/MIN are the 5 essential functions"
  },
  {
    id: 5, category: "functions",
    scenario: "Find the average of cells C1 to C10. Which function?",
    correctAnswer: "=AVERAGE(C1:C10)",
    options: ["=AVERAGE(C1:C10)", "=AVG(C1:C10)", "=MEAN(C1:C10)", "=SUM(C1:C10)/10"],
    hint: "The function is spelled out fully",
    explanation: "=AVERAGE(C1:C10) calculates the mean. Note: AVG doesn't exist in Excel!",
  },
  {
    id: 6, category: "functions",
    scenario: "Count how many cells in D1:D50 contain numbers. Which function?",
    correctAnswer: "=COUNT(D1:D50)",
    options: ["=COUNT(D1:D50)", "=COUNTA(D1:D50)", "=COUNTNUM(D1:D50)", "=LEN(D1:D50)"],
    hint: "COUNT counts numbers, COUNTA counts non-empty cells",
    explanation: "COUNT counts numeric values only. COUNTA counts ALL non-empty cells including text!",
  },
  {
    id: 7, category: "functions",
    scenario: "Find the highest value in range E1:E100. Which function?",
    correctAnswer: "=MAX(E1:E100)",
    options: ["=MAX(E1:E100)", "=HIGHEST(E1:E100)", "=TOP(E1:E100)", "=LARGE(E1:E100)"],
    hint: "Think 'maximum'",
    explanation: "=MAX finds the largest value. MIN finds the smallest. LARGE(range,n) finds nth largest.",
  },
  // ===== CONDITIONAL FORMATTING & LOGIC =====
  {
    id: 8, category: "conditional",
    scenario: "If A1>100, show 'High', otherwise show 'Low'. Which formula?",
    correctAnswer: '=IF(A1>100,"High","Low")',
    options: ['=IF(A1>100,"High","Low")', '=WHEN(A1>100,"High","Low")', '=CHECK(A1>100,"High","Low")', 'IF A1>100 THEN "High"'],
    hint: "IF(condition, value_if_true, value_if_false)",
    explanation: "IF is Excel's decision maker! Syntax: IF(test, true_result, false_result)",
    mnemonic: "I.F.T.F — IF(Test, True_result, False_result)"
  },
  {
    id: 9, category: "conditional",
    scenario: "You want to check multiple conditions: if score>=90 'A', >=80 'B', else 'C'. What formula structure?",
    correctAnswer: '=IF(A1>=90,"A",IF(A1>=80,"B","C"))',
    options: ['=IF(A1>=90,"A",IF(A1>=80,"B","C"))', '=IF(A1>=90,"A",A1>=80,"B","C")', '=SWITCH(A1,"A","B","C")', '=IFS(A1>=90,A1>=80)'],
    hint: "You can nest IF functions inside each other",
    explanation: "Nested IFs handle multiple conditions. In Excel 365, you can also use IFS() for cleaner syntax!",
  },
  {
    id: 10, category: "conditional",
    scenario: "Which feature visually highlights cells based on their values using color scales or data bars?",
    correctAnswer: "Conditional Formatting",
    options: ["Conditional Formatting", "Cell Styles", "Data Validation", "AutoFormat"],
    hint: "It changes how cells look based on conditions",
    explanation: "Conditional Formatting applies visual rules: color scales, data bars, icon sets, and custom rules based on cell values.",
  },
  // ===== LOOKUP & REFERENCE =====
  {
    id: 11, category: "advanced",
    scenario: "Look up a value in column A and return matching value from column B. Which function?",
    correctAnswer: "=VLOOKUP(value,A:B,2,FALSE)",
    options: ["=VLOOKUP(value,A:B,2,FALSE)", "=SEARCH(value,A:B)", "=FIND(value,A,B)", "=LOOKUP(value,A:B)"],
    hint: "V stands for Vertical lookup",
    explanation: "VLOOKUP searches vertically. Arguments: lookup_value, table, column_index, exact_match(FALSE)",
    mnemonic: "V.L.C.E — Value, Lookup_range, Column_number, Exact_match"
  },
  {
    id: 12, category: "advanced",
    scenario: "What modern function replaces VLOOKUP and can look left, right, or in any direction?",
    correctAnswer: "=XLOOKUP",
    options: ["=XLOOKUP", "=HLOOKUP", "=INDEX", "=SEARCH"],
    hint: "It starts with X and is available in Excel 365",
    explanation: "XLOOKUP is the modern replacement: XLOOKUP(lookup, lookup_array, return_array). No column number needed!",
  },
  {
    id: 13, category: "advanced",
    scenario: "Combine text from A1 ('Hello') and B1 ('World') with a space. Which formula?",
    correctAnswer: '=A1&" "&B1',
    options: ['=A1&" "&B1', '=CONCAT(A1," ",B1)', '=A1+" "+B1', '=JOIN(A1,B1)'],
    hint: "& is the text concatenation operator",
    explanation: '& joins text. =A1&" "&B1 gives "Hello World". CONCAT and CONCATENATE also work!',
  },
  // ===== COUNTIF / SUMIF =====
  {
    id: 14, category: "functions",
    scenario: "Count cells in A1:A100 that contain the text 'Sales'. Which function?",
    correctAnswer: '=COUNTIF(A1:A100,"Sales")',
    options: ['=COUNTIF(A1:A100,"Sales")', '=COUNT(A1:A100,"Sales")', '=COUNTTEXT(A1:A100,"Sales")', '=FIND("Sales",A1:A100)'],
    hint: "COUNT + IF = COUNTIF for conditional counting",
    explanation: "COUNTIF counts cells matching a condition. SUMIF adds values matching a condition!",
    mnemonic: "C.I.F — COUNTIF(range, criteria) and S.I.F.S — SUMIF(range, criteria, sum_range)"
  },
  {
    id: 15, category: "functions",
    scenario: "Sum values in B1:B100 where corresponding A1:A100 = 'Region1'. Which function?",
    correctAnswer: '=SUMIF(A1:A100,"Region1",B1:B100)',
    options: ['=SUMIF(A1:A100,"Region1",B1:B100)', '=SUM(A1:A100="Region1",B1:B100)', '=SUMWHEN(A1:A100,"Region1",B1:B100)', '=SUM(IF(A="Region1",B))'],
    hint: "SUMIF has three arguments: range, criteria, sum_range",
    explanation: "SUMIF(criteria_range, criteria, sum_range) — adds B values where A equals 'Region1'",
  },
  // ===== CHARTS & GRAPHS =====
  {
    id: 16, category: "charts",
    scenario: "You have monthly sales data and want to show trends over time. Which chart type is best?",
    correctAnswer: "Line chart",
    options: ["Line chart", "Pie chart", "Bar chart", "Scatter plot"],
    hint: "Think about showing changes across a continuous axis",
    explanation: "Line charts are ideal for showing trends over time. The x-axis shows time, y-axis shows values, and the line connects data points.",
    mnemonic: "T.L.I.N.E — Trends over time? Line Is the Natural Excel choice"
  },
  {
    id: 17, category: "charts",
    scenario: "You want to compare the percentage share of each product in total revenue. Best chart?",
    correctAnswer: "Pie chart",
    options: ["Pie chart", "Line chart", "Histogram", "Waterfall chart"],
    hint: "Think about showing parts of a whole",
    explanation: "Pie charts show proportions of a whole — each slice is a percentage. Use when you have 5-7 categories max.",
    mnemonic: "P.I.E — Proportions In Each category"
  },
  {
    id: 18, category: "charts",
    scenario: "You need to compare values across different categories (e.g., sales by department). Best chart?",
    correctAnswer: "Bar/Column chart",
    options: ["Bar/Column chart", "Pie chart", "Area chart", "Radar chart"],
    hint: "Which chart uses rectangular bars to compare values?",
    explanation: "Bar (horizontal) and Column (vertical) charts compare discrete categories. Use when comparing amounts across groups.",
  },
  {
    id: 19, category: "charts",
    scenario: "What chart type shows the relationship between two numerical variables (e.g., height vs weight)?",
    correctAnswer: "Scatter plot (XY chart)",
    options: ["Scatter plot (XY chart)", "Pie chart", "Stacked bar chart", "Treemap"],
    hint: "Each data point is plotted as a dot at (x,y) coordinates",
    explanation: "Scatter plots reveal correlations between two variables. Add trendlines to show patterns (positive, negative, or no correlation).",
  },
  {
    id: 20, category: "charts",
    scenario: "What Excel feature lets you add a mathematical trend line to your chart?",
    correctAnswer: "Trendline (right-click chart > Add Trendline)",
    options: ["Trendline (right-click chart > Add Trendline)", "Sparkline", "Data Validation", "Solver"],
    hint: "It's added by right-clicking on data series in a chart",
    explanation: "Trendlines show trends: Linear, Exponential, Logarithmic, Polynomial. Display the R² value to see how well it fits!",
  },
  {
    id: 21, category: "charts",
    scenario: "What are Sparklines in Excel?",
    correctAnswer: "Tiny charts inside a single cell showing data trends",
    options: ["Tiny charts inside a single cell showing data trends", "Large chart sheets", "Animated charts", "3D graphs"],
    hint: "They fit inside one cell",
    explanation: "Sparklines are miniature charts in cells — perfect for dashboards. Types: Line, Column, Win/Loss. Insert > Sparklines.",
  },
  // ===== PIVOT TABLES =====
  {
    id: 22, category: "pivot",
    scenario: "You have 10,000 rows of sales data and need to quickly summarize sales by region and product. What Excel feature?",
    correctAnswer: "PivotTable",
    options: ["PivotTable", "VLOOKUP", "AutoFilter", "Conditional Formatting"],
    hint: "It lets you drag and drop fields to summarize data",
    explanation: "PivotTables are Excel's most powerful analysis tool. Drag fields into Rows, Columns, Values, and Filters to instantly summarize thousands of rows.",
    mnemonic: "P.I.V.O.T — Powerful Interactive Views Of Tabular data"
  },
  {
    id: 23, category: "pivot",
    scenario: "In a PivotTable, which area do you drag a field to if you want to see totals?",
    correctAnswer: "Values area",
    options: ["Values area", "Rows area", "Columns area", "Filters area"],
    hint: "Values are what gets calculated (sum, count, average)",
    explanation: "Values = what you measure (SUM, COUNT, AVERAGE). Rows = categories going down. Columns = categories going across. Filters = top-level slicers.",
  },
  {
    id: 24, category: "pivot",
    scenario: "What PivotTable feature lets you click buttons to filter data instead of dropdown menus?",
    correctAnswer: "Slicers",
    options: ["Slicers", "Sparklines", "Conditional Formatting", "Data Validation"],
    hint: "They're visual filter buttons",
    explanation: "Slicers are interactive filter buttons. Insert > Slicer. They make PivotTables more user-friendly and dashboard-ready!",
  },
  {
    id: 25, category: "pivot",
    scenario: "What is a PivotChart?",
    correctAnswer: "A chart directly connected to a PivotTable that updates automatically",
    options: ["A chart directly connected to a PivotTable that updates automatically", "A static chart", "A chart template", "An image of data"],
    hint: "It combines PivotTable power with visual charts",
    explanation: "PivotCharts are dynamic visualizations linked to PivotTables. When you filter the PivotTable, the chart updates automatically!",
  },
  // ===== MACROS & VBA =====
  {
    id: 26, category: "macros",
    scenario: "You perform the same 10-step formatting task daily. What Excel feature can automate this?",
    correctAnswer: "Macros (Record Macro)",
    options: ["Macros (Record Macro)", "AutoFormat", "Templates", "Conditional Formatting"],
    hint: "Think about recording and replaying your actions",
    explanation: "Macros record your actions and replay them with one click. View > Macros > Record Macro. They use VBA (Visual Basic for Applications) code.",
    mnemonic: "M.A.C.R.O — Make Actions Consistently Repeat via One-click"
  },
  {
    id: 27, category: "macros",
    scenario: "What programming language powers Excel Macros?",
    correctAnswer: "VBA (Visual Basic for Applications)",
    options: ["VBA (Visual Basic for Applications)", "Python", "JavaScript", "C++"],
    hint: "It's specifically designed for Microsoft Office",
    explanation: "VBA is Excel's built-in programming language. Press Alt+F11 to open the VBA editor. All macros are VBA code behind the scenes!",
  },
  {
    id: 28, category: "macros",
    scenario: "What is the correct VBA syntax to display a message box saying 'Hello'?",
    correctAnswer: 'MsgBox "Hello"',
    options: ['MsgBox "Hello"', 'alert("Hello")', 'print("Hello")', 'Console.Write("Hello")'],
    hint: "VBA uses MsgBox, not alert or print",
    explanation: 'MsgBox is VBA\'s way to show popup messages. You can also use MsgBox("Hello", vbInformation, "Title") for more control.',
  },
  {
    id: 29, category: "macros",
    scenario: "What VBA code would set cell A1's value to 100?",
    correctAnswer: 'Range("A1").Value = 100',
    options: ['Range("A1").Value = 100', 'Cell(A1) = 100', 'A1.set(100)', 'SetCell("A1", 100)'],
    hint: "VBA uses Range() to reference cells",
    explanation: 'Range("A1").Value = 100 sets the value. You can also use Cells(1,1).Value = 100 where 1,1 means row 1, column 1.',
  },
  {
    id: 30, category: "macros",
    scenario: "What VBA structure repeats code for each item in a range?",
    correctAnswer: "For Each...Next loop",
    options: ["For Each...Next loop", "While...End loop", "Repeat...Until loop", "forEach() function"],
    hint: "It iterates through each item in a collection",
    explanation: "For Each cell In Range(\"A1:A10\"): ... Next cell — loops through each cell. This is VBA's most common looping pattern!",
  },
  {
    id: 31, category: "macros",
    scenario: "What file extension must you use to save an Excel file that contains macros?",
    correctAnswer: ".xlsm",
    options: [".xlsm", ".xlsx", ".xls", ".csv"],
    hint: "It's like .xlsx but with an 'm'",
    explanation: ".xlsm is Macro-Enabled Workbook. Regular .xlsx strips out all macros when saved! Always use .xlsm for macro files.",
    mnemonic: "X.L.S.M — eXceL Spreadsheet with Macros"
  },
  // ===== DATA TOOLS =====
  {
    id: 32, category: "data-tools",
    scenario: "What feature restricts what users can enter in a cell (e.g., only numbers between 1-100)?",
    correctAnswer: "Data Validation",
    options: ["Data Validation", "Cell Protection", "Conditional Formatting", "AutoFilter"],
    hint: "It validates user input before accepting it",
    explanation: "Data Validation (Data tab > Data Validation) sets rules: whole numbers, decimals, lists, dates, text length, or custom formulas.",
  },
  {
    id: 33, category: "data-tools",
    scenario: "What Excel feature lets you test different scenarios by changing input values to see how they affect a formula result?",
    correctAnswer: "What-If Analysis (Goal Seek / Data Tables)",
    options: ["What-If Analysis (Goal Seek / Data Tables)", "AutoSum", "Flash Fill", "Text to Columns"],
    hint: "It's under the Data tab for scenario testing",
    explanation: "What-If Analysis includes: Goal Seek (find input for desired output), Data Tables (test multiple inputs), and Scenario Manager (save and compare scenarios).",
  },
  {
    id: 34, category: "data-tools",
    scenario: "You have dates in text format '15/03/2025' and need them as actual dates. Which function converts text to a date?",
    correctAnswer: "=DATEVALUE(text)",
    options: ["=DATEVALUE(text)", "=DATE(text)", "=TODATE(text)", "=CONVERT(text)"],
    hint: "It converts a date-like text string into a serial number Excel recognizes as a date",
    explanation: "DATEVALUE converts text to Excel dates. For custom formats, combine LEFT, MID, RIGHT with DATE function.",
  },
  {
    id: 35, category: "advanced",
    scenario: "What Excel function returns the position of a value within a range (useful with INDEX)?",
    correctAnswer: "=MATCH",
    options: ["=MATCH", "=FIND", "=SEARCH", "=POSITION"],
    hint: "It's commonly paired with INDEX for flexible lookups",
    explanation: "INDEX-MATCH is the professional alternative to VLOOKUP. MATCH finds position, INDEX returns value at that position. More flexible!",
    mnemonic: "I.M — INDEX(return_range, MATCH(lookup, lookup_range, 0)) — I find, M locates"
  },
];

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  formulas: { label: "Formulas", icon: <Code className="w-3 h-3" />, color: "bg-primary/10 text-primary" },
  functions: { label: "Functions", icon: <Layers className="w-3 h-3" />, color: "bg-success/10 text-success" },
  charts: { label: "Charts & Graphs", icon: <BarChart3 className="w-3 h-3" />, color: "bg-warning/10 text-warning" },
  pivot: { label: "Pivot Tables", icon: <Table className="w-3 h-3" />, color: "bg-accent/10 text-accent" },
  macros: { label: "Macros & VBA", icon: <Code className="w-3 h-3" />, color: "bg-secondary/10 text-secondary" },
  advanced: { label: "Advanced", icon: <Star className="w-3 h-3" />, color: "bg-destructive/10 text-destructive" },
  conditional: { label: "Conditional Logic", icon: <Layers className="w-3 h-3" />, color: "bg-primary/10 text-primary" },
  "data-tools": { label: "Data Tools", icon: <Table className="w-3 h-3" />, color: "bg-success/10 text-success" },
};

export const ExcelMasterGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { playSound, addXp } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;
  const progress = ((currentChallenge) / challenges.length) * 100;
  const catConfig = challenge ? categoryConfig[challenge.category] : null;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(prev => prev + (showHint ? 15 : 25));
      setCorrectCount(prev => prev + 1);
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
      const xpEarned = Math.round((correctCount / challenges.length) * 150);
      addXp(xpEarned);
    }
  };

  if (gameComplete) {
    const accuracy = Math.round((correctCount / challenges.length) * 100);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Excel Master Complete!</h2>
        <p className="text-muted-foreground mb-2">
          {correctCount}/{challenges.length} correct ({accuracy}%) — {score} points
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <div key={key} className={`rounded-lg p-2 text-xs ${config.color}`}>
              <div className="flex items-center gap-1 font-medium">{config.icon} {config.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-primary/10 rounded-lg p-4 mb-4 text-left">
          <p className="font-bold text-primary mb-2">🧠 Key Mnemonics:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>S.C.A.M</strong> — SUM, COUNT, AVERAGE, MAX/MIN</li>
            <li>• <strong>I.F.T.F</strong> — IF(Test, True, False)</li>
            <li>• <strong>V.L.C.E</strong> — VLOOKUP(Value, Lookup, Column, Exact)</li>
            <li>• <strong>P.I.V.O.T</strong> — Powerful Interactive Views Of Tabular data</li>
            <li>• <strong>M.A.C.R.O</strong> — Make Actions Consistently Repeat via One-click</li>
            <li>• <strong>I.M</strong> — INDEX + MATCH for flexible lookups</li>
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
          Excel Master — {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning" />
              Score: {score}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              {correctCount} correct
            </div>
            {catConfig && (
              <Badge variant="outline" className={`gap-1 text-xs ${catConfig.color}`}>
                {catConfig.icon} {catConfig.label}
              </Badge>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground font-medium">{challenge.scenario}</p>
        </div>

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

        {!showHint && !showResult && (
          <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
            <Lightbulb className="w-4 h-4" /> Need a hint? (-10 points)
          </Button>
        )}

        {showHint && !showResult && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm">
            💡 {challenge.hint}
          </motion.div>
        )}

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
                    ? isCorrectOption ? "bg-success/20 border-success text-foreground"
                    : isSelected ? "bg-destructive/20 border-destructive text-foreground"
                    : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-success" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-destructive" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className={`p-4 rounded-lg ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}>
                <p className="font-bold mb-2">{isCorrect ? "🎯 Correct!" : "❌ Not quite!"}</p>
                <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
              </div>
              {challenge.mnemonic && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary">🧠 Memory Trick: {challenge.mnemonic}</p>
                </div>
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

export default ExcelMasterGame;
