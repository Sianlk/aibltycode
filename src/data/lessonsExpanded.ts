// Expanded Lessons for Systems Analysis, Enhanced Maths, and Intensive Code Drilling

import { LessonData } from "./lessons";

// ==========================================
// EXPANDED SYSTEMS ANALYSIS MODULE
// ==========================================

export const systemsAnalysisLessons: Record<string, LessonData> = {
  // === FOUNDATIONS ===
  "sdlc-intro": {
    id: "sdlc-intro", moduleId: "systems-analysis", title: "SDLC Overview", xpReward: 75, category: "Foundations",
    steps: [
      { type: "quiz", title: "SDLC Meaning", difficulty: "easy", question: "SDLC stands for?", options: [{ label: "A", text: "Software Development Life Cycle" }, { label: "B", text: "System Data Logic Control" }, { label: "C", text: "Simple Design Language Code" }], correctAnswer: "A", explanation: "SDLC is the structured process for planning, creating, testing, and deploying systems!" },
      { type: "quiz", title: "SDLC Purpose", difficulty: "medium", question: "SDLC provides?", options: [{ label: "A", text: "Random development approach" }, { label: "B", text: "Structured framework for quality software" }, { label: "C", text: "Only documentation" }], correctAnswer: "B", explanation: "SDLC ensures consistent, high-quality software through defined phases!" },
      { type: "quiz", title: "First Phase", difficulty: "medium", question: "SDLC typically starts with?", options: [{ label: "A", text: "Coding" }, { label: "B", text: "Requirements gathering" }, { label: "C", text: "Testing" }], correctAnswer: "B", explanation: "Planning/requirements phase defines WHAT to build before HOW!" },
    ],
  },
  "sdlc-phases": {
    id: "sdlc-phases", moduleId: "systems-analysis", title: "SDLC Phases", xpReward: 100, category: "Foundations",
    steps: [
      { type: "quiz", title: "Phase Order", difficulty: "medium", question: "Correct phase order?", options: [{ label: "A", text: "Plan, Analyze, Design, Develop, Test, Deploy" }, { label: "B", text: "Code, Test, Plan, Design" }, { label: "C", text: "Deploy, Design, Develop" }], correctAnswer: "A", explanation: "PADTDM: Plan, Analyze, Design, Develop, Test, Deploy, Maintain!" },
      { type: "quiz", title: "Analysis Phase", difficulty: "medium", question: "Analysis phase focuses on?", options: [{ label: "A", text: "Writing code" }, { label: "B", text: "Understanding requirements in detail" }, { label: "C", text: "User training" }], correctAnswer: "B", explanation: "Analysis digs deep into requirements - WHAT the system must do!" },
      { type: "quiz", title: "Design Phase", difficulty: "hard", question: "Design phase produces?", options: [{ label: "A", text: "Working software" }, { label: "B", text: "System architecture and specifications" }, { label: "C", text: "Test results" }], correctAnswer: "B", explanation: "Design defines HOW to build it - architecture, databases, interfaces!" },
    ],
  },
  "waterfall-model": {
    id: "waterfall-model", moduleId: "systems-analysis", title: "Waterfall Model", xpReward: 100, category: "Methodologies",
    steps: [
      { type: "quiz", title: "Waterfall Nature", difficulty: "medium", question: "Waterfall is?", options: [{ label: "A", text: "Iterative" }, { label: "B", text: "Sequential - phases flow down" }, { label: "C", text: "Random" }], correctAnswer: "B", explanation: "Waterfall flows downward - each phase completes before next begins!" },
      { type: "quiz", title: "Waterfall Advantage", difficulty: "medium", question: "Waterfall is good for?", options: [{ label: "A", text: "Rapidly changing requirements" }, { label: "B", text: "Well-defined, stable requirements" }, { label: "C", text: "Small teams only" }], correctAnswer: "B", explanation: "Works best when requirements are clear and unlikely to change!" },
      { type: "quiz", title: "Waterfall Drawback", difficulty: "hard", question: "Main waterfall criticism?", options: [{ label: "A", text: "Too fast" }, { label: "B", text: "Hard to go back and make changes" }, { label: "C", text: "Too cheap" }], correctAnswer: "B", explanation: "Changes late in waterfall are expensive - limited flexibility!" },
    ],
  },
  "agile-intro": {
    id: "agile-intro", moduleId: "systems-analysis", title: "Agile Methodology", xpReward: 125, category: "Methodologies",
    steps: [
      { type: "quiz", title: "Agile Principle", difficulty: "medium", question: "Agile values?", options: [{ label: "A", text: "Rigid plans over change" }, { label: "B", text: "Individuals and interactions over processes" }, { label: "C", text: "Documentation over working software" }], correctAnswer: "B", explanation: "Agile Manifesto: individuals, working software, collaboration, responding to change!" },
      { type: "quiz", title: "Iterations", difficulty: "medium", question: "Agile uses?", options: [{ label: "A", text: "One long development phase" }, { label: "B", text: "Short iterations/sprints" }, { label: "C", text: "No planning" }], correctAnswer: "B", explanation: "Agile delivers working software in short cycles (1-4 weeks)!" },
      { type: "quiz", title: "Customer Involvement", difficulty: "medium", question: "In Agile, customers?", options: [{ label: "A", text: "Only see final product" }, { label: "B", text: "Provide continuous feedback" }, { label: "C", text: "Write the code" }], correctAnswer: "B", explanation: "Continuous customer collaboration ensures building the right thing!" },
    ],
  },
  "scrum-framework": {
    id: "scrum-framework", moduleId: "systems-analysis", title: "Scrum Framework", xpReward: 150, category: "Methodologies",
    steps: [
      { type: "quiz", title: "Sprint", difficulty: "medium", question: "A sprint is?", options: [{ label: "A", text: "A year-long project" }, { label: "B", text: "Fixed time box (1-4 weeks)" }, { label: "C", text: "Testing phase" }], correctAnswer: "B", explanation: "Sprints are time-boxed iterations with defined goals!" },
      { type: "quiz", title: "Scrum Roles", difficulty: "hard", question: "Scrum Master does?", options: [{ label: "A", text: "Writes all code" }, { label: "B", text: "Removes impediments, facilitates" }, { label: "C", text: "Creates requirements" }], correctAnswer: "B", explanation: "Scrum Master serves the team, removes blockers, coaches on Scrum!" },
      { type: "quiz", title: "Product Owner", difficulty: "hard", question: "Product Owner manages?", options: [{ label: "A", text: "Team schedules" }, { label: "B", text: "Product backlog priorities" }, { label: "C", text: "Server infrastructure" }], correctAnswer: "B", explanation: "PO represents stakeholders, prioritizes backlog, defines acceptance!" },
      { type: "quiz", title: "Daily Standup", difficulty: "medium", question: "Daily standup is?", options: [{ label: "A", text: "Hour-long planning" }, { label: "B", text: "15-minute sync meeting" }, { label: "C", text: "Code review" }], correctAnswer: "B", explanation: "Short daily sync: yesterday, today, blockers. Keep it brief!" },
    ],
  },

  // === REQUIREMENTS ===
  "stakeholder-analysis": {
    id: "stakeholder-analysis", moduleId: "systems-analysis", title: "Stakeholder Analysis", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Stakeholder Definition", difficulty: "easy", question: "A stakeholder is?", options: [{ label: "A", text: "Only the client" }, { label: "B", text: "Anyone affected by the system" }, { label: "C", text: "Only developers" }], correctAnswer: "B", explanation: "Stakeholders: users, management, customers, developers, regulators - all affected parties!" },
      { type: "quiz", title: "Primary vs Secondary", difficulty: "medium", question: "Primary stakeholders?", options: [{ label: "A", text: "Most important first priority" }, { label: "B", text: "Directly use the system" }, { label: "C", text: "Pay the bills" }], correctAnswer: "B", explanation: "Primary = direct users. Secondary = indirectly affected (managers, regulators)!" },
      { type: "quiz", title: "Stakeholder Map", difficulty: "hard", question: "Power-Interest grid helps?", options: [{ label: "A", text: "Write code faster" }, { label: "B", text: "Prioritize stakeholder engagement" }, { label: "C", text: "Design databases" }], correctAnswer: "B", explanation: "Map stakeholders by power and interest to determine engagement strategy!" },
    ],
  },
  "requirements-gathering": {
    id: "requirements-gathering", moduleId: "systems-analysis", title: "Requirements Gathering", xpReward: 125, category: "Requirements",
    steps: [
      { type: "quiz", title: "Techniques", difficulty: "medium", question: "Gathering techniques include?", options: [{ label: "A", text: "Only reading documents" }, { label: "B", text: "Interviews, workshops, observation, surveys" }, { label: "C", text: "Guessing" }], correctAnswer: "B", explanation: "Multiple techniques: interviews, JAD sessions, observation, prototyping!" },
      { type: "quiz", title: "Functional vs Non-Functional", difficulty: "hard", question: "Performance is?", options: [{ label: "A", text: "Functional requirement" }, { label: "B", text: "Non-functional requirement" }, { label: "C", text: "Not a requirement" }], correctAnswer: "B", explanation: "Non-functional: performance, security, usability, reliability. HOW it behaves!" },
      { type: "quiz", title: "MoSCoW", difficulty: "hard", question: "MoSCoW prioritization stands for?", options: [{ label: "A", text: "City in Russia" }, { label: "B", text: "Must, Should, Could, Won't" }, { label: "C", text: "Method of System Control" }], correctAnswer: "B", explanation: "Must have, Should have, Could have, Won't have (this time)!" },
    ],
  },
  "user-stories": {
    id: "user-stories", moduleId: "systems-analysis", title: "User Stories", xpReward: 100, category: "Requirements",
    steps: [
      { type: "quiz", title: "Story Format", difficulty: "medium", question: "User story format is?", options: [{ label: "A", text: "Technical specification" }, { label: "B", text: "As a [role], I want [feature], so that [benefit]" }, { label: "C", text: "Long document" }], correctAnswer: "B", explanation: "Who, What, Why format captures user value simply!" },
      { type: "typing", title: "Write Story", difficulty: "medium", prompt: "Type a user story template!", codeToType: "As a user, I want to login, so that I can access my data.", explanation: "Clear, value-focused stories drive development priorities!" },
      { type: "quiz", title: "INVEST", difficulty: "hard", question: "Good stories are INVEST?", options: [{ label: "A", text: "Financial terms" }, { label: "B", text: "Independent, Negotiable, Valuable, Estimable, Small, Testable" }, { label: "C", text: "Investment related" }], correctAnswer: "B", explanation: "INVEST criteria ensure stories are well-formed and actionable!" },
    ],
  },

  // === MODELING ===
  "use-case-modeling": {
    id: "use-case-modeling", moduleId: "systems-analysis", title: "Use Case Modeling", xpReward: 150, category: "Modeling",
    steps: [
      { type: "quiz", title: "Use Case Purpose", difficulty: "medium", question: "Use cases describe?", options: [{ label: "A", text: "Database tables" }, { label: "B", text: "System interactions from user perspective" }, { label: "C", text: "Code structure" }], correctAnswer: "B", explanation: "Use cases show what users can do with the system - functional behavior!" },
      { type: "quiz", title: "Actor", difficulty: "medium", question: "An actor is?", options: [{ label: "A", text: "Movie star" }, { label: "B", text: "Entity that interacts with system" }, { label: "C", text: "Internal process" }], correctAnswer: "B", explanation: "Actors: users, external systems, devices that trigger use cases!" },
      { type: "quiz", title: "Include vs Extend", difficulty: "hard", question: "<<include>> means?", options: [{ label: "A", text: "Optional behavior" }, { label: "B", text: "Required behavior always happens" }, { label: "C", text: "External system" }], correctAnswer: "B", explanation: "Include = mandatory sub-behavior. Extend = optional enhancement!" },
    ],
  },
  "process-modeling": {
    id: "process-modeling", moduleId: "systems-analysis", title: "Process Modeling", xpReward: 150, category: "Modeling",
    steps: [
      { type: "quiz", title: "DFD Purpose", difficulty: "medium", question: "Data Flow Diagrams show?", options: [{ label: "A", text: "Class inheritance" }, { label: "B", text: "How data moves through system" }, { label: "C", text: "User interfaces" }], correctAnswer: "B", explanation: "DFDs visualize data movement between processes, stores, and entities!" },
      { type: "quiz", title: "DFD Symbols", difficulty: "hard", question: "Circle/bubble in DFD is?", options: [{ label: "A", text: "Data store" }, { label: "B", text: "Process" }, { label: "C", text: "External entity" }], correctAnswer: "B", explanation: "Circle = process. Rectangle = external entity. Open rectangle = data store!" },
      { type: "quiz", title: "BPMN", difficulty: "hard", question: "BPMN is used for?", options: [{ label: "A", text: "Database design" }, { label: "B", text: "Business process modeling" }, { label: "C", text: "Network diagrams" }], correctAnswer: "B", explanation: "Business Process Model Notation standardizes process visualization!" },
    ],
  },
  "erd-fundamentals": {
    id: "erd-fundamentals", moduleId: "systems-analysis", title: "ERD Fundamentals", xpReward: 175, category: "Data Modeling",
    steps: [
      { type: "quiz", title: "ERD Purpose", difficulty: "medium", question: "ERD models?", options: [{ label: "A", text: "System processes" }, { label: "B", text: "Data entities and relationships" }, { label: "C", text: "User interfaces" }], correctAnswer: "B", explanation: "Entity Relationship Diagrams show data structure - tables and connections!" },
      { type: "quiz", title: "Entity", difficulty: "medium", question: "An entity is?", options: [{ label: "A", text: "A process" }, { label: "B", text: "A thing we store data about" }, { label: "C", text: "A user" }], correctAnswer: "B", explanation: "Entities: Customer, Order, Product - nouns we need to track!" },
      { type: "quiz", title: "Primary Key", difficulty: "medium", question: "Primary key is?", options: [{ label: "A", text: "Any attribute" }, { label: "B", text: "Unique identifier for entity" }, { label: "C", text: "Foreign key" }], correctAnswer: "B", explanation: "Primary key uniquely identifies each row - no duplicates, not null!" },
      { type: "quiz", title: "Cardinality", difficulty: "hard", question: "1:N means?", options: [{ label: "A", text: "One to one" }, { label: "B", text: "One to many" }, { label: "C", text: "Many to many" }], correctAnswer: "B", explanation: "One customer can have many orders = 1:N relationship!" },
    ],
  },
  "normalization": {
    id: "normalization", moduleId: "systems-analysis", title: "Database Normalization", xpReward: 200, category: "Data Modeling",
    steps: [
      { type: "quiz", title: "Purpose", difficulty: "medium", question: "Normalization reduces?", options: [{ label: "A", text: "Table count" }, { label: "B", text: "Data redundancy" }, { label: "C", text: "Query speed" }], correctAnswer: "B", explanation: "Normalization organizes data to minimize redundancy and anomalies!" },
      { type: "quiz", title: "1NF", difficulty: "hard", question: "First Normal Form requires?", options: [{ label: "A", text: "No foreign keys" }, { label: "B", text: "Atomic values, no repeating groups" }, { label: "C", text: "Only integers" }], correctAnswer: "B", explanation: "1NF: each cell has single value, no lists or arrays in cells!" },
      { type: "quiz", title: "2NF", difficulty: "hard", question: "2NF eliminates?", options: [{ label: "A", text: "Transitive dependencies" }, { label: "B", text: "Partial dependencies on composite key" }, { label: "C", text: "All nulls" }], correctAnswer: "B", explanation: "2NF: non-key attributes depend on WHOLE primary key, not part!" },
      { type: "quiz", title: "3NF", difficulty: "hard", question: "3NF removes?", options: [{ label: "A", text: "Primary keys" }, { label: "B", text: "Transitive dependencies" }, { label: "C", text: "All relationships" }], correctAnswer: "B", explanation: "3NF: non-key attributes depend ONLY on key, not on other non-key attributes!" },
    ],
  },

  // === TESTING & IMPLEMENTATION ===
  "testing-strategies": {
    id: "testing-strategies", moduleId: "systems-analysis", title: "Testing Strategies", xpReward: 150, category: "Testing",
    steps: [
      { type: "quiz", title: "Unit Testing", difficulty: "medium", question: "Unit tests verify?", options: [{ label: "A", text: "Whole system" }, { label: "B", text: "Individual components" }, { label: "C", text: "User acceptance" }], correctAnswer: "B", explanation: "Unit tests check small pieces - functions, methods in isolation!" },
      { type: "quiz", title: "Integration Testing", difficulty: "medium", question: "Integration tests check?", options: [{ label: "A", text: "Single function" }, { label: "B", text: "Components working together" }, { label: "C", text: "Performance only" }], correctAnswer: "B", explanation: "Integration tests verify modules connect and communicate correctly!" },
      { type: "quiz", title: "UAT", difficulty: "hard", question: "User Acceptance Testing is?", options: [{ label: "A", text: "Done by developers" }, { label: "B", text: "Final validation by end users" }, { label: "C", text: "Automated only" }], correctAnswer: "B", explanation: "UAT: users verify system meets their needs before go-live!" },
    ],
  },
  "implementation-strategies": {
    id: "implementation-strategies", moduleId: "systems-analysis", title: "Implementation Strategies", xpReward: 150, category: "Implementation",
    steps: [
      { type: "quiz", title: "Big Bang", difficulty: "medium", question: "Big bang deployment?", options: [{ label: "A", text: "Gradual rollout" }, { label: "B", text: "All at once switchover" }, { label: "C", text: "Parallel running" }], correctAnswer: "B", explanation: "Big bang: old system off, new system on. High risk but fast!" },
      { type: "quiz", title: "Phased", difficulty: "medium", question: "Phased rollout?", options: [{ label: "A", text: "All users at once" }, { label: "B", text: "Gradual by module or location" }, { label: "C", text: "No training" }], correctAnswer: "B", explanation: "Phased reduces risk - roll out to departments/regions incrementally!" },
      { type: "quiz", title: "Parallel", difficulty: "hard", question: "Parallel running means?", options: [{ label: "A", text: "Only new system" }, { label: "B", text: "Both systems run simultaneously" }, { label: "C", text: "No old system" }], correctAnswer: "B", explanation: "Parallel: old and new run together. Safe but expensive!" },
    ],
  },
};

