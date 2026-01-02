// Comprehensive lesson data for all modules - Three full courses

export interface LessonStep {
  type: "typing" | "quiz" | "placement" | "debug";
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prompt?: string;
  codeToType?: string;
  question?: string;
  codeExample?: string;
  options?: { label: string; text: string }[];
  correctAnswer?: string;
  explanation: string;
  placementOptions?: string[];
  correctPlacement?: string;
}

export interface LessonData {
  id: string;
  title: string;
  moduleId: string;
  steps: LessonStep[];
  xpReward: number;
  category: string;
}

// ==========================================
// COURSE 1: PROGRAMMING WITH JAVA
// ==========================================

export const javaLessons: Record<string, LessonData> = {
  // === FOUNDATIONS ===
  "hello-world": {
    id: "hello-world", moduleId: "java-foundations", title: "Hello World!", xpReward: 50, category: "Foundations",
    steps: [
      { type: "typing", title: "First Program", difficulty: "easy", prompt: "Type your first Java output!", codeToType: 'System.out.println("Hello World!");', explanation: "println() prints text and moves to a new line. Every Java statement ends with a semicolon." },
      { type: "quiz", title: "Output Methods", difficulty: "easy", question: "What do we use to print text in Java?", options: [{ label: "A", text: "print()" }, { label: "B", text: "System.out.println()" }, { label: "C", text: "console.log()" }], correctAnswer: "B", explanation: "System.out.println() is Java's console output method! It prints and moves to a new line." },
      { type: "typing", title: "Custom Message", difficulty: "easy", prompt: "Print a welcome message!", codeToType: 'System.out.println("Welcome to Java!");', explanation: "Text inside double quotes is called a String literal." },
      { type: "quiz", title: "Statement End", difficulty: "easy", question: "What character ends every Java statement?", options: [{ label: "A", text: "Period (.)" }, { label: "B", text: "Colon (:)" }, { label: "C", text: "Semicolon (;)" }], correctAnswer: "C", explanation: "Semicolons are mandatory in Java - they mark the end of each statement!" },
      { type: "typing", title: "Print Without Newline", difficulty: "easy", prompt: "Print without moving to new line!", codeToType: 'System.out.print("Same line");', explanation: "print() outputs text but stays on the same line - no newline added." },
      { type: "quiz", title: "Main Method", difficulty: "medium", question: "What is the entry point of a Java program?", options: [{ label: "A", text: "start()" }, { label: "B", text: "main()" }, { label: "C", text: "run()" }], correctAnswer: "B", explanation: "The main method is where Java programs begin execution!" },
    ],
  },
  "variables": {
    id: "variables", moduleId: "java-foundations", title: "Variables", xpReward: 75, category: "Foundations",
    steps: [
      { type: "typing", title: "Integer Variable", difficulty: "easy", prompt: "Create a variable to store age!", codeToType: "int age = 25;", explanation: "int stores whole numbers. Variables are named containers that hold values." },
      { type: "typing", title: "String Variable", difficulty: "easy", prompt: "Create a variable for a name!", codeToType: 'String name = "Java";', explanation: "String stores text. Note the capital S - String is a class in Java." },
      { type: "quiz", title: "Variable Types", difficulty: "easy", question: "What type stores whole numbers?", options: [{ label: "A", text: "String" }, { label: "B", text: "int" }, { label: "C", text: "boolean" }], correctAnswer: "B", explanation: "int stores integers like 1, 42, -7. It cannot store decimals!" },
      { type: "typing", title: "Boolean Variable", difficulty: "easy", prompt: "Create a true/false variable!", codeToType: "boolean isActive = true;", explanation: "boolean stores only true or false - nothing else." },
      { type: "typing", title: "Variable Update", difficulty: "easy", prompt: "Update a variable's value!", codeToType: "age = 30;", explanation: "Once declared, you can change a variable's value without repeating the type." },
      { type: "quiz", title: "Naming Rules", difficulty: "medium", question: "Which is a valid variable name?", options: [{ label: "A", text: "2name" }, { label: "B", text: "my-var" }, { label: "C", text: "myVar" }], correctAnswer: "C", explanation: "Variables can't start with numbers or contain hyphens. Use camelCase!" },
      { type: "typing", title: "Final Variable", difficulty: "medium", prompt: "Create a constant!", codeToType: "final int MAX = 100;", explanation: "final makes a variable constant - it cannot be changed after assignment." },
    ],
  },
  "data-types": {
    id: "data-types", moduleId: "java-foundations", title: "Data Types", xpReward: 100, category: "Foundations",
    steps: [
      { type: "typing", title: "Double Type", difficulty: "easy", prompt: "Store a decimal number!", codeToType: "double price = 19.99;", explanation: "double stores decimal numbers with high precision - 15-16 digits." },
      { type: "typing", title: "Float Type", difficulty: "easy", prompt: "Create a float variable!", codeToType: "float temp = 36.5f;", explanation: "float needs 'f' suffix and has less precision than double (6-7 digits)." },
      { type: "quiz", title: "Precision", difficulty: "medium", question: "Which has more decimal precision?", options: [{ label: "A", text: "float" }, { label: "B", text: "double" }, { label: "C", text: "int" }], correctAnswer: "B", explanation: "double has ~15 digits of precision vs float's ~7 digits!" },
      { type: "typing", title: "Char Type", difficulty: "easy", prompt: "Store a single character!", codeToType: "char grade = 'A';", explanation: "char stores ONE character in single quotes - not double quotes!" },
      { type: "typing", title: "Long Type", difficulty: "medium", prompt: "Store a very large number!", codeToType: "long population = 8000000000L;", explanation: "long needs 'L' suffix for large numbers beyond int's range." },
      { type: "quiz", title: "Byte Range", difficulty: "hard", question: "What's the range of byte?", options: [{ label: "A", text: "0 to 255" }, { label: "B", text: "-128 to 127" }, { label: "C", text: "-256 to 256" }], correctAnswer: "B", explanation: "byte is 8 bits signed: -128 to 127. Use for small numbers to save memory." },
      { type: "typing", title: "Short Type", difficulty: "medium", prompt: "Create a short integer!", codeToType: "short count = 1000;", explanation: "short is 16-bit integer: -32,768 to 32,767. Between byte and int." },
    ],
  },
  "operators": {
    id: "operators", moduleId: "java-foundations", title: "Operators", xpReward: 100, category: "Foundations",
    steps: [
      { type: "typing", title: "Addition", difficulty: "easy", prompt: "Add two numbers!", codeToType: "int sum = 5 + 3;", explanation: "The + operator adds numbers together. Result: 8" },
      { type: "typing", title: "Multiplication", difficulty: "easy", prompt: "Multiply numbers!", codeToType: "int product = 4 * 7;", explanation: "The * operator multiplies. Result: 28" },
      { type: "quiz", title: "Modulo", difficulty: "medium", question: "What is 10 % 3?", options: [{ label: "A", text: "3" }, { label: "B", text: "1" }, { label: "C", text: "0" }], correctAnswer: "B", explanation: "% returns the remainder. 10 ÷ 3 = 3 remainder 1!" },
      { type: "typing", title: "Comparison", difficulty: "medium", prompt: "Compare two values!", codeToType: "boolean isEqual = (x == y);", explanation: "== checks equality and returns true or false. Note: = assigns, == compares!" },
      { type: "typing", title: "Increment", difficulty: "medium", prompt: "Increase by one!", codeToType: "count++;", explanation: "++ adds 1 to a variable. Same as count = count + 1;" },
      { type: "quiz", title: "Logical AND", difficulty: "medium", question: "What does && mean?", options: [{ label: "A", text: "OR" }, { label: "B", text: "NOT" }, { label: "C", text: "AND" }], correctAnswer: "C", explanation: "&& is logical AND - both conditions must be true!" },
      { type: "typing", title: "Compound Assignment", difficulty: "medium", prompt: "Add and assign!", codeToType: "total += 10;", explanation: "+= adds and assigns. Same as total = total + 10;" },
      { type: "quiz", title: "Ternary Operator", difficulty: "hard", question: "What does ? : do?", options: [{ label: "A", text: "Loop" }, { label: "B", text: "Conditional expression" }, { label: "C", text: "Define method" }], correctAnswer: "B", explanation: "Ternary operator: condition ? valueIfTrue : valueIfFalse" },
    ],
  },
  "strings": {
    id: "strings", moduleId: "java-foundations", title: "Strings", xpReward: 100, category: "Foundations",
    steps: [
      { type: "typing", title: "String Creation", difficulty: "easy", prompt: "Create a greeting!", codeToType: 'String greeting = "Hello";', explanation: "Strings hold text. They're immutable - once created, they can't be changed." },
      { type: "typing", title: "Concatenation", difficulty: "easy", prompt: "Join two strings!", codeToType: 'String full = first + " " + last;', explanation: "Use + to concatenate (join) strings. Don't forget spaces!" },
      { type: "quiz", title: "String Methods", difficulty: "medium", question: "What does .length() return?", options: [{ label: "A", text: "First character" }, { label: "B", text: "Number of characters" }, { label: "C", text: "Last character" }], correctAnswer: "B", explanation: ".length() counts all characters including spaces!" },
      { type: "typing", title: "Uppercase", difficulty: "medium", prompt: "Convert to uppercase!", codeToType: "String upper = text.toUpperCase();", explanation: "toUpperCase() returns a NEW string - original stays unchanged." },
      { type: "typing", title: "Substring", difficulty: "medium", prompt: "Extract part of a string!", codeToType: "String sub = text.substring(0, 5);", explanation: "substring(start, end) extracts characters from start up to (not including) end." },
      { type: "quiz", title: "String Comparison", difficulty: "medium", question: "How to compare strings?", options: [{ label: "A", text: "==" }, { label: "B", text: ".equals()" }, { label: "C", text: "=" }], correctAnswer: "B", explanation: "Use .equals() for string content comparison, not ==!" },
      { type: "typing", title: "Find Character", difficulty: "medium", prompt: "Get character at position!", codeToType: "char c = text.charAt(0);", explanation: "charAt(index) returns the character at that position. Index starts at 0!" },
      { type: "typing", title: "String Contains", difficulty: "medium", prompt: "Check if string contains text!", codeToType: 'boolean has = text.contains("Java");', explanation: "contains() checks if substring exists. Case-sensitive!" },
    ],
  },

  // === CONTROL FLOW ===
  "if-statements": {
    id: "if-statements", moduleId: "java-foundations", title: "If Statements", xpReward: 100, category: "Control Flow",
    steps: [
      { type: "typing", title: "Simple If", difficulty: "medium", prompt: "Write an if statement!", codeToType: "if (age >= 18) { }", explanation: "if checks a condition. Code inside { } runs only when condition is true." },
      { type: "quiz", title: "Conditions", difficulty: "medium", question: "What does >= mean?", options: [{ label: "A", text: "Greater than" }, { label: "B", text: "Greater or equal" }, { label: "C", text: "Equal" }], correctAnswer: "B", explanation: ">= means greater than OR equal to. 18 >= 18 is true!" },
      { type: "typing", title: "If-Else", difficulty: "medium", prompt: "Add an else clause!", codeToType: "if (score > 50) { } else { }", explanation: "else runs when the if condition is false. One or the other always runs." },
      { type: "typing", title: "Nested Condition", difficulty: "medium", prompt: "Combine conditions with AND!", codeToType: "if (age > 18 && hasID) { }", explanation: "&& means AND - both conditions must be true." },
      { type: "quiz", title: "OR Operator", difficulty: "medium", question: "What does || mean?", options: [{ label: "A", text: "AND" }, { label: "B", text: "NOT" }, { label: "C", text: "OR" }], correctAnswer: "C", explanation: "|| means OR - at least one condition must be true!" },
      { type: "typing", title: "NOT Operator", difficulty: "medium", prompt: "Negate a condition!", codeToType: "if (!isLocked) { }", explanation: "! means NOT - inverts true to false and vice versa." },
    ],
  },
  "else-elseif": {
    id: "else-elseif", moduleId: "java-foundations", title: "Else & Else If", xpReward: 100, category: "Control Flow",
    steps: [
      { type: "typing", title: "Else If", difficulty: "medium", prompt: "Add multiple conditions!", codeToType: "if (grade >= 90) { } else if (grade >= 80) { }", explanation: "else if adds additional conditions - checked only if previous conditions were false." },
      { type: "quiz", title: "Control Flow", difficulty: "medium", question: "How many else can an if have?", options: [{ label: "A", text: "Unlimited" }, { label: "B", text: "Only one" }, { label: "C", text: "None" }], correctAnswer: "B", explanation: "Only ONE else allowed, but unlimited else if branches!" },
      { type: "typing", title: "Complete Chain", difficulty: "medium", prompt: "Write full if-else chain!", codeToType: "if (x > 0) { } else if (x < 0) { } else { }", explanation: "Final else catches all remaining cases - like a safety net." },
      { type: "quiz", title: "Grade System", difficulty: "hard", question: "For grade 85, which branch runs?", codeExample: "if(g>=90) A else if(g>=80) B else C", options: [{ label: "A", text: "A branch" }, { label: "B", text: "B branch" }, { label: "C", text: "C branch" }], correctAnswer: "B", explanation: "85 is not >= 90, but is >= 80, so B branch executes!" },
    ],
  },
  "switch-statements": {
    id: "switch-statements", moduleId: "java-foundations", title: "Switch Statements", xpReward: 100, category: "Control Flow",
    steps: [
      { type: "typing", title: "Basic Switch", difficulty: "medium", prompt: "Create a switch statement!", codeToType: "switch (day) { case 1: break; }", explanation: "switch checks one variable against multiple values - cleaner than many if-else." },
      { type: "quiz", title: "Switch Usage", difficulty: "medium", question: "What keyword exits a case?", options: [{ label: "A", text: "exit" }, { label: "B", text: "break" }, { label: "C", text: "stop" }], correctAnswer: "B", explanation: "break exits the switch. Without it, code 'falls through' to next case!" },
      { type: "typing", title: "Default Case", difficulty: "medium", prompt: "Add default case!", codeToType: "switch (x) { default: break; }", explanation: "default runs when no case matches - like else in if statements." },
      { type: "typing", title: "Multiple Cases", difficulty: "medium", prompt: "Group cases together!", codeToType: "case 1: case 2: case 3:", explanation: "Multiple cases can share the same code by stacking them." },
      { type: "quiz", title: "Switch Types", difficulty: "hard", question: "Switch works with?", options: [{ label: "A", text: "Only int" }, { label: "B", text: "int, char, String, enum" }, { label: "C", text: "Any type" }], correctAnswer: "B", explanation: "Switch supports int, char, String (Java 7+), and enums!" },
    ],
  },
  "for-loops": {
    id: "for-loops", moduleId: "java-foundations", title: "For Loops", xpReward: 125, category: "Control Flow",
    steps: [
      { type: "typing", title: "Basic For Loop", difficulty: "medium", prompt: "Count from 0 to 4!", codeToType: "for (int i = 0; i < 5; i++) { }", explanation: "for(start; condition; increment) - three parts separated by semicolons." },
      { type: "quiz", title: "Loop Count", difficulty: "medium", question: "How many times does i < 3 loop?", options: [{ label: "A", text: "2 times" }, { label: "B", text: "3 times" }, { label: "C", text: "4 times" }], correctAnswer: "B", explanation: "i = 0, 1, 2 → three iterations. Loop stops when i reaches 3." },
      { type: "typing", title: "Reverse Loop", difficulty: "medium", prompt: "Count backwards!", codeToType: "for (int i = 5; i > 0; i--) { }", explanation: "i-- decrements. Loop runs while i > 0, so: 5, 4, 3, 2, 1." },
      { type: "typing", title: "For-Each Loop", difficulty: "medium", prompt: "Loop through array!", codeToType: "for (String s : array) { }", explanation: "Enhanced for loop - reads each element automatically. Simpler but less control." },
      { type: "quiz", title: "Break Statement", difficulty: "medium", question: "What does break do in a loop?", options: [{ label: "A", text: "Skip iteration" }, { label: "B", text: "Exit loop completely" }, { label: "C", text: "Restart loop" }], correctAnswer: "B", explanation: "break immediately exits the entire loop!" },
      { type: "typing", title: "Continue Statement", difficulty: "medium", prompt: "Skip even numbers!", codeToType: "if (i % 2 == 0) continue;", explanation: "continue skips to the next iteration, doesn't exit the loop." },
      { type: "typing", title: "Nested Loop", difficulty: "hard", prompt: "Create a nested loop!", codeToType: "for (int i = 0; i < 3; i++) { for (int j = 0; j < 3; j++) { } }", explanation: "Loops inside loops - inner loop runs completely for each outer iteration." },
    ],
  },
  "while-loops": {
    id: "while-loops", moduleId: "java-foundations", title: "While Loops", xpReward: 125, category: "Control Flow",
    steps: [
      { type: "typing", title: "While Loop", difficulty: "medium", prompt: "Create a while loop!", codeToType: "while (count < 10) { count++; }", explanation: "while repeats as long as condition is true. Must change condition inside or infinite loop!" },
      { type: "quiz", title: "Loop Types", difficulty: "medium", question: "When does while check condition?", options: [{ label: "A", text: "After each loop" }, { label: "B", text: "Before each loop" }, { label: "C", text: "Only once" }], correctAnswer: "B", explanation: "while checks BEFORE each iteration - may run 0 times if false initially!" },
      { type: "typing", title: "Do-While", difficulty: "medium", prompt: "Create a do-while loop!", codeToType: "do { x++; } while (x < 5);", explanation: "do-while checks AFTER - always runs at least once!" },
      { type: "quiz", title: "Infinite Loop", difficulty: "hard", question: "What causes infinite loop?", options: [{ label: "A", text: "Condition always true" }, { label: "B", text: "Too many variables" }, { label: "C", text: "Using while" }], correctAnswer: "A", explanation: "If condition never becomes false, loop runs forever!" },
      { type: "typing", title: "Input Validation", difficulty: "hard", prompt: "Loop until valid input!", codeToType: "while (!isValid) { input = getInput(); }", explanation: "Common pattern: keep asking until user provides valid input." },
    ],
  },

  // === METHODS ===
  "methods": {
    id: "methods", moduleId: "java-foundations", title: "Methods", xpReward: 150, category: "Methods",
    steps: [
      { type: "typing", title: "Void Method", difficulty: "medium", prompt: "Create a simple method!", codeToType: "public void greet() { }", explanation: "void means no return value. public makes it accessible from other classes." },
      { type: "typing", title: "Return Method", difficulty: "medium", prompt: "Method that returns int!", codeToType: "public int add(int a, int b) { return a + b; }", explanation: "Return type before name. return sends value back to caller." },
      { type: "quiz", title: "Method Concepts", difficulty: "medium", question: "What does 'void' mean?", options: [{ label: "A", text: "Returns string" }, { label: "B", text: "Returns nothing" }, { label: "C", text: "Private method" }], correctAnswer: "B", explanation: "void = no return value. The method does something but doesn't give back a result." },
      { type: "typing", title: "Method Call", difficulty: "medium", prompt: "Call a method!", codeToType: "int result = add(5, 3);", explanation: "Call methods by name with arguments in parentheses." },
      { type: "quiz", title: "Parameters", difficulty: "medium", question: "Parameters are?", options: [{ label: "A", text: "Return values" }, { label: "B", text: "Input values to method" }, { label: "C", text: "Method names" }], correctAnswer: "B", explanation: "Parameters are inputs defined in method signature, arguments are actual values passed!" },
      { type: "typing", title: "Static Method", difficulty: "hard", prompt: "Create a static method!", codeToType: "public static void main(String[] args) { }", explanation: "static methods belong to class, not instance. Can be called without creating object." },
    ],
  },
  "method-overloading": {
    id: "method-overloading", moduleId: "java-foundations", title: "Method Overloading", xpReward: 150, category: "Methods",
    steps: [
      { type: "quiz", title: "Overloading", difficulty: "hard", question: "What is method overloading?", options: [{ label: "A", text: "Same name, different parameters" }, { label: "B", text: "Same name, same parameters" }, { label: "C", text: "Different name, same parameters" }], correctAnswer: "A", explanation: "Overloading = same method name with different parameter types or counts." },
      { type: "typing", title: "Overloaded Method", difficulty: "hard", prompt: "Create overloaded add methods!", codeToType: "public int add(int a, int b) { return a + b; }", explanation: "First version takes two ints." },
      { type: "typing", title: "Second Overload", difficulty: "hard", prompt: "Add three number version!", codeToType: "public int add(int a, int b, int c) { return a + b + c; }", explanation: "Same name 'add' but three parameters - Java knows which to call based on arguments." },
      { type: "quiz", title: "Return Type", difficulty: "hard", question: "Can overloading differ by return type only?", options: [{ label: "A", text: "Yes" }, { label: "B", text: "No" }, { label: "C", text: "Sometimes" }], correctAnswer: "B", explanation: "No! Overloading requires different parameters, not just different return type." },
    ],
  },

  // === DATA STRUCTURES ===
  "arrays": {
    id: "arrays", moduleId: "java-foundations", title: "Arrays", xpReward: 150, category: "Data Structures",
    steps: [
      { type: "typing", title: "Array Creation", difficulty: "medium", prompt: "Create an integer array!", codeToType: "int[] nums = {1, 2, 3, 4, 5};", explanation: "Arrays store multiple values of the same type in order." },
      { type: "typing", title: "Array Access", difficulty: "medium", prompt: "Access first element!", codeToType: "int first = nums[0];", explanation: "Array indexes start at 0, not 1! First element is [0]." },
      { type: "quiz", title: "Array Index", difficulty: "medium", question: "Array indexes start at?", options: [{ label: "A", text: "1" }, { label: "B", text: "0" }, { label: "C", text: "-1" }], correctAnswer: "B", explanation: "Zero-indexed: first = [0], second = [1], etc." },
      { type: "typing", title: "Array Length", difficulty: "medium", prompt: "Get array size!", codeToType: "int size = nums.length;", explanation: "length is a property (no parentheses!) that gives array size." },
      { type: "typing", title: "Array New", difficulty: "medium", prompt: "Create empty array of size 10!", codeToType: "int[] arr = new int[10];", explanation: "new creates array with default values (0 for int, null for objects)." },
      { type: "quiz", title: "Array Modify", difficulty: "medium", question: "Can array size change?", options: [{ label: "A", text: "Yes" }, { label: "B", text: "No" }, { label: "C", text: "Only grow" }], correctAnswer: "B", explanation: "Arrays have FIXED size once created. Use ArrayList for dynamic sizing!" },
      { type: "typing", title: "2D Array", difficulty: "hard", prompt: "Create a 2D array!", codeToType: "int[][] matrix = new int[3][3];", explanation: "2D arrays are arrays of arrays - like a grid or matrix." },
    ],
  },
  "arraylists": {
    id: "arraylists", moduleId: "java-foundations", title: "ArrayLists", xpReward: 175, category: "Data Structures",
    steps: [
      { type: "typing", title: "ArrayList Creation", difficulty: "hard", prompt: "Create an ArrayList!", codeToType: "ArrayList<String> list = new ArrayList<>();", explanation: "ArrayList can grow/shrink dynamically. <String> specifies the type it holds." },
      { type: "typing", title: "Add Element", difficulty: "hard", prompt: "Add to the list!", codeToType: 'list.add("Java");', explanation: "add() appends to the end. ArrayList handles resizing automatically." },
      { type: "quiz", title: "ArrayList vs Array", difficulty: "hard", question: "ArrayList advantage over array?", options: [{ label: "A", text: "Faster" }, { label: "B", text: "Dynamic size" }, { label: "C", text: "Smaller memory" }], correctAnswer: "B", explanation: "ArrayList grows/shrinks automatically. Arrays have fixed size once created." },
      { type: "typing", title: "Get Element", difficulty: "hard", prompt: "Get element at index!", codeToType: "String item = list.get(0);", explanation: "get(index) retrieves element. Unlike arrays, use method not brackets." },
      { type: "typing", title: "Remove Element", difficulty: "hard", prompt: "Remove from list!", codeToType: "list.remove(0);", explanation: "remove(index) removes element and shifts remaining elements left." },
      { type: "quiz", title: "Size Method", difficulty: "medium", question: "Get ArrayList size with?", options: [{ label: "A", text: ".length" }, { label: "B", text: ".size()" }, { label: "C", text: ".count()" }], correctAnswer: "B", explanation: "ArrayList uses size() method, not length property!" },
    ],
  },
  "collections": {
    id: "collections", moduleId: "java-foundations", title: "Collections", xpReward: 200, category: "Data Structures",
    steps: [
      { type: "typing", title: "HashSet", difficulty: "hard", prompt: "Create a HashSet!", codeToType: "HashSet<Integer> set = new HashSet<>();", explanation: "HashSet stores unique values only - duplicates are ignored." },
      { type: "typing", title: "HashMap", difficulty: "hard", prompt: "Create a HashMap!", codeToType: "HashMap<String, Integer> map = new HashMap<>();", explanation: "HashMap stores key-value pairs. Fast lookups by key." },
      { type: "quiz", title: "Set Property", difficulty: "hard", question: "What makes Set special?", options: [{ label: "A", text: "Ordered" }, { label: "B", text: "No duplicates" }, { label: "C", text: "Fixed size" }], correctAnswer: "B", explanation: "Sets automatically prevent duplicates. Adding a duplicate does nothing." },
      { type: "typing", title: "Map Put", difficulty: "hard", prompt: "Add to HashMap!", codeToType: 'map.put("score", 100);', explanation: "put(key, value) adds or updates entry. Keys must be unique!" },
      { type: "typing", title: "Map Get", difficulty: "hard", prompt: "Get from HashMap!", codeToType: 'int val = map.get("score");', explanation: "get(key) returns value. Returns null if key doesn't exist!" },
      { type: "quiz", title: "List vs Set", difficulty: "hard", question: "List allows duplicates?", options: [{ label: "A", text: "Yes" }, { label: "B", text: "No" }, { label: "C", text: "Only numbers" }], correctAnswer: "A", explanation: "List allows duplicates and maintains order. Set has unique elements only!" },
    ],
  },

  // === OOP ===
  "classes": {
    id: "classes", moduleId: "java-foundations", title: "Classes & Objects", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Class Definition", difficulty: "hard", prompt: "Create a Dog class!", codeToType: "public class Dog { }", explanation: "Classes are blueprints. Objects are instances built from blueprints." },
      { type: "typing", title: "Field", difficulty: "hard", prompt: "Add a name field!", codeToType: "private String name;", explanation: "private = only this class can access directly. Encapsulation!" },
      { type: "typing", title: "Constructor", difficulty: "hard", prompt: "Create a constructor!", codeToType: "public Dog(String name) { this.name = name; }", explanation: "Constructors initialize objects. 'this' refers to current instance." },
      { type: "quiz", title: "Object Creation", difficulty: "hard", question: "How to create an object?", options: [{ label: "A", text: "Dog d = Dog();" }, { label: "B", text: "Dog d = new Dog();" }, { label: "C", text: "new Dog d;" }], correctAnswer: "B", explanation: "new keyword creates objects. Dog d = new Dog();" },
      { type: "typing", title: "Getter Method", difficulty: "hard", prompt: "Create a getter!", codeToType: "public String getName() { return name; }", explanation: "Getters provide read access to private fields. Convention: getFieldName()." },
      { type: "typing", title: "Setter Method", difficulty: "hard", prompt: "Create a setter!", codeToType: "public void setName(String name) { this.name = name; }", explanation: "Setters allow controlled modification of private fields." },
    ],
  },
  "inheritance": {
    id: "inheritance", moduleId: "java-foundations", title: "Inheritance", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Extends", difficulty: "hard", prompt: "Create a child class!", codeToType: "public class Puppy extends Dog { }", explanation: "extends creates inheritance. Puppy gets all Dog's public/protected members." },
      { type: "quiz", title: "Inheritance Concept", difficulty: "hard", question: "Inheritance promotes?", options: [{ label: "A", text: "Code duplication" }, { label: "B", text: "Code reuse" }, { label: "C", text: "Slower code" }], correctAnswer: "B", explanation: "Inheritance avoids rewriting code - child classes inherit parent behavior!" },
      { type: "typing", title: "Super Call", difficulty: "hard", prompt: "Call parent constructor!", codeToType: "super(name);", explanation: "super() calls parent constructor. Must be first statement in child constructor." },
      { type: "typing", title: "Override Method", difficulty: "hard", prompt: "Override a method!", codeToType: "@Override public void bark() { }", explanation: "@Override annotation indicates method replaces parent version." },
      { type: "quiz", title: "Multiple Inheritance", difficulty: "hard", question: "Can a class extend multiple classes?", options: [{ label: "A", text: "Yes" }, { label: "B", text: "No" }, { label: "C", text: "Only abstract" }], correctAnswer: "B", explanation: "Java has single inheritance for classes. Use interfaces for multiple inheritance!" },
    ],
  },
  "interfaces": {
    id: "interfaces", moduleId: "java-foundations", title: "Interfaces", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Interface Definition", difficulty: "hard", prompt: "Create an interface!", codeToType: "public interface Runnable { void run(); }", explanation: "Interfaces define contracts - what methods a class must implement." },
      { type: "typing", title: "Implement Interface", difficulty: "hard", prompt: "Implement an interface!", codeToType: "public class Runner implements Runnable { }", explanation: "implements means class promises to provide all interface methods." },
      { type: "quiz", title: "Interface vs Class", difficulty: "hard", question: "Interfaces can have?", options: [{ label: "A", text: "Instance fields" }, { label: "B", text: "Abstract methods" }, { label: "C", text: "Constructors" }], correctAnswer: "B", explanation: "Interfaces have method signatures. Java 8+ allows default implementations too." },
      { type: "quiz", title: "Multiple Interfaces", difficulty: "hard", question: "Can a class implement multiple interfaces?", options: [{ label: "A", text: "No" }, { label: "B", text: "Yes" }, { label: "C", text: "Only two" }], correctAnswer: "B", explanation: "Yes! class X implements A, B, C - multiple interfaces allowed!" },
    ],
  },
  "constructors": {
    id: "constructors", moduleId: "java-foundations", title: "Constructors", xpReward: 175, category: "OOP",
    steps: [
      { type: "typing", title: "Constructor", difficulty: "hard", prompt: "Create a constructor!", codeToType: "public Dog(String name) { this.name = name; }", explanation: "'this' refers to current object. Constructor initializes new objects." },
      { type: "quiz", title: "New Keyword", difficulty: "hard", question: "What does 'new' do?", options: [{ label: "A", text: "Deletes object" }, { label: "B", text: "Creates object" }, { label: "C", text: "Updates object" }], correctAnswer: "B", explanation: "new creates a new instance (object) of a class in memory." },
      { type: "typing", title: "Default Constructor", difficulty: "hard", prompt: "No-arg constructor!", codeToType: "public Dog() { this.name = \"Unknown\"; }", explanation: "Default constructor takes no arguments and sets default values." },
    ],
  },
  "polymorphism": {
    id: "polymorphism", moduleId: "java-foundations", title: "Polymorphism", xpReward: 225, category: "OOP",
    steps: [
      { type: "quiz", title: "Polymorphism", difficulty: "hard", question: "What is polymorphism?", options: [{ label: "A", text: "One interface, multiple forms" }, { label: "B", text: "Multiple inheritance" }, { label: "C", text: "Private methods" }], correctAnswer: "A", explanation: "Poly = many, morph = form. Same interface, different implementations." },
      { type: "typing", title: "Polymorphic Reference", difficulty: "hard", prompt: "Use parent type for child!", codeToType: "Animal myPet = new Dog();", explanation: "Parent type reference can hold child objects. Runtime decides which method runs." },
    ],
  },
  "encapsulation": {
    id: "encapsulation", moduleId: "java-foundations", title: "Encapsulation", xpReward: 175, category: "OOP",
    steps: [
      { type: "typing", title: "Getter Method", difficulty: "hard", prompt: "Create a getter!", codeToType: "public String getName() { return name; }", explanation: "Getters provide read-only access to private fields." },
      { type: "typing", title: "Setter Method", difficulty: "hard", prompt: "Create a setter!", codeToType: "public void setName(String name) { this.name = name; }", explanation: "Setters allow controlled modification with validation if needed." },
      { type: "quiz", title: "Encapsulation Purpose", difficulty: "hard", question: "Why use private fields?", options: [{ label: "A", text: "Faster execution" }, { label: "B", text: "Control access and protect data" }, { label: "C", text: "Save memory" }], correctAnswer: "B", explanation: "Encapsulation protects data from invalid changes and hides implementation." },
    ],
  },

  // === EXCEPTIONS ===
  "exceptions": {
    id: "exceptions", moduleId: "java-foundations", title: "Exception Handling", xpReward: 175, category: "Exceptions",
    steps: [
      { type: "typing", title: "Try-Catch", difficulty: "hard", prompt: "Handle an exception!", codeToType: "try { } catch (Exception e) { }", explanation: "try contains risky code. catch handles errors gracefully." },
      { type: "quiz", title: "Exception Purpose", difficulty: "hard", question: "What happens in catch block?", options: [{ label: "A", text: "Normal code runs" }, { label: "B", text: "Error is handled" }, { label: "C", text: "Program exits" }], correctAnswer: "B", explanation: "catch handles errors so program can continue or fail gracefully." },
      { type: "typing", title: "Finally Block", difficulty: "hard", prompt: "Add finally block!", codeToType: "try { } catch (Exception e) { } finally { }", explanation: "finally ALWAYS runs - perfect for cleanup like closing files." },
      { type: "typing", title: "Throw Exception", difficulty: "hard", prompt: "Throw an exception!", codeToType: 'throw new IllegalArgumentException("Invalid!");', explanation: "throw creates and throws an exception when you detect an error." },
    ],
  },

  // === FILE I/O ===
  "file-io": {
    id: "file-io", moduleId: "java-foundations", title: "File I/O", xpReward: 200, category: "Advanced",
    steps: [
      { type: "typing", title: "Create File Object", difficulty: "hard", prompt: "Reference a file!", codeToType: 'File file = new File("data.txt");', explanation: "File object represents a file path. Doesn't create the file yet." },
      { type: "typing", title: "Read File", difficulty: "hard", prompt: "Read with Scanner!", codeToType: "Scanner reader = new Scanner(file);", explanation: "Scanner can read from files, just like reading user input." },
      { type: "quiz", title: "File Handling", difficulty: "hard", question: "Why close file resources?", options: [{ label: "A", text: "Style preference" }, { label: "B", text: "Free system resources" }, { label: "C", text: "Delete the file" }], correctAnswer: "B", explanation: "Unclosed files waste memory and can cause data corruption!" },
    ],
  },

  // === GENERICS ===
  "generics": {
    id: "generics", moduleId: "java-foundations", title: "Generics", xpReward: 225, category: "Advanced",
    steps: [
      { type: "typing", title: "Generic Class", difficulty: "hard", prompt: "Create generic class!", codeToType: "public class Box<T> { private T item; }", explanation: "T is a type parameter. Replaced with actual type when used." },
      { type: "quiz", title: "Generics Purpose", difficulty: "hard", question: "Why use generics?", options: [{ label: "A", text: "Faster code" }, { label: "B", text: "Type safety" }, { label: "C", text: "Smaller files" }], correctAnswer: "B", explanation: "Generics catch type errors at compile time, not runtime!" },
      { type: "typing", title: "Use Generic", difficulty: "hard", prompt: "Create typed Box!", codeToType: "Box<String> stringBox = new Box<>();", explanation: "Diamond <> infers the type. Box only holds Strings now." },
    ],
  },

  // === STREAMS ===
  "streams": {
    id: "streams", moduleId: "java-foundations", title: "Streams API", xpReward: 250, category: "Advanced",
    steps: [
      { type: "typing", title: "Create Stream", difficulty: "hard", prompt: "Stream from list!", codeToType: "list.stream()", explanation: "stream() creates a pipeline for processing collections." },
      { type: "typing", title: "Filter Stream", difficulty: "hard", prompt: "Filter elements!", codeToType: "list.stream().filter(x -> x > 5)", explanation: "filter() keeps elements matching the condition (lambda)." },
      { type: "typing", title: "Map Stream", difficulty: "hard", prompt: "Transform elements!", codeToType: "list.stream().map(x -> x * 2)", explanation: "map() transforms each element. Doesn't modify original!" },
      { type: "quiz", title: "Streams", difficulty: "hard", question: "Are streams reusable?", options: [{ label: "A", text: "Yes, always" }, { label: "B", text: "No, one-time use" }, { label: "C", text: "Only filter" }], correctAnswer: "B", explanation: "Streams are single-use! Create a new stream for each pipeline." },
    ],
  },

  // === TESTING ===
  "testing": {
    id: "testing", moduleId: "java-foundations", title: "Testing Basics", xpReward: 175, category: "Advanced",
    steps: [
      { type: "typing", title: "Test Method", difficulty: "hard", prompt: "Create a test method!", codeToType: "@Test public void testAdd() { }", explanation: "@Test marks a method as a test case. Use descriptive names!" },
      { type: "typing", title: "Assertion", difficulty: "hard", prompt: "Assert equality!", codeToType: "assertEquals(8, add(5, 3));", explanation: "assertEquals checks expected vs actual. Test fails if different." },
      { type: "quiz", title: "Testing Purpose", difficulty: "hard", question: "When should tests run?", options: [{ label: "A", text: "Only before release" }, { label: "B", text: "After every change" }, { label: "C", text: "Only when bugs found" }], correctAnswer: "B", explanation: "Run tests constantly! Catch bugs early when they're cheap to fix." },
    ],
  },
};

