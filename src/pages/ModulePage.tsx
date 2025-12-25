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
    { id: "systems-thinking", title: "Systems Thinking", description: "Holistic view and emergence", icon: "🔄", xpReward: 75 },
    { id: "stakeholders", title: "Finding Stakeholders", description: "Identify all affected parties", icon: "👥", xpReward: 75 },
    { id: "requirements-gathering", title: "Gathering Requirements", description: "Functional and non-functional", icon: "📋", xpReward: 100 },
    { id: "use-cases", title: "Use Cases", description: "Actors and interactions", icon: "🎭", xpReward: 100 },
    { id: "user-stories", title: "User Stories", description: "As a... I want... So that...", icon: "📝", xpReward: 100 },
    { id: "dfd-process", title: "Process Modelling", description: "DFDs and BPMN", icon: "📊", xpReward: 125 },
    { id: "data-modelling", title: "Data Modelling", description: "ERDs and normalization", icon: "🔗", xpReward: 125 },
    { id: "class-diagrams", title: "Class Diagrams (UML)", description: "Classes, attributes, methods", icon: "🏛️", xpReward: 150 },
    { id: "sdlc-overview", title: "SDLC Overview", description: "Software development lifecycle", icon: "🔄", xpReward: 100 },
    { id: "waterfall-model", title: "Waterfall Model", description: "Sequential phases", icon: "🌊", xpReward: 100 },
    { id: "agile-methods", title: "Agile & Scrum", description: "Sprints, standups, retrospectives", icon: "🏃", xpReward: 125 },
    { id: "security-basics", title: "Security Fundamentals", description: "CIA triad and authentication", icon: "🔐", xpReward: 100 },
    { id: "risk-management", title: "Risk Management", description: "Identify and mitigate risks", icon: "⚠️", xpReward: 100 },
    { id: "compliance", title: "Compliance & GDPR", description: "Data protection regulations", icon: "📜", xpReward: 100 },
    { id: "testing-strategies", title: "Testing Strategies", description: "Unit, integration, UAT", icon: "🧪", xpReward: 125 },
  ],

  // ==================== MATHS FOR COMPUTING ====================
  "math-computing": [
    { id: "number-systems", title: "Number Systems", description: "Decimal, binary, octal, hex", icon: "🔢", xpReward: 75 },
    { id: "binary-arithmetic", title: "Binary Arithmetic", description: "Add, subtract in binary", icon: "➕", xpReward: 100 },
    { id: "hex-conversions", title: "Hex Conversions", description: "Hexadecimal conversions", icon: "🔷", xpReward: 100 },
    { id: "logic-gates", title: "Logic Gates", description: "AND, OR, NOT, XOR", icon: "🚦", xpReward: 100 },
    { id: "truth-tables", title: "Truth Tables", description: "Boolean expressions", icon: "📋", xpReward: 100 },
    { id: "boolean-algebra", title: "Boolean Algebra", description: "Simplification rules", icon: "🔣", xpReward: 125 },
    { id: "sets-basics", title: "Sets & Operations", description: "Union, intersection, complement", icon: "⭕", xpReward: 100 },
    { id: "venn-diagrams", title: "Venn Diagrams", description: "Visualizing sets", icon: "🔗", xpReward: 75 },
    { id: "probability-basics", title: "Probability Basics", description: "Events and outcomes", icon: "🎲", xpReward: 100 },
    { id: "conditional-probability", title: "Conditional Probability", description: "P(A|B) and Bayes", icon: "🔮", xpReward: 125 },
    { id: "graphs-intro", title: "Graph Theory", description: "Vertices and edges", icon: "🌳", xpReward: 125 },
    { id: "trees-basics", title: "Tree Structures", description: "Binary trees", icon: "🌲", xpReward: 150 },
  ],

  // ==================== CYBERSECURITY ====================
  "cybersecurity": [
    { id: "cia-triad", title: "CIA Triad", description: "Confidentiality, Integrity, Availability", icon: "🔐", xpReward: 75 },
    { id: "threats-vulnerabilities", title: "Threats & Vulnerabilities", description: "Identify security weaknesses", icon: "⚠️", xpReward: 100 },
    { id: "malware-types", title: "Malware Types", description: "Viruses, worms, trojans, ransomware", icon: "🦠", xpReward: 100 },
    { id: "social-engineering", title: "Social Engineering", description: "Phishing, pretexting, baiting", icon: "🎭", xpReward: 100 },
    { id: "authentication", title: "Authentication Methods", description: "Passwords, MFA, biometrics", icon: "🔑", xpReward: 125 },
    { id: "encryption-basics", title: "Encryption Basics", description: "Symmetric vs asymmetric", icon: "🔒", xpReward: 150 },
    { id: "hashing", title: "Hashing & Integrity", description: "MD5, SHA, digital signatures", icon: "🔏", xpReward: 150 },
    { id: "network-security", title: "Network Security", description: "Firewalls, IDS, IPS", icon: "🛡️", xpReward: 150 },
    { id: "owasp-top10", title: "OWASP Top 10", description: "Common web vulnerabilities", icon: "🔟", xpReward: 175 },
    { id: "sql-injection", title: "SQL Injection", description: "Attack and prevention", icon: "💉", xpReward: 150 },
    { id: "xss-attacks", title: "XSS Attacks", description: "Cross-site scripting", icon: "📜", xpReward: 150 },
    { id: "incident-response", title: "Incident Response", description: "Detect, contain, recover", icon: "🚨", xpReward: 175 },
    { id: "gdpr-compliance", title: "GDPR Compliance", description: "Data protection principles", icon: "📜", xpReward: 150 },
  ],

  // ==================== AI & DATA SCIENCE ====================
  "ai-data-science": [
    { id: "ai-intro", title: "What is AI?", description: "Artificial intelligence overview", icon: "🤖", xpReward: 75 },
    { id: "ml-types", title: "Types of Machine Learning", description: "Supervised, unsupervised, reinforcement", icon: "📊", xpReward: 100 },
    { id: "data-collection", title: "Data Collection", description: "Sources, quality, quantity", icon: "📥", xpReward: 100 },
    { id: "data-cleaning", title: "Data Cleaning", description: "Missing values, outliers, normalization", icon: "🧹", xpReward: 125 },
    { id: "train-test-split", title: "Train/Test Split", description: "Validation strategies", icon: "✂️", xpReward: 100 },
    { id: "linear-regression", title: "Linear Regression", description: "Predicting continuous values", icon: "📈", xpReward: 150 },
    { id: "classification", title: "Classification", description: "Predicting categories", icon: "🏷️", xpReward: 150 },
    { id: "decision-trees", title: "Decision Trees", description: "Tree-based learning", icon: "🌳", xpReward: 150 },
    { id: "neural-networks", title: "Neural Networks Intro", description: "Layers, neurons, activation", icon: "🧠", xpReward: 200 },
    { id: "model-evaluation", title: "Model Evaluation", description: "Accuracy, precision, recall, F1", icon: "📊", xpReward: 150 },
    { id: "ethics-in-ai", title: "Ethics in AI", description: "Bias, fairness, transparency", icon: "⚖️", xpReward: 125 },
  ],

  // ==================== BUSINESS INFORMATION SYSTEMS ====================
  "business-systems": [
    { id: "bis-intro", title: "Business Information Systems", description: "Technology in business", icon: "💼", xpReward: 75 },
    { id: "info-system-types", title: "Types of IS", description: "TPS, MIS, DSS, EIS", icon: "📊", xpReward: 100 },
    { id: "erp-systems", title: "ERP Systems", description: "Enterprise resource planning", icon: "🏢", xpReward: 125 },
    { id: "crm-basics", title: "CRM Basics", description: "Customer relationship management", icon: "👥", xpReward: 125 },
    { id: "e-commerce", title: "E-Commerce Models", description: "B2B, B2C, C2C", icon: "🛒", xpReward: 100 },
    { id: "cloud-computing", title: "Cloud Computing", description: "IaaS, PaaS, SaaS", icon: "☁️", xpReward: 125 },
    { id: "digital-marketing", title: "Digital Marketing", description: "SEO, social media, analytics", icon: "📱", xpReward: 125 },
    { id: "project-management", title: "IT Project Management", description: "PRINCE2, Agile, PMI", icon: "📅", xpReward: 150 },
  ],

  // ==================== GAME DEVELOPMENT ====================
  "game-development": [
    { id: "game-design-basics", title: "Game Design Basics", description: "Game loop, FPS, core concepts", icon: "🎮", xpReward: 75 },
    { id: "sprites-animation", title: "Sprites & Animation", description: "2D graphics and sprite sheets", icon: "🖼️", xpReward: 100 },
    { id: "collision-detection", title: "Collision Detection", description: "AABB, circle collision", icon: "💥", xpReward: 125 },
    { id: "input-handling", title: "Input Handling", description: "Event-driven and polling", icon: "🎮", xpReward: 100 },
    { id: "game-physics", title: "Basic Game Physics", description: "Velocity, gravity, movement", icon: "🎱", xpReward: 150 },
    { id: "audio-in-games", title: "Audio in Games", description: "SFX and music formats", icon: "🔊", xpReward: 100 },
    { id: "level-design", title: "Level Design Basics", description: "Flow and difficulty curves", icon: "🗺️", xpReward: 125 },
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