// ==========================================
// EXPANDED MATHS FOR COMPUTING LESSONS
// ==========================================

export const mathsExpandedLessons: Record<string, LessonData> = {
  // === NUMBER SYSTEMS ===
  "binary-numbers": {
    id: "binary-numbers", moduleId: "math-computing", title: "Binary Numbers", xpReward: 100, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Binary Base", difficulty: "easy", question: "Binary uses base?", options: [{ label: "A", text: "10" }, { label: "B", text: "2" }, { label: "C", text: "16" }], correctAnswer: "B", explanation: "Binary = base 2. Only digits 0 and 1. Computers use it natively!" },
      { type: "quiz", title: "Binary 5", difficulty: "medium", question: "5 in binary is?", options: [{ label: "A", text: "101" }, { label: "B", text: "100" }, { label: "C", text: "110" }], correctAnswer: "A", explanation: "5 = 4+1 = 2²+2⁰ = 101 in binary. Each position is power of 2!" },
      { type: "quiz", title: "Binary 10", difficulty: "medium", question: "Binary 1010 equals?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "12" }], correctAnswer: "B", explanation: "1010 = 8+0+2+0 = 10. Position values: 8,4,2,1 from left!" },
    ],
  },
  "hexadecimal": {
    id: "hexadecimal", moduleId: "math-computing", title: "Hexadecimal", xpReward: 100, category: "Number Systems",
    steps: [
      { type: "quiz", title: "Hex Base", difficulty: "medium", question: "Hexadecimal uses base?", options: [{ label: "A", text: "8" }, { label: "B", text: "10" }, { label: "C", text: "16" }], correctAnswer: "C", explanation: "Hex = base 16. Uses 0-9 and A-F. Compact way to represent binary!" },
      { type: "quiz", title: "Hex A", difficulty: "medium", question: "Hex A equals?", options: [{ label: "A", text: "10" }, { label: "B", text: "11" }, { label: "C", text: "15" }], correctAnswer: "A", explanation: "A=10, B=11, C=12, D=13, E=14, F=15 in hexadecimal!" },
      { type: "quiz", title: "Hex FF", difficulty: "hard", question: "Hex FF equals?", options: [{ label: "A", text: "15" }, { label: "B", text: "255" }, { label: "C", text: "16" }], correctAnswer: "B", explanation: "FF = 15×16 + 15 = 240 + 15 = 255. Maximum 8-bit value!" },
    ],
  },

  // === PROBABILITY ===
  "probability-basics": {
    id: "probability-basics", moduleId: "math-computing", title: "Probability Basics", xpReward: 100, category: "Probability",
    steps: [
      { type: "quiz", title: "Probability Range", difficulty: "easy", question: "Probability is between?", options: [{ label: "A", text: "-1 and 1" }, { label: "B", text: "0 and 1" }, { label: "C", text: "0 and 100" }], correctAnswer: "B", explanation: "P(event) ranges from 0 (impossible) to 1 (certain)!" },
      { type: "quiz", title: "Coin Flip", difficulty: "easy", question: "P(heads) for fair coin?", options: [{ label: "A", text: "0.25" }, { label: "B", text: "0.5" }, { label: "C", text: "1" }], correctAnswer: "B", explanation: "Fair coin: 1 favorable out of 2 possible = 0.5 or 50%!" },
      { type: "quiz", title: "Complement", difficulty: "medium", question: "P(not A) = ?", options: [{ label: "A", text: "P(A)" }, { label: "B", text: "1 - P(A)" }, { label: "C", text: "P(A) × 2" }], correctAnswer: "B", explanation: "Complement rule: P(not A) = 1 - P(A). Must sum to 1!" },
    ],
  },
  "conditional-probability": {
    id: "conditional-probability", moduleId: "math-computing", title: "Conditional Probability", xpReward: 150, category: "Probability",
    steps: [
      { type: "quiz", title: "Notation", difficulty: "hard", question: "P(A|B) means?", options: [{ label: "A", text: "A or B" }, { label: "B", text: "A given B occurred" }, { label: "C", text: "A and B" }], correctAnswer: "B", explanation: "Conditional probability: probability of A, knowing B happened!" },
      { type: "quiz", title: "Bayes", difficulty: "hard", question: "Bayes theorem relates?", options: [{ label: "A", text: "Addition only" }, { label: "B", text: "P(A|B) to P(B|A)" }, { label: "C", text: "Only complements" }], correctAnswer: "B", explanation: "Bayes: P(A|B) = P(B|A)×P(A)/P(B). Crucial for ML!" },
    ],
  },

  // === DISCRETE MATH ===
  "graph-theory": {
    id: "graph-theory", moduleId: "math-computing", title: "Graph Theory Basics", xpReward: 150, category: "Discrete Math",
    steps: [
      { type: "quiz", title: "Graph Components", difficulty: "medium", question: "A graph has?", options: [{ label: "A", text: "Nodes and edges" }, { label: "B", text: "Only nodes" }, { label: "C", text: "Only lines" }], correctAnswer: "A", explanation: "Graphs: vertices (nodes) connected by edges. Models relationships!" },
      { type: "quiz", title: "Directed Graph", difficulty: "medium", question: "Directed graph edges have?", options: [{ label: "A", text: "No direction" }, { label: "B", text: "One-way direction (arrows)" }, { label: "C", text: "Colors" }], correctAnswer: "B", explanation: "Digraphs have arrows - A→B doesn't mean B→A!" },
      { type: "quiz", title: "Cycle", difficulty: "hard", question: "A cycle is?", options: [{ label: "A", text: "Dead end" }, { label: "B", text: "Path that returns to start" }, { label: "C", text: "Single node" }], correctAnswer: "B", explanation: "Cycle: path starting and ending at same vertex. Loop detection!" },
    ],
  },
  "recursion-math": {
    id: "recursion-math", moduleId: "math-computing", title: "Recursion & Recurrence", xpReward: 175, category: "Discrete Math",
    steps: [
      { type: "quiz", title: "Recursion Definition", difficulty: "medium", question: "Recursion means?", options: [{ label: "A", text: "Looping" }, { label: "B", text: "Function calling itself" }, { label: "C", text: "Iteration" }], correctAnswer: "B", explanation: "Recursion: solving problem by solving smaller versions of itself!" },
      { type: "quiz", title: "Base Case", difficulty: "medium", question: "Base case is?", options: [{ label: "A", text: "Recursive call" }, { label: "B", text: "Stopping condition" }, { label: "C", text: "First iteration" }], correctAnswer: "B", explanation: "Base case stops recursion - without it, infinite loop!" },
      { type: "quiz", title: "Factorial", difficulty: "hard", question: "5! = ?", options: [{ label: "A", text: "25" }, { label: "B", text: "120" }, { label: "C", text: "5" }], correctAnswer: "B", explanation: "5! = 5×4×3×2×1 = 120. Classic recursive definition!" },
    ],
  },
};

