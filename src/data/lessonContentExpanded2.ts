// Expanded lesson content — Phase 2
// Covers: VS Code, Python, GitHub, SQL deep-dive, WHMCS, VPS, hosting,
// animations, more Java advanced, more Systems, more Maths, more Cyber,
// more AI, more Business, more Game Dev, more Computer Systems, more Web
import type { LessonStep } from "./lessons";

function q(title: string, question: string, options: { label: string; text: string }[], correct: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "medium"): LessonStep {
  return { type: "quiz", title, difficulty, question, options, correctAnswer: correct, explanation };
}

function t(title: string, prompt: string, code: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "easy"): LessonStep {
  return { type: "typing", title, difficulty, prompt, codeToType: code, explanation };
}

// ===================== JAVA ADVANCED =====================
export const javaAdvancedContent: Record<string, LessonStep[]> = {
  "javafx-intro": [
    q("JavaFX Overview", "What is JavaFX?", [{ label: "A", text: "A GUI framework for building desktop applications in Java" }, { label: "B", text: "A web server" }, { label: "C", text: "A database" }], "A", "JavaFX replaced Swing as Java's modern UI toolkit. It supports CSS styling and FXML layouts."),
    t("JavaFX App", "Create a JavaFX application!", 'public class App extends Application {\n  @Override\n  public void start(Stage stage) {\n    stage.setTitle("Hello JavaFX");\n    stage.setScene(new Scene(new Label("Hello!"), 400, 300));\n    stage.show();\n  }\n}', "Every JavaFX app extends Application and overrides start().", "medium"),
    q("Scene Graph", "What is the JavaFX scene graph?", [{ label: "A", text: "A tree of nodes representing the UI hierarchy" }, { label: "B", text: "A database diagram" }, { label: "C", text: "A network map" }], "A", "The scene graph is Stage → Scene → Root Node → Child Nodes."),
  ],
  "javafx-controls": [
    t("Button Click", "Handle a button click!", 'Button btn = new Button("Click Me");\nbtn.setOnAction(e -> {\n  System.out.println("Clicked!");\n});', "setOnAction registers a lambda event handler for button clicks.", "easy"),
    t("TextField", "Create an input field!", 'TextField input = new TextField();\ninput.setPromptText("Enter name");\nString text = input.getText();', "TextField captures user text input. getPromptText shows placeholder text.", "easy"),
    q("ComboBox", "What is a ComboBox?", [{ label: "A", text: "A dropdown list for selecting one option" }, { label: "B", text: "A text editor" }, { label: "C", text: "A table" }], "A", "ComboBox provides a dropdown selection. Use getSelectionModel().getSelectedItem() to get the choice."),
  ],
  "javafx-layouts": [
    t("VBox Layout", "Stack elements vertically!", "VBox vbox = new VBox(10);\nvbox.getChildren().addAll(\n  new Label(\"Name:\"),\n  new TextField(),\n  new Button(\"Submit\")\n);", "VBox arranges children vertically with spacing. HBox does the same horizontally.", "medium"),
    q("GridPane", "What is GridPane used for?", [{ label: "A", text: "Arranging elements in a grid of rows and columns" }, { label: "B", text: "Drawing graphics" }, { label: "C", text: "Playing audio" }], "A", "GridPane.add(node, column, row) places elements in specific grid positions."),
  ],
  "javafx-events": [
    t("Key Events", "Handle keyboard input!", "scene.setOnKeyPressed(e -> {\n  switch (e.getCode()) {\n    case UP -> moveUp();\n    case DOWN -> moveDown();\n  }\n});", "Key events fire when the user presses keys. Use getCode() for the KeyCode enum.", "medium"),
    q("Event Propagation", "How do events propagate in JavaFX?", [{ label: "A", text: "Capture phase (root→target) then Bubbling phase (target→root)" }, { label: "B", text: "Only upward" }, { label: "C", text: "No propagation" }], "A", "JavaFX events travel down (capture) then up (bubble). Use consume() to stop propagation."),
  ],
  "javafx-css": [
    t("JavaFX CSS", "Style a button with CSS!", '.button {\n  -fx-background-color: #3b82f6;\n  -fx-text-fill: white;\n  -fx-font-size: 14px;\n  -fx-padding: 8 16;\n  -fx-background-radius: 8;\n}', "JavaFX CSS uses -fx- prefix. Load with scene.getStylesheets().add().", "medium"),
    q("Inline Styles", "How do you apply inline CSS in JavaFX?", [{ label: "A", text: 'node.setStyle("-fx-background-color: red;")' }, { label: "B", text: "node.css('red')" }, { label: "C", text: "node.color = 'red'" }], "A", "setStyle() applies inline CSS. External stylesheets are preferred for maintainability."),
  ],
  "threads-intro": [
    t("Create Thread", "Start a new thread!", "Thread t = new Thread(() -> {\n  System.out.println(\"Running in: \" + Thread.currentThread().getName());\n});\nt.start();", "Thread.start() creates a new OS thread. Never call run() directly.", "medium"),
    q("Thread vs Runnable", "What's the preferred way to create threads?", [{ label: "A", text: "Implement Runnable interface (more flexible, allows extending other classes)" }, { label: "B", text: "Always extend Thread" }, { label: "C", text: "Use main() only" }], "A", "Implementing Runnable is preferred because Java doesn't support multiple inheritance."),
    t("Runnable Lambda", "Use a lambda for threading!", "new Thread(() -> doWork()).start();", "Lambdas make Runnable creation concise. Runnable is a functional interface.", "easy"),
  ],
  "synchronization": [
    q("Race Condition", "What is a race condition?", [{ label: "A", text: "When multiple threads access shared data concurrently causing unpredictable results" }, { label: "B", text: "A fast program" }, { label: "C", text: "A deadlock" }], "A", "Race conditions occur when thread execution order affects the outcome. Use synchronized to prevent."),
    t("Synchronized Block", "Protect shared data!", "synchronized (lock) {\n  counter++;\n}", "synchronized ensures only one thread executes the block at a time.", "medium"),
    q("Deadlock", "What causes deadlock?", [{ label: "A", text: "Two threads each waiting for a lock held by the other" }, { label: "B", text: "Too many threads" }, { label: "C", text: "Fast execution" }], "A", "Deadlock: Thread A holds Lock1, waits for Lock2. Thread B holds Lock2, waits for Lock1."),
  ],
  "executor-framework": [
    t("Thread Pool", "Create a thread pool!", "ExecutorService pool = Executors.newFixedThreadPool(4);\npool.submit(() -> processTask());\npool.shutdown();", "Thread pools reuse threads instead of creating new ones. Much more efficient.", "medium"),
    q("Future", "What does a Future represent?", [{ label: "A", text: "The result of an asynchronous computation" }, { label: "B", text: "A date/time" }, { label: "C", text: "A UI component" }], "A", "Future.get() blocks until the result is available. Use isDone() to check completion."),
  ],
  "concurrent-collections": [
    q("ConcurrentHashMap", "Why use ConcurrentHashMap over HashMap?", [{ label: "A", text: "Thread-safe without locking the entire map" }, { label: "B", text: "Faster for single threads" }, { label: "C", text: "Uses less memory" }], "A", "ConcurrentHashMap uses segment locking — multiple threads can read/write different segments simultaneously."),
    t("BlockingQueue", "Use a blocking queue!", "BlockingQueue<String> queue = new LinkedBlockingQueue<>();\nqueue.put(\"task\");\nString item = queue.take();", "put() blocks if full, take() blocks if empty. Perfect for producer-consumer pattern.", "hard"),
  ],
  "junit-testing": [
    t("JUnit Test", "Write a unit test!", "@Test\nvoid testAdd() {\n  Calculator calc = new Calculator();\n  assertEquals(5, calc.add(2, 3));\n}", "JUnit uses @Test annotation. assertEquals checks expected vs actual values.", "medium"),
    q("Assertions", "What does assertThrows() verify?", [{ label: "A", text: "That a specific exception is thrown" }, { label: "B", text: "That no exception occurs" }, { label: "C", text: "That the test passes" }], "A", "assertThrows(Exception.class, () -> methodThatThrows()) verifies exception handling."),
    t("Before/After", "Setup and teardown!", "@BeforeEach\nvoid setUp() {\n  db = new TestDatabase();\n}\n@AfterEach\nvoid tearDown() {\n  db.close();\n}", "@BeforeEach runs before every test. @AfterEach cleans up after each test.", "medium"),
  ],
  "test-driven-dev": [
    q("TDD Cycle", "What is the TDD cycle?", [{ label: "A", text: "Red → Green → Refactor" }, { label: "B", text: "Code → Test → Deploy" }, { label: "C", text: "Plan → Build → Ship" }], "A", "Red: write a failing test. Green: write minimum code to pass. Refactor: clean up while tests stay green."),
    t("TDD Example", "Write a failing test first!", "@Test\nvoid testDiscount() {\n  // RED: Test fails because method doesn't exist yet\n  assertEquals(90, pricing.applyDiscount(100, 10));\n}", "Write the test FIRST, then implement the method to make it pass.", "medium"),
  ],
  "singleton-pattern": [
    t("Singleton", "Implement Singleton!", "public class Database {\n  private static Database instance;\n  private Database() {}\n  public static Database getInstance() {\n    if (instance == null) instance = new Database();\n    return instance;\n  }\n}", "Private constructor + static getInstance() ensures only one instance exists.", "medium"),
    q("When to Use", "When is Singleton appropriate?", [{ label: "A", text: "Database connections, loggers, configuration — shared resources" }, { label: "B", text: "Every class" }, { label: "C", text: "Never" }], "A", "Use Singleton sparingly for truly global, shared resources. Overuse creates tight coupling."),
  ],
  "factory-pattern": [
    t("Factory Method", "Create a factory!", "public static Shape createShape(String type) {\n  return switch (type) {\n    case \"circle\" -> new Circle();\n    case \"square\" -> new Square();\n    default -> throw new IllegalArgumentException();\n  };\n}", "Factory methods encapsulate object creation logic, decoupling client from concrete classes.", "medium"),
    q("Factory Benefits", "What problem does the Factory pattern solve?", [{ label: "A", text: "Decouples object creation from usage — client doesn't need to know concrete classes" }, { label: "B", text: "Makes code faster" }, { label: "C", text: "Reduces memory" }], "A", "Factory lets you add new types without changing client code — Open/Closed Principle."),
  ],
  "observer-pattern": [
    t("Observer", "Implement Observer!", "interface Observer {\n  void update(String event, Object data);\n}\nclass EventBus {\n  List<Observer> listeners = new ArrayList<>();\n  void subscribe(Observer o) { listeners.add(o); }\n  void notify(String event, Object data) {\n    listeners.forEach(o -> o.update(event, data));\n  }\n}", "Observer enables loose coupling — publishers don't know about subscribers.", "hard"),
  ],
  "mvc-pattern": [
    q("MVC Components", "What are the three MVC components?", [{ label: "A", text: "Model (data), View (UI), Controller (logic between them)" }, { label: "B", text: "Main, Visual, Code" }, { label: "C", text: "Module, Version, Class" }], "A", "Model holds data, View displays it, Controller handles user input and updates Model."),
    t("MVC Example", "Define MVC classes!", "class StudentModel { String name; int grade; }\nclass StudentView { void display(String name, int grade) {...} }\nclass StudentController {\n  StudentModel model;\n  StudentView view;\n  void updateView() { view.display(model.name, model.grade); }\n}", "Controller mediates between Model and View, keeping them decoupled.", "medium"),
  ],
  "strategy-pattern": [
    t("Strategy", "Implement Strategy pattern!", "interface SortStrategy {\n  void sort(int[] data);\n}\nclass QuickSort implements SortStrategy {\n  public void sort(int[] data) { /* quicksort */ }\n}\nclass Sorter {\n  SortStrategy strategy;\n  void doSort(int[] data) { strategy.sort(data); }\n}", "Strategy lets you swap algorithms at runtime without changing the client.", "hard"),
  ],
  "maven-gradle": [
    t("Maven POM", "Write a Maven dependency!", "<dependency>\n  <groupId>org.junit.jupiter</groupId>\n  <artifactId>junit-jupiter</artifactId>\n  <version>5.10.0</version>\n  <scope>test</scope>\n</dependency>", "Maven uses pom.xml for dependencies. Gradle uses build.gradle with a simpler syntax.", "medium"),
    q("Maven vs Gradle", "How do Maven and Gradle differ?", [{ label: "A", text: "Maven uses XML config; Gradle uses Groovy/Kotlin DSL and is faster" }, { label: "B", text: "They are identical" }, { label: "C", text: "Maven is newer" }], "A", "Gradle is faster (incremental builds, caching) with more concise syntax than Maven's XML."),
  ],
  "database-jdbc": [
    t("JDBC Connection", "Connect to a database!", "Connection conn = DriverManager.getConnection(\n  \"jdbc:mysql://localhost:3306/mydb\",\n  \"user\", \"password\"\n);\nStatement stmt = conn.createStatement();\nResultSet rs = stmt.executeQuery(\"SELECT * FROM users\");", "JDBC is Java's standard API for database connectivity.", "hard"),
    q("PreparedStatement", "Why use PreparedStatement over Statement?", [{ label: "A", text: "Prevents SQL injection and improves performance with precompilation" }, { label: "B", text: "It's simpler" }, { label: "C", text: "It's optional" }], "A", "PreparedStatement parameterizes queries: ps.setString(1, name) — never concatenate user input."),
  ],
  "spring-boot-intro": [
    t("Spring Boot App", "Create a Spring Boot application!", "@SpringBootApplication\npublic class App {\n  public static void main(String[] args) {\n    SpringApplication.run(App.class, args);\n  }\n}", "@SpringBootApplication enables auto-configuration, component scanning, and property support.", "medium"),
    q("Spring DI", "What is Dependency Injection?", [{ label: "A", text: "The framework provides dependencies instead of the class creating them" }, { label: "B", text: "Importing libraries" }, { label: "C", text: "Database injection" }], "A", "DI = inversion of control. Use @Autowired or constructor injection for loose coupling."),
    t("REST Controller", "Build a REST endpoint!", "@RestController\n@RequestMapping(\"/api\")\npublic class UserController {\n  @GetMapping(\"/users\")\n  public List<User> getAll() {\n    return userService.findAll();\n  }\n}", "@RestController combines @Controller + @ResponseBody. Returns JSON by default.", "hard"),
  ],
  "rest-api-java": [
    t("POST Endpoint", "Handle POST requests!", "@PostMapping(\"/users\")\npublic ResponseEntity<User> create(@RequestBody User user) {\n  User saved = service.save(user);\n  return ResponseEntity.status(201).body(saved);\n}", "@RequestBody deserializes JSON to Java object. Return 201 Created for new resources.", "hard"),
    q("HTTP Status Codes", "What does 201 Created mean?", [{ label: "A", text: "A new resource was successfully created" }, { label: "B", text: "Not found" }, { label: "C", text: "Server error" }], "A", "200=OK, 201=Created, 204=No Content, 400=Bad Request, 404=Not Found, 500=Server Error."),
  ],
};

