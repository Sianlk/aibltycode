import { forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useProgress } from "@/hooks/useProgress";
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Star } from "lucide-react";

// Comprehensive lessons covering all book topics
const moduleLessons: Record<string, { id: string; title: string; description: string; icon: string; xpReward: number }[]> = {
  // ==================== JAVA / PROGRAMMING ====================
  "java-foundations": [
    { id: "hello-world", title: "Hello World!", description: "Your first Java program", icon: "🚀", xpReward: 50 },
    { id: "variables", title: "Variables & Types", description: "int, String, boolean, double", icon: "📦", xpReward: 75 },
    { id: "data-types", title: "Primitive Types", description: "byte, short, int, long, float, double", icon: "🎨", xpReward: 100 },
    { id: "operators", title: "Operators", description: "Arithmetic, comparison, logical", icon: "➕", xpReward: 100 },
    { id: "strings", title: "String Methods", description: "length, substring, equals, concat", icon: "📝", xpReward: 100 },
    { id: "if-statements", title: "If Statements", description: "Conditional execution", icon: "🔀", xpReward: 100 },
    { id: "else-elseif", title: "Else & Else If", description: "Multiple conditions", icon: "🌟", xpReward: 100 },
    { id: "switch-statements", title: "Switch Statements", description: "Multi-way branching", icon: "🎛️", xpReward: 100 },
    { id: "for-loops", title: "For Loops", description: "Counter-controlled iteration", icon: "🔄", xpReward: 125 },
    { id: "while-loops", title: "While & Do-While", description: "Condition-controlled loops", icon: "🎯", xpReward: 125 },
    { id: "methods", title: "Methods", description: "Reusable code blocks", icon: "🔧", xpReward: 150 },
    { id: "parameters-return", title: "Parameters & Return", description: "Input and output", icon: "📥", xpReward: 150 },
    { id: "arrays", title: "Arrays", description: "Fixed-size collections", icon: "📊", xpReward: 150 },
    { id: "arraylist", title: "ArrayList", description: "Dynamic collections", icon: "📝", xpReward: 150 },
    { id: "classes", title: "Classes & Objects", description: "OOP fundamentals", icon: "🏗️", xpReward: 200 },
    { id: "constructors", title: "Constructors", description: "Object initialization", icon: "🔨", xpReward: 175 },
    { id: "encapsulation", title: "Encapsulation", description: "Getters, setters, private", icon: "🔒", xpReward: 175 },
    { id: "inheritance", title: "Inheritance", description: "Extending classes", icon: "👨‍👧", xpReward: 200 },
    { id: "polymorphism", title: "Polymorphism", description: "Method overriding", icon: "🎭", xpReward: 200 },
    { id: "interfaces", title: "Interfaces", description: "Define contracts", icon: "📋", xpReward: 200 },
    { id: "abstract-classes", title: "Abstract Classes", description: "Partial implementation", icon: "🎨", xpReward: 200 },
    { id: "exceptions", title: "Exception Handling", description: "try-catch-finally", icon: "⚠️", xpReward: 175 },
    { id: "file-io", title: "File I/O", description: "Reading and writing files", icon: "📁", xpReward: 200 },
    { id: "collections", title: "Collections Framework", description: "List, Set, Map", icon: "📚", xpReward: 225 },
    { id: "generics", title: "Generics", description: "Type-safe collections", icon: "🧬", xpReward: 225 },
    { id: "javafx-intro", title: "JavaFX Basics", description: "GUI programming", icon: "🖼️", xpReward: 250 },
  ],

  // ==================== SYSTEMS ANALYSIS ====================
  "systems-analysis": [
    { id: "what-is-system", title: "What is a System?", description: "Boundaries, components, environment", icon: "🌐", xpReward: 50 },
    { id: "system-types", title: "System Types", description: "Open, closed, feedback systems", icon: "🔄", xpReward: 75 },
    { id: "stakeholders", title: "Stakeholder Analysis", description: "Identify all affected parties", icon: "👥", xpReward: 75 },
    { id: "requirements-gathering", title: "Requirements Gathering", description: "Interviews, surveys, observation", icon: "📋", xpReward: 100 },
    { id: "functional-requirements", title: "Functional Requirements", description: "What the system must do", icon: "⚡", xpReward: 100 },
    { id: "non-functional", title: "Non-Functional Requirements", description: "Performance, security, usability", icon: "🎯", xpReward: 100 },
    { id: "use-cases", title: "Use Case Diagrams", description: "Actors and interactions", icon: "🎭", xpReward: 125 },
    { id: "use-case-descriptions", title: "Use Case Descriptions", description: "Preconditions, flow, extensions", icon: "📝", xpReward: 125 },
    { id: "process-flow", title: "Process Flowcharts", description: "Visualizing workflows", icon: "📊", xpReward: 125 },
    { id: "data-flow-diagrams", title: "Data Flow Diagrams", description: "DFD levels 0, 1, 2", icon: "🔗", xpReward: 150 },
    { id: "erd-basics", title: "Entity Relationship Diagrams", description: "Entities, attributes, relationships", icon: "🔗", xpReward: 150 },
    { id: "erd-advanced", title: "ERD Cardinality", description: "One-to-many, many-to-many", icon: "🔢", xpReward: 175 },
    { id: "class-diagrams", title: "UML Class Diagrams", description: "Classes, attributes, methods", icon: "🏛️", xpReward: 175 },
    { id: "sequence-diagrams", title: "Sequence Diagrams", description: "Object interactions over time", icon: "⏱️", xpReward: 175 },
    { id: "state-diagrams", title: "State Machine Diagrams", description: "Object lifecycle states", icon: "🔄", xpReward: 175 },
    { id: "sdlc-overview", title: "SDLC Overview", description: "Software development lifecycle", icon: "🔄", xpReward: 100 },
    { id: "waterfall-model", title: "Waterfall Model", description: "Sequential phases", icon: "🌊", xpReward: 100 },
    { id: "agile-scrum", title: "Agile & Scrum", description: "Sprints, standups, retrospectives", icon: "🏃", xpReward: 125 },
    { id: "kanban", title: "Kanban Method", description: "Visual workflow management", icon: "📌", xpReward: 100 },
    { id: "project-planning", title: "Project Planning", description: "Gantt charts, milestones", icon: "📅", xpReward: 125 },
    { id: "risk-management", title: "Risk Management", description: "Identify, assess, mitigate", icon: "🛡️", xpReward: 125 },
    { id: "testing-strategies", title: "Testing Strategies", description: "Unit, integration, UAT", icon: "🧪", xpReward: 125 },
    { id: "system-integration", title: "System Integration", description: "Connecting components", icon: "🔌", xpReward: 150 },
    { id: "database-design", title: "Database Design", description: "Normalization, keys, indexes", icon: "🗃️", xpReward: 175 },
    { id: "prototyping", title: "Prototyping", description: "Mockups and wireframes", icon: "🎨", xpReward: 125 },
    { id: "documentation", title: "Technical Documentation", description: "SRS, design docs, manuals", icon: "📖", xpReward: 100 },
  ],

  // ==================== MATHS FOR COMPUTING ====================
  "math-computing": [
    { id: "number-systems", title: "Number Systems", description: "Decimal, binary, octal, hex", icon: "🔢", xpReward: 75 },
    { id: "binary-decimal", title: "Binary to Decimal", description: "Conversion techniques", icon: "➡️", xpReward: 100 },
    { id: "decimal-binary", title: "Decimal to Binary", description: "Division method", icon: "⬅️", xpReward: 100 },
    { id: "hex-conversions", title: "Hexadecimal", description: "Hex to binary to decimal", icon: "🔷", xpReward: 100 },
    { id: "binary-arithmetic", title: "Binary Arithmetic", description: "Add, subtract in binary", icon: "➕", xpReward: 125 },
    { id: "twos-complement", title: "Two's Complement", description: "Negative binary numbers", icon: "➖", xpReward: 150 },
    { id: "logic-gates", title: "Logic Gates", description: "AND, OR, NOT, XOR, NAND, NOR", icon: "🚦", xpReward: 100 },
    { id: "truth-tables", title: "Truth Tables", description: "Boolean expressions", icon: "📋", xpReward: 100 },
    { id: "boolean-algebra", title: "Boolean Algebra", description: "Simplification rules", icon: "🔣", xpReward: 125 },
    { id: "de-morgans-laws", title: "De Morgan's Laws", description: "NOT(A AND B) = NOT A OR NOT B", icon: "📐", xpReward: 125 },
    { id: "karnaugh-maps", title: "Karnaugh Maps", description: "Boolean simplification", icon: "🗺️", xpReward: 150 },
    { id: "sets-basics", title: "Set Theory Basics", description: "Union, intersection, complement", icon: "⭕", xpReward: 100 },
    { id: "set-operations", title: "Set Operations", description: "Venn diagrams, laws", icon: "🔗", xpReward: 125 },
    { id: "functions-relations", title: "Functions & Relations", description: "Domain, range, mappings", icon: "📈", xpReward: 125 },
    { id: "probability-basics", title: "Probability Basics", description: "Events, outcomes, probability", icon: "🎲", xpReward: 100 },
    { id: "conditional-prob", title: "Conditional Probability", description: "P(A|B) Bayes theorem", icon: "🔮", xpReward: 150 },
    { id: "permutations", title: "Permutations", description: "Ordered arrangements", icon: "🔀", xpReward: 125 },
    { id: "combinations", title: "Combinations", description: "Unordered selections", icon: "🎯", xpReward: 125 },
    { id: "sequences-series", title: "Sequences & Series", description: "Arithmetic, geometric", icon: "📊", xpReward: 125 },
    { id: "graphs-basics", title: "Graph Theory Basics", description: "Nodes, edges, paths", icon: "🌳", xpReward: 125 },
    { id: "graph-traversal", title: "Graph Traversal", description: "BFS, DFS algorithms", icon: "🔍", xpReward: 150 },
    { id: "tree-structures", title: "Tree Structures", description: "Binary trees, BST", icon: "🌲", xpReward: 150 },
    { id: "complexity-intro", title: "Big-O Introduction", description: "Time complexity basics", icon: "⏱️", xpReward: 125 },
    { id: "complexity-analysis", title: "Complexity Analysis", description: "O(1), O(n), O(log n), O(n²)", icon: "📊", xpReward: 150 },
    { id: "recursion-math", title: "Recursion in Maths", description: "Recursive definitions", icon: "🔄", xpReward: 150 },
    { id: "matrices-basics", title: "Matrices Basics", description: "Addition, multiplication", icon: "🔲", xpReward: 150 },
  ],

  // ==================== CYBERSECURITY ====================
  "cybersecurity": [
    { id: "cia-triad", title: "CIA Triad", description: "Confidentiality, Integrity, Availability", icon: "🔐", xpReward: 75 },
    { id: "threats-vulnerabilities", title: "Threats & Vulnerabilities", description: "Identify security weaknesses", icon: "⚠️", xpReward: 100 },
    { id: "malware-types", title: "Malware Types", description: "Viruses, worms, trojans, ransomware", icon: "🦠", xpReward: 100 },
    { id: "social-engineering", title: "Social Engineering", description: "Phishing, pretexting, baiting", icon: "🎭", xpReward: 100 },
    { id: "authentication", title: "Authentication Methods", description: "Passwords, MFA, biometrics", icon: "🔑", xpReward: 125 },
    { id: "authorization", title: "Authorization & Access", description: "RBAC, ACLs, least privilege", icon: "🎫", xpReward: 125 },
    { id: "encryption-basics", title: "Encryption Basics", description: "Symmetric vs asymmetric", icon: "🔒", xpReward: 150 },
    { id: "hashing", title: "Hashing & Integrity", description: "MD5, SHA, digital signatures", icon: "🔏", xpReward: 150 },
    { id: "network-security", title: "Network Security", description: "Firewalls, IDS, IPS", icon: "🛡️", xpReward: 150 },
    { id: "web-security", title: "Web Security", description: "HTTPS, SSL/TLS, certificates", icon: "🌐", xpReward: 150 },
    { id: "owasp-top10", title: "OWASP Top 10", description: "Common web vulnerabilities", icon: "🔟", xpReward: 175 },
    { id: "sql-injection", title: "SQL Injection", description: "Attack and prevention", icon: "💉", xpReward: 150 },
    { id: "xss-attacks", title: "XSS Attacks", description: "Cross-site scripting", icon: "📜", xpReward: 150 },
    { id: "incident-response", title: "Incident Response", description: "Detect, contain, recover", icon: "🚨", xpReward: 175 },
    { id: "forensics-basics", title: "Digital Forensics", description: "Evidence collection, chain of custody", icon: "🔍", xpReward: 175 },
    { id: "cybercrime-law", title: "Cybercrime & Law", description: "Legal frameworks, CMA", icon: "⚖️", xpReward: 125 },
    { id: "gdpr-compliance", title: "GDPR Compliance", description: "Data protection principles", icon: "📜", xpReward: 150 },
    { id: "risk-assessment", title: "Risk Assessment", description: "Identify, analyze, prioritize", icon: "📊", xpReward: 150 },
    { id: "security-policies", title: "Security Policies", description: "AUP, incident response plans", icon: "📋", xpReward: 125 },
    { id: "penetration-testing", title: "Penetration Testing", description: "Ethical hacking basics", icon: "🎯", xpReward: 200 },
    { id: "security-tools", title: "Security Tools", description: "Nmap, Wireshark, Metasploit", icon: "🛠️", xpReward: 175 },
    { id: "comptia-concepts", title: "CompTIA Security+ Concepts", description: "Core security principles", icon: "📚", xpReward: 200 },
  ],

  // ==================== AI & DATA SCIENCE ====================
  "ai-data-science": [
    { id: "ai-intro", title: "What is AI?", description: "Artificial intelligence overview", icon: "🤖", xpReward: 75 },
    { id: "ml-types", title: "Types of Machine Learning", description: "Supervised, unsupervised, reinforcement", icon: "📊", xpReward: 100 },
    { id: "ml-workflow", title: "ML Workflow", description: "Data → Train → Evaluate → Deploy", icon: "🔄", xpReward: 125 },
    { id: "data-collection", title: "Data Collection", description: "Sources, quality, quantity", icon: "📥", xpReward: 100 },
    { id: "data-cleaning", title: "Data Cleaning", description: "Missing values, outliers, normalization", icon: "🧹", xpReward: 125 },
    { id: "feature-engineering", title: "Feature Engineering", description: "Creating useful features", icon: "⚙️", xpReward: 150 },
    { id: "train-test-split", title: "Train/Test Split", description: "Validation strategies", icon: "✂️", xpReward: 100 },
    { id: "linear-regression", title: "Linear Regression", description: "Predicting continuous values", icon: "📈", xpReward: 150 },
    { id: "classification", title: "Classification", description: "Predicting categories", icon: "🏷️", xpReward: 150 },
    { id: "decision-trees", title: "Decision Trees", description: "Tree-based learning", icon: "🌳", xpReward: 150 },
    { id: "neural-networks", title: "Neural Networks Intro", description: "Layers, neurons, activation", icon: "🧠", xpReward: 200 },
    { id: "model-evaluation", title: "Model Evaluation", description: "Accuracy, precision, recall, F1", icon: "📊", xpReward: 150 },
    { id: "overfitting", title: "Overfitting & Underfitting", description: "Bias-variance tradeoff", icon: "⚖️", xpReward: 150 },
    { id: "data-visualization", title: "Data Visualization", description: "Charts, graphs, dashboards", icon: "📊", xpReward: 125 },
    { id: "tableau-basics", title: "Tableau Basics", description: "Interactive visualizations", icon: "📈", xpReward: 150 },
    { id: "storytelling-data", title: "Data Storytelling", description: "Communicate insights", icon: "📖", xpReward: 125 },
    { id: "expert-systems", title: "Expert Systems", description: "Rule-based AI", icon: "🎓", xpReward: 150 },
    { id: "fuzzy-logic", title: "Fuzzy Logic", description: "Degrees of truth", icon: "🌫️", xpReward: 175 },
    { id: "genetic-algorithms", title: "Genetic Algorithms", description: "Evolutionary optimization", icon: "🧬", xpReward: 200 },
    { id: "nlp-basics", title: "NLP Basics", description: "Text processing, sentiment", icon: "💬", xpReward: 175 },
    { id: "ethics-in-ai", title: "Ethics in AI", description: "Bias, fairness, transparency", icon: "⚖️", xpReward: 125 },
  ],

  // ==================== BUSINESS INFORMATION SYSTEMS ====================
  "business-systems": [
    { id: "bis-intro", title: "Business Information Systems", description: "Technology in business", icon: "💼", xpReward: 75 },
    { id: "info-system-types", title: "Types of IS", description: "TPS, MIS, DSS, EIS", icon: "📊", xpReward: 100 },
    { id: "erp-systems", title: "ERP Systems", description: "Enterprise resource planning", icon: "🏢", xpReward: 125 },
    { id: "crm-basics", title: "CRM Basics", description: "Customer relationship management", icon: "👥", xpReward: 125 },
    { id: "e-commerce", title: "E-Commerce Models", description: "B2B, B2C, C2C", icon: "🛒", xpReward: 100 },
    { id: "supply-chain", title: "Supply Chain Management", description: "SCM systems", icon: "🔗", xpReward: 125 },
    { id: "business-processes", title: "Business Processes", description: "Modeling and optimization", icon: "⚙️", xpReward: 100 },
    { id: "process-improvement", title: "Process Improvement", description: "BPR, Six Sigma, Lean", icon: "📈", xpReward: 125 },
    { id: "it-governance", title: "IT Governance", description: "COBIT, ITIL frameworks", icon: "🏛️", xpReward: 150 },
    { id: "strategic-planning", title: "IT Strategic Planning", description: "Align IT with business", icon: "🎯", xpReward: 150 },
    { id: "it-infrastructure", title: "IT Infrastructure", description: "Hardware, software, networks", icon: "🖥️", xpReward: 100 },
    { id: "cloud-computing", title: "Cloud Computing", description: "IaaS, PaaS, SaaS", icon: "☁️", xpReward: 125 },
    { id: "data-management", title: "Data Management", description: "Data warehousing, BI", icon: "📊", xpReward: 150 },
    { id: "brand-management", title: "Brand Management", description: "Digital brand strategy", icon: "🏷️", xpReward: 125 },
    { id: "digital-marketing", title: "Digital Marketing", description: "SEO, social media, analytics", icon: "📱", xpReward: 125 },
    { id: "project-management", title: "IT Project Management", description: "PRINCE2, Agile, PMI", icon: "📅", xpReward: 150 },
    { id: "change-management", title: "Change Management", description: "Implementing new systems", icon: "🔄", xpReward: 125 },
    { id: "roi-analysis", title: "ROI Analysis", description: "Measuring IT value", icon: "💰", xpReward: 150 },
    { id: "case-studies", title: "Business IS Case Studies", description: "Real-world applications", icon: "📖", xpReward: 100 },
  ],

  // ==================== GAME DEVELOPMENT ====================
  "game-development": [
    { id: "game-design-intro", title: "Game Design Basics", description: "Core concepts and principles", icon: "🎮", xpReward: 75 },
    { id: "level-design", title: "Level Design", description: "Creating engaging levels", icon: "🗺️", xpReward: 100 },
    { id: "3d-environments", title: "3D Game Environments", description: "Modeling, texturing, lighting", icon: "🏞️", xpReward: 150 },
    { id: "game-mechanics", title: "Game Mechanics", description: "Rules and interactions", icon: "⚙️", xpReward: 125 },
    { id: "player-experience", title: "Player Experience", description: "Flow, challenge, reward", icon: "🎯", xpReward: 125 },
    { id: "narrative-design", title: "Narrative Design", description: "Storytelling in games", icon: "📖", xpReward: 125 },
    { id: "game-physics", title: "Game Physics", description: "Collision, gravity, movement", icon: "🎱", xpReward: 150 },
    { id: "game-ai", title: "Game AI", description: "NPC behavior, pathfinding", icon: "🤖", xpReward: 175 },
    { id: "ui-ux-games", title: "Game UI/UX", description: "Menus, HUD, feedback", icon: "🖼️", xpReward: 125 },
    { id: "game-testing", title: "Game Testing", description: "QA, playtesting, balancing", icon: "🧪", xpReward: 100 },
  ],
};