// ==========================================
// INTENSIVE CODE DRILLING CHALLENGES
// ==========================================

export const codeDrillingLessons: Record<string, LessonData> = {
  // === IF-ELSE INTENSIVE DRILLING ===
  "if-else-drill-1": {
    id: "if-else-drill-1", moduleId: "java-foundations", title: "If-Else Drill 1", xpReward: 50, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Basic If", difficulty: "easy", prompt: "Type if with condition!", codeToType: "if (x > 0) {", explanation: "Start with 'if', parentheses around condition, then open brace." },
      { type: "typing", title: "Close Block", difficulty: "easy", prompt: "Close the if block!", codeToType: "}", explanation: "Every opening brace needs a closing brace." },
      { type: "typing", title: "Full If", difficulty: "easy", prompt: "Complete if statement!", codeToType: "if (x > 0) { }", explanation: "Pattern: if (condition) { code }" },
      { type: "typing", title: "If-Else", difficulty: "medium", prompt: "Add else clause!", codeToType: "if (x > 0) { } else { }", explanation: "else immediately follows the closing brace of if." },
      { type: "typing", title: "Else If", difficulty: "medium", prompt: "Full if-else if-else!", codeToType: "if (x > 0) { } else if (x < 0) { } else { }", explanation: "Chain conditions: if → else if → else" },
    ],
  },
  "if-else-drill-2": {
    id: "if-else-drill-2", moduleId: "java-foundations", title: "If-Else Drill 2", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "AND Condition", difficulty: "medium", prompt: "Two conditions with AND!", codeToType: "if (x > 0 && y > 0) { }", explanation: "&& is logical AND - both must be true." },
      { type: "typing", title: "OR Condition", difficulty: "medium", prompt: "Two conditions with OR!", codeToType: "if (x > 0 || y > 0) { }", explanation: "|| is logical OR - at least one must be true." },
      { type: "typing", title: "NOT Condition", difficulty: "medium", prompt: "Negated condition!", codeToType: "if (!isEmpty) { }", explanation: "! negates - true becomes false, false becomes true." },
      { type: "typing", title: "Nested If", difficulty: "hard", prompt: "If inside if!", codeToType: "if (x > 0) { if (y > 0) { } }", explanation: "Nested conditions for complex logic." },
      { type: "placement", title: "Order Check", difficulty: "hard", prompt: "Put in correct order!", placementOptions: ["if (age >= 18) {", "canVote = true;", "} else {", "canVote = false;", "}"], correctPlacement: "if (age >= 18) { canVote = true; } else { canVote = false; }", explanation: "Logical flow: condition, true case, else, false case, close." },
    ],
  },

  // === LOOP INTENSIVE DRILLING ===
  "for-loop-drill": {
    id: "for-loop-drill", moduleId: "java-foundations", title: "For Loop Drill", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Init Part", difficulty: "easy", prompt: "Type loop initialization!", codeToType: "int i = 0", explanation: "First part: declare and initialize counter." },
      { type: "typing", title: "Condition Part", difficulty: "easy", prompt: "Type loop condition!", codeToType: "i < 10", explanation: "Second part: continue while this is true." },
      { type: "typing", title: "Increment Part", difficulty: "easy", prompt: "Type increment!", codeToType: "i++", explanation: "Third part: what changes each iteration." },
      { type: "typing", title: "Full For Loop", difficulty: "medium", prompt: "Complete for loop!", codeToType: "for (int i = 0; i < 10; i++) { }", explanation: "for (init; condition; update) { body }" },
      { type: "typing", title: "Reverse Loop", difficulty: "medium", prompt: "Count down from 10!", codeToType: "for (int i = 10; i > 0; i--) { }", explanation: "Start high, check greater than, decrement." },
      { type: "typing", title: "Step by 2", difficulty: "hard", prompt: "Count by 2s!", codeToType: "for (int i = 0; i < 10; i += 2) { }", explanation: "i += 2 adds 2 each iteration: 0, 2, 4, 6, 8" },
    ],
  },
  "while-loop-drill": {
    id: "while-loop-drill", moduleId: "java-foundations", title: "While Loop Drill", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Basic While", difficulty: "easy", prompt: "Type while loop!", codeToType: "while (x < 10) { }", explanation: "while (condition) { body } - checks before each iteration." },
      { type: "typing", title: "While with Inc", difficulty: "medium", prompt: "While with counter!", codeToType: "while (i < 5) { i++; }", explanation: "Must modify condition variable or infinite loop!" },
      { type: "typing", title: "Do-While", difficulty: "medium", prompt: "Do-while loop!", codeToType: "do { } while (x < 10);", explanation: "do { body } while (condition); - runs at least once!" },
      { type: "typing", title: "Break Loop", difficulty: "medium", prompt: "Exit loop early!", codeToType: "while (true) { break; }", explanation: "break exits the loop immediately." },
      { type: "typing", title: "Continue Loop", difficulty: "hard", prompt: "Skip iteration!", codeToType: "while (i < 10) { i++; continue; }", explanation: "continue skips to next iteration." },
    ],
  },

  // === METHOD DRILLING ===
  "method-drill": {
    id: "method-drill", moduleId: "java-foundations", title: "Method Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Void Method", difficulty: "easy", prompt: "Simple void method!", codeToType: "public void sayHello() { }", explanation: "access returnType name() { body }" },
      { type: "typing", title: "Return Method", difficulty: "medium", prompt: "Method that returns int!", codeToType: "public int getAge() { return 25; }", explanation: "Return type before name, return statement in body." },
      { type: "typing", title: "With Parameter", difficulty: "medium", prompt: "Method with parameter!", codeToType: "public void greet(String name) { }", explanation: "Parameters in parentheses: type name" },
      { type: "typing", title: "Multiple Params", difficulty: "hard", prompt: "Two parameters!", codeToType: "public int add(int a, int b) { return a + b; }", explanation: "Separate parameters with commas." },
      { type: "typing", title: "Static Method", difficulty: "hard", prompt: "Static method!", codeToType: "public static void main(String[] args) { }", explanation: "static means belongs to class, not instance." },
    ],
  },

  // === CLASS/OOP DRILLING ===
  "class-drill": {
    id: "class-drill", moduleId: "java-foundations", title: "Class Structure Drill", xpReward: 125, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Class Declaration", difficulty: "easy", prompt: "Declare a class!", codeToType: "public class Dog { }", explanation: "public class ClassName { body }" },
      { type: "typing", title: "Private Field", difficulty: "medium", prompt: "Add private field!", codeToType: "private String name;", explanation: "private type fieldName; - encapsulation!" },
      { type: "typing", title: "Constructor", difficulty: "medium", prompt: "Constructor method!", codeToType: "public Dog(String name) { this.name = name; }", explanation: "Constructor: same name as class, no return type." },
      { type: "typing", title: "Getter", difficulty: "medium", prompt: "Getter method!", codeToType: "public String getName() { return name; }", explanation: "getFieldName returns the field value." },
      { type: "typing", title: "Setter", difficulty: "medium", prompt: "Setter method!", codeToType: "public void setName(String name) { this.name = name; }", explanation: "setFieldName updates the field." },
      { type: "typing", title: "Extends", difficulty: "hard", prompt: "Inheritance!", codeToType: "public class Puppy extends Dog { }", explanation: "Child class extends parent class." },
    ],
  },

  // === TRY-CATCH DRILLING ===
  "exception-drill": {
    id: "exception-drill", moduleId: "java-foundations", title: "Exception Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Try Block", difficulty: "easy", prompt: "Start try block!", codeToType: "try {", explanation: "try contains risky code that might throw exceptions." },
      { type: "typing", title: "Catch Block", difficulty: "medium", prompt: "Add catch block!", codeToType: "} catch (Exception e) {", explanation: "catch specifies what exception to handle." },
      { type: "typing", title: "Full Try-Catch", difficulty: "medium", prompt: "Complete try-catch!", codeToType: "try { } catch (Exception e) { }", explanation: "try { risky } catch (Type var) { handle }" },
      { type: "typing", title: "Finally", difficulty: "hard", prompt: "Add finally!", codeToType: "try { } catch (Exception e) { } finally { }", explanation: "finally always runs - cleanup code goes here." },
      { type: "typing", title: "Throw", difficulty: "hard", prompt: "Throw exception!", codeToType: "throw new IllegalArgumentException();", explanation: "throw new ExceptionType() creates and throws." },
    ],
  },

