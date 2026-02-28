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
    "what-is-system": [
      generateQuizStep("System Definition", "What is a system?", [{ label: "A", text: "A set of interrelated components working together toward a goal" }, { label: "B", text: "A single computer program" }, { label: "C", text: "Only hardware" }], "A", "A system is a collection of interrelated components that work together to achieve a common purpose."),
      generateQuizStep("System Boundary", "What is a system boundary?", [{ label: "A", text: "The line separating the system from its environment" }, { label: "B", text: "A firewall" }, { label: "C", text: "A backup system" }], "A", "The boundary defines what is inside the system and what is in the external environment."),
      generateTypingStep("System Components", "List system components!", "Input, Process, Output, Feedback", "Every system takes inputs, processes them, produces outputs, and uses feedback for control.", "easy"),
    ],
    "stakeholders": [
      generateQuizStep("Stakeholder Types", "Who is a stakeholder?", [{ label: "A", text: "Anyone affected by or who can affect the system" }, { label: "B", text: "Only the project manager" }, { label: "C", text: "Only the end users" }], "A", "Stakeholders include users, managers, customers, developers, and anyone impacted by the system."),
      generateQuizStep("Power-Interest Matrix", "What does the power-interest matrix show?", [{ label: "A", text: "How to prioritize stakeholders based on power and interest" }, { label: "B", text: "Project costs" }, { label: "C", text: "Technical architecture" }], "A", "High power, high interest stakeholders need close management; low power, low interest need monitoring."),
      generateTypingStep("Stakeholder Categories", "Type the matrix quadrants!", "Manage Closely, Keep Satisfied, Keep Informed, Monitor", "The four quadrants guide how to engage each stakeholder group.", "medium"),
    ],
    "requirements": [
      generateQuizStep("Functional vs Non-Functional", "What is a functional requirement?", [{ label: "A", text: "What the system must DO" }, { label: "B", text: "How fast the system runs" }, { label: "C", text: "The system's color scheme" }], "A", "Functional requirements describe specific behaviors or functions: 'The system shall allow users to log in.'"),
      generateQuizStep("Non-Functional Requirements", "Which is a non-functional requirement?", [{ label: "A", text: "The system shall respond within 2 seconds" }, { label: "B", text: "Users can create accounts" }, { label: "C", text: "Users can upload files" }], "A", "Non-functional requirements describe quality attributes: performance, security, usability, reliability."),
      generateTypingStep("Requirement Format", "Write a requirement!", "The system shall allow users to reset their password via email.", "Requirements use 'shall' for mandatory and 'should' for desirable features.", "medium"),
    ],
    "use-cases": [
      generateQuizStep("Use Case Basics", "What is a use case?", [{ label: "A", text: "A description of system-user interaction" }, { label: "B", text: "A type of database" }, { label: "C", text: "A programming language" }], "A", "Use cases describe how actors interact with a system to achieve goals."),
      generateTypingStep("Actor Definition", "Define an actor!", "Actor: Customer", "Actors are external entities that interact with the system.", "easy"),
      generateQuizStep("Use Case Elements", "What are the two main elements of a use case?", [{ label: "A", text: "Variables and loops" }, { label: "B", text: "Actors and use cases" }, { label: "C", text: "Tables and columns" }], "B", "Use case diagrams show actors (stick figures) and use cases (ovals)."),
      generateTypingStep("Use Case Name", "Write a use case name!", "UC: Place Order", "Use case names should be verb-noun format describing the goal.", "easy"),
      generateQuizStep("Include Relationship", "What does <<include>> mean?", [{ label: "A", text: "Optional behavior" }, { label: "B", text: "Required sub-behavior" }, { label: "C", text: "Error handling" }], "B", "<<include>> means the base use case always includes the sub-behavior."),
    ],
    "user-stories": [
      generateQuizStep("User Story Format", "What is the user story format?", [{ label: "A", text: "As a [role], I want [feature] so that [benefit]" }, { label: "B", text: "If [condition] then [action]" }, { label: "C", text: "Given [state] when [action] then [result]" }], "A", "User stories capture requirements from the user's perspective in a simple template."),
      generateTypingStep("Write a User Story", "Write a user story!", "As a student, I want to track my progress so that I can see my improvement.", "User stories focus on the WHO, WHAT, and WHY of a feature.", "medium"),
      generateQuizStep("Story vs Use Case", "How do user stories differ from use cases?", [{ label: "A", text: "Stories are brief and conversational; use cases are detailed" }, { label: "B", text: "They are identical" }, { label: "C", text: "Stories are more technical" }], "A", "User stories are lightweight placeholders for conversation; use cases provide full detail."),
    ],
    "dfd-intro": [
      generateQuizStep("DFD Purpose", "What does a Data Flow Diagram show?", [{ label: "A", text: "How data moves through a system" }, { label: "B", text: "The physical network layout" }, { label: "C", text: "The project timeline" }], "A", "DFDs show how data flows between processes, stores, and external entities."),
      generateTypingStep("DFD Process", "Name a DFD process!", "Process: Validate Order", "Processes transform input data into output data.", "easy"),
      generateQuizStep("DFD Symbols", "What shape represents a process in a DFD?", [{ label: "A", text: "Rectangle" }, { label: "B", text: "Circle or rounded rectangle" }, { label: "C", text: "Triangle" }], "B", "Processes are shown as circles (Yourdon) or rounded rectangles (Gane-Sarson)."),
      generateQuizStep("DFD Levels", "What is a Context Diagram?", [{ label: "A", text: "The most detailed DFD" }, { label: "B", text: "Level 0 showing the whole system as one process" }, { label: "C", text: "A network diagram" }], "B", "Context diagrams show the entire system as a single process with external entities."),
    ],
    "dfd-levels": [
      generateQuizStep("Context Diagram", "What does a context diagram show?", [{ label: "A", text: "The entire system as a single process with external data flows" }, { label: "B", text: "All internal processes in detail" }, { label: "C", text: "Database tables" }], "A", "The context diagram (Level 0) shows the system boundary and external interactions."),
      generateQuizStep("Level 1 DFD", "What does a Level 1 DFD show?", [{ label: "A", text: "The main processes that make up the system" }, { label: "B", text: "Only the external entities" }, { label: "C", text: "The programming code" }], "A", "Level 1 decomposes the context diagram into its major sub-processes."),
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
      generateTypingStep("User Story", "Write a user story!", "As a customer, I want to view my orders so that I can track deliveries.", "User stories follow the format: As a [role], I want [feature] so that [benefit].", "medium"),
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
    "class-diagrams": [
      generateQuizStep("Class Diagram", "What does a UML class diagram show?", [{ label: "A", text: "Classes with attributes, methods, and relationships" }, { label: "B", text: "Network topology" }, { label: "C", text: "Project timeline" }], "A", "Class diagrams show the static structure of a system: classes, their members, and relationships."),
      generateTypingStep("Class Notation", "Write a class!", "Class: Student\n- name: String\n- age: int\n+ enroll(): void", "Classes have a name, attributes (with types), and methods (with return types).", "medium"),
      generateQuizStep("Visibility", "What does + mean in UML?", [{ label: "A", text: "Public visibility" }, { label: "B", text: "Private" }, { label: "C", text: "Protected" }], "A", "+ is public, - is private, # is protected, ~ is package."),
    ],
    "sequence-diagrams": [
      generateQuizStep("Sequence Purpose", "What do sequence diagrams show?", [{ label: "A", text: "Object interactions in time order" }, { label: "B", text: "Database tables" }, { label: "C", text: "File structure" }], "A", "Sequence diagrams show how objects communicate over time using messages."),
      generateQuizStep("Lifeline", "What is a lifeline in a sequence diagram?", [{ label: "A", text: "A vertical line representing an object's existence over time" }, { label: "B", text: "A data flow" }, { label: "C", text: "A class attribute" }], "A", "Lifelines show when an object exists and is active during the interaction."),
    ],
    "testing-strategies": [
      generateQuizStep("Testing Levels", "What are the main testing levels?", [{ label: "A", text: "Unit, integration, system, acceptance" }, { label: "B", text: "Only manual testing" }, { label: "C", text: "Debug and deploy" }], "A", "Testing progresses from unit (individual components) to acceptance (user validation)."),
      generateQuizStep("UAT", "What is User Acceptance Testing?", [{ label: "A", text: "End users verify the system meets their requirements" }, { label: "B", text: "Developers test their own code" }, { label: "C", text: "Automated security scanning" }], "A", "UAT is the final testing phase where real users verify the system works as expected."),
    ],
    "gantt-charts": [
      generateQuizStep("Gantt Chart", "What does a Gantt chart show?", [{ label: "A", text: "Task schedule with start/end dates as horizontal bars" }, { label: "B", text: "Pie chart of budget" }, { label: "C", text: "Network diagram" }], "A", "Gantt charts visualize project tasks on a timeline, showing dependencies and progress."),
      generateQuizStep("Dependencies", "What is a task dependency?", [{ label: "A", text: "When one task must complete before another can start" }, { label: "B", text: "Two tasks running simultaneously" }, { label: "C", text: "A cancelled task" }], "A", "Finish-to-start is the most common dependency: Task B can't start until Task A finishes."),
    ],
    "critical-path": [
      generateQuizStep("Critical Path", "What is the critical path?", [{ label: "A", text: "The longest sequence of dependent tasks determining project duration" }, { label: "B", text: "The shortest task" }, { label: "C", text: "The cheapest task" }], "A", "The critical path determines the minimum project duration — any delay extends the whole project."),
      generateQuizStep("Float/Slack", "What is float in project management?", [{ label: "A", text: "Time a task can be delayed without affecting the project end date" }, { label: "B", text: "Extra budget" }, { label: "C", text: "Unused staff" }], "A", "Tasks on the critical path have zero float — no room for delay."),
    ],
    "risk-management": [
      generateQuizStep("Risk Definition", "What is a project risk?", [{ label: "A", text: "An uncertain event that could impact project objectives" }, { label: "B", text: "A guaranteed failure" }, { label: "C", text: "A completed task" }], "A", "Risks are potential future events with probability and impact on project success."),
      generateQuizStep("Risk Response", "What are the four risk response strategies?", [{ label: "A", text: "Avoid, mitigate, transfer, accept" }, { label: "B", text: "Ignore, delay, cancel, restart" }, { label: "C", text: "Plan, do, check, act" }], "A", "Avoid eliminates risk, mitigate reduces it, transfer shifts it, accept acknowledges it."),
    ],
    "sdlc-overview": [
      generateQuizStep("SDLC Purpose", "What is the SDLC?", [{ label: "A", text: "A structured framework for developing software systems" }, { label: "B", text: "A programming language" }, { label: "C", text: "A testing tool" }], "A", "The SDLC defines the phases and activities for building quality software systematically."),
      generateQuizStep("SDLC Phases", "What are typical SDLC phases?", [{ label: "A", text: "Planning, analysis, design, implementation, testing, deployment, maintenance" }, { label: "B", text: "Only coding" }, { label: "C", text: "Only testing" }], "A", "Each SDLC phase has specific deliverables that feed into the next phase."),
    ],
    "v-model": [
      generateQuizStep("V-Model Structure", "What is the V-Model?", [{ label: "A", text: "Each development phase has a corresponding testing phase" }, { label: "B", text: "A circular model" }, { label: "C", text: "No testing phase" }], "A", "The V-Model pairs each dev phase (left side) with a test phase (right side): requirements↔acceptance, design↔integration, code↔unit."),
    ],
    "spiral-model": [
      generateQuizStep("Spiral Model", "What drives the spiral model?", [{ label: "A", text: "Risk analysis at each iteration" }, { label: "B", text: "Speed of delivery" }, { label: "C", text: "Customer complaints" }], "A", "The spiral model is risk-driven — each loop involves planning, risk analysis, engineering, and evaluation."),
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
    "twos-complement": [
      generateQuizStep("Two's Complement", "How do you find the two's complement?", [{ label: "A", text: "Invert all bits, then add 1" }, { label: "B", text: "Just flip the first bit" }, { label: "C", text: "Add 2 to the number" }], "A", "Two's complement: flip all bits (one's complement) then add 1."),
      generateQuizStep("Negative Numbers", "What is -5 in 8-bit two's complement?", [{ label: "A", text: "11111011" }, { label: "B", text: "10000101" }, { label: "C", text: "00000101" }], "A", "5 = 00000101 → flip = 11111010 → add 1 = 11111011."),
      generateTypingStep("Two's Complement", "Calculate -3 in 8-bit!", "11111101", "3 = 00000011 → flip = 11111100 → add 1 = 11111101.", "hard"),
    ],
    "demorgans-laws": [
      generateQuizStep("De Morgan's First Law", "What is NOT (A AND B)?", [{ label: "A", text: "(NOT A) OR (NOT B)" }, { label: "B", text: "(NOT A) AND (NOT B)" }, { label: "C", text: "A OR B" }], "A", "De Morgan's: NOT (A AND B) = (NOT A) OR (NOT B). Break the bar, change the sign."),
      generateQuizStep("De Morgan's Second Law", "What is NOT (A OR B)?", [{ label: "A", text: "(NOT A) OR (NOT B)" }, { label: "B", text: "(NOT A) AND (NOT B)" }, { label: "C", text: "A AND B" }], "B", "NOT (A OR B) = (NOT A) AND (NOT B). Break the bar, change the sign."),
    ],
    "sets-basics": [
      generateQuizStep("Set Definition", "What is a set?", [{ label: "A", text: "An unordered collection of unique elements" }, { label: "B", text: "An ordered list" }, { label: "C", text: "A type of array" }], "A", "Sets contain unique elements with no duplicates and no defined order."),
      generateTypingStep("Set Notation", "Write set notation!", "A = {1, 2, 3, 4, 5}", "Sets use curly braces. Elements are listed separated by commas.", "easy"),
    ],
    "set-operations": [
      generateQuizStep("Union", "What is A ∪ B?", [{ label: "A", text: "All elements in A or B or both" }, { label: "B", text: "Only elements in both" }, { label: "C", text: "Elements in A only" }], "A", "Union combines all elements from both sets, removing duplicates."),
      generateQuizStep("Intersection", "What is A ∩ B?", [{ label: "A", text: "All elements in A or B" }, { label: "B", text: "Only elements in both A and B" }, { label: "C", text: "Elements in neither" }], "B", "Intersection returns only elements that appear in both sets."),
    ],
    "probability-basics": [
      generateQuizStep("Probability Range", "What is the range of probability?", [{ label: "A", text: "0 to 1 (or 0% to 100%)" }, { label: "B", text: "-1 to 1" }, { label: "C", text: "0 to infinity" }], "A", "Probability is always between 0 (impossible) and 1 (certain)."),
      generateQuizStep("Coin Flip", "What is P(heads) for a fair coin?", [{ label: "A", text: "0.5 or 1/2" }, { label: "B", text: "0.25" }, { label: "C", text: "1" }], "A", "A fair coin has equal probability: P(heads) = P(tails) = 1/2."),
    ],
    "permutations": [
      generateQuizStep("Permutation Formula", "What is the formula for nPr?", [{ label: "A", text: "n! / (n-r)!" }, { label: "B", text: "n! / r!" }, { label: "C", text: "n × r" }], "A", "nPr = n! / (n-r)! counts ordered arrangements of r items from n."),
      generateQuizStep("3P2", "How many ways to arrange 2 items from 3?", [{ label: "A", text: "6" }, { label: "B", text: "3" }, { label: "C", text: "9" }], "A", "3P2 = 3! / 1! = 6 ways: AB, AC, BA, BC, CA, CB."),
    ],
    "combinations": [
      generateQuizStep("Combination Formula", "What is nCr?", [{ label: "A", text: "n! / (r! × (n-r)!)" }, { label: "B", text: "n! / (n-r)!" }, { label: "C", text: "n × r" }], "A", "nCr = n! / (r! × (n-r)!) counts unordered selections of r items from n."),
      generateQuizStep("5C2", "How many ways to choose 2 from 5?", [{ label: "A", text: "10" }, { label: "B", text: "20" }, { label: "C", text: "25" }], "A", "5C2 = 5! / (2! × 3!) = 120 / 12 = 10."),
    ],
    "bfs": [
      generateQuizStep("BFS", "How does BFS explore a graph?", [{ label: "A", text: "Level by level using a queue" }, { label: "B", text: "Going as deep as possible first" }, { label: "C", text: "Randomly" }], "A", "BFS uses a queue (FIFO) to visit all neighbors at current depth before going deeper."),
      generateQuizStep("BFS Use", "What is BFS best for?", [{ label: "A", text: "Finding the shortest path in unweighted graphs" }, { label: "B", text: "Sorting data" }, { label: "C", text: "Compressing files" }], "A", "BFS guarantees the shortest path in unweighted graphs."),
    ],
    "dfs": [
      generateQuizStep("DFS", "How does DFS explore a graph?", [{ label: "A", text: "Level by level" }, { label: "B", text: "Goes as deep as possible, then backtracks using a stack" }, { label: "C", text: "Alphabetically" }], "B", "DFS uses a stack (LIFO) to explore as deep as possible before backtracking."),
    ],
    "dijkstra": [
      generateQuizStep("Dijkstra's Algorithm", "What does Dijkstra's algorithm find?", [{ label: "A", text: "Shortest path from source to all other nodes in weighted graphs" }, { label: "B", text: "The maximum flow" }, { label: "C", text: "All cycles in a graph" }], "A", "Dijkstra's greedily selects the closest unvisited node and updates distances."),
      generateQuizStep("Dijkstra Limitation", "What is a limitation of Dijkstra's?", [{ label: "A", text: "Cannot handle negative edge weights" }, { label: "B", text: "Only works on trees" }, { label: "C", text: "Very slow for all graphs" }], "A", "Dijkstra's algorithm assumes non-negative weights. Use Bellman-Ford for negative weights."),
    ],
    "mean-median-mode": [
      generateQuizStep("Mean", "How do you calculate the mean?", [{ label: "A", text: "Sum of all values divided by the count" }, { label: "B", text: "The middle value" }, { label: "C", text: "The most frequent value" }], "A", "Mean = sum of values / number of values."),
      generateQuizStep("Median", "What is the median of {1, 3, 5, 7, 9}?", [{ label: "A", text: "3" }, { label: "B", text: "5" }, { label: "C", text: "7" }], "B", "Median is the middle value when sorted. For 5 values, it's the 3rd: 5."),
      generateQuizStep("Mode", "What is the mode?", [{ label: "A", text: "The most frequently occurring value" }, { label: "B", text: "The average" }, { label: "C", text: "The range" }], "A", "Mode is the value that appears most often. A dataset can have multiple modes."),
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
  const topicContent = getBusinessContent(id);
  if (topicContent) return topicContent;

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

function getBusinessContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "bis-intro": [
      generateQuizStep("Business IS", "What is a Business Information System?", [{ label: "A", text: "Technology solutions supporting business operations and decisions" }, { label: "B", text: "A type of computer virus" }, { label: "C", text: "An accounting method" }], "A", "BIS combines technology, people, and processes to support business goals."),
      generateQuizStep("IS Components", "What are the 5 components of an IS?", [{ label: "A", text: "Hardware, software, data, procedures, people" }, { label: "B", text: "CPU, RAM, disk, monitor, keyboard" }, { label: "C", text: "Input, process, output" }], "A", "Every IS consists of hardware, software, data, procedures, and people."),
      generateTypingStep("IS Definition", "Type the definition!", "An information system collects, processes, stores, and distributes information.", "Information systems transform raw data into useful information for decision-making.", "easy"),
    ],
    "info-system-types": [
      generateQuizStep("TPS", "What does a Transaction Processing System do?", [{ label: "A", text: "Records routine business transactions" }, { label: "B", text: "Makes strategic decisions" }, { label: "C", text: "Designs websites" }], "A", "TPS handles high-volume, routine transactions like sales, payroll, and inventory."),
      generateQuizStep("MIS vs DSS", "How does MIS differ from DSS?", [{ label: "A", text: "MIS provides standard reports; DSS supports ad-hoc analysis" }, { label: "B", text: "They are identical" }, { label: "C", text: "DSS replaces MIS" }], "A", "MIS generates routine reports while DSS supports interactive, ad-hoc decision analysis."),
      generateQuizStep("EIS Purpose", "Who uses Executive Information Systems?", [{ label: "A", text: "Junior staff only" }, { label: "B", text: "Senior management for strategic decisions" }, { label: "C", text: "Customers" }], "B", "EIS provides senior executives with dashboards and KPIs for strategic decision-making."),
    ],
    "erp-systems": [
      generateQuizStep("ERP Definition", "What is ERP?", [{ label: "A", text: "An integrated system managing core business processes" }, { label: "B", text: "An email provider" }, { label: "C", text: "A social media platform" }], "A", "ERP integrates finance, HR, manufacturing, supply chain, and more into one system."),
      generateQuizStep("ERP Benefits", "What is a key benefit of ERP?", [{ label: "A", text: "Single source of truth across departments" }, { label: "B", text: "Cheaper internet" }, { label: "C", text: "Faster email" }], "A", "ERP eliminates data silos by providing one integrated database for all departments."),
      generateTypingStep("ERP Modules", "List common ERP modules!", "Finance, HR, Manufacturing, Supply Chain, CRM", "ERP systems typically include modules for each major business function.", "easy"),
      generateQuizStep("ERP Vendors", "Which are major ERP vendors?", [{ label: "A", text: "SAP, Oracle, Microsoft Dynamics" }, { label: "B", text: "Instagram, Twitter" }, { label: "C", text: "Windows, macOS" }], "A", "SAP, Oracle, and Microsoft Dynamics are the top enterprise ERP providers."),
    ],
    "e-commerce": [
      generateQuizStep("E-Commerce Models", "What does B2C mean?", [{ label: "A", text: "Business-to-Consumer" }, { label: "B", text: "Bytes-to-Code" }, { label: "C", text: "Back-to-Cloud" }], "A", "B2C is when businesses sell directly to individual consumers, like Amazon or Shopify stores."),
      generateQuizStep("B2B vs B2C", "How does B2B differ from B2C?", [{ label: "A", text: "B2B sells to other businesses; B2C sells to individuals" }, { label: "B", text: "B2B is always cheaper" }, { label: "C", text: "They are the same" }], "A", "B2B involves business-to-business transactions, often with larger order values and longer sales cycles."),
      generateTypingStep("E-Commerce Model", "Type the e-commerce models!", "B2B, B2C, C2C, C2B", "The four main models: Business-to-Business, Business-to-Consumer, Consumer-to-Consumer, Consumer-to-Business.", "easy"),
    ],
    "cloud-computing": [
      generateQuizStep("Cloud Definition", "What is cloud computing?", [{ label: "A", text: "On-demand delivery of computing resources over the internet" }, { label: "B", text: "Storing files on a USB drive" }, { label: "C", text: "A type of weather system" }], "A", "Cloud computing provides on-demand access to servers, storage, databases, and applications via the internet."),
      generateQuizStep("Cloud Models", "What are IaaS, PaaS, SaaS?", [{ label: "A", text: "Infrastructure, Platform, Software as a Service" }, { label: "B", text: "Internet, Phone, System as a Service" }, { label: "C", text: "Types of programming languages" }], "A", "IaaS provides virtual machines, PaaS provides development platforms, SaaS provides ready-to-use applications."),
      generateTypingStep("Cloud Providers", "Name the big 3 cloud providers!", "AWS, Microsoft Azure, Google Cloud Platform", "These three providers dominate the cloud market with 60%+ market share.", "easy"),
    ],
    "cloud-models": [
      generateQuizStep("IaaS Examples", "Which is an IaaS example?", [{ label: "A", text: "AWS EC2 — virtual machines you configure" }, { label: "B", text: "Gmail" }, { label: "C", text: "Slack" }], "A", "IaaS provides raw computing infrastructure — you manage OS, middleware, and applications."),
      generateQuizStep("SaaS Examples", "Which is a SaaS application?", [{ label: "A", text: "Google Docs — ready-to-use software" }, { label: "B", text: "A physical server" }, { label: "C", text: "Linux kernel" }], "A", "SaaS delivers complete applications over the internet — no installation needed."),
    ],
    "data-management": [
      generateQuizStep("Data vs Information", "How does data differ from information?", [{ label: "A", text: "Data is raw facts; information is processed, meaningful data" }, { label: "B", text: "They are identical" }, { label: "C", text: "Information comes before data" }], "A", "Data becomes information when it is organized, processed, and given context."),
      generateQuizStep("Data Quality", "What makes data high quality?", [{ label: "A", text: "Accurate, complete, consistent, timely" }, { label: "B", text: "Large file size" }, { label: "C", text: "Stored on expensive hardware" }], "A", "Data quality is measured by accuracy, completeness, consistency, and timeliness."),
    ],
    "project-management": [
      generateQuizStep("Triple Constraint", "What is the project management triple constraint?", [{ label: "A", text: "Scope, time, cost (and quality)" }, { label: "B", text: "Speed, size, strength" }, { label: "C", text: "Code, test, deploy" }], "A", "The triple constraint balances scope, time, and cost — changing one affects the others."),
      generateQuizStep("Project Lifecycle", "What are the PM phases?", [{ label: "A", text: "Initiation, planning, execution, monitoring, closing" }, { label: "B", text: "Just coding and testing" }, { label: "C", text: "Design and deployment only" }], "A", "Projects follow a lifecycle from initiation through planning, execution, monitoring, to closure."),
    ],
    "blockchain": [
      generateQuizStep("Blockchain Basics", "What is a blockchain?", [{ label: "A", text: "A distributed, immutable ledger of transactions" }, { label: "B", text: "A type of database backup" }, { label: "C", text: "An encryption algorithm" }], "A", "Blockchain is a chain of blocks, each containing transactions, linked by cryptographic hashes."),
      generateQuizStep("Decentralization", "Why is blockchain decentralized?", [{ label: "A", text: "No single authority controls it — copies exist on many nodes" }, { label: "B", text: "It only runs on one server" }, { label: "C", text: "It requires internet" }], "A", "Decentralization means no single point of failure and no single point of control."),
    ],
    "is-strategy": [
      generateQuizStep("Strategic Alignment", "What is IS strategic alignment?", [{ label: "A", text: "Ensuring IT investments support business goals" }, { label: "B", text: "Buying the latest hardware" }, { label: "C", text: "Hiring more developers" }], "A", "Strategic alignment ensures technology decisions directly support business objectives."),
      generateQuizStep("Competitive Advantage", "How can IS provide competitive advantage?", [{ label: "A", text: "Through innovation, efficiency, and better customer service" }, { label: "B", text: "By spending more money" }, { label: "C", text: "Only through cost cutting" }], "A", "IS creates competitive advantage through process efficiency, innovation, and enhanced customer experience."),
    ],
    "crm-basics": [
      generateQuizStep("CRM Purpose", "What is the purpose of CRM?", [{ label: "A", text: "Managing interactions and relationships with customers" }, { label: "B", text: "Writing code" }, { label: "C", text: "Network administration" }], "A", "CRM systems track customer interactions across sales, marketing, and service touchpoints."),
      generateQuizStep("CRM Benefits", "What benefit does CRM provide?", [{ label: "A", text: "360-degree view of customers, improved retention" }, { label: "B", text: "Faster internet" }, { label: "C", text: "Free software" }], "A", "CRM gives a complete customer view, improving personalization and retention rates."),
    ],
    "digital-transformation": [
      generateQuizStep("Digital Transformation", "What is digital transformation?", [{ label: "A", text: "Fundamentally changing business operations using digital technology" }, { label: "B", text: "Buying a new computer" }, { label: "C", text: "Creating a website" }], "A", "Digital transformation reimagines how a business operates and delivers value using technology."),
      generateQuizStep("DX Pillars", "What are the pillars of digital transformation?", [{ label: "A", text: "Customer experience, operational processes, business models" }, { label: "B", text: "Hardware, software, data" }, { label: "C", text: "Sales, marketing, support" }], "A", "DX transforms customer experience, internal operations, and business models simultaneously."),
    ],
    "big-data": [
      generateQuizStep("5 Vs of Big Data", "What are the 5 Vs of Big Data?", [{ label: "A", text: "Volume, Velocity, Variety, Veracity, Value" }, { label: "B", text: "Variables, Values, Vectors, Views, Versions" }, { label: "C", text: "Virtual, Visual, Vocal, Vital, Valid" }], "A", "The 5 Vs define big data: Volume (size), Velocity (speed), Variety (types), Veracity (accuracy), Value (usefulness)."),
      generateTypingStep("Big Data Tools", "Name big data technologies!", "Hadoop, Spark, Kafka, MongoDB", "These technologies process and store massive datasets that traditional databases can't handle.", "medium"),
    ],
  };
  return content[id] || null;
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
  const topicContent = getWebContent(id);
  if (topicContent) return topicContent;

  // Fallback with code snippet
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

function getWebContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    // ===== Introduction =====
    "web-intro": [
      generateQuizStep("How the Web Works", "What protocol powers the World Wide Web?", [{ label: "A", text: "FTP" }, { label: "B", text: "HTTP/HTTPS" }, { label: "C", text: "SMTP" }], "B", "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web."),
      generateQuizStep("Client-Server", "In web architecture, what is the client?", [{ label: "A", text: "The server that hosts files" }, { label: "B", text: "The browser that requests and displays pages" }, { label: "C", text: "The database" }], "B", "The client (browser) sends requests to servers and renders the responses."),
      generateTypingStep("URL Structure", "Type a URL!", "https://www.example.com/page?id=1", "URLs have protocol, domain, path, and optional query parameters.", "easy"),
    ],
    "web-architecture": [
      generateQuizStep("Client-Server Model", "What is the client-server model?", [{ label: "A", text: "Clients request resources, servers provide them" }, { label: "B", text: "All computers are equal" }, { label: "C", text: "Only one computer exists" }], "A", "In client-server architecture, clients initiate requests and servers process and respond to them."),
      generateQuizStep("Frontend vs Backend", "What is frontend development?", [{ label: "A", text: "Database management" }, { label: "B", text: "Building the user interface users see and interact with" }, { label: "C", text: "Server configuration" }], "B", "Frontend = what users see (HTML/CSS/JS). Backend = server logic, databases, APIs."),
    ],
    "http-basics": [
      generateQuizStep("HTTP Methods", "Which HTTP method retrieves data?", [{ label: "A", text: "POST" }, { label: "B", text: "GET" }, { label: "C", text: "DELETE" }], "B", "GET requests retrieve data without modifying it. POST sends data to create/update resources."),
      generateQuizStep("Status Codes", "What does HTTP 404 mean?", [{ label: "A", text: "Server error" }, { label: "B", text: "Not Found" }, { label: "C", text: "Success" }], "B", "404 = Not Found. 200 = OK. 301 = Redirect. 500 = Server Error."),
      generateTypingStep("HTTP Request", "Type an HTTP method!", "GET /api/users HTTP/1.1", "HTTP requests specify method, path, and protocol version.", "medium"),
    ],
    // ===== HTML Essentials =====
    "html-intro": [
      generateQuizStep("HTML Purpose", "What does HTML stand for?", [{ label: "A", text: "HyperText Markup Language" }, { label: "B", text: "High Tech Modern Language" }, { label: "C", text: "Home Tool Markup Language" }], "A", "HTML is the standard markup language for creating web pages."),
      generateQuizStep("HTML Elements", "What are HTML elements made of?", [{ label: "A", text: "Opening tag, content, closing tag" }, { label: "B", text: "Only text" }, { label: "C", text: "Only images" }], "A", "Most HTML elements have an opening tag, content, and closing tag: <p>content</p>"),
      generateTypingStep("Paragraph", "Create a paragraph!", "<p>Hello, World!</p>", "The <p> tag defines a paragraph of text.", "easy"),
    ],
    "html-structure": [
      generateQuizStep("DOCTYPE", "What does <!DOCTYPE html> declare?", [{ label: "A", text: "That the document is HTML5" }, { label: "B", text: "A comment" }, { label: "C", text: "A variable" }], "A", "DOCTYPE tells the browser this is an HTML5 document."),
      generateTypingStep("HTML Document", "Create an HTML structure!", "<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", "Every HTML document starts with DOCTYPE and has head and body sections.", "easy"),
    ],
    "html-text": [
      generateQuizStep("Heading Hierarchy", "Which heading is the largest?", [{ label: "A", text: "<h6>" }, { label: "B", text: "<h1>" }, { label: "C", text: "<h3>" }], "B", "h1 is the largest heading, h6 is the smallest. Use only one h1 per page."),
      generateTypingStep("Heading Element", "Create a heading!", "<h1>Welcome to My Page</h1>", "h1 is the largest heading. Use h1-h6 for hierarchy.", "easy"),
    ],
    "html-links": [
      generateQuizStep("Anchor Tag", "Which attribute specifies the URL in a link?", [{ label: "A", text: "src" }, { label: "B", text: "href" }, { label: "C", text: "link" }], "B", "The href attribute specifies the destination URL of a hyperlink."),
      generateTypingStep("Hyperlink", "Create a link!", '<a href="https://example.com">Visit</a>', "The <a> tag creates clickable hyperlinks to other pages.", "easy"),
    ],
    "html-images": [
      generateQuizStep("Alt Attribute", "Why is the alt attribute important on images?", [{ label: "A", text: "It makes images bigger" }, { label: "B", text: "Screen readers use it for accessibility" }, { label: "C", text: "It's optional decoration" }], "B", "Alt text provides description for screen readers and displays when images fail to load."),
      generateTypingStep("Image Element", "Add an image!", '<img src="photo.jpg" alt="A photo">', "Always include alt text for accessibility.", "easy"),
    ],
    "html-lists": [
      generateTypingStep("Unordered List", "Create a list!", "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>", "<ul> creates bullet points, <ol> creates numbered lists.", "easy"),
      generateQuizStep("List Types", "Which creates a numbered list?", [{ label: "A", text: "<ul>" }, { label: "B", text: "<ol>" }, { label: "C", text: "<dl>" }], "B", "<ol> creates ordered (numbered) lists. <ul> creates unordered (bullet) lists."),
    ],
    "html-tables": [
      generateTypingStep("HTML Table", "Create a table!", "<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Alice</td><td>25</td></tr>\n</table>", "<tr> = table row, <th> = header cell, <td> = data cell.", "medium"),
      generateQuizStep("Table Elements", "What does <th> create?", [{ label: "A", text: "A table header cell (bold, centered)" }, { label: "B", text: "A table row" }, { label: "C", text: "A table footer" }], "A", "<th> creates header cells, which are bold and centered by default."),
    ],
    // ===== CSS =====
    "css-intro": [
      generateQuizStep("CSS Purpose", "What does CSS stand for?", [{ label: "A", text: "Cascading Style Sheets" }, { label: "B", text: "Computer Style System" }, { label: "C", text: "Creative Style Syntax" }], "A", "CSS controls the visual presentation of HTML elements."),
      generateTypingStep("Basic CSS", "Write a CSS rule!", "p {\n  color: blue;\n  font-size: 16px;\n}", "CSS rules have a selector, property, and value.", "easy"),
    ],
    "css-selectors": [
      generateTypingStep("CSS Class Selector", "Style a class!", ".highlight {\n  color: blue;\n  font-weight: bold;\n}", "Class selectors target elements with a specific class attribute.", "easy"),
      generateQuizStep("Specificity", "Which selector has highest specificity?", [{ label: "A", text: "Element (p)" }, { label: "B", text: "Class (.btn)" }, { label: "C", text: "ID (#header)" }], "C", "Specificity order: ID > Class > Element. Inline styles override all."),
    ],
    "css-colors": [
      generateTypingStep("CSS Colors", "Set colors!", "body {\n  color: #333;\n  background-color: rgb(240, 240, 245);\n}", "Colors can be hex (#333), rgb(), hsl(), or named values.", "easy"),
      generateQuizStep("Color Formats", "Which is a valid CSS color format?", [{ label: "A", text: "hsl(200, 80%, 50%)" }, { label: "B", text: "color(200)" }, { label: "C", text: "rgb(300, 100, 50)" }], "A", "HSL uses hue (0-360), saturation (0-100%), lightness (0-100%)."),
    ],
    "css-text": [
      generateTypingStep("Text Styling", "Style text!", ".title {\n  font-family: Arial, sans-serif;\n  font-size: 24px;\n  text-align: center;\n}", "font-family sets the typeface, font-size controls size.", "easy"),
      generateQuizStep("Font Properties", "What does font-weight: bold do?", [{ label: "A", text: "Makes text italic" }, { label: "B", text: "Makes text thicker/bolder" }, { label: "C", text: "Changes text color" }], "B", "font-weight controls thickness: normal (400), bold (700), or numeric values."),
    ],
    "css-box-model": [
      generateTypingStep("Box Model", "Apply box model properties!", ".card {\n  margin: 20px;\n  padding: 16px;\n  border: 1px solid #ccc;\n}", "The box model: content → padding → border → margin.", "medium"),
      generateQuizStep("Box Sizing", "What does box-sizing: border-box do?", [{ label: "A", text: "Includes padding and border in the element's total width/height" }, { label: "B", text: "Removes all borders" }, { label: "C", text: "Makes the box invisible" }], "A", "border-box makes width/height include padding and border, preventing layout overflow."),
    ],
    "css-display": [
      generateQuizStep("Display Values", "What does display: none do?", [{ label: "A", text: "Hides element but keeps space" }, { label: "B", text: "Removes element from layout entirely" }, { label: "C", text: "Makes element transparent" }], "B", "display: none removes the element. visibility: hidden hides it but keeps the space."),
      generateTypingStep("Display Property", "Set display types!", ".inline { display: inline; }\n.block { display: block; }\n.flex { display: flex; }", "Block takes full width. Inline flows with text. Flex enables flexible layouts.", "medium"),
    ],
    // ===== CSS Advanced =====
    "css-flexbox": [
      generateTypingStep("Flexbox Container", "Create a flex layout!", ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}", "Flexbox provides powerful one-dimensional layout capabilities.", "medium"),
      generateQuizStep("Flex Direction", "What does flex-direction: column do?", [{ label: "A", text: "Stacks items vertically" }, { label: "B", text: "Stacks items horizontally" }, { label: "C", text: "Hides items" }], "A", "flex-direction: column stacks flex items top-to-bottom instead of left-to-right."),
      generateQuizStep("Justify vs Align", "What does justify-content control in a row?", [{ label: "A", text: "Vertical alignment" }, { label: "B", text: "Horizontal distribution" }, { label: "C", text: "Font size" }], "B", "justify-content distributes items along the main axis (horizontal in row)."),
    ],
    "css-grid": [
      generateTypingStep("CSS Grid Layout", "Create a grid!", ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n}", "CSS Grid enables two-dimensional layouts with rows and columns.", "medium"),
      generateQuizStep("Grid vs Flexbox", "When should you use Grid over Flexbox?", [{ label: "A", text: "For two-dimensional layouts (rows AND columns)" }, { label: "B", text: "For one-dimensional layouts" }, { label: "C", text: "Never" }], "A", "Grid excels at 2D layouts. Flexbox is better for 1D (row OR column)."),
    ],
    "css-positioning": [
      generateQuizStep("Position Values", "What does position: absolute do?", [{ label: "A", text: "Positions relative to nearest positioned ancestor" }, { label: "B", text: "Stays in normal flow" }, { label: "C", text: "Fixed to viewport" }], "A", "absolute removes from flow and positions relative to the nearest positioned ancestor."),
      generateTypingStep("Fixed Position", "Create a fixed header!", ".header {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}", "Fixed elements stay in place when scrolling.", "medium"),
    ],
    "css-responsive": [
      generateTypingStep("Media Query", "Write a media query!", "@media (max-width: 768px) {\n  .sidebar {\n    display: none;\n  }\n}", "Media queries apply styles based on screen size for responsive design.", "medium"),
      generateQuizStep("Mobile First", "What is mobile-first design?", [{ label: "A", text: "Write base styles for mobile, then add media queries for larger screens" }, { label: "B", text: "Only support mobile" }, { label: "C", text: "Desktop design only" }], "A", "Mobile-first uses min-width media queries to progressively enhance for larger screens."),
    ],
    "css-animations": [
      generateTypingStep("CSS Animation", "Create an animation!", "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.element { animation: fadeIn 0.3s; }", "@keyframes defines the animation, then apply it with the animation property.", "medium"),
      generateQuizStep("Transition vs Animation", "When use transitions vs animations?", [{ label: "A", text: "Transitions for state changes, animations for complex sequences" }, { label: "B", text: "They are identical" }, { label: "C", text: "Never use animations" }], "A", "Transitions animate between two states (hover). Animations can have multiple keyframes."),
    ],
    "css-transforms": [
      generateTypingStep("CSS Transform", "Apply transforms!", ".card:hover {\n  transform: scale(1.05) rotate(2deg);\n  transition: transform 0.3s;\n}", "Transform modifies an element's visual rendering without affecting layout.", "medium"),
      generateQuizStep("Transform Functions", "Which is NOT a transform function?", [{ label: "A", text: "rotate()" }, { label: "B", text: "scale()" }, { label: "C", text: "color()" }], "C", "Common transforms: translate(), rotate(), scale(), skew(). color() is not a transform."),
    ],
    "css-variables": [
      generateTypingStep("CSS Custom Properties", "Use CSS variables!", ":root {\n  --primary: #3b82f6;\n}\n.btn {\n  background: var(--primary);\n}", "CSS variables (custom properties) enable reusable, themeable values.", "medium"),
      generateQuizStep("Variable Scope", "Where should you define global CSS variables?", [{ label: "A", text: "On :root pseudo-class" }, { label: "B", text: "On body only" }, { label: "C", text: "In JavaScript" }], "A", ":root targets the document root, making variables available everywhere."),
    ],
    "css-pseudo": [
      generateTypingStep("Pseudo-classes", "Use pseudo-classes!", "a:hover {\n  color: red;\n}\na:visited {\n  color: purple;\n}", "Pseudo-classes style elements based on state (:hover, :focus, :active).", "medium"),
      generateQuizStep("::before vs :before", "What do pseudo-elements create?", [{ label: "A", text: "Virtual elements for decorative content" }, { label: "B", text: "Real HTML elements" }, { label: "C", text: "JavaScript variables" }], "A", "::before and ::after create virtual elements for decorative content via CSS."),
    ],
    // ===== JavaScript =====
    "js-intro": [
      generateQuizStep("JavaScript Role", "What is JavaScript's role in web development?", [{ label: "A", text: "Styling pages" }, { label: "B", text: "Adding interactivity and dynamic behavior" }, { label: "C", text: "Structuring content" }], "B", "JS adds interactivity. HTML = structure, CSS = style, JS = behavior."),
      generateTypingStep("Hello World", "Write your first JS!", 'console.log("Hello, World!");', "console.log() outputs messages to the browser's developer console.", "easy"),
    ],
    "js-variables": [
      generateTypingStep("JavaScript Variables", "Declare variables!", 'const name = "JavaScript";\nlet count = 0;', "Use const for values that don't change, let for variables that do.", "easy"),
      generateQuizStep("const vs let", "What happens if you reassign a const?", [{ label: "A", text: "It works fine" }, { label: "B", text: "TypeError: Assignment to constant variable" }, { label: "C", text: "The value becomes undefined" }], "B", "const prevents reassignment. Use let when the value needs to change."),
    ],
    "js-operators": [
      generateQuizStep("Strict Equality", "What does === check?", [{ label: "A", text: "Value only" }, { label: "B", text: "Value AND type" }, { label: "C", text: "Type only" }], "B", "=== checks both value and type. == only checks value (with coercion). Always prefer ===."),
      generateTypingStep("Operators", "Use comparison operators!", 'const isEqual = (5 === "5"); // false\nconst isLoose = (5 == "5"); // true', "=== is strict (no coercion), == is loose (with coercion).", "easy"),
    ],
    "js-control-flow": [
      generateTypingStep("If Statement", "Write a conditional!", 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}', "if/else controls which code runs based on conditions.", "easy"),
      generateQuizStep("Falsy Values", "Which is a falsy value in JS?", [{ label: "A", text: '""' }, { label: "B", text: '"false"' }, { label: "C", text: "[]" }], "A", 'Falsy values: false, 0, "", null, undefined, NaN. Empty string is falsy!'),
    ],
    "js-functions": [
      generateTypingStep("Arrow Function", "Write an arrow function!", "const greet = (name) => `Hello, ${name}!`;", "Arrow functions provide concise syntax for function expressions.", "easy"),
      generateQuizStep("Function Types", "What is a callback function?", [{ label: "A", text: "A function passed as an argument to another function" }, { label: "B", text: "A function that calls itself" }, { label: "C", text: "A function with no parameters" }], "A", "Callbacks are functions passed to other functions, executed later (e.g., event handlers)."),
    ],
    "js-arrays": [
      generateTypingStep("Array Methods", "Use array methods!", "const doubled = nums.map(n => n * 2);", "map() creates a new array by transforming each element.", "medium"),
      generateQuizStep("Filter vs Map", "What does filter() return?", [{ label: "A", text: "A new array with only elements that pass the test" }, { label: "B", text: "A single value" }, { label: "C", text: "The same array modified" }], "A", "filter() returns elements where the callback returns true. map() transforms each element."),
      generateTypingStep("Array Chaining", "Chain array methods!", "const result = data\n  .filter(x => x > 0)\n  .map(x => x * 2)\n  .reduce((a, b) => a + b, 0);", "Chaining methods processes data in a readable pipeline.", "hard"),
    ],
    "js-objects": [
      generateTypingStep("JavaScript Object", "Create an object!", 'const user = {\n  name: "Alice",\n  age: 25,\n  greet() { return `Hi, I am ${this.name}`; }\n};', "Objects store data as key-value pairs with optional methods.", "medium"),
      generateQuizStep("Destructuring", "What does destructuring do?", [{ label: "A", text: "Deletes object properties" }, { label: "B", text: "Extracts values into variables" }, { label: "C", text: "Creates a copy" }], "B", "Destructuring: const { name, age } = user; extracts properties into variables."),
    ],
    // ===== Advanced JS =====
    "dom-intro": [
      generateQuizStep("DOM Definition", "What is the DOM?", [{ label: "A", text: "A tree-like representation of the HTML document" }, { label: "B", text: "A CSS framework" }, { label: "C", text: "A JavaScript library" }], "A", "The DOM is a programming interface representing the page as a tree of objects."),
      generateTypingStep("DOM Access", "Access the DOM!", 'const title = document.getElementById("main-title");', "document is the entry point to the DOM API.", "easy"),
    ],
    "dom-selection": [
      generateTypingStep("DOM Selection", "Select an element!", 'const btn = document.querySelector(".btn");', "querySelector selects the first element matching a CSS selector.", "easy"),
      generateQuizStep("querySelectorAll", "What does querySelectorAll return?", [{ label: "A", text: "A single element" }, { label: "B", text: "A NodeList of all matching elements" }, { label: "C", text: "An array" }], "B", "querySelectorAll returns a NodeList. Use forEach or Array.from() to iterate."),
    ],
    "dom-manipulation": [
      generateTypingStep("DOM Manipulation", "Create and add an element!", 'const div = document.createElement("div");\ndiv.textContent = "Hello";\ndocument.body.appendChild(div);', "createElement creates a new element, appendChild adds it to the page.", "medium"),
      generateQuizStep("innerHTML vs textContent", "Which is safer to prevent XSS?", [{ label: "A", text: "innerHTML" }, { label: "B", text: "textContent" }, { label: "C", text: "Both are equal" }], "B", "textContent sets plain text (safe). innerHTML parses HTML (XSS risk with user input)."),
    ],
    "js-events": [
      generateTypingStep("Event Listener", "Add an event listener!", 'btn.addEventListener("click", () => {\n  alert("Clicked!");\n});', "addEventListener attaches a function to run when an event occurs.", "medium"),
      generateQuizStep("Event Bubbling", "What is event bubbling?", [{ label: "A", text: "Events propagate from target up to ancestors" }, { label: "B", text: "Events only fire on the target" }, { label: "C", text: "Events propagate downward" }], "A", "Events bubble up: click on button → div → body → document. Use stopPropagation() to stop."),
    ],
    "js-async": [
      generateTypingStep("Async/Await", "Fetch data asynchronously!", "const data = await fetch(url);\nconst json = await data.json();", "async/await makes asynchronous code look synchronous and readable.", "medium"),
      generateQuizStep("Promise States", "What are the three Promise states?", [{ label: "A", text: "Pending, fulfilled, rejected" }, { label: "B", text: "Start, middle, end" }, { label: "C", text: "Open, closed, error" }], "A", "Promises start pending, then resolve to fulfilled (success) or rejected (error)."),
      generateTypingStep("Try/Catch", "Handle async errors!", "try {\n  const res = await fetch(url);\n  const data = await res.json();\n} catch (err) {\n  console.error(err);\n}", "Always wrap await calls in try/catch to handle network errors.", "medium"),
    ],
    "fetch-api": [
      generateTypingStep("Fetch API", "Make an API request!", 'const response = await fetch("/api/users");\nconst users = await response.json();', "fetch() makes HTTP requests and returns a Promise.", "medium"),
      generateQuizStep("POST Request", "How do you send data with fetch?", [{ label: "A", text: 'fetch(url, { method: "POST", body: JSON.stringify(data) })' }, { label: "B", text: "fetch.post(url, data)" }, { label: "C", text: "fetch(url, data)" }], "A", "POST requests need method, body, and usually Content-Type headers."),
    ],
    "json-handling": [
      generateTypingStep("JSON Operations", "Parse and stringify JSON!", 'const obj = JSON.parse(jsonString);\nconst str = JSON.stringify(obj);', "JSON.parse converts string to object, JSON.stringify converts object to string.", "easy"),
      generateQuizStep("JSON Format", "Which is valid JSON?", [{ label: "A", text: '{"name": "Alice", "age": 25}' }, { label: "B", text: "{name: 'Alice'}" }, { label: "C", text: "{'name': 'Alice'}" }], "A", "JSON requires double quotes for keys and string values. No trailing commas."),
    ],
    "local-storage": [
      generateTypingStep("Local Storage", "Save data locally!", 'localStorage.setItem("theme", "dark");\nconst theme = localStorage.getItem("theme");', "localStorage persists key-value pairs in the browser.", "easy"),
      generateQuizStep("Storage Limits", "How much data can localStorage hold?", [{ label: "A", text: "~5-10 MB per origin" }, { label: "B", text: "Unlimited" }, { label: "C", text: "1 KB" }], "A", "localStorage holds ~5-10 MB per origin. Use IndexedDB for larger datasets."),
    ],
    "form-validation": [
      generateTypingStep("Form Validation", "Validate an input!", 'const email = input.value;\nif (!email.includes("@")) {\n  showError("Invalid email");\n}', "Client-side validation provides instant feedback before server submission.", "medium"),
      generateQuizStep("HTML5 Validation", "Which attribute makes a field required?", [{ label: "A", text: "required" }, { label: "B", text: "mandatory" }, { label: "C", text: "validate" }], "A", "The required attribute prevents form submission if the field is empty."),
    ],
    // ===== Modern Frameworks =====
    "typescript-intro": [
      generateQuizStep("TypeScript Purpose", "What is TypeScript?", [{ label: "A", text: "A typed superset of JavaScript that compiles to JS" }, { label: "B", text: "A completely different language" }, { label: "C", text: "A CSS framework" }], "A", "TypeScript adds static types to JavaScript, catching errors at compile time."),
      generateTypingStep("TypeScript Variable", "Add types to variables!", 'const name: string = "Alice";\nconst age: number = 25;\nconst active: boolean = true;', "TypeScript uses : type annotations after variable names.", "easy"),
      generateQuizStep("TS Benefits", "What is the main benefit of TypeScript?", [{ label: "A", text: "Faster runtime performance" }, { label: "B", text: "Catch type errors before runtime" }, { label: "C", text: "Smaller file sizes" }], "B", "TypeScript catches bugs at compile time that JavaScript only finds at runtime."),
    ],
    "ts-types": [
      generateTypingStep("Interface", "Define an interface!", "interface User {\n  name: string;\n  age: number;\n  email?: string;\n}", "Interfaces define the shape of objects. ? makes properties optional.", "medium"),
      generateQuizStep("Generics", "What are generics in TypeScript?", [{ label: "A", text: "Types that work with multiple types parameterically" }, { label: "B", text: "Generic error messages" }, { label: "C", text: "Default values" }], "A", "Generics like Array<T> let you write reusable code that works with any type."),
      generateTypingStep("Generic Function", "Write a generic!", "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}", "T is a type parameter — replaced with the actual type when called.", "hard"),
    ],
    "react-intro": [
      generateQuizStep("React Purpose", "What is React?", [{ label: "A", text: "A JavaScript library for building user interfaces with components" }, { label: "B", text: "A CSS framework" }, { label: "C", text: "A database" }], "A", "React builds UIs from reusable components using a virtual DOM for efficient updates."),
      generateTypingStep("React Component", "Create a React component!", "function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}", "Components are functions that return JSX — a syntax extension mixing HTML with JS.", "medium"),
      generateQuizStep("Virtual DOM", "What is the Virtual DOM?", [{ label: "A", text: "A lightweight copy of the real DOM for efficient diffing and updates" }, { label: "B", text: "A hidden HTML page" }, { label: "C", text: "A browser extension" }], "A", "React compares virtual DOM snapshots to minimize actual DOM changes (reconciliation)."),
      generateQuizStep("JSX", "What is JSX?", [{ label: "A", text: "A syntax extension that lets you write HTML-like code in JavaScript" }, { label: "B", text: "A new programming language" }, { label: "C", text: "A testing framework" }], "A", "JSX compiles to React.createElement() calls. It's syntactic sugar for creating elements."),
    ],
    "react-hooks": [
      generateTypingStep("useState Hook", "Manage component state!", "const [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>\n);", "useState returns [currentValue, setterFunction]. Call setter to re-render.", "medium"),
      generateQuizStep("useEffect Purpose", "What does useEffect do?", [{ label: "A", text: "Runs side effects after render (API calls, subscriptions, DOM updates)" }, { label: "B", text: "Creates new components" }, { label: "C", text: "Styles elements" }], "A", "useEffect handles side effects. The dependency array controls when it re-runs."),
      generateTypingStep("useEffect", "Fetch data on mount!", "useEffect(() => {\n  fetch('/api/data')\n    .then(r => r.json())\n    .then(setData);\n}, []);", "Empty dependency array [] means run once on mount.", "medium"),
      generateQuizStep("Rules of Hooks", "Where can you call hooks?", [{ label: "A", text: "Only at the top level of function components" }, { label: "B", text: "Inside loops and conditions" }, { label: "C", text: "In regular functions" }], "A", "Hooks must be called at the top level — never inside loops, conditions, or nested functions."),
    ],
    "react-state": [
      generateQuizStep("State Management", "When should you use global state?", [{ label: "A", text: "When multiple distant components need the same data" }, { label: "B", text: "For every piece of data" }, { label: "C", text: "Never" }], "A", "Use global state (Context, Redux) when data is needed by many components at different levels."),
      generateTypingStep("Context API", "Create a context!", "const ThemeContext = createContext('light');\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Page />\n    </ThemeContext.Provider>\n  );\n}", "Context avoids prop drilling by making data available to the entire tree.", "medium"),
      generateQuizStep("Prop Drilling", "What is prop drilling?", [{ label: "A", text: "Passing props through many intermediate components" }, { label: "B", text: "Drilling holes in hardware" }, { label: "C", text: "A testing technique" }], "A", "Prop drilling passes data through components that don't use it. Context/Redux solves this."),
    ],
    "nextjs-intro": [
      generateQuizStep("Next.js Purpose", "What does Next.js add to React?", [{ label: "A", text: "Server-side rendering, routing, API routes, and full-stack capabilities" }, { label: "B", text: "Only styling" }, { label: "C", text: "Database management" }], "A", "Next.js extends React with SSR, SSG, file-based routing, and API routes."),
      generateQuizStep("SSR vs SSG", "What is the difference between SSR and SSG?", [{ label: "A", text: "SSR renders per request; SSG pre-builds at build time" }, { label: "B", text: "They are identical" }, { label: "C", text: "SSG is slower" }], "A", "SSR = fresh HTML per request. SSG = HTML generated at build time (faster, cacheable)."),
      generateTypingStep("Next.js Page", "Create a Next.js page!", "export default function Home() {\n  return <h1>Welcome to Next.js!</h1>;\n}", "Files in the pages/ directory automatically become routes.", "easy"),
    ],
    "tailwind-css": [
      generateQuizStep("Tailwind Approach", "What is Tailwind CSS?", [{ label: "A", text: "A utility-first CSS framework with pre-built classes" }, { label: "B", text: "A JavaScript framework" }, { label: "C", text: "A backend tool" }], "A", "Tailwind provides utility classes like p-4, text-blue-500, flex instead of custom CSS."),
      generateTypingStep("Tailwind Classes", "Style with Tailwind!", '<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">\n  Click Me\n</button>', "Tailwind classes apply styles directly — no separate CSS file needed.", "easy"),
      generateQuizStep("Responsive Tailwind", "How does Tailwind handle responsive design?", [{ label: "A", text: "Prefix classes with breakpoint: sm:, md:, lg:" }, { label: "B", text: "Media queries only" }, { label: "C", text: "It doesn't support responsive" }], "A", "Tailwind uses mobile-first breakpoints: sm:text-lg md:text-xl lg:text-2xl."),
    ],
    // ===== PWA & Mobile =====
    "pwa-intro": [
      generateQuizStep("PWA Definition", "What is a Progressive Web App?", [{ label: "A", text: "A web app that can be installed and work offline like a native app" }, { label: "B", text: "A mobile-only app" }, { label: "C", text: "A desktop application" }], "A", "PWAs combine web and native app features: offline support, push notifications, installability."),
      generateQuizStep("PWA Requirements", "What are the three core PWA requirements?", [{ label: "A", text: "HTTPS, service worker, web app manifest" }, { label: "B", text: "React, Node, MongoDB" }, { label: "C", text: "HTML, CSS, JS only" }], "A", "PWAs need HTTPS (security), a service worker (offline/caching), and a manifest (install info)."),
    ],
    "service-workers": [
      generateQuizStep("Service Worker", "What is a service worker?", [{ label: "A", text: "A script that runs in the background, intercepting network requests" }, { label: "B", text: "A web server" }, { label: "C", text: "A CSS preprocessor" }], "A", "Service workers act as a proxy between the app and network, enabling offline support and caching."),
      generateTypingStep("Register SW", "Register a service worker!", "if ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js');\n}", "Check for support first, then register the service worker file.", "medium"),
    ],
    "web-app-manifest": [
      generateTypingStep("Manifest File", "Create a manifest!", '{\n  "name": "My App",\n  "short_name": "App",\n  "start_url": "/",\n  "display": "standalone"\n}', "The manifest defines app name, icons, colors, and display mode.", "easy"),
      generateQuizStep("Display Modes", "What does display: standalone do?", [{ label: "A", text: "Opens the app without browser UI (like a native app)" }, { label: "B", text: "Shows in a small window" }, { label: "C", text: "Opens in a new tab" }], "A", "standalone removes the browser address bar, making the PWA feel native."),
    ],
    // ===== API Development =====
    "rest-api": [
      generateQuizStep("REST Principles", "What does REST stand for?", [{ label: "A", text: "Representational State Transfer" }, { label: "B", text: "Remote Execution Service Technology" }, { label: "C", text: "Rapid Endpoint Service Tool" }], "A", "REST is an architectural style using standard HTTP methods on resource URLs."),
      generateQuizStep("REST Methods", "Which HTTP method updates an existing resource?", [{ label: "A", text: "POST" }, { label: "B", text: "PUT" }, { label: "C", text: "GET" }], "B", "PUT updates/replaces a resource. POST creates new resources. PATCH partially updates."),
      generateTypingStep("RESTful URL", "Design a REST endpoint!", "GET /api/users/:id\nPOST /api/users\nDELETE /api/users/:id", "REST URLs represent resources. HTTP methods define the action.", "medium"),
    ],
    "graphql-intro": [
      generateQuizStep("GraphQL Purpose", "How does GraphQL differ from REST?", [{ label: "A", text: "Clients specify exactly what data they want in a single query" }, { label: "B", text: "It's identical to REST" }, { label: "C", text: "It only supports GET" }], "A", "GraphQL lets clients request exactly the data they need — no over-fetching or under-fetching."),
      generateTypingStep("GraphQL Query", "Write a GraphQL query!", "query {\n  user(id: 1) {\n    name\n    email\n    posts { title }\n  }\n}", "GraphQL queries specify the exact shape of data you want returned.", "medium"),
    ],
    "api-authentication": [
      generateQuizStep("JWT", "What is a JWT?", [{ label: "A", text: "JSON Web Token — a self-contained token for authentication" }, { label: "B", text: "Java Web Tool" }, { label: "C", text: "JavaScript Widget Template" }], "A", "JWTs contain encoded user data and a signature, eliminating server-side session storage."),
      generateQuizStep("OAuth Flow", "What does OAuth 2.0 provide?", [{ label: "A", text: "Delegated authorization — access without sharing passwords" }, { label: "B", text: "Data encryption" }, { label: "C", text: "Database access" }], "A", "OAuth lets users grant third-party access to their data without sharing credentials."),
    ],
    "websockets": [
      generateQuizStep("WebSocket Purpose", "How do WebSockets differ from HTTP?", [{ label: "A", text: "Full-duplex persistent connection for real-time communication" }, { label: "B", text: "Faster page loading" }, { label: "C", text: "Better styling" }], "A", "WebSockets maintain an open connection for bidirectional real-time data exchange."),
      generateTypingStep("WebSocket Connection", "Create a WebSocket!", 'const ws = new WebSocket("wss://example.com/chat");\nws.onmessage = (e) => console.log(e.data);', "WebSockets use ws:// or wss:// protocol for persistent connections.", "medium"),
    ],
    // ===== Accessibility & Security =====
    "web-accessibility": [
      generateQuizStep("WCAG", "What does WCAG stand for?", [{ label: "A", text: "Web Content Accessibility Guidelines" }, { label: "B", text: "Web Code Analysis Guide" }, { label: "C", text: "Website Creation And Governance" }], "A", "WCAG defines how to make web content accessible to people with disabilities."),
      generateQuizStep("POUR Principles", "What are the 4 WCAG principles?", [{ label: "A", text: "Perceivable, Operable, Understandable, Robust" }, { label: "B", text: "Pretty, Original, Unique, Responsive" }, { label: "C", text: "Public, Open, Universal, Reliable" }], "A", "POUR: content must be perceivable, operable, understandable, and robust."),
    ],
    "web-security": [
      generateQuizStep("XSS", "What is Cross-Site Scripting (XSS)?", [{ label: "A", text: "Injecting malicious scripts into web pages viewed by other users" }, { label: "B", text: "A CSS technique" }, { label: "C", text: "A server configuration" }], "A", "XSS occurs when attackers inject scripts into trusted websites. Sanitize all user input!"),
      generateQuizStep("CSRF", "What is CSRF?", [{ label: "A", text: "Tricking a user's browser into making unauthorized requests" }, { label: "B", text: "A database attack" }, { label: "C", text: "A network protocol" }], "A", "CSRF exploits the trust a site has in the user's browser. Use CSRF tokens to prevent it."),
      generateTypingStep("HTTPS", "Set security headers!", "Content-Security-Policy: default-src 'self';\nX-Frame-Options: DENY;", "Security headers protect against common attacks like XSS and clickjacking.", "medium"),
    ],
    // ===== SEO =====
    "seo-fundamentals": [
      generateQuizStep("SEO Purpose", "What is SEO?", [{ label: "A", text: "Optimizing websites to rank higher in search engine results" }, { label: "B", text: "A programming language" }, { label: "C", text: "A hosting service" }], "A", "SEO improves visibility in Google, Bing, etc. through content, technical, and link strategies."),
      generateTypingStep("Meta Tags", "Add SEO meta tags!", '<meta name="description" content="Learn web development">\n<title>Web Dev Guide | Learn HTML CSS JS</title>', "Title tags and meta descriptions are crucial for search engine results.", "easy"),
    ],
    "core-web-vitals": [
      generateQuizStep("Core Web Vitals", "What are the 3 Core Web Vitals?", [{ label: "A", text: "LCP (loading), FID/INP (interactivity), CLS (visual stability)" }, { label: "B", text: "HTML, CSS, JS" }, { label: "C", text: "Speed, size, security" }], "A", "LCP measures loading, FID/INP measures interactivity, CLS measures visual stability."),
      generateQuizStep("Good LCP", "What is a good LCP score?", [{ label: "A", text: "Under 2.5 seconds" }, { label: "B", text: "Under 10 seconds" }, { label: "C", text: "Under 30 seconds" }], "A", "LCP under 2.5s is good. 2.5-4s needs improvement. Over 4s is poor."),
    ],
    // ===== Backend & Full-Stack =====
    "nodejs-intro": [
      generateQuizStep("Node.js Purpose", "What is Node.js?", [{ label: "A", text: "A JavaScript runtime for running JS outside the browser (server-side)" }, { label: "B", text: "A web browser" }, { label: "C", text: "A CSS framework" }], "A", "Node.js uses Chrome's V8 engine to run JavaScript on servers, enabling full-stack JS development."),
      generateTypingStep("Node Server", "Create a simple server!", 'const http = require("http");\nhttp.createServer((req, res) => {\n  res.end("Hello World!");\n}).listen(3000);', "Node.js can create HTTP servers natively.", "medium"),
      generateQuizStep("npm", "What is npm?", [{ label: "A", text: "Node Package Manager — the world's largest software registry" }, { label: "B", text: "A programming language" }, { label: "C", text: "A browser extension" }], "A", "npm hosts millions of packages and manages project dependencies."),
    ],
    "express-api": [
      generateTypingStep("Express Route", "Create an API route!", 'app.get("/api/users", (req, res) => {\n  res.json({ users: [] });\n});', "Express routes handle HTTP requests with method + path + handler.", "medium"),
      generateQuizStep("Middleware", "What is Express middleware?", [{ label: "A", text: "Functions that run between request and response" }, { label: "B", text: "CSS plugins" }, { label: "C", text: "Database connectors" }], "A", "Middleware functions have access to req, res, and next() to process requests in a pipeline."),
    ],
    "fullstack-architecture": [
      generateQuizStep("Full-Stack", "What does full-stack development cover?", [{ label: "A", text: "Frontend (UI), backend (server/API), and database" }, { label: "B", text: "Only CSS styling" }, { label: "C", text: "Only mobile apps" }], "A", "Full-stack developers work across the entire application: client, server, and database."),
      generateQuizStep("Architecture Patterns", "What is MVC?", [{ label: "A", text: "Model-View-Controller — separates data, display, and logic" }, { label: "B", text: "Most Valuable Code" }, { label: "C", text: "Multi-Version Control" }], "A", "MVC separates concerns: Model (data), View (UI), Controller (logic/routing)."),
    ],
    "database-integration": [
      generateQuizStep("SQL vs NoSQL", "When would you choose SQL over NoSQL?", [{ label: "A", text: "When data has strong relationships and needs ACID compliance" }, { label: "B", text: "When data is unstructured" }, { label: "C", text: "Always" }], "A", "SQL databases excel with relational data, complex queries, and transactional integrity."),
      generateTypingStep("SQL Query", "Write a SQL query!", "SELECT name, email FROM users\nWHERE active = true\nORDER BY created_at DESC;", "SQL queries SELECT columns FROM tables with optional WHERE, ORDER BY clauses.", "medium"),
    ],
    "auth-implementation": [
      generateQuizStep("Auth Methods", "What is session-based authentication?", [{ label: "A", text: "Server stores session data, client gets a session cookie" }, { label: "B", text: "No authentication needed" }, { label: "C", text: "Client stores everything" }], "A", "Session auth: server creates session → sends cookie → client includes cookie in requests."),
      generateQuizStep("JWT vs Sessions", "When to use JWT over sessions?", [{ label: "A", text: "Stateless APIs, microservices, mobile apps" }, { label: "B", text: "Always use JWT" }, { label: "C", text: "Never use JWT" }], "A", "JWT is stateless (no server storage needed), ideal for distributed systems and APIs."),
    ],
    // ===== Mobile =====
    "mobile-app-intro": [
      generateQuizStep("Native vs Cross-Platform", "What is cross-platform development?", [{ label: "A", text: "Writing one codebase that runs on both iOS and Android" }, { label: "B", text: "Building separate apps for each platform" }, { label: "C", text: "Web-only development" }], "A", "Cross-platform frameworks like React Native and Flutter share code across platforms."),
      generateQuizStep("Approaches", "Which is NOT a cross-platform approach?", [{ label: "A", text: "React Native" }, { label: "B", text: "Swift" }, { label: "C", text: "Flutter" }], "B", "Swift is Apple's native iOS language. React Native and Flutter are cross-platform."),
    ],
    "react-native": [
      generateQuizStep("React Native", "How does React Native differ from React?", [{ label: "A", text: "It renders native mobile components instead of DOM elements" }, { label: "B", text: "It uses a different language" }, { label: "C", text: "It only works on Android" }], "A", "React Native uses <View>, <Text>, <TouchableOpacity> instead of <div>, <p>, <button>."),
      generateTypingStep("RN Component", "Create a React Native component!", 'import { View, Text } from "react-native";\n\nfunction App() {\n  return <View><Text>Hello!</Text></View>;\n}', "React Native uses native components instead of HTML elements.", "medium"),
    ],
    "flutter-intro": [
      generateQuizStep("Flutter", "What language does Flutter use?", [{ label: "A", text: "Dart" }, { label: "B", text: "JavaScript" }, { label: "C", text: "Python" }], "A", "Flutter uses Dart, Google's language optimized for UI development."),
      generateTypingStep("Flutter Widget", "Create a Flutter widget!", "class MyApp extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return Text('Hello Flutter!');\n  }\n}", "Everything in Flutter is a widget — the building blocks of the UI.", "medium"),
    ],
    "capacitor-apps": [
      generateQuizStep("Capacitor", "What does Capacitor do?", [{ label: "A", text: "Wraps web apps in a native container for iOS/Android" }, { label: "B", text: "Compiles Dart code" }, { label: "C", text: "Creates databases" }], "A", "Capacitor bridges web apps to native platforms, accessing native APIs from JavaScript."),
      generateTypingStep("Capacitor Plugin", "Use a Capacitor plugin!", 'import { Camera } from "@capacitor/camera";\nconst photo = await Camera.getPhoto({\n  resultType: "uri"\n});', "Capacitor plugins provide native functionality with a JavaScript API.", "medium"),
    ],
    // ===== Version Control & Deployment =====
    "version-control": [
      generateQuizStep("Git Purpose", "What is Git?", [{ label: "A", text: "A distributed version control system for tracking code changes" }, { label: "B", text: "A programming language" }, { label: "C", text: "A web hosting service" }], "A", "Git tracks every change to your codebase, enabling collaboration and history."),
      generateTypingStep("Git Commands", "Use basic Git commands!", "git add .\ngit commit -m \"Add new feature\"\ngit push origin main", "add stages changes, commit saves them, push uploads to remote.", "easy"),
    ],
    "deployment": [
      generateQuizStep("Deployment Options", "What is Vercel/Netlify used for?", [{ label: "A", text: "Hosting and deploying frontend applications with CI/CD" }, { label: "B", text: "Email services" }, { label: "C", text: "Database hosting only" }], "A", "Platforms like Vercel and Netlify auto-deploy from Git with preview URLs and CDN."),
      generateTypingStep("Deploy Command", "Deploy with Git!", "git push origin main\n# Auto-deploys via CI/CD pipeline", "Modern hosting auto-deploys when you push to the main branch.", "easy"),
    ],
    "performance": [
      generateQuizStep("Performance", "What is lazy loading?", [{ label: "A", text: "Loading resources only when needed (e.g., images below the fold)" }, { label: "B", text: "Making the site slower" }, { label: "C", text: "Loading everything at once" }], "A", "Lazy loading defers non-critical resources, improving initial page load time."),
      generateTypingStep("Lazy Load Image", "Add lazy loading!", '<img src="photo.jpg" loading="lazy" alt="Photo">', "The loading='lazy' attribute defers loading until the image enters the viewport.", "easy"),
    ],
    // ===== Planning & Design =====
    "web-planning": [
      generateQuizStep("Website Goals", "What should you define first when planning a website?", [{ label: "A", text: "Colors and fonts" }, { label: "B", text: "Purpose, target audience, and key goals" }, { label: "C", text: "Technology stack" }], "B", "Start with WHO the site is for, WHAT it needs to do, and WHY it exists."),
      generateQuizStep("Content Strategy", "What is a content strategy?", [{ label: "A", text: "Planning what content to create, for whom, and how to organize it" }, { label: "B", text: "Writing random blog posts" }, { label: "C", text: "Copying competitor content" }], "A", "Content strategy ensures the right content reaches the right audience at the right time."),
    ],
    "wireframing": [
      generateQuizStep("Wireframe Purpose", "What is a wireframe?", [{ label: "A", text: "A low-fidelity visual guide showing layout and functionality" }, { label: "B", text: "A finished design" }, { label: "C", text: "A wire mesh for 3D models" }], "A", "Wireframes are simplified blueprints showing structure without colors, images, or detailed styling."),
      generateQuizStep("Wireframe Tools", "Which tool is used for wireframing?", [{ label: "A", text: "Figma, Balsamiq, or Sketch" }, { label: "B", text: "Photoshop only" }, { label: "C", text: "Microsoft Word" }], "A", "Figma, Balsamiq, and Sketch are popular tools for creating wireframes and prototypes."),
    ],
    "site-maps": [
      generateQuizStep("Site Map", "What does a site map show?", [{ label: "A", text: "The hierarchical structure of all pages on a website" }, { label: "B", text: "Geographic locations" }, { label: "C", text: "Database tables" }], "A", "Site maps show how pages are organized and connected, helping plan navigation."),
    ],
    "user-flows": [
      generateQuizStep("User Flow", "What is a user flow?", [{ label: "A", text: "The path a user takes to complete a task on the website" }, { label: "B", text: "Network traffic" }, { label: "C", text: "CSS animation" }], "A", "User flows map the steps from entry point to goal completion (e.g., sign up → dashboard)."),
    ],
  };
  return content[id] || null;
}

