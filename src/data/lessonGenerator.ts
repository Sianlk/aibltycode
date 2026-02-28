// Auto-generates lesson content for lessons that don't have static data
import type { LessonData, LessonStep } from "./lessons";

function generateQuizStep(title: string, question: string, options: { label: string; text: string }[], correct: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "medium"): LessonStep {
  return { type: "quiz", title, difficulty, question, options, correctAnswer: correct, explanation };
}

function generateTypingStep(title: string, prompt: string, code: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "easy"): LessonStep {
  return { type: "typing", title, difficulty, prompt, codeToType: code, explanation };
}

// Generate lesson content based on title and description
export function generateLessonContent(lessonId: string, title: string, description: string, moduleId: string, xpReward: number): LessonData {
  const category = inferCategory(moduleId);
  const steps = generateStepsForTopic(lessonId, title, description, moduleId);
  
  return { id: lessonId, title, moduleId, steps, xpReward, category };
}

function inferCategory(moduleId: string): string {
  const map: Record<string, string> = {
    "java-foundations": "Programming",
    "systems-analysis": "Systems Analysis",
    "math-computing": "Mathematics",
    "cybersecurity": "Cybersecurity",
    "ai-data-science": "AI & Data Science",
    "business-systems": "Business Systems",
    "game-development": "Game Development",
    "computer-systems": "Computer Systems",
    "web-technologies": "Web Technologies",
  };
  return map[moduleId] || "General";
}

function generateStepsForTopic(id: string, title: string, desc: string, moduleId: string): LessonStep[] {
  if (moduleId === "java-foundations") return generateJavaSteps(id, title, desc);
  if (moduleId === "systems-analysis") return generateSystemsSteps(id, title, desc);
  if (moduleId === "math-computing") return generateMathSteps(id, title, desc);
  if (moduleId === "cybersecurity") return generateCyberSteps(id, title, desc);
  if (moduleId === "ai-data-science") return generateAISteps(id, title, desc);
  if (moduleId === "business-systems") return generateBusinessSteps(id, title, desc);
  if (moduleId === "game-development") return generateGameDevSteps(id, title, desc);
  if (moduleId === "computer-systems") return generateComputerSystemsSteps(id, title, desc);
  if (moduleId === "web-technologies") return generateWebSteps(id, title, desc);
  return generateGenericSteps(title, desc);
}

// ======================== JAVA ========================
function generateJavaSteps(id: string, title: string, desc: string): LessonStep[] {
  const steps: LessonStep[] = [];
  
  steps.push(generateQuizStep(
    `What is ${title}?`, `Which best describes ${title.toLowerCase()} in Java?`,
    [{ label: "A", text: desc }, { label: "B", text: "A type of variable declaration" }, { label: "C", text: "A compiler error message" }],
    "A", `${title} refers to: ${desc}. This is a fundamental Java concept.`, "easy"
  ));

  const codeSnippets = getJavaCodeSnippet(id, title);
  codeSnippets.forEach(snippet => {
    steps.push(generateTypingStep(snippet.title, snippet.prompt, snippet.code, snippet.explanation, snippet.difficulty));
  });

  steps.push(generateQuizStep(
    `${title} Knowledge Check`, `Why is ${title.toLowerCase()} important in Java programming?`,
    [{ label: "A", text: `It helps with ${desc.toLowerCase()}` }, { label: "B", text: "It is only used in Python" }, { label: "C", text: "It makes code run slower" }],
    "A", `${title} is important because it enables ${desc.toLowerCase()}, making your code more robust and professional.`, "medium"
  ));

  steps.push(generateQuizStep(
    `${title} Best Practices`, `What is a best practice when using ${title.toLowerCase()}?`,
    [{ label: "A", text: "Ignore error handling" }, { label: "B", text: "Follow Java naming conventions and document your code" }, { label: "C", text: "Never test your code" }],
    "B", `Following conventions and documenting code ensures ${title.toLowerCase()} is used correctly and maintainably.`, "medium"
  ));

  return steps;
}

