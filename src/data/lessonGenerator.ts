// Auto-generates lesson content for lessons that don't have static data
import type { LessonData, LessonStep } from "./lessons";

// Module lesson metadata (mirrored from ModulePage for lookup)
const moduleMetadata: Record<string, { moduleId: string; category: string }> = {
  // Java
  "jdk-setup": { moduleId: "java-foundations", category: "Foundations" },
  "java-basics": { moduleId: "java-foundations", category: "Foundations" },
  "comments": { moduleId: "java-foundations", category: "Foundations" },
  "type-casting": { moduleId: "java-foundations", category: "Foundations" },
  "constants": { moduleId: "java-foundations", category: "Foundations" },
  "variable-scope": { moduleId: "java-foundations", category: "Foundations" },
  "comparison-ops": { moduleId: "java-foundations", category: "Operators" },
  "logical-ops": { moduleId: "java-foundations", category: "Operators" },
  "assignment-ops": { moduleId: "java-foundations", category: "Operators" },
  "bitwise-ops": { moduleId: "java-foundations", category: "Operators" },
  "ternary-op": { moduleId: "java-foundations", category: "Operators" },
  "string-methods": { moduleId: "java-foundations", category: "Strings" },
  "string-comparison": { moduleId: "java-foundations", category: "Strings" },
  "string-builder": { moduleId: "java-foundations", category: "Strings" },
  "string-formatting": { moduleId: "java-foundations", category: "Strings" },
  "nested-if": { moduleId: "java-foundations", category: "Control Flow" },
  "switch-expressions": { moduleId: "java-foundations", category: "Control Flow" },
  "do-while": { moduleId: "java-foundations", category: "Control Flow" },
  "enhanced-for": { moduleId: "java-foundations", category: "Control Flow" },
  "break-continue": { moduleId: "java-foundations", category: "Control Flow" },
  "nested-loops": { moduleId: "java-foundations", category: "Control Flow" },
  "parameters-return": { moduleId: "java-foundations", category: "Methods" },
  "recursion": { moduleId: "java-foundations", category: "Methods" },
  "varargs": { moduleId: "java-foundations", category: "Methods" },
  "array-operations": { moduleId: "java-foundations", category: "Data Structures" },
  "multidim-arrays": { moduleId: "java-foundations", category: "Data Structures" },
  "array-algorithms": { moduleId: "java-foundations", category: "Data Structures" },
  "arrays-class": { moduleId: "java-foundations", category: "Data Structures" },
  "arraylist": { moduleId: "java-foundations", category: "Data Structures" },
  "arraylist-methods": { moduleId: "java-foundations", category: "Data Structures" },
  "wrapper-classes": { moduleId: "java-foundations", category: "Data Structures" },
  "autoboxing": { moduleId: "java-foundations", category: "Data Structures" },
  "instance-vars": { moduleId: "java-foundations", category: "OOP" },
  "constructor-overload": { moduleId: "java-foundations", category: "OOP" },
  "this-keyword": { moduleId: "java-foundations", category: "OOP" },
  "access-modifiers": { moduleId: "java-foundations", category: "OOP" },
  "getters-setters": { moduleId: "java-foundations", category: "OOP" },
  "static-members": { moduleId: "java-foundations", category: "OOP" },
  "super-keyword": { moduleId: "java-foundations", category: "OOP" },
  "method-overriding": { moduleId: "java-foundations", category: "OOP" },
  "object-class": { moduleId: "java-foundations", category: "OOP" },
  "dynamic-binding": { moduleId: "java-foundations", category: "OOP" },
  "instanceof-op": { moduleId: "java-foundations", category: "OOP" },
  "upcasting-downcasting": { moduleId: "java-foundations", category: "OOP" },
  "abstract-classes": { moduleId: "java-foundations", category: "OOP" },
  "abstract-methods": { moduleId: "java-foundations", category: "OOP" },
  "interface-default": { moduleId: "java-foundations", category: "OOP" },
  "multiple-interfaces": { moduleId: "java-foundations", category: "OOP" },
  "try-catch": { moduleId: "java-foundations", category: "Exceptions" },
  "multiple-catch": { moduleId: "java-foundations", category: "Exceptions" },
  "finally-block": { moduleId: "java-foundations", category: "Exceptions" },
  "throw-throws": { moduleId: "java-foundations", category: "Exceptions" },
  "custom-exceptions": { moduleId: "java-foundations", category: "Exceptions" },
  "file-class": { moduleId: "java-foundations", category: "Advanced" },
  "buffered-io": { moduleId: "java-foundations", category: "Advanced" },
  "serialization": { moduleId: "java-foundations", category: "Advanced" },
  "list-interface": { moduleId: "java-foundations", category: "Advanced" },
  "set-interface": { moduleId: "java-foundations", category: "Advanced" },
  "map-interface": { moduleId: "java-foundations", category: "Advanced" },
  "iterators": { moduleId: "java-foundations", category: "Advanced" },
  "collections-utility": { moduleId: "java-foundations", category: "Advanced" },
  "generic-classes": { moduleId: "java-foundations", category: "Advanced" },
  "generic-methods": { moduleId: "java-foundations", category: "Advanced" },
  "wildcards": { moduleId: "java-foundations", category: "Advanced" },
  "lambda-expressions": { moduleId: "java-foundations", category: "Advanced" },
  "functional-interfaces": { moduleId: "java-foundations", category: "Advanced" },
  "streams-intro": { moduleId: "java-foundations", category: "Advanced" },
  "stream-operations": { moduleId: "java-foundations", category: "Advanced" },
  "collectors": { moduleId: "java-foundations", category: "Advanced" },
  "javafx-intro": { moduleId: "java-foundations", category: "Advanced" },
  "javafx-controls": { moduleId: "java-foundations", category: "Advanced" },
  "javafx-layouts": { moduleId: "java-foundations", category: "Advanced" },
  "javafx-events": { moduleId: "java-foundations", category: "Advanced" },
  "javafx-css": { moduleId: "java-foundations", category: "Advanced" },
  "threads-intro": { moduleId: "java-foundations", category: "Advanced" },
  "synchronization": { moduleId: "java-foundations", category: "Advanced" },
  "executor-framework": { moduleId: "java-foundations", category: "Advanced" },
  "concurrent-collections": { moduleId: "java-foundations", category: "Advanced" },
  "junit-testing": { moduleId: "java-foundations", category: "Advanced" },
  "test-driven-dev": { moduleId: "java-foundations", category: "Advanced" },
  "singleton-pattern": { moduleId: "java-foundations", category: "Advanced" },
  "factory-pattern": { moduleId: "java-foundations", category: "Advanced" },
  "observer-pattern": { moduleId: "java-foundations", category: "Advanced" },
  "mvc-pattern": { moduleId: "java-foundations", category: "Advanced" },
  "strategy-pattern": { moduleId: "java-foundations", category: "Advanced" },
  "project-structure": { moduleId: "java-foundations", category: "Advanced" },
  "maven-gradle": { moduleId: "java-foundations", category: "Advanced" },
  "logging": { moduleId: "java-foundations", category: "Advanced" },
  "database-jdbc": { moduleId: "java-foundations", category: "Advanced" },
  "spring-boot-intro": { moduleId: "java-foundations", category: "Advanced" },
  "rest-api-java": { moduleId: "java-foundations", category: "Advanced" },
};