// === ARRAY DRILLING ===
  "array-drill": {
    id: "array-drill", moduleId: "java-foundations", title: "Array Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Declare Array", difficulty: "easy", prompt: "Declare int array!", codeToType: "int[] nums;", explanation: "type[] name; - brackets after type for arrays." },
      { type: "typing", title: "Initialize Array", difficulty: "medium", prompt: "Create with values!", codeToType: "int[] nums = {1, 2, 3};", explanation: "{ } contains initial values, comma-separated." },
      { type: "typing", title: "New Array", difficulty: "medium", prompt: "Create empty array!", codeToType: "int[] nums = new int[5];", explanation: "new type[size] allocates space for size elements." },
      { type: "typing", title: "Access Element", difficulty: "medium", prompt: "Get first element!", codeToType: "int first = nums[0];", explanation: "Arrays are zero-indexed - first element is [0]." },
      { type: "typing", title: "Array Length", difficulty: "medium", prompt: "Get array length!", codeToType: "int len = nums.length;", explanation: "length is property (no parentheses) not method." },
      { type: "typing", title: "Loop Array", difficulty: "hard", prompt: "For-each over array!", codeToType: "for (int n : nums) { }", explanation: "Enhanced for: for (type var : array) { }" },
    ],
  },

  // === SWITCH STATEMENT DRILLING ===
  "switch-drill": {
    id: "switch-drill", moduleId: "java-foundations", title: "Switch Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Switch Start", difficulty: "easy", prompt: "Start switch block!", codeToType: "switch (day) {", explanation: "switch (variable) { - evaluates one variable." },
      { type: "typing", title: "Case Statement", difficulty: "medium", prompt: "Add a case!", codeToType: 'case 1: break;', explanation: "case value: code; break; - stops fallthrough." },
      { type: "typing", title: "Default Case", difficulty: "medium", prompt: "Add default!", codeToType: "default: break;", explanation: "default runs when no case matches." },
      { type: "typing", title: "Full Switch", difficulty: "hard", prompt: "Complete switch!", codeToType: "switch (x) { case 1: break; default: break; }", explanation: "switch { cases + default }" },
      { type: "typing", title: "String Switch", difficulty: "hard", prompt: "Switch on String!", codeToType: 'switch (cmd) { case "go": break; }', explanation: "Java 7+ allows String in switch!" },
    ],
  },

  // === STRING OPERATIONS DRILLING ===
  "string-drill": {
    id: "string-drill", moduleId: "java-foundations", title: "String Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "String Length", difficulty: "easy", prompt: "Get string length!", codeToType: "int len = text.length();", explanation: "length() is a method on String - note parentheses!" },
      { type: "typing", title: "Uppercase", difficulty: "easy", prompt: "Convert to uppercase!", codeToType: "String upper = text.toUpperCase();", explanation: "Returns new String - original unchanged!" },
      { type: "typing", title: "Substring", difficulty: "medium", prompt: "Extract substring!", codeToType: "String sub = text.substring(0, 5);", explanation: "substring(start, end) - end is exclusive!" },
      { type: "typing", title: "Char At", difficulty: "medium", prompt: "Get character!", codeToType: "char c = text.charAt(0);", explanation: "charAt(index) returns single character." },
      { type: "typing", title: "Contains Check", difficulty: "medium", prompt: "Check contains!", codeToType: 'boolean has = text.contains("java");', explanation: "contains() checks if substring exists." },
      { type: "typing", title: "Split String", difficulty: "hard", prompt: "Split by comma!", codeToType: 'String[] parts = text.split(",");', explanation: "split(delimiter) returns array of parts." },
    ],
  },

  // === PRINT STATEMENT DRILLING ===
  "print-drill": {
    id: "print-drill", moduleId: "java-foundations", title: "Print Statement Drill", xpReward: 50, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Println", difficulty: "easy", prompt: "Print with newline!", codeToType: 'System.out.println("Hello");', explanation: "println adds newline after output." },
      { type: "typing", title: "Print", difficulty: "easy", prompt: "Print no newline!", codeToType: 'System.out.print("Hi");', explanation: "print stays on same line." },
      { type: "typing", title: "Print Variable", difficulty: "medium", prompt: "Print a variable!", codeToType: 'System.out.println(name);', explanation: "No quotes around variable names!" },
      { type: "typing", title: "Concatenate", difficulty: "medium", prompt: "Print text + variable!", codeToType: 'System.out.println("Age: " + age);', explanation: "+ joins strings and variables." },
      { type: "typing", title: "Printf", difficulty: "hard", prompt: "Formatted print!", codeToType: 'System.out.printf("Score: %d", score);', explanation: "printf with format specifiers: %d for int." },
    ],
  },

  // === COMPARISON OPERATORS DRILLING ===
  "comparison-drill": {
    id: "comparison-drill", moduleId: "java-foundations", title: "Comparison Drill", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Equals", difficulty: "easy", prompt: "Check equality!", codeToType: "boolean same = (a == b);", explanation: "== checks if values are equal." },
      { type: "typing", title: "Not Equals", difficulty: "easy", prompt: "Check not equal!", codeToType: "boolean diff = (a != b);", explanation: "!= checks if values are different." },
      { type: "typing", title: "Greater Than", difficulty: "easy", prompt: "Check greater!", codeToType: "boolean bigger = (a > b);", explanation: "> checks if left is greater than right." },
      { type: "typing", title: "Less Or Equal", difficulty: "medium", prompt: "Check less or equal!", codeToType: "boolean small = (a <= b);", explanation: "<= checks less than OR equal to." },
      { type: "typing", title: "String Equals", difficulty: "hard", prompt: "Compare strings!", codeToType: 'boolean eq = s1.equals(s2);', explanation: "Use .equals() for String comparison, not ==!" },
    ],
  },

  // === VARIABLE DECLARATION DRILLING ===
  "variable-drill": {
    id: "variable-drill", moduleId: "java-foundations", title: "Variable Drill", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Int Variable", difficulty: "easy", prompt: "Declare integer!", codeToType: "int count = 0;", explanation: "int for whole numbers." },
      { type: "typing", title: "Double Variable", difficulty: "easy", prompt: "Declare decimal!", codeToType: "double price = 9.99;", explanation: "double for decimal numbers." },
      { type: "typing", title: "String Variable", difficulty: "easy", prompt: "Declare string!", codeToType: 'String name = "Java";', explanation: "String with capital S, text in quotes." },
      { type: "typing", title: "Boolean Variable", difficulty: "medium", prompt: "Declare boolean!", codeToType: "boolean active = true;", explanation: "boolean for true/false values." },
      { type: "typing", title: "Final Constant", difficulty: "medium", prompt: "Declare constant!", codeToType: "final int MAX = 100;", explanation: "final makes it unchangeable." },
      { type: "typing", title: "Char Variable", difficulty: "medium", prompt: "Declare character!", codeToType: "char grade = 'A';", explanation: "char uses single quotes, one character only." },
    ],
  },

  // === ARITHMETIC DRILLING ===
  "arithmetic-drill": {
    id: "arithmetic-drill", moduleId: "java-foundations", title: "Arithmetic Drill", xpReward: 75, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Addition", difficulty: "easy", prompt: "Add numbers!", codeToType: "int sum = a + b;", explanation: "+ adds values." },
      { type: "typing", title: "Subtraction", difficulty: "easy", prompt: "Subtract!", codeToType: "int diff = a - b;", explanation: "- subtracts." },
      { type: "typing", title: "Multiplication", difficulty: "easy", prompt: "Multiply!", codeToType: "int product = a * b;", explanation: "* multiplies." },
      { type: "typing", title: "Division", difficulty: "medium", prompt: "Divide!", codeToType: "int quotient = a / b;", explanation: "/ divides (integer division truncates)." },
      { type: "typing", title: "Modulo", difficulty: "medium", prompt: "Get remainder!", codeToType: "int remainder = a % b;", explanation: "% returns remainder after division." },
      { type: "typing", title: "Increment", difficulty: "medium", prompt: "Add one!", codeToType: "count++;", explanation: "++ adds 1 to variable." },
      { type: "typing", title: "Compound Add", difficulty: "hard", prompt: "Add and assign!", codeToType: "total += 10;", explanation: "+= adds and assigns in one step." },
    ],
  },

  // === INTERFACE DRILLING ===
  "interface-drill": {
    id: "interface-drill", moduleId: "java-foundations", title: "Interface Drill", xpReward: 125, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Interface Declaration", difficulty: "medium", prompt: "Declare interface!", codeToType: "public interface Drawable { }", explanation: "interface keyword, like class but abstract." },
      { type: "typing", title: "Interface Method", difficulty: "medium", prompt: "Add abstract method!", codeToType: "void draw();", explanation: "No body, just signature - implementation comes later." },
      { type: "typing", title: "Implement Interface", difficulty: "hard", prompt: "Implement interface!", codeToType: "public class Circle implements Drawable { }", explanation: "implements keyword connects class to interface." },
      { type: "typing", title: "Override Method", difficulty: "hard", prompt: "Override draw!", codeToType: "@Override public void draw() { }", explanation: "@Override annotation marks implementation." },
      { type: "typing", title: "Multiple Interfaces", difficulty: "hard", prompt: "Implement two!", codeToType: "class X implements A, B { }", explanation: "Comma-separated for multiple interfaces." },
    ],
  },

  // === ARRAYLIST DRILLING ===
  "arraylist-drill": {
    id: "arraylist-drill", moduleId: "java-foundations", title: "ArrayList Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Create ArrayList", difficulty: "medium", prompt: "Create String list!", codeToType: "ArrayList<String> list = new ArrayList<>();", explanation: "ArrayList<Type> with diamond operator <>." },
      { type: "typing", title: "Add Element", difficulty: "medium", prompt: "Add to list!", codeToType: 'list.add("item");', explanation: "add() appends to end of list." },
      { type: "typing", title: "Get Element", difficulty: "medium", prompt: "Get by index!", codeToType: "String item = list.get(0);", explanation: "get(index) retrieves element." },
      { type: "typing", title: "Remove Element", difficulty: "medium", prompt: "Remove by index!", codeToType: "list.remove(0);", explanation: "remove(index) deletes element." },
      { type: "typing", title: "List Size", difficulty: "medium", prompt: "Get list size!", codeToType: "int size = list.size();", explanation: "size() returns count of elements." },
      { type: "typing", title: "Loop ArrayList", difficulty: "hard", prompt: "For-each loop!", codeToType: "for (String s : list) { }", explanation: "Enhanced for works with ArrayList too." },
    ],
  },

  // === SCANNER INPUT DRILLING ===
  "scanner-drill": {
    id: "scanner-drill", moduleId: "java-foundations", title: "Scanner Input Drill", xpReward: 100, category: "Code Drilling",
    steps: [
      { type: "typing", title: "Create Scanner", difficulty: "medium", prompt: "Create Scanner!", codeToType: "Scanner sc = new Scanner(System.in);", explanation: "Scanner reads from System.in (keyboard)." },
      { type: "typing", title: "Read String", difficulty: "medium", prompt: "Read line!", codeToType: "String line = sc.nextLine();", explanation: "nextLine() reads entire line." },
      { type: "typing", title: "Read Int", difficulty: "medium", prompt: "Read integer!", codeToType: "int num = sc.nextInt();", explanation: "nextInt() reads integer value." },
      { type: "typing", title: "Read Double", difficulty: "medium", prompt: "Read decimal!", codeToType: "double val = sc.nextDouble();", explanation: "nextDouble() reads decimal." },
      { type: "typing", title: "Close Scanner", difficulty: "medium", prompt: "Close scanner!", codeToType: "sc.close();", explanation: "Always close Scanner when done." },
    ],
  },
};