// ===================== SYSTEMS ANALYSIS EXPANDED =====================
export const systemsExpandedContent: Record<string, LessonStep[]> = {
  "systems-thinking": [
    q("Emergence", "What is emergence in systems thinking?", [{ label: "A", text: "Properties that arise from component interactions that no single part has alone" }, { label: "B", text: "Emergency procedures" }, { label: "C", text: "System crashes" }], "A", "A car can transport you — no single part (wheel, engine, seat) can do this alone. That's emergence."),
    t("Systems Thinking", "Type systems thinking principles!", "Holism: The whole > sum of parts\nEmergence: New properties arise\nFeedback: Output affects input\nBoundary: System vs environment", "Systems thinking sees interconnections, not isolated parts.", "easy"),
  ],
  "acceptance-criteria": [
    t("Given-When-Then", "Write acceptance criteria!", "Given: A user is logged in\nWhen: They click 'Buy Now'\nThen: The item is added to their order\nAnd: Their balance is reduced", "Given-When-Then format makes acceptance criteria testable and unambiguous.", "medium"),
    q("Why Acceptance Criteria", "Why are acceptance criteria important?", [{ label: "A", text: "They define when a user story is 'done' in testable terms" }, { label: "B", text: "They replace testing" }, { label: "C", text: "They are optional" }], "A", "Without acceptance criteria, 'done' is subjective. With them, it's measurable."),
  ],
  "kanban-method": [
    q("Kanban Principles", "What is a WIP limit in Kanban?", [{ label: "A", text: "Maximum number of tasks allowed in a workflow stage at once" }, { label: "B", text: "Total project tasks" }, { label: "C", text: "Sprint length" }], "A", "WIP (Work In Progress) limits prevent overloading. When a column is full, finish before starting new work."),
    t("Kanban Board", "Type Kanban columns!", "Backlog → To Do → In Progress (WIP: 3) → Review → Done", "Kanban visualizes workflow and uses WIP limits to optimize flow.", "easy"),
  ],
  "devops-systems": [
    q("DevOps Culture", "What is DevOps?", [{ label: "A", text: "A culture combining development and operations for continuous delivery" }, { label: "B", text: "A programming language" }, { label: "C", text: "A database tool" }], "A", "DevOps breaks down silos between dev and ops teams. Key practices: CI/CD, IaC, monitoring."),
    t("CI/CD Pipeline", "Type a CI/CD pipeline!", "1. Code commit → Git push\n2. Build → compile, lint\n3. Test → unit, integration\n4. Deploy staging → review\n5. Deploy production → release\n6. Monitor → alerts, logs", "CI merges code frequently. CD deploys automatically when tests pass.", "medium"),
  ],
  "microservices": [
    q("Monolith vs Microservices", "What are microservices?", [{ label: "A", text: "Small, independent services that each do one thing well and communicate via APIs" }, { label: "B", text: "One big application" }, { label: "C", text: "A type of database" }], "A", "Microservices can be deployed, scaled, and updated independently. Monoliths deploy as one unit."),
    t("Service Communication", "Type microservice patterns!", "REST API: HTTP request/response\nMessage Queue: Async (RabbitMQ, Kafka)\nService Discovery: Find services dynamically\nAPI Gateway: Single entry point\nCircuit Breaker: Handle failures gracefully", "Each pattern solves a specific distributed systems challenge.", "hard"),
  ],
};