// Template-based lesson content generators by topic keywords
const topicTemplates: Record<string, (title: string, desc: string) => LessonStep[]> = {};

function generateQuizStep(title: string, question: string, options: { label: string; text: string }[], correct: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "medium"): LessonStep {
  return { type: "quiz", title, difficulty, question, options, correctAnswer: correct, explanation };
}

function generateTypingStep(title: string, prompt: string, code: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "easy"): LessonStep {
  return { type: "typing", title, difficulty, prompt, codeToType: code, explanation };
}

// Generate lesson content based on title and description
export function generateLessonContent(lessonId: string, title: string, description: string, moduleId: string, xpReward: number): LessonData {
  const meta = moduleMetadata[lessonId];
  const category = meta?.category || inferCategory(moduleId);
  const steps = generateStepsForTopic(lessonId, title, description, moduleId);
  
  return {
    id: lessonId,
    title,
    moduleId,
    steps,
    xpReward,
    category,
  };
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
  // Java-specific generators
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

function generateJavaSteps(id: string, title: string, desc: string): LessonStep[] {
  const steps: LessonStep[] = [];
  
  // Concept introduction quiz
  steps.push(generateQuizStep(
    `What is ${title}?`,
    `Which best describes ${title.toLowerCase()} in Java?`,
    [
      { label: "A", text: desc },
      { label: "B", text: "A type of variable declaration" },
      { label: "C", text: "A compiler error message" },
    ],
    "A",
    `${title} refers to: ${desc}. This is a fundamental Java concept.`,
    "easy"
  ));

  // Code typing based on the topic
  const codeSnippets = getJavaCodeSnippet(id, title);
  if (codeSnippets.length > 0) {
    codeSnippets.forEach(snippet => {
      steps.push(generateTypingStep(snippet.title, snippet.prompt, snippet.code, snippet.explanation, snippet.difficulty));
    });
  }

  // Follow-up quiz
  steps.push(generateQuizStep(
    `${title} Knowledge Check`,
    `Why is ${title.toLowerCase()} important in Java programming?`,
    [
      { label: "A", text: `It helps with ${desc.toLowerCase()}` },
      { label: "B", text: "It is only used in Python" },
      { label: "C", text: "It makes code run slower" },
    ],
    "A",
    `${title} is important because it enables ${desc.toLowerCase()}, making your code more robust and professional.`,
    "medium"
  ));

  // Advanced quiz
  steps.push(generateQuizStep(
    `${title} Best Practices`,
    `What is a best practice when using ${title.toLowerCase()}?`,
    [
      { label: "A", text: "Ignore error handling" },
      { label: "B", text: "Follow Java naming conventions and document your code" },
      { label: "C", text: "Never test your code" },
    ],
    "B",
    `Following conventions and documenting code ensures ${title.toLowerCase()} is used correctly and maintainably.`,
    "medium"
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
      { title: "Declare a Constant", prompt: "Create an unchangeable variable!", code: 'final double PI = 3.14159;', explanation: "final prevents the value from being changed after initialization.", difficulty: "easy" },
    ],
    "comparison-ops": [
      { title: "Equality Check", prompt: "Check if two values are equal!", code: "boolean result = (5 == 5);", explanation: "== compares values and returns true or false.", difficulty: "easy" },
      { title: "Not Equal", prompt: "Check inequality!", code: "boolean diff = (10 != 5);", explanation: "!= returns true when values are different.", difficulty: "easy" },
    ],
    "logical-ops": [
      { title: "AND Operator", prompt: "Combine two conditions!", code: "boolean both = (age > 18 && hasID);", explanation: "&& returns true only if BOTH conditions are true.", difficulty: "easy" },
      { title: "OR Operator", prompt: "Check either condition!", code: "boolean either = (isAdmin || isMod);", explanation: "|| returns true if at least one condition is true.", difficulty: "easy" },
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
    "recursion": [
      { title: "Factorial Method", prompt: "Write a recursive factorial!", code: "return n <= 1 ? 1 : n * factorial(n - 1);", explanation: "Recursion calls the same method with a smaller input until reaching the base case.", difficulty: "hard" },
    ],
    "try-catch": [
      { title: "Try-Catch Block", prompt: "Handle a potential error!", code: 'try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.println("Error!");\n}', explanation: "try-catch prevents crashes by catching exceptions gracefully.", difficulty: "medium" },
    ],
    "abstract-classes": [
      { title: "Abstract Class", prompt: "Define an abstract class!", code: "abstract class Shape {\n  abstract double area();\n}", explanation: "Abstract classes can't be instantiated and may contain abstract methods.", difficulty: "medium" },
    ],
    "lambda-expressions": [
      { title: "Lambda Expression", prompt: "Write a lambda!", code: "Comparator<String> comp = (a, b) -> a.compareTo(b);", explanation: "Lambdas provide concise syntax for functional interfaces.", difficulty: "medium" },
    ],
    "getters-setters": [
      { title: "Getter Method", prompt: "Create a getter!", code: "public String getName() {\n  return this.name;\n}", explanation: "Getters provide controlled read access to private fields.", difficulty: "easy" },
      { title: "Setter Method", prompt: "Create a setter!", code: "public void setName(String name) {\n  this.name = name;\n}", explanation: "Setters provide controlled write access with validation.", difficulty: "easy" },
    ],
    "this-keyword": [
      { title: "Using this", prompt: "Disambiguate with this!", code: "this.name = name;", explanation: "'this' refers to the current object instance, distinguishing fields from parameters.", difficulty: "easy" },
    ],
    "super-keyword": [
      { title: "Calling Parent Constructor", prompt: "Use super to call parent!", code: "super(name, age);", explanation: "super() calls the parent class constructor for initialization.", difficulty: "medium" },
    ],
    "static-members": [
      { title: "Static Variable", prompt: "Create a class-level counter!", code: "static int count = 0;", explanation: "Static members belong to the class, not individual instances.", difficulty: "easy" },
      { title: "Static Method", prompt: "Create a static utility method!", code: "public static int max(int a, int b) {\n  return a > b ? a : b;\n}", explanation: "Static methods can be called without creating an object.", difficulty: "medium" },
    ],
  };
  
  if (snippets[id]) return snippets[id];
  
  // Generate generic Java snippet based on title
  return [{
    title: `Practice: ${title}`,
    prompt: `Write code demonstrating ${title.toLowerCase()}!`,
    code: `// ${title}\nSystem.out.println("${title}");`,
    explanation: `This demonstrates the basic usage of ${title.toLowerCase()} in Java.`,
    difficulty: "easy" as const,
  }];
}

function generateSystemsSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`Understanding ${title}`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: desc }, { label: "B", text: "Writing machine code" }, { label: "C", text: "Hardware installation" }],
      "A", `${title} is about ${desc.toLowerCase()}, a key concept in systems analysis.`, "easy"),
    generateQuizStep(`${title} in Practice`, `When would you use ${title.toLowerCase()}?`,
      [{ label: "A", text: "During system design and planning" }, { label: "B", text: "Only during coding" }, { label: "C", text: "Never in real projects" }],
      "A", `${title} is applied during system design and planning to ensure quality outcomes.`, "medium"),
    generateQuizStep(`${title} Benefits`, `What is a key benefit of ${title.toLowerCase()}?`,
      [{ label: "A", text: "Better system understanding and documentation" }, { label: "B", text: "Faster hardware performance" }, { label: "C", text: "Automatic code generation" }],
      "A", `${title} helps teams understand and document systems effectively.`, "medium"),
    generateQuizStep(`${title} Stakeholders`, `Who benefits most from ${title.toLowerCase()}?`,
      [{ label: "A", text: "All project stakeholders" }, { label: "B", text: "Only programmers" }, { label: "C", text: "Only managers" }],
      "A", `${title} benefits all stakeholders by improving communication and understanding.`, "easy"),
  ];
}

function generateMathSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Basics`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "A programming language" }, { label: "C", text: "A type of computer hardware" }],
      "A", `${title}: ${desc}. This is fundamental to computing mathematics.`, "easy"),
    generateQuizStep(`${title} Application`, `Where is ${title.toLowerCase()} used in computing?`,
      [{ label: "A", text: "Algorithm design and analysis" }, { label: "B", text: "Only in pure mathematics" }, { label: "C", text: "Nowhere in computing" }],
      "A", `${title} is essential in algorithm design, data structures, and computational theory.`, "medium"),
    generateQuizStep(`${title} Problem Solving`, `How does ${title.toLowerCase()} help solve problems?`,
      [{ label: "A", text: "Provides systematic mathematical approaches" }, { label: "B", text: "By guessing answers" }, { label: "C", text: "It doesn't help" }],
      "A", `Mathematical concepts like ${title.toLowerCase()} provide rigorous problem-solving frameworks.`, "medium"),
    generateQuizStep(`${title} Review`, `Which field relies heavily on ${title.toLowerCase()}?`,
      [{ label: "A", text: "Computer Science" }, { label: "B", text: "Art History" }, { label: "C", text: "Literature" }],
      "A", `Computer Science relies heavily on ${title.toLowerCase()} for efficient algorithms and data processing.`, "easy"),
  ];
}

function generateCyberSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "A type of software development" }, { label: "C", text: "A networking protocol" }],
      "A", `${title}: ${desc}. This is a critical cybersecurity concept.`, "easy"),
    generateQuizStep(`${title} Importance`, `Why is ${title.toLowerCase()} important?`,
      [{ label: "A", text: "It protects systems and data from threats" }, { label: "B", text: "It makes systems faster" }, { label: "C", text: "It is not important" }],
      "A", `${title} is crucial for protecting information systems against various security threats.`, "medium"),
    generateQuizStep(`${title} Implementation`, `How is ${title.toLowerCase()} typically implemented?`,
      [{ label: "A", text: "Through security controls, policies, and procedures" }, { label: "B", text: "By ignoring security risks" }, { label: "C", text: "Only through hardware upgrades" }],
      "A", `Proper implementation of ${title.toLowerCase()} involves layered security controls and clear policies.`, "medium"),
    generateQuizStep(`${title} Best Practices`, `What is a best practice for ${title.toLowerCase()}?`,
      [{ label: "A", text: "Regular assessment, monitoring, and updates" }, { label: "B", text: "Set it and forget it" }, { label: "C", text: "Share passwords freely" }],
      "A", `Security best practices include continuous monitoring, regular updates, and proper documentation.`, "medium"),
  ];
}

function generateAISteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Fundamentals`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: desc }, { label: "B", text: "Manual data entry" }, { label: "C", text: "Hardware assembly" }],
      "A", `${title}: ${desc}. This is a key concept in AI and data science.`, "easy"),
    generateQuizStep(`${title} Applications`, `Where is ${title.toLowerCase()} applied?`,
      [{ label: "A", text: "Data analysis, prediction, and automation" }, { label: "B", text: "Only in academic research" }, { label: "C", text: "Nowhere practical" }],
      "A", `${title} has wide applications in industry, research, healthcare, finance, and more.`, "medium"),
    generateQuizStep(`${title} Techniques`, `What technique is related to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Statistical modeling and pattern recognition" }, { label: "B", text: "Manual spreadsheet editing" }, { label: "C", text: "Print statements only" }],
      "A", `${title} leverages statistical methods and algorithms to extract insights from data.`, "medium"),
    generateQuizStep(`${title} Ethics`, `What ethical consideration applies to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Fairness, transparency, and accountability" }, { label: "B", text: "No ethics needed" }, { label: "C", text: "Only profit matters" }],
      "A", `Ethical AI requires fairness, transparency, and accountability in all applications.`, "medium"),
  ];
}

function generateBusinessSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Overview`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "A hardware component" }, { label: "C", text: "A programming language" }],
      "A", `${title}: ${desc}. This is important for modern business information systems.`, "easy"),
    generateQuizStep(`${title} Business Value`, `How does ${title.toLowerCase()} add business value?`,
      [{ label: "A", text: "Improves efficiency, decision-making, and competitive advantage" }, { label: "B", text: "Only increases costs" }, { label: "C", text: "Has no business impact" }],
      "A", `${title} drives business value through improved efficiency and informed decision-making.`, "medium"),
    generateQuizStep(`${title} Implementation`, `What is key to implementing ${title.toLowerCase()}?`,
      [{ label: "A", text: "Strategic planning, stakeholder buy-in, and change management" }, { label: "B", text: "Just install software" }, { label: "C", text: "Ignore user requirements" }],
      "A", `Successful implementation requires careful planning, stakeholder engagement, and proper change management.`, "medium"),
    generateQuizStep(`${title} Trends`, `What current trend relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Cloud computing, automation, and digital transformation" }, { label: "B", text: "Returning to paper-based systems" }, { label: "C", text: "Removing all technology" }],
      "A", `Modern trends like cloud computing and digital transformation heavily influence ${title.toLowerCase()}.`, "medium"),
  ];
}

function generateGameDevSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Basics`, `What does ${title.toLowerCase()} involve?`,
      [{ label: "A", text: desc }, { label: "B", text: "Database management" }, { label: "C", text: "Network administration" }],
      "A", `${title}: ${desc}. This is a core game development concept.`, "easy"),
    generateQuizStep(`${title} in Game Engines`, `How is ${title.toLowerCase()} used in game engines?`,
      [{ label: "A", text: "It's a fundamental building block of game systems" }, { label: "B", text: "It's never used in games" }, { label: "C", text: "Only in 2D games" }],
      "A", `${title} is fundamental to how modern game engines create interactive experiences.`, "medium"),
    generateQuizStep(`${title} Design`, `What design principle relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Performance optimization and player experience" }, { label: "B", text: "Making games slower" }, { label: "C", text: "Ignoring frame rate" }],
      "A", `Good game design balances ${title.toLowerCase()} with performance and player experience.`, "medium"),
    generateQuizStep(`${title} Review`, `What tool commonly implements ${title.toLowerCase()}?`,
      [{ label: "A", text: "Game engines like Unity and Unreal" }, { label: "B", text: "Word processors" }, { label: "C", text: "Spreadsheet software" }],
      "A", `Modern game engines like Unity and Unreal provide built-in support for ${title.toLowerCase()}.`, "easy"),
  ];
}