function getWebCodeSnippet(id: string, title: string): { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" } | null {
  // Used as fallback for lessons not in getWebContent
  const snippets: Record<string, { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }> = {
    "html5-apis": { title: "Canvas API", prompt: "Draw on canvas!", code: 'const ctx = canvas.getContext("2d");\nctx.fillStyle = "red";\nctx.fillRect(10, 10, 100, 50);', explanation: "The Canvas API allows drawing 2D graphics with JavaScript.", difficulty: "medium" },
    "svg-basics": { title: "SVG Circle", prompt: "Create an SVG!", code: '<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" fill="blue"/>\n</svg>', explanation: "SVG elements are defined in XML and scale without losing quality.", difficulty: "easy" },
    "html-meta": { title: "Meta Tags", prompt: "Add meta tags!", code: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="My page">', explanation: "Meta tags provide metadata about the HTML document for browsers and search engines.", difficulty: "easy" },
    "html-responsive": { title: "Responsive Image", prompt: "Use srcset!", code: '<img srcset="small.jpg 480w, large.jpg 800w"\n  sizes="(max-width: 600px) 480px, 800px"\n  src="large.jpg" alt="Photo">', explanation: "srcset lets browsers choose the best image size for the device.", difficulty: "medium" },
    "schema-markup": { title: "JSON-LD", prompt: "Add structured data!", code: '<script type="application/ld+json">\n{"@context":"https://schema.org","@type":"Article","name":"My Article"}\n</script>', explanation: "JSON-LD structured data helps search engines understand your content.", difficulty: "medium" },
    "seo-technical": { title: "Robots.txt", prompt: "Create robots.txt!", code: "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml", explanation: "robots.txt tells search engine crawlers which pages to access.", difficulty: "easy" },
    "serverless-functions": { title: "Serverless Function", prompt: "Write a serverless function!", code: "export default async function handler(req, res) {\n  const data = await fetchData();\n  res.json(data);\n}", explanation: "Serverless functions run on-demand without managing servers.", difficulty: "medium" },
    "microservices-web": { title: "Service Architecture", prompt: "Define a microservice!", code: "// User Service\napp.get('/api/users/:id', async (req, res) => {\n  const user = await db.users.find(req.params.id);\n  res.json(user);\n});", explanation: "Microservices split applications into independent, deployable services.", difficulty: "hard" },
  };
  if (snippets[id]) return snippets[id];
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
