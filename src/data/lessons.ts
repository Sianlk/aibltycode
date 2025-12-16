// Comprehensive lesson data for all modules

export interface LessonStep {
  type: "typing" | "quiz";
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prompt?: string;
  codeToType?: string;
  question?: string;
  codeExample?: string;
  options?: { label: string; text: string }[];
  correctAnswer?: string;
  explanation: string;
}

export interface LessonData {
  id: string;
  title: string;
  moduleId: string;
  steps: LessonStep[];
  xpReward: number;
}

// Java Foundations Module
export const javaLessons: Record<string, LessonData> = {
  "hello-world": {
    id: "hello-world", moduleId: "java-foundations", title: "Hello World!", xpReward: 50,
    steps: [
      { type: "typing", title: "Hello World", difficulty: "easy", prompt: "Type your first Java program!", codeToType: 'System.out.println("Hello World!");', explanation: "println() prints text and moves to a new line." },
      { type: "quiz", title: "Output Methods", difficulty: "easy", question: "What do we use to print text in Java?", options: [{ label: "A", text: "print()" }, { label: "B", text: "System.out.println()" }, { label: "C", text: "console.log()" }], correctAnswer: "B", explanation: "System.out.println() is Java's console output method!" },
      { type: "typing", title: "Custom Message", difficulty: "easy", prompt: "Print your own message!", codeToType: 'System.out.println("I love coding!");', explanation: "You can print any text inside double quotes!" },
    ],
  },
  "variables": {
    id: "variables", moduleId: "java-foundations", title: "Variables", xpReward: 75,
    steps: [
      { type: "typing", title: "Integer Variable", difficulty: "easy", prompt: "Create a variable to store age!", codeToType: "int age = 25;", explanation: "int stores whole numbers. Variables are like boxes that hold values." },
      { type: "typing", title: "String Variable", difficulty: "easy", prompt: "Create a variable for a name!", codeToType: 'String name = "Java";', explanation: "String stores text in double quotes." },
      { type: "quiz", title: "Variable Types", difficulty: "easy", question: "What type stores whole numbers?", options: [{ label: "A", text: "String" }, { label: "B", text: "int" }, { label: "C", text: "boolean" }], correctAnswer: "B", explanation: "int stores integers like 1, 42, -7!" },
      { type: "typing", title: "Boolean Variable", difficulty: "easy", prompt: "Create a true/false variable!", codeToType: "boolean isActive = true;", explanation: "boolean stores true or false values only." },
    ],
  },
  "data-types": {
    id: "data-types", moduleId: "java-foundations", title: "Data Types", xpReward: 100,
    steps: [
      { type: "typing", title: "Double Type", difficulty: "easy", prompt: "Create a decimal number!", codeToType: "double price = 19.99;", explanation: "double stores decimal numbers with high precision." },
      { type: "typing", title: "Float Type", difficulty: "easy", prompt: "Create a float variable!", codeToType: "float temp = 36.5f;", explanation: "float needs 'f' suffix. Less precise than double." },
      { type: "quiz", title: "Data Types", difficulty: "medium", question: "Which type stores true/false?", options: [{ label: "A", text: "boolean" }, { label: "B", text: "int" }, { label: "C", text: "char" }], correctAnswer: "A", explanation: "boolean stores only true or false values!" },
      { type: "typing", title: "Char Type", difficulty: "easy", prompt: "Store a single character!", codeToType: "char grade = 'A';", explanation: "char stores a single character in single quotes." },
    ],
  },
  "operators": {
    id: "operators", moduleId: "java-foundations", title: "Operators", xpReward: 100,
    steps: [
      { type: "typing", title: "Arithmetic", difficulty: "easy", prompt: "Add two numbers!", codeToType: "int sum = 5 + 3;", explanation: "The + operator adds numbers together." },
      { type: "typing", title: "Multiplication", difficulty: "easy", prompt: "Multiply numbers!", codeToType: "int product = 4 * 7;", explanation: "The * operator multiplies numbers." },
      { type: "quiz", title: "Operators", difficulty: "medium", question: "What is 10 % 3?", options: [{ label: "A", text: "3" }, { label: "B", text: "1" }, { label: "C", text: "0" }], correctAnswer: "B", explanation: "% returns the remainder. 10 / 3 = 3 remainder 1!" },
      { type: "typing", title: "Comparison", difficulty: "medium", prompt: "Compare two values!", codeToType: "boolean isEqual = (x == y);", explanation: "== checks if two values are equal." },
    ],
  },
  "strings": {
    id: "strings", moduleId: "java-foundations", title: "Strings", xpReward: 100,
    steps: [
      { type: "typing", title: "String Creation", difficulty: "easy", prompt: "Create a greeting!", codeToType: 'String greeting = "Hello";', explanation: "Strings hold text in double quotes." },
      { type: "typing", title: "Concatenation", difficulty: "easy", prompt: "Join two strings!", codeToType: 'String full = first + " " + last;', explanation: "Use + to concatenate strings together." },
      { type: "quiz", title: "String Methods", difficulty: "medium", question: "What does .length() return?", options: [{ label: "A", text: "First character" }, { label: "B", text: "Number of characters" }, { label: "C", text: "Last character" }], correctAnswer: "B", explanation: ".length() returns the number of characters!" },
      { type: "typing", title: "String Method", difficulty: "medium", prompt: "Get string length!", codeToType: "int len = text.length();", explanation: "length() returns the number of characters." },
    ],
  },
  "if-statements": {
    id: "if-statements", moduleId: "java-foundations", title: "If Statements", xpReward: 100,
    steps: [
      { type: "typing", title: "Simple If", difficulty: "medium", prompt: "Write an if statement!", codeToType: "if (age >= 18) { }", explanation: "if checks a condition and runs code if true." },
      { type: "quiz", title: "Conditions", difficulty: "medium", question: "What does >= mean?", options: [{ label: "A", text: "Greater than" }, { label: "B", text: "Greater or equal" }, { label: "C", text: "Equal" }], correctAnswer: "B", explanation: ">= means greater than OR equal to!" },
      { type: "typing", title: "If-Else", difficulty: "medium", prompt: "Add an else clause!", codeToType: "if (score > 50) { } else { }", explanation: "else runs when the if condition is false." },
    ],
  },
  "else-elseif": {
    id: "else-elseif", moduleId: "java-foundations", title: "Else & Else If", xpReward: 100,
    steps: [
      { type: "typing", title: "Else If", difficulty: "medium", prompt: "Add multiple conditions!", codeToType: "if (grade >= 90) { } else if (grade >= 80) { }", explanation: "else if adds additional conditions to check." },
      { type: "quiz", title: "Control Flow", difficulty: "medium", question: "How many else can an if have?", options: [{ label: "A", text: "Unlimited" }, { label: "B", text: "Only one" }, { label: "C", text: "None" }], correctAnswer: "B", explanation: "Only one else, but unlimited else if!" },
      { type: "typing", title: "Complete Chain", difficulty: "medium", prompt: "Write full if-else chain!", codeToType: "if (x > 0) { } else if (x < 0) { } else { }", explanation: "else catches all remaining cases." },
    ],
  },
  "for-loops": {
    id: "for-loops", moduleId: "java-foundations", title: "For Loops", xpReward: 125,
    steps: [
      { type: "typing", title: "Basic For Loop", difficulty: "medium", prompt: "Count from 0 to 4!", codeToType: "for (int i = 0; i < 5; i++) { }", explanation: "for(start; condition; increment) repeats code." },
      { type: "quiz", title: "Loop Count", difficulty: "medium", question: "How many times does i < 3 loop?", options: [{ label: "A", text: "2 times" }, { label: "B", text: "3 times" }, { label: "C", text: "4 times" }], correctAnswer: "B", explanation: "i = 0, 1, 2 — that's 3 iterations!" },
      { type: "typing", title: "Reverse Loop", difficulty: "medium", prompt: "Count backwards!", codeToType: "for (int i = 5; i > 0; i--) { }", explanation: "i-- decrements. Loop runs while i > 0." },
    ],
  },
  "while-loops": {
    id: "while-loops", moduleId: "java-foundations", title: "While Loops", xpReward: 125,
    steps: [
      { type: "typing", title: "While Loop", difficulty: "medium", prompt: "Create a while loop!", codeToType: "while (count < 10) { count++; }", explanation: "while repeats while condition is true." },
      { type: "quiz", title: "Loop Types", difficulty: "medium", question: "When does while check condition?", options: [{ label: "A", text: "After each loop" }, { label: "B", text: "Before each loop" }, { label: "C", text: "Only once" }], correctAnswer: "B", explanation: "while checks BEFORE each iteration!" },
      { type: "typing", title: "Do-While", difficulty: "medium", prompt: "Create a do-while loop!", codeToType: "do { x++; } while (x < 5);", explanation: "do-while runs at least once, checks after." },
    ],
  },
  "methods": {
    id: "methods", moduleId: "java-foundations", title: "Methods", xpReward: 150,
    steps: [
      { type: "typing", title: "Void Method", difficulty: "medium", prompt: "Create a simple method!", codeToType: "public void greet() { }", explanation: "void methods don't return anything." },
      { type: "typing", title: "Return Method", difficulty: "medium", prompt: "Method that returns int!", codeToType: "public int add(int a, int b) { return a + b; }", explanation: "Methods can return values using return." },
      { type: "quiz", title: "Method Concepts", difficulty: "medium", question: "What does 'void' mean?", options: [{ label: "A", text: "Returns string" }, { label: "B", text: "Returns nothing" }, { label: "C", text: "Private method" }], correctAnswer: "B", explanation: "void means the method returns nothing!" },
    ],
  },
  "arrays": {
    id: "arrays", moduleId: "java-foundations", title: "Arrays", xpReward: 150,
    steps: [
      { type: "typing", title: "Array Creation", difficulty: "medium", prompt: "Create an integer array!", codeToType: "int[] nums = {1, 2, 3, 4, 5};", explanation: "Arrays store multiple values of same type." },
      { type: "typing", title: "Array Access", difficulty: "medium", prompt: "Access first element!", codeToType: "int first = nums[0];", explanation: "Array indexes start at 0, not 1!" },
      { type: "quiz", title: "Array Index", difficulty: "medium", question: "Array indexes start at?", options: [{ label: "A", text: "1" }, { label: "B", text: "0" }, { label: "C", text: "-1" }], correctAnswer: "B", explanation: "Arrays are zero-indexed in Java!" },
    ],
  },
  "classes": {
    id: "classes", moduleId: "java-foundations", title: "Classes & Objects", xpReward: 200,
    steps: [
      { type: "typing", title: "Class Definition", difficulty: "hard", prompt: "Create a simple class!", codeToType: "public class Dog { }", explanation: "Classes are blueprints for objects." },
      { type: "typing", title: "Constructor", difficulty: "hard", prompt: "Create a constructor!", codeToType: "public Dog(String name) { this.name = name; }", explanation: "Constructors initialize new objects." },
      { type: "quiz", title: "OOP Basics", difficulty: "hard", question: "What does 'new' keyword do?", options: [{ label: "A", text: "Deletes object" }, { label: "B", text: "Creates object" }, { label: "C", text: "Updates object" }], correctAnswer: "B", explanation: "new creates a new instance of a class!" },
    ],
  },
  "inheritance": {
    id: "inheritance", moduleId: "java-foundations", title: "Inheritance", xpReward: 200,
    steps: [
      { type: "typing", title: "Extends Keyword", difficulty: "hard", prompt: "Create a subclass!", codeToType: "public class Cat extends Animal { }", explanation: "extends inherits from parent class." },
      { type: "quiz", title: "Inheritance", difficulty: "hard", question: "What does a subclass inherit?", options: [{ label: "A", text: "Only methods" }, { label: "B", text: "Methods and fields" }, { label: "C", text: "Nothing" }], correctAnswer: "B", explanation: "Subclasses inherit both methods and fields!" },
      { type: "typing", title: "Override Method", difficulty: "hard", prompt: "Override parent method!", codeToType: "@Override public void speak() { }", explanation: "@Override indicates method replacement." },
    ],
  },
  "interfaces": {
    id: "interfaces", moduleId: "java-foundations", title: "Interfaces", xpReward: 200,
    steps: [
      { type: "typing", title: "Interface Definition", difficulty: "hard", prompt: "Create an interface!", codeToType: "public interface Drawable { void draw(); }", explanation: "Interfaces define contracts for classes." },
      { type: "typing", title: "Implement Interface", difficulty: "hard", prompt: "Implement an interface!", codeToType: "public class Circle implements Drawable { }", explanation: "implements makes class follow interface." },
      { type: "quiz", title: "Interfaces", difficulty: "hard", question: "Can a class implement multiple interfaces?", options: [{ label: "A", text: "No" }, { label: "B", text: "Yes" }, { label: "C", text: "Only two" }], correctAnswer: "B", explanation: "Java allows implementing multiple interfaces!" },
    ],
  },
  "exceptions": {
    id: "exceptions", moduleId: "java-foundations", title: "Exception Handling", xpReward: 175,
    steps: [
      { type: "typing", title: "Try-Catch", difficulty: "hard", prompt: "Handle an exception!", codeToType: "try { } catch (Exception e) { }", explanation: "try-catch prevents program crashes." },
      { type: "quiz", title: "Exceptions", difficulty: "hard", question: "What happens in catch block?", options: [{ label: "A", text: "Normal code runs" }, { label: "B", text: "Error is handled" }, { label: "C", text: "Program exits" }], correctAnswer: "B", explanation: "catch handles errors gracefully!" },
      { type: "typing", title: "Finally Block", difficulty: "hard", prompt: "Add finally block!", codeToType: "try { } catch (Exception e) { } finally { }", explanation: "finally always runs, error or not." },
    ],
  },
  "collections": {
    id: "collections", moduleId: "java-foundations", title: "Collections", xpReward: 225,
    steps: [
      { type: "typing", title: "ArrayList", difficulty: "hard", prompt: "Create an ArrayList!", codeToType: 'ArrayList<String> list = new ArrayList<>();', explanation: "ArrayList is a resizable array." },
      { type: "typing", title: "Add Element", difficulty: "hard", prompt: "Add to the list!", codeToType: 'list.add("Java");', explanation: "add() appends element to list." },
      { type: "quiz", title: "Collections", difficulty: "hard", question: "ArrayList vs Array?", options: [{ label: "A", text: "Same size" }, { label: "B", text: "ArrayList resizes" }, { label: "C", text: "Array resizes" }], correctAnswer: "B", explanation: "ArrayList grows dynamically, arrays don't!" },
    ],
  },
};

