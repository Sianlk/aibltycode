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
};

// Combine all expanded lessons
export const allExpandedLessons = {
  ...systemsAnalysisLessons,
  ...mathsExpandedLessons,
  ...codeDrillingLessons,
};
