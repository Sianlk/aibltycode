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
    ],
  },
  "else-elseif": {
    id: "else-elseif", moduleId: "java-foundations", title: "Else & Else If", xpReward: 100, category: "Control Flow",
    steps: [
      { type: "typing", title: "Else If", difficulty: "medium", prompt: "Add multiple conditions!", codeToType: "if (grade >= 90) { } else if (grade >= 80) { }", explanation: "else if adds additional conditions - checked only if previous conditions were false." },
      { type: "quiz", title: "Control Flow", difficulty: "medium", question: "How many else can an if have?", options: [{ label: "A", text: "Unlimited" }, { label: "B", text: "Only one" }, { label: "C", text: "None" }], correctAnswer: "B", explanation: "Only ONE else allowed, but unlimited else if branches!" },
      { type: "typing", title: "Complete Chain", difficulty: "medium", prompt: "Write full if-else chain!", codeToType: "if (x > 0) { } else if (x < 0) { } else { }", explanation: "Final else catches all remaining cases - like a safety net." },
    ],
  },
  "switch-statements": {
    id: "switch-statements", moduleId: "java-foundations", title: "Switch Statements", xpReward: 100, category: "Control Flow",
    steps: [
      { type: "typing", title: "Basic Switch", difficulty: "medium", prompt: "Create a switch statement!", codeToType: "switch (day) { case 1: break; }", explanation: "switch checks one variable against multiple values - cleaner than many if-else." },
      { type: "quiz", title: "Switch Usage", difficulty: "medium", question: "What keyword exits a case?", options: [{ label: "A", text: "exit" }, { label: "B", text: "break" }, { label: "C", text: "stop" }], correctAnswer: "B", explanation: "break exits the switch. Without it, code 'falls through' to next case!" },
      { type: "typing", title: "Default Case", difficulty: "medium", prompt: "Add default case!", codeToType: "switch (x) { default: break; }", explanation: "default runs when no case matches - like else in if statements." },
    ],
  },
  "for-loops": {
    id: "for-loops", moduleId: "java-foundations", title: "For Loops", xpReward: 125, category: "Control Flow",
    steps: [
      { type: "typing", title: "Basic For Loop", difficulty: "medium", prompt: "Count from 0 to 4!", codeToType: "for (int i = 0; i < 5; i++) { }", explanation: "for(start; condition; increment) - three parts separated by semicolons." },
      { type: "quiz", title: "Loop Count", difficulty: "medium", question: "How many times does i < 3 loop?", options: [{ label: "A", text: "2 times" }, { label: "B", text: "3 times" }, { label: "C", text: "4 times" }], correctAnswer: "B", explanation: "i = 0, 1, 2 → three iterations. Loop stops when i reaches 3." },
      { type: "typing", title: "Reverse Loop", difficulty: "medium", prompt: "Count backwards!", codeToType: "for (int i = 5; i > 0; i--) { }", explanation: "i-- decrements. Loop runs while i > 0, so: 5, 4, 3, 2, 1." },
      { type: "typing", title: "For-Each Loop", difficulty: "medium", prompt: "Loop through array!", codeToType: "for (String s : array) { }", explanation: "Enhanced for loop - reads each element automatically. Simpler but less control." },
    ],
  },
  "while-loops": {
    id: "while-loops", moduleId: "java-foundations", title: "While Loops", xpReward: 125, category: "Control Flow",
    steps: [
      { type: "typing", title: "While Loop", difficulty: "medium", prompt: "Create a while loop!", codeToType: "while (count < 10) { count++; }", explanation: "while repeats as long as condition is true. Must change condition inside or infinite loop!" },
      { type: "quiz", title: "Loop Types", difficulty: "medium", question: "When does while check condition?", options: [{ label: "A", text: "After each loop" }, { label: "B", text: "Before each loop" }, { label: "C", text: "Only once" }], correctAnswer: "B", explanation: "while checks BEFORE each iteration - may run 0 times if false initially!" },
      { type: "typing", title: "Do-While", difficulty: "medium", prompt: "Create a do-while loop!", codeToType: "do { x++; } while (x < 5);", explanation: "do-while checks AFTER - always runs at least once!" },
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
    ],
  },
  "method-overloading": {
    id: "method-overloading", moduleId: "java-foundations", title: "Method Overloading", xpReward: 150, category: "Methods",
    steps: [
      { type: "quiz", title: "Overloading", difficulty: "hard", question: "What is method overloading?", options: [{ label: "A", text: "Same name, different parameters" }, { label: "B", text: "Same name, same parameters" }, { label: "C", text: "Different name, same parameters" }], correctAnswer: "A", explanation: "Overloading = same method name with different parameter types or counts." },
      { type: "typing", title: "Overloaded Method", difficulty: "hard", prompt: "Create overloaded add methods!", codeToType: "public int add(int a, int b) { return a + b; }", explanation: "First version takes two ints." },
      { type: "typing", title: "Second Overload", difficulty: "hard", prompt: "Add three number version!", codeToType: "public int add(int a, int b, int c) { return a + b + c; }", explanation: "Same name 'add' but three parameters - Java knows which to call based on arguments." },
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
    ],
  },
  "arraylists": {
    id: "arraylists", moduleId: "java-foundations", title: "ArrayLists", xpReward: 175, category: "Data Structures",
    steps: [
      { type: "typing", title: "ArrayList Creation", difficulty: "hard", prompt: "Create an ArrayList!", codeToType: "ArrayList<String> list = new ArrayList<>();", explanation: "ArrayList can grow/shrink dynamically. <String> specifies the type it holds." },
      { type: "typing", title: "Add Element", difficulty: "hard", prompt: "Add to the list!", codeToType: 'list.add("Java");', explanation: "add() appends to the end. ArrayList handles resizing automatically." },
      { type: "quiz", title: "ArrayList vs Array", difficulty: "hard", question: "ArrayList advantage over array?", options: [{ label: "A", text: "Faster" }, { label: "B", text: "Dynamic size" }, { label: "C", text: "Smaller memory" }], correctAnswer: "B", explanation: "ArrayList grows/shrinks automatically. Arrays have fixed size once created." },
      { type: "typing", title: "Get Element", difficulty: "hard", prompt: "Get element at index!", codeToType: "String item = list.get(0);", explanation: "get(index) retrieves element. Unlike arrays, use method not brackets." },
    ],
  },
  "collections": {
    id: "collections", moduleId: "java-foundations", title: "Collections", xpReward: 200, category: "Data Structures",
    steps: [
      { type: "typing", title: "HashSet", difficulty: "hard", prompt: "Create a HashSet!", codeToType: "HashSet<Integer> set = new HashSet<>();", explanation: "HashSet stores unique values only - duplicates are ignored." },
      { type: "typing", title: "HashMap", difficulty: "hard", prompt: "Create a HashMap!", codeToType: "HashMap<String, Integer> map = new HashMap<>();", explanation: "HashMap stores key-value pairs. Fast lookups by key." },
      { type: "quiz", title: "Set Property", difficulty: "hard", question: "What makes Set special?", options: [{ label: "A", text: "Ordered" }, { label: "B", text: "No duplicates" }, { label: "C", text: "Fixed size" }], correctAnswer: "B", explanation: "Sets automatically prevent duplicates. Adding a duplicate does nothing." },
    ],
  },

  // === OOP ===
  "classes": {
    id: "classes", moduleId: "java-foundations", title: "Classes & Objects", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Class Definition", difficulty: "hard", prompt: "Create a Dog class!", codeToType: "public class Dog { }", explanation: "Classes are blueprints. Objects are instances built from blueprints." },
      { type: "typing", title: "Field", difficulty: "hard", prompt: "Add a name field!", codeToType: "private String name;", explanation: "private = only this class can access directly. Encapsulation!" },
      { type: "typing", title: "Constructor", difficulty: "hard", prompt: "Create a constructor!", codeToType: "public Dog(String name) { this.name = name; }", explanation: "'this' refers to current object. Constructor initializes new objects." },
      { type: "quiz", title: "New Keyword", difficulty: "hard", question: "What does 'new' do?", options: [{ label: "A", text: "Deletes object" }, { label: "B", text: "Creates object" }, { label: "C", text: "Updates object" }], correctAnswer: "B", explanation: "new creates a new instance (object) of a class in memory." },
    ],
  },
  "inheritance": {
    id: "inheritance", moduleId: "java-foundations", title: "Inheritance", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Extends Keyword", difficulty: "hard", prompt: "Create a subclass!", codeToType: "public class Cat extends Animal { }", explanation: "extends inherits all non-private fields and methods from parent." },
      { type: "quiz", title: "Inheritance", difficulty: "hard", question: "What does a subclass inherit?", options: [{ label: "A", text: "Only methods" }, { label: "B", text: "Methods and fields" }, { label: "C", text: "Nothing" }], correctAnswer: "B", explanation: "Subclasses inherit accessible methods AND fields from parent." },
      { type: "typing", title: "Super Keyword", difficulty: "hard", prompt: "Call parent constructor!", codeToType: "super(name);", explanation: "super() calls parent constructor. Must be first line in child constructor." },
      { type: "typing", title: "Override Method", difficulty: "hard", prompt: "Override parent method!", codeToType: "@Override public void speak() { }", explanation: "@Override tells compiler you're replacing parent's method." },
    ],
  },
  "interfaces": {
    id: "interfaces", moduleId: "java-foundations", title: "Interfaces", xpReward: 200, category: "OOP",
    steps: [
      { type: "typing", title: "Interface Definition", difficulty: "hard", prompt: "Create an interface!", codeToType: "public interface Drawable { void draw(); }", explanation: "Interfaces define contracts - what methods a class MUST have." },
      { type: "typing", title: "Implement Interface", difficulty: "hard", prompt: "Implement the interface!", codeToType: "public class Circle implements Drawable { }", explanation: "implements = promise to provide all interface methods." },
      { type: "quiz", title: "Multiple Interfaces", difficulty: "hard", question: "Can a class implement multiple interfaces?", options: [{ label: "A", text: "No" }, { label: "B", text: "Yes" }, { label: "C", text: "Only two" }], correctAnswer: "B", explanation: "Yes! Unlike single inheritance, a class can implement many interfaces." },
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
    ],
  },
  "systems-thinking": {
    id: "systems-thinking", moduleId: "systems-analysis", title: "Systems Thinking", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "Holistic View", difficulty: "easy", question: "Systems thinking focuses on?", options: [{ label: "A", text: "Individual parts" }, { label: "B", text: "The whole and relationships" }, { label: "C", text: "Just the code" }], correctAnswer: "B", explanation: "Systems thinking sees the big picture - how parts connect and affect each other!" },
      { type: "quiz", title: "Emergence", difficulty: "medium", question: "What is emergence?", options: [{ label: "A", text: "New properties from component interaction" }, { label: "B", text: "System startup" }, { label: "C", text: "Error handling" }], correctAnswer: "A", explanation: "The whole can be greater than the sum of parts - new properties emerge!" },
    ],
  },
  "stakeholders": {
    id: "stakeholders", moduleId: "systems-analysis", title: "Finding Stakeholders", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "Who Are Stakeholders", difficulty: "easy", question: "Who are stakeholders?", options: [{ label: "A", text: "Only managers" }, { label: "B", text: "Anyone affected by the system" }, { label: "C", text: "Developers only" }], correctAnswer: "B", explanation: "Stakeholders include ALL affected parties - users, managers, customers, even competitors!" },
      { type: "quiz", title: "Primary vs Secondary", difficulty: "medium", question: "Primary stakeholders are?", options: [{ label: "A", text: "Indirect users" }, { label: "B", text: "Direct system users" }, { label: "C", text: "Competitors" }], correctAnswer: "B", explanation: "Primary = direct users. Secondary = indirectly affected (managers, regulators)." },
      { type: "quiz", title: "Stakeholder Analysis", difficulty: "medium", question: "Why analyze stakeholders?", options: [{ label: "A", text: "Legal requirement" }, { label: "B", text: "Understand different needs" }, { label: "C", text: "Reduce costs" }], correctAnswer: "B", explanation: "Different stakeholders have different needs, concerns, and influence levels!" },
    ],
  },

  // === REQUIREMENTS ===
  "requirements": {
    id: "requirements", moduleId: "systems-analysis", title: "Gathering Requirements", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Functional Requirements", difficulty: "medium", question: "Functional requirements describe?", options: [{ label: "A", text: "Performance" }, { label: "B", text: "What the system does" }, { label: "C", text: "Security" }], correctAnswer: "B", explanation: "Functional = what it does. 'System shall allow users to login.'" },
      { type: "quiz", title: "Non-Functional", difficulty: "medium", question: "Non-functional requirements describe?", options: [{ label: "A", text: "Features" }, { label: "B", text: "How well it performs" }, { label: "C", text: "User roles" }], correctAnswer: "B", explanation: "Non-functional = quality attributes like speed, security, usability." },
      { type: "quiz", title: "Elicitation Methods", difficulty: "medium", question: "Best way to gather requirements?", options: [{ label: "A", text: "Assume needs" }, { label: "B", text: "Interview stakeholders" }, { label: "C", text: "Copy competitors" }], correctAnswer: "B", explanation: "Direct stakeholder engagement: interviews, workshops, observation!" },
    ],
  },
  "use-cases": {
    id: "use-cases", moduleId: "systems-analysis", title: "Use Cases", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Use Case Purpose", difficulty: "medium", question: "Use cases describe?", options: [{ label: "A", text: "Database schema" }, { label: "B", text: "User-system interactions" }, { label: "C", text: "Code structure" }], correctAnswer: "B", explanation: "Use cases show HOW users interact with the system to achieve goals!" },
      { type: "quiz", title: "Actors", difficulty: "medium", question: "What is an actor?", options: [{ label: "A", text: "Database" }, { label: "B", text: "External entity interacting with system" }, { label: "C", text: "Variable" }], correctAnswer: "B", explanation: "Actors are external - users, other systems, time triggers!" },
      { type: "quiz", title: "Use Case Elements", difficulty: "medium", question: "Use case must include?", options: [{ label: "A", text: "Code" }, { label: "B", text: "Main success scenario" }, { label: "C", text: "Database tables" }], correctAnswer: "B", explanation: "Every use case needs: actor, goal, and main success scenario (happy path)!" },
    ],
  },
  "user-stories": {
    id: "user-stories", moduleId: "systems-analysis", title: "User Stories", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "User Story Format", difficulty: "easy", question: "User story format is?", options: [{ label: "A", text: "As a..., I want..., So that..." }, { label: "B", text: "Given..., When..., Then..." }, { label: "C", text: "If..., Then..., Else..." }], correctAnswer: "A", explanation: "As a [role], I want [feature], so that [benefit]. Simple and user-focused!" },
      { type: "quiz", title: "Story vs Use Case", difficulty: "medium", question: "User stories are?", options: [{ label: "A", text: "More detailed than use cases" }, { label: "B", text: "Simpler, placeholder for conversation" }, { label: "C", text: "Only for developers" }], correctAnswer: "B", explanation: "Stories are lightweight - represent a conversation to have, not full specification!" },
    ],
  },

  // === MODELLING ===
  "process-modelling": {
    id: "process-modelling", moduleId: "systems-analysis", title: "Process Modelling", xpReward: 125, category: "Modelling",
    steps: [
      { type: "quiz", title: "DFD Purpose", difficulty: "medium", question: "Data Flow Diagrams show?", options: [{ label: "A", text: "Data movement through system" }, { label: "B", text: "User interfaces" }, { label: "C", text: "Database structure" }], correctAnswer: "A", explanation: "DFDs visualize how data flows: inputs, processes, outputs, and stores!" },
      { type: "quiz", title: "DFD Symbols", difficulty: "medium", question: "In DFD, rectangle represents?", options: [{ label: "A", text: "Process" }, { label: "B", text: "External entity" }, { label: "C", text: "Data store" }], correctAnswer: "B", explanation: "Rectangle = external entity. Circle = process. Open rectangle = data store." },
      { type: "quiz", title: "Context Diagram", difficulty: "medium", question: "Level 0 DFD is called?", options: [{ label: "A", text: "Detail diagram" }, { label: "B", text: "Context diagram" }, { label: "C", text: "Flow chart" }], correctAnswer: "B", explanation: "Context diagram shows system as single process with external entities!" },
    ],
  },
  "data-modelling": {
    id: "data-modelling", moduleId: "systems-analysis", title: "Data Modelling", xpReward: 125, category: "Modelling",
    steps: [
      { type: "quiz", title: "ERD Purpose", difficulty: "medium", question: "Entity-Relationship Diagrams show?", options: [{ label: "A", text: "User flows" }, { label: "B", text: "Data structure and relationships" }, { label: "C", text: "System boundaries" }], correctAnswer: "B", explanation: "ERDs model data: entities (things), attributes (properties), relationships!" },
      { type: "quiz", title: "Entity", difficulty: "medium", question: "An entity represents?", options: [{ label: "A", text: "A real-world thing or concept" }, { label: "B", text: "A process" }, { label: "C", text: "A user action" }], correctAnswer: "A", explanation: "Entities are nouns: Customer, Order, Product - things we store data about!" },
      { type: "quiz", title: "Cardinality", difficulty: "hard", question: "1:M relationship means?", options: [{ label: "A", text: "One to one" }, { label: "B", text: "One to many" }, { label: "C", text: "Many to many" }], correctAnswer: "B", explanation: "1:M = one Customer can have many Orders. Customer->Orders." },
    ],
  },
  "class-diagrams": {
    id: "class-diagrams", moduleId: "systems-analysis", title: "Class Diagrams (UML)", xpReward: 150, category: "Modelling",
    steps: [
      { type: "quiz", title: "UML Class", difficulty: "hard", question: "UML class diagram shows?", options: [{ label: "A", text: "Data flow" }, { label: "B", text: "Classes, attributes, methods" }, { label: "C", text: "User journeys" }], correctAnswer: "B", explanation: "Class diagrams show object-oriented structure: classes and their relationships!" },
      { type: "quiz", title: "Association", difficulty: "hard", question: "Association line means?", options: [{ label: "A", text: "Classes know about each other" }, { label: "B", text: "Inheritance" }, { label: "C", text: "Data flow" }], correctAnswer: "A", explanation: "Association = classes have a relationship, can communicate." },
    ],
  },

  // === SDLC ===
  "sdlc-overview": {
    id: "sdlc-overview", moduleId: "systems-analysis", title: "SDLC Overview", xpReward: 100, category: "SDLC",
    steps: [
      { type: "quiz", title: "SDLC Definition", difficulty: "easy", question: "SDLC stands for?", options: [{ label: "A", text: "System Design Life Cycle" }, { label: "B", text: "Software Development Life Cycle" }, { label: "C", text: "System Development Logic Control" }], correctAnswer: "B", explanation: "SDLC = structured phases for developing software systems." },
      { type: "quiz", title: "SDLC Phases", difficulty: "medium", question: "SDLC typically starts with?", options: [{ label: "A", text: "Coding" }, { label: "B", text: "Planning/Analysis" }, { label: "C", text: "Testing" }], correctAnswer: "B", explanation: "Always start with understanding WHAT to build before HOW!" },
    ],
  },
  "waterfall-model": {
    id: "waterfall-model", moduleId: "systems-analysis", title: "Waterfall Model", xpReward: 100, category: "SDLC",
    steps: [
      { type: "quiz", title: "Waterfall Nature", difficulty: "medium", question: "Waterfall is?", options: [{ label: "A", text: "Iterative" }, { label: "B", text: "Sequential - each phase once" }, { label: "C", text: "No planning" }], correctAnswer: "B", explanation: "Waterfall flows down: Requirements → Design → Code → Test → Deploy." },
      { type: "quiz", title: "Waterfall Weakness", difficulty: "medium", question: "Waterfall weakness is?", options: [{ label: "A", text: "Too much documentation" }, { label: "B", text: "Hard to accommodate change" }, { label: "C", text: "No testing" }], correctAnswer: "B", explanation: "Changes late in waterfall are expensive - requirements are frozen early!" },
    ],
  },
  "agile-methods": {
    id: "agile-methods", moduleId: "systems-analysis", title: "Agile Methods", xpReward: 125, category: "SDLC",
    steps: [
      { type: "quiz", title: "Agile Values", difficulty: "medium", question: "Agile values what over process?", options: [{ label: "A", text: "Documentation" }, { label: "B", text: "Individuals and interactions" }, { label: "C", text: "Contracts" }], correctAnswer: "B", explanation: "Agile Manifesto: people > process, working software > documentation!" },
      { type: "quiz", title: "Sprint", difficulty: "medium", question: "A sprint is?", options: [{ label: "A", text: "Running fast" }, { label: "B", text: "Time-boxed development iteration" }, { label: "C", text: "Final release" }], correctAnswer: "B", explanation: "Sprints are 1-4 week cycles delivering working increments!" },
      { type: "quiz", title: "Agile Benefit", difficulty: "medium", question: "Agile handles change by?", options: [{ label: "A", text: "Ignoring it" }, { label: "B", text: "Embracing it through iteration" }, { label: "C", text: "Heavy documentation" }], correctAnswer: "B", explanation: "Short iterations mean feedback early and change is expected!" },
    ],
  },

  // === GOVERNANCE ===
  "security-basics": {
    id: "security-basics", moduleId: "systems-analysis", title: "Security Fundamentals", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "CIA Triad", difficulty: "medium", question: "CIA in security stands for?", options: [{ label: "A", text: "Central Intelligence Agency" }, { label: "B", text: "Confidentiality, Integrity, Availability" }, { label: "C", text: "Control, Input, Access" }], correctAnswer: "B", explanation: "CIA Triad: Confidentiality (secret), Integrity (accurate), Availability (accessible)!" },
      { type: "quiz", title: "Authentication", difficulty: "medium", question: "Authentication verifies?", options: [{ label: "A", text: "What you can access" }, { label: "B", text: "Who you are" }, { label: "C", text: "Data accuracy" }], correctAnswer: "B", explanation: "Authentication = WHO you are. Authorization = WHAT you can do!" },
    ],
  },
  "risk-management": {
    id: "risk-management", moduleId: "systems-analysis", title: "Risk Management", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "Risk Components", difficulty: "medium", question: "Risk is calculated by?", options: [{ label: "A", text: "Cost only" }, { label: "B", text: "Likelihood × Impact" }, { label: "C", text: "Time taken" }], correctAnswer: "B", explanation: "Risk = Probability × Impact. High likelihood + high impact = critical risk!" },
      { type: "quiz", title: "Risk Response", difficulty: "medium", question: "Risk mitigation means?", options: [{ label: "A", text: "Ignore the risk" }, { label: "B", text: "Reduce likelihood or impact" }, { label: "C", text: "Accept all risks" }], correctAnswer: "B", explanation: "Mitigate = take action to reduce. Also: accept, avoid, or transfer risks!" },
    ],
  },
  "compliance": {
    id: "compliance", moduleId: "systems-analysis", title: "Compliance & GDPR", xpReward: 100, category: "Governance",
    steps: [
      { type: "quiz", title: "GDPR Scope", difficulty: "medium", question: "GDPR protects?", options: [{ label: "A", text: "Company data" }, { label: "B", text: "Personal data of individuals" }, { label: "C", text: "Government data" }], correctAnswer: "B", explanation: "GDPR protects personal data of EU individuals - names, emails, IPs, etc!" },
      { type: "quiz", title: "Data Subject Rights", difficulty: "hard", question: "GDPR gives users right to?", options: [{ label: "A", text: "Free software" }, { label: "B", text: "Access and delete their data" }, { label: "C", text: "Company profits" }], correctAnswer: "B", explanation: "Right to access, rectify, erase ('be forgotten'), and port your data!" },
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
    ],
  },
  "binary-arithmetic": {
    id: "binary-arithmetic", moduleId: "math-computing", title: "Binary Arithmetic", xpReward: 100, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Binary Addition", difficulty: "medium", question: "In binary, 1+1=?", options: [{ label: "A", text: "2" }, { label: "B", text: "10" }, { label: "C", text: "11" }], correctAnswer: "B", explanation: "1+1=10 in binary (that's 2 in decimal). Carry the 1!" },
      { type: "quiz", title: "Overflow", difficulty: "hard", question: "8-bit max unsigned value?", options: [{ label: "A", text: "255" }, { label: "B", text: "256" }, { label: "C", text: "128" }], correctAnswer: "A", explanation: "8 bits: 0-255 (2^8 - 1 = 255). Adding 1 to 255 causes overflow!" },
    ],
  },

  // === LOGIC ===
  "logic-gates": {
    id: "logic-gates", moduleId: "math-computing", title: "Logic Gates", xpReward: 100, category: "Logic",
    steps: [
      { type: "quiz", title: "AND Gate", difficulty: "medium", question: "AND gate output is 1 when?", options: [{ label: "A", text: "Any input is 1" }, { label: "B", text: "All inputs are 1" }, { label: "C", text: "All inputs are 0" }], correctAnswer: "B", explanation: "AND = all must be true. 1 AND 1 = 1. Anything else = 0." },
      { type: "quiz", title: "OR Gate", difficulty: "medium", question: "OR gate output is 1 when?", options: [{ label: "A", text: "Any input is 1" }, { label: "B", text: "All inputs are 1" }, { label: "C", text: "All inputs are 0" }], correctAnswer: "A", explanation: "OR = at least one true. 0 OR 1 = 1. Only 0 OR 0 = 0." },
      { type: "quiz", title: "NOT Gate", difficulty: "easy", question: "NOT gate does what?", options: [{ label: "A", text: "Copies input" }, { label: "B", text: "Inverts input" }, { label: "C", text: "Doubles input" }], correctAnswer: "B", explanation: "NOT inverts: NOT 1 = 0, NOT 0 = 1. Simple negation!" },
    ],
  },
  "boolean-algebra": {
    id: "boolean-algebra", moduleId: "math-computing", title: "Boolean Algebra", xpReward: 125, category: "Logic",
    steps: [
      { type: "quiz", title: "Boolean Values", difficulty: "easy", question: "Boolean algebra uses?", options: [{ label: "A", text: "0-9" }, { label: "B", text: "True and False (1 and 0)" }, { label: "C", text: "A-Z" }], correctAnswer: "B", explanation: "Boolean = binary logic. True/False, 1/0, Yes/No - two states only!" },
      { type: "quiz", title: "De Morgan's", difficulty: "hard", question: "NOT(A AND B) equals?", options: [{ label: "A", text: "(NOT A) OR (NOT B)" }, { label: "B", text: "(NOT A) AND (NOT B)" }, { label: "C", text: "A OR B" }], correctAnswer: "A", explanation: "De Morgan's Law: NOT(A AND B) = (NOT A) OR (NOT B). Break AND, flip to OR!" },
    ],
  },
  "truth-tables": {
    id: "truth-tables", moduleId: "math-computing", title: "Truth Tables", xpReward: 100, category: "Logic",
    steps: [
      { type: "quiz", title: "Truth Table Purpose", difficulty: "medium", question: "Truth tables show?", options: [{ label: "A", text: "All possible input/output combinations" }, { label: "B", text: "Only true values" }, { label: "C", text: "Error cases" }], correctAnswer: "A", explanation: "Truth tables exhaustively list every possible input combination and its output!" },
      { type: "quiz", title: "Table Size", difficulty: "medium", question: "3 inputs = how many rows?", options: [{ label: "A", text: "6" }, { label: "B", text: "8" }, { label: "C", text: "9" }], correctAnswer: "B", explanation: "2^n rows for n inputs. 2^3 = 8 rows for 3 variables!" },
    ],
  },

  // === SETS ===
  "sets-basics": {
    id: "sets-basics", moduleId: "math-computing", title: "Sets & Operations", xpReward: 100, category: "Sets",
    steps: [
      { type: "quiz", title: "Set Definition", difficulty: "easy", question: "A set is?", options: [{ label: "A", text: "Ordered list" }, { label: "B", text: "Collection of unique elements" }, { label: "C", text: "Duplicated values" }], correctAnswer: "B", explanation: "Sets have unique elements, no duplicates, no specific order!" },
      { type: "quiz", title: "Union", difficulty: "medium", question: "A ∪ B contains?", options: [{ label: "A", text: "Elements in both" }, { label: "B", text: "Elements in either or both" }, { label: "C", text: "Elements in neither" }], correctAnswer: "B", explanation: "Union combines: everything in A, B, or both. A ∪ B." },
      { type: "quiz", title: "Intersection", difficulty: "medium", question: "A ∩ B contains?", options: [{ label: "A", text: "Elements in both A and B" }, { label: "B", text: "Elements in either" }, { label: "C", text: "All elements" }], correctAnswer: "A", explanation: "Intersection = common elements only. Must be in both A AND B!" },
    ],
  },
  "venn-diagrams": {
    id: "venn-diagrams", moduleId: "math-computing", title: "Venn Diagrams", xpReward: 75, category: "Sets",
    steps: [
      { type: "quiz", title: "Venn Purpose", difficulty: "easy", question: "Venn diagrams visualize?", options: [{ label: "A", text: "Time" }, { label: "B", text: "Set relationships" }, { label: "C", text: "Code flow" }], correctAnswer: "B", explanation: "Venn diagrams show overlaps and differences between sets visually!" },
      { type: "quiz", title: "Overlap Region", difficulty: "medium", question: "Overlapping area represents?", options: [{ label: "A", text: "Union" }, { label: "B", text: "Intersection" }, { label: "C", text: "Complement" }], correctAnswer: "B", explanation: "Where circles overlap = intersection (elements in both sets)!" },
    ],
  },

  // === PROBABILITY ===
  "probability-basics": {
    id: "probability-basics", moduleId: "math-computing", title: "Probability Basics", xpReward: 100, category: "Probability",
    steps: [
      { type: "quiz", title: "Probability Range", difficulty: "easy", question: "Probability ranges from?", options: [{ label: "A", text: "0 to 100" }, { label: "B", text: "0 to 1" }, { label: "C", text: "-1 to 1" }], correctAnswer: "B", explanation: "P = 0 (impossible) to 1 (certain). Or 0% to 100%!" },
      { type: "quiz", title: "Coin Flip", difficulty: "easy", question: "Fair coin heads probability?", options: [{ label: "A", text: "0.25" }, { label: "B", text: "0.5" }, { label: "C", text: "1" }], correctAnswer: "B", explanation: "1 outcome / 2 possible = 0.5 or 50% chance!" },
      { type: "quiz", title: "Complement", difficulty: "medium", question: "If P(rain)=0.3, P(no rain)=?", options: [{ label: "A", text: "0.3" }, { label: "B", text: "0.7" }, { label: "C", text: "0.6" }], correctAnswer: "B", explanation: "Complement: P(not A) = 1 - P(A). 1 - 0.3 = 0.7!" },
    ],
  },
  "conditional-probability": {
    id: "conditional-probability", moduleId: "math-computing", title: "Conditional Probability", xpReward: 125, category: "Probability",
    steps: [
      { type: "quiz", title: "Conditional Meaning", difficulty: "hard", question: "P(A|B) means?", options: [{ label: "A", text: "A or B" }, { label: "B", text: "A given B occurred" }, { label: "C", text: "A and B" }], correctAnswer: "B", explanation: "P(A|B) = probability of A, given that B already happened!" },
      { type: "quiz", title: "Independence", difficulty: "hard", question: "Independent events mean?", options: [{ label: "A", text: "One affects the other" }, { label: "B", text: "One doesn't affect the other" }, { label: "C", text: "Same probability" }], correctAnswer: "B", explanation: "Independent: P(A|B) = P(A). Knowing B doesn't change A's probability!" },
    ],
  },

  // === GRAPHS & TREES ===
  "graphs-intro": {
    id: "graphs-intro", moduleId: "math-computing", title: "Graph Theory", xpReward: 125, category: "Graphs",
    steps: [
      { type: "quiz", title: "Graph Components", difficulty: "medium", question: "Graphs consist of?", options: [{ label: "A", text: "Lines and curves" }, { label: "B", text: "Vertices and edges" }, { label: "C", text: "X and Y axes" }], correctAnswer: "B", explanation: "Vertices (nodes) connected by edges (links). Not like coordinate graphs!" },
      { type: "quiz", title: "Directed Graph", difficulty: "medium", question: "Directed graph edges have?", options: [{ label: "A", text: "Colors" }, { label: "B", text: "Direction (arrows)" }, { label: "C", text: "No connections" }], correctAnswer: "B", explanation: "Directed = one-way edges (A→B not same as B→A). Undirected = two-way." },
    ],
  },
  "trees-basics": {
    id: "trees-basics", moduleId: "math-computing", title: "Tree Structures", xpReward: 125, category: "Graphs",
    steps: [
      { type: "quiz", title: "Tree Definition", difficulty: "medium", question: "A tree is a graph that?", options: [{ label: "A", text: "Has cycles" }, { label: "B", text: "Has no cycles, connected" }, { label: "C", text: "Has multiple roots" }], correctAnswer: "B", explanation: "Trees: connected (one piece), acyclic (no loops), N nodes = N-1 edges!" },
      { type: "quiz", title: "Binary Tree", difficulty: "medium", question: "Binary tree node has at most?", options: [{ label: "A", text: "1 child" }, { label: "B", text: "2 children" }, { label: "C", text: "Unlimited children" }], correctAnswer: "B", explanation: "Binary = at most 2 children per node. Left and right!" },
    ],
  },

  // === COMPLEXITY ===
  "big-o-intro": {
    id: "big-o-intro", moduleId: "math-computing", title: "Big-O Notation", xpReward: 150, category: "Complexity",
    steps: [
      { type: "quiz", title: "Big-O Purpose", difficulty: "hard", question: "Big-O describes?", options: [{ label: "A", text: "Exact runtime" }, { label: "B", text: "Growth rate as input grows" }, { label: "C", text: "Memory address" }], correctAnswer: "B", explanation: "Big-O = how time/space SCALES with input size. Not exact timing!" },
      { type: "quiz", title: "O(1)", difficulty: "medium", question: "O(1) means?", options: [{ label: "A", text: "Linear time" }, { label: "B", text: "Constant time" }, { label: "C", text: "Logarithmic" }], correctAnswer: "B", explanation: "O(1) = constant. Same time regardless of input size. Array access!" },
      { type: "quiz", title: "O(n)", difficulty: "medium", question: "O(n) means?", options: [{ label: "A", text: "Constant" }, { label: "B", text: "Linear - grows with n" }, { label: "C", text: "Quadratic" }], correctAnswer: "B", explanation: "O(n) = linear. Double input = double time. Simple loop!" },
    ],
  },
  "complexity-comparison": {
    id: "complexity-comparison", moduleId: "math-computing", title: "Complexity Comparison", xpReward: 150, category: "Complexity",
    steps: [
      { type: "quiz", title: "Fastest to Slowest", difficulty: "hard", question: "Order from fastest?", options: [{ label: "A", text: "O(1), O(log n), O(n), O(n²)" }, { label: "B", text: "O(n²), O(n), O(log n), O(1)" }, { label: "C", text: "O(n), O(1), O(n²), O(log n)" }], correctAnswer: "A", explanation: "1 < log n < n < n log n < n² < 2^n. Constant beats all!" },
      { type: "quiz", title: "Nested Loops", difficulty: "hard", question: "Two nested loops over n?", options: [{ label: "A", text: "O(n)" }, { label: "B", text: "O(n²)" }, { label: "C", text: "O(2n)" }], correctAnswer: "B", explanation: "Loop inside loop = multiply. n × n = n². Quadratic time!" },
    ],
  },

  // === FUNCTIONS ===
  "functions-math": {
    id: "functions-math", moduleId: "math-computing", title: "Functions", xpReward: 100, category: "Functions",
    steps: [
      { type: "quiz", title: "Function Definition", difficulty: "medium", question: "A function maps?", options: [{ label: "A", text: "Input to exactly one output" }, { label: "B", text: "Input to multiple outputs" }, { label: "C", text: "Nothing" }], correctAnswer: "A", explanation: "Functions: each input → exactly one output. f(x) = x + 1." },
      { type: "quiz", title: "Domain", difficulty: "medium", question: "Domain is?", options: [{ label: "A", text: "Set of outputs" }, { label: "B", text: "Set of valid inputs" }, { label: "C", text: "Function name" }], correctAnswer: "B", explanation: "Domain = valid inputs. Range = possible outputs!" },
    ],
  },

  // === ALGEBRA ===
  "algebra-basics": {
    id: "algebra-basics", moduleId: "math-computing", title: "Algebra Fundamentals", xpReward: 75, category: "Algebra",
    steps: [
      { type: "quiz", title: "Variable", difficulty: "easy", question: "In algebra, a variable is?", options: [{ label: "A", text: "A constant number" }, { label: "B", text: "A symbol representing unknown" }, { label: "C", text: "An operator" }], correctAnswer: "B", explanation: "Variables (x, y, n) stand for unknown values we solve for!" },
      { type: "quiz", title: "Equation Solving", difficulty: "medium", question: "To solve 2x = 10?", options: [{ label: "A", text: "Add 2" }, { label: "B", text: "Divide by 2" }, { label: "C", text: "Multiply by 2" }], correctAnswer: "B", explanation: "Undo operations: 2x = 10 → x = 10/2 → x = 5!" },
    ],
  },
};

// Export all lessons combined
export const allLessons: Record<string, LessonData> = {
  ...javaLessons,
  ...systemsLessons,
  ...mathLessons,
};

// Get lessons by module
export function getLessonsByModule(moduleId: string): LessonData[] {
  return Object.values(allLessons).filter(lesson => lesson.moduleId === moduleId);
}

// Get lesson by ID
export function getLessonById(lessonId: string): LessonData | undefined {
  return allLessons[lessonId];
}