function getJavaCodeSnippet(id: string, title: string): { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }[] {
  const snippets: Record<string, { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }[]> = {
    "type-casting": [
      { title: "Implicit Casting", prompt: "Convert int to double!", code: "double d = 42;", explanation: "Java automatically widens int to double (implicit casting).", difficulty: "easy" },
      { title: "Explicit Casting", prompt: "Cast a double to int!", code: "int x = (int) 9.99;", explanation: "Explicit casting truncates the decimal - x becomes 9.", difficulty: "medium" },
    ],
    "constants": [
      { title: "Declare a Constant", prompt: "Create an unchangeable variable!", code: "final double PI = 3.14159;", explanation: "final prevents the value from being changed after initialization.", difficulty: "easy" },
    ],
    "variable-scope": [
      { title: "Local Variable", prompt: "Declare a local variable!", code: "int localVar = 10;", explanation: "Local variables exist only within the method or block they are declared in.", difficulty: "easy" },
    ],
    "comparison-ops": [
      { title: "Equality Check", prompt: "Check if two values are equal!", code: "boolean result = (5 == 5);", explanation: "== compares values and returns true or false.", difficulty: "easy" },
      { title: "Not Equal", prompt: "Check inequality!", code: "boolean diff = (10 != 5);", explanation: "!= returns true when values are different.", difficulty: "easy" },
    ],
    "logical-ops": [
      { title: "AND Operator", prompt: "Combine two conditions!", code: "boolean both = (age > 18 && hasID);", explanation: "&& returns true only if BOTH conditions are true.", difficulty: "easy" },
      { title: "OR Operator", prompt: "Check either condition!", code: "boolean either = (isAdmin || isMod);", explanation: "|| returns true if at least one condition is true.", difficulty: "easy" },
    ],
    "assignment-ops": [
      { title: "Compound Assignment", prompt: "Add and assign!", code: "total += 10;", explanation: "+= adds and assigns. Same as total = total + 10;", difficulty: "easy" },
      { title: "Multiply Assign", prompt: "Multiply and assign!", code: "value *= 3;", explanation: "*= multiplies and assigns. Same as value = value * 3;", difficulty: "easy" },
    ],
    "bitwise-ops": [
      { title: "Bitwise AND", prompt: "Use bitwise AND!", code: "int result = 5 & 3;", explanation: "Bitwise AND compares bits: 101 & 011 = 001 (result is 1).", difficulty: "medium" },
      { title: "Left Shift", prompt: "Shift bits left!", code: "int shifted = 1 << 3;", explanation: "Left shift multiplies by 2^n. 1 << 3 = 8.", difficulty: "medium" },
    ],
    "ternary-op": [
      { title: "Ternary Operator", prompt: "Write a conditional expression!", code: 'String result = (age >= 18) ? "Adult" : "Minor";', explanation: "Ternary: condition ? ifTrue : ifFalse — a compact if-else.", difficulty: "medium" },
    ],
    "string-methods": [
      { title: "String Length", prompt: "Get the length of a string!", code: "int len = text.length();", explanation: "length() returns the number of characters in the string.", difficulty: "easy" },
      { title: "Substring", prompt: "Extract part of a string!", code: "String sub = name.substring(0, 3);", explanation: "substring(start, end) extracts characters from start to end-1.", difficulty: "medium" },
    ],
    "string-comparison": [
      { title: "Equals Method", prompt: "Compare two strings!", code: 'boolean same = str1.equals(str2);', explanation: "Always use .equals() to compare string content, never ==.", difficulty: "easy" },
      { title: "Ignore Case", prompt: "Compare ignoring case!", code: 'boolean match = str1.equalsIgnoreCase(str2);', explanation: "equalsIgnoreCase() ignores uppercase/lowercase differences.", difficulty: "easy" },
    ],
    "string-builder": [
      { title: "StringBuilder", prompt: "Build a string efficiently!", code: 'StringBuilder sb = new StringBuilder();\nsb.append("Hello ");', explanation: "StringBuilder is mutable and faster than String concatenation in loops.", difficulty: "medium" },
    ],
    "string-formatting": [
      { title: "Printf Format", prompt: "Format output with printf!", code: 'System.out.printf("Score: %d%%", 95);', explanation: "printf uses format specifiers: %d for int, %s for String, %f for float.", difficulty: "medium" },
    ],
    "nested-if": [
      { title: "Nested Conditions", prompt: "Write nested if statements!", code: "if (age > 18) {\n  if (hasLicense) {\n    canDrive = true;\n  }\n}", explanation: "Nested ifs check additional conditions within an outer condition.", difficulty: "medium" },
    ],
    "switch-expressions": [
      { title: "Switch Expression", prompt: "Use modern switch syntax!", code: 'String result = switch (day) {\n  case 1 -> "Monday";\n  default -> "Other";\n};', explanation: "Switch expressions (Java 14+) use -> and return values directly.", difficulty: "medium" },
    ],
    "do-while": [
      { title: "Do-While Loop", prompt: "Execute at least once!", code: 'do {\n  System.out.println("Hello");\n} while (false);', explanation: "do-while always executes the body at least once, then checks the condition.", difficulty: "medium" },
    ],
    "enhanced-for": [
      { title: "For-Each Loop", prompt: "Iterate over an array!", code: 'for (String s : names) {\n  System.out.println(s);\n}', explanation: "Enhanced for loop iterates over each element without an index.", difficulty: "easy" },
    ],
    "break-continue": [
      { title: "Break Statement", prompt: "Exit a loop early!", code: "if (x == 5) break;", explanation: "break immediately exits the current loop.", difficulty: "easy" },
      { title: "Continue Statement", prompt: "Skip to next iteration!", code: "if (x % 2 == 0) continue;", explanation: "continue skips the rest of the loop body and starts the next iteration.", difficulty: "easy" },
    ],
    "nested-loops": [
      { title: "Nested Loop", prompt: "Create a nested loop!", code: "for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 3; j++) {\n  }\n}", explanation: "Inner loop runs completely for each iteration of the outer loop.", difficulty: "hard" },
    ],
    "parameters-return": [
      { title: "Method with Return", prompt: "Write a method that returns a value!", code: "public int add(int a, int b) {\n  return a + b;\n}", explanation: "Methods can accept parameters and return values using the return keyword.", difficulty: "medium" },
    ],
    "recursion": [
      { title: "Factorial Method", prompt: "Write a recursive factorial!", code: "return n <= 1 ? 1 : n * factorial(n - 1);", explanation: "Recursion calls the same method with a smaller input until reaching the base case.", difficulty: "hard" },
    ],
    "varargs": [
      { title: "Variable Arguments", prompt: "Use varargs in a method!", code: "public int sum(int... numbers) {\n  int total = 0;\n}", explanation: "Varargs (int...) allows passing any number of arguments as an array.", difficulty: "medium" },
    ],
    "array-operations": [
      { title: "Array Traversal", prompt: "Loop through an array!", code: "for (int i = 0; i < arr.length; i++) {\n  System.out.println(arr[i]);\n}", explanation: "Use .length (no parentheses) to get array size.", difficulty: "easy" },
    ],
    "multidim-arrays": [
      { title: "2D Array", prompt: "Create a 2D array!", code: "int[][] grid = new int[3][4];", explanation: "2D arrays are arrays of arrays — used for grids, matrices, and tables.", difficulty: "medium" },
    ],
    "array-algorithms": [
      { title: "Linear Search", prompt: "Search an array!", code: "for (int i = 0; i < arr.length; i++) {\n  if (arr[i] == target) return i;\n}", explanation: "Linear search checks each element sequentially until the target is found.", difficulty: "medium" },
    ],
    "arrays-class": [
      { title: "Sort an Array", prompt: "Sort using Arrays class!", code: "Arrays.sort(numbers);", explanation: "Arrays.sort() sorts an array in ascending order using a fast algorithm.", difficulty: "easy" },
    ],
    "arraylist": [
      { title: "Create ArrayList", prompt: "Create a dynamic list!", code: 'ArrayList<String> names = new ArrayList<>();', explanation: "ArrayList grows and shrinks dynamically unlike fixed-size arrays.", difficulty: "easy" },
    ],
    "arraylist-methods": [
      { title: "Add to List", prompt: "Add elements to ArrayList!", code: 'names.add("Alice");\nnames.add("Bob");', explanation: "add() appends elements. Use add(index, element) to insert at a position.", difficulty: "easy" },
    ],
    "wrapper-classes": [
      { title: "Integer Wrapper", prompt: "Use Integer wrapper class!", code: "Integer num = Integer.valueOf(42);", explanation: "Wrapper classes let primitives be used as objects (needed for collections).", difficulty: "easy" },
    ],
    "autoboxing": [
      { title: "Autoboxing", prompt: "Let Java auto-convert!", code: "Integer num = 42;", explanation: "Java automatically converts between primitives and wrapper classes.", difficulty: "easy" },
    ],
    "instance-vars": [
      { title: "Instance Variable", prompt: "Declare an instance variable!", code: "private String name;\nprivate int age;", explanation: "Instance variables define the state of each object instance.", difficulty: "easy" },
    ],
    "constructor-overload": [
      { title: "Overloaded Constructor", prompt: "Create two constructors!", code: "public Dog() { }\npublic Dog(String name) { this.name = name; }", explanation: "Overloaded constructors provide multiple ways to create objects.", difficulty: "medium" },
    ],
    "this-keyword": [
      { title: "Using this", prompt: "Disambiguate with this!", code: "this.name = name;", explanation: "'this' refers to the current object instance.", difficulty: "easy" },
    ],
    "access-modifiers": [
      { title: "Private Field", prompt: "Make a field private!", code: "private int balance;", explanation: "private restricts access to within the same class only.", difficulty: "easy" },
    ],
    "getters-setters": [
      { title: "Getter Method", prompt: "Create a getter!", code: "public String getName() {\n  return this.name;\n}", explanation: "Getters provide controlled read access to private fields.", difficulty: "easy" },
      { title: "Setter Method", prompt: "Create a setter!", code: "public void setName(String name) {\n  this.name = name;\n}", explanation: "Setters provide controlled write access with validation.", difficulty: "easy" },
    ],
    "static-members": [
      { title: "Static Variable", prompt: "Create a class-level counter!", code: "static int count = 0;", explanation: "Static members belong to the class, not individual instances.", difficulty: "easy" },
      { title: "Static Method", prompt: "Create a static utility method!", code: "public static int max(int a, int b) {\n  return a > b ? a : b;\n}", explanation: "Static methods can be called without creating an object.", difficulty: "medium" },
    ],
    "super-keyword": [
      { title: "Calling Parent Constructor", prompt: "Use super to call parent!", code: "super(name, age);", explanation: "super() calls the parent class constructor for initialization.", difficulty: "medium" },
    ],
    "method-overriding": [
      { title: "Override toString", prompt: "Override the toString method!", code: '@Override\npublic String toString() {\n  return "Dog: " + name;\n}', explanation: "@Override ensures you're correctly overriding a parent method.", difficulty: "medium" },
    ],
    "object-class": [
      { title: "toString Method", prompt: "Override toString!", code: '@Override\npublic String toString() {\n  return name + " (" + age + ")";\n}', explanation: "Every class inherits toString() from Object — override for meaningful output.", difficulty: "medium" },
    ],
    "dynamic-binding": [
      { title: "Polymorphic Call", prompt: "Call overridden method!", code: "Animal a = new Dog();\na.speak();", explanation: "At runtime, Java calls Dog's speak() method — this is dynamic binding.", difficulty: "medium" },
    ],
    "instanceof-op": [
      { title: "Type Check", prompt: "Check object type!", code: "if (animal instanceof Dog) {\n  Dog d = (Dog) animal;\n}", explanation: "instanceof checks if an object is an instance of a specific class.", difficulty: "medium" },
    ],
    "abstract-classes": [
      { title: "Abstract Class", prompt: "Define an abstract class!", code: "abstract class Shape {\n  abstract double area();\n}", explanation: "Abstract classes can't be instantiated and may contain abstract methods.", difficulty: "medium" },
    ],
    "abstract-methods": [
      { title: "Implement Abstract", prompt: "Implement an abstract method!", code: "public double area() {\n  return Math.PI * radius * radius;\n}", explanation: "Subclasses must implement all abstract methods from the parent.", difficulty: "medium" },
    ],
    "interface-default": [
      { title: "Default Method", prompt: "Add default to interface!", code: "default void log(String msg) {\n  System.out.println(msg);\n}", explanation: "Default methods provide implementation in interfaces (Java 8+).", difficulty: "medium" },
    ],
    "multiple-interfaces": [
      { title: "Implement Multiple", prompt: "Implement two interfaces!", code: "class Robot implements Movable, Drawable { }", explanation: "A class can implement multiple interfaces, enabling flexible design.", difficulty: "medium" },
    ],
    "try-catch": [
      { title: "Try-Catch Block", prompt: "Handle a potential error!", code: 'try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.println("Error!");\n}', explanation: "try-catch prevents crashes by catching exceptions gracefully.", difficulty: "medium" },
    ],
    "multiple-catch": [
      { title: "Multiple Catch", prompt: "Handle different exceptions!", code: "catch (IOException e) {\n} catch (SQLException e) {\n}", explanation: "Different catch blocks handle different exception types.", difficulty: "medium" },
    ],
    "finally-block": [
      { title: "Finally Block", prompt: "Add a finally block!", code: "finally {\n  connection.close();\n}", explanation: "finally always executes — perfect for cleanup like closing resources.", difficulty: "medium" },
    ],
    "throw-throws": [
      { title: "Throw Exception", prompt: "Throw a custom exception!", code: 'throw new IllegalArgumentException("Invalid input");', explanation: "throw creates and launches an exception. throws declares it in the method signature.", difficulty: "medium" },
    ],
    "custom-exceptions": [
      { title: "Custom Exception", prompt: "Create your own exception!", code: "class InsufficientFundsException extends Exception {\n  public InsufficientFundsException(String msg) {\n    super(msg);\n  }\n}", explanation: "Custom exceptions make error handling more specific and meaningful.", difficulty: "hard" },
    ],
    "lambda-expressions": [
      { title: "Lambda Expression", prompt: "Write a lambda!", code: "Comparator<String> comp = (a, b) -> a.compareTo(b);", explanation: "Lambdas provide concise syntax for functional interfaces.", difficulty: "medium" },
    ],
    "functional-interfaces": [
      { title: "Predicate", prompt: "Use a Predicate!", code: 'Predicate<String> isLong = s -> s.length() > 5;', explanation: "Predicate<T> is a functional interface that takes T and returns boolean.", difficulty: "medium" },
    ],
    "streams-intro": [
      { title: "Create a Stream", prompt: "Stream from a list!", code: "list.stream().filter(x -> x > 0).forEach(System.out::println);", explanation: "Streams process collections with functional operations like filter and map.", difficulty: "medium" },
    ],
    "stream-operations": [
      { title: "Map and Filter", prompt: "Transform and filter!", code: 'names.stream()\n  .filter(n -> n.length() > 3)\n  .map(String::toUpperCase)\n  .toList();', explanation: "Chain filter() to select and map() to transform stream elements.", difficulty: "medium" },
    ],
    "collectors": [
      { title: "Collect to List", prompt: "Collect stream results!", code: "List<String> result = stream.collect(Collectors.toList());", explanation: "Collectors.toList() gathers stream elements into a List.", difficulty: "medium" },
    ],
    "list-interface": [
      { title: "LinkedList", prompt: "Create a LinkedList!", code: "List<String> list = new LinkedList<>();", explanation: "LinkedList is fast for insertions/deletions but slow for random access.", difficulty: "medium" },
    ],
    "set-interface": [
      { title: "HashSet", prompt: "Create a Set!", code: "Set<String> unique = new HashSet<>();\nunique.add(\"Java\");", explanation: "Sets store unique elements — duplicates are automatically ignored.", difficulty: "medium" },
    ],
    "map-interface": [
      { title: "HashMap", prompt: "Create a Map!", code: 'Map<String, Integer> scores = new HashMap<>();\nscores.put("Alice", 95);', explanation: "Maps store key-value pairs for fast lookup by key.", difficulty: "medium" },
    ],
    "iterators": [
      { title: "Iterator Pattern", prompt: "Use an Iterator!", code: "Iterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n  System.out.println(it.next());\n}", explanation: "Iterators traverse collections and allow safe removal during iteration.", difficulty: "medium" },
    ],
    "generic-classes": [
      { title: "Generic Class", prompt: "Create a generic class!", code: "class Box<T> {\n  private T value;\n}", explanation: "Generics let classes work with any type while maintaining type safety.", difficulty: "medium" },
    ],
    "generic-methods": [
      { title: "Generic Method", prompt: "Write a generic method!", code: "public <T> T firstOrNull(List<T> list) {\n  return list.isEmpty() ? null : list.get(0);\n}", explanation: "Generic methods declare their own type parameters before the return type.", difficulty: "hard" },
    ],
    "wildcards": [
      { title: "Upper Bound Wildcard", prompt: "Use extends wildcard!", code: "public void print(List<? extends Number> list) { }", explanation: "? extends Number accepts List<Integer>, List<Double>, etc.", difficulty: "hard" },
    ],
  };
  
  if (snippets[id]) return snippets[id];
  
  return [{
    title: `Practice: ${title}`,
    prompt: `Write code demonstrating ${title.toLowerCase()}!`,
    code: `// ${title}\nSystem.out.println("${title}");`,
    explanation: `This demonstrates the basic usage of ${title.toLowerCase()} in Java.`,
    difficulty: "easy" as const,
  }];
}