// ==========================================
// COURSE 2: BUSINESS INFORMATION SYSTEMS
// ==========================================

export const systemsLessons: Record<string, LessonData> = {
  // === FOUNDATIONS ===
  "what-is-system": {
    id: "what-is-system", moduleId: "systems-analysis", title: "What is a System?", xpReward: 50, category: "Foundations",
    steps: [
      { type: "quiz", title: "System Definition", difficulty: "easy", question: "What is a system?", options: [{ label: "A", text: "A single program" }, { label: "B", text: "Interconnected components working together" }, { label: "C", text: "Hardware only" }], correctAnswer: "B", explanation: "Systems are interconnected components working together toward a common goal!" },
      { type: "quiz", title: "System Boundary", difficulty: "easy", question: "What defines system scope?", options: [{ label: "A", text: "Boundary" }, { label: "B", text: "Database" }, { label: "C", text: "Users" }], correctAnswer: "A", explanation: "Boundaries define what's inside the system and what's in the environment!" },
      { type: "quiz", title: "Feedback", difficulty: "easy", question: "What is system feedback?", options: [{ label: "A", text: "User complaints" }, { label: "B", text: "Output used to adjust system" }, { label: "C", text: "Error messages" }], correctAnswer: "B", explanation: "Feedback loops help systems self-regulate and improve!" },
      { type: "quiz", title: "Input/Output", difficulty: "easy", question: "What enters a system?", options: [{ label: "A", text: "Output" }, { label: "B", text: "Input" }, { label: "C", text: "Process" }], correctAnswer: "B", explanation: "Inputs are data/resources entering; outputs are results leaving the system!" },
      { type: "quiz", title: "Environment", difficulty: "medium", question: "System environment is?", options: [{ label: "A", text: "Inside the system" }, { label: "B", text: "Everything outside the system" }, { label: "C", text: "The database" }], correctAnswer: "B", explanation: "Environment = everything outside the boundary that interacts with the system!" },
    ],
  },
  "systems-thinking": {
    id: "systems-thinking", moduleId: "systems-analysis", title: "Systems Thinking", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "Holistic View", difficulty: "easy", question: "Systems thinking focuses on?", options: [{ label: "A", text: "Individual parts" }, { label: "B", text: "The whole and relationships" }, { label: "C", text: "Just the code" }], correctAnswer: "B", explanation: "Systems thinking sees the big picture - how parts connect and affect each other!" },
      { type: "quiz", title: "Emergence", difficulty: "medium", question: "What is emergence?", options: [{ label: "A", text: "New properties from component interaction" }, { label: "B", text: "System startup" }, { label: "C", text: "Error handling" }], correctAnswer: "A", explanation: "The whole can be greater than the sum of parts - new properties emerge!" },
      { type: "quiz", title: "Interconnection", difficulty: "medium", question: "Why study relationships between parts?", options: [{ label: "A", text: "Not important" }, { label: "B", text: "Changes ripple through connected parts" }, { label: "C", text: "Only for documentation" }], correctAnswer: "B", explanation: "Changing one part affects connected parts - ripple effects!" },
      { type: "quiz", title: "Mental Models", difficulty: "medium", question: "Mental models help us?", options: [{ label: "A", text: "Understand complex systems" }, { label: "B", text: "Write code faster" }, { label: "C", text: "Ignore problems" }], correctAnswer: "A", explanation: "Mental models are simplified representations to understand complexity!" },
    ],
  },
  "stakeholders": {
    id: "stakeholders", moduleId: "systems-analysis", title: "Finding Stakeholders", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "Who Are Stakeholders", difficulty: "easy", question: "Who are stakeholders?", options: [{ label: "A", text: "Only managers" }, { label: "B", text: "Anyone affected by the system" }, { label: "C", text: "Developers only" }], correctAnswer: "B", explanation: "Stakeholders include ALL affected parties - users, managers, customers, even competitors!" },
      { type: "quiz", title: "Primary vs Secondary", difficulty: "medium", question: "Primary stakeholders are?", options: [{ label: "A", text: "Indirect users" }, { label: "B", text: "Direct system users" }, { label: "C", text: "Competitors" }], correctAnswer: "B", explanation: "Primary = direct users. Secondary = indirectly affected (managers, regulators)." },
      { type: "quiz", title: "Stakeholder Analysis", difficulty: "medium", question: "Why analyze stakeholders?", options: [{ label: "A", text: "Legal requirement" }, { label: "B", text: "Understand different needs" }, { label: "C", text: "Reduce costs" }], correctAnswer: "B", explanation: "Different stakeholders have different needs, concerns, and influence levels!" },
      { type: "quiz", title: "Power-Interest Grid", difficulty: "hard", question: "High power, high interest stakeholders need?", options: [{ label: "A", text: "Minimal contact" }, { label: "B", text: "Close management" }, { label: "C", text: "To be ignored" }], correctAnswer: "B", explanation: "High power + high interest = key players requiring close attention!" },
      { type: "quiz", title: "Stakeholder Conflicts", difficulty: "hard", question: "When stakeholders disagree?", options: [{ label: "A", text: "Ignore them" }, { label: "B", text: "Negotiate and prioritize" }, { label: "C", text: "Cancel project" }], correctAnswer: "B", explanation: "Conflict is normal - facilitate discussion and find balanced solutions!" },
    ],
  },

  // === REQUIREMENTS ===
  "requirements": {
    id: "requirements", moduleId: "systems-analysis", title: "Gathering Requirements", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Functional Requirements", difficulty: "medium", question: "Functional requirements describe?", options: [{ label: "A", text: "Performance" }, { label: "B", text: "What the system does" }, { label: "C", text: "Security" }], correctAnswer: "B", explanation: "Functional = what it does. 'System shall allow users to login.'" },
      { type: "quiz", title: "Non-Functional", difficulty: "medium", question: "Non-functional requirements describe?", options: [{ label: "A", text: "Features" }, { label: "B", text: "How well it performs" }, { label: "C", text: "User roles" }], correctAnswer: "B", explanation: "Non-functional = quality attributes like speed, security, usability." },
      { type: "quiz", title: "Elicitation Methods", difficulty: "medium", question: "Best way to gather requirements?", options: [{ label: "A", text: "Assume needs" }, { label: "B", text: "Interview stakeholders" }, { label: "C", text: "Copy competitors" }], correctAnswer: "B", explanation: "Direct stakeholder engagement: interviews, workshops, observation!" },
      { type: "quiz", title: "SMART Requirements", difficulty: "hard", question: "SMART stands for?", options: [{ label: "A", text: "Simple, Modern, Automated, Real, Tested" }, { label: "B", text: "Specific, Measurable, Achievable, Relevant, Time-bound" }, { label: "C", text: "System, Method, Analysis, Review, Test" }], correctAnswer: "B", explanation: "Good requirements are SMART - clear, testable, and realistic!" },
      { type: "quiz", title: "MoSCoW", difficulty: "hard", question: "MoSCoW prioritization includes?", options: [{ label: "A", text: "Must, Should, Could, Won't" }, { label: "B", text: "Major, Small, Critical, Warning" }, { label: "C", text: "Module, System, Component, Widget" }], correctAnswer: "A", explanation: "MoSCoW helps prioritize: Must have, Should have, Could have, Won't have!" },
      { type: "quiz", title: "Requirements Document", difficulty: "medium", question: "SRS stands for?", options: [{ label: "A", text: "System Review Summary" }, { label: "B", text: "Software Requirements Specification" }, { label: "C", text: "Simple Requirements Sheet" }], correctAnswer: "B", explanation: "SRS is the formal document capturing all requirements!" },
    ],
  },
  "use-cases": {
    id: "use-cases", moduleId: "systems-analysis", title: "Use Cases", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Use Case Purpose", difficulty: "medium", question: "Use cases describe?", options: [{ label: "A", text: "Database schema" }, { label: "B", text: "User-system interactions" }, { label: "C", text: "Code structure" }], correctAnswer: "B", explanation: "Use cases show HOW users interact with the system to achieve goals!" },
      { type: "quiz", title: "Actors", difficulty: "medium", question: "What is an actor?", options: [{ label: "A", text: "Database" }, { label: "B", text: "External entity interacting with system" }, { label: "C", text: "Variable" }], correctAnswer: "B", explanation: "Actors are external - users, other systems, time triggers!" },
      { type: "quiz", title: "Use Case Elements", difficulty: "medium", question: "Use case must include?", options: [{ label: "A", text: "Code" }, { label: "B", text: "Main success scenario" }, { label: "C", text: "Database tables" }], correctAnswer: "B", explanation: "Every use case needs: actor, goal, and main success scenario (happy path)!" },
      { type: "quiz", title: "Include Relationship", difficulty: "hard", question: "<<include>> means?", options: [{ label: "A", text: "Optional behavior" }, { label: "B", text: "Required sub-behavior" }, { label: "C", text: "Error handling" }], correctAnswer: "B", explanation: "Include = always happens, mandatory sub-flow used by parent use case!" },
      { type: "quiz", title: "Extend Relationship", difficulty: "hard", question: "<<extend>> means?", options: [{ label: "A", text: "Always happens" }, { label: "B", text: "Optional/conditional behavior" }, { label: "C", text: "Inheritance" }], correctAnswer: "B", explanation: "Extend = optional behavior that may or may not happen!" },
      { type: "quiz", title: "Alternative Flows", difficulty: "medium", question: "Alternative flows handle?", options: [{ label: "A", text: "Only success" }, { label: "B", text: "Exceptions and variants" }, { label: "C", text: "Performance" }], correctAnswer: "B", explanation: "Alternative flows cover exceptions and different paths through the use case!" },
    ],
  },
  "user-stories": {
    id: "user-stories", moduleId: "systems-analysis", title: "User Stories", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "User Story Format", difficulty: "easy", question: "User story format is?", options: [{ label: "A", text: "As a..., I want..., So that..." }, { label: "B", text: "Given..., When..., Then..." }, { label: "C", text: "If..., Then..., Else..." }], correctAnswer: "A", explanation: "As a [role], I want [feature], so that [benefit]. Simple and user-focused!" },
      { type: "quiz", title: "Story vs Use Case", difficulty: "medium", question: "User stories are?", options: [{ label: "A", text: "More detailed than use cases" }, { label: "B", text: "Simpler, placeholder for conversation" }, { label: "C", text: "Only for developers" }], correctAnswer: "B", explanation: "Stories are lightweight - represent a conversation to have, not full specification!" },
      { type: "quiz", title: "Acceptance Criteria", difficulty: "hard", question: "Acceptance criteria define?", options: [{ label: "A", text: "How story looks" }, { label: "B", text: "When story is done" }, { label: "C", text: "Who writes story" }], correctAnswer: "B", explanation: "Acceptance criteria = testable conditions that must be met for story completion!" },
      { type: "quiz", title: "INVEST Criteria", difficulty: "hard", question: "INVEST includes Independent, Negotiable, Valuable...?", options: [{ label: "A", text: "Estimable, Small, Testable" }, { label: "B", text: "Easy, Standard, Technical" }, { label: "C", text: "Efficient, Scalable, Tracked" }], correctAnswer: "A", explanation: "Good stories are INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable!" },
      { type: "quiz", title: "Epics", difficulty: "medium", question: "An epic is?", options: [{ label: "A", text: "A bug report" }, { label: "B", text: "A large story broken into smaller ones" }, { label: "C", text: "A test case" }], correctAnswer: "B", explanation: "Epics are big features split into multiple smaller user stories!" },
    ],
  },

  // === MODELLING ===
  "process-modelling": {
    id: "process-modelling", moduleId: "systems-analysis", title: "Process Modelling", xpReward: 125, category: "Modelling",
    steps: [
      { type: "quiz", title: "DFD Purpose", difficulty: "medium", question: "Data Flow Diagrams show?", options: [{ label: "A", text: "Data movement through system" }, { label: "B", text: "User interfaces" }, { label: "C", text: "Database structure" }], correctAnswer: "A", explanation: "DFDs visualize how data flows: inputs, processes, outputs, and stores!" },
      { type: "quiz", title: "DFD Symbols", difficulty: "medium", question: "In DFD, rectangle represents?", options: [{ label: "A", text: "Process" }, { label: "B", text: "External entity" }, { label: "C", text: "Data store" }], correctAnswer: "B", explanation: "Rectangle = external entity. Circle = process. Open rectangle = data store." },
      { type: "quiz", title: "Context Diagram", difficulty: "medium", question: "Level 0 DFD is called?", options: [{ label: "A", text: "Detail diagram" }, { label: "B", text: "Context diagram" }, { label: "C", text: "Flow chart" }], correctAnswer: "B", explanation: "Context diagram shows system as single process with external entities!" },
      { type: "quiz", title: "DFD Levels", difficulty: "hard", question: "How many DFD levels?", options: [{ label: "A", text: "Only 2" }, { label: "B", text: "As many as needed" }, { label: "C", text: "Exactly 5" }], correctAnswer: "B", explanation: "Decompose to any depth needed - Level 0, 1, 2, 3... until clear!" },
      { type: "quiz", title: "Balancing DFDs", difficulty: "hard", question: "Balancing means?", options: [{ label: "A", text: "Equal shapes" }, { label: "B", text: "Parent/child flows match" }, { label: "C", text: "Colorful diagrams" }], correctAnswer: "B", explanation: "Data flows in parent must match flows in child diagram - consistency!" },
      { type: "quiz", title: "BPMN", difficulty: "hard", question: "BPMN is used for?", options: [{ label: "A", text: "Database design" }, { label: "B", text: "Business process modelling" }, { label: "C", text: "Testing" }], correctAnswer: "B", explanation: "BPMN = Business Process Model and Notation. Standard for process flows!" },
    ],
  },
  "data-modelling": {
    id: "data-modelling", moduleId: "systems-analysis", title: "Data Modelling", xpReward: 125, category: "Modelling",
    steps: [
      { type: "quiz", title: "ERD Purpose", difficulty: "medium", question: "Entity-Relationship Diagrams show?", options: [{ label: "A", text: "User flows" }, { label: "B", text: "Data structure and relationships" }, { label: "C", text: "System boundaries" }], correctAnswer: "B", explanation: "ERDs model data: entities (things), attributes (properties), relationships!" },
      { type: "quiz", title: "Entity", difficulty: "medium", question: "An entity represents?", options: [{ label: "A", text: "A real-world thing or concept" }, { label: "B", text: "A process" }, { label: "C", text: "A user action" }], correctAnswer: "A", explanation: "Entities are nouns: Customer, Order, Product - things we store data about!" },
      { type: "quiz", title: "Cardinality", difficulty: "hard", question: "1:M relationship means?", options: [{ label: "A", text: "One to one" }, { label: "B", text: "One to many" }, { label: "C", text: "Many to many" }], correctAnswer: "B", explanation: "1:M = one Customer can have many Orders. Customer->Orders." },
      { type: "quiz", title: "Primary Key", difficulty: "medium", question: "Primary key is?", options: [{ label: "A", text: "Any attribute" }, { label: "B", text: "Unique identifier for entity" }, { label: "C", text: "Password" }], correctAnswer: "B", explanation: "Primary key uniquely identifies each record - like StudentID!" },
      { type: "quiz", title: "Foreign Key", difficulty: "hard", question: "Foreign key links?", options: [{ label: "A", text: "Two attributes" }, { label: "B", text: "One entity to another" }, { label: "C", text: "To external system" }], correctAnswer: "B", explanation: "Foreign key references another table's primary key - creates relationships!" },
      { type: "quiz", title: "Normalization", difficulty: "hard", question: "3NF helps eliminate?", options: [{ label: "A", text: "All data" }, { label: "B", text: "Data redundancy" }, { label: "C", text: "Relationships" }], correctAnswer: "B", explanation: "Normalization (1NF, 2NF, 3NF) reduces redundancy and improves integrity!" },
    ],
  },
  "class-diagrams": {
    id: "class-diagrams", moduleId: "systems-analysis", title: "Class Diagrams (UML)", xpReward: 150, category: "Modelling",
    steps: [
      { type: "quiz", title: "UML Class", difficulty: "hard", question: "UML class diagram shows?", options: [{ label: "A", text: "Data flow" }, { label: "B", text: "Classes, attributes, methods" }, { label: "C", text: "User journeys" }], correctAnswer: "B", explanation: "Class diagrams show object-oriented structure: classes and their relationships!" },
      { type: "quiz", title: "Association", difficulty: "hard", question: "Association line means?", options: [{ label: "A", text: "Classes know about each other" }, { label: "B", text: "Inheritance" }, { label: "C", text: "Data flow" }], correctAnswer: "A", explanation: "Association = classes have a relationship, can communicate." },
      { type: "quiz", title: "Aggregation", difficulty: "hard", question: "Empty diamond means?", options: [{ label: "A", text: "Composition" }, { label: "B", text: "Aggregation (has-a)" }, { label: "C", text: "Inheritance" }], correctAnswer: "B", explanation: "Aggregation = whole-part relationship where parts can exist independently!" },
      { type: "quiz", title: "Composition", difficulty: "hard", question: "Filled diamond means?", options: [{ label: "A", text: "Aggregation" }, { label: "B", text: "Composition (strong has-a)" }, { label: "C", text: "Dependency" }], correctAnswer: "B", explanation: "Composition = parts cannot exist without the whole. Strong ownership!" },
      { type: "quiz", title: "Inheritance Arrow", difficulty: "hard", question: "Hollow arrow points to?", options: [{ label: "A", text: "Child class" }, { label: "B", text: "Parent class" }, { label: "C", text: "Interface" }], correctAnswer: "B", explanation: "Generalization arrow points from child to parent (is-a relationship)!" },
    ],
  },

  // === PROJECT PLANNING TOOLS ===
  "gantt-charts": {
    id: "gantt-charts", moduleId: "systems-analysis", title: "Gantt Charts", xpReward: 125, category: "Project Tools",
    steps: [
      { type: "quiz", title: "Gantt Purpose", difficulty: "easy", question: "Gantt charts show?", options: [{ label: "A", text: "Budget breakdown" }, { label: "B", text: "Tasks on a timeline" }, { label: "C", text: "Team hierarchy" }], correctAnswer: "B", explanation: "MEMORY TIP: 'Gantt = Got A Nice Timeline!' Shows tasks as bars on calendar!" },
      { type: "quiz", title: "Bar Length", difficulty: "easy", question: "Task bar length represents?", options: [{ label: "A", text: "Cost" }, { label: "B", text: "Duration" }, { label: "C", text: "Priority" }], correctAnswer: "B", explanation: "Longer bar = longer task. Visual timeline at a glance!" },
      { type: "quiz", title: "Dependencies", difficulty: "medium", question: "Arrows between bars show?", options: [{ label: "A", text: "Random connections" }, { label: "B", text: "Task dependencies" }, { label: "C", text: "Team assignments" }], correctAnswer: "B", explanation: "Arrows show which tasks must finish before others start!" },
      { type: "quiz", title: "Critical Path", difficulty: "hard", question: "Critical path is?", options: [{ label: "A", text: "Optional tasks" }, { label: "B", text: "Longest path determining project duration" }, { label: "C", text: "Budget limit" }], correctAnswer: "B", explanation: "Critical path = tasks that directly affect end date. Delay one = delay project!" },
      { type: "quiz", title: "Milestones", difficulty: "medium", question: "Milestones are shown as?", options: [{ label: "A", text: "Long bars" }, { label: "B", text: "Diamonds (zero duration)" }, { label: "C", text: "Circles" }], correctAnswer: "B", explanation: "Milestones mark key checkpoints - shown as diamonds with no duration!" },
      { type: "quiz", title: "Float Time", difficulty: "hard", question: "Float/slack time means?", options: [{ label: "A", text: "Swimming break" }, { label: "B", text: "How late task can start without affecting end date" }, { label: "C", text: "Extra budget" }], correctAnswer: "B", explanation: "Float = flexibility. Tasks on critical path have zero float!" },
    ],
  },
  "kanban-trello": {
    id: "kanban-trello", moduleId: "systems-analysis", title: "Kanban & Trello", xpReward: 100, category: "Project Tools",
    steps: [
      { type: "quiz", title: "Kanban Origin", difficulty: "easy", question: "Kanban came from?", options: [{ label: "A", text: "Microsoft" }, { label: "B", text: "Toyota manufacturing" }, { label: "C", text: "NASA" }], correctAnswer: "B", explanation: "MEMORY TIP: Kanban = 'Card' in Japanese. Toyota invented it for factory flow!" },
      { type: "quiz", title: "Kanban Columns", difficulty: "easy", question: "Basic Kanban columns are?", options: [{ label: "A", text: "Red, Yellow, Green" }, { label: "B", text: "To Do, Doing, Done" }, { label: "C", text: "High, Medium, Low" }], correctAnswer: "B", explanation: "Simple flow: To Do → Doing → Done. Cards move left to right!" },
      { type: "quiz", title: "WIP Limits", difficulty: "medium", question: "WIP limit stands for?", options: [{ label: "A", text: "Weekly Improvement Plan" }, { label: "B", text: "Work In Progress limit" }, { label: "C", text: "Work Item Priority" }], correctAnswer: "B", explanation: "WIP limits prevent overload - max cards allowed in 'Doing' column!" },
      { type: "quiz", title: "Pull System", difficulty: "medium", question: "Kanban is a 'pull' system because?", options: [{ label: "A", text: "Work is pushed to team" }, { label: "B", text: "Team pulls new work when ready" }, { label: "C", text: "Cards are pulled out" }], correctAnswer: "B", explanation: "Pull = team takes next task only when capacity available. No overloading!" },
      { type: "quiz", title: "Trello Cards", difficulty: "easy", question: "Trello cards represent?", options: [{ label: "A", text: "Team members" }, { label: "B", text: "Individual tasks/items" }, { label: "C", text: "Projects" }], correctAnswer: "B", explanation: "Each card = one task. Add details, checklists, due dates, attachments!" },
      { type: "quiz", title: "Swimlanes", difficulty: "hard", question: "Swimlanes divide board by?", options: [{ label: "A", text: "Team members or categories" }, { label: "B", text: "Colors" }, { label: "C", text: "Alphabetically" }], correctAnswer: "A", explanation: "Swimlanes add horizontal rows to separate work by team, priority, or type!" },
    ],
  },
  "project-planning": {
    id: "project-planning", moduleId: "systems-analysis", title: "Project Planning Tools", xpReward: 150, category: "Project Tools",
    steps: [
      { type: "quiz", title: "WBS", difficulty: "medium", question: "Work Breakdown Structure breaks project into?", options: [{ label: "A", text: "Random pieces" }, { label: "B", text: "Hierarchical deliverables" }, { label: "C", text: "Team roles" }], correctAnswer: "B", explanation: "WBS = project tree. Big deliverables → smaller tasks → work packages!" },
      { type: "quiz", title: "PERT", difficulty: "hard", question: "PERT estimates use?", options: [{ label: "A", text: "Single estimate" }, { label: "B", text: "Optimistic, Most Likely, Pessimistic" }, { label: "C", text: "Random numbers" }], correctAnswer: "B", explanation: "PERT = (O + 4M + P) ÷ 6. Three-point estimates for better accuracy!" },
      { type: "quiz", title: "Scope Creep", difficulty: "medium", question: "Scope creep is?", options: [{ label: "A", text: "Good planning" }, { label: "B", text: "Uncontrolled changes/additions" }, { label: "C", text: "Team expansion" }], correctAnswer: "B", explanation: "Scope creep kills projects! Features added without proper change control." },
      { type: "quiz", title: "Baseline", difficulty: "medium", question: "Project baseline is?", options: [{ label: "A", text: "First guess" }, { label: "B", text: "Approved plan to measure against" }, { label: "C", text: "Budget" }], correctAnswer: "B", explanation: "Baseline = original approved scope, schedule, cost. Compare actual vs baseline!" },
      { type: "quiz", title: "Risk Register", difficulty: "hard", question: "Risk register contains?", options: [{ label: "A", text: "Only problems" }, { label: "B", text: "Risks, probability, impact, mitigation" }, { label: "C", text: "Team names" }], correctAnswer: "B", explanation: "Risk register = living document tracking all identified risks and responses!" },
    ],
  },
  "erd-mastery": {
    id: "erd-mastery", moduleId: "systems-analysis", title: "ERD Design Mastery", xpReward: 175, category: "Modelling",
    steps: [
      { type: "quiz", title: "Chen Notation", difficulty: "medium", question: "In Chen notation, rectangles are?", options: [{ label: "A", text: "Attributes" }, { label: "B", text: "Entities" }, { label: "C", text: "Relationships" }], correctAnswer: "B", explanation: "MEMORY: 'RODE' - Rectangle=Entity, Oval=Attribute, Diamond=Relationship, Ellipse=Attribute!" },
      { type: "quiz", title: "Crow's Foot", difficulty: "medium", question: "Crow's foot symbol means?", options: [{ label: "A", text: "One" }, { label: "B", text: "Many" }, { label: "C", text: "Optional" }], correctAnswer: "B", explanation: "MEMORY TIP: Crow's foot looks like bird tracks = 'many'. Single line = one!" },
      { type: "quiz", title: "Composite Key", difficulty: "hard", question: "Composite key uses?", options: [{ label: "A", text: "Single attribute" }, { label: "B", text: "Multiple attributes together" }, { label: "C", text: "Foreign key only" }], correctAnswer: "B", explanation: "Composite key = two+ columns combined to uniquely identify. OrderID + ProductID!" },
      { type: "quiz", title: "Weak Entity", difficulty: "hard", question: "Weak entity depends on?", options: [{ label: "A", text: "Nothing" }, { label: "B", text: "Strong entity for identification" }, { label: "C", text: "Attributes only" }], correctAnswer: "B", explanation: "Weak entity can't exist alone. Order Line depends on Order - double rectangle!" },
      { type: "quiz", title: "Participation", difficulty: "hard", question: "Total participation (double line) means?", options: [{ label: "A", text: "Optional relationship" }, { label: "B", text: "Every instance must participate" }, { label: "C", text: "No relationship" }], correctAnswer: "B", explanation: "Double line = mandatory. Every Student MUST have a Department!" },
      { type: "quiz", title: "Junction Table", difficulty: "hard", question: "M:N relationship needs?", options: [{ label: "A", text: "Nothing special" }, { label: "B", text: "Junction/associative table" }, { label: "C", text: "Delete relationship" }], correctAnswer: "B", explanation: "Many-to-many needs intermediate table. Student_Course holds both foreign keys!" },
    ],
  },
  "use-case-mastery": {
    id: "use-case-mastery", moduleId: "systems-analysis", title: "Use Case Diagrams", xpReward: 150, category: "Modelling",
    steps: [
      { type: "quiz", title: "Stick Figure", difficulty: "easy", question: "In use case diagrams, stick figure represents?", options: [{ label: "A", text: "Process" }, { label: "B", text: "Actor" }, { label: "C", text: "Database" }], correctAnswer: "B", explanation: "MEMORY TIP: Stick figure = person/thing that interacts from OUTSIDE!" },
      { type: "quiz", title: "Oval Shape", difficulty: "easy", question: "Ovals in use case diagrams are?", options: [{ label: "A", text: "Actors" }, { label: "B", text: "Use cases" }, { label: "C", text: "Data stores" }], correctAnswer: "B", explanation: "Ovals = use cases (actions/goals). Use VERBS: 'Login', 'Place Order'!" },
      { type: "quiz", title: "System Boundary", difficulty: "medium", question: "Rectangle around use cases shows?", options: [{ label: "A", text: "Database" }, { label: "B", text: "System boundary" }, { label: "C", text: "Optional features" }], correctAnswer: "B", explanation: "The box shows what's INSIDE the system vs outside (environment)!" },
      { type: "quiz", title: "Include vs Extend", difficulty: "hard", question: "<<include>> means?", options: [{ label: "A", text: "Optional behavior" }, { label: "B", text: "Always required sub-behavior" }, { label: "C", text: "Error handling" }], correctAnswer: "B", explanation: "Include = ALWAYS happens. Extend = optional/conditional behavior!" },
      { type: "quiz", title: "Actor Types", difficulty: "medium", question: "Can a system be an actor?", options: [{ label: "A", text: "No, only humans" }, { label: "B", text: "Yes, external systems can be actors" }, { label: "C", text: "Only robots" }], correctAnswer: "B", explanation: "Actors can be: people, external systems, hardware, time (scheduling)!" },
      { type: "quiz", title: "Primary Actor", difficulty: "medium", question: "Primary actor?", options: [{ label: "A", text: "Receives service from system" }, { label: "B", text: "Triggers the use case" }, { label: "C", text: "Database" }], correctAnswer: "B", explanation: "Primary actor INITIATES the use case. Secondary actors assist or receive!" },
    ],
  },

  // === SDLC ===
  "sdlc-overview": {
    id: "sdlc-overview", moduleId: "systems-analysis", title: "SDLC Overview", xpReward: 100, category: "SDLC",
    steps: [
      { type: "quiz", title: "SDLC Definition", difficulty: "easy", question: "SDLC stands for?", options: [{ label: "A", text: "System Design Life Cycle" }, { label: "B", text: "Software Development Life Cycle" }, { label: "C", text: "System Development Logic Control" }], correctAnswer: "B", explanation: "SDLC = structured phases for developing software systems." },
      { type: "quiz", title: "SDLC Phases", difficulty: "medium", question: "SDLC typically starts with?", options: [{ label: "A", text: "Coding" }, { label: "B", text: "Planning/Analysis" }, { label: "C", text: "Testing" }], correctAnswer: "B", explanation: "Always start with understanding WHAT to build before HOW!" },
      { type: "quiz", title: "Design Phase", difficulty: "medium", question: "Design phase produces?", options: [{ label: "A", text: "Final code" }, { label: "B", text: "System architecture and specifications" }, { label: "C", text: "Bug reports" }], correctAnswer: "B", explanation: "Design creates blueprints: architecture, UI mockups, database design!" },
      { type: "quiz", title: "Testing Types", difficulty: "medium", question: "UAT stands for?", options: [{ label: "A", text: "Unified Application Test" }, { label: "B", text: "User Acceptance Testing" }, { label: "C", text: "Utility Analysis Test" }], correctAnswer: "B", explanation: "UAT = real users test to confirm system meets their needs!" },
      { type: "quiz", title: "Maintenance", difficulty: "medium", question: "Maintenance phase includes?", options: [{ label: "A", text: "Only bug fixes" }, { label: "B", text: "Bug fixes, updates, enhancements" }, { label: "C", text: "Nothing important" }], correctAnswer: "B", explanation: "Maintenance is ongoing: bugs, security patches, new features!" },
    ],
  },
  "waterfall-model": {
    id: "waterfall-model", moduleId: "systems-analysis", title: "Waterfall Model", xpReward: 100, category: "SDLC",
    steps: [
      { type: "quiz", title: "Waterfall Nature", difficulty: "medium", question: "Waterfall is?", options: [{ label: "A", text: "Iterative" }, { label: "B", text: "Sequential - each phase once" }, { label: "C", text: "No planning" }], correctAnswer: "B", explanation: "Waterfall flows down: Requirements → Design → Code → Test → Deploy." },
      { type: "quiz", title: "Waterfall Weakness", difficulty: "medium", question: "Waterfall weakness is?", options: [{ label: "A", text: "Too much documentation" }, { label: "B", text: "Hard to accommodate change" }, { label: "C", text: "No testing" }], correctAnswer: "B", explanation: "Changes late in waterfall are expensive - requirements are frozen early!" },
      { type: "quiz", title: "When to Use", difficulty: "hard", question: "Waterfall suits?", options: [{ label: "A", text: "Unclear requirements" }, { label: "B", text: "Stable, well-understood requirements" }, { label: "C", text: "Rapid prototyping" }], correctAnswer: "B", explanation: "Use Waterfall when requirements are crystal clear and unlikely to change!" },
      { type: "quiz", title: "V-Model", difficulty: "hard", question: "V-Model emphasizes?", options: [{ label: "A", text: "No documentation" }, { label: "B", text: "Testing at each phase" }, { label: "C", text: "Rapid delivery" }], correctAnswer: "B", explanation: "V-Model = Waterfall + corresponding test phase for each development phase!" },
    ],
  },
  "agile-methods": {
    id: "agile-methods", moduleId: "systems-analysis", title: "Agile Methods", xpReward: 125, category: "SDLC",
    steps: [
      { type: "quiz", title: "Agile Values", difficulty: "medium", question: "Agile values what over process?", options: [{ label: "A", text: "Documentation" }, { label: "B", text: "Individuals and interactions" }, { label: "C", text: "Contracts" }], correctAnswer: "B", explanation: "Agile Manifesto: people > process, working software > documentation!" },
      { type: "quiz", title: "Sprint", difficulty: "medium", question: "A sprint is?", options: [{ label: "A", text: "Running fast" }, { label: "B", text: "Time-boxed development iteration" }, { label: "C", text: "Final release" }], correctAnswer: "B", explanation: "Sprints are 1-4 week cycles delivering working increments!" },
      { type: "quiz", title: "Agile Benefit", difficulty: "medium", question: "Agile handles change by?", options: [{ label: "A", text: "Ignoring it" }, { label: "B", text: "Embracing it through iteration" }, { label: "C", text: "Heavy documentation" }], correctAnswer: "B", explanation: "Short iterations mean feedback early and change is expected!" },
      { type: "quiz", title: "Scrum Roles", difficulty: "hard", question: "Scrum Master does?", options: [{ label: "A", text: "Writes all code" }, { label: "B", text: "Facilitates and removes blockers" }, { label: "C", text: "Sets requirements" }], correctAnswer: "B", explanation: "Scrum Master = servant-leader, facilitates ceremonies, removes impediments!" },
      { type: "quiz", title: "Product Owner", difficulty: "hard", question: "Product Owner represents?", options: [{ label: "A", text: "Developers" }, { label: "B", text: "Customer/business" }, { label: "C", text: "Testers" }], correctAnswer: "B", explanation: "PO is the voice of customer, prioritizes backlog, defines acceptance criteria!" },
      { type: "quiz", title: "Kanban", difficulty: "hard", question: "Kanban focuses on?", options: [{ label: "A", text: "Sprints" }, { label: "B", text: "Visualizing workflow and limiting WIP" }, { label: "C", text: "Heavy planning" }], correctAnswer: "B", explanation: "Kanban = visual board + Work In Progress limits. Continuous flow!" },
    ],
  },

  // === GOVERNANCE ===
  "security-basics": {
    id: "security-basics", moduleId: "systems-analysis", title: "Security Fundamentals", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "CIA Triad", difficulty: "medium", question: "CIA in security stands for?", options: [{ label: "A", text: "Central Intelligence Agency" }, { label: "B", text: "Confidentiality, Integrity, Availability" }, { label: "C", text: "Control, Input, Access" }], correctAnswer: "B", explanation: "CIA Triad: Confidentiality (secret), Integrity (accurate), Availability (accessible)!" },
      { type: "quiz", title: "Authentication", difficulty: "medium", question: "Authentication verifies?", options: [{ label: "A", text: "What you can access" }, { label: "B", text: "Who you are" }, { label: "C", text: "Data accuracy" }], correctAnswer: "B", explanation: "Authentication = WHO you are. Authorization = WHAT you can do!" },
      { type: "quiz", title: "Authorization", difficulty: "medium", question: "Authorization controls?", options: [{ label: "A", text: "Identity" }, { label: "B", text: "Access permissions" }, { label: "C", text: "Encryption" }], correctAnswer: "B", explanation: "Authorization determines what actions/resources an authenticated user can access!" },
      { type: "quiz", title: "Encryption", difficulty: "hard", question: "Encryption protects?", options: [{ label: "A", text: "Availability" }, { label: "B", text: "Confidentiality" }, { label: "C", text: "Performance" }], correctAnswer: "B", explanation: "Encryption scrambles data so only authorized parties can read it!" },
      { type: "quiz", title: "Least Privilege", difficulty: "hard", question: "Least privilege means?", options: [{ label: "A", text: "Give everyone admin access" }, { label: "B", text: "Minimum access needed for job" }, { label: "C", text: "No access at all" }], correctAnswer: "B", explanation: "Only grant permissions necessary to perform the task - nothing more!" },
    ],
  },
  "risk-management": {
    id: "risk-management", moduleId: "systems-analysis", title: "Risk Management", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "Risk Components", difficulty: "medium", question: "Risk is calculated by?", options: [{ label: "A", text: "Cost only" }, { label: "B", text: "Likelihood × Impact" }, { label: "C", text: "Time taken" }], correctAnswer: "B", explanation: "Risk = Probability × Impact. High likelihood + high impact = critical risk!" },
      { type: "quiz", title: "Risk Response", difficulty: "medium", question: "Risk mitigation means?", options: [{ label: "A", text: "Ignore the risk" }, { label: "B", text: "Reduce likelihood or impact" }, { label: "C", text: "Accept all risks" }], correctAnswer: "B", explanation: "Mitigate = take action to reduce. Also: accept, avoid, or transfer risks!" },
      { type: "quiz", title: "Risk Transfer", difficulty: "hard", question: "Insurance is an example of?", options: [{ label: "A", text: "Risk avoidance" }, { label: "B", text: "Risk transfer" }, { label: "C", text: "Risk acceptance" }], correctAnswer: "B", explanation: "Transfer = shift risk to third party (insurance, outsourcing)!" },
      { type: "quiz", title: "Risk Register", difficulty: "medium", question: "Risk register contains?", options: [{ label: "A", text: "User passwords" }, { label: "B", text: "Identified risks and responses" }, { label: "C", text: "Code repository" }], correctAnswer: "B", explanation: "Risk register documents all risks, assessments, owners, and responses!" },
      { type: "quiz", title: "Contingency", difficulty: "hard", question: "Contingency plan is for?", options: [{ label: "A", text: "Normal operations" }, { label: "B", text: "If risk occurs despite mitigation" }, { label: "C", text: "Marketing" }], correctAnswer: "B", explanation: "Contingency = backup plan if the risk actually happens!" },
    ],
  },
  "compliance": {
    id: "compliance", moduleId: "systems-analysis", title: "Compliance & GDPR", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "GDPR Scope", difficulty: "medium", question: "GDPR protects?", options: [{ label: "A", text: "Company data" }, { label: "B", text: "Personal data of individuals" }, { label: "C", text: "Government data" }], correctAnswer: "B", explanation: "GDPR protects personal data of EU individuals - names, emails, IPs, etc!" },
      { type: "quiz", title: "Data Subject Rights", difficulty: "hard", question: "GDPR gives users right to?", options: [{ label: "A", text: "Free software" }, { label: "B", text: "Access and delete their data" }, { label: "C", text: "Company profits" }], correctAnswer: "B", explanation: "Right to access, rectify, erase ('be forgotten'), and port your data!" },
      { type: "quiz", title: "Lawful Basis", difficulty: "hard", question: "Processing data requires?", options: [{ label: "A", text: "Just wanting to" }, { label: "B", text: "Lawful basis like consent" }, { label: "C", text: "Manager approval only" }], correctAnswer: "B", explanation: "Must have lawful basis: consent, contract, legal obligation, legitimate interest!" },
      { type: "quiz", title: "Data Breach", difficulty: "hard", question: "GDPR breach notification deadline?", options: [{ label: "A", text: "72 hours" }, { label: "B", text: "7 days" }, { label: "C", text: "1 month" }], correctAnswer: "A", explanation: "Must report breaches to authorities within 72 hours!" },
      { type: "quiz", title: "DPO", difficulty: "hard", question: "Data Protection Officer is?", options: [{ label: "A", text: "Optional always" }, { label: "B", text: "Required for certain organizations" }, { label: "C", text: "Government role only" }], correctAnswer: "B", explanation: "DPO required for public authorities and large-scale data processing!" },
    ],
  },
  "testing-strategies": {
    id: "testing-strategies", moduleId: "systems-analysis", title: "Testing Strategies", xpReward: 125, category: "Governance",
    steps: [
      { type: "quiz", title: "Unit Testing", difficulty: "medium", question: "Unit tests check?", options: [{ label: "A", text: "Whole system" }, { label: "B", text: "Individual components/functions" }, { label: "C", text: "User interface" }], correctAnswer: "B", explanation: "Unit tests verify smallest testable parts - individual functions or methods!" },
      { type: "quiz", title: "Integration Testing", difficulty: "medium", question: "Integration tests verify?", options: [{ label: "A", text: "Single module" }, { label: "B", text: "Modules working together" }, { label: "C", text: "User acceptance" }], correctAnswer: "B", explanation: "Integration testing checks if components interact correctly!" },
      { type: "quiz", title: "Regression Testing", difficulty: "hard", question: "Regression testing ensures?", options: [{ label: "A", text: "New features work" }, { label: "B", text: "Changes didn't break existing functionality" }, { label: "C", text: "Performance improved" }], correctAnswer: "B", explanation: "Regression = verify old features still work after changes!" },
      { type: "quiz", title: "Black Box", difficulty: "hard", question: "Black box testing means?", options: [{ label: "A", text: "Testing code internals" }, { label: "B", text: "Testing without knowing code" }, { label: "C", text: "Testing in dark room" }], correctAnswer: "B", explanation: "Black box = test inputs/outputs without seeing internal code!" },
      { type: "quiz", title: "White Box", difficulty: "hard", question: "White box testing examines?", options: [{ label: "A", text: "Only UI" }, { label: "B", text: "Internal code structure" }, { label: "C", text: "User behavior" }], correctAnswer: "B", explanation: "White box = test with knowledge of internal code paths and logic!" },
    ],
  },
};