// Systems Analysis Module
export const systemsLessons: Record<string, LessonData> = {
  "what-is-system": {
    id: "what-is-system", moduleId: "systems-analysis", title: "What is a System?", xpReward: 50,
    steps: [
      { type: "quiz", title: "Systems", difficulty: "easy", question: "What is a system?", options: [{ label: "A", text: "Single program" }, { label: "B", text: "Interconnected components" }, { label: "C", text: "Hardware only" }], correctAnswer: "B", explanation: "Systems are interconnected components working together!" },
      { type: "quiz", title: "Boundaries", difficulty: "easy", question: "What defines system scope?", options: [{ label: "A", text: "Boundary" }, { label: "B", text: "Database" }, { label: "C", text: "Users" }], correctAnswer: "A", explanation: "Boundaries define what's in and out of scope!" },
    ],
  },
  "stakeholders": {
    id: "stakeholders", moduleId: "systems-analysis", title: "Finding Stakeholders", xpReward: 75,
    steps: [
      { type: "quiz", title: "Stakeholders", difficulty: "easy", question: "Who are stakeholders?", options: [{ label: "A", text: "Only managers" }, { label: "B", text: "Anyone affected by system" }, { label: "C", text: "Developers only" }], correctAnswer: "B", explanation: "Stakeholders include all affected parties!" },
      { type: "quiz", title: "Primary Users", difficulty: "medium", question: "Primary stakeholders are?", options: [{ label: "A", text: "Indirect users" }, { label: "B", text: "Direct system users" }, { label: "C", text: "Competitors" }], correctAnswer: "B", explanation: "Primary stakeholders directly use the system!" },
    ],
  },
  "requirements": {
    id: "requirements", moduleId: "systems-analysis", title: "Gathering Requirements", xpReward: 100,
    steps: [
      { type: "quiz", title: "Requirements Types", difficulty: "medium", question: "Functional requirements describe?", options: [{ label: "A", text: "Performance" }, { label: "B", text: "What system does" }, { label: "C", text: "Security" }], correctAnswer: "B", explanation: "Functional = what it does. Non-functional = how well!" },
      { type: "quiz", title: "Elicitation", difficulty: "medium", question: "Best way to gather requirements?", options: [{ label: "A", text: "Assume needs" }, { label: "B", text: "Interview stakeholders" }, { label: "C", text: "Copy competitors" }], correctAnswer: "B", explanation: "Always talk to actual stakeholders!" },
    ],
  },
  "use-cases": {
    id: "use-cases", moduleId: "systems-analysis", title: "Use Cases", xpReward: 100,
    steps: [
      { type: "quiz", title: "Use Cases", difficulty: "medium", question: "Use cases describe?", options: [{ label: "A", text: "Database schema" }, { label: "B", text: "User interactions" }, { label: "C", text: "Code structure" }], correctAnswer: "B", explanation: "Use cases describe user-system interactions!" },
      { type: "quiz", title: "Actors", difficulty: "medium", question: "What is an actor?", options: [{ label: "A", text: "Database" }, { label: "B", text: "External entity" }, { label: "C", text: "Variable" }], correctAnswer: "B", explanation: "Actors are external entities interacting with system!" },
    ],
  },
};