// ==========================================
// ADVANCED PROFESSIONAL CONTENT
// ==========================================

// === ADVANCED JAVA PATTERNS ===
export const advancedJavaLessons: Record<string, LessonData> = {
  "streams-api": {
    id: "streams-api", moduleId: "java-foundations", title: "Java Streams API", xpReward: 175, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Create Stream", difficulty: "hard", prompt: "Stream from list!", codeToType: "list.stream()", explanation: ".stream() converts collection to a stream for functional processing." },
      { type: "typing", title: "Filter Stream", difficulty: "hard", prompt: "Filter elements!", codeToType: ".filter(x -> x > 0)", explanation: "filter() keeps elements matching the predicate (condition)." },
      { type: "typing", title: "Map Stream", difficulty: "hard", prompt: "Transform elements!", codeToType: ".map(x -> x * 2)", explanation: "map() transforms each element using the function." },
      { type: "typing", title: "Collect Stream", difficulty: "hard", prompt: "Collect to list!", codeToType: ".collect(Collectors.toList())", explanation: "collect() gathers stream results into a collection." },
      { type: "typing", title: "Full Pipeline", difficulty: "hard", prompt: "Complete stream pipeline!", codeToType: "list.stream().filter(x -> x > 0).map(x -> x * 2).collect(Collectors.toList())", explanation: "Chain operations: source → intermediate ops → terminal op." },
    ],
  },
  "lambda-expressions": {
    id: "lambda-expressions", moduleId: "java-foundations", title: "Lambda Expressions", xpReward: 150, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Basic Lambda", difficulty: "hard", prompt: "Simple lambda!", codeToType: "x -> x * 2", explanation: "Lambda: parameter -> expression. Anonymous function!" },
      { type: "typing", title: "Two Params", difficulty: "hard", prompt: "Lambda with two params!", codeToType: "(a, b) -> a + b", explanation: "Multiple parameters in parentheses." },
      { type: "typing", title: "Lambda Block", difficulty: "hard", prompt: "Lambda with block!", codeToType: "x -> { return x * 2; }", explanation: "Braces needed for multiple statements, explicit return." },
      { type: "typing", title: "Method Reference", difficulty: "hard", prompt: "Method reference!", codeToType: "System.out::println", explanation: ":: references a method. Shorthand for lambda." },
    ],
  },
  "optionals": {
    id: "optionals", moduleId: "java-foundations", title: "Optional Class", xpReward: 125, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Create Optional", difficulty: "hard", prompt: "Create Optional!", codeToType: "Optional.of(value)", explanation: "Optional wraps values that might be null." },
      { type: "typing", title: "Empty Optional", difficulty: "hard", prompt: "Empty Optional!", codeToType: "Optional.empty()", explanation: "empty() creates Optional with no value." },
      { type: "typing", title: "Nullable", difficulty: "hard", prompt: "Optional from nullable!", codeToType: "Optional.ofNullable(value)", explanation: "ofNullable handles null safely - no exception." },
      { type: "typing", title: "Get Value", difficulty: "hard", prompt: "Get or default!", codeToType: "opt.orElse(defaultValue)", explanation: "orElse returns value or default if empty." },
    ],
  },
  "file-io": {
    id: "file-io", moduleId: "java-foundations", title: "File I/O", xpReward: 150, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Create Path", difficulty: "medium", prompt: "Create file path!", codeToType: "Path path = Paths.get(\"file.txt\");", explanation: "Paths.get() creates Path object from string." },
      { type: "typing", title: "Read Lines", difficulty: "hard", prompt: "Read all lines!", codeToType: "List<String> lines = Files.readAllLines(path);", explanation: "readAllLines reads entire file into list." },
      { type: "typing", title: "Write File", difficulty: "hard", prompt: "Write to file!", codeToType: "Files.write(path, lines);", explanation: "Files.write() writes list of strings to file." },
      { type: "typing", title: "BufferedReader", difficulty: "hard", prompt: "Create reader!", codeToType: "BufferedReader br = new BufferedReader(new FileReader(file));", explanation: "BufferedReader efficiently reads text files." },
    ],
  },
  "generics": {
    id: "generics", moduleId: "java-foundations", title: "Generics", xpReward: 150, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Generic Class", difficulty: "hard", prompt: "Generic class!", codeToType: "public class Box<T> { }", explanation: "<T> is type parameter - replaced with actual type." },
      { type: "typing", title: "Generic Method", difficulty: "hard", prompt: "Generic method!", codeToType: "public <T> void print(T item) { }", explanation: "<T> before return type declares method's type parameter." },
      { type: "typing", title: "Bounded Type", difficulty: "hard", prompt: "Bounded generic!", codeToType: "public class Box<T extends Number> { }", explanation: "extends bounds: T must be Number or subclass." },
      { type: "typing", title: "Wildcard", difficulty: "hard", prompt: "Wildcard type!", codeToType: "List<? extends Number>", explanation: "? is wildcard - unknown type extending Number." },
    ],
  },
  "concurrency-basics": {
    id: "concurrency-basics", moduleId: "java-foundations", title: "Concurrency Basics", xpReward: 175, category: "Advanced Java",
    steps: [
      { type: "typing", title: "Create Thread", difficulty: "hard", prompt: "Create thread!", codeToType: "Thread t = new Thread(() -> { });", explanation: "Pass Runnable (lambda) to Thread constructor." },
      { type: "typing", title: "Start Thread", difficulty: "hard", prompt: "Start thread!", codeToType: "t.start();", explanation: "start() begins thread execution. Never call run() directly!" },
      { type: "typing", title: "Synchronized", difficulty: "hard", prompt: "Synchronized method!", codeToType: "public synchronized void update() { }", explanation: "synchronized prevents concurrent access - thread safety." },
      { type: "typing", title: "Join Thread", difficulty: "hard", prompt: "Wait for thread!", codeToType: "t.join();", explanation: "join() waits for thread to complete." },
    ],
  },
  "design-patterns-intro": {
    id: "design-patterns-intro", moduleId: "java-foundations", title: "Design Patterns Intro", xpReward: 200, category: "Advanced Java",
    steps: [
      { type: "quiz", title: "Singleton", difficulty: "hard", question: "Singleton ensures?", options: [{ label: "A", text: "Multiple instances" }, { label: "B", text: "Only one instance" }, { label: "C", text: "No instances" }], correctAnswer: "B", explanation: "Singleton: exactly one instance. Global point of access." },
      { type: "quiz", title: "Factory", difficulty: "hard", question: "Factory pattern?", options: [{ label: "A", text: "Creates objects without exposing creation logic" }, { label: "B", text: "Destroys objects" }, { label: "C", text: "Stores objects" }], correctAnswer: "A", explanation: "Factory encapsulates object creation - client doesn't know concrete class." },
      { type: "quiz", title: "Observer", difficulty: "hard", question: "Observer pattern?", options: [{ label: "A", text: "One-to-one" }, { label: "B", text: "One-to-many notification" }, { label: "C", text: "No relationship" }], correctAnswer: "B", explanation: "Observer: when one changes, all dependents are notified." },
      { type: "quiz", title: "Strategy", difficulty: "hard", question: "Strategy pattern?", options: [{ label: "A", text: "Fixed algorithm" }, { label: "B", text: "Interchangeable algorithms" }, { label: "C", text: "No algorithm" }], correctAnswer: "B", explanation: "Strategy: define family of algorithms, make them interchangeable." },
    ],
  },
};