// ==========================================
// COURSE 3: MATHS FOR COMPUTING
// ==========================================

export const mathLessons: Record<string, LessonData> = {
  // === NUMBER SYSTEMS ===
  "number-systems": {
    id: "number-systems", moduleId: "math-computing", title: "Number Systems", xpReward: 75, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Binary Basics", difficulty: "medium", question: "Binary uses which digits?", options: [{ label: "A", text: "0-9" }, { label: "B", text: "0 and 1 only" }, { label: "C", text: "0-F" }], correctAnswer: "B", explanation: "Binary (base 2) uses only 0 and 1. Each position is a power of 2!" },
      { type: "quiz", title: "Binary Value", difficulty: "medium", question: "Binary 1010 equals?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "12" }], correctAnswer: "B", explanation: "1010 = 8+0+2+0 = 10. Read right to left: 1,2,4,8,16..." },
      { type: "quiz", title: "Hexadecimal", difficulty: "medium", question: "Hex base is?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "16" }], correctAnswer: "C", explanation: "Hexadecimal is base 16. Uses 0-9 then A-F (A=10, F=15)." },
      { type: "quiz", title: "Octal", difficulty: "hard", question: "Octal base is?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "16" }], correctAnswer: "A", explanation: "Octal is base 8. Uses digits 0-7. Sometimes used in Unix permissions!" },
      { type: "quiz", title: "Binary to Hex", difficulty: "hard", question: "4 binary digits = 1 hex digit because?", options: [{ label: "A", text: "Random choice" }, { label: "B", text: "2^4 = 16" }, { label: "C", text: "They look similar" }], correctAnswer: "B", explanation: "4 bits can represent 0-15 (16 values), same as one hex digit!" },
      { type: "quiz", title: "Decimal 255", difficulty: "hard", question: "255 in binary is?", options: [{ label: "A", text: "11111111" }, { label: "B", text: "10000000" }, { label: "C", text: "11110000" }], correctAnswer: "A", explanation: "255 = 128+64+32+16+8+4+2+1 = all 8 bits on = 11111111!" },
    ],
  },
  "binary-arithmetic": {
    id: "binary-arithmetic", moduleId: "math-computing", title: "Binary Arithmetic", xpReward: 100, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Binary Addition", difficulty: "medium", question: "In binary, 1+1=?", options: [{ label: "A", text: "2" }, { label: "B", text: "10" }, { label: "C", text: "11" }], correctAnswer: "B", explanation: "1+1=10 in binary (that's 2 in decimal). Carry the 1!" },
      { type: "quiz", title: "Overflow", difficulty: "hard", question: "8-bit max unsigned value?", options: [{ label: "A", text: "255" }, { label: "B", text: "256" }, { label: "C", text: "128" }], correctAnswer: "A", explanation: "8 bits: 0-255 (2^8 - 1 = 255). Adding 1 to 255 causes overflow!" },
      { type: "quiz", title: "Two's Complement", difficulty: "hard", question: "Two's complement is for?", options: [{ label: "A", text: "Adding colors" }, { label: "B", text: "Representing negative numbers" }, { label: "C", text: "Encryption" }], correctAnswer: "B", explanation: "Two's complement allows computers to represent negative integers!" },
      { type: "quiz", title: "Signed Range", difficulty: "hard", question: "8-bit signed range is?", options: [{ label: "A", text: "0 to 255" }, { label: "B", text: "-128 to 127" }, { label: "C", text: "-256 to 256" }], correctAnswer: "B", explanation: "Signed 8-bit: -128 to 127. Half for negative, half for positive!" },
      { type: "quiz", title: "Binary Subtraction", difficulty: "hard", question: "Binary 10 - 1 = ?", options: [{ label: "A", text: "0" }, { label: "B", text: "1" }, { label: "C", text: "11" }], correctAnswer: "B", explanation: "10 (which is 2) minus 1 equals 1. Same as decimal!" },
    ],
  },
  "hex-conversions": {
    id: "hex-conversions", moduleId: "math-computing", title: "Hex Conversions", xpReward: 100, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Hex A Value", difficulty: "medium", question: "What is hex A in decimal?", options: [{ label: "A", text: "10" }, { label: "B", text: "11" }, { label: "C", text: "15" }], correctAnswer: "A", explanation: "A=10, B=11, C=12, D=13, E=14, F=15!" },
      { type: "quiz", title: "Hex to Binary", difficulty: "hard", question: "Hex F in binary is?", options: [{ label: "A", text: "1111" }, { label: "B", text: "1010" }, { label: "C", text: "1000" }], correctAnswer: "A", explanation: "F = 15 = 8+4+2+1 = 1111 in binary!" },
      { type: "quiz", title: "Color Codes", difficulty: "medium", question: "Web color #FF0000 is?", options: [{ label: "A", text: "Blue" }, { label: "B", text: "Red" }, { label: "C", text: "Green" }], correctAnswer: "B", explanation: "FF=255 red, 00=0 green, 00=0 blue. Pure red!" },
      { type: "quiz", title: "Hex 2A", difficulty: "hard", question: "Hex 2A in decimal?", options: [{ label: "A", text: "42" }, { label: "B", text: "26" }, { label: "C", text: "210" }], correctAnswer: "A", explanation: "2×16 + 10 = 32 + 10 = 42. The answer to everything!" },
    ],
  },

  // === LOGIC ===
  "logic-gates": {
    id: "logic-gates", moduleId: "math-computing", title: "Logic Gates", xpReward: 100, category: "Logic",
    steps: [
      { type: "quiz", title: "AND Gate", difficulty: "medium", question: "AND gate output is 1 when?", options: [{ label: "A", text: "Any input is 1" }, { label: "B", text: "All inputs are 1" }, { label: "C", text: "All inputs are 0" }], correctAnswer: "B", explanation: "AND = all must be true. 1 AND 1 = 1. Anything else = 0." },
      { type: "quiz", title: "OR Gate", difficulty: "medium", question: "OR gate output is 1 when?", options: [{ label: "A", text: "Any input is 1" }, { label: "B", text: "All inputs are 1" }, { label: "C", text: "All inputs are 0" }], correctAnswer: "A", explanation: "OR = at least one true. 0 OR 1 = 1. Only 0 OR 0 = 0." },
      { type: "quiz", title: "NOT Gate", difficulty: "easy", question: "NOT gate does what?", options: [{ label: "A", text: "Copies input" }, { label: "B", text: "Inverts input" }, { label: "C", text: "Doubles input" }], correctAnswer: "B", explanation: "NOT inverts: NOT 1 = 0, NOT 0 = 1. Simple negation!" },
      { type: "quiz", title: "NAND Gate", difficulty: "hard", question: "NAND is?", options: [{ label: "A", text: "NOT + OR" }, { label: "B", text: "NOT + AND" }, { label: "C", text: "NOR inverted" }], correctAnswer: "B", explanation: "NAND = NOT AND. Output is 0 only when all inputs are 1!" },
      { type: "quiz", title: "XOR Gate", difficulty: "hard", question: "XOR output is 1 when?", options: [{ label: "A", text: "Inputs are same" }, { label: "B", text: "Inputs are different" }, { label: "C", text: "Both are 1" }], correctAnswer: "B", explanation: "XOR = exclusive OR. True when inputs differ: 0 XOR 1 = 1!" },
      { type: "quiz", title: "Universal Gate", difficulty: "hard", question: "Which gate can build any circuit?", options: [{ label: "A", text: "AND" }, { label: "B", text: "NAND" }, { label: "C", text: "OR" }], correctAnswer: "B", explanation: "NAND and NOR are universal - can create any other gate!" },
    ],
  },
  "boolean-algebra": {
    id: "boolean-algebra", moduleId: "math-computing", title: "Boolean Algebra", xpReward: 125, category: "Logic",
    steps: [
      { type: "quiz", title: "Boolean Values", difficulty: "easy", question: "Boolean algebra uses?", options: [{ label: "A", text: "0-9" }, { label: "B", text: "True and False (1 and 0)" }, { label: "C", text: "A-Z" }], correctAnswer: "B", explanation: "Boolean = binary logic. True/False, 1/0, Yes/No - two states only!" },
      { type: "quiz", title: "De Morgan's", difficulty: "hard", question: "NOT(A AND B) equals?", options: [{ label: "A", text: "(NOT A) OR (NOT B)" }, { label: "B", text: "(NOT A) AND (NOT B)" }, { label: "C", text: "A OR B" }], correctAnswer: "A", explanation: "De Morgan's Law: NOT(A AND B) = (NOT A) OR (NOT B). Break AND, flip to OR!" },
      { type: "quiz", title: "De Morgan's 2", difficulty: "hard", question: "NOT(A OR B) equals?", options: [{ label: "A", text: "(NOT A) OR (NOT B)" }, { label: "B", text: "(NOT A) AND (NOT B)" }, { label: "C", text: "A AND B" }], correctAnswer: "B", explanation: "Second law: NOT(A OR B) = (NOT A) AND (NOT B). Break OR, flip to AND!" },
      { type: "quiz", title: "Identity Law", difficulty: "medium", question: "A AND 1 equals?", options: [{ label: "A", text: "0" }, { label: "B", text: "A" }, { label: "C", text: "1" }], correctAnswer: "B", explanation: "Identity: A AND 1 = A, A OR 0 = A. Identity elements!" },
      { type: "quiz", title: "Null Law", difficulty: "medium", question: "A OR 1 equals?", options: [{ label: "A", text: "A" }, { label: "B", text: "0" }, { label: "C", text: "1" }], correctAnswer: "C", explanation: "Null/Domination: A OR 1 = 1, A AND 0 = 0. Dominant values!" },
    ],
  },
  "truth-tables": {
    id: "truth-tables", moduleId: "math-computing", title: "Truth Tables", xpReward: 100, category: "Logic",
    steps: [
      { type: "quiz", title: "Truth Table Purpose", difficulty: "medium", question: "Truth tables show?", options: [{ label: "A", text: "All possible input/output combinations" }, { label: "B", text: "Only true values" }, { label: "C", text: "Error cases" }], correctAnswer: "A", explanation: "Truth tables exhaustively list every possible input combination and its output!" },
      { type: "quiz", title: "Table Size", difficulty: "medium", question: "3 inputs = how many rows?", options: [{ label: "A", text: "6" }, { label: "B", text: "8" }, { label: "C", text: "9" }], correctAnswer: "B", explanation: "2^n rows for n inputs. 2^3 = 8 rows for 3 variables!" },
      { type: "quiz", title: "4 Input Table", difficulty: "hard", question: "4 inputs = how many rows?", options: [{ label: "A", text: "8" }, { label: "B", text: "16" }, { label: "C", text: "32" }], correctAnswer: "B", explanation: "2^4 = 16 rows. Grows exponentially with inputs!" },
      { type: "quiz", title: "Equivalent Expressions", difficulty: "hard", question: "Same truth table means?", options: [{ label: "A", text: "Different logic" }, { label: "B", text: "Logically equivalent" }, { label: "C", text: "Error" }], correctAnswer: "B", explanation: "Identical truth tables = logically equivalent expressions!" },
    ],
  },

  // === SETS ===
  "sets-basics": {
    id: "sets-basics", moduleId: "math-computing", title: "Sets & Operations", xpReward: 100, category: "Sets",
    steps: [
      { type: "quiz", title: "Set Definition", difficulty: "easy", question: "A set is?", options: [{ label: "A", text: "Ordered list" }, { label: "B", text: "Collection of unique elements" }, { label: "C", text: "Duplicated values" }], correctAnswer: "B", explanation: "Sets have unique elements, no duplicates, no specific order!" },
      { type: "quiz", title: "Union", difficulty: "medium", question: "A ∪ B contains?", options: [{ label: "A", text: "Elements in both" }, { label: "B", text: "Elements in either or both" }, { label: "C", text: "Elements in neither" }], correctAnswer: "B", explanation: "Union combines: everything in A, B, or both. A ∪ B." },
      { type: "quiz", title: "Intersection", difficulty: "medium", question: "A ∩ B contains?", options: [{ label: "A", text: "Elements in both A and B" }, { label: "B", text: "Elements in either" }, { label: "C", text: "All elements" }], correctAnswer: "A", explanation: "Intersection = common elements only. Must be in both A AND B!" },
      { type: "quiz", title: "Complement", difficulty: "medium", question: "A' (A complement) contains?", options: [{ label: "A", text: "Everything in A" }, { label: "B", text: "Everything NOT in A" }, { label: "C", text: "Empty set" }], correctAnswer: "B", explanation: "Complement = all elements in universal set but not in A!" },
      { type: "quiz", title: "Difference", difficulty: "hard", question: "A - B contains?", options: [{ label: "A", text: "In A but not in B" }, { label: "B", text: "In B but not in A" }, { label: "C", text: "In both" }], correctAnswer: "A", explanation: "Set difference: elements in A that are not in B!" },
      { type: "quiz", title: "Subset", difficulty: "medium", question: "A ⊆ B means?", options: [{ label: "A", text: "A contains B" }, { label: "B", text: "All elements of A are in B" }, { label: "C", text: "A and B are equal" }], correctAnswer: "B", explanation: "Subset: every element of A is also in B. A is contained in B!" },
    ],
  },
  "venn-diagrams": {
    id: "venn-diagrams", moduleId: "math-computing", title: "Venn Diagrams", xpReward: 75, category: "Sets",
    steps: [
      { type: "quiz", title: "Venn Purpose", difficulty: "easy", question: "Venn diagrams visualize?", options: [{ label: "A", text: "Time" }, { label: "B", text: "Set relationships" }, { label: "C", text: "Code flow" }], correctAnswer: "B", explanation: "Venn diagrams show overlaps and differences between sets visually!" },
      { type: "quiz", title: "Overlap Region", difficulty: "medium", question: "Overlapping area represents?", options: [{ label: "A", text: "Union" }, { label: "B", text: "Intersection" }, { label: "C", text: "Complement" }], correctAnswer: "B", explanation: "Where circles overlap = intersection (elements in both sets)!" },
      { type: "quiz", title: "Outside All", difficulty: "medium", question: "Area outside all circles is?", options: [{ label: "A", text: "Intersection" }, { label: "B", text: "Complement of union" }, { label: "C", text: "Empty" }], correctAnswer: "B", explanation: "Outside all sets = elements not in any set (within universal set)!" },
      { type: "quiz", title: "Three Sets", difficulty: "hard", question: "Three-set Venn has how many regions?", options: [{ label: "A", text: "6" }, { label: "B", text: "7" }, { label: "C", text: "8" }], correctAnswer: "C", explanation: "3 sets create 8 regions (including outside). 2^3 = 8!" },
    ],
  },

  // === PROBABILITY ===
  "probability-basics": {
    id: "probability-basics", moduleId: "math-computing", title: "Probability Basics", xpReward: 100, category: "Probability",
    steps: [
      { type: "quiz", title: "Probability Range", difficulty: "easy", question: "Probability ranges from?", options: [{ label: "A", text: "0 to 100" }, { label: "B", text: "0 to 1" }, { label: "C", text: "-1 to 1" }], correctAnswer: "B", explanation: "P = 0 (impossible) to 1 (certain). Or 0% to 100%!" },
      { type: "quiz", title: "Coin Flip", difficulty: "easy", question: "Fair coin heads probability?", options: [{ label: "A", text: "0.25" }, { label: "B", text: "0.5" }, { label: "C", text: "1" }], correctAnswer: "B", explanation: "1 outcome / 2 possible = 0.5 or 50% chance!" },
      { type: "quiz", title: "Complement", difficulty: "medium", question: "If P(rain)=0.3, P(no rain)=?", options: [{ label: "A", text: "0.3" }, { label: "B", text: "0.7" }, { label: "C", text: "0.6" }], correctAnswer: "B", explanation: "Complement: P(not A) = 1 - P(A). 1 - 0.3 = 0.7!" },
      { type: "quiz", title: "Dice Roll", difficulty: "medium", question: "Probability of rolling 6?", options: [{ label: "A", text: "1/4" }, { label: "B", text: "1/6" }, { label: "C", text: "1/12" }], correctAnswer: "B", explanation: "Fair die: each face has 1/6 probability. 6 equally likely outcomes!" },
      { type: "quiz", title: "Sum Rule", difficulty: "hard", question: "P(A or B) for mutually exclusive?", options: [{ label: "A", text: "P(A) × P(B)" }, { label: "B", text: "P(A) + P(B)" }, { label: "C", text: "P(A) - P(B)" }], correctAnswer: "B", explanation: "Mutually exclusive: can't happen together. Just add probabilities!" },
    ],
  },
  "conditional-probability": {
    id: "conditional-probability", moduleId: "math-computing", title: "Conditional Probability", xpReward: 125, category: "Probability",
    steps: [
      { type: "quiz", title: "Conditional Meaning", difficulty: "hard", question: "P(A|B) means?", options: [{ label: "A", text: "A or B" }, { label: "B", text: "A given B occurred" }, { label: "C", text: "A and B" }], correctAnswer: "B", explanation: "P(A|B) = probability of A, given that B already happened!" },
      { type: "quiz", title: "Independence", difficulty: "hard", question: "Independent events mean?", options: [{ label: "A", text: "One affects the other" }, { label: "B", text: "One doesn't affect the other" }, { label: "C", text: "Same probability" }], correctAnswer: "B", explanation: "Independent: P(A|B) = P(A). Knowing B doesn't change A's probability!" },
      { type: "quiz", title: "Product Rule", difficulty: "hard", question: "P(A and B) for independent events?", options: [{ label: "A", text: "P(A) + P(B)" }, { label: "B", text: "P(A) × P(B)" }, { label: "C", text: "P(A) / P(B)" }], correctAnswer: "B", explanation: "Independent events: multiply probabilities! P(A and B) = P(A) × P(B)!" },
      { type: "quiz", title: "Bayes Theorem", difficulty: "hard", question: "Bayes theorem helps?", options: [{ label: "A", text: "Count outcomes" }, { label: "B", text: "Update probability with new evidence" }, { label: "C", text: "Add probabilities" }], correctAnswer: "B", explanation: "Bayes updates beliefs: P(A|B) = P(B|A) × P(A) / P(B)!" },
    ],
  },

  // === GRAPHS & TREES ===
  "graphs-intro": {
    id: "graphs-intro", moduleId: "math-computing", title: "Graph Theory", xpReward: 125, category: "Graphs",
    steps: [
      { type: "quiz", title: "Graph Components", difficulty: "medium", question: "Graphs consist of?", options: [{ label: "A", text: "Lines and curves" }, { label: "B", text: "Vertices and edges" }, { label: "C", text: "X and Y axes" }], correctAnswer: "B", explanation: "Vertices (nodes) connected by edges (links). Not like coordinate graphs!" },
      { type: "quiz", title: "Directed Graph", difficulty: "medium", question: "Directed graph edges have?", options: [{ label: "A", text: "Colors" }, { label: "B", text: "Direction (arrows)" }, { label: "C", text: "No connections" }], correctAnswer: "B", explanation: "Directed = one-way edges (A→B not same as B→A). Undirected = two-way." },
      { type: "quiz", title: "Weighted Graph", difficulty: "hard", question: "Weighted edges have?", options: [{ label: "A", text: "Assigned values (costs/distances)" }, { label: "B", text: "Colors" }, { label: "C", text: "Labels only" }], correctAnswer: "A", explanation: "Weights represent costs, distances, or capacities on edges!" },
      { type: "quiz", title: "Cycle", difficulty: "hard", question: "A cycle is?", options: [{ label: "A", text: "A dead end" }, { label: "B", text: "Path that returns to start" }, { label: "C", text: "Isolated node" }], correctAnswer: "B", explanation: "Cycle = path from vertex back to itself. A→B→C→A!" },
      { type: "quiz", title: "Connected Graph", difficulty: "medium", question: "Connected graph means?", options: [{ label: "A", text: "All vertices have edges to each other" }, { label: "B", text: "Path exists between any two vertices" }, { label: "C", text: "No cycles" }], correctAnswer: "B", explanation: "Connected = can reach any vertex from any other. One component!" },
    ],
  },
  "trees-basics": {
    id: "trees-basics", moduleId: "math-computing", title: "Tree Structures", xpReward: 125, category: "Graphs",
    steps: [
      { type: "quiz", title: "Tree Definition", difficulty: "medium", question: "A tree is a graph that?", options: [{ label: "A", text: "Has cycles" }, { label: "B", text: "Has no cycles, connected" }, { label: "C", text: "Has multiple roots" }], correctAnswer: "B", explanation: "Trees: connected (one piece), acyclic (no loops), N nodes = N-1 edges!" },
      { type: "quiz", title: "Binary Tree", difficulty: "medium", question: "Binary tree node has at most?", options: [{ label: "A", text: "1 child" }, { label: "B", text: "2 children" }, { label: "C", text: "Unlimited children" }], correctAnswer: "B", explanation: "Binary = at most 2 children per node. Left and right!" },
      { type: "quiz", title: "Root Node", difficulty: "easy", question: "Root of a tree has?", options: [{ label: "A", text: "Many parents" }, { label: "B", text: "No parent" }, { label: "C", text: "No children" }], correctAnswer: "B", explanation: "Root is the top node - no parent, all other nodes descend from it!" },
      { type: "quiz", title: "Leaf Node", difficulty: "easy", question: "Leaf nodes have?", options: [{ label: "A", text: "Many children" }, { label: "B", text: "No children" }, { label: "C", text: "No parent" }], correctAnswer: "B", explanation: "Leaves are at the bottom - no children, end of branches!" },
      { type: "quiz", title: "Tree Traversal", difficulty: "hard", question: "In-order traversal visits?", options: [{ label: "A", text: "Root first" }, { label: "B", text: "Left, root, right" }, { label: "C", text: "All leaves first" }], correctAnswer: "B", explanation: "In-order: left subtree → root → right subtree. Gives sorted order in BST!" },
      { type: "quiz", title: "BST Property", difficulty: "hard", question: "Binary Search Tree property?", options: [{ label: "A", text: "Left < root < right" }, { label: "B", text: "Random order" }, { label: "C", text: "All equal values" }], correctAnswer: "A", explanation: "BST: left subtree values < root < right subtree values!" },
    ],
  },
  "graph-algorithms": {
    id: "graph-algorithms", moduleId: "math-computing", title: "Graph Algorithms", xpReward: 150, category: "Graphs",
    steps: [
      { type: "quiz", title: "BFS", difficulty: "hard", question: "BFS explores?", options: [{ label: "A", text: "Deepest first" }, { label: "B", text: "Level by level" }, { label: "C", text: "Random order" }], correctAnswer: "B", explanation: "Breadth-First Search: visit all neighbors before going deeper. Uses queue!" },
      { type: "quiz", title: "DFS", difficulty: "hard", question: "DFS explores?", options: [{ label: "A", text: "Level by level" }, { label: "B", text: "As deep as possible first" }, { label: "C", text: "Alphabetically" }], correctAnswer: "B", explanation: "Depth-First Search: go deep down one path before backtracking. Uses stack!" },
      { type: "quiz", title: "Shortest Path", difficulty: "hard", question: "Dijkstra's finds?", options: [{ label: "A", text: "Longest path" }, { label: "B", text: "Shortest path in weighted graph" }, { label: "C", text: "All cycles" }], correctAnswer: "B", explanation: "Dijkstra's algorithm finds shortest paths from source to all vertices!" },
      { type: "quiz", title: "MST", difficulty: "hard", question: "Minimum Spanning Tree connects?", options: [{ label: "A", text: "All vertices with minimum total weight" }, { label: "B", text: "Only some vertices" }, { label: "C", text: "With maximum edges" }], correctAnswer: "A", explanation: "MST connects all vertices with minimum total edge weight, no cycles!" },
    ],
  },

  // === COMPLEXITY ===
  "big-o-intro": {
    id: "big-o-intro", moduleId: "math-computing", title: "Big-O Notation", xpReward: 150, category: "Complexity",
    steps: [
      { type: "quiz", title: "Big-O Purpose", difficulty: "hard", question: "Big-O describes?", options: [{ label: "A", text: "Exact runtime" }, { label: "B", text: "Growth rate as input grows" }, { label: "C", text: "Memory address" }], correctAnswer: "B", explanation: "Big-O = how time/space SCALES with input size. Not exact timing!" },
      { type: "quiz", title: "O(1)", difficulty: "medium", question: "O(1) means?", options: [{ label: "A", text: "Linear time" }, { label: "B", text: "Constant time" }, { label: "C", text: "Logarithmic" }], correctAnswer: "B", explanation: "O(1) = constant. Same time regardless of input size. Array access!" },
      { type: "quiz", title: "O(n)", difficulty: "medium", question: "O(n) means?", options: [{ label: "A", text: "Constant" }, { label: "B", text: "Linear - grows with n" }, { label: "C", text: "Quadratic" }], correctAnswer: "B", explanation: "O(n) = linear. Double input = double time. Simple loop!" },
      { type: "quiz", title: "O(log n)", difficulty: "hard", question: "O(log n) example?", options: [{ label: "A", text: "Linear search" }, { label: "B", text: "Binary search" }, { label: "C", text: "Bubble sort" }], correctAnswer: "B", explanation: "Binary search halves search space each step. Log base 2 of n!" },
      { type: "quiz", title: "O(n²)", difficulty: "hard", question: "O(n²) example?", options: [{ label: "A", text: "Array access" }, { label: "B", text: "Nested loops over same array" }, { label: "C", text: "Binary search" }], correctAnswer: "B", explanation: "Nested loops: n × n = n². Bubble sort is O(n²)!" },
    ],
  },
  "complexity-comparison": {
    id: "complexity-comparison", moduleId: "math-computing", title: "Complexity Comparison", xpReward: 150, category: "Complexity",
    steps: [
      { type: "quiz", title: "Fastest to Slowest", difficulty: "hard", question: "Order from fastest?", options: [{ label: "A", text: "O(1), O(log n), O(n), O(n²)" }, { label: "B", text: "O(n²), O(n), O(log n), O(1)" }, { label: "C", text: "O(n), O(1), O(n²), O(log n)" }], correctAnswer: "A", explanation: "1 < log n < n < n log n < n² < 2^n. Constant beats all!" },
      { type: "quiz", title: "Nested Loops", difficulty: "hard", question: "Two nested loops over n?", options: [{ label: "A", text: "O(n)" }, { label: "B", text: "O(n²)" }, { label: "C", text: "O(2n)" }], correctAnswer: "B", explanation: "Loop inside loop = multiply. n × n = n². Quadratic time!" },
      { type: "quiz", title: "Sequential Loops", difficulty: "hard", question: "Two sequential loops over n?", options: [{ label: "A", text: "O(n)" }, { label: "B", text: "O(2n)" }, { label: "C", text: "O(n²)" }], correctAnswer: "A", explanation: "Sequential = add. O(n) + O(n) = O(2n) = O(n). Constants drop!" },
      { type: "quiz", title: "Drop Constants", difficulty: "hard", question: "O(3n + 5) simplifies to?", options: [{ label: "A", text: "O(3n)" }, { label: "B", text: "O(n)" }, { label: "C", text: "O(5)" }], correctAnswer: "B", explanation: "Big-O drops constants and lower terms. Focus on dominant growth!" },
      { type: "quiz", title: "Exponential", difficulty: "hard", question: "O(2^n) is?", options: [{ label: "A", text: "Very fast" }, { label: "B", text: "Exponential, very slow" }, { label: "C", text: "Same as O(n²)" }], correctAnswer: "B", explanation: "Exponential grows incredibly fast. Usually impractical for large n!" },
    ],
  },

  // === FUNCTIONS ===
  "functions-math": {
    id: "functions-math", moduleId: "math-computing", title: "Functions", xpReward: 100, category: "Functions",
    steps: [
      { type: "quiz", title: "Function Definition", difficulty: "medium", question: "A function maps?", options: [{ label: "A", text: "Input to exactly one output" }, { label: "B", text: "Input to multiple outputs" }, { label: "C", text: "Nothing" }], correctAnswer: "A", explanation: "Functions: each input → exactly one output. f(x) = x + 1." },
      { type: "quiz", title: "Domain", difficulty: "medium", question: "Domain is?", options: [{ label: "A", text: "Set of outputs" }, { label: "B", text: "Set of valid inputs" }, { label: "C", text: "Function name" }], correctAnswer: "B", explanation: "Domain = valid inputs. Range = possible outputs!" },
      { type: "quiz", title: "Range", difficulty: "medium", question: "Range is?", options: [{ label: "A", text: "Set of inputs" }, { label: "B", text: "Set of outputs" }, { label: "C", text: "Domain" }], correctAnswer: "B", explanation: "Range = all possible output values the function can produce!" },
      { type: "quiz", title: "Composition", difficulty: "hard", question: "f(g(x)) means?", options: [{ label: "A", text: "Apply f first" }, { label: "B", text: "Apply g first, then f" }, { label: "C", text: "Add f and g" }], correctAnswer: "B", explanation: "Function composition: inner function g first, then outer function f!" },
      { type: "quiz", title: "Inverse", difficulty: "hard", question: "f⁻¹(x) does?", options: [{ label: "A", text: "Reverses f" }, { label: "B", text: "Squares f" }, { label: "C", text: "Negates f" }], correctAnswer: "A", explanation: "Inverse undoes the function: f⁻¹(f(x)) = x. Reverses the mapping!" },
    ],
  },

  // === ALGEBRA ===
  "algebra-basics": {
    id: "algebra-basics", moduleId: "math-computing", title: "Algebra Fundamentals", xpReward: 75, category: "Algebra",
    steps: [
      { type: "quiz", title: "Variable", difficulty: "easy", question: "In algebra, a variable is?", options: [{ label: "A", text: "A constant number" }, { label: "B", text: "A symbol representing unknown" }, { label: "C", text: "An operator" }], correctAnswer: "B", explanation: "Variables (x, y, n) stand for unknown values we solve for!" },
      { type: "quiz", title: "Equation Solving", difficulty: "medium", question: "To solve 2x = 10?", options: [{ label: "A", text: "Add 2" }, { label: "B", text: "Divide by 2" }, { label: "C", text: "Multiply by 2" }], correctAnswer: "B", explanation: "Undo operations: 2x = 10 → x = 10/2 → x = 5!" },
      { type: "quiz", title: "Order of Operations", difficulty: "medium", question: "PEMDAS starts with?", options: [{ label: "A", text: "Multiplication" }, { label: "B", text: "Parentheses" }, { label: "C", text: "Addition" }], correctAnswer: "B", explanation: "Parentheses, Exponents, Multiplication/Division, Addition/Subtraction!" },
      { type: "quiz", title: "Linear Equation", difficulty: "medium", question: "Linear equation has?", options: [{ label: "A", text: "x² terms" }, { label: "B", text: "Only x to power 1" }, { label: "C", text: "No variables" }], correctAnswer: "B", explanation: "Linear = highest power is 1. Like y = 2x + 3. Straight line graph!" },
      { type: "quiz", title: "Quadratic", difficulty: "hard", question: "Quadratic has highest power?", options: [{ label: "A", text: "1" }, { label: "B", text: "2" }, { label: "C", text: "3" }], correctAnswer: "B", explanation: "Quadratic = x². Example: x² + 2x + 1 = 0. Parabola graph!" },
    ],
  },
  "matrices-basics": {
    id: "matrices-basics", moduleId: "math-computing", title: "Matrices", xpReward: 125, category: "Algebra",
    steps: [
      { type: "quiz", title: "Matrix Definition", difficulty: "medium", question: "A matrix is?", options: [{ label: "A", text: "Single number" }, { label: "B", text: "2D array of numbers" }, { label: "C", text: "Random list" }], correctAnswer: "B", explanation: "Matrix = rectangular array of numbers in rows and columns!" },
      { type: "quiz", title: "Matrix Size", difficulty: "medium", question: "3×4 matrix has?", options: [{ label: "A", text: "3 rows, 4 columns" }, { label: "B", text: "4 rows, 3 columns" }, { label: "C", text: "12 rows" }], correctAnswer: "A", explanation: "Rows × Columns. 3×4 = 3 rows and 4 columns. 12 elements total!" },
      { type: "quiz", title: "Matrix Addition", difficulty: "medium", question: "Add matrices element by?", options: [{ label: "A", text: "Multiply then add" }, { label: "B", text: "Element - same position" }, { label: "C", text: "Row sums" }], correctAnswer: "B", explanation: "Add corresponding elements. Matrices must be same size!" },
      { type: "quiz", title: "Identity Matrix", difficulty: "hard", question: "Identity matrix has?", options: [{ label: "A", text: "All zeros" }, { label: "B", text: "1s on diagonal, 0s elsewhere" }, { label: "C", text: "All ones" }], correctAnswer: "B", explanation: "Identity I: 1s on main diagonal. A × I = A. Multiplication identity!" },
      { type: "quiz", title: "Matrix Multiply", difficulty: "hard", question: "Can multiply 2×3 and 3×4 matrices?", options: [{ label: "A", text: "No" }, { label: "B", text: "Yes, result is 2×4" }, { label: "C", text: "Yes, result is 3×3" }], correctAnswer: "B", explanation: "Inner dimensions must match (3=3). Result is outer dimensions: 2×4!" },
    ],
  },
};

// ==========================================
// COURSE 4: CYBERSECURITY
// ==========================================

export const cybersecurityLessons: Record<string, LessonData> = {
  "cia-triad": {
    id: "cia-triad", moduleId: "cybersecurity", title: "CIA Triad", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "CIA Meaning", difficulty: "easy", question: "CIA in security stands for?", options: [{ label: "A", text: "Central Intelligence Agency" }, { label: "B", text: "Confidentiality, Integrity, Availability" }, { label: "C", text: "Computer Information Access" }], correctAnswer: "B", explanation: "The CIA Triad is the foundation of information security!" },
      { type: "quiz", title: "Confidentiality", difficulty: "medium", question: "Confidentiality ensures?", options: [{ label: "A", text: "Data is always available" }, { label: "B", text: "Only authorized access to data" }, { label: "C", text: "Data is accurate" }], correctAnswer: "B", explanation: "Confidentiality = keeping data secret from unauthorized users!" },
      { type: "quiz", title: "Integrity", difficulty: "medium", question: "Integrity means?", options: [{ label: "A", text: "Data is encrypted" }, { label: "B", text: "Data is accurate and unmodified" }, { label: "C", text: "Data is backed up" }], correctAnswer: "B", explanation: "Integrity ensures data hasn't been tampered with or corrupted!" },
      { type: "quiz", title: "Availability", difficulty: "medium", question: "Availability ensures?", options: [{ label: "A", text: "Data is encrypted" }, { label: "B", text: "Data is accessible when needed" }, { label: "C", text: "Data is private" }], correctAnswer: "B", explanation: "Availability = systems and data are accessible to authorized users when needed!" },
    ],
  },
  "threats-vulnerabilities": {
    id: "threats-vulnerabilities", moduleId: "cybersecurity", title: "Threats & Vulnerabilities", xpReward: 100, category: "Foundations",
    steps: [
      { type: "quiz", title: "Threat Definition", difficulty: "medium", question: "A threat is?", options: [{ label: "A", text: "A weakness in a system" }, { label: "B", text: "A potential danger to security" }, { label: "C", text: "A security control" }], correctAnswer: "B", explanation: "Threat = potential for harm. Could be hackers, malware, natural disasters!" },
      { type: "quiz", title: "Vulnerability", difficulty: "medium", question: "A vulnerability is?", options: [{ label: "A", text: "A weakness that can be exploited" }, { label: "B", text: "An attack in progress" }, { label: "C", text: "A firewall" }], correctAnswer: "A", explanation: "Vulnerability = weakness. Unpatched software, weak passwords are examples!" },
      { type: "quiz", title: "Risk Formula", difficulty: "hard", question: "Risk = ?", options: [{ label: "A", text: "Threat + Vulnerability" }, { label: "B", text: "Threat × Vulnerability × Impact" }, { label: "C", text: "Asset ÷ Control" }], correctAnswer: "B", explanation: "Risk combines likelihood of threat exploiting vulnerability and the impact!" },
    ],
  },
  "malware-types": {
    id: "malware-types", moduleId: "cybersecurity", title: "Malware Types", xpReward: 100, category: "Threats",
    steps: [
      { type: "quiz", title: "Virus", difficulty: "easy", question: "A virus needs what to spread?", options: [{ label: "A", text: "Network connection" }, { label: "B", text: "Human action (running infected file)" }, { label: "C", text: "Nothing" }], correctAnswer: "B", explanation: "Viruses attach to files and spread when users execute infected programs!" },
      { type: "quiz", title: "Worm", difficulty: "medium", question: "Worms differ from viruses by?", options: [{ label: "A", text: "Being harmless" }, { label: "B", text: "Self-replicating without user action" }, { label: "C", text: "Only affecting mobile" }], correctAnswer: "B", explanation: "Worms spread automatically across networks without human interaction!" },
      { type: "quiz", title: "Trojan", difficulty: "medium", question: "A Trojan horse?", options: [{ label: "A", text: "Self-replicates" }, { label: "B", text: "Disguises as legitimate software" }, { label: "C", text: "Encrypts files" }], correctAnswer: "B", explanation: "Trojans pretend to be useful software but contain malicious code!" },
      { type: "quiz", title: "Ransomware", difficulty: "medium", question: "Ransomware?", options: [{ label: "A", text: "Steals passwords" }, { label: "B", text: "Encrypts files and demands payment" }, { label: "C", text: "Shows ads" }], correctAnswer: "B", explanation: "Ransomware encrypts your data and demands cryptocurrency for the key!" },
    ],
  },
  "social-engineering": {
    id: "social-engineering", moduleId: "cybersecurity", title: "Social Engineering", xpReward: 100, category: "Threats",
    steps: [
      { type: "quiz", title: "Phishing", difficulty: "easy", question: "Phishing attempts to?", options: [{ label: "A", text: "Install hardware" }, { label: "B", text: "Trick users into revealing information" }, { label: "C", text: "Speed up networks" }], correctAnswer: "B", explanation: "Phishing uses fake emails/websites to steal credentials!" },
      { type: "quiz", title: "Spear Phishing", difficulty: "medium", question: "Spear phishing is?", options: [{ label: "A", text: "Random mass emails" }, { label: "B", text: "Targeted attack on specific person" }, { label: "C", text: "Phone scam" }], correctAnswer: "B", explanation: "Spear phishing targets specific individuals with personalized attacks!" },
      { type: "quiz", title: "Pretexting", difficulty: "hard", question: "Pretexting involves?", options: [{ label: "A", text: "Creating a fabricated scenario" }, { label: "B", text: "USB drops" }, { label: "C", text: "Password guessing" }], correctAnswer: "A", explanation: "Pretexting = creating a fake scenario to manipulate victims into sharing info!" },
    ],
  },
  "authentication": {
    id: "authentication", moduleId: "cybersecurity", title: "Authentication Methods", xpReward: 125, category: "Controls",
    steps: [
      { type: "quiz", title: "Something You Know", difficulty: "easy", question: "Password is?", options: [{ label: "A", text: "Something you have" }, { label: "B", text: "Something you know" }, { label: "C", text: "Something you are" }], correctAnswer: "B", explanation: "Three factors: Know (password), Have (token), Are (biometrics)!" },
      { type: "quiz", title: "MFA", difficulty: "medium", question: "MFA requires?", options: [{ label: "A", text: "Multiple passwords" }, { label: "B", text: "Two or more different factor types" }, { label: "C", text: "Fingerprint only" }], correctAnswer: "B", explanation: "Multi-Factor Authentication combines different types for stronger security!" },
      { type: "quiz", title: "Biometrics", difficulty: "medium", question: "Biometrics include?", options: [{ label: "A", text: "Passwords" }, { label: "B", text: "Fingerprints, face, iris" }, { label: "C", text: "Smart cards" }], correctAnswer: "B", explanation: "Biometrics = unique physical characteristics. Hard to fake but can't be changed if compromised!" },
    ],
  },
  "encryption-basics": {
    id: "encryption-basics", moduleId: "cybersecurity", title: "Encryption Basics", xpReward: 150, category: "Controls",
    steps: [
      { type: "quiz", title: "Symmetric", difficulty: "medium", question: "Symmetric encryption uses?", options: [{ label: "A", text: "Same key for encrypt/decrypt" }, { label: "B", text: "Different keys" }, { label: "C", text: "No keys" }], correctAnswer: "A", explanation: "Symmetric = one shared secret key. Fast but key distribution is challenging!" },
      { type: "quiz", title: "Asymmetric", difficulty: "hard", question: "Asymmetric uses?", options: [{ label: "A", text: "One key" }, { label: "B", text: "Public and private key pair" }, { label: "C", text: "Random keys" }], correctAnswer: "B", explanation: "Public key encrypts, private key decrypts. Solves key distribution problem!" },
      { type: "quiz", title: "AES", difficulty: "hard", question: "AES is?", options: [{ label: "A", text: "Asymmetric algorithm" }, { label: "B", text: "Advanced Encryption Standard (symmetric)" }, { label: "C", text: "Hashing algorithm" }], correctAnswer: "B", explanation: "AES is the gold standard for symmetric encryption. 128/256-bit keys!" },
    ],
  },
  "hashing": {
    id: "hashing", moduleId: "cybersecurity", title: "Hashing & Integrity", xpReward: 150, category: "Controls",
    steps: [
      { type: "quiz", title: "Hash Purpose", difficulty: "medium", question: "Hashing is used for?", options: [{ label: "A", text: "Encrypting messages" }, { label: "B", text: "Verifying data integrity" }, { label: "C", text: "Compressing files" }], correctAnswer: "B", explanation: "Hashes create unique fingerprints - any change produces different hash!" },
      { type: "quiz", title: "One-Way", difficulty: "medium", question: "Hash functions are?", options: [{ label: "A", text: "Reversible" }, { label: "B", text: "One-way (can't reverse)" }, { label: "C", text: "Optional" }], correctAnswer: "B", explanation: "You can't reverse a hash to get original data. Used for password storage!" },
      { type: "quiz", title: "SHA-256", difficulty: "hard", question: "SHA-256 produces?", options: [{ label: "A", text: "128-bit hash" }, { label: "B", text: "256-bit hash" }, { label: "C", text: "512-bit hash" }], correctAnswer: "B", explanation: "SHA-256 creates 256-bit (32-byte) hash. Used in Bitcoin and SSL!" },
    ],
  },
  "network-security": {
    id: "network-security", moduleId: "cybersecurity", title: "Network Security", xpReward: 150, category: "Controls",
    steps: [
      { type: "quiz", title: "Firewall", difficulty: "medium", question: "A firewall?", options: [{ label: "A", text: "Encrypts all data" }, { label: "B", text: "Filters network traffic" }, { label: "C", text: "Stores passwords" }], correctAnswer: "B", explanation: "Firewalls filter traffic based on rules. Block or allow based on ports, IPs, protocols!" },
      { type: "quiz", title: "IDS", difficulty: "hard", question: "IDS stands for?", options: [{ label: "A", text: "Internet Download System" }, { label: "B", text: "Intrusion Detection System" }, { label: "C", text: "Internal Data Storage" }], correctAnswer: "B", explanation: "IDS monitors and alerts on suspicious activity. IPS also blocks threats!" },
      { type: "quiz", title: "VPN", difficulty: "medium", question: "VPN creates?", options: [{ label: "A", text: "Faster connection" }, { label: "B", text: "Encrypted tunnel" }, { label: "C", text: "New IP address only" }], correctAnswer: "B", explanation: "VPN encrypts traffic through a secure tunnel, protecting data in transit!" },
    ],
  },
  "owasp-top10": {
    id: "owasp-top10", moduleId: "cybersecurity", title: "OWASP Top 10", xpReward: 175, category: "Web Security",
    steps: [
      { type: "quiz", title: "OWASP", difficulty: "medium", question: "OWASP is?", options: [{ label: "A", text: "A hacking group" }, { label: "B", text: "Open Web Application Security Project" }, { label: "C", text: "Operating system" }], correctAnswer: "B", explanation: "OWASP is a nonprofit focused on web application security awareness!" },
      { type: "quiz", title: "Top Risks", difficulty: "hard", question: "OWASP Top 10 lists?", options: [{ label: "A", text: "Best websites" }, { label: "B", text: "Most critical web vulnerabilities" }, { label: "C", text: "Programming languages" }], correctAnswer: "B", explanation: "Top 10 includes injection, broken auth, XSS, security misconfiguration, etc!" },
    ],
  },
  "sql-injection": {
    id: "sql-injection", moduleId: "cybersecurity", title: "SQL Injection", xpReward: 150, category: "Web Security",
    steps: [
      { type: "quiz", title: "SQLi Attack", difficulty: "medium", question: "SQL injection exploits?", options: [{ label: "A", text: "Network packets" }, { label: "B", text: "Unsanitized user input in queries" }, { label: "C", text: "Encryption" }], correctAnswer: "B", explanation: "Attackers insert SQL code via input fields to manipulate database queries!" },
      { type: "quiz", title: "Prevention", difficulty: "hard", question: "Best SQLi prevention?", options: [{ label: "A", text: "Strong passwords" }, { label: "B", text: "Parameterized queries/prepared statements" }, { label: "C", text: "Firewall" }], correctAnswer: "B", explanation: "Parameterized queries separate code from data, preventing injection!" },
      { type: "typing", title: "Safe Query", difficulty: "hard", prompt: "Type a parameterized query placeholder!", codeToType: "WHERE id = ?", explanation: "The ? placeholder is replaced safely by the database driver!" },
    ],
  },
  "xss-attacks": {
    id: "xss-attacks", moduleId: "cybersecurity", title: "XSS Attacks", xpReward: 150, category: "Web Security",
    steps: [
      { type: "quiz", title: "XSS Meaning", difficulty: "medium", question: "XSS stands for?", options: [{ label: "A", text: "Extra Secure System" }, { label: "B", text: "Cross-Site Scripting" }, { label: "C", text: "XML Security Standard" }], correctAnswer: "B", explanation: "XSS injects malicious scripts into web pages viewed by other users!" },
      { type: "quiz", title: "XSS Impact", difficulty: "hard", question: "XSS can steal?", options: [{ label: "A", text: "Database files" }, { label: "B", text: "Session cookies/credentials" }, { label: "C", text: "Server hardware" }], correctAnswer: "B", explanation: "XSS can steal cookies, session tokens, and perform actions as the victim!" },
      { type: "quiz", title: "Prevention", difficulty: "hard", question: "Prevent XSS by?", options: [{ label: "A", text: "Using HTTPS" }, { label: "B", text: "Encoding/escaping output" }, { label: "C", text: "Longer passwords" }], correctAnswer: "B", explanation: "Escape HTML characters so scripts render as text, not executable code!" },
    ],
  },
  "incident-response": {
    id: "incident-response", moduleId: "cybersecurity", title: "Incident Response", xpReward: 175, category: "Operations",
    steps: [
      { type: "quiz", title: "IR Phases", difficulty: "medium", question: "First IR phase is?", options: [{ label: "A", text: "Containment" }, { label: "B", text: "Preparation" }, { label: "C", text: "Recovery" }], correctAnswer: "B", explanation: "PICERL: Preparation, Identification, Containment, Eradication, Recovery, Lessons!" },
      { type: "quiz", title: "Containment", difficulty: "hard", question: "Containment goal?", options: [{ label: "A", text: "Find root cause" }, { label: "B", text: "Stop spread of incident" }, { label: "C", text: "Notify press" }], correctAnswer: "B", explanation: "Containment limits damage while you investigate and plan remediation!" },
    ],
  },
  "gdpr-compliance": {
    id: "gdpr-compliance", moduleId: "cybersecurity", title: "GDPR Compliance", xpReward: 150, category: "Compliance",
    steps: [
      { type: "quiz", title: "GDPR Scope", difficulty: "medium", question: "GDPR protects?", options: [{ label: "A", text: "Company secrets" }, { label: "B", text: "Personal data of EU individuals" }, { label: "C", text: "Government data" }], correctAnswer: "B", explanation: "GDPR applies to any organization processing EU residents' personal data!" },
      { type: "quiz", title: "Data Rights", difficulty: "hard", question: "Right to be forgotten means?", options: [{ label: "A", text: "Delete account" }, { label: "B", text: "Request erasure of personal data" }, { label: "C", text: "Password reset" }], correctAnswer: "B", explanation: "Users can request organizations delete their personal data!" },
      { type: "quiz", title: "Breach Notification", difficulty: "hard", question: "GDPR breach report deadline?", options: [{ label: "A", text: "24 hours" }, { label: "B", text: "72 hours" }, { label: "C", text: "7 days" }], correctAnswer: "B", explanation: "Must notify supervisory authority within 72 hours of discovering a breach!" },
    ],
  },
};