// ===================== MATHS EXPANDED =====================
export const mathExpandedContent: Record<string, LessonStep[]> = {
  "binary-arithmetic": [
    q("Binary Addition Rules", "What is 1+1 in binary?", [{ label: "A", text: "10 (carry 1, write 0)" }, { label: "B", text: "2" }, { label: "C", text: "11" }], "A", "Binary addition: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (carry 1). Just like decimal carries at 10."),
    t("Add Binary", "Add two binary numbers!", "  1011\n+ 0110\n------\n 10001", "1011 (11) + 0110 (6) = 10001 (17). Carry the 1 when sum ≥ 2.", "medium"),
    t("Addition Drill", "Practice binary addition!", "  1100\n+ 1010\n------\n 10110", "12 + 10 = 22. Work right to left, carrying when needed.", "medium"),
    q("Overflow", "What happens when addition exceeds the bit width?", [{ label: "A", text: "Overflow — the carry bit is lost, giving a wrong result" }, { label: "B", text: "The computer adds more bits" }, { label: "C", text: "Nothing happens" }], "A", "8-bit overflow: 11111111 + 1 = 100000000, but only 00000000 is stored. Result wraps to 0."),
  ],
  "ieee-754": [
    q("IEEE 754 Format", "What are the three parts of an IEEE 754 number?", [{ label: "A", text: "Sign bit, exponent, mantissa (significand)" }, { label: "B", text: "Integer, decimal, fraction" }, { label: "C", text: "Ones, tens, hundreds" }], "A", "Single precision: 1 sign + 8 exponent + 23 mantissa = 32 bits total."),
    t("IEEE 754 Layout", "Type the IEEE 754 format!", "Single Precision (32-bit):\nSign: 1 bit (0=positive, 1=negative)\nExponent: 8 bits (bias 127)\nMantissa: 23 bits (implicit leading 1)", "The bias allows representing both positive and negative exponents.", "hard"),
    q("Bias", "Why does IEEE 754 use a bias for the exponent?", [{ label: "A", text: "To represent both positive and negative exponents without a sign bit" }, { label: "B", text: "To make numbers bigger" }, { label: "C", text: "For compression" }], "A", "Stored exponent = actual exponent + 127. So exponent 5 is stored as 132 (10000100)."),
  ],
  "karnaugh-maps": [
    q("K-Map Purpose", "What do Karnaugh Maps simplify?", [{ label: "A", text: "Boolean expressions by grouping adjacent 1s visually" }, { label: "B", text: "Arithmetic" }, { label: "C", text: "Network topology" }], "A", "K-Maps find the minimal Sum-of-Products expression. Group 1s in powers of 2 (1,2,4,8)."),
    t("K-Map Groups", "Type K-Map grouping rules!", "Groups must be: powers of 2 (1, 2, 4, 8)\nGroups can wrap around edges\nMake groups as large as possible\nEvery 1 must be in at least one group\nFewer groups = simpler expression", "K-Maps are faster than algebraic simplification for 2-4 variables.", "medium"),
  ],
  "probability-basics": [
    q("Probability Formula", "How do you calculate probability?", [{ label: "A", text: "P(event) = favorable outcomes / total outcomes" }, { label: "B", text: "P = outcomes × events" }, { label: "C", text: "P = 1 always" }], "A", "Probability ranges from 0 (impossible) to 1 (certain). P(heads) = 1/2 = 0.5."),
    t("Probability Example", "Calculate a probability!", "Dice roll: P(6) = 1/6 = 0.167\nCoin flip: P(heads) = 1/2 = 0.5\nDeck of cards: P(ace) = 4/52 = 1/13", "Count favorable outcomes, divide by total possible outcomes.", "easy"),
  ],
  "bayes-theorem": [
    q("Bayes' Theorem", "What does Bayes' Theorem calculate?", [{ label: "A", text: "The probability of a hypothesis given observed evidence" }, { label: "B", text: "The average" }, { label: "C", text: "The maximum value" }], "A", "P(A|B) = P(B|A) × P(A) / P(B). Used in spam filters, medical diagnosis, and ML."),
    t("Bayes Formula", "Type Bayes' Theorem!", "P(A|B) = P(B|A) × P(A) / P(B)\n\nPosterior = (Likelihood × Prior) / Evidence", "Bayes updates our belief (prior) with new evidence to get the posterior probability.", "hard"),
  ],
  "matrices-intro": [
    q("Matrix Definition", "What is a matrix?", [{ label: "A", text: "A rectangular array of numbers arranged in rows and columns" }, { label: "B", text: "A single number" }, { label: "C", text: "A type of graph" }], "A", "A 2×3 matrix has 2 rows and 3 columns. Used in graphics, ML, and data processing."),
    t("Matrix Notation", "Type a matrix!", "A = | 1  2  3 |\n    | 4  5  6 |\n\nRows: 2, Columns: 3\nElement a₁₂ = 2 (row 1, column 2)", "Matrix dimensions are always rows × columns. Elements indexed by (row, col).", "easy"),
  ],
  "matrix-operations": [
    t("Matrix Addition", "Add two matrices!", "| 1  2 |   | 5  6 |   | 6   8 |\n| 3  4 | + | 7  8 | = | 10  12 |", "Add corresponding elements. Matrices must have the same dimensions.", "medium"),
    q("Matrix Multiplication", "When can you multiply matrices A × B?", [{ label: "A", text: "When A's columns = B's rows" }, { label: "B", text: "When they're the same size" }, { label: "C", text: "Always" }], "A", "A(m×n) × B(n×p) = C(m×p). Each element is the dot product of a row and column."),
  ],
};