// === ADVANCED AI & DATA SCIENCE ===
export const advancedAILessons: Record<string, LessonData> = {
  "deep-learning-advanced": {
    id: "deep-learning-advanced", moduleId: "ai-data-science", title: "Deep Learning Advanced", xpReward: 200, category: "Deep Learning",
    steps: [
      { type: "quiz", title: "CNN Purpose", difficulty: "hard", question: "CNNs excel at?", options: [{ label: "A", text: "Text processing" }, { label: "B", text: "Image recognition" }, { label: "C", text: "Audio only" }], correctAnswer: "B", explanation: "Convolutional Neural Networks detect spatial patterns - perfect for images!" },
      { type: "quiz", title: "RNN Purpose", difficulty: "hard", question: "RNNs are for?", options: [{ label: "A", text: "Static images" }, { label: "B", text: "Sequential data" }, { label: "C", text: "Classification only" }], correctAnswer: "B", explanation: "Recurrent Neural Networks process sequences - text, time series, speech!" },
      { type: "quiz", title: "Transformer", difficulty: "hard", question: "Transformers use?", options: [{ label: "A", text: "Recurrence" }, { label: "B", text: "Attention mechanism" }, { label: "C", text: "Convolution only" }], correctAnswer: "B", explanation: "Transformers use attention to process all tokens in parallel - powers GPT, BERT!" },
      { type: "quiz", title: "Overfitting", difficulty: "hard", question: "Overfitting means?", options: [{ label: "A", text: "Model learns training data too well" }, { label: "B", text: "Model can't learn" }, { label: "C", text: "Model is perfect" }], correctAnswer: "A", explanation: "Overfit = memorizes training data, fails on new data. Use regularization!" },
    ],
  },
  "feature-engineering": {
    id: "feature-engineering", moduleId: "ai-data-science", title: "Feature Engineering", xpReward: 175, category: "Data Pipeline",
    steps: [
      { type: "quiz", title: "Feature Definition", difficulty: "medium", question: "Features are?", options: [{ label: "A", text: "Model outputs" }, { label: "B", text: "Input variables for model" }, { label: "C", text: "Training errors" }], correctAnswer: "B", explanation: "Features are measurable properties used as model inputs!" },
      { type: "quiz", title: "One-Hot Encoding", difficulty: "hard", question: "One-hot encoding for?", options: [{ label: "A", text: "Numeric data" }, { label: "B", text: "Categorical data" }, { label: "C", text: "Missing values" }], correctAnswer: "B", explanation: "Convert categories to binary columns: Red→[1,0,0], Blue→[0,1,0]!" },
      { type: "quiz", title: "Feature Selection", difficulty: "hard", question: "Feature selection removes?", options: [{ label: "A", text: "All features" }, { label: "B", text: "Irrelevant/redundant features" }, { label: "C", text: "Training data" }], correctAnswer: "B", explanation: "Select most predictive features - reduces noise and overfitting!" },
      { type: "quiz", title: "Dimensionality", difficulty: "hard", question: "PCA reduces?", options: [{ label: "A", text: "Data rows" }, { label: "B", text: "Number of features" }, { label: "C", text: "Training time only" }], correctAnswer: "B", explanation: "Principal Component Analysis reduces dimensions while preserving variance!" },
    ],
  },
  "model-deployment": {
    id: "model-deployment", moduleId: "ai-data-science", title: "Model Deployment", xpReward: 175, category: "Production",
    steps: [
      { type: "quiz", title: "API Serving", difficulty: "hard", question: "Models often deployed as?", options: [{ label: "A", text: "Desktop apps" }, { label: "B", text: "REST APIs" }, { label: "C", text: "Printed reports" }], correctAnswer: "B", explanation: "REST APIs expose model predictions via HTTP endpoints!" },
      { type: "quiz", title: "Model Monitoring", difficulty: "hard", question: "Monitor models for?", options: [{ label: "A", text: "Code style" }, { label: "B", text: "Performance drift" }, { label: "C", text: "Server color" }], correctAnswer: "B", explanation: "Models degrade over time - monitor accuracy, latency, data drift!" },
      { type: "quiz", title: "A/B Testing", difficulty: "hard", question: "A/B testing compares?", options: [{ label: "A", text: "Two models in production" }, { label: "B", text: "Training vs test data" }, { label: "C", text: "Two datasets" }], correctAnswer: "A", explanation: "Route traffic to different models to compare real-world performance!" },
    ],
  },
  "nlp-basics": {
    id: "nlp-basics", moduleId: "ai-data-science", title: "NLP Fundamentals", xpReward: 175, category: "NLP",
    steps: [
      { type: "quiz", title: "NLP Definition", difficulty: "medium", question: "NLP processes?", options: [{ label: "A", text: "Images" }, { label: "B", text: "Human language" }, { label: "C", text: "Numbers only" }], correctAnswer: "B", explanation: "Natural Language Processing: machines understanding/generating text!" },
      { type: "quiz", title: "Tokenization", difficulty: "medium", question: "Tokenization splits text into?", options: [{ label: "A", text: "Sentences only" }, { label: "B", text: "Words or subwords" }, { label: "C", text: "Paragraphs" }], correctAnswer: "B", explanation: "Tokens are basic units - words, subwords, or characters!" },
      { type: "quiz", title: "Embeddings", difficulty: "hard", question: "Word embeddings are?", options: [{ label: "A", text: "Random numbers" }, { label: "B", text: "Dense vector representations" }, { label: "C", text: "Character counts" }], correctAnswer: "B", explanation: "Embeddings capture semantic meaning - similar words have similar vectors!" },
      { type: "quiz", title: "Sentiment", difficulty: "medium", question: "Sentiment analysis detects?", options: [{ label: "A", text: "Grammar errors" }, { label: "B", text: "Positive/negative opinion" }, { label: "C", text: "Language type" }], correctAnswer: "B", explanation: "Classify text as positive, negative, or neutral sentiment!" },
    ],
  },
};

