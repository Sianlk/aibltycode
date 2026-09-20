import type { TopicRecord } from "./topicKnowledge";

const items = [
  [
    "lambda-expressions",
    "Lambda Expressions",
    "Functional programming"
  ],
  [
    "what-is-system",
    "What is a System?",
    "Boundaries, components, environment"
  ],
  [
    "systems-thinking",
    "Systems Thinking",
    "Holistic view and emergence"
  ],
  [
    "stakeholders",
    "Finding Stakeholders",
    "Identify all affected parties"
  ],
  [
    "requirements",
    "Requirements Gathering",
    "Functional and non-functional"
  ],
  [
    "use-cases",
    "Use Case Basics",
    "Actors and interactions"
  ],
  [
    "user-stories",
    "User Stories",
    "As a... I want... So that..."
  ],
  [
    "normalization",
    "Normalization",
    "1NF, 2NF, 3NF"
  ],
  [
    "class-diagrams",
    "Class Diagrams Intro",
    "Classes, attributes, methods"
  ],
  [
    "gantt-charts",
    "Gantt Charts",
    "Project timelines"
  ],
  [
    "sdlc-overview",
    "SDLC Overview",
    "Software development lifecycle"
  ],
  [
    "waterfall-model",
    "Waterfall Model",
    "Sequential phases"
  ],
  [
    "agile-intro",
    "Agile Principles",
    "Agile manifesto values"
  ],
  [
    "scrum-framework",
    "Scrum Framework",
    "Roles, events, artifacts"
  ],
  [
    "risk-management",
    "Risk Management",
    "Identify and mitigate risks"
  ],
  [
    "testing-strategies",
    "Testing Strategies",
    "Unit, integration, UAT"
  ],
  [
    "number-systems",
    "Number Systems Overview",
    "Decimal, binary, octal, hex"
  ],
  [
    "binary-arithmetic",
    "Binary Addition",
    "Adding binary numbers"
  ],
  [
    "hex-conversions",
    "Hex Conversions",
    "Hexadecimal conversions"
  ],
  [
    "logic-gates",
    "Logic Gates Intro",
    "Digital logic fundamentals"
  ],
  [
    "boolean-algebra",
    "Boolean Algebra Basics",
    "Laws and identities"
  ],
  [
    "sets-basics",
    "Sets Introduction",
    "Set notation and membership"
  ],
  [
    "probability-basics",
    "Probability Basics",
    "Events and outcomes"
  ],
  [
    "graphs-intro",
    "Graph Theory Intro",
    "Vertices, edges, notation"
  ],
  [
    "big-o-intro",
    "Big-O Notation",
    "Time complexity basics"
  ],
  [
    "cia-triad",
    "CIA Triad",
    "Confidentiality, integrity, availability"
  ],
  [
    "social-engineering",
    "Social Engineering",
    "Manipulation techniques"
  ],
  [
    "malware-types",
    "Malware Classification",
    "Viruses, worms, trojans, ransomware"
  ],
  [
    "hashing",
    "Hashing Algorithms",
    "One-way digests for integrity and password protection"
  ],
  [
    "xss-attacks",
    "Cross-Site Scripting (XSS)",
    "Untrusted script execution in a user's browser"
  ],
  [
    "sql-injection",
    "SQL Injection",
    "Unsafe input changing a database query"
  ],
  [
    "incident-response",
    "Incident Response",
    "Prepare, detect, contain, recover and learn"
  ],
  [
    "data-cleaning",
    "Data Cleaning",
    "Missing values, duplicates and outliers"
  ],
  [
    "linear-regression",
    "Linear Regression",
    "Predicting a continuous value with a fitted relationship"
  ],
  [
    "decision-trees",
    "Decision Trees",
    "Tree-based decisions and predictions"
  ],
  [
    "neural-networks",
    "Neural Networks Intro",
    "Connected weighted layers learning patterns"
  ],
  [
    "bis-intro",
    "Business Information Systems",
    "People, process, data and technology supporting work"
  ],
  [
    "digital-transformation",
    "Digital Transformation",
    "Redesigning outcomes through technology and organisational change"
  ],
  [
    "info-system-types",
    "Types of IS",
    "TPS, MIS, DSS and executive systems"
  ],
  [
    "erp-systems",
    "ERP Systems",
    "Integrated enterprise processes and shared data"
  ],
  [
    "it-governance",
    "IT Governance",
    "Decision rights, value, risk and accountability"
  ],
  [
    "input-handling",
    "Input Handling",
    "Keyboard, mouse, touch and gamepad events"
  ],
  [
    "collision-detection",
    "Collision Detection",
    "AABB, circles and polygons detecting contact"
  ]
] as const;

function memoryFor(id:string){
 if(["number-systems","binary-arithmetic","hex-conversions","logic-gates","boolean-algebra","sets-basics","probability-basics","graphs-intro","big-o-intro"].includes(id)) return {a:"Like solving a puzzle: define the symbols, follow one rule at a time, then check the result.",m:"DEFINE, WORK, VERIFY",e:"Write the known values → apply one rule → test with a small example"};
 if(["cia-triad","social-engineering","malware-types","hashing","xss-attacks","sql-injection","incident-response"].includes(id)) return {a:"Like protecting a building: understand the asset, the threat, the control and the evidence.",m:"ASSET, THREAT, CONTROL, CHECK",e:"Name the asset → model the attack → apply layered defence → verify logs and tests"};
 if(["data-cleaning","linear-regression","decision-trees","neural-networks"].includes(id)) return {a:"Like teaching from examples: clean evidence and honest evaluation matter more than impressive claims.",m:"DATA, MODEL, TEST, EXPLAIN",e:"Inspect data → build a baseline → test unseen cases → explain errors and limits"};
 if(["input-handling","collision-detection"].includes(id)) return {a:"Like a referee watching a game: detect an event, apply the rule, then update the world.",m:"DETECT, DECIDE, UPDATE",e:"Read input/state → apply rule → update once → test edge cases"};
 return {a:"Like planning a journey: agree the destination, map the parts, follow the method and verify arrival.",m:"PURPOSE, PARTS, PROCESS, PROOF",e:"Define the goal → identify people and parts → apply the method → test the outcome"};
}

export const legacyGapTopics: Record<string,TopicRecord> = Object.fromEntries(items.map(([id,title,description])=>{
 const x=memoryFor(id);
 const definition=description+". Learn it from its purpose through independent professional application.";
 return [id,[title,definition,x.a,x.m,`${x.e} — ${title}`,`Which statement best explains ${title}?`,definition,"A shortcut that ignores evidence and verification","An unrelated hardware component"] satisfies TopicRecord];
}));