// ===================== CYBERSECURITY EXPANDED =====================
export const cyberExpandedContent: Record<string, LessonStep[]> = {
  "penetration-testing": [
    q("Pen Test Phases", "What are the phases of penetration testing?", [{ label: "A", text: "Reconnaissance, Scanning, Exploitation, Post-exploitation, Reporting" }, { label: "B", text: "Install, Run, Delete" }, { label: "C", text: "Plan, Build, Ship" }], "A", "Pen testing follows a structured methodology to simulate real attacks ethically."),
    t("Nmap Scan", "Run a network scan!", "nmap -sV -sC 192.168.1.0/24\nnmap -p 1-65535 target_ip\nnmap -A target_ip\nnmap --script vuln target_ip", "-sV: service versions, -sC: default scripts, -A: aggressive scan, --script: specific scripts.", "hard"),
    t("Metasploit", "Type Metasploit commands!", "msfconsole\nuse exploit/multi/handler\nset PAYLOAD windows/meterpreter/reverse_tcp\nset LHOST 192.168.1.100\nset LPORT 4444\nrun", "Metasploit is the most popular pen testing framework. Always get written permission first!", "hard"),
  ],
  "incident-response": [
    q("IR Phases", "What are the NIST incident response phases?", [{ label: "A", text: "Preparation, Detection & Analysis, Containment & Eradication, Post-Incident Review" }, { label: "B", text: "Ignore, Fix, Forget" }, { label: "C", text: "Detect, Delete, Deploy" }], "A", "NIST SP 800-61 defines the IR lifecycle. Preparation is the most important phase."),
    t("PICERL Mnemonic", "Type the IR mnemonic!", "P - Preparation (train, plan, tools)\nI - Identification (detect the incident)\nC - Containment (stop the spread)\nE - Eradication (remove the threat)\nR - Recovery (restore systems)\nL - Lessons Learned (post-mortem)", "P.I.C.E.R.L — memorize this for incident response!", "medium"),
  ],
  "zero-trust": [
    q("Zero Trust Principle", "What is the core principle of Zero Trust?", [{ label: "A", text: "Never trust, always verify — regardless of network location" }, { label: "B", text: "Trust everyone inside the network" }, { label: "C", text: "No security needed" }], "A", "Zero Trust assumes breach. Every access request is verified: identity, device, context."),
    t("Zero Trust Pillars", "Type Zero Trust pillars!", "1. Verify explicitly (always authenticate)\n2. Least privilege access\n3. Assume breach\n4. Micro-segmentation\n5. Continuous monitoring", "Zero Trust replaces perimeter-based security with identity-based security.", "medium"),
  ],
  "siem-soc": [
    q("SIEM Purpose", "What does a SIEM do?", [{ label: "A", text: "Collects, correlates, and analyzes security logs from across the organization" }, { label: "B", text: "Blocks all traffic" }, { label: "C", text: "Writes code" }], "A", "SIEM (Security Information and Event Management) tools: Splunk, Microsoft Sentinel, IBM QRadar."),
    t("SOC Tiers", "Type SOC analyst tiers!", "Tier 1: Alert triage and initial analysis\nTier 2: Deep investigation and incident handling\nTier 3: Threat hunting and advanced forensics\nSOC Manager: Oversees operations", "SOC (Security Operations Center) operates 24/7 to detect and respond to threats.", "medium"),
  ],
  "web-app-security": [
    q("OWASP Top 10", "What is the #1 OWASP vulnerability?", [{ label: "A", text: "Broken Access Control" }, { label: "B", text: "SQL Injection" }, { label: "C", text: "XSS" }], "A", "OWASP Top 10 (2021): #1 Broken Access Control, #2 Cryptographic Failures, #3 Injection."),
    t("SQL Injection", "Type a SQL injection example and fix!", "-- Vulnerable:\nSELECT * FROM users WHERE name = '' OR 1=1 --'\n\n-- Fixed (parameterized):\nPreparedStatement ps = conn.prepareStatement(\n  \"SELECT * FROM users WHERE name = ?\");\nps.setString(1, userInput);", "Never concatenate user input into SQL. Always use parameterized queries.", "hard"),
  ],
};