// === ADVANCED CYBERSECURITY ===
export const advancedCybersecurityLessons: Record<string, LessonData> = {
  "penetration-testing": {
    id: "penetration-testing", moduleId: "cybersecurity", title: "Penetration Testing", xpReward: 200, category: "Offensive Security",
    steps: [
      { type: "quiz", title: "Pentest Definition", difficulty: "hard", question: "Penetration testing is?", options: [{ label: "A", text: "Breaking into systems illegally" }, { label: "B", text: "Authorized security testing" }, { label: "C", text: "Installing software" }], correctAnswer: "B", explanation: "Ethical hacking: authorized attempts to find vulnerabilities before attackers do!" },
      { type: "quiz", title: "Phases", difficulty: "hard", question: "First pentest phase?", options: [{ label: "A", text: "Exploitation" }, { label: "B", text: "Reconnaissance" }, { label: "C", text: "Reporting" }], correctAnswer: "B", explanation: "Recon first: gather information about target. Know before you attack!" },
      { type: "quiz", title: "OWASP Top 10", difficulty: "hard", question: "OWASP Top 10 lists?", options: [{ label: "A", text: "Best programming languages" }, { label: "B", text: "Critical web security risks" }, { label: "C", text: "Fast computers" }], correctAnswer: "B", explanation: "OWASP Top 10 = most critical web application security risks!" },
    ],
  },
  "incident-response": {
    id: "incident-response", moduleId: "cybersecurity", title: "Incident Response", xpReward: 175, category: "Defense",
    steps: [
      { type: "quiz", title: "IR Purpose", difficulty: "hard", question: "Incident response is?", options: [{ label: "A", text: "Ignoring breaches" }, { label: "B", text: "Systematic approach to security events" }, { label: "C", text: "Only prevention" }], correctAnswer: "B", explanation: "IR: detect, contain, eradicate, recover from security incidents!" },
      { type: "quiz", title: "IR Phases", difficulty: "hard", question: "First IR phase?", options: [{ label: "A", text: "Eradication" }, { label: "B", text: "Preparation" }, { label: "C", text: "Recovery" }], correctAnswer: "B", explanation: "Preparation: have plans, tools, team ready BEFORE incidents occur!" },
      { type: "quiz", title: "Containment", difficulty: "hard", question: "Containment aims to?", options: [{ label: "A", text: "Delete all data" }, { label: "B", text: "Limit damage spread" }, { label: "C", text: "Ignore threat" }], correctAnswer: "B", explanation: "Contain: isolate affected systems, prevent further spread!" },
    ],
  },
  "security-architecture": {
    id: "security-architecture", moduleId: "cybersecurity", title: "Security Architecture", xpReward: 175, category: "Defense",
    steps: [
      { type: "quiz", title: "Defense in Depth", difficulty: "hard", question: "Defense in depth uses?", options: [{ label: "A", text: "Single strong defense" }, { label: "B", text: "Multiple layers of security" }, { label: "C", text: "No security" }], correctAnswer: "B", explanation: "Layered security: if one fails, others protect. Castle walls analogy!" },
      { type: "quiz", title: "Zero Trust", difficulty: "hard", question: "Zero trust means?", options: [{ label: "A", text: "Trust everyone" }, { label: "B", text: "Never trust, always verify" }, { label: "C", text: "No passwords" }], correctAnswer: "B", explanation: "Verify every request regardless of source - no implicit trust!" },
      { type: "quiz", title: "DMZ", difficulty: "hard", question: "DMZ separates?", options: [{ label: "A", text: "Users from admins" }, { label: "B", text: "Public services from internal network" }, { label: "C", text: "Nothing" }], correctAnswer: "B", explanation: "Demilitarized Zone: buffer between internet and internal network!" },
    ],
  },
};

