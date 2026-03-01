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

  // Additional drilling: repeat the code pattern
  if (codeSnippets.length > 0) {
    const mainSnippet = codeSnippets[0];
    steps.push(generateTypingStep(
      `Drill: ${mainSnippet.title}`, `Type it again from memory!`, mainSnippet.code,
      `Repetition builds muscle memory. You should now be able to type ${title.toLowerCase()} syntax without thinking.`, mainSnippet.difficulty
    ));
  }

  steps.push(generateQuizStep(
    `${title} Best Practices`, `What is a best practice when using ${title.toLowerCase()}?`,
    [{ label: "A", text: "Ignore error handling" }, { label: "B", text: "Follow Java naming conventions and document your code" }, { label: "C", text: "Never test your code" }],
    "B", `Following conventions and documenting code ensures ${title.toLowerCase()} is used correctly and maintainably.`, "medium"
  ));

  // Application quiz
  steps.push(generateQuizStep(
    `Apply ${title}`, `A colleague asks you to implement ${title.toLowerCase()}. What is your first step?`,
    [{ label: "A", text: "Start coding immediately without planning" }, { label: "B", text: "Understand the requirement, plan the approach, then write clean code" }, { label: "C", text: "Copy code from the internet without understanding" }],
    "B", `Professional developers plan their approach before coding. Understanding ${title.toLowerCase()} deeply means you can implement it correctly the first time.`, "hard"
  ));

  // Final speed drill
  if (codeSnippets.length > 0) {
    steps.push(generateTypingStep(
      `Speed Drill: ${title}`, `Type it one more time — aim for speed!`,
      codeSnippets[codeSnippets.length > 1 ? 1 : 0].code,
      `By now this should feel natural. ${title} syntax is becoming second nature!`, "medium"
    ));
  }

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
  const topicContent = getSystemsContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 7 intensive steps
  return [
    generateQuizStep(`Understanding ${title}`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: desc }, { label: "B", text: "Writing machine code" }, { label: "C", text: "Hardware installation" }],
      "A", `${title} is about ${desc.toLowerCase()}, a key concept in systems analysis.`, "easy"),
    generateTypingStep(`${title} Definition`, `Type the definition of ${title.toLowerCase()}!`,
      `${title}: ${desc}`,
      `Being able to define ${title.toLowerCase()} from memory is essential for exams and interviews.`, "easy"),
    generateQuizStep(`${title} in SDLC`, `Which SDLC phase does ${title.toLowerCase()} primarily belong to?`,
      [{ label: "A", text: "Only during coding" }, { label: "B", text: "During analysis and design phases" }, { label: "C", text: "Only after deployment" }],
      "B", `${title} is applied during analysis and design to ensure the system meets requirements.`, "medium"),
    generateTypingStep(`${title} in Practice`, `Type how you would apply ${title.toLowerCase()} in a project!`,
      `Step 1: Identify requirements\nStep 2: Apply ${title}\nStep 3: Document and validate`,
      `Following a structured approach ensures ${title.toLowerCase()} is applied effectively.`, "medium"),
    generateQuizStep(`${title} Stakeholders`, `Who benefits most from ${title.toLowerCase()}?`,
      [{ label: "A", text: "Only programmers" }, { label: "B", text: "Only managers" }, { label: "C", text: "All project stakeholders including users, developers, and management" }],
      "C", `${title} benefits all stakeholders by improving communication and system quality.`, "medium"),
    generateQuizStep(`${title} vs Alternatives`, `What happens if you skip ${title.toLowerCase()} in a project?`,
      [{ label: "A", text: "Nothing, it's optional" }, { label: "B", text: "Increased risk of project failure, rework, and missed requirements" }, { label: "C", text: "The project goes faster" }],
      "B", `Skipping ${title.toLowerCase()} leads to costly rework and missed requirements.`, "hard"),
    generateTypingStep(`${title} Summary`, `Type the key takeaway for ${title.toLowerCase()}!`,
      `${title} ensures quality outcomes through structured ${desc.toLowerCase()}.`,
      `You should now be able to explain ${title.toLowerCase()} confidently in any context.`, "easy"),
  ];
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

  // Enhanced fallback with practical exercises
  return [
    generateQuizStep(`${title} Concept`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "A type of computer virus" }, { label: "C", text: "A hardware component" }],
      "A", `${title}: ${desc}. This mathematical concept is essential for computing.`, "easy"),
    generateTypingStep(`${title} Formula`, `Type the key formula for ${title.toLowerCase()}!`,
      `// Formula: ${title}\n// ${desc}`,
      `Memorizing formulas through typing builds automatic recall.`, "easy"),
    generateQuizStep(`${title} Application`, `How is ${title.toLowerCase()} used in computing?`,
      [{ label: "A", text: "Never used in practice" }, { label: "B", text: "In algorithms, data structures, and problem-solving" }, { label: "C", text: "Only in pure mathematics" }],
      "B", `${title} underpins many algorithms and data structures in computer science.`, "medium"),
    generateQuizStep(`Solve: ${title}`, `Which approach would you use to solve a problem involving ${title.toLowerCase()}?`,
      [{ label: "A", text: "Guess randomly" }, { label: "B", text: "Identify the pattern, apply the formula, verify the result" }, { label: "C", text: "Skip the problem" }],
      "B", `Mathematical problem-solving follows: understand → plan → execute → verify.`, "medium"),
    generateTypingStep(`${title} Practice`, `Type a practical example!`,
      `// Example: ${title}\n// Input: data\n// Process: apply ${title.toLowerCase()}\n// Output: result`,
      `Writing out the process helps cement the concept.`, "medium"),
    generateQuizStep(`${title} Complexity`, `What is the typical complexity when implementing ${title.toLowerCase()} in code?`,
      [{ label: "A", text: "Always O(1)" }, { label: "B", text: "Depends on the specific algorithm and data size" }, { label: "C", text: "Always O(n!)" }],
      "B", `Algorithm complexity depends on the approach. Understanding Big-O helps choose efficient solutions.`, "hard"),
    generateQuizStep(`${title} Mastery Check`, `Can you explain ${title.toLowerCase()} to a colleague?`,
      [{ label: "A", text: "No, it's too abstract" }, { label: "B", text: "Yes: it involves " + desc.toLowerCase() }, { label: "C", text: "I need to look it up" }],
      "B", `If you can explain it simply, you truly understand it. ${title}: ${desc}.`, "easy"),
  ];
}

function getMathContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "binary-intro": [
      generateQuizStep("Binary System", "What base does binary use?", [{ label: "A", text: "Base 10" }, { label: "B", text: "Base 2" }, { label: "C", text: "Base 16" }], "B", "Binary (base 2) uses only 0 and 1 — the language of computers."),
      generateTypingStep("Binary Number", "Type a binary number!", "1010 = 10 in decimal", "1010: (1×8) + (0×4) + (1×2) + (0×1) = 10.", "easy"),
      generateQuizStep("Place Values", "What are binary place values from right?", [{ label: "A", text: "1, 2, 4, 8, 16, 32..." }, { label: "B", text: "1, 3, 5, 7..." }, { label: "C", text: "0, 1, 2, 3..." }], "A", "Each position doubles: 1, 2, 4, 8, 16, 32, 64, 128."),
      generateTypingStep("Convert to Binary", "Convert 13 to binary!", "13 = 1101", "13 = 8+4+0+1 = 1101 in binary.", "medium"),
    ],
    "hex-numbers": [
      generateQuizStep("Hexadecimal", "What base does hex use?", [{ label: "A", text: "Base 8" }, { label: "B", text: "Base 16" }, { label: "C", text: "Base 6" }], "B", "Hexadecimal (base 16) uses 0-9 and A-F. Each hex digit = 4 binary bits."),
      generateTypingStep("Hex Values", "Type hex digits!", "0123456789ABCDEF", "A=10, B=11, C=12, D=13, E=14, F=15.", "easy"),
      generateQuizStep("Hex Color", "What does #FF0000 represent?", [{ label: "A", text: "Pure red" }, { label: "B", text: "Pure blue" }, { label: "C", text: "Pure green" }], "A", "FF=255 red, 00=0 green, 00=0 blue = pure red."),
      generateTypingStep("Hex to Binary", "Convert hex to binary!", "A = 1010, F = 1111", "Each hex digit converts to exactly 4 binary bits.", "medium"),
    ],
    "binary-arithmetic": [
      generateQuizStep("Binary Addition", "What is 1011 + 0101?", [{ label: "A", text: "10000" }, { label: "B", text: "1110" }, { label: "C", text: "1100" }], "A", "1011 (11) + 0101 (5) = 10000 (16). Carry: 1+1=10."),
      generateTypingStep("Binary Add", "Add binary numbers!", "  1011\n+ 0101\n------\n 10000", "Binary addition: 0+0=0, 0+1=1, 1+1=10 (carry 1).", "medium"),
      generateQuizStep("Overflow", "What is overflow in binary?", [{ label: "A", text: "When the result exceeds the available bits" }, { label: "B", text: "When memory is full" }, { label: "C", text: "When the CPU overheats" }], "A", "Overflow occurs when the result needs more bits than available."),
    ],
    "big-o": [
      generateQuizStep("Big-O Purpose", "What does Big-O notation describe?", [{ label: "A", text: "How an algorithm's time/space scales with input size" }, { label: "B", text: "The exact runtime in seconds" }, { label: "C", text: "The number of lines of code" }], "A", "Big-O describes the upper bound of growth rate as input increases."),
      generateQuizStep("O(1) vs O(n)", "What is O(1)?", [{ label: "A", text: "Constant time — same speed regardless of input" }, { label: "B", text: "Linear time" }, { label: "C", text: "The slowest possible" }], "A", "O(1) means the operation takes constant time. Array access by index is O(1)."),
      generateTypingStep("Complexity Order", "Type complexity order!", "O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)", "From fastest to slowest. Always aim for the lowest complexity.", "medium"),
      generateQuizStep("Loop Complexity", "What is the Big-O of a simple for loop?", [{ label: "A", text: "O(1)" }, { label: "B", text: "O(n)" }, { label: "C", text: "O(n²)" }], "B", "A single loop iterating n times is O(n). Nested loops: O(n²)."),
    ],
    "sorting-algorithms": [
      generateQuizStep("Bubble Sort", "How does bubble sort work?", [{ label: "A", text: "Repeatedly swaps adjacent elements if in wrong order" }, { label: "B", text: "Divides array in half" }, { label: "C", text: "Randomly shuffles elements" }], "A", "Bubble sort compares adjacent pairs and swaps them. Complexity: O(n²)."),
      generateQuizStep("Merge Sort", "What is merge sort's time complexity?", [{ label: "A", text: "O(n²)" }, { label: "B", text: "O(n log n)" }, { label: "C", text: "O(n)" }], "B", "Merge sort divides, sorts halves, and merges. Always O(n log n)."),
      generateTypingStep("Sort Comparison", "Type sort complexities!", "Bubble: O(n^2)\nMerge: O(n log n)\nQuick: O(n log n) avg", "Quick sort is fastest on average but O(n²) worst case.", "medium"),
    ],
    "searching-algorithms": [
      generateQuizStep("Linear Search", "How does linear search work?", [{ label: "A", text: "Check each element one by one until found" }, { label: "B", text: "Jump to the middle" }, { label: "C", text: "Sort first, then search" }], "A", "Linear search checks every element sequentially. O(n) time."),
      generateQuizStep("Binary Search", "What does binary search require?", [{ label: "A", text: "A sorted array" }, { label: "B", text: "An unsorted array" }, { label: "C", text: "A linked list" }], "A", "Binary search needs sorted data. It halves the search space each step. O(log n)."),
      generateTypingStep("Binary Search Code", "Write binary search steps!", "1. Find middle element\n2. If target = middle, found!\n3. If target < middle, search left half\n4. If target > middle, search right half", "Binary search is dramatically faster than linear for large datasets.", "medium"),
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
      generateTypingStep("Truth Table", "Type AND truth table!", "0 AND 0 = 0\n0 AND 1 = 0\n1 AND 0 = 0\n1 AND 1 = 1", "AND only outputs 1 when both inputs are 1.", "easy"),
    ],
    "boolean-algebra": [
      generateQuizStep("Boolean Laws", "What does De Morgan's Law state?", [{ label: "A", text: "NOT(A AND B) = NOT A OR NOT B" }, { label: "B", text: "A AND B = A OR B" }, { label: "C", text: "NOT A = A" }], "A", "De Morgan's: break the bar, change the sign. NOT(A·B) = A'+B'."),
      generateTypingStep("Boolean Expression", "Simplify a boolean expression!", "NOT(A AND B) = NOT A OR NOT B", "De Morgan's Law is essential for simplifying logic circuits.", "medium"),
    ],
    "sets-theory": [
      generateQuizStep("Set Operations", "What is A ∪ B?", [{ label: "A", text: "Union: all elements in A or B or both" }, { label: "B", text: "Intersection: only elements in both" }, { label: "C", text: "Difference: only in A" }], "A", "Union combines all elements. Intersection keeps only shared elements."),
      generateTypingStep("Set Notation", "Type set operations!", "A ∪ B = Union\nA ∩ B = Intersection\nA - B = Difference", "Understanding sets is crucial for databases (SQL) and logic.", "easy"),
    ],
  };
  return content[id] || null;
}

// ======================== CYBERSECURITY ========================
function generateCyberSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getCyberContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 8 intensive security drilling steps
  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A type of software development" }, { label: "B", text: desc }, { label: "C", text: "A networking protocol" }],
      "B", `${title}: ${desc}. This is a critical cybersecurity concept.`, "easy"),
    generateTypingStep(`${title} Definition`, `Type the definition!`,
      `${title}: ${desc}`,
      `Being able to define security concepts precisely is essential for certifications.`, "easy"),
    generateQuizStep(`${title} Threat Model`, `What type of threat does ${title.toLowerCase()} protect against?`,
      [{ label: "A", text: "No threats — it's purely theoretical" }, { label: "B", text: "Unauthorized access, data breaches, and system compromise" }, { label: "C", text: "Weather-related damage only" }],
      "B", `${title} protects against real-world cyber threats that can cause serious damage.`, "medium"),
    generateTypingStep(`${title} Command`, `Type a security command or tool for ${title.toLowerCase()}!`,
      `# Security: ${title}\nnmap -sV target_ip\nwireshark`,
      `Knowing the tools is as important as knowing the theory.`, "medium"),
    generateQuizStep(`${title} CIA Triad`, `How does ${title.toLowerCase()} relate to the CIA triad?`,
      [{ label: "A", text: "It only affects availability" }, { label: "B", text: "It supports confidentiality, integrity, and/or availability" }, { label: "C", text: "It has no relation to CIA" }],
      "B", `Every security control maps to one or more CIA pillars.`, "medium"),
    generateQuizStep(`${title} Implementation`, `How should ${title.toLowerCase()} be implemented in an organization?`,
      [{ label: "A", text: "By one person working alone" }, { label: "B", text: "Through defense-in-depth with policies, controls, and monitoring" }, { label: "C", text: "Only with expensive hardware" }],
      "B", `Defense-in-depth uses multiple layers: policies, technical controls, and continuous monitoring.`, "hard"),
    generateTypingStep(`${title} Checklist`, `Type a security implementation checklist!`,
      `1. Assess current state\n2. Identify gaps\n3. Implement controls\n4. Test and validate\n5. Monitor and review`,
      `Following a structured approach ensures comprehensive security coverage.`, "medium"),
    generateQuizStep(`${title} Incident Response`, `If ${title.toLowerCase()} fails, what is the first step?`,
      [{ label: "A", text: "Ignore it" }, { label: "B", text: "Contain the incident, then investigate and remediate" }, { label: "C", text: "Delete all logs" }],
      "B", `Incident response: Contain → Investigate → Remediate → Learn. Never delete evidence!`, "hard"),
  ];
}

function getCyberContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "cia-triad": [
      generateQuizStep("CIA Triad", "What does CIA stand for in cybersecurity?", [{ label: "A", text: "Central Intelligence Agency" }, { label: "B", text: "Confidentiality, Integrity, Availability" }, { label: "C", text: "Computer Information Access" }], "B", "The CIA Triad is the foundation of information security."),
      generateQuizStep("Confidentiality", "What ensures confidentiality?", [{ label: "A", text: "Encryption and access controls" }, { label: "B", text: "Backups" }, { label: "C", text: "Load balancing" }], "A", "Encryption and access controls prevent unauthorized data access."),
      generateQuizStep("Integrity", "What protects data integrity?", [{ label: "A", text: "Hash functions and checksums" }, { label: "B", text: "Faster internet" }, { label: "C", text: "More storage" }], "A", "Hash functions verify that data hasn't been tampered with."),
      generateTypingStep("CIA Memory", "Type the CIA triad!", "Confidentiality, Integrity, Availability", "These three pillars are the foundation of ALL security decisions.", "easy"),
      generateTypingStep("CIA Drill", "Type CIA controls!", "Confidentiality: Encryption\nIntegrity: Hashing\nAvailability: Redundancy", "Each pillar has specific controls. Memorize these associations!", "medium"),
    ],
    "phishing": [
      generateQuizStep("Phishing Attack", "What is phishing?", [{ label: "A", text: "A social engineering attack using fake emails/websites" }, { label: "B", text: "A type of firewall" }, { label: "C", text: "A programming language" }], "A", "Phishing tricks users into revealing sensitive information through fake communications."),
      generateQuizStep("Spear Phishing", "How does spear phishing differ from phishing?", [{ label: "A", text: "It targets specific individuals" }, { label: "B", text: "It uses phone calls" }, { label: "C", text: "It's less dangerous" }], "A", "Spear phishing is targeted at specific individuals using personalized information."),
      generateQuizStep("Prevention", "How to prevent phishing?", [{ label: "A", text: "Click all links to test them" }, { label: "B", text: "Verify sender, check URLs, use MFA" }, { label: "C", text: "Disable email" }], "B", "Always verify senders, hover over links, and use multi-factor authentication."),
      generateTypingStep("Phishing Indicators", "Type phishing red flags!", "1. Urgent language\n2. Misspelled domain\n3. Generic greeting\n4. Suspicious attachment", "Recognizing these patterns protects against social engineering attacks.", "easy"),
    ],
    "encryption-basics": [
      generateQuizStep("Symmetric Encryption", "What is symmetric encryption?", [{ label: "A", text: "Same key for encryption and decryption" }, { label: "B", text: "Different keys for each" }, { label: "C", text: "No key needed" }], "A", "Symmetric encryption uses one shared key for both encrypting and decrypting."),
      generateQuizStep("Asymmetric Encryption", "What does asymmetric encryption use?", [{ label: "A", text: "One key" }, { label: "B", text: "A public key and a private key" }, { label: "C", text: "No encryption" }], "B", "Asymmetric encryption uses a key pair: public for encrypting, private for decrypting."),
      generateTypingStep("AES Example", "Type an encryption standard!", "AES-256", "AES-256 is a strong symmetric encryption standard used worldwide.", "easy"),
      generateTypingStep("Encryption Types", "Type both types!", "Symmetric: AES, DES, 3DES\nAsymmetric: RSA, ECC, DSA", "Know which algorithms belong to which type!", "medium"),
    ],
    "network-security-basics": [
      generateQuizStep("Firewall Purpose", "What does a firewall do?", [{ label: "A", text: "Speeds up internet" }, { label: "B", text: "Filters network traffic based on rules" }, { label: "C", text: "Stores passwords" }], "B", "Firewalls monitor and control incoming/outgoing traffic based on security rules."),
      generateQuizStep("IDS vs IPS", "What's the difference between IDS and IPS?", [{ label: "A", text: "IDS detects, IPS prevents" }, { label: "B", text: "They are the same" }, { label: "C", text: "IPS detects, IDS prevents" }], "A", "IDS (Intrusion Detection) alerts you; IPS (Intrusion Prevention) actively blocks threats."),
      generateTypingStep("Firewall Rule", "Type a firewall rule!", "ALLOW TCP 443 INBOUND\nDENY ALL INBOUND DEFAULT", "Firewall rules specify which traffic to allow or block.", "medium"),
    ],
    "password-security": [
      generateQuizStep("Password Strength", "What makes a strong password?", [{ label: "A", text: "12+ chars with uppercase, lowercase, numbers, symbols" }, { label: "B", text: "Your name and birthday" }, { label: "C", text: "The word 'password'" }], "A", "Strong passwords are long, complex, and unique to each account."),
      generateTypingStep("Password Policy", "Type a password policy!", "Min 12 chars, uppercase, lowercase, number, symbol, no reuse of last 5", "Password policies enforce security standards across organizations.", "medium"),
      generateQuizStep("MFA", "What does MFA add to authentication?", [{ label: "A", text: "A second factor: something you have, are, or know" }, { label: "B", text: "A longer password" }, { label: "C", text: "More complexity only" }], "A", "MFA requires multiple proof types: knowledge, possession, inherence."),
    ],
    "malware-types": [
      generateQuizStep("Malware Types", "What is ransomware?", [{ label: "A", text: "Encrypts victim's files and demands payment for decryption" }, { label: "B", text: "Speeds up your computer" }, { label: "C", text: "A type of antivirus" }], "A", "Ransomware encrypts data and extorts victims for decryption keys."),
      generateQuizStep("Trojan Horse", "How does a Trojan work?", [{ label: "A", text: "Disguises itself as legitimate software" }, { label: "B", text: "Self-replicates across networks" }, { label: "C", text: "Only affects mobile phones" }], "A", "Trojans appear harmless but carry hidden malicious payloads."),
      generateTypingStep("Malware Types", "Type all malware categories!", "Virus, Worm, Trojan, Ransomware, Spyware, Adware, Rootkit", "Knowing malware types helps identify and respond to threats.", "medium"),
    ],
    "social-engineering": [
      generateQuizStep("Social Engineering", "What is social engineering?", [{ label: "A", text: "Manipulating people into revealing confidential information" }, { label: "B", text: "Building social media apps" }, { label: "C", text: "Network engineering" }], "A", "Social engineering exploits human psychology rather than technical vulnerabilities."),
      generateTypingStep("SE Techniques", "Type social engineering techniques!", "Phishing, Pretexting, Baiting, Tailgating, Quid Pro Quo", "These are the most common social engineering attack vectors.", "medium"),
      generateQuizStep("Prevention", "Best defense against social engineering?", [{ label: "A", text: "Better firewalls" }, { label: "B", text: "Security awareness training for all employees" }, { label: "C", text: "Stronger encryption" }], "B", "People are the weakest link — training is the best defense against social engineering."),
    ],
  };
  return content[id] || null;
}

// ======================== AI & DATA SCIENCE ========================
function generateAISteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getAIContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 8 practical AI/DS drilling steps
  return [
    generateQuizStep(`${title} Fundamentals`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: "Manual data entry" }, { label: "B", text: desc }, { label: "C", text: "Hardware assembly" }],
      "B", `${title}: ${desc}. This is a key concept in AI and data science.`, "easy"),
    generateTypingStep(`${title} Python Code`, `Write Python code for ${title.toLowerCase()}!`,
      `import pandas as pd\nimport numpy as np\n\n# ${title}\nprint("${title}")`,
      `Python with pandas and numpy is the foundation for ${title.toLowerCase()}.`, "easy"),
    generateQuizStep(`${title} Pipeline`, `Where does ${title.toLowerCase()} fit in the data science pipeline?`,
      [{ label: "A", text: "Only at the end" }, { label: "B", text: "Data collection → cleaning → analysis → modeling → evaluation" }, { label: "C", text: "It replaces the pipeline" }],
      "B", `The data science pipeline is iterative: collect, clean, analyze, model, evaluate, deploy.`, "medium"),
    generateTypingStep(`${title} Implementation`, `Type a practical implementation!`,
      `# ${title}\ndata = pd.read_csv("data.csv")\nresult = data.describe()\nprint(result)`,
      `Hands-on implementation builds the instinct for data analysis workflows.`, "medium"),
    generateQuizStep(`${title} Metrics`, `How do you evaluate the success of ${title.toLowerCase()}?`,
      [{ label: "A", text: "By guessing" }, { label: "B", text: "Using metrics: accuracy, precision, recall, F1-score, RMSE" }, { label: "C", text: "By running it once" }],
      "B", `Evaluation metrics quantify model performance objectively.`, "medium"),
    generateQuizStep(`${title} Ethics`, `What ethical consideration applies to ${title.toLowerCase()}?`,
      [{ label: "A", text: "No ethics needed" }, { label: "B", text: "Fairness, transparency, privacy, and accountability" }, { label: "C", text: "Only profit matters" }],
      "B", `Ethical AI requires fairness, transparency, and accountability in all applications.`, "medium"),
    generateTypingStep(`${title} Visualization`, `Type code to visualize results!`,
      `import matplotlib.pyplot as plt\nplt.plot(data)\nplt.title("${title}")\nplt.show()`,
      `Visualization makes data insights accessible and actionable.`, "medium"),
    generateQuizStep(`${title} Real-World`, `Name a real-world application of ${title.toLowerCase()}:`,
      [{ label: "A", text: "It has no real applications" }, { label: "B", text: "Healthcare diagnosis, fraud detection, recommendation systems" }, { label: "C", text: "Only academic research" }],
      "B", `${title} powers real applications across healthcare, finance, retail, and more.`, "hard"),
  ];
}

function getAIContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "linear-regression": [
      generateQuizStep("Linear Regression", "What does linear regression predict?", [{ label: "A", text: "Categories" }, { label: "B", text: "Continuous numerical values" }, { label: "C", text: "Images" }], "B", "Linear regression predicts continuous values by finding the best-fit line."),
      generateTypingStep("Regression Code", "Write regression in Python!", "model = LinearRegression()\nmodel.fit(X_train, y_train)", "fit() trains the model on your training data.", "medium"),
      generateQuizStep("R² Score", "What does R² = 0.85 mean?", [{ label: "A", text: "85% of variance is explained by the model" }, { label: "B", text: "85% accuracy" }, { label: "C", text: "85 data points" }], "A", "R² measures how much variance in the target is explained by the features."),
      generateTypingStep("Predict", "Make predictions!", "predictions = model.predict(X_test)\nprint(predictions)", "After training, use predict() to generate outputs for new data.", "easy"),
    ],
    "neural-networks": [
      generateQuizStep("Neural Network", "What is a neural network inspired by?", [{ label: "A", text: "Computer circuits" }, { label: "B", text: "The human brain" }, { label: "C", text: "The internet" }], "B", "Neural networks are inspired by biological neurons in the human brain."),
      generateQuizStep("Layers", "What are the three types of layers?", [{ label: "A", text: "Input, hidden, output" }, { label: "B", text: "Top, middle, bottom" }, { label: "C", text: "Fast, medium, slow" }], "A", "Neural networks have input layers, one or more hidden layers, and an output layer."),
      generateTypingStep("Create Network", "Define a simple neural network!", "model = Sequential([\n  Dense(64, activation='relu'),\n  Dense(1)\n])", "Sequential models stack layers linearly.", "medium"),
      generateTypingStep("Train Network", "Train the network!", "model.compile(optimizer='adam', loss='mse')\nmodel.fit(X_train, y_train, epochs=10)", "compile() sets the optimizer and loss, fit() trains the model.", "medium"),
    ],
    "decision-trees": [
      generateQuizStep("Decision Tree", "How does a decision tree make predictions?", [{ label: "A", text: "By splitting data on feature thresholds" }, { label: "B", text: "By random guessing" }, { label: "C", text: "By memorizing all data" }], "A", "Decision trees split data at each node based on the feature that best separates the classes."),
      generateQuizStep("Overfitting", "What causes overfitting in decision trees?", [{ label: "A", text: "Too few nodes" }, { label: "B", text: "Tree is too deep/complex" }, { label: "C", text: "Too much data" }], "B", "Deep trees memorize training data instead of learning general patterns."),
      generateTypingStep("Decision Tree Code", "Create a decision tree!", "from sklearn.tree import DecisionTreeClassifier\nclf = DecisionTreeClassifier(max_depth=5)\nclf.fit(X_train, y_train)", "max_depth limits tree complexity to prevent overfitting.", "medium"),
    ],
    "kmeans": [
      generateQuizStep("K-Means", "What does K-Means do?", [{ label: "A", text: "Groups data into K clusters" }, { label: "B", text: "Predicts labels" }, { label: "C", text: "Removes outliers" }], "A", "K-Means partitions data into K clusters based on distance to centroids."),
      generateTypingStep("K-Means Code", "Create K-Means clusters!", "kmeans = KMeans(n_clusters=3)\nkmeans.fit(data)", "n_clusters specifies how many groups to create.", "medium"),
      generateTypingStep("K-Means Predict", "Assign clusters!", "labels = kmeans.predict(new_data)\ncenters = kmeans.cluster_centers_", "predict() assigns new data to the nearest cluster center.", "medium"),
    ],
    "prompt-engineering": [
      generateQuizStep("Prompt Engineering", "What is prompt engineering?", [{ label: "A", text: "Building hardware" }, { label: "B", text: "Crafting effective inputs for AI models" }, { label: "C", text: "Writing unit tests" }], "B", "Prompt engineering is the art of writing effective prompts to get better AI outputs."),
      generateTypingStep("System Prompt", "Write a system prompt!", 'You are a helpful coding tutor. Explain concepts simply.', "System prompts set the AI's behavior and personality.", "easy"),
      generateQuizStep("Few-Shot", "What is few-shot prompting?", [{ label: "A", text: "Giving examples in the prompt" }, { label: "B", text: "Using less data" }, { label: "C", text: "Running fewer iterations" }], "A", "Few-shot prompting includes examples to guide the AI's response format."),
      generateTypingStep("Few-Shot Example", "Type a few-shot prompt!", 'Input: happy -> Output: positive\nInput: sad -> Output: negative\nInput: excited -> Output:', "Providing examples teaches the model the expected pattern.", "medium"),
    ],
    "data-cleaning": [
      generateQuizStep("Data Cleaning", "Why is data cleaning important?", [{ label: "A", text: "Garbage in = garbage out" }, { label: "B", text: "It makes data larger" }, { label: "C", text: "It's optional" }], "A", "Dirty data leads to inaccurate models. Cleaning is 80% of a data scientist's work."),
      generateTypingStep("Handle Missing Data", "Clean missing values!", "df.dropna()\ndf.fillna(df.mean())\ndf.isnull().sum()", "dropna() removes missing rows, fillna() replaces them.", "medium"),
      generateTypingStep("Remove Duplicates", "Remove duplicate rows!", "df = df.drop_duplicates()\nprint(f'Rows: {len(df)}')", "Duplicate data skews analysis. Always check for and remove duplicates.", "easy"),
    ],
    "pandas-basics": [
      generateTypingStep("Create DataFrame", "Create a pandas DataFrame!", "import pandas as pd\ndf = pd.DataFrame({'name': ['Alice', 'Bob'], 'age': [25, 30]})", "DataFrames are the core data structure in pandas.", "easy"),
      generateTypingStep("Select Columns", "Select and filter data!", "names = df['name']\nadults = df[df['age'] >= 18]", "Use [] for column selection and boolean indexing for filtering.", "medium"),
      generateQuizStep("GroupBy", "What does groupby() do?", [{ label: "A", text: "Groups data by a column and applies aggregate functions" }, { label: "B", text: "Sorts the data" }, { label: "C", text: "Deletes groups" }], "A", "groupby() splits data into groups for aggregation: df.groupby('category').mean()"),
    ],
    "numpy-basics": [
      generateTypingStep("NumPy Array", "Create a NumPy array!", "import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint(arr.mean(), arr.std())", "NumPy provides fast numerical operations on arrays.", "easy"),
      generateQuizStep("NumPy vs Lists", "Why use NumPy over Python lists?", [{ label: "A", text: "Faster mathematical operations and broadcasting" }, { label: "B", text: "More readable" }, { label: "C", text: "They are the same" }], "A", "NumPy is 10-100x faster than lists for numerical operations due to C implementation."),
    ],
  };
  return content[id] || null;
}