function generateComputerSystemsSteps(id: string, title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`${title} Fundamentals`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "A type of software application" }, { label: "C", text: "A programming methodology" }],
      "A", `${title}: ${desc}. Understanding this is essential for computer systems knowledge.`, "easy"),
    generateQuizStep(`${title} Components`, `What component relates to ${title.toLowerCase()}?`,
      [{ label: "A", text: "Hardware and system architecture" }, { label: "B", text: "Only web browsers" }, { label: "C", text: "Social media platforms" }],
      "A", `${title} is closely related to hardware components and system architecture.`, "medium"),
    generateQuizStep(`${title} in Practice`, `How is ${title.toLowerCase()} applied in real systems?`,
      [{ label: "A", text: "In system design, troubleshooting, and optimization" }, { label: "B", text: "Only in theory" }, { label: "C", text: "Never in practice" }],
      "A", `Understanding ${title.toLowerCase()} helps with system design, diagnostics, and performance optimization.`, "medium"),
    generateQuizStep(`${title} Knowledge Check`, `Which area of computing relies on ${title.toLowerCase()}?`,
      [{ label: "A", text: "System administration and networking" }, { label: "B", text: "Graphic design only" }, { label: "C", text: "Music production" }],
      "A", `${title} is vital for system administrators, network engineers, and IT professionals.`, "easy"),
  ];
}

function generateWebSteps(id: string, title: string, desc: string): LessonStep[] {
  const steps: LessonStep[] = [];
  
  steps.push(generateQuizStep(`${title} Introduction`, `What is ${title.toLowerCase()}?`,
    [{ label: "A", text: desc }, { label: "B", text: "A database system" }, { label: "C", text: "An operating system" }],
    "A", `${title}: ${desc}. This is a key web development concept.`, "easy"));

  // Add typing steps for HTML/CSS/JS topics
  const webSnippet = getWebCodeSnippet(id, title);
  if (webSnippet) {
    steps.push(generateTypingStep(webSnippet.title, webSnippet.prompt, webSnippet.code, webSnippet.explanation, webSnippet.difficulty));
  }

  steps.push(generateQuizStep(`${title} Usage`, `When would you use ${title.toLowerCase()}?`,
    [{ label: "A", text: "When building modern web applications" }, { label: "B", text: "Never" }, { label: "C", text: "Only for desktop apps" }],
    "A", `${title} is commonly used when building modern, responsive web applications.`, "medium"));
  
  steps.push(generateQuizStep(`${title} Best Practices`, `What is important when implementing ${title.toLowerCase()}?`,
    [{ label: "A", text: "Following web standards and accessibility guidelines" }, { label: "B", text: "Ignoring browser compatibility" }, { label: "C", text: "Using deprecated features" }],
    "A", `Following web standards ensures your implementation of ${title.toLowerCase()} works across all browsers and devices.`, "medium"));

  return steps;
}