// ==========================================
// COURSE 5: AI & DATA SCIENCE
// ==========================================

export const aiDataScienceLessons: Record<string, LessonData> = {
  "ai-intro": {
    id: "ai-intro", moduleId: "ai-data-science", title: "What is AI?", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "AI Definition", difficulty: "easy", question: "AI stands for?", options: [{ label: "A", text: "Automated Intelligence" }, { label: "B", text: "Artificial Intelligence" }, { label: "C", text: "Advanced Interface" }], correctAnswer: "B", explanation: "Artificial Intelligence = machines that can perform tasks requiring human intelligence!" },
      { type: "quiz", title: "AI Goal", difficulty: "medium", question: "AI aims to?", options: [{ label: "A", text: "Replace all humans" }, { label: "B", text: "Simulate intelligent behavior" }, { label: "C", text: "Only play games" }], correctAnswer: "B", explanation: "AI creates systems that can learn, reason, perceive, and make decisions!" },
    ],
  },
  "ml-types": {
    id: "ml-types", moduleId: "ai-data-science", title: "Types of Machine Learning", xpReward: 100, category: "Foundations",
    steps: [
      { type: "quiz", title: "Supervised", difficulty: "medium", question: "Supervised learning uses?", options: [{ label: "A", text: "Unlabeled data" }, { label: "B", text: "Labeled training data" }, { label: "C", text: "No data" }], correctAnswer: "B", explanation: "Supervised = labeled examples. Model learns input→output mappings!" },
      { type: "quiz", title: "Unsupervised", difficulty: "medium", question: "Unsupervised learning finds?", options: [{ label: "A", text: "Predetermined categories" }, { label: "B", text: "Hidden patterns in unlabeled data" }, { label: "C", text: "Specific predictions" }], correctAnswer: "B", explanation: "Unsupervised discovers structure: clustering, anomaly detection!" },
      { type: "quiz", title: "Reinforcement", difficulty: "hard", question: "Reinforcement learning uses?", options: [{ label: "A", text: "Labels" }, { label: "B", text: "Rewards and penalties" }, { label: "C", text: "Only examples" }], correctAnswer: "B", explanation: "RL agents learn through trial and error with reward signals!" },
    ],
  },
  "data-collection": {
    id: "data-collection", moduleId: "ai-data-science", title: "Data Collection", xpReward: 100, category: "Data Pipeline",
    steps: [
      { type: "quiz", title: "Data Quality", difficulty: "medium", question: "GIGO means?", options: [{ label: "A", text: "Great Input Great Output" }, { label: "B", text: "Garbage In Garbage Out" }, { label: "C", text: "Get It Going On" }], correctAnswer: "B", explanation: "Bad data leads to bad models. Quality data is crucial for ML success!" },
      { type: "quiz", title: "Data Sources", difficulty: "medium", question: "Data can come from?", options: [{ label: "A", text: "Only databases" }, { label: "B", text: "APIs, web scraping, sensors, surveys" }, { label: "C", text: "Only manual entry" }], correctAnswer: "B", explanation: "Data sources: databases, APIs, logs, sensors, social media, etc!" },
    ],
  },
  "data-cleaning": {
    id: "data-cleaning", moduleId: "ai-data-science", title: "Data Cleaning", xpReward: 125, category: "Data Pipeline",
    steps: [
      { type: "quiz", title: "Missing Values", difficulty: "medium", question: "Handle missing data by?", options: [{ label: "A", text: "Ignore always" }, { label: "B", text: "Drop, impute, or flag" }, { label: "C", text: "Set to zero" }], correctAnswer: "B", explanation: "Options: remove rows, fill with mean/median, or mark as missing!" },
      { type: "quiz", title: "Outliers", difficulty: "hard", question: "Outliers are?", options: [{ label: "A", text: "Normal values" }, { label: "B", text: "Extreme values far from norm" }, { label: "C", text: "Missing values" }], correctAnswer: "B", explanation: "Outliers can skew models. Investigate: error or valid extreme?" },
      { type: "quiz", title: "Normalization", difficulty: "hard", question: "Normalization scales data to?", options: [{ label: "A", text: "Remove duplicates" }, { label: "B", text: "Common range like 0-1" }, { label: "C", text: "Add more features" }], correctAnswer: "B", explanation: "Scaling helps algorithms that are sensitive to feature magnitudes!" },
    ],
  },
  "train-test-split": {
    id: "train-test-split", moduleId: "ai-data-science", title: "Train/Test Split", xpReward: 100, category: "Model Building",
    steps: [
      { type: "quiz", title: "Why Split", difficulty: "medium", question: "We split data to?", options: [{ label: "A", text: "Save storage" }, { label: "B", text: "Evaluate on unseen data" }, { label: "C", text: "Speed up training" }], correctAnswer: "B", explanation: "Test set simulates real-world performance on data model hasn't seen!" },
      { type: "quiz", title: "Common Split", difficulty: "medium", question: "Typical train/test ratio?", options: [{ label: "A", text: "50/50" }, { label: "B", text: "80/20 or 70/30" }, { label: "C", text: "99/1" }], correctAnswer: "B", explanation: "80% train, 20% test is common. Enough data to learn and evaluate!" },
    ],
  },
  "linear-regression": {
    id: "linear-regression", moduleId: "ai-data-science", title: "Linear Regression", xpReward: 150, category: "Algorithms",
    steps: [
      { type: "quiz", title: "Purpose", difficulty: "medium", question: "Linear regression predicts?", options: [{ label: "A", text: "Categories" }, { label: "B", text: "Continuous values" }, { label: "C", text: "Images" }], correctAnswer: "B", explanation: "Regression predicts continuous numbers: price, temperature, sales!" },
      { type: "quiz", title: "Line Fit", difficulty: "medium", question: "Best fit line minimizes?", options: [{ label: "A", text: "Points on line" }, { label: "B", text: "Sum of squared errors" }, { label: "C", text: "Number of features" }], correctAnswer: "B", explanation: "Least squares finds line that minimizes prediction errors!" },
    ],
  },
  "classification": {
    id: "classification", moduleId: "ai-data-science", title: "Classification", xpReward: 150, category: "Algorithms",
    steps: [
      { type: "quiz", title: "Purpose", difficulty: "medium", question: "Classification predicts?", options: [{ label: "A", text: "Continuous values" }, { label: "B", text: "Categories/classes" }, { label: "C", text: "Time series" }], correctAnswer: "B", explanation: "Classification: spam/not spam, cat/dog, fraud/legit!" },
      { type: "quiz", title: "Binary", difficulty: "medium", question: "Binary classification has?", options: [{ label: "A", text: "1 class" }, { label: "B", text: "2 classes" }, { label: "C", text: "Many classes" }], correctAnswer: "B", explanation: "Binary = two outcomes: yes/no, true/false, positive/negative!" },
    ],
  },
  "decision-trees": {
    id: "decision-trees", moduleId: "ai-data-science", title: "Decision Trees", xpReward: 150, category: "Algorithms",
    steps: [
      { type: "quiz", title: "Structure", difficulty: "medium", question: "Decision tree splits on?", options: [{ label: "A", text: "Random features" }, { label: "B", text: "Most informative features" }, { label: "C", text: "All features equally" }], correctAnswer: "B", explanation: "Trees split on features that best separate classes (information gain)!" },
      { type: "quiz", title: "Interpretable", difficulty: "medium", question: "Decision trees are?", options: [{ label: "A", text: "Black boxes" }, { label: "B", text: "Easy to interpret" }, { label: "C", text: "Only for images" }], correctAnswer: "B", explanation: "Trees show clear decision rules - great for explainability!" },
    ],
  },
  "neural-networks": {
    id: "neural-networks", moduleId: "ai-data-science", title: "Neural Networks Intro", xpReward: 200, category: "Deep Learning",
    steps: [
      { type: "quiz", title: "Inspiration", difficulty: "medium", question: "Neural networks are inspired by?", options: [{ label: "A", text: "Computer circuits" }, { label: "B", text: "Human brain neurons" }, { label: "C", text: "Internet" }], correctAnswer: "B", explanation: "Artificial neurons loosely model biological neurons!" },
      { type: "quiz", title: "Layers", difficulty: "hard", question: "Deep learning means?", options: [{ label: "A", text: "Complex math" }, { label: "B", text: "Many hidden layers" }, { label: "C", text: "Large datasets" }], correctAnswer: "B", explanation: "Deep = multiple hidden layers. Learns hierarchical features!" },
    ],
  },
  "model-evaluation": {
    id: "model-evaluation", moduleId: "ai-data-science", title: "Model Evaluation", xpReward: 150, category: "Evaluation",
    steps: [
      { type: "quiz", title: "Accuracy", difficulty: "medium", question: "Accuracy measures?", options: [{ label: "A", text: "Speed" }, { label: "B", text: "Correct predictions / total" }, { label: "C", text: "Memory use" }], correctAnswer: "B", explanation: "Accuracy = (TP + TN) / Total. But can be misleading with imbalanced data!" },
      { type: "quiz", title: "Precision", difficulty: "hard", question: "Precision focuses on?", options: [{ label: "A", text: "All negatives" }, { label: "B", text: "Positive predictions accuracy" }, { label: "C", text: "Speed" }], correctAnswer: "B", explanation: "Precision = TP / (TP + FP). Of predicted positives, how many correct?" },
      { type: "quiz", title: "Recall", difficulty: "hard", question: "Recall measures?", options: [{ label: "A", text: "False positives" }, { label: "B", text: "True positives found" }, { label: "C", text: "Training time" }], correctAnswer: "B", explanation: "Recall = TP / (TP + FN). Of actual positives, how many did we find?" },
    ],
  },
  "ethics-in-ai": {
    id: "ethics-in-ai", moduleId: "ai-data-science", title: "Ethics in AI", xpReward: 125, category: "Ethics",
    steps: [
      { type: "quiz", title: "Bias", difficulty: "medium", question: "AI bias comes from?", options: [{ label: "A", text: "Random chance" }, { label: "B", text: "Biased training data" }, { label: "C", text: "Hardware" }], correctAnswer: "B", explanation: "Models learn biases present in training data. Garbage in, bias out!" },
      { type: "quiz", title: "Fairness", difficulty: "hard", question: "Fair AI should?", options: [{ label: "A", text: "Maximize accuracy only" }, { label: "B", text: "Treat groups equitably" }, { label: "C", text: "Hide decisions" }], correctAnswer: "B", explanation: "Consider disparate impact across demographic groups!" },
    ],
  },
};

