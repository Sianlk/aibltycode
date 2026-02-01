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
    { id: "requirements", title: "Gathering Requirements", description: "Functional and non-functional", icon: "📋", xpReward: 100 },
    { id: "use-cases", title: "Use Cases", description: "Actors and interactions", icon: "🎭", xpReward: 100 },
    { id: "user-stories", title: "User Stories", description: "As a... I want... So that...", icon: "📝", xpReward: 100 },
    { id: "process-modelling", title: "DFD Process Modelling", description: "Data Flow Diagrams", icon: "📊", xpReward: 125 },
    { id: "data-modelling", title: "Data Modelling (ERD)", description: "Entity-Relationship Diagrams", icon: "🔗", xpReward: 125 },
    { id: "class-diagrams", title: "Class Diagrams (UML)", description: "Classes, attributes, methods", icon: "🏛️", xpReward: 150 },
    { id: "gantt-charts", title: "Gantt Charts", description: "Project timelines and dependencies", icon: "📅", xpReward: 125 },
    { id: "kanban-trello", title: "Kanban & Trello", description: "Visual workflow boards", icon: "📌", xpReward: 100 },
    { id: "project-planning", title: "Project Planning Tools", description: "WBS, PERT, risk management", icon: "🗂️", xpReward: 150 },
    { id: "erd-mastery", title: "ERD Design Mastery", description: "Advanced data modelling", icon: "🗄️", xpReward: 175 },
    { id: "use-case-mastery", title: "Use Case Diagrams", description: "Complete diagram mastery", icon: "📐", xpReward: 150 },
    { id: "sdlc-overview", title: "SDLC Overview", description: "Software development lifecycle", icon: "🔄", xpReward: 100 },
    { id: "waterfall-model", title: "Waterfall Model", description: "Sequential phases", icon: "🌊", xpReward: 100 },
    { id: "agile-scrum", title: "Agile & Scrum", description: "Sprints, standups, retrospectives", icon: "🏃", xpReward: 125 },
    { id: "security-basics", title: "Security Fundamentals", description: "Authentication and encryption", icon: "🔐", xpReward: 100 },
    { id: "risk-management", title: "Risk Management", description: "Identify and mitigate risks", icon: "⚠️", xpReward: 100 },
    { id: "compliance", title: "Compliance & GDPR", description: "Data protection regulations", icon: "📜", xpReward: 100 },
    { id: "testing-strategies", title: "Testing Strategies", description: "Unit, integration, UAT", icon: "🧪", xpReward: 125 },
  ],

  // ==================== MATHS FOR COMPUTING ====================
  "math-computing": [
    { id: "number-systems", title: "Number Systems", description: "Decimal, binary, octal, hex", icon: "🔢", xpReward: 75 },
    { id: "binary-arithmetic", title: "Binary Arithmetic", description: "Add, subtract in binary", icon: "➕", xpReward: 100 },
    { id: "hex-conversions", title: "Hex Conversions", description: "Hexadecimal conversions", icon: "🔷", xpReward: 100 },
    { id: "logic-gates", title: "Logic Gates", description: "AND, OR, NOT, XOR, NAND", icon: "🚦", xpReward: 100 },
    { id: "truth-tables", title: "Truth Tables", description: "Boolean expressions", icon: "📋", xpReward: 100 },
    { id: "boolean-algebra", title: "Boolean Algebra", description: "De Morgan's laws and simplification", icon: "🔣", xpReward: 125 },
    { id: "sets-basics", title: "Sets & Operations", description: "Union, intersection, complement", icon: "⭕", xpReward: 100 },
    { id: "venn-diagrams", title: "Venn Diagrams", description: "Visualizing sets", icon: "🔗", xpReward: 75 },
    { id: "probability-basics", title: "Probability Basics", description: "Events and outcomes", icon: "🎲", xpReward: 100 },
    { id: "conditional-probability", title: "Conditional Probability", description: "P(A|B) and Bayes theorem", icon: "🔮", xpReward: 125 },
    { id: "graphs-intro", title: "Graph Theory", description: "Vertices, edges, directed graphs", icon: "🌳", xpReward: 125 },
    { id: "trees-basics", title: "Tree Structures", description: "Binary trees, BST", icon: "🌲", xpReward: 125 },
    { id: "graph-algorithms", title: "Graph Algorithms", description: "BFS, DFS, Dijkstra", icon: "🗺️", xpReward: 150 },
    { id: "big-o-intro", title: "Big-O Notation", description: "Time complexity basics", icon: "⏱️", xpReward: 150 },
    { id: "complexity-comparison", title: "Complexity Comparison", description: "O(1), O(n), O(n²), O(log n)", icon: "📈", xpReward: 150 },
    { id: "functions-math", title: "Functions", description: "Domain, range, composition", icon: "📐", xpReward: 100 },
    { id: "algebra-basics", title: "Algebra Fundamentals", description: "Variables, equations, PEMDAS", icon: "🔡", xpReward: 75 },
    { id: "matrices-basics", title: "Matrices", description: "Matrix operations and identity", icon: "🔲", xpReward: 125 },
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

  // ==================== COMPUTER SYSTEMS & NETWORKING ====================
  "computer-systems": [
    // Week 1: Introduction to Personal Computer & Hardware
    { id: "pc-intro", title: "Introduction to Personal Computers", description: "History and evolution of PCs", icon: "🖥️", xpReward: 50 },
    { id: "pc-components", title: "PC Components Overview", description: "Motherboard, CPU, RAM, storage", icon: "🔧", xpReward: 75 },
    { id: "input-devices", title: "Input Devices", description: "Keyboards, mice, touchscreens", icon: "⌨️", xpReward: 75 },
    { id: "output-devices", title: "Output Devices", description: "Monitors, printers, speakers", icon: "🖨️", xpReward: 75 },
    { id: "storage-devices", title: "Storage Technologies", description: "HDD, SSD, optical, flash", icon: "💾", xpReward: 100 },
    { id: "motherboard-anatomy", title: "Motherboard Anatomy", description: "Chipsets, buses, expansion slots", icon: "🔌", xpReward: 100 },
    { id: "power-supply", title: "Power Supply Units", description: "PSU ratings, connectors, efficiency", icon: "⚡", xpReward: 100 },
    
    // Week 2: Microprocessor Architecture
    { id: "cpu-fundamentals", title: "CPU Fundamentals", description: "ALU, control unit, registers", icon: "🧠", xpReward: 125 },
    { id: "instruction-cycle", title: "Instruction Cycle", description: "Fetch-decode-execute cycle", icon: "🔄", xpReward: 125 },
    { id: "cpu-registers", title: "CPU Registers", description: "General purpose, special purpose", icon: "📊", xpReward: 125 },
    { id: "addressing-modes", title: "Addressing Modes", description: "Immediate, direct, indirect", icon: "📍", xpReward: 150 },
    { id: "pipelining", title: "Pipelining", description: "Instruction-level parallelism", icon: "🚀", xpReward: 150 },
    { id: "cache-memory", title: "Cache Memory", description: "L1, L2, L3 cache hierarchy", icon: "💨", xpReward: 150 },
    { id: "risc-vs-cisc", title: "RISC vs CISC", description: "Architecture comparison", icon: "⚖️", xpReward: 150 },
    
    // Little Man Computer
    { id: "lmc-intro", title: "Little Man Computer Intro", description: "Understanding LMC model", icon: "👨‍💼", xpReward: 100 },
    { id: "lmc-instructions", title: "LMC Instructions", description: "ADD, SUB, STA, LDA, BRP, BRZ", icon: "📝", xpReward: 125 },
    { id: "lmc-programming", title: "LMC Programming", description: "Writing simple programs", icon: "💻", xpReward: 150 },
    { id: "lmc-loops", title: "LMC Loops & Branching", description: "Control flow in LMC", icon: "🔁", xpReward: 150 },
    { id: "lmc-io", title: "LMC Input/Output", description: "INP and OUT operations", icon: "📤", xpReward: 125 },
    
    // Operating Systems
    { id: "os-intro", title: "Introduction to OS", description: "What operating systems do", icon: "🖥️", xpReward: 75 },
    { id: "os-types", title: "Types of Operating Systems", description: "Batch, time-sharing, real-time", icon: "📋", xpReward: 100 },
    { id: "process-management", title: "Process Management", description: "Process states and scheduling", icon: "⚙️", xpReward: 125 },
    { id: "memory-management", title: "Memory Management", description: "Paging, segmentation, virtual memory", icon: "🧩", xpReward: 150 },
    { id: "file-systems", title: "File Systems", description: "FAT, NTFS, ext4 structures", icon: "📁", xpReward: 125 },
    { id: "device-drivers", title: "Device Drivers", description: "Hardware abstraction layer", icon: "🔗", xpReward: 125 },
    
    // Number Systems (Extended)
    { id: "decimal-system", title: "Decimal Number System", description: "Base-10 fundamentals", icon: "🔢", xpReward: 50 },
    { id: "binary-system", title: "Binary Number System", description: "Base-2 representation", icon: "0️⃣", xpReward: 75 },
    { id: "octal-system", title: "Octal Number System", description: "Base-8 representation", icon: "8️⃣", xpReward: 75 },
    { id: "hexadecimal-system", title: "Hexadecimal System", description: "Base-16 representation", icon: "🔷", xpReward: 75 },
    { id: "number-conversions", title: "Number Conversions", description: "Converting between bases", icon: "🔄", xpReward: 100 },
    { id: "binary-arithmetic-extended", title: "Binary Arithmetic", description: "Addition, subtraction, multiplication", icon: "➕", xpReward: 125 },
    { id: "twos-complement", title: "Two's Complement", description: "Signed number representation", icon: "➖", xpReward: 125 },
    { id: "floating-point", title: "Floating Point Numbers", description: "IEEE 754 standard", icon: "🎯", xpReward: 150 },
    
    // Network Fundamentals
    { id: "network-intro", title: "Network Fundamentals", description: "What are computer networks?", icon: "🌐", xpReward: 75 },
    { id: "network-types", title: "Types of Networks", description: "LAN, WAN, MAN, PAN", icon: "🔗", xpReward: 100 },
    { id: "network-topologies", title: "Network Topologies", description: "Star, bus, ring, mesh", icon: "🕸️", xpReward: 100 },
    { id: "transmission-media", title: "Transmission Media", description: "Twisted pair, fiber, wireless", icon: "📡", xpReward: 100 },
    { id: "network-devices", title: "Network Devices", description: "Hubs, switches, routers", icon: "📶", xpReward: 125 },
    
    // Network Protocols and Models
    { id: "osi-model", title: "OSI Model", description: "7 layers explained", icon: "📚", xpReward: 150 },
    { id: "osi-physical", title: "Physical Layer", description: "Bits and transmission", icon: "⚡", xpReward: 100 },
    { id: "osi-datalink", title: "Data Link Layer", description: "Frames and MAC addresses", icon: "🔗", xpReward: 125 },
    { id: "osi-network", title: "Network Layer", description: "Routing and IP addressing", icon: "🗺️", xpReward: 125 },
    { id: "osi-transport", title: "Transport Layer", description: "TCP and UDP protocols", icon: "🚚", xpReward: 125 },
    { id: "osi-upper", title: "Upper Layers", description: "Session, presentation, application", icon: "📱", xpReward: 125 },
    { id: "tcp-ip-model", title: "TCP/IP Model", description: "4-layer practical model", icon: "🌍", xpReward: 150 },
    { id: "tcp-vs-udp", title: "TCP vs UDP", description: "Connection-oriented vs connectionless", icon: "⚖️", xpReward: 125 },
    
    // IPv4 Addressing
    { id: "ipv4-intro", title: "IPv4 Addressing Basics", description: "32-bit address structure", icon: "🏷️", xpReward: 100 },
    { id: "ip-classes", title: "IP Address Classes", description: "Class A, B, C, D, E", icon: "📊", xpReward: 125 },
    { id: "public-private-ip", title: "Public vs Private IPs", description: "RFC 1918 addresses", icon: "🔐", xpReward: 100 },
    { id: "subnet-masks", title: "Subnet Masks", description: "Network and host portions", icon: "🎭", xpReward: 125 },
    { id: "default-gateways", title: "Default Gateways", description: "Router interfaces", icon: "🚪", xpReward: 100 },
    
    // Subnetting
    { id: "subnetting-intro", title: "Introduction to Subnetting", description: "Why subnet networks?", icon: "✂️", xpReward: 125 },
    { id: "cidr-notation", title: "CIDR Notation", description: "Classless addressing", icon: "📝", xpReward: 125 },
    { id: "subnet-calculation", title: "Subnet Calculations", description: "Network, broadcast, hosts", icon: "🔢", xpReward: 150 },
    { id: "vlsm", title: "VLSM", description: "Variable length subnet masks", icon: "📐", xpReward: 175 },
    { id: "supernetting", title: "Supernetting", description: "Route aggregation", icon: "🔗", xpReward: 150 },
    { id: "subnet-practice", title: "Subnetting Practice", description: "Real-world scenarios", icon: "🎯", xpReward: 175 },
    
    // Network Access & Ethernet
    { id: "ethernet-intro", title: "Ethernet Fundamentals", description: "IEEE 802.3 standard", icon: "🔌", xpReward: 100 },
    { id: "mac-addresses", title: "MAC Addresses", description: "48-bit physical addresses", icon: "🏷️", xpReward: 100 },
    { id: "ethernet-frames", title: "Ethernet Frame Structure", description: "Headers, payload, FCS", icon: "📦", xpReward: 125 },
    { id: "csma-cd", title: "CSMA/CD", description: "Collision detection", icon: "💥", xpReward: 125 },
    { id: "ethernet-speeds", title: "Ethernet Standards", description: "10/100/1000 Mbps, 10 GbE", icon: "🚀", xpReward: 100 },
    { id: "switching", title: "Ethernet Switching", description: "Switch operation and MAC tables", icon: "🔀", xpReward: 150 },
    { id: "vlans", title: "VLANs", description: "Virtual LANs and trunking", icon: "🏘️", xpReward: 150 },
    { id: "arp-protocol", title: "ARP Protocol", description: "Address Resolution Protocol", icon: "🔍", xpReward: 125 },
  ],

  // ==================== WEB TECHNOLOGIES ====================
  "web-technologies": [
    // Introduction
    { id: "web-intro", title: "Introduction to Web Technologies", description: "How the web works", icon: "🌐", xpReward: 50 },
    { id: "web-architecture", title: "Web Architecture", description: "Client-server model", icon: "🏗️", xpReward: 75 },
    { id: "http-basics", title: "HTTP Protocol", description: "Requests, responses, methods", icon: "📡", xpReward: 100 },
    { id: "web-browsers", title: "Web Browsers", description: "Rendering engines, DevTools", icon: "🔍", xpReward: 75 },
    
    // Essential HTML
    { id: "html-intro", title: "HTML Introduction", description: "Markup language basics", icon: "📄", xpReward: 50 },
    { id: "html-structure", title: "HTML Document Structure", description: "DOCTYPE, head, body", icon: "🏛️", xpReward: 75 },
    { id: "html-text", title: "Text Elements", description: "Headings, paragraphs, formatting", icon: "📝", xpReward: 75 },
    { id: "html-links", title: "Hyperlinks", description: "Anchor tags and navigation", icon: "🔗", xpReward: 75 },
    { id: "html-images", title: "Images & Media", description: "img, video, audio elements", icon: "🖼️", xpReward: 100 },
    { id: "html-lists", title: "Lists", description: "Ordered, unordered, definition", icon: "📋", xpReward: 75 },
    { id: "html-tables", title: "Tables", description: "Rows, columns, spanning", icon: "📊", xpReward: 100 },
    
    // Introduction to CSS
    { id: "css-intro", title: "CSS Introduction", description: "Styling web pages", icon: "🎨", xpReward: 50 },
    { id: "css-selectors", title: "CSS Selectors", description: "Element, class, ID selectors", icon: "🎯", xpReward: 75 },
    { id: "css-colors", title: "Colors & Backgrounds", description: "Color values and gradients", icon: "🌈", xpReward: 75 },
    { id: "css-text", title: "Text Styling", description: "Fonts, sizes, alignment", icon: "✒️", xpReward: 75 },
    { id: "css-box-model", title: "The Box Model", description: "Margin, border, padding", icon: "📦", xpReward: 100 },
    { id: "css-display", title: "Display Property", description: "Block, inline, flex, grid", icon: "🖥️", xpReward: 100 },
    
    // Modelling Websites
    { id: "web-planning", title: "Website Planning", description: "Goals, audience, content", icon: "📋", xpReward: 75 },
    { id: "wireframing", title: "Wireframing", description: "Low-fidelity design sketches", icon: "✏️", xpReward: 100 },
    { id: "site-maps", title: "Site Maps", description: "Information architecture", icon: "🗺️", xpReward: 100 },
    { id: "user-flows", title: "User Flows", description: "Navigation and journeys", icon: "🔄", xpReward: 100 },
    { id: "mockups", title: "Mockups & Prototypes", description: "High-fidelity designs", icon: "🎨", xpReward: 125 },
    
    // Advanced HTML
    { id: "html-forms", title: "HTML Forms", description: "Input types and validation", icon: "📝", xpReward: 125 },
    { id: "form-elements", title: "Form Elements", description: "Select, textarea, buttons", icon: "🔘", xpReward: 100 },
    { id: "html-semantic", title: "Semantic HTML", description: "header, nav, article, section", icon: "🏗️", xpReward: 125 },
    { id: "html5-apis", title: "HTML5 APIs", description: "Geolocation, storage, canvas", icon: "🚀", xpReward: 150 },
    { id: "html-multimedia", title: "Multimedia Elements", description: "Video, audio, embedding", icon: "🎬", xpReward: 125 },
    { id: "svg-basics", title: "SVG Basics", description: "Scalable vector graphics", icon: "📐", xpReward: 125 },
    
    // Advanced HTML Part 2
    { id: "html-meta", title: "Meta Tags & SEO", description: "Title, description, keywords", icon: "🔍", xpReward: 100 },
    { id: "html-responsive", title: "Responsive Images", description: "srcset and picture element", icon: "📱", xpReward: 125 },
    { id: "html-iframes", title: "Iframes & Embedding", description: "Embedding external content", icon: "🖼️", xpReward: 100 },
    { id: "html-data-attrs", title: "Data Attributes", description: "Custom data-* attributes", icon: "📊", xpReward: 100 },
    { id: "html-templates", title: "Template Element", description: "Reusable HTML templates", icon: "📄", xpReward: 125 },
    
    // Advanced CSS
    { id: "css-flexbox", title: "Flexbox Layout", description: "Flexible box model", icon: "📦", xpReward: 150 },
    { id: "css-grid", title: "CSS Grid", description: "Two-dimensional layouts", icon: "🔲", xpReward: 175 },
    { id: "css-positioning", title: "Positioning", description: "Static, relative, absolute, fixed", icon: "📍", xpReward: 125 },
    { id: "css-responsive", title: "Responsive Design", description: "Media queries and breakpoints", icon: "📱", xpReward: 150 },
    { id: "css-animations", title: "CSS Animations", description: "Transitions and keyframes", icon: "🎬", xpReward: 150 },
    { id: "css-transforms", title: "Transforms", description: "Rotate, scale, translate", icon: "🔄", xpReward: 125 },
    { id: "css-variables", title: "CSS Variables", description: "Custom properties", icon: "📝", xpReward: 125 },
    { id: "css-pseudo", title: "Pseudo-classes & Elements", description: ":hover, ::before, ::after", icon: "🎭", xpReward: 125 },
    
    // Client-Side Scripting
    { id: "js-intro", title: "JavaScript Introduction", description: "Programming for the web", icon: "⚡", xpReward: 75 },
    { id: "js-variables", title: "Variables & Data Types", description: "let, const, types", icon: "📦", xpReward: 75 },
    { id: "js-operators", title: "Operators & Expressions", description: "Arithmetic, comparison, logical", icon: "➕", xpReward: 75 },
    { id: "js-control-flow", title: "Control Flow", description: "if/else, switch, loops", icon: "🔀", xpReward: 100 },
    { id: "js-functions", title: "Functions", description: "Declaration, expression, arrow", icon: "🔧", xpReward: 100 },
    { id: "js-arrays", title: "Arrays", description: "Methods and iteration", icon: "📚", xpReward: 125 },
    { id: "js-objects", title: "Objects", description: "Properties and methods", icon: "📋", xpReward: 125 },
    
    // Advanced Client-Side Scripting
    { id: "dom-intro", title: "The DOM", description: "Document Object Model", icon: "🌳", xpReward: 100 },
    { id: "dom-selection", title: "DOM Selection", description: "querySelector, getElementById", icon: "🎯", xpReward: 100 },
    { id: "dom-manipulation", title: "DOM Manipulation", description: "Creating and modifying elements", icon: "🔧", xpReward: 125 },
    { id: "js-events", title: "Event Handling", description: "Click, submit, keyboard events", icon: "👆", xpReward: 125 },
    { id: "js-async", title: "Async JavaScript", description: "Callbacks, promises, async/await", icon: "⏳", xpReward: 175 },
    { id: "fetch-api", title: "Fetch API", description: "Making HTTP requests", icon: "📡", xpReward: 150 },
    { id: "json-handling", title: "JSON Handling", description: "Parse and stringify", icon: "📄", xpReward: 100 },
    { id: "local-storage", title: "Local Storage", description: "Client-side data persistence", icon: "💾", xpReward: 125 },
    { id: "form-validation", title: "Form Validation", description: "Client-side validation", icon: "✅", xpReward: 125 },
    
    // Accessibility, Compatibility, Security
    { id: "web-accessibility", title: "Web Accessibility", description: "WCAG guidelines and ARIA", icon: "♿", xpReward: 125 },
    { id: "screen-readers", title: "Screen Reader Support", description: "Alt text, labels, landmarks", icon: "👁️", xpReward: 125 },
    { id: "keyboard-nav", title: "Keyboard Navigation", description: "Focus management, tab order", icon: "⌨️", xpReward: 100 },
    { id: "cross-browser", title: "Cross-Browser Compatibility", description: "Testing and polyfills", icon: "🌐", xpReward: 125 },
    { id: "web-security", title: "Web Security Basics", description: "XSS, CSRF, HTTPS", icon: "🔐", xpReward: 150 },
    { id: "content-security", title: "Content Security Policy", description: "CSP headers and directives", icon: "🛡️", xpReward: 150 },
    { id: "secure-forms", title: "Secure Form Handling", description: "Input sanitization", icon: "🔒", xpReward: 125 },
    
    // Maintaining and Promoting
    { id: "seo-fundamentals", title: "SEO Fundamentals", description: "Search engine optimization", icon: "🔍", xpReward: 125 },
    { id: "analytics", title: "Web Analytics", description: "Tracking and measuring", icon: "📊", xpReward: 100 },
    { id: "performance", title: "Performance Optimization", description: "Loading speed and caching", icon: "🚀", xpReward: 150 },
    { id: "version-control", title: "Version Control for Web", description: "Git basics for web projects", icon: "📚", xpReward: 125 },
    { id: "deployment", title: "Web Deployment", description: "Hosting and domain setup", icon: "🌐", xpReward: 125 },
    { id: "maintenance", title: "Website Maintenance", description: "Updates, backups, monitoring", icon: "🔧", xpReward: 100 },
    
    // Review and Best Practices
    { id: "html-best-practices", title: "HTML Best Practices", description: "Clean, semantic markup", icon: "✨", xpReward: 100 },
    { id: "css-best-practices", title: "CSS Best Practices", description: "Maintainable stylesheets", icon: "🎨", xpReward: 100 },
    { id: "js-best-practices", title: "JavaScript Best Practices", description: "Clean, efficient code", icon: "💡", xpReward: 100 },
    { id: "code-organization", title: "Code Organization", description: "File structure and naming", icon: "📁", xpReward: 100 },
    { id: "testing-debugging", title: "Testing & Debugging", description: "DevTools and testing strategies", icon: "🔍", xpReward: 125 },
    { id: "progressive-enhancement", title: "Progressive Enhancement", description: "Building resilient websites", icon: "📈", xpReward: 125 },
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
  "computer-systems": { title: "Computer Systems & Networking", icon: "🖧" },
  "web-technologies": { title: "Web Technologies", icon: "🌐" },
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