// Math for Computing Module  
export const mathLessons: Record<string, LessonData> = {
  "number-systems": {
    id: "number-systems", moduleId: "math-computing", title: "Number Systems", xpReward: 75,
    steps: [
      { type: "quiz", title: "Binary", difficulty: "medium", question: "Binary uses which digits?", options: [{ label: "A", text: "0-9" }, { label: "B", text: "0 and 1" }, { label: "C", text: "0-F" }], correctAnswer: "B", explanation: "Binary (base 2) uses only 0 and 1!" },
      { type: "quiz", title: "Hexadecimal", difficulty: "medium", question: "Hex base is?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "16" }], correctAnswer: "C", explanation: "Hexadecimal is base 16 (0-9, A-F)!" },
    ],
  },
  "logic-gates": {
    id: "logic-gates", moduleId: "math-computing", title: "Logic & Truth", xpReward: 100,
    steps: [
      { type: "quiz", title: "AND Gate", difficulty: "medium", question: "true AND false = ?", options: [{ label: "A", text: "true" }, { label: "B", text: "false" }, { label: "C", text: "undefined" }], correctAnswer: "B", explanation: "AND requires BOTH to be true!" },
      { type: "quiz", title: "OR Gate", difficulty: "medium", question: "true OR false = ?", options: [{ label: "A", text: "true" }, { label: "B", text: "false" }, { label: "C", text: "undefined" }], correctAnswer: "A", explanation: "OR needs at least ONE to be true!" },
    ],
  },
  "complexity": {
    id: "complexity", moduleId: "math-computing", title: "Big-O Notation", xpReward: 175,
    steps: [
      { type: "quiz", title: "O(1)", difficulty: "hard", question: "O(1) means?", options: [{ label: "A", text: "Linear time" }, { label: "B", text: "Constant time" }, { label: "C", text: "Quadratic" }], correctAnswer: "B", explanation: "O(1) = same time regardless of input size!" },
      { type: "quiz", title: "O(n)", difficulty: "hard", question: "O(n) example?", options: [{ label: "A", text: "Array access" }, { label: "B", text: "Loop through array" }, { label: "C", text: "Binary search" }], correctAnswer: "B", explanation: "Single loop = linear O(n) time!" },
    ],
  },
};

// Combined lessons lookup
export const allLessons: Record<string, LessonData> = {
  ...javaLessons,
  ...systemsLessons,
  ...mathLessons,
};

// Default lesson for unimplemented content
export const defaultLesson: LessonData = {
  id: "coming-soon", moduleId: "default", title: "Coming Soon", xpReward: 25,
  steps: [
    { type: "quiz", title: "Preview", difficulty: "easy", question: "This lesson is being prepared. Are you excited?", options: [{ label: "A", text: "Yes, I'm excited!" }, { label: "B", text: "Can't wait!" }], correctAnswer: "A", explanation: "More comprehensive lessons coming soon!" },
  ],
};

export function getLesson(lessonId: string): LessonData {
  return allLessons[lessonId] || defaultLesson;
}