// ===================== BUSINESS EXPANDED =====================
export const businessExpandedContent: Record<string, LessonStep[]> = {
  "whmcs-hosting": [
    q("WHMCS Purpose", "What is WHMCS?", [{ label: "A", text: "Web Host Manager Complete Solution — automates web hosting business operations" }, { label: "B", text: "A programming language" }, { label: "C", text: "A web browser" }], "A", "WHMCS handles billing, provisioning, support tickets, and domain management for hosting companies."),
    t("WHMCS Features", "Type WHMCS core features!", "Billing: Invoicing, recurring payments\nProvisioning: Auto-create hosting accounts\nSupport: Ticket system, knowledgebase\nDomains: Registration, transfers, DNS\nClient Portal: Self-service management", "WHMCS integrates with cPanel, Plesk, and payment gateways like Stripe/PayPal.", "medium"),
    q("WHMCS Automation", "What does WHMCS automate?", [{ label: "A", text: "Account setup, billing, renewals, suspensions, and terminations" }, { label: "B", text: "Only email" }, { label: "C", text: "Nothing — it's manual" }], "A", "When a client pays, WHMCS auto-creates their hosting account. Unpaid? Auto-suspends."),
  ],
  "vps-hosting": [
    q("VPS Definition", "What is a VPS?", [{ label: "A", text: "Virtual Private Server — a virtualized server with dedicated resources" }, { label: "B", text: "A physical server" }, { label: "C", text: "A website builder" }], "A", "VPS gives you root access and dedicated RAM/CPU. It's between shared hosting and dedicated servers."),
    t("Hosting Types", "Type all hosting types!", "Shared: £3-10/mo, shared resources\nVPS: £15-80/mo, dedicated resources, root access\nDedicated: £80-300/mo, entire physical server\nCloud: Pay-per-use (AWS, Azure, GCP)\nManaged: Provider handles server admin", "VPS is the sweet spot for growing businesses needing control without dedicated costs.", "medium"),
    q("VPS vs Shared", "Why choose VPS over shared hosting?", [{ label: "A", text: "Dedicated resources, root access, better performance, isolation" }, { label: "B", text: "It's cheaper" }, { label: "C", text: "No differences" }], "A", "VPS: guaranteed RAM/CPU, full control, can install custom software. Shared: limited and noisy neighbors."),
  ],
  "hosting-fundamentals": [
    t("DNS Records", "Type DNS record types!", "A Record: domain → IPv4 address\nAAAA: domain → IPv6 address\nCNAME: alias → another domain\nMX: mail server records\nTXT: verification, SPF, DKIM\nNS: nameserver delegation", "DNS translates human-readable domains to IP addresses. TTL controls cache duration.", "medium"),
    q("SSL/TLS", "What does an SSL certificate do?", [{ label: "A", text: "Encrypts data between browser and server (HTTPS)" }, { label: "B", text: "Speeds up the website" }, { label: "C", text: "Blocks ads" }], "A", "SSL/TLS enables HTTPS. Let's Encrypt provides free certificates. Always use HTTPS in production."),
    t("cPanel Basics", "Type cPanel sections!", "Files: File Manager, Backups, FTP\nDatabases: MySQL, phpMyAdmin\nDomains: Subdomains, Redirects, DNS\nEmail: Accounts, Forwarders, SPF/DKIM\nSecurity: SSL, IP Blocker, Hotlink Protection\nSoftware: PHP versions, WordPress installer", "cPanel is the most popular web hosting control panel. Plesk is the main alternative.", "medium"),
  ],
  "digital-marketing-strategy": [
    q("Digital Marketing Channels", "What are the main digital marketing channels?", [{ label: "A", text: "SEO, PPC, Social Media, Email, Content Marketing, Affiliate" }, { label: "B", text: "Only TV ads" }, { label: "C", text: "Only billboards" }], "A", "A multi-channel strategy reaches customers at every stage of the buying journey."),
    t("Marketing KPIs", "Type essential marketing KPIs!", "CAC: Customer Acquisition Cost\nLTV: Lifetime Value\nROAS: Return on Ad Spend\nCTR: Click-Through Rate\nCPA: Cost Per Acquisition\nMRR: Monthly Recurring Revenue", "LTV/CAC ratio should be >3:1. Track these to measure marketing effectiveness.", "medium"),
    q("Content Marketing", "What is the purpose of content marketing?", [{ label: "A", text: "Attract, engage, and convert audiences through valuable content" }, { label: "B", text: "Only sell products" }, { label: "C", text: "Trick customers" }], "A", "Blog posts, videos, podcasts, infographics — valuable content builds trust and organic traffic."),
  ],
  "social-media-marketing": [
    t("Platform Strategy", "Type social media strategies!", "LinkedIn: B2B, thought leadership, networking\nInstagram: Visual brands, stories, reels\nTwitter/X: Real-time engagement, news\nTikTok: Short video, Gen Z, trends\nFacebook: Communities, groups, ads\nYouTube: Long-form video, tutorials, SEO", "Each platform has different demographics and content formats. Don't try to be everywhere.", "medium"),
    q("Engagement Rate", "How is engagement rate calculated?", [{ label: "A", text: "(Likes + Comments + Shares) / Followers × 100" }, { label: "B", text: "Number of posts" }, { label: "C", text: "Follower count only" }], "A", "Engagement rate measures how actively your audience interacts. 1-3% is average, 5%+ is excellent."),
  ],
  "saas-business-model": [
    q("SaaS Definition", "What is SaaS?", [{ label: "A", text: "Software as a Service — cloud-hosted software accessed via subscription" }, { label: "B", text: "Selling hardware" }, { label: "C", text: "A type of database" }], "A", "SaaS examples: Slack, Zoom, Salesforce, Netflix. Users pay monthly/annually instead of buying."),
    t("SaaS Metrics", "Type critical SaaS metrics!", "MRR: Monthly Recurring Revenue\nARR: Annual Recurring Revenue\nChurn Rate: % customers who cancel\nNRR: Net Revenue Retention (>100% = growth)\nCAC Payback: Months to recoup acquisition cost", "Rule of 40: Growth rate + profit margin should exceed 40% for healthy SaaS.", "hard"),
  ],
  "excel-formulas-deep": [
    t("XLOOKUP", "Use the modern lookup!", '=XLOOKUP("Alice", A:A, C:C, "Not Found")\n=XLOOKUP(B2, prices[Item], prices[Cost])', "XLOOKUP replaces VLOOKUP — can search in any direction, returns exact match by default.", "medium"),
    t("Array Formulas", "Type dynamic array formulas!", '=FILTER(A2:C100, B2:B100="Sales")\n=SORT(A2:A20, 1, 1)\n=UNIQUE(B2:B100)\n=SEQUENCE(10, 1, 1, 1)', "Dynamic arrays spill results automatically. FILTER, SORT, UNIQUE are game-changers.", "hard"),
    t("VBA Macro", "Write a VBA macro!", 'Sub FormatReport()\n  Range("A1:D1").Font.Bold = True\n  Columns("A:D").AutoFit\n  Range("A1").AutoFilter\n  MsgBox "Report formatted!"\nEnd Sub', "VBA automates repetitive Excel tasks. Record macros first, then edit the code.", "hard"),
  ],
};