// === ADVANCED BUSINESS SYSTEMS ===
export const advancedBusinessLessons: Record<string, LessonData> = {
  "data-analytics": {
    id: "data-analytics", moduleId: "business-systems", title: "Business Analytics", xpReward: 175, category: "Analytics",
    steps: [
      { type: "quiz", title: "Descriptive", difficulty: "medium", question: "Descriptive analytics shows?", options: [{ label: "A", text: "Future predictions" }, { label: "B", text: "What happened" }, { label: "C", text: "Why it happened" }], correctAnswer: "B", explanation: "Descriptive: reports, dashboards showing historical data - what happened!" },
      { type: "quiz", title: "Predictive", difficulty: "hard", question: "Predictive analytics?", options: [{ label: "A", text: "Shows past data" }, { label: "B", text: "Forecasts future outcomes" }, { label: "C", text: "Only real-time" }], correctAnswer: "B", explanation: "Predictive uses ML/statistics to forecast - what might happen!" },
      { type: "quiz", title: "Prescriptive", difficulty: "hard", question: "Prescriptive analytics?", options: [{ label: "A", text: "Recommends actions" }, { label: "B", text: "Only describes" }, { label: "C", text: "Ignores data" }], correctAnswer: "A", explanation: "Prescriptive: what should we do? Optimization recommendations!" },
      { type: "quiz", title: "KPI", difficulty: "medium", question: "KPI stands for?", options: [{ label: "A", text: "Key Process Input" }, { label: "B", text: "Key Performance Indicator" }, { label: "C", text: "Knowledge Processing Interface" }], correctAnswer: "B", explanation: "KPIs are metrics that measure progress toward business goals!" },
    ],
  },
  "business-intelligence": {
    id: "business-intelligence", moduleId: "business-systems", title: "Business Intelligence", xpReward: 175, category: "Analytics",
    steps: [
      { type: "quiz", title: "BI Purpose", difficulty: "medium", question: "BI transforms data into?", options: [{ label: "A", text: "More data" }, { label: "B", text: "Actionable insights" }, { label: "C", text: "Code" }], correctAnswer: "B", explanation: "Business Intelligence: turn raw data into meaningful insights for decisions!" },
      { type: "quiz", title: "Data Warehouse", difficulty: "hard", question: "Data warehouse is?", options: [{ label: "A", text: "Real-time database" }, { label: "B", text: "Central repository for analysis" }, { label: "C", text: "Backup storage" }], correctAnswer: "B", explanation: "Data warehouse consolidates data from multiple sources for analysis!" },
      { type: "quiz", title: "ETL", difficulty: "hard", question: "ETL stands for?", options: [{ label: "A", text: "Extract Transform Load" }, { label: "B", text: "Enter Transfer Leave" }, { label: "C", text: "Evaluate Test Launch" }], correctAnswer: "A", explanation: "ETL: extract from sources, transform/clean, load into warehouse!" },
      { type: "quiz", title: "Dashboard", difficulty: "medium", question: "BI dashboards provide?", options: [{ label: "A", text: "Raw SQL queries" }, { label: "B", text: "Visual summary of key metrics" }, { label: "C", text: "Code editor" }], correctAnswer: "B", explanation: "Dashboards visualize KPIs and metrics at a glance!" },
    ],
  },
  "digital-transformation": {
    id: "digital-transformation", moduleId: "business-systems", title: "Digital Transformation", xpReward: 150, category: "Strategy",
    steps: [
      { type: "quiz", title: "Definition", difficulty: "medium", question: "Digital transformation is?", options: [{ label: "A", text: "Buying computers" }, { label: "B", text: "Fundamental change using digital tech" }, { label: "C", text: "Website redesign" }], correctAnswer: "B", explanation: "DX: reimagine business processes, culture, customer experience with tech!" },
      { type: "quiz", title: "Challenges", difficulty: "hard", question: "Biggest DX challenge?", options: [{ label: "A", text: "Technology" }, { label: "B", text: "Culture and change resistance" }, { label: "C", text: "Budget" }], correctAnswer: "B", explanation: "People and culture are hardest to change - not technology!" },
      { type: "quiz", title: "Customer Experience", difficulty: "medium", question: "CX focus means?", options: [{ label: "A", text: "Internal processes only" }, { label: "B", text: "Customer journey optimization" }, { label: "C", text: "Cost cutting" }], correctAnswer: "B", explanation: "Customer Experience: every touchpoint matters. Seamless, personalized!" },
    ],
  },
  "it-governance": {
    id: "it-governance", moduleId: "business-systems", title: "IT Governance", xpReward: 175, category: "Management",
    steps: [
      { type: "quiz", title: "Purpose", difficulty: "hard", question: "IT governance ensures?", options: [{ label: "A", text: "Fastest computers" }, { label: "B", text: "IT supports business goals" }, { label: "C", text: "No IT spending" }], correctAnswer: "B", explanation: "IT governance aligns IT with business strategy and manages risk!" },
      { type: "quiz", title: "COBIT", difficulty: "hard", question: "COBIT is?", options: [{ label: "A", text: "Programming language" }, { label: "B", text: "IT governance framework" }, { label: "C", text: "Database system" }], correctAnswer: "B", explanation: "COBIT: Control Objectives for Information and Related Technologies!" },
      { type: "quiz", title: "ITIL", difficulty: "hard", question: "ITIL covers?", options: [{ label: "A", text: "Hardware repair" }, { label: "B", text: "IT service management" }, { label: "C", text: "Software coding" }], correctAnswer: "B", explanation: "ITIL: best practices for IT service delivery and management!" },
    ],
  },
};

// === GAME DEVELOPMENT ADVANCED ===
export const advancedGameDevLessons: Record<string, LessonData> = {
  "game-architecture": {
    id: "game-architecture", moduleId: "game-development", title: "Game Architecture", xpReward: 175, category: "Architecture",
    steps: [
      { type: "quiz", title: "Game Loop", difficulty: "hard", question: "Game loop does?", options: [{ label: "A", text: "Runs once" }, { label: "B", text: "Continuously: input, update, render" }, { label: "C", text: "Only at startup" }], correctAnswer: "B", explanation: "Game loop: handle input, update game state, render graphics - repeat forever!" },
      { type: "quiz", title: "ECS", difficulty: "hard", question: "Entity-Component-System?", options: [{ label: "A", text: "UI framework" }, { label: "B", text: "Composition over inheritance pattern" }, { label: "C", text: "Database design" }], correctAnswer: "B", explanation: "ECS: entities are IDs, components are data, systems are logic. Flexible!" },
      { type: "quiz", title: "State Machine", difficulty: "hard", question: "State machines manage?", options: [{ label: "A", text: "File storage" }, { label: "B", text: "Game/character states" }, { label: "C", text: "Network" }], correctAnswer: "B", explanation: "States: idle, walking, attacking. Clear transitions between behaviors!" },
    ],
  },
  "physics-systems": {
    id: "physics-systems", moduleId: "game-development", title: "Physics Systems", xpReward: 175, category: "Physics",
    steps: [
      { type: "quiz", title: "Collision Detection", difficulty: "hard", question: "AABB collision checks?", options: [{ label: "A", text: "Pixel-perfect overlap" }, { label: "B", text: "Bounding box overlap" }, { label: "C", text: "Distance only" }], correctAnswer: "B", explanation: "Axis-Aligned Bounding Box: simple rectangle overlap check. Fast!" },
      { type: "quiz", title: "Rigid Body", difficulty: "hard", question: "Rigid body simulates?", options: [{ label: "A", text: "Soft materials" }, { label: "B", text: "Solid object physics" }, { label: "C", text: "Particles only" }], correctAnswer: "B", explanation: "Rigid bodies: mass, velocity, forces. Realistic movement!" },
      { type: "quiz", title: "Raycasting", difficulty: "hard", question: "Raycasting shoots?", options: [{ label: "A", text: "Bullets" }, { label: "B", text: "Invisible line to detect hits" }, { label: "C", text: "Sound waves" }], correctAnswer: "B", explanation: "Raycast: project line to detect what it hits. Aiming, line of sight!" },
    ],
  },
  "ai-for-games": {
    id: "ai-for-games", moduleId: "game-development", title: "Game AI", xpReward: 175, category: "AI",
    steps: [
      { type: "quiz", title: "Pathfinding", difficulty: "hard", question: "A* algorithm finds?", options: [{ label: "A", text: "Random path" }, { label: "B", text: "Optimal path using heuristics" }, { label: "C", text: "Longest path" }], correctAnswer: "B", explanation: "A* combines distance traveled + estimated distance. Optimal pathfinding!" },
      { type: "quiz", title: "Behavior Trees", difficulty: "hard", question: "Behavior trees for?", options: [{ label: "A", text: "Rendering" }, { label: "B", text: "AI decision making" }, { label: "C", text: "Audio" }], correctAnswer: "B", explanation: "Behavior trees: modular, reusable AI behaviors. Selector, sequence nodes!" },
      { type: "quiz", title: "Steering", difficulty: "hard", question: "Steering behaviors include?", options: [{ label: "A", text: "Seek, flee, wander" }, { label: "B", text: "Only straight lines" }, { label: "C", text: "Teleporting" }], correctAnswer: "A", explanation: "Steering: seek target, flee from threats, wander randomly. Natural movement!" },
    ],
  },
  "multiplayer-basics": {
    id: "multiplayer-basics", moduleId: "game-development", title: "Multiplayer Basics", xpReward: 200, category: "Networking",
    steps: [
      { type: "quiz", title: "Client-Server", difficulty: "hard", question: "Client-server model?", options: [{ label: "A", text: "All players equal" }, { label: "B", text: "Server is authority" }, { label: "C", text: "No networking" }], correctAnswer: "B", explanation: "Server validates game state - prevents cheating, syncs all clients!" },
      { type: "quiz", title: "Lag Compensation", difficulty: "hard", question: "Lag compensation handles?", options: [{ label: "A", text: "Graphics rendering" }, { label: "B", text: "Network delay" }, { label: "C", text: "AI behavior" }], correctAnswer: "B", explanation: "Predict, interpolate to mask network latency. Smooth experience!" },
      { type: "quiz", title: "Netcode", difficulty: "hard", question: "Good netcode minimizes?", options: [{ label: "A", text: "Graphics quality" }, { label: "B", text: "Perceived latency" }, { label: "C", text: "Player count" }], correctAnswer: "B", explanation: "Netcode: prediction, rollback, interpolation for responsive feel!" },
    ],
  },
};

// Combine all expanded lessons
export const allExpandedLessons = {
  ...systemsAnalysisLessons,
  ...mathsExpandedLessons,
  ...codeDrillingLessons,
  ...advancedJavaLessons,
  ...advancedAILessons,
  ...advancedCybersecurityLessons,
  ...advancedBusinessLessons,
  ...advancedGameDevLessons,
};
