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
  
  // Step 1: Context — why this matters (assumes ZERO knowledge)
  steps.push(generateQuizStep(
    `Why learn ${title}?`,
    `You're learning to code from scratch. ${title} is a concept you'll use when building apps, games, and websites. Which best describes it?`,
    [{ label: "A", text: desc }, { label: "B", text: "A type of computer hardware" }, { label: "C", text: "Something you can skip" }],
    "A", `${title}: ${desc}. Don't worry if this is new — we'll break it down step by step until it feels automatic.`, "easy"
  ));

  // Step 2 & 3: Code typing drills
  const codeSnippets = getJavaCodeSnippet(id, title);
  codeSnippets.forEach(snippet => {
    steps.push(generateTypingStep(snippet.title, snippet.prompt, snippet.code, snippet.explanation, snippet.difficulty));
  });

  // Step 4: Understanding check
  steps.push(generateQuizStep(
    `${title} explained simply`, `In your own words, ${title.toLowerCase()} is used for:`,
    [{ label: "A", text: `${desc}` }, { label: "B", text: "Deleting files from your computer" }, { label: "C", text: "Making the screen change colour" }],
    "A", `Exactly! ${title} is about ${desc.toLowerCase()}. You'll use this pattern hundreds of times in real projects.`, "easy"
  ));

  // Step 5: Repetition drill — type the main pattern again
  if (codeSnippets.length > 0) {
    const mainSnippet = codeSnippets[0];
    steps.push(generateTypingStep(
      `Drill: ${mainSnippet.title}`, `Type it again from memory — this builds the muscle memory that makes coding feel natural.`, mainSnippet.code,
      `Each repetition makes this pattern more automatic. Professional developers type patterns like this without thinking.`, mainSnippet.difficulty
    ));
  }

  // Step 6: Best practice quiz
  steps.push(generateQuizStep(
    `${title} best practice`, `When using ${title.toLowerCase()} in a real project, you should:`,
    [{ label: "A", text: "Write clear code and test it" }, { label: "B", text: "Never test anything" }, { label: "C", text: "Copy code without understanding it" }],
    "A", `Clean, tested code is what separates beginners from professionals. You're building that habit now.`, "medium"
  ));

  // Step 7: Application scenario
  steps.push(generateQuizStep(
    `Real-world ${title}`, `You're building a mobile app and need to use ${title.toLowerCase()}. What's your approach?`,
    [{ label: "A", text: "Skip it — it's not important" }, { label: "B", text: "Recall the pattern you drilled, plan, then code" }, { label: "C", text: "Ask someone else to do it" }],
    "B", `You now know the pattern. In a real project, you'd recall this exact syntax and apply it. That's professional fluency.`, "hard"
  ));

  // Step 8: Final speed drill
  if (codeSnippets.length > 0) {
    steps.push(generateTypingStep(
      `Speed drill: ${title}`, `Last time — type as fast as you can!`,
      codeSnippets[codeSnippets.length > 1 ? 1 : 0].code,
      `Three repetitions locks this into long-term memory. ${title} syntax is now becoming second nature!`, "medium"
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

  // Zero-knowledge fallback: teaches from absolute scratch
  return [
    generateQuizStep(`Why learn ${title}?`, `You're learning about building real systems from scratch. ${title} is essential because:`,
      [{ label: "A", text: desc }, { label: "B", text: "It's only used in old technology" }, { label: "C", text: "It has no practical use" }],
      "A", `${title}: ${desc}. This is used by analysts and developers worldwide to build real business systems. You'll learn it step by step.`, "easy"),
    generateTypingStep(`Define ${title}`, `Type this definition to start building your memory:`,
      `${title}: ${desc}`,
      `Typing it helps your brain store it. You're building the same skills professionals use every day.`, "easy"),
    generateQuizStep(`${title} in real life`, `Imagine you're hired to build an app. Where does ${title.toLowerCase()} fit?`,
      [{ label: "A", text: "You'd never use it" }, { label: "B", text: "During planning and design — before writing any code" }, { label: "C", text: "Only after the app crashes" }],
      "B", `${title} happens during planning. Professional teams always plan before coding — this prevents expensive mistakes.`, "medium"),
    generateTypingStep(`${title} step-by-step`, `Type the steps a professional would follow:`,
      `Step 1: Understand what's needed\nStep 2: Apply ${title}\nStep 3: Document your decisions\nStep 4: Get feedback and refine`,
      `This is exactly how it works in real companies. You now know the professional workflow.`, "medium"),
    generateQuizStep(`Who uses ${title}?`, `${title.toLowerCase()} benefits:`,
      [{ label: "A", text: "Only senior managers" }, { label: "B", text: "Everyone on the project — developers, users, and managers" }, { label: "C", text: "Nobody — it's outdated" }],
      "B", `All stakeholders benefit. Good ${title.toLowerCase()} means better communication and fewer costly mistakes.`, "medium"),
    generateTypingStep(`${title} drill`, `Type it again — faster this time:`,
      `${title}: ${desc}`,
      `Second repetition locks this into long-term memory. Professional fluency is built through repetition.`, "medium"),
    generateQuizStep(`${title} mastery`, `Could you explain ${title.toLowerCase()} to a teammate who's never heard of it?`,
      [{ label: "A", text: `Yes: ${desc.substring(0, 70)}` }, { label: "B", text: "No, I'd need to look it up" }, { label: "C", text: "It's too complex to explain simply" }],
      "A", `If you can explain it simply, you truly own it. Well done — ${title} is now part of your professional toolkit.`, "medium"),
    generateTypingStep(`Final drill: ${title}`, `One last time from memory:`,
      `${title} ensures quality through structured ${desc.toLowerCase()}.`,
      `Three repetitions is the minimum for permanent retention. You've completed the mastery cycle!`, "easy"),
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

  // Zero-knowledge fallback — teaches math from scratch
  return [
    generateQuizStep(`Why learn ${title}?`, `You've never seen this before — that's fine! ${title} is a maths concept used in computing. Which describes it?`,
      [{ label: "A", text: desc }, { label: "B", text: "A type of computer virus" }, { label: "C", text: "A hardware component" }],
      "A", `${title}: ${desc}. Every programmer uses maths — and we'll make it simple and memorable.`, "easy"),
    generateTypingStep(`Define ${title}`, `Type this to start building your memory:`,
      `${title}: ${desc}`,
      `Typing definitions activates motor memory — a trick professional learners use.`, "easy"),
    generateQuizStep(`${title} in coding`, `How does ${title.toLowerCase()} help when building apps or games?`,
      [{ label: "A", text: "It doesn't — maths is separate from coding" }, { label: "B", text: "It powers algorithms, data analysis, and problem-solving" }, { label: "C", text: "Only mathematicians need it" }],
      "B", `${title} underpins algorithms and logic. Every piece of software uses mathematical thinking.`, "medium"),
    generateQuizStep(`Solve with ${title}`, `A problem requires ${title.toLowerCase()}. What's the professional approach?`,
      [{ label: "A", text: "Give up immediately" }, { label: "B", text: "Break it into small steps, apply the concept, verify the result" }, { label: "C", text: "Guess randomly" }],
      "B", `Professionals break problems into steps. You're learning to think like one right now.`, "medium"),
    generateTypingStep(`${title} drill`, `Type it again — build that recall:`,
      `${title}: ${desc}`,
      `Repetition turns knowledge into instinct. This is how fluency works.`, "medium"),
    generateQuizStep(`${title} mastery`, `Can you explain ${title.toLowerCase()} in one sentence?`,
      [{ label: "A", text: `Yes: ${desc.substring(0, 80)}` }, { label: "B", text: "No — it's too complicated" }, { label: "C", text: "I've already forgotten" }],
      "A", `You've got it! ${title} is now part of your computing toolkit.`, "medium"),
    generateTypingStep(`Final drill: ${title}`, `Last time — aim for speed:`,
      `${title}: ${desc}`,
      `Three repetitions locks it in permanently. Well done!`, "easy"),
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
    "binary-basics": [
      generateQuizStep("Binary Foundation", "Computers use binary because transistors have how many states?", [{ label: "A", text: "Two: ON (1) and OFF (0)" }, { label: "B", text: "Ten states" }, { label: "C", text: "Infinite states" }], "A", "Transistors are tiny switches — ON=1, OFF=0. Everything in computing is built from this."),
      generateTypingStep("Place Values", "Type the first 8 binary place values!", "128  64  32  16  8  4  2  1", "Each position is a power of 2. Memorize this row — you'll use it constantly!", "easy"),
      generateQuizStep("Binary to Decimal", "What is 1100 in decimal?", [{ label: "A", text: "12" }, { label: "B", text: "8" }, { label: "C", text: "14" }], "A", "1100: (1×8) + (1×4) + (0×2) + (0×1) = 12."),
      generateTypingStep("Decimal to Binary", "Convert 25 to binary!", "25 = 11001\n16+8+0+0+1 = 25", "Method: Find the largest power of 2 that fits, subtract, repeat.", "medium"),
      generateQuizStep("8-bit Range", "What is the range of an 8-bit unsigned binary number?", [{ label: "A", text: "0 to 255" }, { label: "B", text: "0 to 128" }, { label: "C", text: "0 to 511" }], "A", "8 bits: 00000000 (0) to 11111111 (255). That's 2^8 = 256 values."),
      generateTypingStep("Quick Conversions", "Convert these decimal numbers to binary!", "7 = 111\n15 = 1111\n31 = 11111\n63 = 111111", "Pattern: 2^n - 1 = all 1s in binary. 7=2³-1, 15=2⁴-1, etc.", "medium"),
      generateQuizStep("Bits and Bytes", "How many bits are in a byte?", [{ label: "A", text: "4" }, { label: "B", text: "8" }, { label: "C", text: "16" }], "A", "1 byte = 8 bits. 1 nibble = 4 bits. 1 kilobyte = 1024 bytes."),
      generateTypingStep("Binary Drill", "Convert 200 to binary!", "200 = 11001000\n128+64+0+0+8+0+0+0 = 200", "For large numbers, work left to right through the place values.", "hard"),
    ],
    "counting-binary": [
      generateTypingStep("Count in Binary", "Count from 0 to 15 in binary!", "0000 = 0\n0001 = 1\n0010 = 2\n0011 = 3\n0100 = 4\n0101 = 5\n0110 = 6\n0111 = 7\n1000 = 8", "Notice the pattern: the rightmost bit alternates every number, the next every 2, then every 4...", "easy"),
      generateQuizStep("Next Number", "What comes after 0111 in binary?", [{ label: "A", text: "1000" }, { label: "B", text: "0112" }, { label: "C", text: "1111" }], "A", "0111 = 7, next is 8 = 1000. When all bits are 1, carry to the next position."),
      generateTypingStep("Continue Counting", "Count from 8 to 15!", "1000 = 8\n1001 = 9\n1010 = 10\n1011 = 11\n1100 = 12\n1101 = 13\n1110 = 14\n1111 = 15", "With 4 bits you can represent 16 values (0-15). This is one nibble.", "medium"),
      generateQuizStep("Pattern Recognition", "In binary counting, how often does bit 2 (from right) toggle?", [{ label: "A", text: "Every 2 numbers" }, { label: "B", text: "Every number" }, { label: "C", text: "Every 4 numbers" }], "A", "Bit 0 toggles every 1, bit 1 every 2, bit 2 every 4, bit 3 every 8."),
      generateTypingStep("Speed Drill", "Type binary 0-7 from memory!", "000, 001, 010, 011, 100, 101, 110, 111", "This should become automatic — like counting 1,2,3 in decimal!", "medium"),
    ],
    "binary-subtraction": [
      generateQuizStep("Binary Subtraction", "What is 1010 - 0011?", [{ label: "A", text: "0111" }, { label: "B", text: "1001" }, { label: "C", text: "0110" }], "A", "1010 (10) - 0011 (3) = 0111 (7). Borrow from the next column when needed."),
      generateTypingStep("Borrowing in Binary", "Subtract with borrowing!", "  1010\n- 0011\n------\n  0111", "When subtracting 1 from 0, borrow from the next column: 10-1=1.", "medium"),
      generateQuizStep("Borrow Rule", "When subtracting 1 from 0 in binary, what do you do?", [{ label: "A", text: "Borrow 1 from the next column, making it 10 (2), then 10-1=1" }, { label: "B", text: "The result is -1" }, { label: "C", text: "Skip the column" }], "A", "Borrowing in binary: borrow 1 from the left column. 10₂ - 1₂ = 1₂."),
      generateTypingStep("Practice Subtraction", "Subtract 1100 - 0101!", "  1100\n- 0101\n------\n  0111", "12 - 5 = 7. Work right to left, borrowing when the top bit < bottom bit.", "medium"),
      generateQuizStep("Two's Complement Method", "What is an alternative to binary subtraction?", [{ label: "A", text: "Add the two's complement of the subtrahend" }, { label: "B", text: "Multiply instead" }, { label: "C", text: "Use hexadecimal" }], "A", "A - B = A + (two's complement of B). This lets CPUs use addition circuits for subtraction."),
      generateTypingStep("Subtraction Drill", "Subtract 11000 - 01011!", "  11000\n- 01011\n-------\n  01101", "24 - 11 = 13. Multiple borrows cascade through columns.", "hard"),
    ],
    "binary-multiplication": [
      generateQuizStep("Binary Multiply Rules", "What is 1 × 1 in binary?", [{ label: "A", text: "1" }, { label: "B", text: "10" }, { label: "C", text: "0" }], "A", "Binary multiplication: 0×0=0, 0×1=0, 1×0=0, 1×1=1. Same as decimal!"),
      generateTypingStep("Multiply Step by Step", "Multiply 101 × 11!", "    101\n  ×  11\n  -----\n    101  (101 × 1)\n  1010  (101 × 1, shifted left)\n  -----\n  1111", "5 × 3 = 15. Shift and add — the same algorithm CPUs use!", "medium"),
      generateQuizStep("Shift and Add", "Binary multiplication is equivalent to:", [{ label: "A", text: "Shifting the multiplicand left and adding partial products" }, { label: "B", text: "Repeated subtraction" }, { label: "C", text: "Division" }], "A", "Each 1 in the multiplier causes a shifted copy. Add all shifted copies together."),
      generateTypingStep("Larger Multiplication", "Multiply 1101 × 101!", "    1101\n  ×  101\n  ------\n    1101\n  000000\n 1101000\n  ------\n1000001", "13 × 5 = 65 = 1000001₂. Skip rows where the multiplier bit is 0.", "hard"),
      generateTypingStep("Multiplication Drill", "Multiply 110 × 10!", "  110\n× 010\n-----\n  000\n 1100\n-----\n 1100", "6 × 2 = 12. Multiplying by 10₂ just shifts left by one position!", "medium"),
    ],
    "binary-division": [
      generateQuizStep("Binary Division", "How does binary long division work?", [{ label: "A", text: "Same as decimal division — divide, multiply, subtract, bring down" }, { label: "B", text: "Convert to decimal first" }, { label: "C", text: "Use multiplication tables" }], "A", "Binary division uses the same long division process, but simpler since you only decide 0 or 1."),
      generateTypingStep("Divide Step by Step", "Divide 1100 ÷ 10!", "  110\n  ---\n10|1100\n   10\n   --\n    10\n    10\n    --\n     00", "12 ÷ 2 = 6. At each step: does the divisor fit? If yes, write 1; if no, write 0.", "medium"),
      generateQuizStep("Division Result", "What is 10100 ÷ 100 in binary?", [{ label: "A", text: "101" }, { label: "B", text: "1010" }, { label: "C", text: "110" }], "A", "10100₂ (20) ÷ 100₂ (4) = 101₂ (5). Dividing by powers of 2 is like shifting right."),
      generateTypingStep("Division Practice", "Divide 11010 ÷ 11!", "  100.11...\n   ----\n11|11010\n   11\n   --\n    00\n    001\n    000\n     010", "26 ÷ 3 = 8 remainder 2. Binary division can produce remainders or binary fractions.", "hard"),
    ],
    "twos-complement": [
      generateQuizStep("Two's Complement Purpose", "Why is two's complement used?", [{ label: "A", text: "To represent negative numbers in binary so subtraction uses addition circuits" }, { label: "B", text: "To double a number" }, { label: "C", text: "To compress data" }], "A", "Two's complement lets CPUs subtract using addition, simplifying hardware design."),
      generateTypingStep("Find Two's Complement", "Find the two's complement of 0101!", "Step 1: Flip all bits: 1010\nStep 2: Add 1:        1011\nResult: -5 in 4-bit two's complement", "Flip bits + add 1. This always works for finding the negative.", "medium"),
      generateQuizStep("Signed Range", "What is the range of 8-bit two's complement?", [{ label: "A", text: "-128 to +127" }, { label: "B", text: "-127 to +128" }, { label: "C", text: "0 to 255" }], "A", "-128 to +127. The MSB (leftmost bit) is the sign bit: 0=positive, 1=negative."),
      generateTypingStep("Negative Number", "Represent -42 in 8-bit two's complement!", "+42 = 00101010\nFlip: 11010101\nAdd 1: 11010110\n-42 = 11010110", "To verify: 11010110 → flip → 00101001 → add 1 → 00101010 = 42 ✓", "hard"),
      generateQuizStep("Sign Bit", "In two's complement, what does the MSB indicate?", [{ label: "A", text: "0 = positive, 1 = negative" }, { label: "B", text: "0 = negative, 1 = positive" }, { label: "C", text: "Parity" }], "A", "The Most Significant Bit is the sign bit. 0xxxxxxx = positive, 1xxxxxxx = negative."),
      generateTypingStep("Addition with Two's Complement", "Add 5 + (-3) using two's complement!", "  0101  (+5)\n+ 1101  (-3)\n------\n 10010\nDiscard carry: 0010 = +2", "5 + (-3) = 2. Discard any carry beyond the word length.", "hard"),
    ],
    "ones-complement": [
      generateQuizStep("One's Complement", "How do you find the one's complement?", [{ label: "A", text: "Flip all bits (0→1, 1→0)" }, { label: "B", text: "Add 1 to each bit" }, { label: "C", text: "Shift right" }], "A", "One's complement simply inverts every bit. 0101 → 1010."),
      generateTypingStep("One's Complement Examples", "Find one's complements!", "0110 → 1001\n1010 → 0101\n11001100 → 00110011", "One's complement is the first step of two's complement (before adding 1).", "easy"),
      generateQuizStep("One's Complement Problem", "What issue does one's complement have?", [{ label: "A", text: "Two representations of zero: +0 (0000) and -0 (1111)" }, { label: "B", text: "Can't represent negative numbers" }, { label: "C", text: "Uses too much memory" }], "A", "The 'negative zero' problem is why two's complement replaced one's complement in modern CPUs."),
      generateQuizStep("Comparison", "Why is two's complement preferred over one's complement?", [{ label: "A", text: "Only one representation of zero and simpler addition circuits" }, { label: "B", text: "Uses fewer bits" }, { label: "C", text: "Faster multiplication" }], "A", "Two's complement has exactly one zero and makes addition/subtraction use the same circuit."),
    ],
    "binary-to-hex": [
      generateQuizStep("Binary to Hex Method", "How do you convert binary to hexadecimal?", [{ label: "A", text: "Group binary digits into sets of 4 (nibbles) and convert each to hex" }, { label: "B", text: "Divide by 16 repeatedly" }, { label: "C", text: "Multiply each bit by 16" }], "A", "Each hex digit = exactly 4 binary bits. Group from right: 1010 1100 → AC."),
      generateTypingStep("Binary to Hex Conversion", "Convert 10101100 to hex!", "1010 1100\n  A    C\nResult: AC", "Split into nibbles, convert each: 1010=A, 1100=C → AC.", "medium"),
      generateTypingStep("Hex Digit Reference", "Type the hex-binary lookup table!", "0=0000  4=0100  8=1000  C=1100\n1=0001  5=0101  9=1001  D=1101\n2=0010  6=0110  A=1010  E=1110\n3=0011  7=0111  B=1011  F=1111", "Memorize this table — it's the key to instant binary↔hex conversion!", "medium"),
      generateQuizStep("Quick Convert", "What is 11111111 in hex?", [{ label: "A", text: "FF" }, { label: "B", text: "F0" }, { label: "C", text: "1F" }], "A", "1111 1111 → F F → FF. FF in hex = 255 in decimal."),
      generateTypingStep("Conversion Drill", "Convert these!", "01001010 = 4A\n11110000 = F0\n10000001 = 81\n01111110 = 7E", "Practice makes these conversions instant!", "hard"),
    ],
    "hex-to-binary": [
      generateQuizStep("Hex to Binary Method", "How do you convert hex to binary?", [{ label: "A", text: "Expand each hex digit to its 4-bit binary equivalent" }, { label: "B", text: "Multiply by 2" }, { label: "C", text: "Subtract from 16" }], "A", "Each hex digit expands to exactly 4 binary bits: A→1010, 3→0011."),
      generateTypingStep("Hex to Binary", "Convert 5F to binary!", "5 = 0101\nF = 1111\n5F = 01011111", "Simply expand each hex digit to 4 bits!", "easy"),
      generateTypingStep("More Conversions", "Convert these hex values!", "3C = 0011 1100\nB7 = 1011 0111\nDE = 1101 1110\nA0 = 1010 0000", "Each hex digit is exactly 4 bits — no math needed, just lookup!", "medium"),
      generateQuizStep("MAC Address", "A MAC address is 48:0F:CF:A1:2B:33. How many bits is this?", [{ label: "A", text: "48 bits (6 bytes × 8 bits)" }, { label: "B", text: "24 bits" }, { label: "C", text: "96 bits" }], "A", "Each hex pair = 1 byte = 8 bits. 6 pairs × 8 = 48 bits total."),
      generateTypingStep("Color Code to Binary", "Convert color #FF8000 to binary!", "FF = 11111111 (Red: 255)\n80 = 10000000 (Green: 128)\n00 = 00000000 (Blue: 0)\nResult: Orange!", "Web colors are just 3 bytes of RGB in hexadecimal!", "medium"),
    ],
    "octal-conversions": [
      generateQuizStep("Octal System", "What base does octal use?", [{ label: "A", text: "Base 8 (digits 0-7)" }, { label: "B", text: "Base 6" }, { label: "C", text: "Base 12" }], "A", "Octal uses digits 0-7. Each octal digit = exactly 3 binary bits."),
      generateTypingStep("Binary to Octal", "Convert 110101 to octal!", "110 101\n 6   5\nResult: 65₈", "Group binary into sets of 3 from the right: 110=6, 101=5.", "medium"),
      generateQuizStep("Octal to Decimal", "What is 27₈ in decimal?", [{ label: "A", text: "23" }, { label: "B", text: "27" }, { label: "C", text: "17" }], "A", "27₈ = (2×8) + (7×1) = 16 + 7 = 23 decimal."),
      generateTypingStep("Linux Permissions", "Decode file permission 755!", "7 = rwx (read+write+execute)\n5 = r-x (read+execute)\n5 = r-x (read+execute)\n755 = owner:rwx, group:r-x, others:r-x", "Linux file permissions use octal! chmod 755 is the most common.", "medium"),
      generateQuizStep("Why Octal?", "Where is octal commonly used today?", [{ label: "A", text: "Unix/Linux file permissions (chmod)" }, { label: "B", text: "Web development" }, { label: "C", text: "Database queries" }], "A", "chmod 644, chmod 755 — Linux permissions are octal. r=4, w=2, x=1."),
    ],
    "floating-point-intro": [
      generateQuizStep("Floating Point", "What does floating point representation store?", [{ label: "A", text: "Real numbers using sign, exponent, and mantissa" }, { label: "B", text: "Only whole numbers" }, { label: "C", text: "Text characters" }], "A", "Floating point = sign bit + exponent + mantissa (like scientific notation in binary)."),
      generateTypingStep("IEEE 754 Format", "Type 32-bit floating point structure!", "Sign: 1 bit\nExponent: 8 bits (biased by 127)\nMantissa: 23 bits\nTotal: 32 bits", "IEEE 754 single precision uses a bias of 127 for the exponent.", "medium"),
      generateQuizStep("Precision Issue", "Why does 0.1 + 0.2 ≠ 0.3 in computers?", [{ label: "A", text: "0.1 and 0.2 can't be exactly represented in binary floating point" }, { label: "B", text: "The computer is broken" }, { label: "C", text: "Addition is wrong" }], "A", "Some decimals (like 0.1) become infinitely repeating in binary, causing tiny rounding errors."),
      generateTypingStep("Scientific Notation Analogy", "Compare scientific and floating point!", "Scientific: 6.022 × 10²³\nBinary FP:  1.101 × 2⁴\nBoth have: coefficient × base^exponent", "Floating point is just scientific notation in base 2!", "medium"),
      generateQuizStep("Single vs Double", "What is the difference between float and double?", [{ label: "A", text: "Float is 32-bit (7 digits), double is 64-bit (15-16 digits)" }, { label: "B", text: "They are identical" }, { label: "C", text: "Double is slower and less accurate" }], "A", "Double has twice the bits = twice the precision. Always prefer double for accuracy."),
    ],
    "number-systems": [
      generateQuizStep("Number Systems", "What are the four main number systems in computing?", [{ label: "A", text: "Binary (2), Octal (8), Decimal (10), Hexadecimal (16)" }, { label: "B", text: "Only binary and decimal" }, { label: "C", text: "Roman numerals" }], "A", "Binary for hardware, octal for permissions, decimal for humans, hex for memory addresses."),
      generateTypingStep("Number System Bases", "Type the four systems!", "Binary:      Base 2  (0-1)\nOctal:       Base 8  (0-7)\nDecimal:     Base 10 (0-9)\nHexadecimal: Base 16 (0-F)", "Each system has a different base and digit range.", "easy"),
      generateQuizStep("Why Different Bases?", "Why do programmers use hexadecimal?", [{ label: "A", text: "It's a compact way to represent binary — 1 hex digit = 4 bits" }, { label: "B", text: "It's faster for calculations" }, { label: "C", text: "Computers only understand hex" }], "A", "FF is much easier to read than 11111111. Hex is a shorthand for binary."),
      generateTypingStep("Conversion Summary", "Type equivalent values!", "Decimal: 255\nBinary:  11111111\nOctal:   377\nHex:     FF", "255 is the maximum value for one byte (8 bits).", "medium"),
    ],
    "hex-system": [
      generateQuizStep("Hexadecimal", "What base does hex use?", [{ label: "A", text: "Base 8" }, { label: "B", text: "Base 16" }, { label: "C", text: "Base 6" }], "B", "Hexadecimal (base 16) uses 0-9 and A-F. Each hex digit = 4 binary bits."),
      generateTypingStep("Hex Values", "Type hex digits!", "0123456789ABCDEF", "A=10, B=11, C=12, D=13, E=14, F=15.", "easy"),
      generateQuizStep("Hex Color", "What does #FF0000 represent?", [{ label: "A", text: "Pure red" }, { label: "B", text: "Pure blue" }, { label: "C", text: "Pure green" }], "A", "FF=255 red, 00=0 green, 00=0 blue = pure red."),
      generateTypingStep("Hex to Binary", "Convert hex to binary!", "A = 1010, F = 1111", "Each hex digit converts to exactly 4 binary bits.", "medium"),
    ],
    "hex-conversions": [
      generateQuizStep("Hex to Decimal", "What is 2F in decimal?", [{ label: "A", text: "47" }, { label: "B", text: "31" }, { label: "C", text: "63" }], "A", "2F₁₆ = (2×16) + (15×1) = 32 + 15 = 47."),
      generateTypingStep("Decimal to Hex", "Convert 200 to hex!", "200 ÷ 16 = 12 remainder 8\nResult: C8", "Divide by 16 repeatedly. Remainders (read bottom-up) form the hex number.", "medium"),
      generateTypingStep("Common Values", "Type common hex-decimal equivalents!", "0x0A = 10\n0x10 = 16\n0x20 = 32\n0x64 = 100\n0xFF = 255", "Prefix 0x indicates hexadecimal in programming.", "medium"),
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
    "excel-analytics": [
      generateQuizStep("Excel for Analytics", "Why is Excel essential for data analytics?", [{ label: "A", text: "It combines formulas, charts, pivot tables, and macros in one tool" }, { label: "B", text: "It's the only option" }, { label: "C", text: "It only does basic math" }], "A", "Excel is the most widely used analytics tool in business. It handles calculation, visualization, and automation."),
      generateTypingStep("INDEX-MATCH", "Type a powerful lookup formula!", '=INDEX(C:C, MATCH("Alice", A:A, 0))', "INDEX-MATCH is more flexible than VLOOKUP — it can look in any direction.", "medium"),
      generateQuizStep("Pivot Tables for Analytics", "What can PivotTables summarize?", [{ label: "A", text: "SUM, COUNT, AVERAGE, MIN, MAX of any field, grouped by any category" }, { label: "B", text: "Only totals" }, { label: "C", text: "Only text data" }], "A", "PivotTables can calculate any aggregate across any dimension — drag and drop to explore data."),
      generateTypingStep("Conditional Formulas", "Type conditional aggregation!", '=SUMIFS(Sales, Region, "North", Year, 2025)', "SUMIFS allows multiple criteria. COUNTIFS and AVERAGEIFS work similarly.", "hard"),
    ],
    "transformers": [
      generateQuizStep("Transformer Architecture", "What is the key innovation in Transformers?", [{ label: "A", text: "Self-attention mechanism that weighs importance of each input token" }, { label: "B", text: "Using more RAM" }, { label: "C", text: "Faster CPUs" }], "A", "Self-attention lets the model focus on relevant parts of the input regardless of distance."),
      generateQuizStep("BERT vs GPT", "How do BERT and GPT differ?", [{ label: "A", text: "BERT is bidirectional (understands context); GPT is autoregressive (generates text)" }, { label: "B", text: "They are identical" }, { label: "C", text: "BERT is newer" }], "A", "BERT reads in both directions (fill-in-the-blank). GPT predicts the next token (text generation)."),
      generateTypingStep("Transformer Components", "Type transformer components!", "Input Embedding → Positional Encoding → Multi-Head Attention → Feed Forward → Output", "These layers stack to create deep understanding of language patterns.", "hard"),
    ],
    "llms": [
      generateQuizStep("LLM Training", "How are Large Language Models trained?", [{ label: "A", text: "On massive text corpora using next-token prediction" }, { label: "B", text: "By hand-coding rules" }, { label: "C", text: "Using small datasets only" }], "A", "LLMs learn language patterns by predicting the next word in billions of text sequences."),
      generateTypingStep("LLM Parameters", "Type LLM size comparisons!", "GPT-3: 175 billion parameters\nLLaMA 2: 7B-70B parameters\nGemini: Multimodal, multiple sizes", "More parameters generally means better performance but higher compute costs.", "medium"),
      generateQuizStep("Fine-Tuning", "What is fine-tuning an LLM?", [{ label: "A", text: "Training a pre-trained model on domain-specific data" }, { label: "B", text: "Making it run faster" }, { label: "C", text: "Reducing its size" }], "A", "Fine-tuning adapts a general model to your specific use case with much less data than training from scratch."),
    ],
    "rag-systems": [
      generateQuizStep("RAG Purpose", "What does RAG (Retrieval-Augmented Generation) do?", [{ label: "A", text: "Combines retrieval of relevant documents with LLM generation for accurate answers" }, { label: "B", text: "Generates random text" }, { label: "C", text: "Only stores data" }], "A", "RAG retrieves relevant context from a knowledge base, then feeds it to the LLM for grounded, factual responses."),
      generateTypingStep("RAG Pipeline", "Type the RAG pipeline!", "1. User query\n2. Embed query → vector\n3. Search vector database\n4. Retrieve top-K documents\n5. Inject into LLM prompt\n6. Generate grounded answer", "RAG reduces hallucinations by grounding LLM responses in real data.", "hard"),
      generateQuizStep("Vector Database", "What stores embeddings in a RAG system?", [{ label: "A", text: "Vector database (Pinecone, Weaviate, ChromaDB)" }, { label: "B", text: "Regular SQL database" }, { label: "C", text: "Text files" }], "A", "Vector databases store numerical embeddings and enable fast similarity search."),
    ],
    "langchain-intro": [
      generateQuizStep("LangChain", "What is LangChain?", [{ label: "A", text: "A framework for building applications powered by language models" }, { label: "B", text: "A blockchain protocol" }, { label: "C", text: "A programming language" }], "A", "LangChain connects LLMs to tools, databases, and APIs to build powerful AI applications."),
      generateTypingStep("LangChain Components", "Type LangChain building blocks!", "Chains: Sequence of LLM calls\nAgents: LLM decides which tools to use\nMemory: Conversation history\nRetrievers: Document search\nTools: External APIs", "LangChain abstracts complex AI workflows into composable components.", "medium"),
    ],
    // === ROBOTICS ===
    "robotics-intro": [
      generateQuizStep("What is Robotics?", "Robotics combines which fields?", [{ label: "A", text: "Mechanical engineering, electrical engineering, and computer science" }, { label: "B", text: "Art and music" }, { label: "C", text: "Only software development" }], "A", "Robotics is interdisciplinary: mechanics (body), electronics (sensors/actuators), and software (intelligence)."),
      generateQuizStep("Robot Types", "What are the main types of robots?", [{ label: "A", text: "Industrial, service, mobile, humanoid, collaborative" }, { label: "B", text: "Only factory robots" }, { label: "C", text: "Only drones" }], "A", "Robots range from factory arms to self-driving cars to surgical systems to social robots."),
      generateTypingStep("Robot Components", "Type the core robot components!", "Sensors: Camera, LiDAR, IMU, Ultrasonic\nActuators: Motors, Servos, Pneumatics\nController: Microcontroller (Arduino/RPi)\nPower: Battery, external supply", "Every robot needs sensing (perception), actuation (movement), control (brain), and power.", "medium"),
    ],
    "robot-kinematics": [
      generateQuizStep("Forward Kinematics", "What is forward kinematics?", [{ label: "A", text: "Given joint angles, calculate the end-effector position" }, { label: "B", text: "Moving the robot forward" }, { label: "C", text: "Speed calculation" }], "A", "Forward kinematics: joint angles → tip position. Inverse kinematics: tip position → joint angles."),
      generateQuizStep("DOF", "What does DOF (Degrees of Freedom) mean?", [{ label: "A", text: "Number of independent movements a robot can make" }, { label: "B", text: "Speed of the robot" }, { label: "C", text: "Battery capacity" }], "A", "6 DOF = full 3D positioning: 3 translations (X,Y,Z) + 3 rotations (roll, pitch, yaw)."),
      generateTypingStep("DOF Drill", "Type degrees of freedom!", "1 DOF: Rotate or slide\n2 DOF: XY plane movement\n3 DOF: 3D position\n6 DOF: Full 3D position + orientation", "Industrial arms typically have 6 DOF for full workspace coverage.", "medium"),
    ],
    "sensors-actuators": [
      generateQuizStep("Sensor Types", "Which sensor measures distance using sound?", [{ label: "A", text: "Camera" }, { label: "B", text: "Ultrasonic sensor" }, { label: "C", text: "IMU" }], "B", "Ultrasonic sensors emit sound waves and measure the echo time to calculate distance. Range: ~2cm to ~4m."),
      generateQuizStep("LiDAR", "What does LiDAR stand for?", [{ label: "A", text: "Light Detection and Ranging" }, { label: "B", text: "Linear Digital Radar" }, { label: "C", text: "Laser Input Device" }], "A", "LiDAR uses laser pulses to create 3D maps. Used in self-driving cars, drones, and surveying."),
      generateTypingStep("Sensor Comparison", "Type sensor specs!", "Ultrasonic: 2-400cm, cheap, low res\nInfrared: 2-150cm, analog output\nLiDAR: 0.1-100m, 360° scan, expensive\nCamera: RGB/depth, ML-capable, complex", "Choose sensors based on range, cost, precision, and processing requirements.", "hard"),
      generateQuizStep("Servo vs Stepper", "How do servo motors differ from stepper motors?", [{ label: "A", text: "Servos use feedback for precise angles; steppers move in fixed increments" }, { label: "B", text: "They are identical" }, { label: "C", text: "Steppers are faster" }], "A", "Servos: closed-loop, precise positioning. Steppers: open-loop, exact angular steps (1.8° typical)."),
    ],
    "robot-programming": [
      generateQuizStep("ROS", "What is ROS in robotics?", [{ label: "A", text: "Robot Operating System — a framework for robot software" }, { label: "B", text: "A real operating system like Windows" }, { label: "C", text: "A game engine" }], "A", "ROS provides tools, libraries, and conventions for writing complex robot software with pub/sub messaging."),
      generateTypingStep("ROS Concepts", "Type ROS key concepts!", "Nodes: Independent processes\nTopics: Named channels for data\nPublishers: Send messages\nSubscribers: Receive messages\nServices: Request/response", "ROS uses a pub/sub architecture. Nodes communicate via topics.", "medium"),
      generateTypingStep("Arduino Code", "Write Arduino robot code!", "void setup() {\n  pinMode(motorPin, OUTPUT);\n  Serial.begin(9600);\n}\nvoid loop() {\n  int dist = readUltrasonic();\n  if (dist < 20) stop();\n  else forward();\n}", "Arduino is the most popular microcontroller for beginner robotics.", "medium"),
    ],
    "autonomous-systems": [
      generateQuizStep("Self-Driving Levels", "What are the levels of autonomous driving?", [{ label: "A", text: "Level 0 (no automation) to Level 5 (full autonomy)" }, { label: "B", text: "Only 2 levels" }, { label: "C", text: "Level 1 to Level 3" }], "A", "SAE levels: 0=none, 1=driver assist, 2=partial, 3=conditional, 4=high, 5=full autonomy."),
      generateQuizStep("SLAM", "What does SLAM stand for?", [{ label: "A", text: "Simultaneous Localization and Mapping" }, { label: "B", text: "System Level Access Module" }, { label: "C", text: "Sensor Light Analysis Method" }], "A", "SLAM lets robots map unknown environments while tracking their own position. Used in autonomous vehicles and vacuum robots."),
      generateTypingStep("Autonomous Stack", "Type the autonomous vehicle stack!", "Perception: LiDAR + Camera + Radar\nLocalization: GPS + SLAM + IMU\nPlanning: Path planning + Decision making\nControl: Steering + Throttle + Braking", "Each layer builds on the previous one. Perception → Understanding → Planning → Action.", "hard"),
    ],
    "robotics-hardware": [
      generateQuizStep("Arduino vs Raspberry Pi", "When use Arduino vs Raspberry Pi?", [{ label: "A", text: "Arduino for real-time I/O control; RPi for computation and vision" }, { label: "B", text: "They are identical" }, { label: "C", text: "Arduino is always better" }], "A", "Arduino: real-time sensor/motor control, low power. RPi: Linux, camera, ML, networking."),
      generateTypingStep("Arduino Pinout", "Type Arduino pin types!", "Digital: HIGH/LOW (0/5V)\nAnalog: 0-1023 (10-bit ADC)\nPWM: ~3,~5,~6,~9,~10,~11\nSerial: TX(1), RX(0)\nI2C: SDA(A4), SCL(A5)", "Know your pins! PWM (~) pins can simulate analog output for motor speed control.", "hard"),
      generateTypingStep("H-Bridge Motor", "Type H-bridge motor control!", "// L298N H-Bridge\ndigitalWrite(IN1, HIGH);\ndigitalWrite(IN2, LOW);\nanalogWrite(ENA, 200); // speed 0-255", "H-bridges allow bidirectional motor control. Swap IN1/IN2 to reverse direction.", "medium"),
    ],
    "drone-programming": [
      generateQuizStep("Drone Components", "What are the key components of a quadcopter?", [{ label: "A", text: "Frame, motors, ESCs, flight controller, battery, propellers" }, { label: "B", text: "Only a camera" }, { label: "C", text: "Only GPS" }], "A", "Quadcopters need 4 motors with ESCs, a flight controller (PX4/ArduPilot), battery, and propellers."),
      generateQuizStep("PID Control", "What is PID control in drones?", [{ label: "A", text: "Proportional-Integral-Derivative feedback loop for stable flight" }, { label: "B", text: "A programming language" }, { label: "C", text: "A battery type" }], "A", "PID continuously corrects errors: P = current error, I = accumulated error, D = rate of change."),
      generateTypingStep("PID Formula", "Type the PID equation!", "output = Kp * error + Ki * integral + Kd * derivative\nerror = setpoint - measured\nintegral += error * dt\nderivative = (error - prevError) / dt", "Tuning Kp, Ki, Kd determines how the drone responds to disturbances.", "hard"),
    ],
    "industrial-automation": [
      generateQuizStep("PLC", "What is a PLC?", [{ label: "A", text: "Programmable Logic Controller — industrial computer for automation" }, { label: "B", text: "Personal Laptop Computer" }, { label: "C", text: "Protocol Link Cable" }], "A", "PLCs control manufacturing processes: assembly lines, packaging, chemical processing. Rugged and reliable."),
      generateQuizStep("SCADA", "What does SCADA do?", [{ label: "A", text: "Supervisory Control and Data Acquisition — monitors industrial systems" }, { label: "B", text: "Scans documents" }, { label: "C", text: "Social media analysis" }], "A", "SCADA provides centralized monitoring of remote equipment: water treatment, power grids, factories."),
      generateTypingStep("Industry 4.0", "Type Industry 4.0 technologies!", "IoT: Connected sensors and machines\nDigital Twin: Virtual replica of systems\nAI/ML: Predictive maintenance\nCloud: Centralized data and analytics\nCobots: Collaborative robots", "Industry 4.0 = smart manufacturing powered by interconnected digital technologies.", "medium"),
    ],
    "iot-ai": [
      generateQuizStep("Edge AI", "What is Edge AI?", [{ label: "A", text: "Running AI models directly on IoT devices instead of the cloud" }, { label: "B", text: "AI at the edge of a table" }, { label: "C", text: "Only cloud-based AI" }], "A", "Edge AI reduces latency, saves bandwidth, and enables offline inference. Examples: Jetson Nano, Coral TPU."),
      generateTypingStep("Edge Devices", "Type edge AI hardware!", "NVIDIA Jetson Nano: GPU-accelerated ML\nGoogle Coral: TPU for inference\nArduino Nano 33 BLE: TinyML\nRaspberry Pi + Camera: Vision AI", "Edge devices bring ML to the point of data generation.", "medium"),
    ],
    // === MLOps ===
    "mlops-intro": [
      generateQuizStep("MLOps", "What is MLOps?", [{ label: "A", text: "DevOps practices applied to machine learning systems" }, { label: "B", text: "A programming language" }, { label: "C", text: "A database" }], "A", "MLOps combines ML, DevOps, and data engineering to deploy and maintain ML systems in production."),
      generateTypingStep("MLOps Pipeline", "Type the MLOps lifecycle!", "1. Data collection & versioning\n2. Feature engineering\n3. Model training & experimentation\n4. Model validation & testing\n5. Deployment (API/container)\n6. Monitoring & retraining", "Continuous training + continuous deployment = reliable ML in production.", "medium"),
    ],
    "model-monitoring": [
      generateQuizStep("Model Drift", "What is model drift?", [{ label: "A", text: "When model performance degrades because real-world data changes" }, { label: "B", text: "Moving models between servers" }, { label: "C", text: "Model getting bigger" }], "A", "Data drift = input distribution changes. Concept drift = relationship between features and target changes."),
      generateTypingStep("Monitoring Metrics", "Type monitoring setup!", "Monitor:\n- Prediction distribution\n- Feature distributions\n- Latency and throughput\n- Error rate\n- Business KPIs\n\nAlert when drift > threshold", "Set up automated alerts to catch degradation before it impacts users.", "medium"),
    ],
    "ai-agents": [
      generateQuizStep("AI Agents", "What is an AI agent?", [{ label: "A", text: "An autonomous system that perceives, reasons, and acts to achieve goals" }, { label: "B", text: "A chatbot only" }, { label: "C", text: "A search engine" }], "A", "AI agents perceive their environment through sensors, reason using models, and take actions to achieve defined goals."),
      generateTypingStep("Agent Architecture", "Type an agent loop!", "while (true) {\n  observation = perceive(environment);\n  plan = reason(observation, goal);\n  action = decide(plan);\n  result = act(action);\n  memory.store(observation, action, result);\n}", "The sense-plan-act loop is the foundation of all autonomous agents.", "hard"),
      generateQuizStep("ReAct Pattern", "What is the ReAct pattern for LLM agents?", [{ label: "A", text: "Reasoning + Acting: the LLM thinks step-by-step and uses tools" }, { label: "B", text: "A JavaScript framework" }, { label: "C", text: "A database pattern" }], "A", "ReAct interleaves reasoning (chain-of-thought) with actions (tool calls) for grounded problem-solving."),
    ],
  };
  return content[id] || null;
}

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
    "excel-analytics": [
      generateQuizStep("Excel for Analytics", "Why is Excel essential for data analytics?", [{ label: "A", text: "It combines formulas, charts, pivot tables, and macros in one tool" }, { label: "B", text: "It's the only option" }, { label: "C", text: "It only does basic math" }], "A", "Excel is the most widely used analytics tool: formulas for calculation, charts for visualization, pivot tables for summarization."),
      generateTypingStep("VLOOKUP Formula", "Type a VLOOKUP formula!", '=VLOOKUP(A2, Products!A:C, 3, FALSE)', "VLOOKUP(value, table, column, exact_match). FALSE means exact match.", "medium"),
      generateQuizStep("Pivot Tables", "What is the main purpose of a PivotTable?", [{ label: "A", text: "Summarizing and analyzing large datasets interactively" }, { label: "B", text: "Formatting cells" }, { label: "C", text: "Printing reports" }], "A", "PivotTables let you drag fields to instantly summarize thousands of rows by category."),
      generateTypingStep("PivotTable Mnemonic", "Type the PivotTable areas!", "Rows: Categories (e.g., Region)\nColumns: Sub-categories (e.g., Product)\nValues: Metrics (SUM, COUNT, AVG)\nFilters: Top-level slicers", "Remember: R.C.V.F — Rows, Columns, Values, Filters.", "medium"),
      generateQuizStep("Chart Selection", "Which chart shows trends over time?", [{ label: "A", text: "Line chart" }, { label: "B", text: "Pie chart" }, { label: "C", text: "Treemap" }], "A", "Line charts connect data points over time. Use pie for proportions, bar for comparisons."),
      generateTypingStep("Chart Types", "Type when to use each chart!", "Line: Trends over time\nBar: Comparing categories\nPie: Parts of a whole (max 7)\nScatter: Correlation between 2 variables\nHistogram: Frequency distribution", "Choosing the right chart is critical for clear data communication.", "medium"),
      generateQuizStep("Macros", "What is a Macro in Excel?", [{ label: "A", text: "A recorded or coded sequence of actions that can be replayed" }, { label: "B", text: "A large cell" }, { label: "C", text: "A formula" }], "A", "Macros automate repetitive tasks. Record with View > Macros or write VBA code directly."),
      generateTypingStep("VBA Basics", "Type VBA code!", "Sub FormatReport()\n  Range(\"A1\").Font.Bold = True\n  Range(\"A1:D1\").Interior.Color = RGB(0, 120, 215)\nEnd Sub", "VBA Sub procedures contain macro code. Range() references cells.", "hard"),
    ],
    "tableau-powerbi": [
      generateQuizStep("BI Tools", "What do Tableau and Power BI do?", [{ label: "A", text: "Create interactive visual dashboards from data" }, { label: "B", text: "Write code" }, { label: "C", text: "Send emails" }], "A", "BI tools connect to data sources and create interactive visualizations for business insights."),
      generateQuizStep("Tableau vs Power BI", "What is a key difference?", [{ label: "A", text: "Tableau excels at visualization; Power BI integrates with Microsoft ecosystem" }, { label: "B", text: "They are identical" }, { label: "C", text: "Neither supports dashboards" }], "A", "Tableau is best for complex visualizations; Power BI integrates tightly with Excel, Azure, and Microsoft 365."),
      generateTypingStep("Dashboard KPIs", "Type key dashboard metrics!", "Revenue: Total, growth rate, by segment\nCustomers: Acquisition, churn, lifetime value\nOperations: Efficiency, cost per unit\nMarketing: CAC, conversion rate, ROAS", "Good dashboards show KPIs at a glance with drill-down capability.", "medium"),
    ],
    "saas-cloud": [
      generateQuizStep("SaaS Model", "What is SaaS?", [{ label: "A", text: "Software delivered via the internet on a subscription basis" }, { label: "B", text: "Software installed on a CD" }, { label: "C", text: "A programming language" }], "A", "SaaS (Software as a Service) is accessed via browser — no installation needed. Examples: Google Workspace, Salesforce, Slack."),
      generateQuizStep("Cloud Models", "What are the three main cloud service models?", [{ label: "A", text: "IaaS, PaaS, SaaS" }, { label: "B", text: "Small, Medium, Large" }, { label: "C", text: "Free, Premium, Enterprise" }], "A", "IaaS (infrastructure), PaaS (platform), SaaS (software) — each provides a different level of abstraction."),
      generateTypingStep("Cloud Mnemonic", "Type cloud service models!", "IaaS: Infrastructure (AWS EC2, Azure VMs)\nPaaS: Platform (Heroku, Google App Engine)\nSaaS: Software (Gmail, Salesforce, Slack)", "Remember: Pizza analogy — IaaS is ingredients, PaaS is kitchen, SaaS is delivery.", "medium"),
    ],
    "saas-metrics": [
      generateQuizStep("MRR", "What is MRR?", [{ label: "A", text: "Monthly Recurring Revenue — predictable monthly income" }, { label: "B", text: "Most Recent Report" }, { label: "C", text: "Maximum Return Rate" }], "A", "MRR is the total predictable revenue from subscriptions each month."),
      generateTypingStep("SaaS Metrics", "Type key SaaS metrics!", "MRR: Monthly Recurring Revenue\nARR: Annual Recurring Revenue\nCAC: Customer Acquisition Cost\nLTV: Lifetime Value\nChurn: % customers leaving", "LTV/CAC ratio should be > 3. Churn < 5% monthly is healthy.", "medium"),
      generateQuizStep("Churn Rate", "What is churn rate?", [{ label: "A", text: "The percentage of customers who cancel their subscription" }, { label: "B", text: "Revenue growth" }, { label: "C", text: "New customer rate" }], "A", "Churn = customers lost / total customers. Reducing churn is usually more valuable than acquiring new customers."),
    ],
    "marketing-funnels": [
      generateQuizStep("AIDA Model", "What does AIDA stand for?", [{ label: "A", text: "Attention, Interest, Desire, Action" }, { label: "B", text: "Analysis, Implementation, Design, Assessment" }, { label: "C", text: "Awareness, Insight, Data, Analytics" }], "A", "AIDA describes the customer journey: grab Attention, build Interest, create Desire, drive Action."),
      generateTypingStep("Funnel Stages", "Type the marketing funnel!", "Top: Awareness (ads, content, SEO)\nMiddle: Consideration (email, webinars)\nBottom: Conversion (demos, trials, offers)\nPost: Retention (onboarding, support)", "Each stage requires different content and strategies.", "medium"),
      generateQuizStep("Conversion Rate", "What is a conversion rate?", [{ label: "A", text: "Percentage of visitors who take a desired action" }, { label: "B", text: "Internet speed" }, { label: "C", text: "Number of pages viewed" }], "A", "Conversion rate = (conversions / visitors) × 100. Industry average for websites is 2-5%."),
    ],
    "google-ads": [
      generateQuizStep("Google Ads", "How does Google Ads (PPC) pricing work?", [{ label: "A", text: "You pay each time someone clicks your ad" }, { label: "B", text: "Fixed monthly fee" }, { label: "C", text: "Free to advertise" }], "A", "PPC (Pay-Per-Click): you bid on keywords, pay only when someone clicks. Cost varies by competition."),
      generateTypingStep("Ad Components", "Type Google Ad components!", "Headline 1 (30 chars)\nHeadline 2 (30 chars)\nDescription (90 chars)\nDisplay URL\nSitelink extensions", "Effective ads need compelling headlines and clear calls to action.", "medium"),
      generateQuizStep("Quality Score", "What factors determine Google Ads Quality Score?", [{ label: "A", text: "Ad relevance, landing page experience, expected CTR" }, { label: "B", text: "Budget only" }, { label: "C", text: "Company size" }], "A", "Higher Quality Score = lower cost per click and better ad positions."),
    ],
    "email-marketing": [
      generateQuizStep("Email Marketing", "What makes email marketing effective?", [{ label: "A", text: "Personalized, segmented campaigns with clear CTAs" }, { label: "B", text: "Sending to everyone with no targeting" }, { label: "C", text: "Sending once a year" }], "A", "Segmented, personalized emails have 14% higher open rates and 10% higher conversions."),
      generateTypingStep("Email Metrics", "Type email marketing KPIs!", "Open Rate: % who opened (aim: 20-25%)\nCTR: % who clicked (aim: 2-5%)\nConversion Rate: % who completed action\nBounce Rate: % undeliverable\nUnsubscribe: % who opted out", "Track these metrics to optimize your email campaigns.", "medium"),
    ],
    // ===== AWS & Cloud =====
    "cloud-services-bis": [
      generateQuizStep("AWS Overview", "What is AWS?", [{ label: "A", text: "Amazon Web Services — the largest cloud computing platform" }, { label: "B", text: "A programming language" }, { label: "C", text: "A web browser" }], "A", "AWS provides 200+ cloud services: compute (EC2), storage (S3), database (RDS), and more."),
      generateTypingStep("AWS Core Services", "Type AWS core services!", "EC2: Virtual servers (Elastic Compute Cloud)\nS3: Object storage (Simple Storage Service)\nRDS: Managed databases\nLambda: Serverless functions\nCloudFront: CDN\nIAM: Identity & Access Management", "These six services form the backbone of most AWS architectures.", "medium"),
      generateQuizStep("Cloud Models", "What are the three cloud deployment models?", [{ label: "A", text: "Public, private, and hybrid cloud" }, { label: "B", text: "Fast, medium, slow" }, { label: "C", text: "Free, paid, enterprise" }], "A", "Public = shared infrastructure, Private = dedicated, Hybrid = both combined."),
      generateTypingStep("AWS Regions", "Type AWS global infrastructure!", "Regions: us-east-1, eu-west-2, ap-southeast-1\nAvailability Zones: 2+ per region\nEdge Locations: 400+ for CDN\nLocal Zones: Ultra-low latency", "Choose regions close to users. Use multiple AZs for high availability.", "medium"),
      generateQuizStep("S3 Storage Classes", "Which S3 class is cheapest for rarely accessed data?", [{ label: "A", text: "S3 Glacier Deep Archive" }, { label: "B", text: "S3 Standard" }, { label: "C", text: "S3 Intelligent-Tiering" }], "A", "Glacier Deep Archive is cheapest ($0.00099/GB/month) but retrieval takes 12+ hours."),
    ],
    // ===== ERP Deep Dive (erp-systems already defined above) =====
    // ===== Hosting & Infrastructure =====
    "ecommerce-platforms": [
      generateQuizStep("E-Commerce Platforms", "What are the leading e-commerce platforms?", [{ label: "A", text: "Shopify, WooCommerce, Magento, BigCommerce" }, { label: "B", text: "Microsoft Word" }, { label: "C", text: "Photoshop" }], "A", "Shopify dominates hosted solutions; WooCommerce (WordPress plugin) leads self-hosted."),
      generateTypingStep("Platform Comparison", "Type platform differences!", "Shopify: Hosted, easy, monthly fee ($29+)\nWooCommerce: Self-hosted, WordPress, free plugin\nMagento: Enterprise, complex, scalable\nBigCommerce: Hosted, built-in features", "Choose based on budget, technical skill, and scalability needs.", "medium"),
    ],
    "payment-systems": [
      generateQuizStep("Payment Gateways", "What is a payment gateway?", [{ label: "A", text: "A service that processes credit card payments securely" }, { label: "B", text: "A physical gate at a bank" }, { label: "C", text: "An email service" }], "A", "Payment gateways encrypt card data, communicate with banks, and authorize transactions."),
      generateTypingStep("Payment Providers", "Type major payment providers!", "Stripe: Developer-friendly API, 2.9% + 30¢\nPayPal: Consumer trust, easy integration\nSquare: POS + online payments\nAdyen: Enterprise, global coverage\nBraintree: PayPal-owned, supports PayPal/Venmo", "Stripe and PayPal handle 60%+ of online payments in the US/UK.", "medium"),
    ],
    // ===== IT Infrastructure =====
    "it-governance": [
      generateQuizStep("COBIT Framework", "What is COBIT?", [{ label: "A", text: "A governance framework for enterprise IT management" }, { label: "B", text: "A programming language" }, { label: "C", text: "A database" }], "A", "COBIT (Control Objectives for Information Technologies) aligns IT with business goals."),
      generateTypingStep("Governance Frameworks", "Type IT governance frameworks!", "COBIT: IT governance and management\nITIL: IT service management\nISO 27001: Information security\nPRINCE2: Project management\nTOGAF: Enterprise architecture", "Each framework addresses a different aspect of IT management.", "medium"),
    ],
    "itil-framework": [
      generateQuizStep("ITIL Purpose", "What does ITIL provide?", [{ label: "A", text: "Best practices for IT service management (ITSM)" }, { label: "B", text: "Programming tutorials" }, { label: "C", text: "Hardware specifications" }], "A", "ITIL defines processes for delivering and supporting IT services effectively."),
      generateTypingStep("ITIL Practices", "Type ITIL 4 management practices!", "Service Desk: Single point of contact\nIncident Management: Restore service fast\nProblem Management: Find root causes\nChange Enablement: Control changes\nService Level Management: Agree SLAs", "ITIL 4 shifted from 'processes' to 'practices' for flexibility.", "medium"),
      generateQuizStep("SLA", "What is an SLA?", [{ label: "A", text: "Service Level Agreement — defines expected service standards" }, { label: "B", text: "A software license" }, { label: "C", text: "A server location" }], "A", "SLAs specify uptime (e.g., 99.9%), response times, and penalties for violations."),
    ],
    // ===== Conversion & Analytics =====
    "conversion-optimization": [
      generateQuizStep("CRO Definition", "What is Conversion Rate Optimization?", [{ label: "A", text: "Systematically improving the % of visitors who take a desired action" }, { label: "B", text: "Increasing website traffic" }, { label: "C", text: "Changing website colors" }], "A", "CRO uses data and testing to increase conversions without increasing traffic."),
      generateTypingStep("A/B Testing", "Type A/B testing process!", "1. Identify a hypothesis\n2. Create variant (B)\n3. Split traffic 50/50\n4. Run for statistical significance\n5. Analyze: did B beat A?\n6. Implement winner", "A/B testing is the gold standard for CRO. Never end tests early.", "medium"),
      generateQuizStep("Key Metrics", "Which metric matters most for CRO?", [{ label: "A", text: "Conversion rate, bounce rate, time on page, exit rate" }, { label: "B", text: "Number of pages" }, { label: "C", text: "Server uptime" }], "A", "Conversion rate is primary. Bounce rate indicates engagement. Heatmaps show behavior."),
    ],
    "analytics-tools-bis": [
      generateQuizStep("Google Analytics", "What does Google Analytics 4 (GA4) track?", [{ label: "A", text: "User events, conversions, behavior flow across devices" }, { label: "B", text: "Server hardware" }, { label: "C", text: "Email content" }], "A", "GA4 is event-based (not session-based). It tracks user journeys across web and app."),
      generateTypingStep("Analytics Setup", "Type GA4 key metrics!", "Users: Unique visitors\nSessions: Visit instances\nEngagement Rate: % active sessions (>10s)\nConversion Rate: % completing goals\nBounce Rate: % single-page visits", "GA4 replaced Universal Analytics. Engagement rate replaces bounce rate as primary.", "medium"),
    ],
    // ===== Product & Strategy =====
    "product-management": [
      generateQuizStep("Product Management", "What does a Product Manager do?", [{ label: "A", text: "Defines what to build, for whom, and why — owns the product roadmap" }, { label: "B", text: "Writes all the code" }, { label: "C", text: "Only designs the UI" }], "A", "PMs sit at the intersection of business, technology, and user experience."),
      generateTypingStep("Product Frameworks", "Type product management frameworks!", "MVP: Minimum Viable Product\nMoSCoW: Must/Should/Could/Won't\nRICE: Reach, Impact, Confidence, Effort\nKano: Must-have, Performance, Delight\nJobs-to-be-Done: User goals", "RICE scoring helps prioritize features objectively.", "medium"),
    ],
    "roi-analysis": [
      generateQuizStep("ROI Formula", "How do you calculate ROI?", [{ label: "A", text: "ROI = (Net Profit / Cost of Investment) × 100" }, { label: "B", text: "ROI = Revenue × Cost" }, { label: "C", text: "ROI = Profit + Cost" }], "A", "ROI measures the return relative to the investment cost. Higher % = better return."),
      generateTypingStep("ROI Calculation", "Type an ROI example!", "Investment: £50,000\nNet Benefit: £75,000\nROI = (75000 - 50000) / 50000 × 100\nROI = 50%", "A 50% ROI means you earned £1.50 for every £1 invested.", "medium"),
    ],
  };
  return content[id] || null;
}
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
    // html-forms and html-semantic defined in expanded section below
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
    // css-flexbox defined in expanded section below
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
    "seo-fundamentals": [
      generateQuizStep("Organic vs Paid", "What is the difference between organic and paid search results?", [{ label: "A", text: "Organic results are earned through SEO; paid results are bought via ads" }, { label: "B", text: "They are the same" }, { label: "C", text: "Organic is faster" }], "A", "Organic results appear naturally based on relevance. Paid results (SEM) appear at the top with an 'Ad' label."),
      generateTypingStep("On-Page SEO Elements", "Type the key on-page SEO elements!", "1. Title tag (<title>)\n2. Meta description\n3. H1-H6 headings\n4. Image alt text\n5. Internal links\n6. URL structure\n7. Page speed", "On-page SEO is what YOU control directly on your website.", "medium"),
      generateQuizStep("Crawling", "What does Google's crawler (Googlebot) do?", [{ label: "A", text: "Discovers and reads web pages to add them to Google's index" }, { label: "B", text: "Blocks websites" }, { label: "C", text: "Creates web pages" }], "A", "Googlebot follows links, reads page content, and stores it in Google's search index."),
      generateTypingStep("SEO Checklist", "Type an SEO audit checklist!", "✓ Unique title tag per page\n✓ Meta description under 160 chars\n✓ One H1 per page\n✓ Alt text on all images\n✓ Mobile responsive\n✓ Fast loading (<3 seconds)\n✓ HTTPS enabled", "Every page should pass this basic SEO checklist.", "medium"),
    ],
    "seo-technical": [
      generateQuizStep("Technical SEO", "What is technical SEO?", [{ label: "A", text: "Optimizing website infrastructure so search engines can crawl and index efficiently" }, { label: "B", text: "Writing blog posts" }, { label: "C", text: "Social media optimization" }], "A", "Technical SEO ensures your site is discoverable, crawlable, and indexable by search engines."),
      generateTypingStep("Robots.txt", "Create a robots.txt file!", "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://example.com/sitemap.xml", "robots.txt tells crawlers which pages to access and which to skip.", "medium"),
      generateTypingStep("XML Sitemap", "Type a sitemap structure!", '<?xml version="1.0"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>2026-01-15</lastmod>\n    <priority>1.0</priority>\n  </url>\n</urlset>', "XML sitemaps tell search engines about all important pages on your site.", "hard"),
      generateQuizStep("Canonical Tags", "What does a canonical tag prevent?", [{ label: "A", text: "Duplicate content issues by specifying the preferred URL version" }, { label: "B", text: "Page loading" }, { label: "C", text: "CSS rendering" }], "A", 'rel="canonical" tells Google which URL is the "official" version when similar content exists at multiple URLs.'),
      generateQuizStep("HTTPS", "Why is HTTPS important for SEO?", [{ label: "A", text: "Google uses HTTPS as a ranking signal, and it protects user data" }, { label: "B", text: "It makes pages load faster" }, { label: "C", text: "It changes the design" }], "A", "HTTPS is a confirmed Google ranking factor. It encrypts data between browser and server."),
      generateTypingStep("Redirects", "Type redirect types!", "301: Permanent redirect (passes SEO value)\n302: Temporary redirect (doesn't pass full SEO)\n404: Page not found\n410: Page permanently gone", "Always use 301 redirects when permanently moving pages to preserve SEO rankings.", "medium"),
    ],
    "seo-on-page": [
      generateQuizStep("On-Page SEO", "What is on-page SEO?", [{ label: "A", text: "Optimizing individual page content and HTML for target keywords" }, { label: "B", text: "Building backlinks" }, { label: "C", text: "Server configuration" }], "A", "On-page SEO is everything you do ON your page: content, titles, headings, images, internal links."),
      generateTypingStep("Perfect Title Tag", "Write an optimized title tag!", '<title>Best JavaScript Courses 2026 | Free Online Tutorials</title>', "Formula: Primary Keyword + Modifier + Brand. Under 60 characters.", "medium"),
      generateQuizStep("Heading Hierarchy", "How should headings be structured?", [{ label: "A", text: "One H1 per page, then H2s for sections, H3s for subsections" }, { label: "B", text: "Use only H1 tags" }, { label: "C", text: "Headings don't matter" }], "A", "H1 = main topic, H2 = sections, H3 = subsections. Like an outline of your content."),
      generateTypingStep("Image SEO", "Optimize an image for SEO!", '<img src="javascript-tutorial.webp"\n  alt="Student learning JavaScript with interactive code examples"\n  width="800" height="600"\n  loading="lazy">', "Descriptive alt text, compressed format (WebP), dimensions, and lazy loading.", "medium"),
      generateQuizStep("Keyword Density", "What is the ideal keyword density?", [{ label: "A", text: "1-2% — natural usage, not forced repetition" }, { label: "B", text: "As high as possible" }, { label: "C", text: "Exactly 5%" }], "A", "Write naturally. Keyword stuffing is penalized. Use synonyms and related terms."),
      generateTypingStep("Internal Linking", "Type internal linking best practices!", "1. Link to related content naturally\n2. Use descriptive anchor text\n3. Create topic clusters\n4. Update old posts with new links\n5. Avoid orphan pages (no internal links)", "Internal links distribute authority and help users discover related content.", "medium"),
    ],
    "seo-off-page": [
      generateQuizStep("Off-Page SEO", "What is the main focus of off-page SEO?", [{ label: "A", text: "Building backlinks and establishing domain authority" }, { label: "B", text: "Changing page titles" }, { label: "C", text: "Fixing broken images" }], "A", "Off-page SEO = external signals. Backlinks from authoritative sites = votes of confidence."),
      generateQuizStep("Backlink Quality", "Which backlink is most valuable?", [{ label: "A", text: "A do-follow link from a high-authority, relevant site" }, { label: "B", text: "100 links from random directories" }, { label: "C", text: "Links from your own other sites" }], "A", "Quality > quantity. One link from a top site beats hundreds from low-quality directories."),
      generateTypingStep("Link Building Strategies", "Type ethical link building methods!", "1. Create exceptional content (link-worthy)\n2. Guest blogging on relevant sites\n3. Broken link building\n4. Resource page outreach\n5. Digital PR and news coverage", "White-hat link building focuses on earning links through value, not buying them.", "medium"),
      generateQuizStep("Domain Authority", "What is Domain Authority (DA)?", [{ label: "A", text: "A score (1-100) predicting how likely a site is to rank, based on backlink profile" }, { label: "B", text: "How old the domain is" }, { label: "C", text: "The number of pages" }], "A", "DA is a Moz metric. Higher DA = stronger backlink profile = better ranking potential."),
    ],
    "schema-markup": [
      generateQuizStep("Structured Data", "What is schema markup?", [{ label: "A", text: "Code that helps search engines understand page content and show rich results" }, { label: "B", text: "A CSS framework" }, { label: "C", text: "A JavaScript library" }], "A", "Schema markup adds structured data that enables rich snippets (stars, prices, FAQs) in search results."),
      generateTypingStep("JSON-LD Article", "Add structured data for an article!", '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Learn JavaScript",\n  "author": {"@type": "Person", "name": "Jane"},\n  "datePublished": "2026-01-15"\n}\n</script>', "JSON-LD is Google's preferred format for structured data.", "medium"),
      generateQuizStep("Rich Snippets", "What are rich snippets?", [{ label: "A", text: "Enhanced search results showing stars, prices, images, or FAQs" }, { label: "B", text: "Paid advertisements" }, { label: "C", text: "Regular blue links" }], "A", "Rich snippets increase click-through rates by showing extra info directly in search results."),
      generateTypingStep("FAQ Schema", "Type FAQ structured data!", '{\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What is JavaScript?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "A programming language for the web."\n    }\n  }]\n}', "FAQ schema can display Q&A directly in Google search results.", "hard"),
    ],
    "core-web-vitals": [
      generateQuizStep("Core Web Vitals", "What are Google's Core Web Vitals?", [{ label: "A", text: "LCP (loading), INP (interactivity), CLS (visual stability)" }, { label: "B", text: "SEO, SEM, SMM" }, { label: "C", text: "HTML, CSS, JS" }], "A", "Core Web Vitals measure real user experience: how fast, responsive, and stable your page is."),
      generateTypingStep("LCP Optimization", "Type LCP best practices!", "LCP (Largest Contentful Paint) target: < 2.5s\n\nFix:\n1. Optimize largest image/text block\n2. Use CDN for assets\n3. Preload critical resources\n4. Reduce server response time\n5. Remove render-blocking JS/CSS", "LCP measures when the largest visible element finishes loading.", "medium"),
      generateQuizStep("CLS", "What causes Cumulative Layout Shift (CLS)?", [{ label: "A", text: "Images without dimensions, ads injecting content, fonts loading late" }, { label: "B", text: "Too much text" }, { label: "C", text: "Dark mode" }], "A", "CLS measures unexpected layout shifts. Always set width/height on images and reserve space for ads."),
      generateTypingStep("CLS Fix", "Type CLS prevention techniques!", "CLS target: < 0.1\n\nFix:\n1. Set width/height on images & videos\n2. Reserve space for ads\n3. Use font-display: swap\n4. Avoid inserting content above fold\n5. Use transform animations (not layout)", "Layout shifts frustrate users. Reserve space for everything that loads asynchronously.", "medium"),
      generateQuizStep("INP", "What does INP (Interaction to Next Paint) measure?", [{ label: "A", text: "How quickly the page responds to user interactions (clicks, taps, keys)" }, { label: "B", text: "How many images load" }, { label: "C", text: "The number of HTTP requests" }], "A", "INP target: < 200ms. Reduce JavaScript execution time and break up long tasks."),
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
    "mockups": [
      generateQuizStep("Mockup vs Wireframe", "How does a mockup differ from a wireframe?", [{ label: "A", text: "Mockups include colors, fonts, images — they look like the final product" }, { label: "B", text: "They are identical" }, { label: "C", text: "Wireframes are more detailed" }], "A", "Wireframe = structure (skeleton). Mockup = visual design (skin). Prototype = interactive (behavior)."),
      generateQuizStep("Design Tools", "Which tool is industry-standard for UI mockups?", [{ label: "A", text: "Figma — collaborative, web-based, free tier" }, { label: "B", text: "Microsoft Paint" }, { label: "C", text: "Notepad" }], "A", "Figma dominates UI design: real-time collaboration, prototyping, design systems, and developer handoff."),
      generateTypingStep("Design Process", "Type the design workflow!", "1. Research & requirements\n2. Wireframe (low-fidelity)\n3. Mockup (high-fidelity)\n4. Prototype (interactive)\n5. User testing\n6. Iterate & refine\n7. Developer handoff", "This workflow prevents expensive redesigns by validating before coding.", "medium"),
    ],
    "site-maps": [
      generateQuizStep("Site Map", "What does a site map show?", [{ label: "A", text: "The hierarchical structure of all pages on a website" }, { label: "B", text: "Geographic locations" }, { label: "C", text: "Database tables" }], "A", "Site maps show how pages are organized and connected, helping plan navigation."),
    ],
    "user-flows": [
      generateQuizStep("User Flow", "What is a user flow?", [{ label: "A", text: "The path a user takes to complete a task on the website" }, { label: "B", text: "Network traffic" }, { label: "C", text: "CSS animation" }], "A", "User flows map the steps from entry point to goal completion (e.g., sign up → dashboard)."),
    ],
    // ===== Forms =====
    "html-forms": [
      generateTypingStep("HTML Form", "Create a complete form!", '<form action="/submit" method="POST">\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  <label for="pass">Password:</label>\n  <input type="password" id="pass" name="pass" minlength="8" required>\n  <button type="submit">Sign Up</button>\n</form>', "Forms collect user input. method='POST' sends data securely in the request body.", "medium"),
      generateQuizStep("Input Types", "Which input type validates email format automatically?", [{ label: "A", text: 'type="email"' }, { label: "B", text: 'type="text"' }, { label: "C", text: 'type="url"' }], "A", 'type="email" provides built-in validation: the browser checks for @ and domain format.'),
      generateTypingStep("Form Input Types", "Type all major input types!", 'text, email, password, number, tel\ndate, time, datetime-local\ncheckbox, radio, range, color\nfile, url, search, hidden', "HTML5 provides specialized input types that trigger appropriate mobile keyboards.", "medium"),
      generateQuizStep("Label Importance", "Why are <label> elements essential?", [{ label: "A", text: "They improve accessibility (screen readers) and create larger click targets" }, { label: "B", text: "They are purely decorative" }, { label: "C", text: "They slow down the page" }], "A", "Labels associate text with inputs. Use for= attribute matching the input's id."),
    ],
    "form-elements": [
      generateTypingStep("Select Dropdown", "Create a dropdown!", '<select name="country" id="country">\n  <option value="">Select country</option>\n  <option value="uk">United Kingdom</option>\n  <option value="us">United States</option>\n  <option value="de">Germany</option>\n</select>', "Select elements create dropdowns. The first empty option serves as a placeholder.", "easy"),
      generateTypingStep("Textarea", "Create a multi-line input!", '<textarea name="message" rows="5" cols="40"\n  placeholder="Type your message..."\n  maxlength="500"></textarea>', "Textareas allow multi-line text input. rows/cols set the visible size.", "easy"),
      generateQuizStep("Fieldset", "What does <fieldset> do in a form?", [{ label: "A", text: "Groups related form elements together with a visual border" }, { label: "B", text: "Submits the form" }, { label: "C", text: "Validates input" }], "A", "Fieldset groups inputs. Legend provides a caption. Great for accessibility and organization."),
    ],
    "html-semantic": [
      generateTypingStep("Semantic Structure", "Build a semantic page layout!", '<header>\n  <nav>Navigation</nav>\n</header>\n<main>\n  <article>\n    <h1>Title</h1>\n    <section>Content</section>\n  </article>\n  <aside>Sidebar</aside>\n</main>\n<footer>Copyright</footer>', "Semantic HTML tells browsers and screen readers what each section MEANS, not just how it looks.", "medium"),
      generateQuizStep("Why Semantic HTML?", "Why use <article> instead of <div>?", [{ label: "A", text: "SEO benefits, accessibility for screen readers, and clearer code" }, { label: "B", text: "Faster loading" }, { label: "C", text: "Different styling" }], "A", "Semantic elements convey meaning. Screen readers can navigate by landmarks (nav, main, aside)."),
      generateQuizStep("Main vs Div", "What is the rule for <main>?", [{ label: "A", text: "Only one <main> per page — it contains the primary content" }, { label: "B", text: "Use as many as needed" }, { label: "C", text: "It replaces <body>" }], "A", "Each page has exactly one <main>. It wraps the dominant content unique to that page."),
    ],
    "html-multimedia": [
      generateTypingStep("Video Element", "Embed a video!", '<video controls width="640" poster="thumbnail.jpg">\n  <source src="video.mp4" type="video/mp4">\n  <source src="video.webm" type="video/webm">\n  Your browser does not support video.\n</video>', "Multiple sources provide fallbacks. poster shows before playing. controls adds play/pause.", "medium"),
      generateTypingStep("Audio Element", "Embed audio!", '<audio controls>\n  <source src="podcast.mp3" type="audio/mpeg">\n  <source src="podcast.ogg" type="audio/ogg">\n  Your browser does not support audio.\n</audio>', "Audio works like video. Always provide controls so users can play/pause.", "easy"),
      generateQuizStep("Embed vs Native", "When should you use iframe to embed video?", [{ label: "A", text: "For third-party content (YouTube, Vimeo) that needs their player" }, { label: "B", text: "Always" }, { label: "C", text: "Never" }], "A", "Use <video> for self-hosted content. Use <iframe> for YouTube/Vimeo to leverage their CDN and player."),
    ],
    // ===== Flexbox Deep Dive =====
    "css-flexbox": [
      generateTypingStep("Flexbox Container", "Create a flex layout!", ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}", "Flexbox aligns items in one direction — row or column.", "medium"),
      generateQuizStep("justify-content", "What does justify-content control?", [{ label: "A", text: "Alignment along the main axis (horizontal by default)" }, { label: "B", text: "Alignment along the cross axis" }, { label: "C", text: "Font size" }], "A", "justify-content distributes space along the main axis: flex-start, center, space-between, space-around."),
      generateTypingStep("Flex Items", "Control flex item sizing!", ".item {\n  flex: 1;         /* grow equally */\n}\n.sidebar {\n  flex: 0 0 250px; /* fixed width */\n}\n.main {\n  flex: 1;         /* takes remaining space */\n}", "flex shorthand: flex-grow flex-shrink flex-basis. flex:1 means grow to fill.", "medium"),
      generateQuizStep("flex-wrap", "What does flex-wrap: wrap do?", [{ label: "A", text: "Allows items to wrap to the next line when they don't fit" }, { label: "B", text: "Hides overflow" }, { label: "C", text: "Centers items" }], "A", "Without wrap, items shrink to fit. With wrap, they flow to the next line."),
      generateTypingStep("Center Everything", "Center content perfectly with flexbox!", ".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}", "This is the most common flexbox pattern — perfect vertical + horizontal centering.", "easy"),
    ],
    // ===== PWA =====
    "pwa-intro": [
      generateQuizStep("PWA Definition", "What is a Progressive Web App?", [{ label: "A", text: "A web app that works like a native app — installable, offline-capable, fast" }, { label: "B", text: "A mobile-only app" }, { label: "C", text: "A social media platform" }], "A", "PWAs combine web reach with native app capabilities: install to home screen, work offline, push notifications."),
      generateTypingStep("PWA Requirements", "Type the three pillars of a PWA!", "1. Service Worker (offline, caching)\n2. Web App Manifest (install metadata)\n3. HTTPS (secure connection)\n\nBonus: Responsive design, fast loading", "These three are required for Chrome's 'Add to Home Screen' prompt.", "medium"),
      generateQuizStep("PWA vs Native", "What advantage does a PWA have over a native app?", [{ label: "A", text: "No app store needed — install directly from browser, one codebase for all platforms" }, { label: "B", text: "Better graphics" }, { label: "C", text: "More storage access" }], "A", "PWAs skip the app store, are always up-to-date, and work on any device with a browser."),
    ],
    "service-workers": [
      generateTypingStep("Register Service Worker", "Register a service worker!", 'if ("serviceWorker" in navigator) {\n  navigator.serviceWorker.register("/sw.js")\n    .then(reg => console.log("SW registered:", reg.scope))\n    .catch(err => console.error("SW failed:", err));\n}', "Service workers are JavaScript files that run in a separate thread, intercepting network requests.", "medium"),
      generateTypingStep("Cache Strategy", "Implement cache-first strategy!", 'self.addEventListener("fetch", (event) => {\n  event.respondWith(\n    caches.match(event.request)\n      .then(cached => cached || fetch(event.request))\n  );\n});', "Cache-first: check cache → if found, return cached → if not, fetch from network.", "hard"),
      generateQuizStep("Service Worker Lifecycle", "What are the service worker lifecycle events?", [{ label: "A", text: "install → activate → fetch (intercept requests)" }, { label: "B", text: "start → run → stop" }, { label: "C", text: "load → render → close" }], "A", "install: cache assets. activate: clean old caches. fetch: intercept and respond to requests."),
    ],
    "web-app-manifest": [
      generateTypingStep("Manifest File", "Create a web app manifest!", '{\n  "name": "My PWA App",\n  "short_name": "MyApp",\n  "start_url": "/",\n  "display": "standalone",\n  "background_color": "#ffffff",\n  "theme_color": "#3b82f6",\n  "icons": [\n    {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},\n    {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"}\n  ]\n}', "The manifest tells the browser how to display your app when installed.", "medium"),
      generateQuizStep("Display Modes", "What does display: standalone do?", [{ label: "A", text: "Makes the PWA look like a native app — no browser chrome (URL bar, tabs)" }, { label: "B", text: "Shows a loading spinner" }, { label: "C", text: "Opens in a new tab" }], "A", "standalone removes browser UI. fullscreen removes everything. minimal-ui keeps back button."),
    ],
    "responsive-mastery": [
      generateTypingStep("Mobile-First Media Queries", "Write mobile-first responsive CSS!", "/* Mobile base styles (default) */\n.grid { display: flex; flex-direction: column; }\n\n/* Tablet */\n@media (min-width: 768px) {\n  .grid { flex-direction: row; flex-wrap: wrap; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .grid { max-width: 1200px; margin: 0 auto; }\n}", "Mobile-first: start with mobile styles, add complexity for larger screens.", "medium"),
      generateQuizStep("Container Queries", "What are CSS container queries?", [{ label: "A", text: "Style elements based on their container's size, not the viewport" }, { label: "B", text: "Docker containers" }, { label: "C", text: "HTML container elements" }], "A", "Container queries let components adapt based on their parent's size — perfect for reusable components."),
      generateTypingStep("Responsive Typography", "Create fluid typography!", "html {\n  font-size: clamp(14px, 2.5vw, 18px);\n}\nh1 {\n  font-size: clamp(1.5rem, 5vw, 3rem);\n}", "clamp(min, preferred, max) creates smoothly scaling text without media queries.", "medium"),
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
// This fallback ensures EVERY lesson, even those without hand-written content,
// teaches from absolute zero with the 7-step autonomic mastery scaffold.
function generateGenericSteps(title: string, desc: string): LessonStep[] {
  // Step 1: Context — why does this matter?
  const steps: LessonStep[] = [
    generateQuizStep(
      `Why learn ${title}?`,
      `Imagine you want to build an app, a website, or solve a real problem. Which of these would help?`,
      [
        { label: "A", text: `Understanding ${title.toLowerCase()} — ${desc.toLowerCase()}` },
        { label: "B", text: "Memorising random facts without context" },
        { label: "C", text: "Skipping fundamentals and hoping for the best" },
      ],
      "A",
      `${title} is a building block used by professionals every day. By the end of this lesson you will know exactly what it is and how to use it — starting from zero.`,
      "easy"
    ),
  ];

  // Step 2: Micro-lesson — plain-English explanation
  steps.push(generateQuizStep(
    `What is ${title}?`,
    `In simple terms, ${title.toLowerCase()} means: "${desc}". Which statement is correct?`,
    [
      { label: "A", text: desc },
      { label: "B", text: `The opposite of ${desc.toLowerCase()}` },
      { label: "C", text: "Something only experts need to know" },
    ],
    "A",
    `Correct! ${title} means: ${desc}. Everyone starts here — even professional developers learned this exact concept once.`,
    "easy"
  ));

  // Step 3: Real-world analogy
  steps.push(generateQuizStep(
    `${title} in the real world`,
    `Think of ${title.toLowerCase()} like a recipe step — without it, the final product won't work. Where would you encounter this?`,
    [
      { label: "A", text: "Building websites, apps, games, or data systems" },
      { label: "B", text: "Only in academic textbooks" },
      { label: "C", text: "Nowhere — it's outdated" },
    ],
    "A",
    `${title} is used in real products every day — from mobile apps to cybersecurity systems to AI tools.`,
    "easy"
  ));

  // Step 4: Type it — muscle memory drill #1
  steps.push(generateTypingStep(
    `Type the key concept`,
    `Type this definition exactly to build muscle memory:`,
    `${title}: ${desc}`,
    `Typing from memory is how professional coders build speed. You're already building that same skill.`,
    "easy"
  ));

  // Step 5: Application quiz
  steps.push(generateQuizStep(
    `Apply ${title}`,
    `A team asks you to help build a feature that uses ${title.toLowerCase()}. What's the FIRST thing you do?`,
    [
      { label: "A", text: "Panic and give up" },
      { label: "B", text: `Recall the definition: "${desc.substring(0, 60)}..." and plan your approach` },
      { label: "C", text: "Randomly try things until something works" },
    ],
    "B",
    `Professionals always start by recalling what they know, then plan. You now know ${title.toLowerCase()} well enough to do this.`,
    "medium"
  ));

  // Step 6: Repetition drill #2
  steps.push(generateTypingStep(
    `Speed drill: ${title}`,
    `Type it again — faster this time!`,
    `${title}: ${desc}`,
    `Second repetition locks the concept into long-term memory. This is exactly how coding fluency is built.`,
    "medium"
  ));

  // Step 7: Mastery check
  steps.push(generateQuizStep(
    `${title} mastery check`,
    `Could you explain ${title.toLowerCase()} to a friend who knows nothing about coding?`,
    [
      { label: "A", text: `Yes — it means: ${desc.toLowerCase().substring(0, 80)}` },
      { label: "B", text: "No, I still don't understand" },
      { label: "C", text: "I'd need to Google it first" },
    ],
    "A",
    `If you can explain it simply, you truly own this knowledge. ${title} is now part of your skill set. Well done!`,
    "medium"
  ));

  // Step 8: Final speed drill
  steps.push(generateTypingStep(
    `Final drill: ${title}`,
    `One last time from memory — this cements it permanently:`,
    `${title}: ${desc}`,
    `Three repetitions is the minimum for long-term retention. You've completed the full autonomic mastery cycle for ${title.toLowerCase()}.`,
    "medium"
  ));

  return steps;
}