// ======================== BUSINESS SYSTEMS ========================
function generateBusinessSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getBusinessContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 7 practical business drilling steps
  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A hardware component" }, { label: "B", text: desc }, { label: "C", text: "A programming language" }],
      "B", `${title}: ${desc}. This is important for modern business information systems.`, "easy"),
    generateTypingStep(`${title} Definition`, `Type the definition!`,
      `${title}: ${desc}`,
      `Accurate definitions are essential for business communications and exams.`, "easy"),
    generateQuizStep(`${title} Business Value`, `How does ${title.toLowerCase()} add business value?`,
      [{ label: "A", text: "Only increases costs" }, { label: "B", text: "Improves efficiency, decision-making, and competitive advantage" }, { label: "C", text: "Has no business impact" }],
      "B", `${title} drives business value through improved efficiency and informed decision-making.`, "medium"),
    generateTypingStep(`${title} Use Case`, `Type a real-world use case!`,
      `Use Case: ${title}\nBusiness: Retail company\nBenefit: Improved ${desc.toLowerCase()}\nROI: Measurable improvement in efficiency`,
      `Connecting theory to practice makes concepts stick.`, "medium"),
    generateQuizStep(`${title} Implementation`, `What is key to implementing ${title.toLowerCase()}?`,
      [{ label: "A", text: "Just install software" }, { label: "B", text: "Strategic planning, stakeholder buy-in, and change management" }, { label: "C", text: "Ignore user requirements" }],
      "B", `Successful implementation requires careful planning, stakeholder engagement, and proper change management.`, "medium"),
    generateQuizStep(`${title} Risks`, `What risk is associated with ${title.toLowerCase()}?`,
      [{ label: "A", text: "No risks exist" }, { label: "B", text: "Poor adoption, data migration issues, and resistance to change" }, { label: "C", text: "Only financial risk" }],
      "B", `Common risks include poor user adoption, data quality issues, and organizational resistance.`, "hard"),
    generateQuizStep(`${title} Trends`, `What current trend relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Returning to paper-based systems" }, { label: "B", text: "Cloud computing, AI automation, and digital transformation" }, { label: "C", text: "Removing all technology" }],
      "B", `Modern trends like cloud computing and AI heavily influence ${title.toLowerCase()}.`, "medium"),
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
      generateTypingStep("IS Hierarchy", "Type the IS hierarchy!", "TPS -> MIS -> DSS -> EIS", "From operational (TPS) to strategic (EIS) — each level serves different management needs.", "easy"),
    ],
    "erp-systems": [
      generateQuizStep("ERP Definition", "What is ERP?", [{ label: "A", text: "An integrated system managing core business processes" }, { label: "B", text: "An email provider" }, { label: "C", text: "A social media platform" }], "A", "ERP integrates finance, HR, manufacturing, supply chain, and more into one system."),
      generateQuizStep("ERP Benefits", "What is a key ERP benefit?", [{ label: "A", text: "Single source of truth across the organization" }, { label: "B", text: "Free software" }, { label: "C", text: "No training needed" }], "A", "ERP eliminates data silos by providing one integrated database for all departments."),
      generateTypingStep("ERP Vendors", "Type major ERP vendors!", "SAP, Oracle, Microsoft Dynamics, Salesforce", "These are the leading ERP platforms used by enterprises worldwide.", "easy"),
    ],
    "crm-basics": [
      generateQuizStep("CRM Purpose", "What is the purpose of CRM?", [{ label: "A", text: "Managing interactions and relationships with customers" }, { label: "B", text: "Writing code" }, { label: "C", text: "Network administration" }], "A", "CRM systems track customer interactions across sales, marketing, and service touchpoints."),
      generateQuizStep("CRM Benefits", "What benefit does CRM provide?", [{ label: "A", text: "360-degree view of customers, improved retention" }, { label: "B", text: "Faster internet" }, { label: "C", text: "Free software" }], "A", "CRM gives a complete customer view, improving personalization and retention rates."),
      generateTypingStep("CRM Tools", "Type CRM platforms!", "Salesforce, HubSpot, Zoho CRM, Microsoft Dynamics", "These platforms help businesses manage customer relationships effectively.", "easy"),
    ],
    "digital-transformation": [
      generateQuizStep("Digital Transformation", "What is digital transformation?", [{ label: "A", text: "Fundamentally changing business operations using digital technology" }, { label: "B", text: "Buying a new computer" }, { label: "C", text: "Creating a website" }], "A", "Digital transformation reimagines how a business operates and delivers value using technology."),
      generateQuizStep("DX Pillars", "What are the pillars of digital transformation?", [{ label: "A", text: "Customer experience, operational processes, business models" }, { label: "B", text: "Hardware, software, data" }, { label: "C", text: "Sales, marketing, support" }], "A", "DX transforms customer experience, internal operations, and business models simultaneously."),
    ],
    "big-data": [
      generateQuizStep("5 Vs of Big Data", "What are the 5 Vs of Big Data?", [{ label: "A", text: "Volume, Velocity, Variety, Veracity, Value" }, { label: "B", text: "Variables, Values, Vectors, Views, Versions" }, { label: "C", text: "Virtual, Visual, Vocal, Vital, Valid" }], "A", "The 5 Vs define big data: Volume (size), Velocity (speed), Variety (types), Veracity (accuracy), Value (usefulness)."),
      generateTypingStep("Big Data Tools", "Name big data technologies!", "Hadoop, Spark, Kafka, MongoDB", "These technologies process and store massive datasets that traditional databases can't handle.", "medium"),
      generateTypingStep("5 Vs Drill", "Type the 5 Vs!", "Volume, Velocity, Variety, Veracity, Value", "Memorize these — they come up in every data science interview!", "easy"),
    ],
    "seo-fundamentals": [
      generateQuizStep("SEO Purpose", "What is SEO?", [{ label: "A", text: "Optimizing websites to rank higher in search engine results" }, { label: "B", text: "Paying for ads" }, { label: "C", text: "Social media marketing" }], "A", "SEO improves organic (unpaid) visibility in search engines like Google."),
      generateTypingStep("Meta Tags", "Write SEO meta tags!", '<meta name="description" content="Learn coding with interactive games">\n<title>CodeQuest - Learn Programming</title>', "Title and meta description are critical for search engine rankings.", "medium"),
      generateQuizStep("On-Page SEO", "Which is an on-page SEO factor?", [{ label: "A", text: "Title tags, headings, content quality, internal links" }, { label: "B", text: "Social media followers" }, { label: "C", text: "Server location" }], "A", "On-page SEO includes content, HTML tags, images, and internal linking."),
      generateTypingStep("SEO Checklist", "Type an SEO audit checklist!", "1. Title tag < 60 chars\n2. Meta description < 160 chars\n3. One H1 per page\n4. Alt text on images\n5. Mobile responsive", "Following this checklist ensures basic SEO compliance.", "medium"),
    ],
    "digital-marketing": [
      generateQuizStep("Digital Marketing Channels", "Which is a digital marketing channel?", [{ label: "A", text: "SEO, PPC, social media, email, content marketing" }, { label: "B", text: "Newspaper only" }, { label: "C", text: "Radio only" }], "A", "Digital marketing uses online channels to reach and engage target audiences."),
      generateTypingStep("Marketing Funnel", "Type the marketing funnel stages!", "Awareness -> Interest -> Consideration -> Conversion -> Retention", "The funnel guides prospects from discovery to loyal customer.", "medium"),
      generateQuizStep("KPIs", "What KPI measures email marketing success?", [{ label: "A", text: "Open rate, click-through rate, conversion rate" }, { label: "B", text: "Number of emails sent" }, { label: "C", text: "Email server uptime" }], "A", "Open rate, CTR, and conversion rate measure email campaign effectiveness."),
    ],
    "keyword-research": [
      generateQuizStep("Keyword Research", "What is keyword research?", [{ label: "A", text: "Finding terms people search for to target with content" }, { label: "B", text: "Choosing programming keywords" }, { label: "C", text: "Database indexing" }], "A", "Keyword research identifies search terms to create content that matches user intent."),
      generateTypingStep("Keyword Types", "Type keyword types!", "Short-tail: broad, high volume (e.g., 'shoes')\nLong-tail: specific, lower volume (e.g., 'best running shoes for flat feet')", "Long-tail keywords are easier to rank for and convert better.", "medium"),
      generateQuizStep("Search Intent", "What are the four types of search intent?", [{ label: "A", text: "Informational, navigational, transactional, commercial" }, { label: "B", text: "Fast, slow, medium, none" }, { label: "C", text: "Text, image, video, audio" }], "A", "Understanding intent helps create content that matches what users actually want."),
    ],
  };
  return content[id] || null;
}

// ======================== GAME DEVELOPMENT ========================
function generateGameDevSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getGameDevContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 7 practical game dev drilling steps
  return [
    generateQuizStep(`${title} Basics`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: "Database management" }, { label: "B", text: desc }, { label: "C", text: "Network administration" }],
      "B", `${title}: ${desc}. This is a core game development concept.`, "easy"),
    generateTypingStep(`${title} Code`, `Write game dev code for ${title.toLowerCase()}!`,
      `// ${title}\nfunction update(deltaTime) {\n  // ${desc}\n}`,
      `Game code runs in a loop — update() is called every frame.`, "easy"),
    generateQuizStep(`${title} in Engines`, `How is ${title.toLowerCase()} used in game engines?`,
      [{ label: "A", text: "It's never used in games" }, { label: "B", text: "It's a fundamental building block of game systems" }, { label: "C", text: "Only in 2D games" }],
      "B", `${title} is fundamental to how modern game engines create interactive experiences.`, "medium"),
    generateTypingStep(`${title} Implementation`, `Type a practical implementation!`,
      `class ${title.replace(/\s+/g, '')} {\n  constructor() {\n    this.active = true;\n  }\n  update(dt) {\n    // ${desc}\n  }\n}`,
      `Object-oriented patterns are the backbone of game architecture.`, "medium"),
    generateQuizStep(`${title} Performance`, `What performance consideration relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Performance doesn't matter in games" }, { label: "B", text: "Must run at 60fps — optimize for frame budget of 16.67ms" }, { label: "C", text: "Only matters on console" }],
      "B", `Games must maintain 60fps. Every system must fit within the 16.67ms frame budget.`, "hard"),
    generateQuizStep(`${title} Design Pattern`, `Which design pattern is commonly used for ${title.toLowerCase()}?`,
      [{ label: "A", text: "No patterns are used" }, { label: "B", text: "Component, Observer, State, or Command pattern" }, { label: "C", text: "Singleton only" }],
      "B", `Game development relies heavily on design patterns for clean, maintainable architecture.`, "medium"),
    generateTypingStep(`${title} Debug`, `Type debug code for ${title.toLowerCase()}!`,
      `// Debug ${title}\nconsole.log("${title} state:", this.active);\nconsole.log("FPS:", 1/deltaTime);`,
      `Debugging is essential — always log state and performance metrics during development.`, "easy"),
  ];
}

function getGameDevContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "game-loop": [
      generateQuizStep("Game Loop", "What is the game loop?", [{ label: "A", text: "The continuous cycle of input, update, render" }, { label: "B", text: "A type of for loop" }, { label: "C", text: "A loading screen" }], "A", "The game loop continuously processes input, updates game state, and renders frames."),
      generateTypingStep("Game Loop Code", "Write a basic game loop!", "while (running) {\n  processInput();\n  update(deltaTime);\n  render();\n}", "The game loop runs every frame — typically 60 times per second.", "medium"),
      generateQuizStep("Delta Time", "Why use delta time?", [{ label: "A", text: "To make movement frame-rate independent" }, { label: "B", text: "To count frames" }, { label: "C", text: "To slow down the game" }], "A", "Delta time ensures consistent movement speed regardless of frame rate."),
      generateTypingStep("Delta Time Code", "Use delta time in movement!", "position.x += velocity.x * deltaTime;\nposition.y += velocity.y * deltaTime;", "Multiplying by deltaTime makes movement smooth on any hardware.", "medium"),
    ],
    "collision-detection": [
      generateQuizStep("AABB Collision", "What is AABB collision detection?", [{ label: "A", text: "Axis-Aligned Bounding Box — rectangle overlap check" }, { label: "B", text: "A sound effect" }, { label: "C", text: "A rendering technique" }], "A", "AABB checks if two rectangles overlap by comparing their edges."),
      generateTypingStep("Collision Check", "Write a collision check!", "if (a.x < b.x + b.w && a.x + a.w > b.x &&\n    a.y < b.y + b.h && a.y + a.h > b.y) {\n  // collision!\n}", "AABB checks both X and Y axis overlap.", "medium"),
      generateTypingStep("Collision Drill", "Type collision check again!", "if (a.x < b.x + b.w && a.x + a.w > b.x &&\n    a.y < b.y + b.h && a.y + a.h > b.y) {\n  handleCollision(a, b);\n}", "Repetition builds muscle memory for this common pattern!", "medium"),
    ],
    "sprite-animation": [
      generateQuizStep("Sprite Sheet", "What is a sprite sheet?", [{ label: "A", text: "A single image containing multiple animation frames" }, { label: "B", text: "A spreadsheet for game data" }, { label: "C", text: "A 3D model" }], "A", "Sprite sheets combine all animation frames into one image for efficient rendering."),
      generateTypingStep("Animation Code", "Animate a sprite!", "frameTimer += deltaTime;\nif (frameTimer >= frameRate) {\n  currentFrame = (currentFrame + 1) % totalFrames;\n  frameTimer = 0;\n}", "Frame-based animation cycles through sprite sheet regions.", "medium"),
    ],
    "physics-basics": [
      generateQuizStep("Game Physics", "What is gravity in game physics?", [{ label: "A", text: "A constant downward acceleration applied each frame" }, { label: "B", text: "A visual effect" }, { label: "C", text: "A sound effect" }], "A", "Gravity is typically velocity.y += gravity * deltaTime each frame."),
      generateTypingStep("Apply Gravity", "Code gravity!", "velocity.y += gravity * deltaTime;\nposition.y += velocity.y * deltaTime;\nif (position.y >= ground) {\n  position.y = ground;\n  velocity.y = 0;\n}", "Check ground collision to prevent falling through the floor.", "medium"),
    ],
    "input-handling": [
      generateTypingStep("Keyboard Input", "Handle keyboard input!", "document.addEventListener('keydown', (e) => {\n  if (e.key === 'ArrowLeft') moveLeft();\n  if (e.key === 'ArrowRight') moveRight();\n  if (e.key === ' ') jump();\n});", "Event-based input handling responds to player actions.", "easy"),
      generateQuizStep("Input Polling vs Events", "What is input polling?", [{ label: "A", text: "Checking input state every frame in the game loop" }, { label: "B", text: "Waiting for events" }, { label: "C", text: "Ignoring input" }], "A", "Polling checks key states each frame for responsive controls; events handle discrete actions."),
    ],
    "state-machines": [
      generateQuizStep("Game States", "What is a finite state machine in games?", [{ label: "A", text: "A pattern where entities have defined states with transitions" }, { label: "B", text: "A random behavior system" }, { label: "C", text: "A rendering pipeline" }], "A", "FSMs manage game states: Menu → Playing → Paused → GameOver."),
      generateTypingStep("State Machine", "Code a state machine!", "switch (gameState) {\n  case 'menu': showMenu(); break;\n  case 'playing': update(); render(); break;\n  case 'paused': showPause(); break;\n  case 'gameover': showResults(); break;\n}", "State machines keep game logic organized and predictable.", "medium"),
    ],
  };
  return content[id] || null;
}