// ===================== GAME DEV EXPANDED =====================
export const gameDevExpandedContent: Record<string, LessonStep[]> = {
  "ecs-architecture": [
    q("ECS Pattern", "What is Entity Component System?", [{ label: "A", text: "Entities are IDs, Components hold data, Systems process entities with specific components" }, { label: "B", text: "A type of OOP" }, { label: "C", text: "A rendering engine" }], "A", "ECS favors composition over inheritance. Entity = ID, Component = data, System = behavior."),
    t("ECS Example", "Define ECS components!", "// Components (data only)\nPosition { x: number; y: number }\nVelocity { dx: number; dy: number }\nSprite { texture: string; frame: number }\n\n// System (logic)\nfunction movementSystem(entities) {\n  for (e of entitiesWithPositionAndVelocity) {\n    e.position.x += e.velocity.dx * dt;\n  }\n}", "Systems query entities by component type and process them in bulk.", "hard"),
  ],
  "shaders-intro": [
    q("Shader Types", "What are the two main shader types?", [{ label: "A", text: "Vertex shader (transforms geometry) and Fragment shader (colors pixels)" }, { label: "B", text: "Audio and visual" }, { label: "C", text: "Input and output" }], "A", "Vertex shaders run per vertex. Fragment (pixel) shaders run per pixel. Both run on the GPU."),
    t("GLSL Shader", "Write a fragment shader!", "void main() {\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n  vec3 color = vec3(uv.x, uv.y, 0.5);\n  gl_FragColor = vec4(color, 1.0);\n}", "GLSL runs on the GPU — massively parallel. Each pixel calculates independently.", "hard"),
  ],
  "pathfinding": [
    q("A* Algorithm", "What makes A* efficient for pathfinding?", [{ label: "A", text: "It uses a heuristic to estimate distance, exploring promising paths first" }, { label: "B", text: "It checks every possible path" }, { label: "C", text: "It moves randomly" }], "A", "A* cost: f(n) = g(n) + h(n). g = actual cost, h = heuristic estimate. Guarantees shortest path."),
    t("A* Pseudocode", "Type A* algorithm!", "openSet = {start}\nwhile openSet not empty:\n  current = lowest f(n) in openSet\n  if current == goal: return path\n  for neighbor of current:\n    tentativeG = g[current] + dist(current, neighbor)\n    if tentativeG < g[neighbor]:\n      cameFrom[neighbor] = current\n      g[neighbor] = tentativeG\n      f[neighbor] = g[neighbor] + h(neighbor)", "A* combines Dijkstra's optimality with greedy best-first search's speed.", "hard"),
  ],
  "game-ai-basics": [
    q("Game AI Types", "What is a behavior tree?", [{ label: "A", text: "A hierarchical decision structure with selectors, sequences, and actions" }, { label: "B", text: "A filesystem" }, { label: "C", text: "A network diagram" }], "A", "Behavior trees replaced finite state machines for complex AI. Used in AAA games."),
    t("Behavior Tree", "Type behavior tree nodes!", "Selector (OR): Try children until one succeeds\nSequence (AND): Run children until one fails\nAction: Do something (attack, move, patrol)\nCondition: Check state (is enemy nearby?)\nDecorator: Modify child (repeat, invert)", "Selector = 'try alternatives'. Sequence = 'do all steps in order'.", "hard"),
  ],
};