// ======================== SYSTEMS ANALYSIS ========================
function generateSystemsSteps(id: string, title: string, desc: string): LessonStep[] {
  const steps: LessonStep[] = [];

  // Topic-specific content
  const topicContent = getSystemsContent(id);
  if (topicContent) return topicContent;

  steps.push(generateQuizStep(`Understanding ${title}`, `What does ${title.toLowerCase()} involve?`,
    [{ label: "A", text: desc }, { label: "B", text: "Writing machine code" }, { label: "C", text: "Hardware installation" }],
    "A", `${title} is about ${desc.toLowerCase()}, a key concept in systems analysis.`, "easy"));

  steps.push(generateTypingStep(`${title} Terminology`, `Type a key term for ${title.toLowerCase()}!`,
    `// ${title}: ${desc}`,
    `Understanding terminology is crucial for ${title.toLowerCase()}.`, "easy"));

  steps.push(generateQuizStep(`${title} in Practice`, `When would you use ${title.toLowerCase()}?`,
    [{ label: "A", text: "Only during coding" }, { label: "B", text: "During system design and planning" }, { label: "C", text: "Never in real projects" }],
    "B", `${title} is applied during system design and planning to ensure quality outcomes.`, "medium"));

  steps.push(generateQuizStep(`${title} Benefits`, `What is a key benefit of ${title.toLowerCase()}?`,
    [{ label: "A", text: "Faster hardware performance" }, { label: "B", text: "Better system understanding and documentation" }, { label: "C", text: "Automatic code generation" }],
    "B", `${title} helps teams understand and document systems effectively.`, "medium"));

  steps.push(generateQuizStep(`${title} Stakeholders`, `Who benefits most from ${title.toLowerCase()}?`,
    [{ label: "A", text: "Only programmers" }, { label: "B", text: "Only managers" }, { label: "C", text: "All project stakeholders" }],
    "C", `${title} benefits all stakeholders by improving communication and understanding.`, "easy"));

  return steps;
}

function getSystemsContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "use-cases": [
      generateQuizStep("Use Case Basics", "What is a use case?", [{ label: "A", text: "A description of system-user interaction" }, { label: "B", text: "A type of database" }, { label: "C", text: "A programming language" }], "A", "Use cases describe how actors interact with a system to achieve goals."),
      generateTypingStep("Actor Definition", "Define an actor!", "Actor: Customer", "Actors are external entities that interact with the system.", "easy"),
      generateQuizStep("Use Case Elements", "What are the two main elements of a use case?", [{ label: "A", text: "Variables and loops" }, { label: "B", text: "Actors and use cases" }, { label: "C", text: "Tables and columns" }], "B", "Use case diagrams show actors (stick figures) and use cases (ovals)."),
      generateTypingStep("Use Case Name", "Write a use case name!", "UC: Place Order", "Use case names should be verb-noun format describing the goal.", "easy"),
      generateQuizStep("Include Relationship", "What does <<include>> mean?", [{ label: "A", text: "Optional behavior" }, { label: "B", text: "Required sub-behavior" }, { label: "C", text: "Error handling" }], "B", "<<include>> means the base use case always includes the sub-behavior."),
    ],
    "dfd-intro": [
      generateQuizStep("DFD Purpose", "What does a Data Flow Diagram show?", [{ label: "A", text: "How data moves through a system" }, { label: "B", text: "The physical network layout" }, { label: "C", text: "The project timeline" }], "A", "DFDs show how data flows between processes, stores, and external entities."),
      generateTypingStep("DFD Process", "Name a DFD process!", "Process: Validate Order", "Processes transform input data into output data.", "easy"),
      generateQuizStep("DFD Symbols", "What shape represents a process in a DFD?", [{ label: "A", text: "Rectangle" }, { label: "B", text: "Circle or rounded rectangle" }, { label: "C", text: "Triangle" }], "B", "Processes are shown as circles (Yourdon) or rounded rectangles (Gane-Sarson)."),
      generateQuizStep("DFD Levels", "What is a Context Diagram?", [{ label: "A", text: "The most detailed DFD" }, { label: "B", text: "Level 0 showing the whole system as one process" }, { label: "C", text: "A network diagram" }], "B", "Context diagrams show the entire system as a single process with external entities."),
    ],
    "erd-intro": [
      generateQuizStep("ERD Purpose", "What does an ERD show?", [{ label: "A", text: "Data entities and their relationships" }, { label: "B", text: "Network topology" }, { label: "C", text: "Program flow" }], "A", "Entity-Relationship Diagrams model the data structure of a system."),
      generateTypingStep("Entity Example", "Define an entity!", "Entity: Student", "Entities represent real-world objects that we store data about.", "easy"),
      generateQuizStep("ERD Relationships", "What connects entities in an ERD?", [{ label: "A", text: "Arrows" }, { label: "B", text: "Relationships with cardinality" }, { label: "C", text: "Dotted lines" }], "B", "Relationships show how entities are connected, with cardinality showing how many."),
      generateQuizStep("Cardinality", "What does 1:M mean?", [{ label: "A", text: "One-to-many relationship" }, { label: "B", text: "One-to-one relationship" }, { label: "C", text: "Many-to-many relationship" }], "A", "1:M means one record in table A relates to many records in table B."),
    ],
    "agile-intro": [
      generateQuizStep("Agile Values", "Which is an Agile Manifesto value?", [{ label: "A", text: "Comprehensive documentation over working software" }, { label: "B", text: "Individuals and interactions over processes and tools" }, { label: "C", text: "Following a plan over responding to change" }], "B", "The Agile Manifesto values people and interactions over rigid processes."),
      generateQuizStep("Agile Principles", "How often should working software be delivered?", [{ label: "A", text: "Once at the end" }, { label: "B", text: "Every few weeks to months" }, { label: "C", text: "Only when requested" }], "B", "Agile promotes frequent delivery of working software, typically every 2-4 weeks."),
      generateTypingStep("User Story", "Write a user story!", 'As a customer, I want to view my orders so that I can track deliveries.', "User stories follow the format: As a [role], I want [feature] so that [benefit].", "medium"),
      generateQuizStep("Agile vs Waterfall", "How does Agile differ from Waterfall?", [{ label: "A", text: "Agile is iterative, Waterfall is sequential" }, { label: "B", text: "They are the same" }, { label: "C", text: "Waterfall is newer" }], "A", "Agile uses iterations/sprints while Waterfall follows a linear sequence of phases."),
    ],
    "scrum-framework": [
      generateQuizStep("Scrum Events", "What are the Scrum ceremonies?", [{ label: "A", text: "Sprint Planning, Daily Scrum, Sprint Review, Retrospective" }, { label: "B", text: "Only standup meetings" }, { label: "C", text: "Weekly reports" }], "A", "Scrum has four main events within each Sprint."),
      generateQuizStep("Sprint Duration", "How long is a typical Sprint?", [{ label: "A", text: "6 months" }, { label: "B", text: "1-4 weeks" }, { label: "C", text: "1 day" }], "B", "Sprints are typically 1-4 weeks long, with 2 weeks being most common."),
      generateQuizStep("Product Backlog", "Who manages the Product Backlog?", [{ label: "A", text: "The developers" }, { label: "B", text: "The Product Owner" }, { label: "C", text: "The Scrum Master" }], "B", "The Product Owner is responsible for managing and prioritizing the Product Backlog."),
    ],
    "waterfall-model": [
      generateQuizStep("Waterfall Phases", "What are the Waterfall phases in order?", [{ label: "A", text: "Requirements, Design, Implementation, Testing, Maintenance" }, { label: "B", text: "Code, Test, Deploy" }, { label: "C", text: "Plan, Execute, Close" }], "A", "Waterfall follows a strict sequential flow through defined phases."),
      generateQuizStep("Waterfall Advantage", "When is Waterfall most suitable?", [{ label: "A", text: "When requirements are unclear" }, { label: "B", text: "When requirements are well-defined and stable" }, { label: "C", text: "For all projects" }], "B", "Waterfall works best when requirements are clear, documented, and unlikely to change."),
    ],
    "normalization": [
      generateQuizStep("1NF", "What is First Normal Form (1NF)?", [{ label: "A", text: "Each cell contains a single atomic value" }, { label: "B", text: "No tables exist" }, { label: "C", text: "All data in one table" }], "A", "1NF requires each column to contain only atomic (indivisible) values."),
      generateQuizStep("2NF", "What does 2NF require beyond 1NF?", [{ label: "A", text: "No partial dependencies on composite keys" }, { label: "B", text: "No tables" }, { label: "C", text: "Only one column" }], "A", "2NF removes partial dependencies — non-key attributes must depend on the whole key."),
      generateQuizStep("3NF", "What does 3NF eliminate?", [{ label: "A", text: "Transitive dependencies" }, { label: "B", text: "All data" }, { label: "C", text: "Primary keys" }], "A", "3NF removes transitive dependencies — non-key attributes must depend only on the key."),
    ],
  };
  return content[id] || null;
}

// ======================== MATHS ========================
function generateMathSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getMathContent(id);
  if (topicContent) return topicContent;

  return [
    generateQuizStep(`${title} Basics`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A programming language" }, { label: "B", text: desc }, { label: "C", text: "A type of computer hardware" }],
      "B", `${title}: ${desc}. This is fundamental to computing mathematics.`, "easy"),
    generateTypingStep(`${title} Practice`, `Practice ${title.toLowerCase()}!`,
      `// ${title}: ${desc}`,
      `Understanding ${title.toLowerCase()} is essential for computing.`, "easy"),
    generateQuizStep(`${title} Application`, `Where is ${title.toLowerCase()} used in computing?`,
      [{ label: "A", text: "Only in pure mathematics" }, { label: "B", text: "Algorithm design and analysis" }, { label: "C", text: "Nowhere in computing" }],
      "B", `${title} is essential in algorithm design, data structures, and computational theory.`, "medium"),
    generateQuizStep(`${title} Problem Solving`, `How does ${title.toLowerCase()} help solve problems?`,
      [{ label: "A", text: "By guessing answers" }, { label: "B", text: "It doesn't help" }, { label: "C", text: "Provides systematic mathematical approaches" }],
      "C", `Mathematical concepts like ${title.toLowerCase()} provide rigorous problem-solving frameworks.`, "medium"),
  ];
}

function getMathContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "binary-basics": [
      generateQuizStep("Binary Counting", "What is 5 in binary?", [{ label: "A", text: "101" }, { label: "B", text: "110" }, { label: "C", text: "100" }], "A", "5 in binary is 101 (4+0+1)."),
      generateTypingStep("Binary Number", "Type a binary number!", "101", "101 in binary = 5 in decimal (1×4 + 0×2 + 1×1).", "easy"),
      generateQuizStep("Binary to Decimal", "What is 1100 in decimal?", [{ label: "A", text: "10" }, { label: "B", text: "12" }, { label: "C", text: "14" }], "B", "1100 = 1×8 + 1×4 + 0×2 + 0×1 = 12."),
      generateQuizStep("Decimal to Binary", "What is 10 in binary?", [{ label: "A", text: "1010" }, { label: "B", text: "1001" }, { label: "C", text: "1100" }], "A", "10 in binary is 1010 (8+0+2+0)."),
    ],
    "binary-arithmetic": [
      generateQuizStep("Binary Addition", "What is 1011 + 0101?", [{ label: "A", text: "10000" }, { label: "B", text: "1110" }, { label: "C", text: "1111" }], "A", "1011 (11) + 0101 (5) = 10000 (16)."),
      generateTypingStep("Add Binary", "Type the result!", "10000", "1011 + 0101 = 10000. Remember: 1+1 = 10 in binary (carry the 1).", "medium"),
      generateQuizStep("Carry Rule", "In binary, what is 1 + 1?", [{ label: "A", text: "2" }, { label: "B", text: "10" }, { label: "C", text: "11" }], "B", "In binary, 1 + 1 = 10 (write 0, carry 1)."),
    ],
    "hex-system": [
      generateQuizStep("Hex Digits", "What digits does hexadecimal use?", [{ label: "A", text: "0-9 and A-F" }, { label: "B", text: "0-9 only" }, { label: "C", text: "0-7" }], "A", "Hex uses 0-9 and A-F, where A=10, B=11, C=12, D=13, E=14, F=15."),
      generateTypingStep("Hex Value", "Type a hex number!", "0xFF", "0xFF = 255 in decimal (15×16 + 15×1).", "easy"),
      generateQuizStep("Hex to Decimal", "What is 0x1A in decimal?", [{ label: "A", text: "26" }, { label: "B", text: "16" }, { label: "C", text: "10" }], "A", "0x1A = 1×16 + 10×1 = 26."),
    ],
    "truth-tables": [
      generateQuizStep("AND Truth Table", "What is TRUE AND FALSE?", [{ label: "A", text: "TRUE" }, { label: "B", text: "FALSE" }, { label: "C", text: "UNDEFINED" }], "B", "AND requires both inputs to be TRUE. TRUE AND FALSE = FALSE."),
      generateQuizStep("OR Truth Table", "What is FALSE OR TRUE?", [{ label: "A", text: "FALSE" }, { label: "B", text: "TRUE" }, { label: "C", text: "UNDEFINED" }], "B", "OR requires at least one TRUE input. FALSE OR TRUE = TRUE."),
      generateQuizStep("NOT Operation", "What is NOT TRUE?", [{ label: "A", text: "TRUE" }, { label: "B", text: "FALSE" }, { label: "C", text: "NULL" }], "B", "NOT inverts the value. NOT TRUE = FALSE."),
      generateTypingStep("Boolean Expression", "Type a boolean expression!", "A AND (B OR C)", "Parentheses determine order of operations in boolean expressions.", "medium"),
    ],
    "big-o-intro": [
      generateQuizStep("Big-O Purpose", "What does Big-O notation describe?", [{ label: "A", text: "The worst-case growth rate of an algorithm" }, { label: "B", text: "The exact execution time" }, { label: "C", text: "Memory used" }], "A", "Big-O describes how an algorithm's time/space scales with input size."),
      generateQuizStep("O(1) Meaning", "What does O(1) mean?", [{ label: "A", text: "Linear time" }, { label: "B", text: "Constant time — doesn't grow with input" }, { label: "C", text: "Quadratic time" }], "B", "O(1) operations take the same time regardless of input size."),
      generateQuizStep("O(n) Example", "Which operation is O(n)?", [{ label: "A", text: "Array index lookup" }, { label: "B", text: "Searching unsorted array" }, { label: "C", text: "HashMap get" }], "B", "Searching an unsorted array requires checking each element — linear time."),
    ],
    "logic-gates": [
      generateQuizStep("AND Gate", "When does an AND gate output 1?", [{ label: "A", text: "When any input is 1" }, { label: "B", text: "When all inputs are 1" }, { label: "C", text: "When all inputs are 0" }], "B", "AND gates output 1 only when ALL inputs are 1."),
      generateQuizStep("OR Gate", "When does an OR gate output 1?", [{ label: "A", text: "When at least one input is 1" }, { label: "B", text: "When all inputs are 1" }, { label: "C", text: "When all inputs are 0" }], "A", "OR gates output 1 when ANY input is 1."),
      generateQuizStep("NOT Gate", "What does a NOT gate do?", [{ label: "A", text: "Adds inputs" }, { label: "B", text: "Inverts the input" }, { label: "C", text: "Multiplies inputs" }], "B", "NOT gates invert: 0 becomes 1, and 1 becomes 0."),
    ],
  };
  return content[id] || null;
}

// ======================== CYBERSECURITY ========================
function generateCyberSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getCyberContent(id);
  if (topicContent) return topicContent;

  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A type of software development" }, { label: "B", text: desc }, { label: "C", text: "A networking protocol" }],
      "B", `${title}: ${desc}. This is a critical cybersecurity concept.`, "easy"),
    generateTypingStep(`${title} Command`, `Type a security concept!`,
      `// Security: ${title}`,
      `Understanding ${title.toLowerCase()} is essential for cybersecurity professionals.`, "easy"),
    generateQuizStep(`${title} Importance`, `Why is ${title.toLowerCase()} important?`,
      [{ label: "A", text: "It makes systems faster" }, { label: "B", text: "It protects systems and data from threats" }, { label: "C", text: "It is not important" }],
      "B", `${title} is crucial for protecting information systems against various security threats.`, "medium"),
    generateQuizStep(`${title} Implementation`, `How is ${title.toLowerCase()} typically implemented?`,
      [{ label: "A", text: "By ignoring security risks" }, { label: "B", text: "Only through hardware upgrades" }, { label: "C", text: "Through security controls, policies, and procedures" }],
      "C", `Proper implementation of ${title.toLowerCase()} involves layered security controls and clear policies.`, "medium"),
    generateQuizStep(`${title} Best Practices`, `What is a best practice for ${title.toLowerCase()}?`,
      [{ label: "A", text: "Set it and forget it" }, { label: "B", text: "Regular assessment, monitoring, and updates" }, { label: "C", text: "Share passwords freely" }],
      "B", `Security best practices include continuous monitoring, regular updates, and proper documentation.`, "medium"),
  ];
}

function getCyberContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "cia-triad": [
      generateQuizStep("CIA Triad", "What does CIA stand for in cybersecurity?", [{ label: "A", text: "Central Intelligence Agency" }, { label: "B", text: "Confidentiality, Integrity, Availability" }, { label: "C", text: "Computer Information Access" }], "B", "The CIA Triad is the foundation of information security."),
      generateQuizStep("Confidentiality", "What ensures confidentiality?", [{ label: "A", text: "Encryption and access controls" }, { label: "B", text: "Backups" }, { label: "C", text: "Load balancing" }], "A", "Encryption and access controls prevent unauthorized data access."),
      generateQuizStep("Integrity", "What protects data integrity?", [{ label: "A", text: "Hash functions and checksums" }, { label: "B", text: "Faster internet" }, { label: "C", text: "More storage" }], "A", "Hash functions verify that data hasn't been tampered with."),
    ],
    "phishing": [
      generateQuizStep("Phishing Attack", "What is phishing?", [{ label: "A", text: "A social engineering attack using fake emails/websites" }, { label: "B", text: "A type of firewall" }, { label: "C", text: "A programming language" }], "A", "Phishing tricks users into revealing sensitive information through fake communications."),
      generateQuizStep("Spear Phishing", "How does spear phishing differ from phishing?", [{ label: "A", text: "It targets specific individuals" }, { label: "B", text: "It uses phone calls" }, { label: "C", text: "It's less dangerous" }], "A", "Spear phishing is targeted at specific individuals using personalized information."),
      generateQuizStep("Prevention", "How to prevent phishing?", [{ label: "A", text: "Click all links to test them" }, { label: "B", text: "Verify sender, check URLs, use MFA" }, { label: "C", text: "Disable email" }], "B", "Always verify senders, hover over links, and use multi-factor authentication."),
    ],
    "encryption-basics": [
      generateQuizStep("Symmetric Encryption", "What is symmetric encryption?", [{ label: "A", text: "Same key for encryption and decryption" }, { label: "B", text: "Different keys for each" }, { label: "C", text: "No key needed" }], "A", "Symmetric encryption uses one shared key for both encrypting and decrypting."),
      generateQuizStep("Asymmetric Encryption", "What does asymmetric encryption use?", [{ label: "A", text: "One key" }, { label: "B", text: "A public key and a private key" }, { label: "C", text: "No encryption" }], "B", "Asymmetric encryption uses a key pair: public for encrypting, private for decrypting."),
      generateTypingStep("AES Example", "Type an encryption standard!", "AES-256", "AES-256 is a strong symmetric encryption standard used worldwide.", "easy"),
    ],
    "network-security-basics": [
      generateQuizStep("Firewall Purpose", "What does a firewall do?", [{ label: "A", text: "Speeds up internet" }, { label: "B", text: "Filters network traffic based on rules" }, { label: "C", text: "Stores passwords" }], "B", "Firewalls monitor and control incoming/outgoing traffic based on security rules."),
      generateQuizStep("IDS vs IPS", "What's the difference between IDS and IPS?", [{ label: "A", text: "IDS detects, IPS prevents" }, { label: "B", text: "They are the same" }, { label: "C", text: "IPS detects, IDS prevents" }], "A", "IDS (Intrusion Detection) alerts you; IPS (Intrusion Prevention) actively blocks threats."),
    ],
  };
  return content[id] || null;
}