// ======================== COMPUTER SYSTEMS ========================
function generateComputerSystemsSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getComputerSystemsContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with 7 intensive hardware/systems drilling steps
  return [
    generateQuizStep(`${title} Fundamentals`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: "A type of software application" }, { label: "B", text: desc }, { label: "C", text: "A programming methodology" }],
      "B", `${title}: ${desc}. Understanding this is essential for computer systems knowledge.`, "easy"),
    generateTypingStep(`${title} Key Fact`, `Type the key fact about ${title.toLowerCase()}!`,
      `${title}: ${desc}`,
      `Being able to state this from memory demonstrates understanding.`, "easy"),
    generateQuizStep(`${title} Components`, `What component relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Only web browsers" }, { label: "B", text: "Hardware components and system architecture" }, { label: "C", text: "Social media platforms" }],
      "B", `${title} is closely related to hardware components and system architecture.`, "medium"),
    generateTypingStep(`${title} Technical Detail`, `Type a technical specification!`,
      `Component: ${title}\nFunction: ${desc}\nLayer: Hardware/System`,
      `Technical specifications help you communicate precisely about systems.`, "medium"),
    generateQuizStep(`${title} in Practice`, `How is ${title.toLowerCase()} applied in real systems?`,
      [{ label: "A", text: "Only in theory" }, { label: "B", text: "In system design, troubleshooting, and optimization" }, { label: "C", text: "Never in practice" }],
      "B", `Understanding ${title.toLowerCase()} helps with system design, diagnostics, and performance optimization.`, "medium"),
    generateQuizStep(`${title} Troubleshooting`, `A system with ${title.toLowerCase()} issues shows symptoms. What do you do?`,
      [{ label: "A", text: "Replace everything" }, { label: "B", text: "Isolate the problem, test systematically, apply the fix" }, { label: "C", text: "Ignore it" }],
      "B", `Systematic troubleshooting: isolate → test → fix → verify. This approach works for all systems.`, "hard"),
    generateTypingStep(`${title} Summary`, `Type the one-line summary!`,
      `${title} is essential for ${desc.toLowerCase()}.`,
      `You should now be able to explain this to anyone!`, "easy"),
  ];
}

function getComputerSystemsContent(id: string): LessonStep[] | null {
  const content: Record<string, LessonStep[]> = {
    "cpu-fundamentals": [
      generateQuizStep("CPU Components", "What are the main CPU components?", [{ label: "A", text: "ALU, Control Unit, Registers" }, { label: "B", text: "Monitor, keyboard, mouse" }, { label: "C", text: "RAM, ROM, Cache" }], "A", "The CPU contains the ALU (arithmetic), Control Unit (coordination), and Registers (fast storage)."),
      generateQuizStep("ALU Function", "What does the ALU do?", [{ label: "A", text: "Stores data permanently" }, { label: "B", text: "Performs arithmetic and logical operations" }, { label: "C", text: "Displays graphics" }], "B", "The Arithmetic Logic Unit performs calculations and comparisons."),
      generateTypingStep("CPU Registers", "Name CPU registers!", "ACC, PC, MAR, MDR, CIR", "Key registers: Accumulator, Program Counter, Memory Address/Data Registers.", "medium"),
      generateTypingStep("Register Functions", "Type register functions!", "ACC: stores calculation results\nPC: holds next instruction address\nMAR: holds memory address to access\nMDR: holds data being transferred", "Each register has a specific role in the fetch-decode-execute cycle.", "medium"),
    ],
    "instruction-cycle": [
      generateQuizStep("FDE Cycle", "What are the stages of the instruction cycle?", [{ label: "A", text: "Fetch, Decode, Execute" }, { label: "B", text: "Read, Write, Delete" }, { label: "C", text: "Input, Process, Output" }], "A", "The CPU continuously fetches instructions, decodes them, and executes them."),
      generateQuizStep("Fetch Stage", "What happens during fetch?", [{ label: "A", text: "The instruction is read from memory into the CPU" }, { label: "B", text: "The result is displayed" }, { label: "C", text: "Data is saved to disk" }], "A", "During fetch, the instruction at the address in the Program Counter is loaded."),
      generateTypingStep("FDE Steps", "Type the FDE cycle steps!", "FETCH: PC -> MAR -> Memory -> MDR -> CIR, PC+1\nDECODE: CIR decoded by Control Unit\nEXECUTE: ALU performs operation", "Understanding FDE at register level is essential for computer science.", "hard"),
    ],
    "lmc-intro": [
      generateQuizStep("LMC Model", "What is the Little Man Computer?", [{ label: "A", text: "A simplified model of how a CPU works" }, { label: "B", text: "A small laptop" }, { label: "C", text: "A mobile app" }], "A", "The LMC is an educational model that simulates basic CPU operations."),
      generateQuizStep("LMC Mailboxes", "How many mailboxes does the LMC have?", [{ label: "A", text: "10" }, { label: "B", text: "100 (00-99)" }, { label: "C", text: "1000" }], "B", "The LMC has 100 mailboxes (memory locations) numbered 00 to 99."),
      generateTypingStep("LMC Add", "Write LMC instructions!", "INP\nSTA 99\nINP\nADD 99\nOUT\nHLT", "This LMC program adds two inputs together and outputs the result.", "medium"),
      generateTypingStep("LMC Drill", "Type it again from memory!", "INP\nSTA 99\nINP\nADD 99\nOUT\nHLT", "Repetition makes LMC programming automatic. You should know this pattern!", "medium"),
    ],
    "lmc-instructions": [
      generateQuizStep("LMC Instructions", "What does STA do in LMC?", [{ label: "A", text: "Stores the accumulator value in a mailbox" }, { label: "B", text: "Starts the program" }, { label: "C", text: "Stops execution" }], "A", "STA (Store) copies the accumulator's value to the specified mailbox."),
      generateQuizStep("LDA Instruction", "What does LDA do?", [{ label: "A", text: "Loads a value from a mailbox into the accumulator" }, { label: "B", text: "Loads a program" }, { label: "C", text: "Loops the program" }], "A", "LDA (Load) copies a mailbox's value into the accumulator."),
      generateTypingStep("LMC Program", "Write a subtraction program!", "INP\nSTA 99\nINP\nSUB 99\nOUT\nHLT", "This program subtracts the first input from the second.", "medium"),
      generateTypingStep("LMC Instructions", "Type all LMC instructions!", "INP: Input\nOUT: Output\nSTA: Store\nLDA: Load\nADD: Add\nSUB: Subtract\nBRA: Branch Always\nBRZ: Branch if Zero\nBRP: Branch if Positive\nHLT: Halt", "Memorize all 10 LMC instructions — they're the building blocks!", "hard"),
    ],
    "osi-model": [
      generateQuizStep("OSI Layers", "How many layers does the OSI model have?", [{ label: "A", text: "4" }, { label: "B", text: "7" }, { label: "C", text: "5" }], "B", "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."),
      generateTypingStep("OSI Mnemonic", "Type the OSI layers mnemonic!", "Please Do Not Throw Sausage Pizza Away", "This mnemonic helps remember: Physical, Data Link, Network, Transport, Session, Presentation, Application.", "easy"),
      generateQuizStep("Layer 3", "What does the Network layer handle?", [{ label: "A", text: "Physical cabling" }, { label: "B", text: "Routing and IP addressing" }, { label: "C", text: "Application protocols" }], "B", "Layer 3 (Network) handles logical addressing and routing between networks."),
      generateTypingStep("OSI Layers Drill", "Type all 7 layers!", "7. Application\n6. Presentation\n5. Session\n4. Transport\n3. Network\n2. Data Link\n1. Physical", "Know these backwards and forwards!", "medium"),
      generateQuizStep("Layer 4", "What does the Transport layer provide?", [{ label: "A", text: "Physical connectivity" }, { label: "B", text: "End-to-end communication, flow control (TCP/UDP)" }, { label: "C", text: "Email delivery" }], "B", "Transport layer provides reliable (TCP) or fast (UDP) end-to-end delivery."),
    ],
    "subnetting-intro": [
      generateQuizStep("Subnetting Purpose", "Why do we subnet networks?", [{ label: "A", text: "To divide large networks into smaller, manageable segments" }, { label: "B", text: "To make the internet faster" }, { label: "C", text: "To remove firewalls" }], "A", "Subnetting divides networks for better management, security, and efficiency."),
      generateQuizStep("Subnet Mask", "What does a subnet mask determine?", [{ label: "A", text: "Which part is network and which is host" }, { label: "B", text: "The internet speed" }, { label: "C", text: "The computer's name" }], "A", "Subnet masks separate the network portion from the host portion of an IP address."),
      generateTypingStep("CIDR Notation", "Write CIDR notation!", "192.168.1.0/24", "/24 means 24 bits for network = 256 addresses (254 usable hosts).", "medium"),
      generateTypingStep("Subnet Masks", "Type common subnet masks!", "/8  = 255.0.0.0\n/16 = 255.255.0.0\n/24 = 255.255.255.0\n/28 = 255.255.255.240", "These are the most common subnet masks you'll encounter.", "medium"),
    ],
    "ipv4-intro": [
      generateQuizStep("IPv4 Format", "How many bits is an IPv4 address?", [{ label: "A", text: "16 bits" }, { label: "B", text: "32 bits" }, { label: "C", text: "64 bits" }], "B", "IPv4 addresses are 32 bits long, written as four octets (e.g., 192.168.1.1)."),
      generateTypingStep("IP Address", "Type an IP address!", "192.168.1.1", "Each octet ranges from 0-255, separated by dots.", "easy"),
      generateQuizStep("Private IP Range", "Which is a private IP range?", [{ label: "A", text: "192.168.0.0 - 192.168.255.255" }, { label: "B", text: "8.8.8.0 - 8.8.8.255" }, { label: "C", text: "1.0.0.0 - 1.255.255.255" }], "A", "192.168.x.x is a Class C private range (RFC 1918)."),
      generateTypingStep("Private IP Ranges", "Type all private ranges!", "Class A: 10.0.0.0/8\nClass B: 172.16.0.0/12\nClass C: 192.168.0.0/16", "Private addresses are not routable on the public internet.", "medium"),
    ],
    "memory-types": [
      generateQuizStep("RAM vs ROM", "What is the main difference between RAM and ROM?", [{ label: "A", text: "RAM is volatile (loses data when off), ROM is non-volatile" }, { label: "B", text: "They are the same" }, { label: "C", text: "ROM is faster" }], "A", "RAM stores temporary data while running. ROM stores permanent instructions."),
      generateTypingStep("Memory Hierarchy", "Type the memory hierarchy!", "Registers (fastest)\nCache (L1, L2, L3)\nRAM\nSSD/HDD\nCloud/Tape (slowest)", "Speed decreases and capacity increases as you go down the hierarchy.", "medium"),
      generateQuizStep("Cache Purpose", "What is CPU cache for?", [{ label: "A", text: "Storing frequently accessed data close to the CPU for speed" }, { label: "B", text: "Long-term storage" }, { label: "C", text: "Display output" }], "A", "Cache stores recently used data to avoid slow main memory accesses."),
    ],
    "binary-representation": [
      generateQuizStep("Character Encoding", "What is ASCII?", [{ label: "A", text: "7-bit character encoding for English characters" }, { label: "B", text: "A programming language" }, { label: "C", text: "A network protocol" }], "A", "ASCII uses 7 bits to represent 128 characters including letters, digits, and symbols."),
      generateTypingStep("ASCII Values", "Type ASCII values!", "A = 65, B = 66, a = 97, 0 = 48", "Uppercase A starts at 65, lowercase a at 97, digit 0 at 48.", "easy"),
      generateQuizStep("Unicode", "Why was Unicode created?", [{ label: "A", text: "To represent all world languages and symbols" }, { label: "B", text: "To replace ASCII completely" }, { label: "C", text: "For faster processing" }], "A", "Unicode supports 143,000+ characters from every writing system worldwide."),
    ],
  };
  return content[id] || null;
}

// ======================== WEB TECHNOLOGIES ========================
function generateWebSteps(id: string, title: string, desc: string): LessonStep[] {
  const topicContent = getWebContent(id);
  if (topicContent) return topicContent;

  // Enhanced fallback with code snippets and drilling
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

  steps.push(generateTypingStep(`${title} Practice`, `Type code for ${title.toLowerCase()}!`,
    `// ${title}\n// ${desc}\nconsole.log("Implementing ${title.toLowerCase()}");`,
    `Writing code builds muscle memory for web development patterns.`, "easy"));

  steps.push(generateQuizStep(`${title} Best Practices`, `What is important when implementing ${title.toLowerCase()}?`,
    [{ label: "A", text: "Ignoring browser compatibility" }, { label: "B", text: "Following web standards, accessibility, and performance guidelines" }, { label: "C", text: "Using deprecated features" }],
    "B", `Following web standards ensures your implementation works across all browsers and devices.`, "medium"));

  // Repeat the code snippet for drilling
  if (webSnippet) {
    steps.push(generateTypingStep(`Drill: ${webSnippet.title}`, `Type it again for muscle memory!`, webSnippet.code, `Repetition makes this pattern automatic!`, webSnippet.difficulty));
  }

  steps.push(generateQuizStep(`${title} in Production`, `What must you consider when deploying ${title.toLowerCase()} to production?`,
    [{ label: "A", text: "Nothing special" }, { label: "B", text: "Performance, security, accessibility, and SEO" }, { label: "C", text: "Only visual design" }],
    "B", `Production-ready web code must be performant, secure, accessible, and SEO-optimized.`, "hard"));

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
      generateTypingStep("Status Codes", "Type common status codes!", "200: OK\n301: Redirect\n404: Not Found\n500: Server Error", "Memorize these — you'll use them daily in web development!", "easy"),
    ],
    // ===== HTML Essentials =====
    "html-intro": [
      generateQuizStep("HTML Purpose", "What does HTML stand for?", [{ label: "A", text: "HyperText Markup Language" }, { label: "B", text: "High Tech Modern Language" }, { label: "C", text: "Home Tool Markup Language" }], "A", "HTML is the standard markup language for creating web pages."),
      generateQuizStep("HTML Elements", "What are HTML elements made of?", [{ label: "A", text: "Opening tag, content, closing tag" }, { label: "B", text: "Only text" }, { label: "C", text: "Only images" }], "A", "Most HTML elements have an opening tag, content, and closing tag: <p>content</p>"),
      generateTypingStep("Paragraph", "Create a paragraph!", "<p>Hello, World!</p>", "The <p> tag defines a paragraph of text.", "easy"),
      generateTypingStep("Heading", "Create a heading!", "<h1>Welcome to My Website</h1>", "h1 is the most important heading. Use only one per page for SEO.", "easy"),
    ],
    "html-structure": [
      generateQuizStep("DOCTYPE", "What does <!DOCTYPE html> declare?", [{ label: "A", text: "That the document is HTML5" }, { label: "B", text: "A comment" }, { label: "C", text: "A variable" }], "A", "DOCTYPE tells the browser this is an HTML5 document."),
      generateTypingStep("HTML Document", "Create an HTML structure!", "<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", "Every HTML document starts with DOCTYPE and has head and body sections.", "easy"),
      generateTypingStep("HTML Boilerplate Drill", "Type it again from memory!", "<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", "This should be automatic — you'll type this thousands of times!", "easy"),
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
      generateTypingStep("Image Element", "Add an image!", '<img src="photo.jpg" alt="A sunset over the ocean">', "Always include descriptive alt text for accessibility and SEO.", "easy"),
    ],
    "html-lists": [
      generateTypingStep("Unordered List", "Create a list!", "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>", "ul creates bullet lists. ol creates numbered lists.", "easy"),
      generateQuizStep("List Types", "What's the difference between <ul> and <ol>?", [{ label: "A", text: "ul = unordered (bullets), ol = ordered (numbers)" }, { label: "B", text: "They are identical" }, { label: "C", text: "ul is newer" }], "A", "Use ul for unordered bullet lists, ol for ordered numbered lists."),
    ],
    "html-tables": [
      generateTypingStep("HTML Table", "Create a table!", "<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Alice</td><td>25</td></tr>\n</table>", "Tables use tr for rows, th for headers, td for data cells.", "medium"),
      generateQuizStep("Table Semantics", "When should you use tables?", [{ label: "A", text: "For page layout" }, { label: "B", text: "For tabular data only" }, { label: "C", text: "For navigation" }], "B", "Tables should only be used for tabular data, never for page layout."),
    ],
    "html-forms": [
      generateTypingStep("HTML Form", "Create a login form!", '<form action="/login" method="POST">\n  <input type="email" name="email" required>\n  <input type="password" name="pass" required>\n  <button type="submit">Login</button>\n</form>', "Forms collect user input. method='POST' sends data securely.", "medium"),
      generateQuizStep("Input Types", "Which input type creates a password field?", [{ label: "A", text: 'type="text"' }, { label: "B", text: 'type="password"' }, { label: "C", text: 'type="hidden"' }], "B", "type='password' masks the input characters for security."),
    ],
    "html-semantic": [
      generateTypingStep("Semantic HTML", "Use semantic elements!", "<header>Logo & Nav</header>\n<main>\n  <article>Content</article>\n</main>\n<footer>Copyright</footer>", "Semantic elements describe meaning: header, nav, main, article, section, footer.", "medium"),
      generateQuizStep("Why Semantic?", "Why use semantic HTML?", [{ label: "A", text: "Better accessibility, SEO, and maintainability" }, { label: "B", text: "Faster loading" }, { label: "C", text: "More colors" }], "A", "Semantic HTML helps screen readers, search engines, and developers understand content structure."),
    ],
    // ===== CSS Basics =====
    "css-intro": [
      generateQuizStep("CSS Purpose", "What does CSS stand for?", [{ label: "A", text: "Cascading Style Sheets" }, { label: "B", text: "Computer Style System" }, { label: "C", text: "Creative Style Script" }], "A", "CSS controls the visual presentation of HTML elements."),
      generateTypingStep("CSS Rule", "Write a CSS rule!", "h1 {\n  color: blue;\n  font-size: 2rem;\n}", "CSS rules have a selector, curly braces, and property-value pairs.", "easy"),
    ],
    "css-selectors": [
      generateTypingStep("CSS Selectors", "Write different selectors!", ".class { }\n#id { }\nelement { }\n.parent .child { }", "Class (.), ID (#), element, and descendant selectors are the most common.", "easy"),
      generateQuizStep("Specificity", "Which selector has highest specificity?", [{ label: "A", text: "#id" }, { label: "B", text: ".class" }, { label: "C", text: "element" }], "A", "Specificity: inline > #id > .class > element. Higher specificity wins."),
    ],
    "css-colors": [
      generateTypingStep("Color Values", "Set colors in different formats!", "color: red;\ncolor: #ff0000;\ncolor: rgb(255, 0, 0);\ncolor: hsl(0, 100%, 50%);", "CSS supports named colors, hex, RGB, and HSL formats.", "easy"),
      generateQuizStep("HSL Format", "What does HSL stand for?", [{ label: "A", text: "Hue, Saturation, Lightness" }, { label: "B", text: "Height, Size, Length" }, { label: "C", text: "Hot, Simple, Light" }], "A", "HSL is intuitive: Hue (0-360°), Saturation (0-100%), Lightness (0-100%)."),
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
      generateTypingStep("Flexbox Drill", "Type flexbox from memory!", ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}", "Flexbox with gap is the most common layout pattern in modern CSS.", "medium"),
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
      generateTypingStep("Variables Drill", "Type variables again!", 'const PI = 3.14159;\nlet score = 0;\nlet name = "Player";', "const for constants, let for variables that change.", "easy"),
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
      generateTypingStep("useEffect Drill", "Write useEffect!", "useEffect(() => {\n  fetchData();\n  return () => cleanup();\n}, [dependency]);", "The cleanup function runs when the component unmounts or before re-running.", "medium"),
    ],
    // ===== SEO & Performance =====
    "seo-basics": [
      generateQuizStep("SEO Purpose", "What is SEO?", [{ label: "A", text: "Optimizing websites to rank higher in search engine results" }, { label: "B", text: "Paying for ads" }, { label: "C", text: "Social media marketing" }], "A", "SEO improves organic (unpaid) visibility in search engines like Google."),
      generateTypingStep("Title Tag", "Write an SEO title!", '<title>Learn JavaScript - Free Interactive Tutorials | CodeQuest</title>', "Title tags should be under 60 characters with the primary keyword first.", "medium"),
      generateTypingStep("Meta Description", "Write a meta description!", '<meta name="description" content="Master JavaScript with 100+ interactive coding challenges. Free tutorials for beginners to advanced developers.">', "Meta descriptions should be under 160 characters and compelling.", "medium"),
      generateQuizStep("SEO Factors", "Which is NOT a Google ranking factor?", [{ label: "A", text: "Page speed" }, { label: "B", text: "Content quality" }, { label: "C", text: "Font color" }], "C", "Key ranking factors: content quality, backlinks, page speed, mobile-friendliness, user experience."),
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
  const snippets: Record<string, { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }> = {
    "html5-apis": { title: "Canvas API", prompt: "Draw on canvas!", code: 'const ctx = canvas.getContext("2d");\nctx.fillStyle = "red";\nctx.fillRect(10, 10, 100, 50);', explanation: "The Canvas API allows drawing 2D graphics with JavaScript.", difficulty: "medium" },
    "svg-basics": { title: "SVG Circle", prompt: "Create an SVG!", code: '<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" fill="blue"/>\n</svg>', explanation: "SVG elements are defined in XML and scale without losing quality.", difficulty: "easy" },
    "html-meta": { title: "Meta Tags", prompt: "Add meta tags!", code: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="My page">', explanation: "Meta tags provide metadata about the HTML document for browsers and search engines.", difficulty: "easy" },
    "html-responsive": { title: "Responsive Image", prompt: "Use srcset!", code: '<img srcset="small.jpg 480w, large.jpg 800w"\n  sizes="(max-width: 600px) 480px, 800px"\n  src="large.jpg" alt="Photo">', explanation: "srcset lets browsers choose the best image size for the device.", difficulty: "medium" },
    "schema-markup": { title: "JSON-LD", prompt: "Add structured data!", code: '<script type="application/ld+json">\n{"@context":"https://schema.org","@type":"Article","name":"My Article"}\n</script>', explanation: "JSON-LD structured data helps search engines understand your content.", difficulty: "medium" },
    "seo-technical": { title: "Robots.txt", prompt: "Create robots.txt!", code: "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml", explanation: "robots.txt tells search engine crawlers which pages to access.", difficulty: "easy" },
    "serverless-functions": { title: "Serverless Function", prompt: "Write a serverless function!", code: "export default async function handler(req, res) {\n  const data = await fetchData();\n  res.json(data);\n}", explanation: "Serverless functions run on-demand without managing servers.", difficulty: "medium" },
    "microservices-web": { title: "Service Architecture", prompt: "Define a microservice!", code: "// User Service\napp.get('/api/users/:id', async (req, res) => {\n  const user = await db.users.find(req.params.id);\n  res.json(user);\n});", explanation: "Microservices split applications into independent, deployable services.", difficulty: "hard" },
    "pwa-basics": { title: "Service Worker", prompt: "Register a service worker!", code: "if ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js');\n}", explanation: "Service workers enable offline functionality and push notifications.", difficulty: "medium" },
    "web-accessibility": { title: "ARIA Labels", prompt: "Add accessibility attributes!", code: '<button aria-label="Close dialog" aria-expanded="false">\n  <span aria-hidden="true">&times;</span>\n</button>', explanation: "ARIA attributes improve accessibility for screen reader users.", difficulty: "medium" },
    "web-performance": { title: "Lazy Loading", prompt: "Lazy load images!", code: '<img src="photo.jpg" loading="lazy" alt="Photo">\n<script type="module" src="app.js"></script>', explanation: "Lazy loading defers resource loading until needed, improving initial page speed.", difficulty: "easy" },
    "api-design": { title: "REST API", prompt: "Design a REST endpoint!", code: "// REST API Design\nGET    /api/users      - List users\nPOST   /api/users      - Create user\nGET    /api/users/:id   - Get user\nPUT    /api/users/:id   - Update user\nDELETE /api/users/:id   - Delete user", explanation: "REST APIs use HTTP methods and meaningful URLs for CRUD operations.", difficulty: "medium" },
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
    generateTypingStep(`${title} Definition`, `Type the key definition!`,
      `${title}: ${desc}`,
      `Typing definitions from memory builds recall.`, "easy"),
    generateQuizStep(`${title} Application`, `How is ${title.toLowerCase()} applied?`,
      [{ label: "A", text: "Only in textbooks" }, { label: "B", text: "In real-world computing scenarios" }, { label: "C", text: "It has no practical use" }],
      "B", `${title} has many practical applications in computing and technology.`, "medium"),
    generateTypingStep(`${title} Practice`, `Type it again for memory!`,
      `${title}: ${desc}`,
      `Repetition builds automatic recall of key concepts.`, "easy"),
    generateQuizStep(`${title} Mastery`, `Can you explain ${title.toLowerCase()} to someone else?`,
      [{ label: "A", text: "No, it's too complex" }, { label: "B", text: "Yes: " + desc.toLowerCase() }, { label: "C", text: "I need to look it up" }],
      "B", `If you can explain it simply, you truly understand it.`, "medium"),
  ];
}