// ===================== COMPUTER SYSTEMS EXPANDED =====================
export const computerSystemsExpandedContent: Record<string, LessonStep[]> = {
  "visual-studio-code": [
    q("VS Code Overview", "What is Visual Studio Code?", [{ label: "A", text: "A free, lightweight code editor by Microsoft with extension support" }, { label: "B", text: "A full IDE like Visual Studio" }, { label: "C", text: "A web browser" }], "A", "VS Code is the most popular code editor. It supports every language through extensions."),
    t("VS Code Shortcuts", "Type essential shortcuts!", "Ctrl+P: Quick file open\nCtrl+Shift+P: Command palette\nCtrl+D: Select next occurrence\nCtrl+/: Toggle comment\nAlt+Up/Down: Move line\nCtrl+Shift+K: Delete line\nF5: Start debugging", "Learn shortcuts to code 2-3x faster. Command Palette (Ctrl+Shift+P) is the most powerful.", "easy"),
    t("VS Code Extensions", "Type must-have extensions!", "ESLint: JavaScript linting\nPrettier: Code formatting\nLive Server: Auto-reload preview\nGitLens: Git blame and history\nAuto Rename Tag: HTML tag sync\nThunder Client: API testing\nError Lens: Inline error display", "Extensions transform VS Code into a full IDE for any language.", "easy"),
    q("Integrated Terminal", "What can VS Code's integrated terminal do?", [{ label: "A", text: "Run any shell command without leaving the editor" }, { label: "B", text: "Only open files" }, { label: "C", text: "Only Git commands" }], "A", "Ctrl+` opens the terminal. Run npm, git, python — anything you'd run in a system terminal."),
  ],
  "ide-comparison": [
    q("IDE vs Editor", "What's the difference between an IDE and a code editor?", [{ label: "A", text: "IDEs have built-in compilers, debuggers, and project tools; editors are lightweight" }, { label: "B", text: "No difference" }, { label: "C", text: "Editors are better" }], "A", "IDEs (IntelliJ, Eclipse, Visual Studio): full toolchain built-in. Editors (VS Code, Sublime): lightweight + extensions."),
    t("IDE List", "Type popular IDEs!", "IntelliJ IDEA: Java, Kotlin (JetBrains)\nEclipse: Java, enterprise\nVisual Studio: C#, .NET (full IDE)\nPyCharm: Python (JetBrains)\nAndroid Studio: Android apps\nXcode: iOS/macOS apps\nVS Code: Multi-language editor", "Choose your IDE based on language and project needs.", "easy"),
  ],
  "python-intro": [
    q("Python Overview", "What makes Python popular?", [{ label: "A", text: "Simple syntax, huge library ecosystem, used in AI/web/automation" }, { label: "B", text: "It's the fastest language" }, { label: "C", text: "It only works on Windows" }], "A", "Python's readable syntax and libraries (pandas, Django, TensorFlow) make it #1 for beginners and data science."),
    t("Python Basics", "Write Python code!", "name = \"Alice\"\nage = 25\nis_student = True\n\nif age >= 18:\n    print(f\"{name} is an adult\")\nelse:\n    print(f\"{name} is a minor\")", "Python uses indentation instead of braces. No semicolons needed.", "easy"),
    t("Python Functions", "Define a function!", "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\nresult = greet(\"Alice\")\nprint(result)  # Hello, Alice!", "def defines functions. f-strings format output. Default parameters are optional.", "easy"),
    q("Python vs Java", "How does Python differ from Java?", [{ label: "A", text: "Python is dynamically typed, interpreted, uses indentation; Java is statically typed, compiled" }, { label: "B", text: "They are the same" }, { label: "C", text: "Python is older" }], "A", "Python: rapid development, scripting, data science. Java: enterprise, Android, strong typing."),
  ],
  "python-data-structures": [
    t("Lists and Dicts", "Use Python data structures!", "fruits = [\"apple\", \"banana\", \"cherry\"]\nfruits.append(\"date\")\n\nuser = {\"name\": \"Alice\", \"age\": 25}\nprint(user[\"name\"])\n\nnums = [x**2 for x in range(10)]", "Lists are mutable arrays. Dicts are key-value maps. List comprehensions are powerful.", "medium"),
    t("Loops", "Write Python loops!", "for fruit in fruits:\n    print(fruit)\n\nfor i, item in enumerate(fruits):\n    print(f\"{i}: {item}\")\n\nwhile count > 0:\n    count -= 1", "for loops iterate over sequences. enumerate() gives index + value.", "easy"),
  ],
  "github-workflow": [
    q("Git Basics", "What is Git?", [{ label: "A", text: "A distributed version control system that tracks code changes" }, { label: "B", text: "A cloud storage service" }, { label: "C", text: "A programming language" }], "A", "Git tracks every change. GitHub/GitLab host Git repositories with collaboration features."),
    t("Git Commands", "Type essential Git commands!", "git init\ngit add .\ngit commit -m \"Initial commit\"\ngit branch feature/login\ngit checkout feature/login\ngit push origin feature/login\ngit pull origin main\ngit merge feature/login", "Git workflow: branch → code → commit → push → pull request → merge.", "medium"),
    t("GitHub PR Flow", "Type the pull request workflow!", "1. git checkout -b feature/new-ui\n2. Make changes, commit\n3. git push origin feature/new-ui\n4. Open Pull Request on GitHub\n5. Code review by teammates\n6. Address feedback, push fixes\n7. Approve and merge\n8. Delete feature branch", "PRs are the standard for code review. Every team uses this workflow.", "medium"),
    q("Git Conflicts", "What causes a merge conflict?", [{ label: "A", text: "Two branches modified the same lines of the same file" }, { label: "B", text: "Too many commits" }, { label: "C", text: "Large files" }], "A", "Conflicts happen when Git can't auto-merge. Edit the conflicted file, choose changes, commit."),
    t("GitHub Actions", "Write a CI workflow!", "name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install\n      - run: npm test\n      - run: npm run build", "GitHub Actions automates testing on every push. YAML in .github/workflows/.", "hard"),
  ],
  "sql-fundamentals": [
    t("SQL CRUD", "Type all SQL CRUD operations!", "-- Create\nINSERT INTO users (name, email) VALUES ('Alice', 'a@b.com');\n\n-- Read\nSELECT * FROM users WHERE age > 18;\n\n-- Update\nUPDATE users SET name = 'Bob' WHERE id = 1;\n\n-- Delete\nDELETE FROM users WHERE id = 1;", "CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE).", "medium"),
    t("SQL Joins", "Write JOIN queries!", "-- INNER JOIN: matching rows in both\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- LEFT JOIN: all left + matching right\nSELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;", "INNER = intersection, LEFT = all left rows, RIGHT = all right rows, FULL = everything.", "medium"),
    t("SQL Aggregation", "Use aggregate functions!", "SELECT department,\n  COUNT(*) as staff_count,\n  AVG(salary) as avg_salary,\n  MAX(salary) as max_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 50000\nORDER BY avg_salary DESC;", "GROUP BY groups rows. HAVING filters groups (like WHERE for aggregates).", "hard"),
    q("Normalization", "What is database normalization?", [{ label: "A", text: "Organizing data to reduce redundancy and improve integrity" }, { label: "B", text: "Making tables bigger" }, { label: "C", text: "Deleting duplicate rows" }], "A", "1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies."),
  ],
  "networking-fundamentals": [
    t("OSI Model", "Type all 7 OSI layers!", "7. Application (HTTP, FTP, SMTP)\n6. Presentation (SSL, encryption)\n5. Session (session management)\n4. Transport (TCP, UDP)\n3. Network (IP, routing)\n2. Data Link (MAC, switches)\n1. Physical (cables, signals)", "Mnemonic: Please Do Not Throw Sausage Pizza Away (bottom to top).", "medium"),
    q("TCP vs UDP", "What's the main difference between TCP and UDP?", [{ label: "A", text: "TCP guarantees delivery with handshake; UDP is faster but unreliable" }, { label: "B", text: "They are identical" }, { label: "C", text: "UDP is more reliable" }], "A", "TCP: web, email, file transfer (reliability). UDP: gaming, streaming, DNS (speed)."),
    t("TCP Handshake", "Type the TCP three-way handshake!", "1. SYN: Client → Server (I want to connect)\n2. SYN-ACK: Server → Client (OK, acknowledged)\n3. ACK: Client → Server (Connection established)\n\nTo close: FIN → ACK → FIN → ACK", "Every TCP connection starts with this handshake. SYN = synchronize.", "medium"),
  ],
  "operating-systems": [
    q("OS Functions", "What does an operating system do?", [{ label: "A", text: "Manages hardware resources, runs applications, provides user interface" }, { label: "B", text: "Only displays graphics" }, { label: "C", text: "Only connects to internet" }], "A", "OS manages: CPU scheduling, memory allocation, file systems, I/O devices, security."),
    t("OS Types", "Type operating system types!", "Desktop: Windows, macOS, Linux\nMobile: Android, iOS\nServer: Linux (Ubuntu, CentOS), Windows Server\nEmbedded: RTOS, FreeRTOS\nCloud: Container OS (Alpine, CoreOS)", "Linux dominates servers (96%+ of cloud). Windows dominates desktop. Android dominates mobile.", "easy"),
    q("Process vs Thread", "What's the difference between a process and thread?", [{ label: "A", text: "Process = independent program with own memory; Thread = lightweight execution within a process" }, { label: "B", text: "They are the same" }, { label: "C", text: "Threads are larger" }], "A", "Processes are isolated. Threads share memory within a process — faster but need synchronization."),
  ],
};