const moduleInfo: Record<string, { title: string; icon: string }> = {
  "java-foundations": { title: "Java Programming", icon: "☕" },
  "systems-analysis": { title: "Systems Analysis & Design", icon: "🌌" },
  "math-computing": { title: "Mathematics for Computing", icon: "🔢" },
  "cybersecurity": { title: "Cybersecurity", icon: "🔐" },
  "ai-data-science": { title: "AI & Data Science", icon: "🤖" },
  "business-systems": { title: "Business Information Systems", icon: "💼" },
  "game-development": { title: "Game Development", icon: "🎮" },
};

const ModulePage = forwardRef<HTMLDivElement>((_, ref) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { playSound } = useGame();
  const { isLessonCompleted, loading } = useProgress();

  const info = moduleId ? moduleInfo[moduleId] : null;
  const lessons = moduleId ? moduleLessons[moduleId] || [] : [];

  if (!info) {
    return (
      <div ref={ref} className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Module not found</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;

  const handleStartLesson = (lessonId: string) => {
    playSound("click");
    navigate(`/lesson/${moduleId}/${lessonId}`);
  };

  const handleBack = () => {
    playSound("click");
    navigate("/dashboard");
  };

  return (
    <div ref={ref} className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Back Button */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Module Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">{info.icon}</div>
          <h1 className="text-3xl font-black text-foreground mb-2">{info.title}</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${completedCount}/${lessons.length} Complete`}
          </p>
        </motion.div>

        {/* Lessons List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const prevCompleted = index === 0 || isLessonCompleted(lessons[index - 1].id);
            const isLocked = index > 0 && !prevCompleted;

            return (
              <motion.div
                key={lesson.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isLocked ? "opacity-50" : ""
                  } ${completed ? "border-success/50 bg-success/5" : ""}`}
                  onClick={() => !isLocked && handleStartLesson(lesson.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      completed ? "bg-success/20" : isLocked ? "bg-muted" : "bg-primary/10"
                    }`}>
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        lesson.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      <Star className="w-3 h-3" />
                      {lesson.xpReward} XP
                    </div>

                    {/* Play Button */}
                    {!isLocked && !completed && (
                      <PlayCircle className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
});

ModulePage.displayName = "ModulePage";

export default ModulePage;