// ==========================================
// COURSE 6: BUSINESS INFORMATION SYSTEMS
// ==========================================

export const businessSystemsLessons: Record<string, LessonData> = {
  "bis-intro": {
    id: "bis-intro", moduleId: "business-systems", title: "Business Information Systems", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "BIS Purpose", difficulty: "easy", question: "Information systems help businesses?", options: [{ label: "A", text: "Only store data" }, { label: "B", text: "Make better decisions" }, { label: "C", text: "Avoid technology" }], correctAnswer: "B", explanation: "IS collects, processes, stores data to support operations and decisions!" },
    ],
  },
  "info-system-types": {
    id: "info-system-types", moduleId: "business-systems", title: "Types of IS", xpReward: 100, category: "Foundations",
    steps: [
      { type: "quiz", title: "TPS", difficulty: "medium", question: "TPS handles?", options: [{ label: "A", text: "Executive reports" }, { label: "B", text: "Day-to-day transactions" }, { label: "C", text: "Strategic planning" }], correctAnswer: "B", explanation: "Transaction Processing Systems: sales, orders, payroll - routine operations!" },
      { type: "quiz", title: "MIS", difficulty: "medium", question: "MIS provides?", options: [{ label: "A", text: "Real-time trading" }, { label: "B", text: "Management reports from TPS data" }, { label: "C", text: "Customer chats" }], correctAnswer: "B", explanation: "Management Information Systems summarize TPS data for managers!" },
      { type: "quiz", title: "DSS", difficulty: "hard", question: "DSS helps with?", options: [{ label: "A", text: "Routine tasks" }, { label: "B", text: "Semi-structured decisions" }, { label: "C", text: "Data entry" }], correctAnswer: "B", explanation: "Decision Support Systems use models and analysis for complex decisions!" },
    ],
  },
  "erp-systems": {
    id: "erp-systems", moduleId: "business-systems", title: "ERP Systems", xpReward: 125, category: "Enterprise Systems",
    steps: [
      { type: "quiz", title: "ERP Purpose", difficulty: "medium", question: "ERP integrates?", options: [{ label: "A", text: "Only finance" }, { label: "B", text: "All business functions" }, { label: "C", text: "Marketing only" }], correctAnswer: "B", explanation: "Enterprise Resource Planning unifies HR, finance, sales, inventory, etc!" },
      { type: "quiz", title: "ERP Benefits", difficulty: "hard", question: "ERP advantage?", options: [{ label: "A", text: "Isolated data" }, { label: "B", text: "Single source of truth" }, { label: "C", text: "Simple implementation" }], correctAnswer: "B", explanation: "ERP eliminates data silos - one integrated database for all!" },
    ],
  },
  "crm-basics": {
    id: "crm-basics", moduleId: "business-systems", title: "CRM Basics", xpReward: 125, category: "Enterprise Systems",
    steps: [
      { type: "quiz", title: "CRM Focus", difficulty: "medium", question: "CRM manages?", options: [{ label: "A", text: "Employee schedules" }, { label: "B", text: "Customer relationships" }, { label: "C", text: "Server hardware" }], correctAnswer: "B", explanation: "Customer Relationship Management tracks interactions, sales, service!" },
      { type: "quiz", title: "CRM Data", difficulty: "medium", question: "CRM stores?", options: [{ label: "A", text: "Only phone numbers" }, { label: "B", text: "Contact history, preferences, transactions" }, { label: "C", text: "Inventory only" }], correctAnswer: "B", explanation: "CRM = 360° customer view: communications, purchases, support tickets!" },
    ],
  },
  "e-commerce": {
    id: "e-commerce", moduleId: "business-systems", title: "E-Commerce Models", xpReward: 100, category: "Digital Business",
    steps: [
      { type: "quiz", title: "B2C", difficulty: "easy", question: "B2C means?", options: [{ label: "A", text: "Business to Contractor" }, { label: "B", text: "Business to Consumer" }, { label: "C", text: "Bank to Customer" }], correctAnswer: "B", explanation: "B2C: businesses selling directly to consumers. Amazon, retail websites!" },
      { type: "quiz", title: "B2B", difficulty: "medium", question: "B2B example?", options: [{ label: "A", text: "Online shopping" }, { label: "B", text: "Wholesaler selling to retailer" }, { label: "C", text: "eBay auction" }], correctAnswer: "B", explanation: "B2B: businesses selling to other businesses. Bulk orders, supplies!" },
      { type: "quiz", title: "C2C", difficulty: "medium", question: "C2C platform?", options: [{ label: "A", text: "Oracle" }, { label: "B", text: "eBay, Craigslist" }, { label: "C", text: "SAP" }], correctAnswer: "B", explanation: "C2C: consumers selling to consumers. Peer marketplaces!" },
    ],
  },
  "cloud-computing": {
    id: "cloud-computing", moduleId: "business-systems", title: "Cloud Computing", xpReward: 125, category: "Infrastructure",
    steps: [
      { type: "quiz", title: "Cloud Models", difficulty: "medium", question: "SaaS means?", options: [{ label: "A", text: "Server as a Service" }, { label: "B", text: "Software as a Service" }, { label: "C", text: "Storage as a Service" }], correctAnswer: "B", explanation: "SaaS = software delivered via internet. Gmail, Salesforce, Office 365!" },
      { type: "quiz", title: "IaaS", difficulty: "hard", question: "IaaS provides?", options: [{ label: "A", text: "Applications" }, { label: "B", text: "Virtual infrastructure (servers, storage)" }, { label: "C", text: "Networking only" }], correctAnswer: "B", explanation: "Infrastructure as a Service: rent virtual machines, storage. AWS EC2!" },
      { type: "quiz", title: "PaaS", difficulty: "hard", question: "PaaS includes?", options: [{ label: "A", text: "Hardware only" }, { label: "B", text: "Platform for developing apps" }, { label: "C", text: "End-user software" }], correctAnswer: "B", explanation: "Platform as a Service: development environment. Heroku, Google App Engine!" },
    ],
  },
  "digital-marketing": {
    id: "digital-marketing", moduleId: "business-systems", title: "Digital Marketing", xpReward: 125, category: "Marketing",
    steps: [
      { type: "quiz", title: "SEO", difficulty: "medium", question: "SEO improves?", options: [{ label: "A", text: "Server speed" }, { label: "B", text: "Search engine ranking" }, { label: "C", text: "Database queries" }], correctAnswer: "B", explanation: "Search Engine Optimization: rank higher in Google organically!" },
      { type: "quiz", title: "PPC", difficulty: "medium", question: "PPC means?", options: [{ label: "A", text: "Pages Per Click" }, { label: "B", text: "Pay Per Click advertising" }, { label: "C", text: "Private Personal Chat" }], correctAnswer: "B", explanation: "Pay Per Click: advertisers pay when users click their ads!" },
    ],
  },
  "project-management": {
    id: "project-management", moduleId: "business-systems", title: "IT Project Management", xpReward: 150, category: "Management",
    steps: [
      { type: "quiz", title: "Triple Constraint", difficulty: "medium", question: "Project constraints are?", options: [{ label: "A", text: "Money only" }, { label: "B", text: "Scope, time, cost" }, { label: "C", text: "Team size" }], correctAnswer: "B", explanation: "The iron triangle: change one, affects others. Balance is key!" },
      { type: "quiz", title: "Gantt Chart", difficulty: "medium", question: "Gantt chart shows?", options: [{ label: "A", text: "Budget" }, { label: "B", text: "Task timeline/schedule" }, { label: "C", text: "Team hierarchy" }], correctAnswer: "B", explanation: "Gantt = visual timeline. Tasks, durations, dependencies!" },
    ],
  },
};