// ===================== WEB TECHNOLOGIES EXPANDED =====================
export const webExpandedContent: Record<string, LessonStep[]> = {
  "html-forms": [
    t("HTML Form", "Build a complete form!", '<form action="/submit" method="POST">\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  <label for="pass">Password:</label>\n  <input type="password" id="pass" name="pass" minlength="8">\n  <button type="submit">Sign Up</button>\n</form>', "Forms use action (URL) and method (GET/POST). Always use labels for accessibility.", "medium"),
    q("Input Types", "Which HTML5 input type validates email format?", [{ label: "A", text: 'type="email"' }, { label: "B", text: 'type="text"' }, { label: "C", text: 'type="url"' }], "A", "HTML5 input types (email, url, date, number, tel) provide built-in validation."),
    t("Form Validation", "Add HTML5 validation!", '<input type="text" required minlength="2" maxlength="50">\n<input type="number" min="0" max="100" step="1">\n<input type="email" pattern="[a-z]+@[a-z]+\\.[a-z]+">', "HTML5 validation attributes prevent invalid submissions without JavaScript.", "medium"),
  ],
  "html-semantic": [
    t("Semantic Elements", "Use semantic HTML!", "<header>\n  <nav>Navigation</nav>\n</header>\n<main>\n  <article>\n    <section>Content</section>\n  </article>\n  <aside>Sidebar</aside>\n</main>\n<footer>Footer</footer>", "Semantic elements describe their purpose. Screen readers and SEO rely on them.", "easy"),
    q("Why Semantic HTML", "Why use <article> instead of <div>?", [{ label: "A", text: "Conveys meaning to browsers, screen readers, and search engines" }, { label: "B", text: "It looks different" }, { label: "C", text: "It's faster" }], "A", "Semantic HTML improves accessibility (WCAG), SEO rankings, and code readability."),
  ],
  "css-flexbox": [
    t("Flexbox Container", "Create a flex layout!", ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}", "Flexbox handles one-dimensional layouts. justify = main axis, align = cross axis.", "medium"),
    t("Flex Items", "Control flex items!", ".item {\n  flex: 1;          /* grow equally */\n}\n.sidebar {\n  flex: 0 0 300px;  /* fixed width */\n}\n.main {\n  flex: 1;          /* fill remaining */\n}", "flex: grow shrink basis. flex: 1 means grow to fill. flex: 0 0 300px means fixed 300px.", "medium"),
    q("Flex Direction", "What does flex-direction: column do?", [{ label: "A", text: "Arranges items vertically instead of horizontally" }, { label: "B", text: "Hides items" }, { label: "C", text: "Rotates items" }], "A", "row = horizontal (default), column = vertical. Main axis changes with direction."),
  ],
  "css-grid-advanced": [
    t("Grid Areas", "Create named grid areas!", ".layout {\n  display: grid;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar main\"\n    \"footer footer\";\n  grid-template-columns: 250px 1fr;\n}\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }", "Named grid areas make complex layouts readable and maintainable.", "hard"),
  ],
  "web-animations": [
    t("CSS Keyframes", "Create a bounce animation!", "@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}\n.element {\n  animation: bounce 0.6s ease infinite;\n}", "Keyframes define animation states. animation shorthand: name duration timing iteration.", "medium"),
    t("CSS Transitions", "Add smooth transitions!", ".button {\n  transition: all 0.3s ease;\n  background: hsl(var(--primary));\n}\n.button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);\n}", "Transitions animate between states. Use transform and opacity for smooth 60fps animations.", "medium"),
    q("Performance", "Which CSS properties animate most efficiently?", [{ label: "A", text: "transform and opacity (GPU-accelerated, don't trigger layout)" }, { label: "B", text: "width and height" }, { label: "C", text: "margin and padding" }], "A", "transform/opacity are composited on the GPU. width/height/margin trigger expensive layout recalculations."),
  ],
  "responsive-design-deep": [
    t("Mobile First", "Write mobile-first CSS!", "/* Base: mobile */\n.grid { display: flex; flex-direction: column; }\n\n/* Tablet */\n@media (min-width: 768px) {\n  .grid { flex-direction: row; flex-wrap: wrap; }\n  .item { width: 50%; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .item { width: 33.33%; }\n}", "Mobile-first: start small, add complexity with min-width breakpoints.", "medium"),
    t("Viewport Units", "Use modern responsive units!", ".hero {\n  height: 100dvh; /* dynamic viewport height */\n  font-size: clamp(1rem, 2.5vw, 2rem);\n  padding: clamp(1rem, 5vw, 4rem);\n}", "clamp() sets min, preferred, and max values. dvh handles mobile browser chrome.", "hard"),
  ],
  "pwa-deep": [
    t("Service Worker", "Register a service worker!", "// main.js\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js')\n    .then(reg => console.log('SW registered'))\n    .catch(err => console.error('SW failed', err));\n}", "Service workers are background scripts that enable offline support and push notifications.", "medium"),
    t("Web App Manifest", "Create a manifest.json!", '{\n  "name": "My PWA",\n  "short_name": "PWA",\n  "start_url": "/",\n  "display": "standalone",\n  "background_color": "#ffffff",\n  "theme_color": "#3b82f6",\n  "icons": [\n    { "src": "/icon-192.png", "sizes": "192x192" },\n    { "src": "/icon-512.png", "sizes": "512x512" }\n  ]\n}', "The manifest makes your web app installable on mobile and desktop.", "medium"),
    q("PWA Requirements", "What makes a web app a PWA?", [{ label: "A", text: "HTTPS, service worker, and web app manifest" }, { label: "B", text: "Only a manifest" }, { label: "C", text: "An app store listing" }], "A", "PWAs work offline, are installable, and receive push notifications — all from the browser."),
  ],
  "api-rest-design": [
    t("RESTful Endpoints", "Design REST API endpoints!", "GET    /api/products          → List all\nGET    /api/products/:id      → Get one\nPOST   /api/products          → Create\nPUT    /api/products/:id      → Update (full)\nPATCH  /api/products/:id      → Update (partial)\nDELETE /api/products/:id      → Delete", "REST uses HTTP methods as verbs and URLs as nouns. Stateless = each request is independent.", "medium"),
    q("GraphQL vs REST", "When would you choose GraphQL over REST?", [{ label: "A", text: "When clients need flexible queries to avoid over/under-fetching" }, { label: "B", text: "Always" }, { label: "C", text: "For simple CRUD apps" }], "A", "GraphQL: client specifies exact data needed. REST: server defines response shape. Both have trade-offs."),
  ],
  "web-security": [
    q("XSS Attack", "What is Cross-Site Scripting (XSS)?", [{ label: "A", text: "Injecting malicious scripts into web pages viewed by other users" }, { label: "B", text: "A CSS framework" }, { label: "C", text: "A server configuration" }], "A", "XSS allows attackers to steal cookies, redirect users, or deface pages. Sanitize all user input!"),
    t("XSS Prevention", "Type XSS prevention methods!", "1. Escape HTML output (< → &lt;)\n2. Use textContent instead of innerHTML\n3. Content-Security-Policy header\n4. HttpOnly cookies (no JS access)\n5. Input validation and sanitization", "Never trust user input. Always escape output. CSP headers prevent inline script execution.", "hard"),
    q("CSRF", "What is CSRF?", [{ label: "A", text: "Tricking a user's browser into making unwanted requests to a site they're logged into" }, { label: "B", text: "A CSS property" }, { label: "C", text: "A caching method" }], "A", "CSRF exploits browser cookies. Prevent with CSRF tokens, SameSite cookies, and origin checks."),
  ],
};
