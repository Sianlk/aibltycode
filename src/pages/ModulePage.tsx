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
    // Week 1: Introduction to Java
    { id: "hello-world", title: "Hello World!", description: "Your first Java program", icon: "🚀", xpReward: 50 },
    { id: "jdk-setup", title: "JDK & IDE Setup", description: "Installing Java development tools", icon: "🔧", xpReward: 50 },
    { id: "java-basics", title: "Java Program Structure", description: "Classes, methods, main()", icon: "📋", xpReward: 75 },
    { id: "comments", title: "Comments & Documentation", description: "Single, multi-line, Javadoc", icon: "📝", xpReward: 50 },
    
    // Week 2: Variables & Data Types
    { id: "variables", title: "Variables & Types", description: "int, String, boolean, double", icon: "📦", xpReward: 75 },
    { id: "data-types", title: "Primitive Types", description: "byte, short, int, long, float, double", icon: "🎨", xpReward: 100 },
    { id: "type-casting", title: "Type Casting", description: "Implicit and explicit conversion", icon: "🔄", xpReward: 100 },
    { id: "constants", title: "Constants & final", description: "Declaring unchangeable values", icon: "🔒", xpReward: 75 },
    { id: "variable-scope", title: "Variable Scope", description: "Local, instance, class variables", icon: "📍", xpReward: 100 },
    
    // Week 3: Operators & Expressions
    { id: "operators", title: "Arithmetic Operators", description: "+, -, *, /, %, ++, --", icon: "➕", xpReward: 100 },
    { id: "comparison-ops", title: "Comparison Operators", description: "==, !=, <, >, <=, >=", icon: "⚖️", xpReward: 100 },
    { id: "logical-ops", title: "Logical Operators", description: "&&, ||, !", icon: "🔀", xpReward: 100 },
    { id: "assignment-ops", title: "Assignment Operators", description: "=, +=, -=, *=, /=", icon: "📥", xpReward: 75 },
    { id: "bitwise-ops", title: "Bitwise Operators", description: "&, |, ^, ~, <<, >>", icon: "🔢", xpReward: 125 },
    { id: "ternary-op", title: "Ternary Operator", description: "condition ? value1 : value2", icon: "❓", xpReward: 100 },
    
    // Week 4: Strings
    { id: "strings", title: "String Basics", description: "Creating and using Strings", icon: "📝", xpReward: 100 },
    { id: "string-methods", title: "String Methods", description: "length, substring, equals, concat", icon: "🔧", xpReward: 100 },
    { id: "string-comparison", title: "String Comparison", description: "equals vs ==", icon: "⚖️", xpReward: 100 },
    { id: "string-builder", title: "StringBuilder", description: "Mutable string operations", icon: "🏗️", xpReward: 125 },
    { id: "string-formatting", title: "String Formatting", description: "printf and format()", icon: "🎨", xpReward: 100 },
    
    // Week 5: Control Flow - Conditionals
    { id: "if-statements", title: "If Statements", description: "Conditional execution", icon: "🔀", xpReward: 100 },
    { id: "else-elseif", title: "Else & Else If", description: "Multiple conditions", icon: "🌟", xpReward: 100 },
    { id: "nested-if", title: "Nested If Statements", description: "Conditions within conditions", icon: "🎯", xpReward: 100 },
    { id: "switch-statements", title: "Switch Statements", description: "Multi-way branching", icon: "🎛️", xpReward: 100 },
    { id: "switch-expressions", title: "Switch Expressions", description: "Modern switch syntax", icon: "✨", xpReward: 125 },
    
    // Week 6: Control Flow - Loops
    { id: "for-loops", title: "For Loops", description: "Counter-controlled iteration", icon: "🔄", xpReward: 125 },
    { id: "while-loops", title: "While Loops", description: "Condition-controlled loops", icon: "🎯", xpReward: 125 },
    { id: "do-while", title: "Do-While Loops", description: "Post-test iteration", icon: "🔁", xpReward: 100 },
    { id: "enhanced-for", title: "Enhanced For Loop", description: "Iterating collections", icon: "📦", xpReward: 125 },
    { id: "break-continue", title: "Break & Continue", description: "Loop control statements", icon: "⏹️", xpReward: 100 },
    { id: "nested-loops", title: "Nested Loops", description: "Loops within loops", icon: "🔲", xpReward: 125 },
    
    // Week 7: Methods
    { id: "methods", title: "Method Basics", description: "Reusable code blocks", icon: "🔧", xpReward: 150 },
    { id: "parameters-return", title: "Parameters & Return", description: "Input and output", icon: "📥", xpReward: 150 },
    { id: "method-overloading", title: "Method Overloading", description: "Same name, different params", icon: "📚", xpReward: 150 },
    { id: "recursion", title: "Recursion", description: "Methods calling themselves", icon: "🔄", xpReward: 175 },
    { id: "varargs", title: "Variable Arguments", description: "Flexible parameter lists", icon: "📋", xpReward: 125 },
    
    // Week 8: Arrays
    { id: "arrays", title: "Array Basics", description: "Fixed-size collections", icon: "📊", xpReward: 150 },
    { id: "array-operations", title: "Array Operations", description: "Traversal and manipulation", icon: "🔧", xpReward: 150 },
    { id: "multidim-arrays", title: "2D Arrays", description: "Matrices and grids", icon: "🔲", xpReward: 150 },
    { id: "array-algorithms", title: "Array Algorithms", description: "Search and sort", icon: "🔍", xpReward: 175 },
    { id: "arrays-class", title: "Arrays Utility Class", description: "java.util.Arrays methods", icon: "🛠️", xpReward: 125 },
    
    // Week 9: ArrayList & Collections Intro
    { id: "arraylist", title: "ArrayList Basics", description: "Dynamic collections", icon: "📝", xpReward: 150 },
    { id: "arraylist-methods", title: "ArrayList Methods", description: "add, remove, get, set", icon: "🔧", xpReward: 150 },
    { id: "wrapper-classes", title: "Wrapper Classes", description: "Integer, Double, Boolean", icon: "📦", xpReward: 125 },
    { id: "autoboxing", title: "Autoboxing", description: "Automatic conversion", icon: "🔄", xpReward: 100 },
    
    // Week 10: OOP - Classes & Objects
    { id: "classes", title: "Classes & Objects", description: "OOP fundamentals", icon: "🏗️", xpReward: 200 },
    { id: "instance-vars", title: "Instance Variables", description: "Object state", icon: "📊", xpReward: 150 },
    { id: "constructors", title: "Constructors", description: "Object initialization", icon: "🔨", xpReward: 175 },
    { id: "constructor-overload", title: "Constructor Overloading", description: "Multiple constructors", icon: "📚", xpReward: 150 },
    { id: "this-keyword", title: "this Keyword", description: "Reference to current object", icon: "👆", xpReward: 125 },
    
    // Week 11: Encapsulation
    { id: "encapsulation", title: "Encapsulation", description: "Data hiding principles", icon: "🔒", xpReward: 175 },
    { id: "access-modifiers", title: "Access Modifiers", description: "public, private, protected", icon: "🚦", xpReward: 175 },
    { id: "getters-setters", title: "Getters & Setters", description: "Accessor and mutator methods", icon: "🔑", xpReward: 150 },
    { id: "static-members", title: "Static Members", description: "Class-level variables/methods", icon: "📌", xpReward: 175 },
    
    // Week 12: Inheritance
    { id: "inheritance", title: "Inheritance Basics", description: "Extending classes", icon: "👨‍👧", xpReward: 200 },
    { id: "super-keyword", title: "super Keyword", description: "Accessing parent class", icon: "⬆️", xpReward: 150 },
    { id: "method-overriding", title: "Method Overriding", description: "Redefining parent methods", icon: "✏️", xpReward: 175 },
    { id: "object-class", title: "Object Class", description: "toString, equals, hashCode", icon: "🔝", xpReward: 150 },
    
    // Week 13: Polymorphism
    { id: "polymorphism", title: "Polymorphism", description: "Many forms, one interface", icon: "🎭", xpReward: 200 },
    { id: "dynamic-binding", title: "Dynamic Binding", description: "Runtime method resolution", icon: "🔗", xpReward: 175 },
    { id: "instanceof-op", title: "instanceof Operator", description: "Type checking", icon: "❓", xpReward: 125 },
    { id: "upcasting-downcasting", title: "Casting Objects", description: "Upcasting and downcasting", icon: "🔄", xpReward: 150 },
    
    // Week 14: Abstract Classes & Interfaces
    { id: "abstract-classes", title: "Abstract Classes", description: "Partial implementation", icon: "🎨", xpReward: 200 },
    { id: "abstract-methods", title: "Abstract Methods", description: "Method declarations without body", icon: "📋", xpReward: 175 },
    { id: "interfaces", title: "Interfaces", description: "Define contracts", icon: "📋", xpReward: 200 },
    { id: "interface-default", title: "Default Methods", description: "Interface implementation", icon: "🔧", xpReward: 150 },
    { id: "multiple-interfaces", title: "Multiple Interfaces", description: "Implementing many interfaces", icon: "📚", xpReward: 175 },
    
    // Week 15: Exception Handling
    { id: "exceptions", title: "Exception Basics", description: "What are exceptions?", icon: "⚠️", xpReward: 175 },
    { id: "try-catch", title: "Try-Catch Blocks", description: "Handling exceptions", icon: "🛡️", xpReward: 175 },
    { id: "multiple-catch", title: "Multiple Catch Blocks", description: "Handling different exceptions", icon: "📚", xpReward: 150 },
    { id: "finally-block", title: "Finally Block", description: "Guaranteed execution", icon: "✅", xpReward: 125 },
    { id: "throw-throws", title: "Throw & Throws", description: "Propagating exceptions", icon: "🎯", xpReward: 175 },
    { id: "custom-exceptions", title: "Custom Exceptions", description: "Creating your own exceptions", icon: "🔧", xpReward: 175 },
    
    // Week 16: File I/O
    { id: "file-io", title: "File I/O Basics", description: "Reading and writing files", icon: "📁", xpReward: 200 },
    { id: "file-class", title: "File Class", description: "File operations and metadata", icon: "📄", xpReward: 150 },
    { id: "buffered-io", title: "Buffered I/O", description: "Efficient file handling", icon: "🚀", xpReward: 175 },
    { id: "serialization", title: "Serialization", description: "Saving objects to files", icon: "💾", xpReward: 200 },
    
    // Week 17: Collections Framework
    { id: "collections", title: "Collections Overview", description: "Collection interfaces", icon: "📚", xpReward: 225 },
    { id: "list-interface", title: "List Interface", description: "ArrayList, LinkedList", icon: "📋", xpReward: 200 },
    { id: "set-interface", title: "Set Interface", description: "HashSet, TreeSet", icon: "🔵", xpReward: 200 },
    { id: "map-interface", title: "Map Interface", description: "HashMap, TreeMap", icon: "🗺️", xpReward: 225 },
    { id: "iterators", title: "Iterators", description: "Traversing collections", icon: "🔄", xpReward: 175 },
    { id: "collections-utility", title: "Collections Utility", description: "Sort, search, shuffle", icon: "🛠️", xpReward: 175 },
    
    // Week 18: Generics
    { id: "generics", title: "Generics Basics", description: "Type-safe collections", icon: "🧬", xpReward: 225 },
    { id: "generic-classes", title: "Generic Classes", description: "Creating generic types", icon: "📦", xpReward: 225 },
    { id: "generic-methods", title: "Generic Methods", description: "Type parameters in methods", icon: "🔧", xpReward: 200 },
    { id: "wildcards", title: "Wildcards", description: "? extends and ? super", icon: "❓", xpReward: 225 },
    
    // Week 19: Streams & Lambda
    { id: "lambda-expressions", title: "Lambda Expressions", description: "Functional programming", icon: "λ", xpReward: 250 },
    { id: "functional-interfaces", title: "Functional Interfaces", description: "Predicate, Consumer, Function", icon: "📋", xpReward: 225 },
    { id: "streams-intro", title: "Streams Introduction", description: "Processing collections", icon: "🌊", xpReward: 250 },
    { id: "stream-operations", title: "Stream Operations", description: "filter, map, reduce", icon: "🔧", xpReward: 250 },
    { id: "collectors", title: "Collectors", description: "Collecting stream results", icon: "📥", xpReward: 225 },
    
    // Week 20: JavaFX & GUI
    { id: "javafx-intro", title: "JavaFX Basics", description: "GUI programming", icon: "🖼️", xpReward: 250 },
    { id: "javafx-controls", title: "JavaFX Controls", description: "Buttons, labels, text fields", icon: "🔘", xpReward: 200 },
    { id: "javafx-layouts", title: "Layout Managers", description: "VBox, HBox, GridPane", icon: "📐", xpReward: 200 },
    { id: "javafx-events", title: "Event Handling", description: "Button clicks, keyboard events", icon: "👆", xpReward: 225 },
    { id: "javafx-css", title: "JavaFX Styling", description: "CSS for JavaFX", icon: "🎨", xpReward: 200 },
  ],


  // ==================== SYSTEMS ANALYSIS ====================
  "systems-analysis": [
    // Week 1: Introduction to Systems
    { id: "what-is-system", title: "What is a System?", description: "Boundaries, components, environment", icon: "🌐", xpReward: 50 },
    { id: "systems-thinking", title: "Systems Thinking", description: "Holistic view and emergence", icon: "🔄", xpReward: 75 },
    { id: "system-types", title: "Types of Systems", description: "Open, closed, deterministic", icon: "📊", xpReward: 75 },
    { id: "system-components", title: "System Components", description: "Input, process, output, feedback", icon: "🔧", xpReward: 75 },
    
    // Week 2: Stakeholders & Requirements
    { id: "stakeholders", title: "Finding Stakeholders", description: "Identify all affected parties", icon: "👥", xpReward: 75 },
    { id: "stakeholder-analysis", title: "Stakeholder Analysis", description: "Power-interest matrix", icon: "📊", xpReward: 100 },
    { id: "requirements", title: "Requirements Gathering", description: "Functional and non-functional", icon: "📋", xpReward: 100 },
    { id: "requirements-elicitation", title: "Elicitation Techniques", description: "Interviews, workshops, observation", icon: "🗣️", xpReward: 125 },
    { id: "requirements-doc", title: "Requirements Documentation", description: "SRS and specification formats", icon: "📄", xpReward: 100 },
    { id: "requirements-validation", title: "Requirements Validation", description: "Review and verification", icon: "✅", xpReward: 100 },
    
    // Week 3: Use Cases & User Stories
    { id: "use-cases", title: "Use Case Basics", description: "Actors and interactions", icon: "🎭", xpReward: 100 },
    { id: "use-case-diagrams", title: "Use Case Diagrams", description: "UML diagram notation", icon: "📐", xpReward: 125 },
    { id: "use-case-descriptions", title: "Use Case Descriptions", description: "Detailed scenario writing", icon: "📝", xpReward: 125 },
    { id: "include-extend", title: "Include & Extend", description: "Relationship stereotypes", icon: "🔗", xpReward: 125 },
    { id: "user-stories", title: "User Stories", description: "As a... I want... So that...", icon: "📝", xpReward: 100 },
    { id: "acceptance-criteria", title: "Acceptance Criteria", description: "Given-When-Then format", icon: "✅", xpReward: 100 },
    { id: "story-mapping", title: "User Story Mapping", description: "Organizing user journeys", icon: "🗺️", xpReward: 125 },
    
    // Week 4: Process Modelling
    { id: "process-modelling", title: "Process Modelling Intro", description: "Understanding workflows", icon: "📊", xpReward: 100 },
    { id: "dfd-intro", title: "Data Flow Diagrams", description: "DFD fundamentals", icon: "🔄", xpReward: 125 },
    { id: "dfd-levels", title: "DFD Levels", description: "Context, Level 0, Level 1", icon: "📊", xpReward: 150 },
    { id: "dfd-symbols", title: "DFD Notation", description: "Processes, stores, flows", icon: "🔷", xpReward: 100 },
    { id: "bpmn-intro", title: "BPMN Basics", description: "Business Process Modelling", icon: "🔶", xpReward: 150 },
    { id: "flowcharts", title: "Flowcharts", description: "Process flow visualization", icon: "📈", xpReward: 100 },
    { id: "swimlane-diagrams", title: "Swimlane Diagrams", description: "Cross-functional processes", icon: "🏊", xpReward: 125 },
    
    // Week 5: Data Modelling
    { id: "data-modelling", title: "Data Modelling Basics", description: "Conceptual, logical, physical", icon: "🔗", xpReward: 125 },
    { id: "erd-intro", title: "ERD Introduction", description: "Entity-Relationship Diagrams", icon: "📊", xpReward: 125 },
    { id: "entities-attributes", title: "Entities & Attributes", description: "Defining data structures", icon: "📦", xpReward: 125 },
    { id: "relationships", title: "Relationships", description: "One-to-one, one-to-many, many-to-many", icon: "🔗", xpReward: 150 },
    { id: "cardinality", title: "Cardinality & Modality", description: "Relationship constraints", icon: "🔢", xpReward: 150 },
    { id: "normalization", title: "Normalization", description: "1NF, 2NF, 3NF", icon: "📐", xpReward: 175 },
    { id: "erd-mastery", title: "ERD Design Mastery", description: "Complex diagram creation", icon: "🗄️", xpReward: 175 },
    
    // Week 6: UML Class Diagrams
    { id: "class-diagrams", title: "Class Diagrams Intro", description: "Classes, attributes, methods", icon: "🏛️", xpReward: 150 },
    { id: "uml-notation", title: "UML Notation", description: "Visibility, types, stereotypes", icon: "📋", xpReward: 125 },
    { id: "class-relationships", title: "Class Relationships", description: "Association, aggregation, composition", icon: "🔗", xpReward: 175 },
    { id: "inheritance-uml", title: "Inheritance in UML", description: "Generalization & specialization", icon: "👨‍👧", xpReward: 150 },
    { id: "interfaces-uml", title: "Interfaces in UML", description: "Abstract classes and interfaces", icon: "📋", xpReward: 150 },
    { id: "design-patterns-intro", title: "Design Patterns Intro", description: "Common UML patterns", icon: "🔧", xpReward: 175 },
    
    // Week 7: Sequence & State Diagrams
    { id: "sequence-diagrams", title: "Sequence Diagrams", description: "Object interactions over time", icon: "⏱️", xpReward: 150 },
    { id: "messages-lifelines", title: "Messages & Lifelines", description: "Synchronous, asynchronous calls", icon: "📨", xpReward: 150 },
    { id: "fragments", title: "Combined Fragments", description: "Loops, alternatives, options", icon: "🔲", xpReward: 175 },
    { id: "state-diagrams", title: "State Machine Diagrams", description: "Object states and transitions", icon: "🔄", xpReward: 175 },
    { id: "activity-diagrams", title: "Activity Diagrams", description: "Workflow modelling in UML", icon: "📊", xpReward: 150 },
    
    // Week 8: Project Planning
    { id: "project-planning", title: "Project Planning Basics", description: "Scope, time, cost", icon: "🗂️", xpReward: 100 },
    { id: "wbs", title: "Work Breakdown Structure", description: "Decomposing deliverables", icon: "📋", xpReward: 125 },
    { id: "gantt-charts", title: "Gantt Charts", description: "Project timelines", icon: "📅", xpReward: 125 },
    { id: "critical-path", title: "Critical Path Method", description: "Identifying critical tasks", icon: "🛤️", xpReward: 150 },
    { id: "pert", title: "PERT Analysis", description: "Probabilistic scheduling", icon: "📊", xpReward: 150 },
    { id: "kanban-trello", title: "Kanban & Trello", description: "Visual workflow boards", icon: "📌", xpReward: 100 },
    { id: "resource-allocation", title: "Resource Allocation", description: "Assigning people and resources", icon: "👥", xpReward: 125 },
    
    // Week 9: SDLC Models
    { id: "sdlc-overview", title: "SDLC Overview", description: "Software development lifecycle", icon: "🔄", xpReward: 100 },
    { id: "waterfall-model", title: "Waterfall Model", description: "Sequential phases", icon: "🌊", xpReward: 100 },
    { id: "v-model", title: "V-Model", description: "Verification and validation", icon: "✔️", xpReward: 125 },
    { id: "iterative-model", title: "Iterative Model", description: "Repeated refinement", icon: "🔄", xpReward: 125 },
    { id: "spiral-model", title: "Spiral Model", description: "Risk-driven development", icon: "🌀", xpReward: 150 },
    { id: "prototyping", title: "Prototyping", description: "Rapid prototype development", icon: "🔧", xpReward: 125 },
    
    // Week 10: Agile & Scrum
    { id: "agile-intro", title: "Agile Principles", description: "Agile manifesto values", icon: "🏃", xpReward: 100 },
    { id: "scrum-framework", title: "Scrum Framework", description: "Roles, events, artifacts", icon: "🏉", xpReward: 125 },
    { id: "scrum-roles", title: "Scrum Roles", description: "Product Owner, Scrum Master, Team", icon: "👥", xpReward: 100 },
    { id: "sprint-planning", title: "Sprint Planning", description: "Planning sprint work", icon: "📋", xpReward: 125 },
    { id: "daily-scrum", title: "Daily Scrum", description: "Standup meetings", icon: "🗣️", xpReward: 75 },
    { id: "sprint-review", title: "Sprint Review", description: "Demonstrating work", icon: "📺", xpReward: 100 },
    { id: "retrospectives", title: "Retrospectives", description: "Continuous improvement", icon: "🔍", xpReward: 100 },
    { id: "kanban-method", title: "Kanban Method", description: "Flow-based work management", icon: "📊", xpReward: 125 },
    
    // Week 11: Risk & Security
    { id: "risk-management", title: "Risk Management", description: "Identify and mitigate risks", icon: "⚠️", xpReward: 100 },
    { id: "risk-assessment", title: "Risk Assessment", description: "Impact and probability", icon: "📊", xpReward: 125 },
    { id: "risk-mitigation", title: "Risk Mitigation", description: "Strategies and contingencies", icon: "🛡️", xpReward: 125 },
    { id: "security-basics", title: "Security Fundamentals", description: "Authentication and encryption", icon: "🔐", xpReward: 100 },
    { id: "security-requirements", title: "Security Requirements", description: "Specifying security needs", icon: "📋", xpReward: 125 },
    
    // Week 12: Testing & Quality
    { id: "testing-strategies", title: "Testing Strategies", description: "Unit, integration, UAT", icon: "🧪", xpReward: 125 },
    { id: "test-planning", title: "Test Planning", description: "Test cases and scenarios", icon: "📋", xpReward: 125 },
    { id: "quality-assurance", title: "Quality Assurance", description: "QA processes and standards", icon: "✅", xpReward: 125 },
    { id: "compliance", title: "Compliance & GDPR", description: "Data protection regulations", icon: "📜", xpReward: 100 },
    { id: "documentation", title: "Documentation Standards", description: "Technical and user docs", icon: "📄", xpReward: 100 },
  ],

  // ==================== MATHS FOR COMPUTING ====================
  "math-computing": [
    // Week 1: Number Systems Fundamentals
    { id: "number-systems", title: "Number Systems Overview", description: "Decimal, binary, octal, hex", icon: "🔢", xpReward: 75 },
    { id: "decimal-system", title: "Decimal System", description: "Base-10 fundamentals", icon: "🔟", xpReward: 50 },
    { id: "binary-basics", title: "Binary System", description: "Base-2 representation", icon: "0️⃣", xpReward: 75 },
    { id: "counting-binary", title: "Counting in Binary", description: "Binary sequences", icon: "🔢", xpReward: 75 },
    
    // Week 2: Binary Arithmetic
    { id: "binary-arithmetic", title: "Binary Addition", description: "Adding binary numbers", icon: "➕", xpReward: 100 },
    { id: "binary-subtraction", title: "Binary Subtraction", description: "Subtracting binary numbers", icon: "➖", xpReward: 100 },
    { id: "binary-multiplication", title: "Binary Multiplication", description: "Multiplying binary numbers", icon: "✖️", xpReward: 125 },
    { id: "binary-division", title: "Binary Division", description: "Dividing binary numbers", icon: "➗", xpReward: 125 },
    { id: "twos-complement", title: "Two's Complement", description: "Signed number representation", icon: "➖", xpReward: 150 },
    { id: "ones-complement", title: "One's Complement", description: "Alternative signed format", icon: "🔄", xpReward: 125 },
    
    // Week 3: Octal & Hexadecimal
    { id: "octal-system", title: "Octal System", description: "Base-8 representation", icon: "8️⃣", xpReward: 75 },
    { id: "hex-system", title: "Hexadecimal System", description: "Base-16 representation", icon: "🔷", xpReward: 75 },
    { id: "hex-conversions", title: "Hex Conversions", description: "Hexadecimal conversions", icon: "🔄", xpReward: 100 },
    { id: "binary-to-hex", title: "Binary to Hex", description: "Direct conversion method", icon: "🔀", xpReward: 100 },
    { id: "hex-to-binary", title: "Hex to Binary", description: "Reverse conversion", icon: "🔁", xpReward: 100 },
    { id: "octal-conversions", title: "Octal Conversions", description: "Converting octal numbers", icon: "🔄", xpReward: 100 },
    
    // Week 4: Floating Point
    { id: "floating-point-intro", title: "Floating Point Intro", description: "Real number representation", icon: "🎯", xpReward: 125 },
    { id: "ieee-754", title: "IEEE 754 Standard", description: "Single and double precision", icon: "📐", xpReward: 150 },
    { id: "mantissa-exponent", title: "Mantissa & Exponent", description: "Components of floating point", icon: "🔢", xpReward: 150 },
    { id: "float-precision", title: "Precision Issues", description: "Rounding errors and limits", icon: "⚠️", xpReward: 125 },
    
    // Week 5: Logic Gates
    { id: "logic-gates", title: "Logic Gates Intro", description: "Digital logic fundamentals", icon: "🚦", xpReward: 100 },
    { id: "and-gate", title: "AND Gate", description: "Conjunction operation", icon: "🔲", xpReward: 75 },
    { id: "or-gate", title: "OR Gate", description: "Disjunction operation", icon: "🔳", xpReward: 75 },
    { id: "not-gate", title: "NOT Gate", description: "Negation operation", icon: "⬛", xpReward: 75 },
    { id: "xor-gate", title: "XOR Gate", description: "Exclusive OR", icon: "🔷", xpReward: 100 },
    { id: "nand-nor", title: "NAND & NOR Gates", description: "Universal gates", icon: "🔶", xpReward: 125 },
    { id: "gate-combinations", title: "Combined Gates", description: "Building complex circuits", icon: "🔧", xpReward: 150 },
    
    // Week 6: Boolean Algebra
    { id: "truth-tables", title: "Truth Tables", description: "Boolean expressions", icon: "📋", xpReward: 100 },
    { id: "boolean-algebra", title: "Boolean Algebra Basics", description: "Laws and identities", icon: "🔣", xpReward: 125 },
    { id: "demorgans-laws", title: "De Morgan's Laws", description: "NOT of AND/OR", icon: "📐", xpReward: 125 },
    { id: "boolean-simplification", title: "Simplification", description: "Reducing expressions", icon: "✂️", xpReward: 150 },
    { id: "karnaugh-maps", title: "Karnaugh Maps", description: "Visual simplification", icon: "🗺️", xpReward: 175 },
    { id: "sum-of-products", title: "Sum of Products", description: "SOP form", icon: "➕", xpReward: 125 },
    { id: "product-of-sums", title: "Product of Sums", description: "POS form", icon: "✖️", xpReward: 125 },
    
    // Week 7: Sets & Set Operations
    { id: "sets-basics", title: "Sets Introduction", description: "Set notation and membership", icon: "⭕", xpReward: 100 },
    { id: "set-operations", title: "Set Operations", description: "Union, intersection, complement", icon: "🔗", xpReward: 100 },
    { id: "set-difference", title: "Set Difference", description: "A - B operation", icon: "➖", xpReward: 100 },
    { id: "symmetric-difference", title: "Symmetric Difference", description: "XOR for sets", icon: "🔀", xpReward: 125 },
    { id: "venn-diagrams", title: "Venn Diagrams", description: "Visualizing sets", icon: "🔗", xpReward: 75 },
    { id: "subsets", title: "Subsets & Power Sets", description: "Set relationships", icon: "📦", xpReward: 125 },
    { id: "cartesian-product", title: "Cartesian Product", description: "Set pairs", icon: "✖️", xpReward: 150 },
    
    // Week 8: Probability
    { id: "probability-basics", title: "Probability Basics", description: "Events and outcomes", icon: "🎲", xpReward: 100 },
    { id: "sample-space", title: "Sample Space", description: "All possible outcomes", icon: "📊", xpReward: 100 },
    { id: "probability-rules", title: "Probability Rules", description: "Addition and multiplication", icon: "📐", xpReward: 125 },
    { id: "conditional-probability", title: "Conditional Probability", description: "P(A|B) and Bayes", icon: "🔮", xpReward: 150 },
    { id: "bayes-theorem", title: "Bayes' Theorem", description: "Updating probabilities", icon: "🧮", xpReward: 175 },
    { id: "independence", title: "Independence", description: "Independent events", icon: "🔗", xpReward: 125 },
    { id: "expected-value", title: "Expected Value", description: "Mean of random variable", icon: "📊", xpReward: 150 },
    
    // Week 9: Graph Theory
    { id: "graphs-intro", title: "Graph Theory Intro", description: "Vertices, edges, notation", icon: "🌳", xpReward: 125 },
    { id: "graph-types", title: "Types of Graphs", description: "Directed, undirected, weighted", icon: "🔀", xpReward: 125 },
    { id: "graph-representation", title: "Graph Representation", description: "Adjacency matrix/list", icon: "📊", xpReward: 150 },
    { id: "paths-cycles", title: "Paths & Cycles", description: "Walks, trails, paths", icon: "🛤️", xpReward: 150 },
    { id: "connectivity", title: "Connectivity", description: "Connected components", icon: "🔗", xpReward: 125 },
    { id: "graph-properties", title: "Graph Properties", description: "Degree, density, planarity", icon: "📐", xpReward: 150 },
    
    // Week 10: Trees
    { id: "trees-basics", title: "Tree Structures", description: "Rooted trees, hierarchy", icon: "🌲", xpReward: 125 },
    { id: "binary-trees", title: "Binary Trees", description: "At most two children", icon: "🌳", xpReward: 150 },
    { id: "bst", title: "Binary Search Trees", description: "Ordered tree structure", icon: "🔍", xpReward: 175 },
    { id: "tree-traversal", title: "Tree Traversal", description: "Inorder, preorder, postorder", icon: "🚶", xpReward: 175 },
    { id: "balanced-trees", title: "Balanced Trees", description: "AVL and height balance", icon: "⚖️", xpReward: 175 },
    { id: "spanning-trees", title: "Spanning Trees", description: "MST algorithms", icon: "🌐", xpReward: 175 },
    
    // Week 11: Graph Algorithms
    { id: "graph-algorithms", title: "Graph Algorithms Intro", description: "Common graph problems", icon: "🗺️", xpReward: 150 },
    { id: "bfs", title: "Breadth-First Search", description: "Level-order exploration", icon: "📊", xpReward: 175 },
    { id: "dfs", title: "Depth-First Search", description: "Stack-based exploration", icon: "📉", xpReward: 175 },
    { id: "dijkstra", title: "Dijkstra's Algorithm", description: "Shortest paths", icon: "🛤️", xpReward: 200 },
    { id: "topological-sort", title: "Topological Sort", description: "Ordering DAG nodes", icon: "📋", xpReward: 175 },
    
    // Week 12: Complexity Analysis
    { id: "big-o-intro", title: "Big-O Notation", description: "Time complexity basics", icon: "⏱️", xpReward: 150 },
    { id: "constant-linear", title: "O(1) and O(n)", description: "Constant and linear time", icon: "📈", xpReward: 125 },
    { id: "logarithmic", title: "O(log n)", description: "Logarithmic complexity", icon: "📉", xpReward: 150 },
    { id: "quadratic", title: "O(n²) and O(n³)", description: "Polynomial complexity", icon: "📊", xpReward: 150 },
    { id: "exponential", title: "O(2^n)", description: "Exponential complexity", icon: "🚀", xpReward: 150 },
    { id: "complexity-comparison", title: "Complexity Comparison", description: "Comparing growth rates", icon: "📈", xpReward: 150 },
    { id: "space-complexity", title: "Space Complexity", description: "Memory usage analysis", icon: "💾", xpReward: 150 },
    
    // Week 13: Functions & Relations
    { id: "functions-math", title: "Functions", description: "Domain, range, composition", icon: "📐", xpReward: 100 },
    { id: "function-types", title: "Types of Functions", description: "Injective, surjective, bijective", icon: "🔀", xpReward: 125 },
    { id: "relations", title: "Relations", description: "Binary relations and properties", icon: "🔗", xpReward: 125 },
    { id: "equivalence-relations", title: "Equivalence Relations", description: "Reflexive, symmetric, transitive", icon: "⚖️", xpReward: 150 },
    
    // Week 14: Algebra & Matrices
    { id: "algebra-basics", title: "Algebra Fundamentals", description: "Variables, equations, PEMDAS", icon: "🔡", xpReward: 75 },
    { id: "linear-equations", title: "Linear Equations", description: "Solving equations", icon: "📐", xpReward: 100 },
    { id: "matrices-basics", title: "Matrices Introduction", description: "Matrix notation", icon: "🔲", xpReward: 125 },
    { id: "matrix-operations", title: "Matrix Operations", description: "Add, subtract, multiply", icon: "➕", xpReward: 150 },
    { id: "matrix-identity", title: "Identity Matrix", description: "Special matrices", icon: "🔳", xpReward: 125 },
    { id: "matrix-inverse", title: "Matrix Inverse", description: "Inverse calculation", icon: "🔄", xpReward: 175 },
  ],

  // ==================== CYBERSECURITY ====================
  "cybersecurity": [
    // Week 1: Security Fundamentals
    { id: "cia-triad", title: "CIA Triad", description: "Confidentiality, Integrity, Availability", icon: "🔐", xpReward: 75 },
    { id: "security-principles", title: "Security Principles", description: "Defense in depth, least privilege", icon: "🛡️", xpReward: 100 },
    { id: "security-policies", title: "Security Policies", description: "Organizational security rules", icon: "📋", xpReward: 100 },
    { id: "risk-assessment", title: "Risk Assessment", description: "Identifying and evaluating risks", icon: "⚠️", xpReward: 125 },
    
    // Week 2: Threats & Vulnerabilities
    { id: "threats-vulnerabilities", title: "Threats & Vulnerabilities", description: "Identify security weaknesses", icon: "⚠️", xpReward: 100 },
    { id: "threat-actors", title: "Threat Actors", description: "Hackers, insiders, nation-states", icon: "👤", xpReward: 100 },
    { id: "attack-vectors", title: "Attack Vectors", description: "Methods of compromise", icon: "🎯", xpReward: 125 },
    { id: "vulnerability-assessment", title: "Vulnerability Assessment", description: "Scanning and testing", icon: "🔍", xpReward: 150 },
    
    // Week 3: Malware
    { id: "malware-types", title: "Malware Types", description: "Viruses, worms, trojans", icon: "🦠", xpReward: 100 },
    { id: "viruses", title: "Computer Viruses", description: "Self-replicating code", icon: "🦠", xpReward: 100 },
    { id: "worms", title: "Worms", description: "Network-spreading malware", icon: "🐛", xpReward: 100 },
    { id: "trojans", title: "Trojans", description: "Disguised malicious software", icon: "🐴", xpReward: 100 },
    { id: "ransomware", title: "Ransomware", description: "Encryption and extortion", icon: "💰", xpReward: 125 },
    { id: "spyware", title: "Spyware & Adware", description: "Surveillance and ads", icon: "👁️", xpReward: 100 },
    { id: "rootkits", title: "Rootkits", description: "Hidden system access", icon: "🔓", xpReward: 150 },
    { id: "malware-analysis", title: "Malware Analysis", description: "Static and dynamic analysis", icon: "🔬", xpReward: 175 },
    
    // Week 4: Social Engineering
    { id: "social-engineering", title: "Social Engineering", description: "Manipulating people", icon: "🎭", xpReward: 100 },
    { id: "phishing", title: "Phishing Attacks", description: "Email and website deception", icon: "🎣", xpReward: 125 },
    { id: "spear-phishing", title: "Spear Phishing", description: "Targeted attacks", icon: "🎯", xpReward: 125 },
    { id: "pretexting", title: "Pretexting", description: "Fabricated scenarios", icon: "🎭", xpReward: 100 },
    { id: "baiting", title: "Baiting & Quid Pro Quo", description: "Luring with offers", icon: "🪤", xpReward: 100 },
    { id: "tailgating", title: "Tailgating", description: "Physical access tricks", icon: "🚪", xpReward: 100 },
    { id: "security-awareness", title: "Security Awareness", description: "Training users", icon: "📚", xpReward: 125 },
    
    // Week 5: Authentication
    { id: "authentication", title: "Authentication Basics", description: "Verifying identity", icon: "🔑", xpReward: 125 },
    { id: "passwords", title: "Password Security", description: "Strong password practices", icon: "🔐", xpReward: 100 },
    { id: "password-attacks", title: "Password Attacks", description: "Brute force, dictionary, rainbow", icon: "⚔️", xpReward: 150 },
    { id: "mfa", title: "Multi-Factor Auth", description: "Something you know/have/are", icon: "📱", xpReward: 150 },
    { id: "biometrics", title: "Biometrics", description: "Fingerprint, face, iris", icon: "👆", xpReward: 125 },
    { id: "sso", title: "Single Sign-On", description: "Centralized authentication", icon: "🔗", xpReward: 125 },
    { id: "oauth-oidc", title: "OAuth & OIDC", description: "Authorization protocols", icon: "🎟️", xpReward: 175 },
    
    // Week 6: Cryptography
    { id: "encryption-basics", title: "Encryption Basics", description: "Symmetric vs asymmetric", icon: "🔒", xpReward: 150 },
    { id: "symmetric-encryption", title: "Symmetric Encryption", description: "AES, DES, 3DES", icon: "🔑", xpReward: 150 },
    { id: "asymmetric-encryption", title: "Asymmetric Encryption", description: "RSA, ECC", icon: "🔐", xpReward: 175 },
    { id: "hashing", title: "Hashing & Integrity", description: "MD5, SHA, HMAC", icon: "🔏", xpReward: 150 },
    { id: "digital-signatures", title: "Digital Signatures", description: "Authentication and non-repudiation", icon: "✍️", xpReward: 175 },
    { id: "pki", title: "PKI & Certificates", description: "Certificate authorities", icon: "📜", xpReward: 175 },
    { id: "tls-ssl", title: "TLS/SSL", description: "Secure communications", icon: "🔒", xpReward: 150 },
    
    // Week 7: Network Security
    { id: "network-security", title: "Network Security Basics", description: "Protecting network traffic", icon: "🛡️", xpReward: 150 },
    { id: "firewalls", title: "Firewalls", description: "Packet filtering and inspection", icon: "🧱", xpReward: 150 },
    { id: "ids-ips", title: "IDS & IPS", description: "Intrusion detection and prevention", icon: "🚨", xpReward: 175 },
    { id: "vpn", title: "VPNs", description: "Virtual private networks", icon: "🔒", xpReward: 150 },
    { id: "dmz", title: "DMZ Architecture", description: "Network segmentation", icon: "🏰", xpReward: 150 },
    { id: "network-monitoring", title: "Network Monitoring", description: "Traffic analysis", icon: "📊", xpReward: 150 },
    { id: "wireless-security", title: "Wireless Security", description: "WPA2, WPA3, attacks", icon: "📡", xpReward: 150 },
    
    // Week 8: Web Application Security
    { id: "owasp-top10", title: "OWASP Top 10", description: "Common web vulnerabilities", icon: "🔟", xpReward: 175 },
    { id: "sql-injection", title: "SQL Injection", description: "Attack and prevention", icon: "💉", xpReward: 150 },
    { id: "xss-attacks", title: "XSS Attacks", description: "Cross-site scripting", icon: "📜", xpReward: 150 },
    { id: "csrf", title: "CSRF Attacks", description: "Cross-site request forgery", icon: "🎭", xpReward: 150 },
    { id: "input-validation", title: "Input Validation", description: "Sanitizing user input", icon: "✅", xpReward: 125 },
    { id: "secure-coding", title: "Secure Coding", description: "Best practices", icon: "💻", xpReward: 150 },
    { id: "web-app-testing", title: "Web App Testing", description: "DAST and SAST", icon: "🧪", xpReward: 175 },
    
    // Week 9: Incident Response
    { id: "incident-response", title: "Incident Response", description: "Handling security incidents", icon: "🚨", xpReward: 175 },
    { id: "ir-phases", title: "IR Phases", description: "Preparation to lessons learned", icon: "📋", xpReward: 150 },
    { id: "detection", title: "Detection & Analysis", description: "Identifying incidents", icon: "🔍", xpReward: 150 },
    { id: "containment", title: "Containment", description: "Limiting damage", icon: "🧯", xpReward: 150 },
    { id: "eradication", title: "Eradication & Recovery", description: "Removing threats", icon: "🔧", xpReward: 150 },
    { id: "forensics", title: "Digital Forensics", description: "Evidence collection", icon: "🔬", xpReward: 200 },
    { id: "post-incident", title: "Post-Incident Review", description: "Learning from incidents", icon: "📚", xpReward: 125 },
    
    // Week 10: Compliance & Governance
    { id: "gdpr-compliance", title: "GDPR Compliance", description: "Data protection principles", icon: "📜", xpReward: 150 },
    { id: "pci-dss", title: "PCI DSS", description: "Payment card security", icon: "💳", xpReward: 150 },
    { id: "hipaa", title: "HIPAA", description: "Healthcare data protection", icon: "🏥", xpReward: 150 },
    { id: "iso-27001", title: "ISO 27001", description: "Security management standard", icon: "📋", xpReward: 175 },
    { id: "security-auditing", title: "Security Auditing", description: "Compliance verification", icon: "✅", xpReward: 150 },
    { id: "security-governance", title: "Security Governance", description: "Policies and frameworks", icon: "🏛️", xpReward: 150 },
  ],

  // ==================== AI & DATA SCIENCE ====================
  "ai-data-science": [
    // Week 1: Introduction to AI
    { id: "ai-intro", title: "What is AI?", description: "Artificial intelligence overview", icon: "🤖", xpReward: 75 },
    { id: "ai-history", title: "History of AI", description: "From Turing to modern AI", icon: "📜", xpReward: 75 },
    { id: "ai-types", title: "Types of AI", description: "Narrow, general, superintelligence", icon: "🔀", xpReward: 100 },
    { id: "ai-applications", title: "AI Applications", description: "Real-world use cases", icon: "🌍", xpReward: 75 },
    
    // Week 2: Machine Learning Fundamentals
    { id: "ml-intro", title: "Machine Learning Intro", description: "Learning from data", icon: "📊", xpReward: 100 },
    { id: "ml-types", title: "Types of ML", description: "Supervised, unsupervised, reinforcement", icon: "📊", xpReward: 100 },
    { id: "supervised-learning", title: "Supervised Learning", description: "Labeled data training", icon: "🏷️", xpReward: 125 },
    { id: "unsupervised-learning", title: "Unsupervised Learning", description: "Pattern discovery", icon: "🔍", xpReward: 125 },
    { id: "reinforcement-learning", title: "Reinforcement Learning", description: "Learning from rewards", icon: "🎮", xpReward: 150 },
    
    // Week 3: Data Fundamentals
    { id: "data-collection", title: "Data Collection", description: "Sources, quality, quantity", icon: "📥", xpReward: 100 },
    { id: "data-types-ds", title: "Data Types", description: "Numerical, categorical, text", icon: "📊", xpReward: 100 },
    { id: "data-cleaning", title: "Data Cleaning", description: "Missing values, outliers", icon: "🧹", xpReward: 125 },
    { id: "data-normalization", title: "Normalization", description: "Scaling and standardization", icon: "📐", xpReward: 125 },
    { id: "feature-engineering", title: "Feature Engineering", description: "Creating useful features", icon: "🔧", xpReward: 150 },
    { id: "eda", title: "Exploratory Data Analysis", description: "Understanding your data", icon: "🔍", xpReward: 125 },
    
    // Week 4: Data Visualization
    { id: "data-viz-intro", title: "Data Visualization Intro", description: "Why visualize data", icon: "📊", xpReward: 75 },
    { id: "chart-types", title: "Chart Types", description: "Bar, line, scatter, pie", icon: "📈", xpReward: 100 },
    { id: "statistical-plots", title: "Statistical Plots", description: "Histograms, box plots", icon: "📉", xpReward: 125 },
    { id: "heatmaps", title: "Heatmaps & Correlation", description: "Visualizing relationships", icon: "🌡️", xpReward: 125 },
    { id: "dashboards", title: "Building Dashboards", description: "Interactive visualizations", icon: "📋", xpReward: 150 },
    
    // Week 5: Regression
    { id: "linear-regression", title: "Linear Regression", description: "Predicting continuous values", icon: "📈", xpReward: 150 },
    { id: "multiple-regression", title: "Multiple Regression", description: "Multiple predictors", icon: "📊", xpReward: 175 },
    { id: "polynomial-regression", title: "Polynomial Regression", description: "Non-linear relationships", icon: "📉", xpReward: 175 },
    { id: "regularization", title: "Regularization", description: "L1 and L2 penalties", icon: "⚖️", xpReward: 175 },
    { id: "regression-evaluation", title: "Regression Metrics", description: "MSE, RMSE, R²", icon: "📏", xpReward: 150 },
    
    // Week 6: Classification
    { id: "classification", title: "Classification Basics", description: "Predicting categories", icon: "🏷️", xpReward: 150 },
    { id: "logistic-regression", title: "Logistic Regression", description: "Binary classification", icon: "🔀", xpReward: 175 },
    { id: "knn", title: "K-Nearest Neighbors", description: "Instance-based learning", icon: "📍", xpReward: 150 },
    { id: "naive-bayes", title: "Naive Bayes", description: "Probabilistic classifier", icon: "📊", xpReward: 175 },
    { id: "svm", title: "Support Vector Machines", description: "Maximum margin classifier", icon: "📐", xpReward: 200 },
    { id: "classification-metrics", title: "Classification Metrics", description: "Accuracy, precision, recall, F1", icon: "📊", xpReward: 150 },
    
    // Week 7: Decision Trees & Ensembles
    { id: "decision-trees", title: "Decision Trees", description: "Tree-based learning", icon: "🌳", xpReward: 150 },
    { id: "tree-pruning", title: "Tree Pruning", description: "Preventing overfitting", icon: "✂️", xpReward: 150 },
    { id: "random-forests", title: "Random Forests", description: "Ensemble of trees", icon: "🌲", xpReward: 175 },
    { id: "gradient-boosting", title: "Gradient Boosting", description: "XGBoost, LightGBM", icon: "🚀", xpReward: 200 },
    { id: "ensemble-methods", title: "Ensemble Methods", description: "Bagging vs boosting", icon: "📦", xpReward: 175 },
    
    // Week 8: Clustering
    { id: "clustering-intro", title: "Clustering Introduction", description: "Grouping similar data", icon: "🔵", xpReward: 125 },
    { id: "kmeans", title: "K-Means Clustering", description: "Centroid-based clustering", icon: "📍", xpReward: 175 },
    { id: "hierarchical", title: "Hierarchical Clustering", description: "Dendrograms", icon: "🌳", xpReward: 175 },
    { id: "dbscan", title: "DBSCAN", description: "Density-based clustering", icon: "🔵", xpReward: 175 },
    { id: "cluster-evaluation", title: "Cluster Evaluation", description: "Silhouette score", icon: "📏", xpReward: 150 },
    
    // Week 9: Model Training
    { id: "train-test-split", title: "Train/Test Split", description: "Validation strategies", icon: "✂️", xpReward: 100 },
    { id: "cross-validation", title: "Cross-Validation", description: "K-fold validation", icon: "🔄", xpReward: 150 },
    { id: "overfitting", title: "Overfitting", description: "Model too complex", icon: "📈", xpReward: 150 },
    { id: "underfitting", title: "Underfitting", description: "Model too simple", icon: "📉", xpReward: 125 },
    { id: "bias-variance", title: "Bias-Variance Tradeoff", description: "Finding the balance", icon: "⚖️", xpReward: 175 },
    { id: "hyperparameter-tuning", title: "Hyperparameter Tuning", description: "Grid and random search", icon: "🔧", xpReward: 175 },
    
    // Week 10: Neural Networks
    { id: "neural-networks", title: "Neural Networks Intro", description: "Neurons and layers", icon: "🧠", xpReward: 200 },
    { id: "perceptron", title: "Perceptron", description: "Single neuron model", icon: "🔵", xpReward: 150 },
    { id: "mlp", title: "Multilayer Perceptron", description: "Hidden layers", icon: "🔗", xpReward: 200 },
    { id: "activation-functions", title: "Activation Functions", description: "ReLU, sigmoid, tanh", icon: "📈", xpReward: 175 },
    { id: "backpropagation", title: "Backpropagation", description: "Training neural networks", icon: "🔄", xpReward: 225 },
    { id: "deep-learning", title: "Deep Learning Intro", description: "Many hidden layers", icon: "🧠", xpReward: 225 },
    
    // Week 11: Advanced Neural Networks
    { id: "cnn-intro", title: "Convolutional NNs", description: "Image processing", icon: "🖼️", xpReward: 250 },
    { id: "rnn-intro", title: "Recurrent NNs", description: "Sequential data", icon: "🔁", xpReward: 250 },
    { id: "lstm", title: "LSTM Networks", description: "Long-term dependencies", icon: "🔗", xpReward: 250 },
    { id: "transfer-learning", title: "Transfer Learning", description: "Reusing trained models", icon: "📦", xpReward: 200 },
    
    // Week 12: Ethics & Applications
    { id: "ethics-in-ai", title: "Ethics in AI", description: "Bias, fairness, transparency", icon: "⚖️", xpReward: 125 },
    { id: "ai-bias", title: "AI Bias", description: "Sources and mitigation", icon: "⚠️", xpReward: 150 },
    { id: "explainable-ai", title: "Explainable AI", description: "Interpretable models", icon: "🔍", xpReward: 175 },
    { id: "ai-in-industry", title: "AI in Industry", description: "Real-world applications", icon: "🏭", xpReward: 125 },
    { id: "model-deployment", title: "Model Deployment", description: "Production systems", icon: "🚀", xpReward: 175 },
  ],

  // ==================== BUSINESS INFORMATION SYSTEMS ====================
  "business-systems": [
    // Week 1: Introduction to BIS
    { id: "bis-intro", title: "Business Information Systems", description: "Technology in business", icon: "💼", xpReward: 75 },
    { id: "info-systems-role", title: "Role of IS", description: "Strategic importance", icon: "🎯", xpReward: 75 },
    { id: "business-processes", title: "Business Processes", description: "Workflows and operations", icon: "🔄", xpReward: 100 },
    { id: "digital-transformation", title: "Digital Transformation", description: "Business digitization", icon: "💻", xpReward: 125 },
    
    // Week 2: Types of Information Systems
    { id: "info-system-types", title: "Types of IS", description: "TPS, MIS, DSS, EIS", icon: "📊", xpReward: 100 },
    { id: "tps", title: "Transaction Processing", description: "TPS systems", icon: "💳", xpReward: 100 },
    { id: "mis", title: "Management Info Systems", description: "MIS reporting", icon: "📈", xpReward: 125 },
    { id: "dss", title: "Decision Support Systems", description: "DSS analytics", icon: "🎯", xpReward: 150 },
    { id: "eis", title: "Executive Info Systems", description: "EIS dashboards", icon: "👔", xpReward: 150 },
    { id: "kms", title: "Knowledge Management", description: "KMS for organizations", icon: "📚", xpReward: 125 },
    
    // Week 3: Enterprise Systems
    { id: "erp-systems", title: "ERP Systems", description: "Enterprise resource planning", icon: "🏢", xpReward: 125 },
    { id: "erp-modules", title: "ERP Modules", description: "Finance, HR, manufacturing", icon: "📦", xpReward: 125 },
    { id: "erp-implementation", title: "ERP Implementation", description: "Deployment challenges", icon: "🔧", xpReward: 150 },
    { id: "sap-oracle", title: "SAP & Oracle", description: "Major ERP vendors", icon: "🏛️", xpReward: 125 },
    { id: "crm-basics", title: "CRM Basics", description: "Customer relationship management", icon: "👥", xpReward: 125 },
    { id: "crm-features", title: "CRM Features", description: "Sales, marketing, service", icon: "💬", xpReward: 125 },
    { id: "scm", title: "Supply Chain Management", description: "SCM systems", icon: "🚚", xpReward: 150 },
    
    // Week 4: E-Commerce & Digital Business
    { id: "e-commerce", title: "E-Commerce Models", description: "B2B, B2C, C2C", icon: "🛒", xpReward: 100 },
    { id: "e-commerce-platforms", title: "E-Commerce Platforms", description: "Shopify, Magento, WooCommerce", icon: "🏪", xpReward: 125 },
    { id: "payment-systems", title: "Payment Systems", description: "Online payment processing", icon: "💳", xpReward: 125 },
    { id: "m-commerce", title: "Mobile Commerce", description: "M-commerce trends", icon: "📱", xpReward: 100 },
    { id: "digital-marketing", title: "Digital Marketing", description: "Online marketing channels", icon: "📢", xpReward: 125 },
    { id: "seo-sem", title: "SEO & SEM", description: "Search optimization", icon: "🔍", xpReward: 150 },
    { id: "social-media-marketing", title: "Social Media Marketing", description: "Platform strategies", icon: "📱", xpReward: 125 },
    
    // Week 5: Cloud Computing
    { id: "cloud-computing", title: "Cloud Computing Intro", description: "What is the cloud?", icon: "☁️", xpReward: 100 },
    { id: "cloud-models", title: "Cloud Service Models", description: "IaaS, PaaS, SaaS", icon: "☁️", xpReward: 125 },
    { id: "cloud-deployment", title: "Deployment Models", description: "Public, private, hybrid", icon: "🏗️", xpReward: 125 },
    { id: "aws-azure-gcp", title: "AWS, Azure, GCP", description: "Major cloud providers", icon: "🌐", xpReward: 150 },
    { id: "cloud-security", title: "Cloud Security", description: "Securing cloud resources", icon: "🔒", xpReward: 150 },
    { id: "cloud-migration", title: "Cloud Migration", description: "Moving to the cloud", icon: "🚀", xpReward: 150 },
    
    // Week 6: Data Management
    { id: "data-management", title: "Data Management", description: "Managing organizational data", icon: "📊", xpReward: 100 },
    { id: "database-concepts", title: "Database Concepts", description: "Relational databases", icon: "🗄️", xpReward: 125 },
    { id: "data-warehousing", title: "Data Warehousing", description: "Business intelligence", icon: "🏢", xpReward: 150 },
    { id: "data-governance", title: "Data Governance", description: "Data policies and quality", icon: "📋", xpReward: 150 },
    { id: "big-data", title: "Big Data", description: "Volume, velocity, variety", icon: "📈", xpReward: 175 },
    { id: "business-analytics", title: "Business Analytics", description: "Data-driven decisions", icon: "📊", xpReward: 175 },
    
    // Week 7: IT Infrastructure
    { id: "it-infrastructure", title: "IT Infrastructure", description: "Hardware and networking", icon: "🖥️", xpReward: 100 },
    { id: "networking-basics", title: "Networking Basics", description: "LANs, WANs, internet", icon: "🌐", xpReward: 100 },
    { id: "virtualization", title: "Virtualization", description: "VMs and containers", icon: "📦", xpReward: 150 },
    { id: "it-service-management", title: "IT Service Management", description: "ITIL framework", icon: "🔧", xpReward: 150 },
    { id: "disaster-recovery", title: "Disaster Recovery", description: "Business continuity", icon: "🛡️", xpReward: 175 },
    
    // Week 8: Project Management
    { id: "project-management", title: "IT Project Management", description: "Managing IT projects", icon: "📅", xpReward: 150 },
    { id: "pm-methodologies", title: "PM Methodologies", description: "Waterfall vs Agile", icon: "📋", xpReward: 125 },
    { id: "prince2", title: "PRINCE2", description: "Structured PM approach", icon: "👑", xpReward: 150 },
    { id: "pmi-pmbok", title: "PMI & PMBOK", description: "Project management standard", icon: "📚", xpReward: 150 },
    { id: "project-tools", title: "Project Tools", description: "MS Project, Jira, Asana", icon: "🔧", xpReward: 125 },
    { id: "change-management", title: "Change Management", description: "Managing transitions", icon: "🔄", xpReward: 150 },
    
    // Week 9: IS Strategy & Governance
    { id: "is-strategy", title: "IS Strategy", description: "Aligning IT with business", icon: "🎯", xpReward: 150 },
    { id: "it-governance", title: "IT Governance", description: "COBIT framework", icon: "📋", xpReward: 175 },
    { id: "it-budgeting", title: "IT Budgeting", description: "TCO and ROI", icon: "💰", xpReward: 150 },
    { id: "outsourcing", title: "IT Outsourcing", description: "Build vs buy decisions", icon: "🤝", xpReward: 150 },
    { id: "vendor-management", title: "Vendor Management", description: "Managing IT vendors", icon: "📋", xpReward: 125 },
    
    // Week 10: Emerging Technologies
    { id: "iot", title: "Internet of Things", description: "Connected devices", icon: "📡", xpReward: 150 },
    { id: "blockchain", title: "Blockchain", description: "Distributed ledger tech", icon: "🔗", xpReward: 175 },
    { id: "rpa", title: "Robotic Process Automation", description: "Automating tasks", icon: "🤖", xpReward: 175 },
    { id: "ai-in-business", title: "AI in Business", description: "AI applications", icon: "🧠", xpReward: 175 },
    { id: "future-trends", title: "Future Trends", description: "Emerging technologies", icon: "🔮", xpReward: 125 },
    
    // Week 11: Business Process Engineering
    { id: "bpr", title: "Business Process Reengineering", description: "Redesigning processes", icon: "🔄", xpReward: 175 },
    { id: "process-automation", title: "Process Automation", description: "Workflow automation tools", icon: "⚙️", xpReward: 150 },
    { id: "lean-thinking", title: "Lean IT", description: "Eliminating waste", icon: "📉", xpReward: 150 },
    { id: "six-sigma", title: "Six Sigma for IT", description: "Quality improvement", icon: "📊", xpReward: 150 },
    { id: "business-cases", title: "Building Business Cases", description: "Justifying IT investments", icon: "💰", xpReward: 150 },
    { id: "stakeholder-management", title: "Stakeholder Management", description: "Managing expectations", icon: "👥", xpReward: 125 },
    
    // Week 12: Digital Strategy & Innovation
    { id: "digital-strategy", title: "Digital Strategy", description: "Planning digital initiatives", icon: "🎯", xpReward: 175 },
    { id: "innovation-management", title: "Innovation Management", description: "Fostering innovation", icon: "💡", xpReward: 150 },
    { id: "agile-business", title: "Agile for Business", description: "Agile in non-IT contexts", icon: "🏃", xpReward: 150 },
    { id: "data-ethics", title: "Data Ethics", description: "Responsible data use", icon: "⚖️", xpReward: 125 },
  ],

  // ==================== GAME DEVELOPMENT ====================
  "game-development": [
    // Week 1: Game Design Fundamentals
    { id: "game-design-basics", title: "Game Design Basics", description: "Core concepts", icon: "🎮", xpReward: 75 },
    { id: "game-loop", title: "The Game Loop", description: "Input, update, render", icon: "🔄", xpReward: 100 },
    { id: "fps-frame-rate", title: "FPS & Frame Rate", description: "Timing in games", icon: "⏱️", xpReward: 100 },
    { id: "game-genres", title: "Game Genres", description: "Types of games", icon: "📚", xpReward: 75 },
    { id: "game-mechanics", title: "Game Mechanics", description: "Rules and systems", icon: "⚙️", xpReward: 125 },
    { id: "player-experience", title: "Player Experience", description: "Fun and engagement", icon: "😄", xpReward: 100 },
    
    // Week 2: 2D Graphics
    { id: "sprites-animation", title: "Sprites & Animation", description: "2D graphics basics", icon: "🖼️", xpReward: 100 },
    { id: "sprite-sheets", title: "Sprite Sheets", description: "Animation frames", icon: "📊", xpReward: 100 },
    { id: "coordinate-systems", title: "Coordinate Systems", description: "Screen positions", icon: "📐", xpReward: 100 },
    { id: "rendering-order", title: "Rendering Order", description: "Layers and depth", icon: "📚", xpReward: 125 },
    { id: "tile-maps", title: "Tile Maps", description: "Level construction", icon: "🗺️", xpReward: 150 },
    { id: "parallax-scrolling", title: "Parallax Scrolling", description: "Depth effect", icon: "🌄", xpReward: 125 },
    
    // Week 3: Collision Detection
    { id: "collision-detection", title: "Collision Basics", description: "Detecting overlaps", icon: "💥", xpReward: 125 },
    { id: "aabb-collision", title: "AABB Collision", description: "Bounding boxes", icon: "🔲", xpReward: 150 },
    { id: "circle-collision", title: "Circle Collision", description: "Radial detection", icon: "⭕", xpReward: 125 },
    { id: "collision-response", title: "Collision Response", description: "Handling collisions", icon: "🔄", xpReward: 150 },
    { id: "spatial-partitioning", title: "Spatial Partitioning", description: "Efficient collision", icon: "📊", xpReward: 175 },
    { id: "pixel-collision", title: "Pixel Collision", description: "Precise detection", icon: "🎯", xpReward: 175 },
    
    // Week 4: Input Handling
    { id: "input-handling", title: "Input Systems", description: "Processing input", icon: "🎮", xpReward: 100 },
    { id: "keyboard-input", title: "Keyboard Input", description: "Key events", icon: "⌨️", xpReward: 100 },
    { id: "mouse-input", title: "Mouse Input", description: "Click and position", icon: "🖱️", xpReward: 100 },
    { id: "gamepad-input", title: "Gamepad Input", description: "Controller support", icon: "🎮", xpReward: 125 },
    { id: "touch-input", title: "Touch Input", description: "Mobile controls", icon: "👆", xpReward: 125 },
    { id: "input-buffering", title: "Input Buffering", description: "Responsive controls", icon: "📥", xpReward: 150 },
    
    // Week 5: Game Physics
    { id: "game-physics", title: "Physics Basics", description: "Movement fundamentals", icon: "🎱", xpReward: 150 },
    { id: "velocity-acceleration", title: "Velocity & Acceleration", description: "Motion mechanics", icon: "🚀", xpReward: 125 },
    { id: "gravity", title: "Gravity", description: "Falling objects", icon: "⬇️", xpReward: 125 },
    { id: "jumping-mechanics", title: "Jumping Mechanics", description: "Jump physics", icon: "⬆️", xpReward: 150 },
    { id: "friction", title: "Friction", description: "Surface resistance", icon: "🔴", xpReward: 125 },
    { id: "projectile-motion", title: "Projectile Motion", description: "Throwing objects", icon: "🎯", xpReward: 150 },
    { id: "physics-engines", title: "Physics Engines", description: "Box2D, Matter.js", icon: "⚙️", xpReward: 175 },
    
    // Week 6: Audio in Games
    { id: "audio-in-games", title: "Game Audio Basics", description: "Sound in games", icon: "🔊", xpReward: 100 },
    { id: "sound-effects", title: "Sound Effects", description: "SFX design", icon: "🔔", xpReward: 100 },
    { id: "music-systems", title: "Music Systems", description: "Background music", icon: "🎵", xpReward: 125 },
    { id: "audio-formats", title: "Audio Formats", description: "MP3, WAV, OGG", icon: "📁", xpReward: 100 },
    { id: "spatial-audio", title: "Spatial Audio", description: "3D sound", icon: "🔉", xpReward: 150 },
    { id: "audio-optimization", title: "Audio Optimization", description: "Memory and streaming", icon: "⚡", xpReward: 125 },
    
    // Week 7: Level Design
    { id: "level-design", title: "Level Design Basics", description: "Creating levels", icon: "🗺️", xpReward: 125 },
    { id: "difficulty-curves", title: "Difficulty Curves", description: "Progression design", icon: "📈", xpReward: 150 },
    { id: "player-guidance", title: "Player Guidance", description: "Visual cues", icon: "👆", xpReward: 125 },
    { id: "pacing", title: "Pacing", description: "Flow and rhythm", icon: "🎵", xpReward: 150 },
    { id: "level-editors", title: "Level Editors", description: "Building tools", icon: "🔧", xpReward: 150 },
    { id: "procedural-generation", title: "Procedural Generation", description: "Random content", icon: "🎲", xpReward: 200 },
    
    // Week 8: AI in Games
    { id: "game-ai-intro", title: "Game AI Introduction", description: "NPC behavior", icon: "🤖", xpReward: 125 },
    { id: "state-machines", title: "State Machines", description: "FSM for AI", icon: "🔀", xpReward: 150 },
    { id: "pathfinding", title: "Pathfinding", description: "A* algorithm", icon: "🛤️", xpReward: 200 },
    { id: "behavior-trees", title: "Behavior Trees", description: "Complex AI", icon: "🌳", xpReward: 200 },
    { id: "steering-behaviors", title: "Steering Behaviors", description: "Movement AI", icon: "🚗", xpReward: 175 },
    { id: "enemy-ai", title: "Enemy AI", description: "Combat behavior", icon: "👾", xpReward: 175 },
    
    // Week 9: UI & UX
    { id: "game-ui", title: "Game UI Design", description: "Interface design", icon: "🖥️", xpReward: 125 },
    { id: "hud-design", title: "HUD Design", description: "In-game displays", icon: "📊", xpReward: 125 },
    { id: "menus", title: "Menu Systems", description: "Navigation design", icon: "📋", xpReward: 125 },
    { id: "feedback-systems", title: "Feedback Systems", description: "Player feedback", icon: "💬", xpReward: 150 },
    { id: "accessibility-games", title: "Accessibility", description: "Inclusive design", icon: "♿", xpReward: 150 },
    { id: "localization", title: "Localization", description: "Multi-language support", icon: "🌍", xpReward: 125 },
    
    // Week 10: Game Engine Basics
    { id: "game-engines", title: "Game Engines Overview", description: "Unity, Godot, Unreal", icon: "⚙️", xpReward: 125 },
    { id: "unity-basics", title: "Unity Basics", description: "Getting started", icon: "🎮", xpReward: 150 },
    { id: "godot-basics", title: "Godot Basics", description: "Open source engine", icon: "🎯", xpReward: 150 },
    { id: "scene-management", title: "Scene Management", description: "Organizing game levels", icon: "🗂️", xpReward: 125 },
    { id: "game-optimization", title: "Optimization", description: "Performance tuning", icon: "🚀", xpReward: 175 },
    { id: "game-publishing", title: "Publishing Games", description: "Distribution platforms", icon: "📤", xpReward: 150 },
    
    // Week 11: Multiplayer & Networking
    { id: "multiplayer-basics", title: "Multiplayer Basics", description: "Networked games", icon: "👥", xpReward: 175 },
    { id: "client-server", title: "Client-Server Model", description: "Game networking architecture", icon: "🖥️", xpReward: 175 },
    { id: "p2p-networking", title: "P2P Networking", description: "Peer-to-peer games", icon: "🔗", xpReward: 150 },
    { id: "lag-compensation", title: "Lag Compensation", description: "Handling latency", icon: "⏱️", xpReward: 200 },
    { id: "game-serialization", title: "Game Serialization", description: "Save and load systems", icon: "💾", xpReward: 150 },
    { id: "replay-systems", title: "Replay Systems", description: "Recording gameplay", icon: "📹", xpReward: 150 },
    
    // Week 12: Monetization & Game Business
    { id: "monetization", title: "Game Monetization", description: "Revenue models", icon: "💰", xpReward: 125 },
    { id: "game-testing", title: "Game Testing", description: "QA for games", icon: "🧪", xpReward: 150 },
    { id: "game-analytics", title: "Game Analytics", description: "Player data analysis", icon: "📊", xpReward: 150 },
    { id: "game-marketing", title: "Game Marketing", description: "Promoting your game", icon: "📢", xpReward: 125 },
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
  "computer-systems": { title: "Computer Systems & Networking", icon: "🖥️" },
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