// ==========================================
// COURSE 7: GAME DEVELOPMENT
// ==========================================

export const gameDevLessons: Record<string, LessonData> = {
  "game-design-basics": {
    id: "game-design-basics", moduleId: "game-development", title: "Game Design Basics", xpReward: 75, category: "Design",
    steps: [
      { type: "quiz", title: "Game Loop", difficulty: "medium", question: "Game loop does?", options: [{ label: "A", text: "Runs once" }, { label: "B", text: "Continuously: input, update, render" }, { label: "C", text: "Only graphics" }], correctAnswer: "B", explanation: "Game loop repeats: handle input → update state → draw frame!" },
      { type: "quiz", title: "FPS", difficulty: "easy", question: "FPS means?", options: [{ label: "A", text: "First Person Shooter" }, { label: "B", text: "Frames Per Second" }, { label: "C", text: "Free Play System" }], correctAnswer: "B", explanation: "FPS = how many frames rendered per second. 60 FPS is smooth!" },
    ],
  },
  "sprites-animation": {
    id: "sprites-animation", moduleId: "game-development", title: "Sprites & Animation", xpReward: 100, category: "Graphics",
    steps: [
      { type: "quiz", title: "Sprite Definition", difficulty: "easy", question: "A sprite is?", options: [{ label: "A", text: "3D model" }, { label: "B", text: "2D image/character" }, { label: "C", text: "Sound effect" }], correctAnswer: "B", explanation: "Sprites are 2D images used for characters, items, backgrounds!" },
      { type: "quiz", title: "Sprite Sheet", difficulty: "medium", question: "Sprite sheet contains?", options: [{ label: "A", text: "One image" }, { label: "B", text: "Multiple animation frames" }, { label: "C", text: "Code" }], correctAnswer: "B", explanation: "Sprite sheets pack all animation frames into one image file!" },
    ],
  },
  "collision-detection": {
    id: "collision-detection", moduleId: "game-development", title: "Collision Detection", xpReward: 125, category: "Physics",
    steps: [
      { type: "quiz", title: "AABB", difficulty: "medium", question: "AABB stands for?", options: [{ label: "A", text: "Always Active Bounding Box" }, { label: "B", text: "Axis-Aligned Bounding Box" }, { label: "C", text: "Advanced Animation Blend Block" }], correctAnswer: "B", explanation: "AABB = simple rectangle collision. Fast to check!" },
      { type: "quiz", title: "Circle Collision", difficulty: "medium", question: "Circle collision checks?", options: [{ label: "A", text: "Area overlap" }, { label: "B", text: "Distance between centers vs radius sum" }, { label: "C", text: "Pixel color" }], correctAnswer: "B", explanation: "If distance < radius1 + radius2, circles collide!" },
    ],
  },
  "input-handling": {
    id: "input-handling", moduleId: "game-development", title: "Input Handling", xpReward: 100, category: "Controls",
    steps: [
      { type: "quiz", title: "Event-Driven", difficulty: "medium", question: "Event-driven input?", options: [{ label: "A", text: "Check every frame" }, { label: "B", text: "React when event fires" }, { label: "C", text: "Only mouse" }], correctAnswer: "B", explanation: "Events fire on key press/release. Efficient for discrete actions!" },
      { type: "quiz", title: "Polling", difficulty: "medium", question: "Polling input means?", options: [{ label: "A", text: "Wait for events" }, { label: "B", text: "Check state every frame" }, { label: "C", text: "Ignore input" }], correctAnswer: "B", explanation: "Polling checks current key state each frame. Good for continuous input!" },
    ],
  },
  "game-physics": {
    id: "game-physics", moduleId: "game-development", title: "Basic Game Physics", xpReward: 150, category: "Physics",
    steps: [
      { type: "quiz", title: "Velocity", difficulty: "medium", question: "Velocity is?", options: [{ label: "A", text: "Position" }, { label: "B", text: "Speed with direction" }, { label: "C", text: "Rotation" }], correctAnswer: "B", explanation: "Velocity = how fast and which direction. Vector with x,y components!" },
      { type: "quiz", title: "Gravity", difficulty: "medium", question: "Simulate gravity by?", options: [{ label: "A", text: "Adding to x velocity" }, { label: "B", text: "Adding to y velocity each frame" }, { label: "C", text: "Rotating sprite" }], correctAnswer: "B", explanation: "Add constant downward acceleration to y velocity each frame!" },
    ],
  },
  "audio-in-games": {
    id: "audio-in-games", moduleId: "game-development", title: "Audio in Games", xpReward: 100, category: "Audio",
    steps: [
      { type: "quiz", title: "Sound Types", difficulty: "easy", question: "SFX are?", options: [{ label: "A", text: "Background music" }, { label: "B", text: "Sound effects (short sounds)" }, { label: "C", text: "Voice acting" }], correctAnswer: "B", explanation: "SFX = sound effects: jumps, explosions, clicks. Short, triggered!" },
      { type: "quiz", title: "Audio Formats", difficulty: "medium", question: "Web-friendly audio?", options: [{ label: "A", text: "WAV only" }, { label: "B", text: "MP3, OGG, WebM" }, { label: "C", text: "FLAC only" }], correctAnswer: "B", explanation: "MP3 and OGG are compressed, work well in browsers!" },
    ],
  },
  "level-design": {
    id: "level-design", moduleId: "game-development", title: "Level Design Basics", xpReward: 125, category: "Design",
    steps: [
      { type: "quiz", title: "Flow", difficulty: "medium", question: "Good level flow means?", options: [{ label: "A", text: "Random obstacles" }, { label: "B", text: "Guiding player naturally" }, { label: "C", text: "Maximum difficulty" }], correctAnswer: "B", explanation: "Visual cues, pacing, difficulty curve guide players through levels!" },
      { type: "quiz", title: "Difficulty Curve", difficulty: "hard", question: "Ideal difficulty curve?", options: [{ label: "A", text: "Constant hard" }, { label: "B", text: "Gradual increase with peaks" }, { label: "C", text: "Random" }], correctAnswer: "B", explanation: "Start easy, gradually increase with occasional spikes and rest!" },
    ],
  },
};

// Import expanded lessons from the expanded module
import { allExpandedLessons } from "./lessonsExpanded";

// Export all lessons combined (including expanded lessons)
export const allLessons: Record<string, LessonData> = {
  ...javaLessons,
  ...systemsLessons,
  ...mathLessons,
  ...cybersecurityLessons,
  ...aiDataScienceLessons,
  ...businessSystemsLessons,
  ...gameDevLessons,
  ...allExpandedLessons, // Merged expanded content
};

// Get lessons by module
export function getLessonsByModule(moduleId: string): LessonData[] {
  return Object.values(allLessons).filter(lesson => lesson.moduleId === moduleId);
}

// Get lesson by ID
export function getLessonById(lessonId: string): LessonData | undefined {
  return allLessons[lessonId];
}

// Get drilling lessons only
export function getDrillingLessons(): LessonData[] {
  return Object.values(allLessons).filter(lesson => lesson.category === "Code Drilling");
}