// ======================== AI & DATA SCIENCE ========================
function generateAISteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getAIContent(id);
  if (topicContent) return topicContent;

  return [
    generateQuizStep(`${title} Fundamentals`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: "Manual data entry" }, { label: "B", text: desc }, { label: "C", text: "Hardware assembly" }],
      "B", `${title}: ${desc}. This is a key concept in AI and data science.`, "easy"),
    generateTypingStep(`${title} Code`, `Write code for ${title.toLowerCase()}!`,
      `# ${title}\nprint("${desc}")`,
      `Python is the primary language for ${title.toLowerCase()}.`, "easy"),
    generateQuizStep(`${title} Applications`, `Where is ${title.toLowerCase()} applied?`,
      [{ label: "A", text: "Only in academic research" }, { label: "B", text: "Data analysis, prediction, and automation" }, { label: "C", text: "Nowhere practical" }],
      "B", `${title} has wide applications in industry, research, healthcare, finance, and more.`, "medium"),
    generateQuizStep(`${title} Techniques`, `What technique is related to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Manual spreadsheet editing" }, { label: "B", text: "Print statements only" }, { label: "C", text: "Statistical modeling and pattern recognition" }],
      "C", `${title} leverages statistical methods and algorithms to extract insights from data.`, "medium"),
    generateQuizStep(`${title} Ethics`, `What ethical consideration applies to ${title.toLowerCase()}?`,
      [{ label: "A", text: "No ethics needed" }, { label: "B", text: "Fairness, transparency, and accountability" }, { label: "C", text: "Only profit matters" }],
      "B", `Ethical AI requires fairness, transparency, and accountability in all applications.`, "medium"),
  ];
}

function getAIContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "linear-regression": [
      generateQuizStep("Linear Regression", "What does linear regression predict?", [{ label: "A", text: "Categories" }, { label: "B", text: "Continuous numerical values" }, { label: "C", text: "Images" }], "B", "Linear regression predicts continuous values by finding the best-fit line."),
      generateTypingStep("Regression Code", "Write regression in Python!", "model = LinearRegression()\nmodel.fit(X_train, y_train)", "fit() trains the model on your training data.", "medium"),
      generateQuizStep("R² Score", "What does R² = 0.85 mean?", [{ label: "A", text: "85% of variance is explained by the model" }, { label: "B", text: "85% accuracy" }, { label: "C", text: "85 data points" }], "A", "R² measures how much variance in the target is explained by the features."),
    ],
    "neural-networks": [
      generateQuizStep("Neural Network", "What is a neural network inspired by?", [{ label: "A", text: "Computer circuits" }, { label: "B", text: "The human brain" }, { label: "C", text: "The internet" }], "B", "Neural networks are inspired by biological neurons in the human brain."),
      generateQuizStep("Layers", "What are the three types of layers?", [{ label: "A", text: "Input, hidden, output" }, { label: "B", text: "Top, middle, bottom" }, { label: "C", text: "Fast, medium, slow" }], "A", "Neural networks have input layers, one or more hidden layers, and an output layer."),
      generateTypingStep("Create Network", "Define a simple neural network!", "model = Sequential([\n  Dense(64, activation='relu'),\n  Dense(1)\n])", "Sequential models stack layers linearly.", "medium"),
    ],
    "decision-trees": [
      generateQuizStep("Decision Tree", "How does a decision tree make predictions?", [{ label: "A", text: "By splitting data on feature thresholds" }, { label: "B", text: "By random guessing" }, { label: "C", text: "By memorizing all data" }], "A", "Decision trees split data at each node based on the feature that best separates the classes."),
      generateQuizStep("Overfitting", "What causes overfitting in decision trees?", [{ label: "A", text: "Too few nodes" }, { label: "B", text: "Tree is too deep/complex" }, { label: "C", text: "Too much data" }], "B", "Deep trees memorize training data instead of learning general patterns."),
    ],
    "kmeans": [
      generateQuizStep("K-Means", "What does K-Means do?", [{ label: "A", text: "Groups data into K clusters" }, { label: "B", text: "Predicts labels" }, { label: "C", text: "Removes outliers" }], "A", "K-Means partitions data into K clusters based on distance to centroids."),
      generateTypingStep("K-Means Code", "Create K-Means clusters!", "kmeans = KMeans(n_clusters=3)\nkmeans.fit(data)", "n_clusters specifies how many groups to create.", "medium"),
    ],
    "prompt-engineering": [
      generateQuizStep("Prompt Engineering", "What is prompt engineering?", [{ label: "A", text: "Building hardware" }, { label: "B", text: "Crafting effective inputs for AI models" }, { label: "C", text: "Writing unit tests" }], "B", "Prompt engineering is the art of writing effective prompts to get better AI outputs."),
      generateTypingStep("System Prompt", "Write a system prompt!", 'You are a helpful coding tutor. Explain concepts simply.', "System prompts set the AI's behavior and personality.", "easy"),
      generateQuizStep("Few-Shot", "What is few-shot prompting?", [{ label: "A", text: "Giving examples in the prompt" }, { label: "B", text: "Using less data" }, { label: "C", text: "Running fewer iterations" }], "A", "Few-shot prompting includes examples to guide the AI's response format."),
    ],
  };
  return content[id] || null;
}

// ======================== BUSINESS SYSTEMS ========================
function generateBusinessSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A hardware component" }, { label: "B", text: desc }, { label: "C", text: "A programming language" }],
      "B", `${title}: ${desc}. This is important for modern business information systems.`, "easy"),
    generateTypingStep(`${title} Concept`, `Type a key concept!`,
      `// ${title}: ${desc}`,
      `${title} is a fundamental business systems concept.`, "easy"),
    generateQuizStep(`${title} Business Value`, `How does ${title.toLowerCase()} add business value?`,
      [{ label: "A", text: "Only increases costs" }, { label: "B", text: "Improves efficiency, decision-making, and competitive advantage" }, { label: "C", text: "Has no business impact" }],
      "B", `${title} drives business value through improved efficiency and informed decision-making.`, "medium"),
    generateQuizStep(`${title} Implementation`, `What is key to implementing ${title.toLowerCase()}?`,
      [{ label: "A", text: "Just install software" }, { label: "B", text: "Strategic planning, stakeholder buy-in, and change management" }, { label: "C", text: "Ignore user requirements" }],
      "B", `Successful implementation requires careful planning, stakeholder engagement, and proper change management.`, "medium"),
    generateQuizStep(`${title} Trends`, `What current trend relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Returning to paper-based systems" }, { label: "B", text: "Cloud computing, automation, and digital transformation" }, { label: "C", text: "Removing all technology" }],
      "B", `Modern trends like cloud computing and digital transformation heavily influence ${title.toLowerCase()}.`, "medium"),
  ];
}

// ======================== GAME DEVELOPMENT ========================
function generateGameDevSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getGameDevContent(id);
  if (topicContent) return topicContent;

  return [
    generateQuizStep(`${title} Basics`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: "Database management" }, { label: "B", text: desc }, { label: "C", text: "Network administration" }],
      "B", `${title}: ${desc}. This is a core game development concept.`, "easy"),
    generateTypingStep(`${title} Code`, `Write game dev code!`,
      `// ${title}\n// ${desc}`,
      `This concept is used in game engines like Unity and Unreal.`, "easy"),
    generateQuizStep(`${title} in Engines`, `How is ${title.toLowerCase()} used in game engines?`,
      [{ label: "A", text: "It's never used in games" }, { label: "B", text: "It's a fundamental building block of game systems" }, { label: "C", text: "Only in 2D games" }],
      "B", `${title} is fundamental to how modern game engines create interactive experiences.`, "medium"),
    generateQuizStep(`${title} Design`, `What design principle relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Making games slower" }, { label: "B", text: "Performance optimization and player experience" }, { label: "C", text: "Ignoring frame rate" }],
      "B", `Good game design balances ${title.toLowerCase()} with performance and player experience.`, "medium"),
  ];
}

function getGameDevContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "game-loop": [
      generateQuizStep("Game Loop", "What is the game loop?", [{ label: "A", text: "The continuous cycle of input, update, render" }, { label: "B", text: "A type of for loop" }, { label: "C", text: "A loading screen" }], "A", "The game loop continuously processes input, updates game state, and renders frames."),
      generateTypingStep("Game Loop Code", "Write a basic game loop!", "while (running) {\n  processInput();\n  update(deltaTime);\n  render();\n}", "The game loop runs every frame — typically 60 times per second.", "medium"),
      generateQuizStep("Delta Time", "Why use delta time?", [{ label: "A", text: "To make movement frame-rate independent" }, { label: "B", text: "To count frames" }, { label: "C", text: "To slow down the game" }], "A", "Delta time ensures consistent movement speed regardless of frame rate."),
    ],
    "collision-detection": [
      generateQuizStep("AABB Collision", "What is AABB collision detection?", [{ label: "A", text: "Axis-Aligned Bounding Box — rectangle overlap check" }, { label: "B", text: "A sound effect" }, { label: "C", text: "A rendering technique" }], "A", "AABB checks if two rectangles overlap by comparing their edges."),
      generateTypingStep("Collision Check", "Write a collision check!", "if (a.x < b.x + b.w && a.x + a.w > b.x) {\n  // collision!\n}", "AABB checks both X and Y axis overlap.", "medium"),
    ],
  };
  return content[id] || null;
}

// ======================== COMPUTER SYSTEMS ========================
function generateComputerSystemsSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getComputerSystemsContent(id);
  if (topicContent) return topicContent;

  return [
    generateQuizStep(`${title} Fundamentals`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A type of software application" }, { label: "B", text: desc }, { label: "C", text: "A programming methodology" }],
      "B", `${title}: ${desc}. Understanding this is essential for computer systems knowledge.`, "easy"),
    generateTypingStep(`${title} Note`, `Type a key fact!`,
      `// ${title}: ${desc}`,
      `This is a fundamental computer systems concept.`, "easy"),
    generateQuizStep(`${title} Components`, `What component relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Only web browsers" }, { label: "B", text: "Hardware and system architecture" }, { label: "C", text: "Social media platforms" }],
      "B", `${title} is closely related to hardware components and system architecture.`, "medium"),
    generateQuizStep(`${title} in Practice`, `How is ${title.toLowerCase()} applied in real systems?`,
      [{ label: "A", text: "Only in theory" }, { label: "B", text: "In system design, troubleshooting, and optimization" }, { label: "C", text: "Never in practice" }],
      "B", `Understanding ${title.toLowerCase()} helps with system design, diagnostics, and performance optimization.`, "medium"),
  ];
}

function getComputerSystemsContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "cpu-fundamentals": [
      generateQuizStep("CPU Components", "What are the main CPU components?", [{ label: "A", text: "ALU, Control Unit, Registers" }, { label: "B", text: "Monitor, keyboard, mouse" }, { label: "C", text: "RAM, ROM, Cache" }], "A", "The CPU contains the ALU (arithmetic), Control Unit (coordination), and Registers (fast storage)."),
      generateQuizStep("ALU Function", "What does the ALU do?", [{ label: "A", text: "Stores data permanently" }, { label: "B", text: "Performs arithmetic and logical operations" }, { label: "C", text: "Displays graphics" }], "B", "The Arithmetic Logic Unit performs calculations and comparisons."),
      generateTypingStep("CPU Registers", "Name CPU registers!", "ACC, PC, MAR, MDR, CIR", "Key registers: Accumulator, Program Counter, Memory Address/Data Registers.", "medium"),
    ],
    "instruction-cycle": [
      generateQuizStep("FDE Cycle", "What are the stages of the instruction cycle?", [{ label: "A", text: "Fetch, Decode, Execute" }, { label: "B", text: "Read, Write, Delete" }, { label: "C", text: "Input, Process, Output" }], "A", "The CPU continuously fetches instructions, decodes them, and executes them."),
      generateQuizStep("Fetch Stage", "What happens during fetch?", [{ label: "A", text: "The instruction is read from memory into the CPU" }, { label: "B", text: "The result is displayed" }, { label: "C", text: "Data is saved to disk" }], "A", "During fetch, the instruction at the address in the Program Counter is loaded."),
    ],
    "lmc-intro": [
      generateQuizStep("LMC Model", "What is the Little Man Computer?", [{ label: "A", text: "A simplified model of how a CPU works" }, { label: "B", text: "A small laptop" }, { label: "C", text: "A mobile app" }], "A", "The LMC is an educational model that simulates basic CPU operations."),
      generateQuizStep("LMC Mailboxes", "How many mailboxes does the LMC have?", [{ label: "A", text: "10" }, { label: "B", text: "100 (00-99)" }, { label: "C", text: "1000" }], "B", "The LMC has 100 mailboxes (memory locations) numbered 00 to 99."),
      generateTypingStep("LMC Add", "Write LMC instructions!", "INP\nSTA 99\nINP\nADD 99\nOUT\nHLT", "This LMC program adds two inputs together and outputs the result.", "medium"),
    ],
    "lmc-instructions": [
      generateQuizStep("LMC Instructions", "What does STA do in LMC?", [{ label: "A", text: "Stores the accumulator value in a mailbox" }, { label: "B", text: "Starts the program" }, { label: "C", text: "Stops execution" }], "A", "STA (Store) copies the accumulator's value to the specified mailbox."),
      generateQuizStep("LDA Instruction", "What does LDA do?", [{ label: "A", text: "Loads a value from a mailbox into the accumulator" }, { label: "B", text: "Loads a program" }, { label: "C", text: "Loops the program" }], "A", "LDA (Load) copies a mailbox's value into the accumulator."),
      generateTypingStep("LMC Program", "Write a subtraction program!", "INP\nSTA 99\nINP\nSUB 99\nOUT\nHLT", "This program subtracts the first input from the second.", "medium"),
    ],
    "osi-model": [
      generateQuizStep("OSI Layers", "How many layers does the OSI model have?", [{ label: "A", text: "4" }, { label: "B", text: "7" }, { label: "C", text: "5" }], "B", "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."),
      generateTypingStep("OSI Mnemonic", "Type the OSI layers mnemonic!", "Please Do Not Throw Sausage Pizza Away", "This mnemonic helps remember: Physical, Data Link, Network, Transport, Session, Presentation, Application.", "easy"),
      generateQuizStep("Layer 3", "What does the Network layer handle?", [{ label: "A", text: "Physical cabling" }, { label: "B", text: "Routing and IP addressing" }, { label: "C", text: "Application protocols" }], "B", "Layer 3 (Network) handles logical addressing and routing between networks."),
    ],
    "subnetting-intro": [
      generateQuizStep("Subnetting Purpose", "Why do we subnet networks?", [{ label: "A", text: "To divide large networks into smaller, manageable segments" }, { label: "B", text: "To make the internet faster" }, { label: "C", text: "To remove firewalls" }], "A", "Subnetting divides networks for better management, security, and efficiency."),
      generateQuizStep("Subnet Mask", "What does a subnet mask determine?", [{ label: "A", text: "Which part is network and which is host" }, { label: "B", text: "The internet speed" }, { label: "C", text: "The computer's name" }], "A", "Subnet masks separate the network portion from the host portion of an IP address."),
      generateTypingStep("CIDR Notation", "Write CIDR notation!", "192.168.1.0/24", "/24 means 24 bits for network = 256 addresses (254 usable hosts).", "medium"),
    ],
    "ipv4-intro": [
      generateQuizStep("IPv4 Format", "How many bits is an IPv4 address?", [{ label: "A", text: "16 bits" }, { label: "B", text: "32 bits" }, { label: "C", text: "64 bits" }], "B", "IPv4 addresses are 32 bits long, written as four octets (e.g., 192.168.1.1)."),
      generateTypingStep("IP Address", "Type an IP address!", "192.168.1.1", "Each octet ranges from 0-255, separated by dots.", "easy"),
      generateQuizStep("Private IP Range", "Which is a private IP range?", [{ label: "A", text: "192.168.0.0 - 192.168.255.255" }, { label: "B", text: "8.8.8.0 - 8.8.8.255" }, { label: "C", text: "1.0.0.0 - 1.255.255.255" }], "A", "192.168.x.x is a Class C private range (RFC 1918)."),
    ],
  };
  return content[id] || null;
}

// ======================== WEB TECHNOLOGIES ========================
function generateWebSteps(id: string, title: string, desc: string): LessonStep[] {
  const steps: LessonStep[] = [];

  steps.push(generateQuizStep(`${title} Introduction`, `What is ${title.toLowerCase()}?`,
    [{ label: "A", text: "A database system" }, { label: "B", text: desc }, { label: "C", text: "An operating system" }],
    "B", `${title}: ${desc}. This is a key web development concept.`, "easy"));

  const webSnippet = getWebCodeSnippet(id, title);
  if (webSnippet) {
    steps.push(generateTypingStep(webSnippet.title, webSnippet.prompt, webSnippet.code, webSnippet.explanation, webSnippet.difficulty));
  }

  steps.push(generateQuizStep(`${title} Usage`, `When would you use ${title.toLowerCase()}?`,
    [{ label: "A", text: "Never" }, { label: "B", text: "When building modern web applications" }, { label: "C", text: "Only for desktop apps" }],
    "B", `${title} is commonly used when building modern, responsive web applications.`, "medium"));

  steps.push(generateQuizStep(`${title} Best Practices`, `What is important when implementing ${title.toLowerCase()}?`,
    [{ label: "A", text: "Ignoring browser compatibility" }, { label: "B", text: "Following web standards and accessibility guidelines" }, { label: "C", text: "Using deprecated features" }],
    "B", `Following web standards ensures your implementation of ${title.toLowerCase()} works across all browsers and devices.`, "medium"));

  return steps;
}

function getWebCodeSnippet(id: string, title: string): { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" } | null {
  const snippets: Record<string, { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }> = {
    "html-structure": { title: "HTML Document", prompt: "Create an HTML structure!", code: "<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", explanation: "Every HTML document starts with DOCTYPE and has head and body sections.", difficulty: "easy" },
    "html-text": { title: "Heading Element", prompt: "Create a heading!", code: "<h1>Welcome to My Page</h1>", explanation: "h1 is the largest heading. Use h1-h6 for hierarchy.", difficulty: "easy" },
    "html-links": { title: "Hyperlink", prompt: "Create a link!", code: '<a href="https://example.com">Visit</a>', explanation: "The <a> tag creates clickable hyperlinks to other pages.", difficulty: "easy" },
    "html-images": { title: "Image Element", prompt: "Add an image!", code: '<img src="photo.jpg" alt="A photo">', explanation: "Always include alt text for accessibility.", difficulty: "easy" },
    "html-lists": { title: "Unordered List", prompt: "Create a list!", code: "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>", explanation: "<ul> creates bullet points, <ol> creates numbered lists.", difficulty: "easy" },
    "html-tables": { title: "HTML Table", prompt: "Create a table!", code: "<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Alice</td><td>25</td></tr>\n</table>", explanation: "<tr> = table row, <th> = header cell, <td> = data cell.", difficulty: "medium" },
    "html-forms": { title: "HTML Form", prompt: "Create a form!", code: '<form action="/submit" method="POST">\n  <input type="text" name="email">\n  <button type="submit">Send</button>\n</form>', explanation: "Forms collect user input and submit data to a server.", difficulty: "medium" },
    "html-semantic": { title: "Semantic HTML", prompt: "Use semantic elements!", code: "<header>\n  <nav>Menu</nav>\n</header>\n<main>\n  <article>Content</article>\n</main>\n<footer>Copyright</footer>", explanation: "Semantic elements describe their content's meaning to browsers and screen readers.", difficulty: "medium" },
    "css-selectors": { title: "CSS Class Selector", prompt: "Style a class!", code: ".highlight {\n  color: blue;\n  font-weight: bold;\n}", explanation: "Class selectors target elements with a specific class attribute.", difficulty: "easy" },
    "css-colors": { title: "CSS Colors", prompt: "Set colors!", code: "body {\n  color: #333;\n  background-color: rgb(240, 240, 245);\n}", explanation: "Colors can be hex (#333), rgb(), hsl(), or named values.", difficulty: "easy" },
    "css-box-model": { title: "Box Model", prompt: "Apply box model properties!", code: ".card {\n  margin: 20px;\n  padding: 16px;\n  border: 1px solid #ccc;\n}", explanation: "The box model: content → padding → border → margin.", difficulty: "medium" },
    "css-flexbox": { title: "Flexbox Container", prompt: "Create a flex layout!", code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}", explanation: "Flexbox provides powerful one-dimensional layout capabilities.", difficulty: "medium" },
    "css-grid": { title: "CSS Grid Layout", prompt: "Create a grid!", code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n}", explanation: "CSS Grid enables two-dimensional layouts with rows and columns.", difficulty: "medium" },
    "css-responsive": { title: "Media Query", prompt: "Write a media query!", code: "@media (max-width: 768px) {\n  .sidebar {\n    display: none;\n  }\n}", explanation: "Media queries apply styles based on screen size for responsive design.", difficulty: "medium" },
    "css-animations": { title: "CSS Animation", prompt: "Create an animation!", code: "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.element { animation: fadeIn 0.3s; }", explanation: "@keyframes defines the animation, then apply it with the animation property.", difficulty: "medium" },
    "css-variables": { title: "CSS Custom Properties", prompt: "Use CSS variables!", code: ":root {\n  --primary: #3b82f6;\n}\n.btn {\n  background: var(--primary);\n}", explanation: "CSS variables (custom properties) enable reusable, themeable values.", difficulty: "medium" },
    "js-variables": { title: "JavaScript Variables", prompt: "Declare variables!", code: 'const name = "JavaScript";\nlet count = 0;', explanation: "Use const for values that don't change, let for variables that do.", difficulty: "easy" },
    "js-functions": { title: "Arrow Function", prompt: "Write an arrow function!", code: "const greet = (name) => `Hello, ${name}!`;", explanation: "Arrow functions provide concise syntax for function expressions.", difficulty: "easy" },
    "js-arrays": { title: "Array Methods", prompt: "Use array methods!", code: "const doubled = nums.map(n => n * 2);", explanation: "map() creates a new array by transforming each element.", difficulty: "medium" },
    "js-objects": { title: "JavaScript Object", prompt: "Create an object!", code: 'const user = {\n  name: "Alice",\n  age: 25,\n  greet() { return `Hi, I am ${this.name}`; }\n};', explanation: "Objects store data as key-value pairs with optional methods.", difficulty: "medium" },
    "dom-selection": { title: "DOM Selection", prompt: "Select an element!", code: 'const btn = document.querySelector(".btn");', explanation: "querySelector selects the first element matching a CSS selector.", difficulty: "easy" },
    "dom-manipulation": { title: "DOM Manipulation", prompt: "Create and add an element!", code: 'const div = document.createElement("div");\ndiv.textContent = "Hello";\ndocument.body.appendChild(div);', explanation: "createElement creates a new element, appendChild adds it to the page.", difficulty: "medium" },
    "js-events": { title: "Event Listener", prompt: "Add an event listener!", code: 'btn.addEventListener("click", () => {\n  alert("Clicked!");\n});', explanation: "addEventListener attaches a function to run when an event occurs.", difficulty: "medium" },
    "js-async": { title: "Async/Await", prompt: "Fetch data asynchronously!", code: "const data = await fetch(url);\nconst json = await data.json();", explanation: "async/await makes asynchronous code look synchronous and readable.", difficulty: "medium" },
    "fetch-api": { title: "Fetch API", prompt: "Make an API request!", code: 'const response = await fetch("/api/users");\nconst users = await response.json();', explanation: "fetch() makes HTTP requests and returns a Promise.", difficulty: "medium" },
    "json-handling": { title: "JSON Operations", prompt: "Parse and stringify JSON!", code: 'const obj = JSON.parse(jsonString);\nconst str = JSON.stringify(obj);', explanation: "JSON.parse converts string to object, JSON.stringify converts object to string.", difficulty: "easy" },
    "local-storage": { title: "Local Storage", prompt: "Save data locally!", code: 'localStorage.setItem("theme", "dark");\nconst theme = localStorage.getItem("theme");', explanation: "localStorage persists key-value pairs in the browser.", difficulty: "easy" },
  };

  if (snippets[id]) return snippets[id];

  // Generate based on prefix
  if (id.startsWith("html-")) return { title: `HTML: ${title}`, prompt: `Write HTML for ${title.toLowerCase()}!`, code: `<div class="example">\n  <p>${title}</p>\n</div>`, explanation: `This demonstrates ${title.toLowerCase()} in HTML.`, difficulty: "easy" };
  if (id.startsWith("css-")) return { title: `CSS: ${title}`, prompt: `Write CSS for ${title.toLowerCase()}!`, code: `.example {\n  /* ${title} */\n  display: block;\n}`, explanation: `This demonstrates ${title.toLowerCase()} in CSS.`, difficulty: "easy" };
  if (id.startsWith("js-") || id.startsWith("dom-")) return { title: `JS: ${title}`, prompt: `Write JavaScript for ${title.toLowerCase()}!`, code: `// ${title}\nconsole.log("${title}");`, explanation: `This demonstrates ${title.toLowerCase()} in JavaScript.`, difficulty: "easy" };

  return null;
}

// ======================== GENERIC FALLBACK ========================
function generateGenericSteps(title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`Understanding ${title}`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "An unrelated concept" }, { label: "B", text: desc }, { label: "C", text: "Not applicable to computing" }],
      "B", `${title}: ${desc}.`, "easy"),
    generateTypingStep(`${title} Practice`, `Type a key concept!`,
      `// ${title}: ${desc}`,
      `Understanding ${title.toLowerCase()} is important.`, "easy"),
    generateQuizStep(`${title} Application`, `How is ${title.toLowerCase()} applied?`,
      [{ label: "A", text: "Only in textbooks" }, { label: "B", text: "In real-world computing scenarios" }, { label: "C", text: "It has no practical use" }],
      "B", `${title} has many practical applications in computing and technology.`, "medium"),
  ];
}