function getWebCodeSnippet(id: string, title: string): { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" } | null {
  const snippets: Record<string, { title: string; prompt: string; code: string; explanation: string; difficulty: "easy" | "medium" | "hard" }> = {
    "html-structure": { title: "HTML Document", prompt: "Create an HTML structure!", code: "<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", explanation: "Every HTML document starts with DOCTYPE and has head and body sections.", difficulty: "easy" },
    "html-text": { title: "Heading Element", prompt: "Create a heading!", code: "<h1>Welcome to My Page</h1>", explanation: "h1 is the largest heading. Use h1-h6 for hierarchy.", difficulty: "easy" },
    "html-links": { title: "Hyperlink", prompt: "Create a link!", code: '<a href="https://example.com">Visit</a>', explanation: "The <a> tag creates clickable hyperlinks to other pages.", difficulty: "easy" },
    "css-selectors": { title: "CSS Class Selector", prompt: "Style a class!", code: ".highlight {\n  color: blue;\n  font-weight: bold;\n}", explanation: "Class selectors target elements with a specific class attribute.", difficulty: "easy" },
    "css-flexbox": { title: "Flexbox Container", prompt: "Create a flex layout!", code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}", explanation: "Flexbox provides powerful one-dimensional layout capabilities.", difficulty: "medium" },
    "css-grid": { title: "CSS Grid Layout", prompt: "Create a grid!", code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n}", explanation: "CSS Grid enables two-dimensional layouts with rows and columns.", difficulty: "medium" },
    "js-variables": { title: "JavaScript Variables", prompt: "Declare variables!", code: 'const name = "JavaScript";\nlet count = 0;', explanation: "Use const for values that don't change, let for variables that do.", difficulty: "easy" },
    "js-functions": { title: "Arrow Function", prompt: "Write an arrow function!", code: "const greet = (name) => `Hello, ${name}!`;", explanation: "Arrow functions provide concise syntax for function expressions.", difficulty: "easy" },
    "js-arrays": { title: "Array Methods", prompt: "Use array methods!", code: 'const doubled = nums.map(n => n * 2);', explanation: "map() creates a new array by transforming each element.", difficulty: "medium" },
    "dom-selection": { title: "DOM Selection", prompt: "Select an element!", code: 'const btn = document.querySelector(".btn");', explanation: "querySelector selects the first element matching a CSS selector.", difficulty: "easy" },
    "js-async": { title: "Async/Await", prompt: "Fetch data asynchronously!", code: "const data = await fetch(url);\nconst json = await data.json();", explanation: "async/await makes asynchronous code look synchronous and readable.", difficulty: "medium" },
  };
  
  if (snippets[id]) return snippets[id];
  
  // Check if it's an HTML, CSS, or JS topic and generate appropriate code
  if (id.startsWith("html-") || id.startsWith("css-") || id.startsWith("js-") || id.startsWith("dom-")) {
    return {
      title: `Practice: ${title}`,
      prompt: `Write code for ${title.toLowerCase()}!`,
      code: `<!-- ${title} -->\n<div class="example">${title}</div>`,
      explanation: `This demonstrates the basic concept of ${title.toLowerCase()} in web development.`,
      difficulty: "easy",
    };
  }
  
  return null;
}

function generateGenericSteps(title: string, desc: string): LessonStep[] {
  return [
    generateQuizStep(`Understanding ${title}`, `What is ${title.toLowerCase()}?`,
      [{ label: "A", text: desc }, { label: "B", text: "An unrelated concept" }, { label: "C", text: "Not applicable to computing" }],
      "A", `${title}: ${desc}.`, "easy"),
    generateQuizStep(`${title} Application`, `How is ${title.toLowerCase()} applied?`,
      [{ label: "A", text: "In real-world computing scenarios" }, { label: "B", text: "Only in textbooks" }, { label: "C", text: "It has no practical use" }],
      "A", `${title} has many practical applications in computing and technology.`, "medium"),
    generateQuizStep(`${title} Review`, `What should you remember about ${title.toLowerCase()}?`,
      [{ label: "A", text: "Its key principles and best practices" }, { label: "B", text: "Nothing important" }, { label: "C", text: "Only memorize definitions" }],
      "A", `Understanding the principles and best practices of ${title.toLowerCase()} is key to mastery.`, "medium"),
  ];
}
