// AIblty Learning Experience System - Complete Specification

export type SkillLevel = 'novice' | 'apprentice' | 'practitioner' | 'automator' | 'mentor';

export interface Zone {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  games: string[];
  skills: string[];
}

export interface GameMapping {
  id: string;
  name: string;
  zone: string;
  cognitiveGoal: 'recognition' | 'recall' | 'procedural' | 'problem-solving' | 'transfer';
  skills: string[];
  difficulties: {
    easy: DifficultyConfig;
    medium: DifficultyConfig;
    hard: DifficultyConfig;
    expert: DifficultyConfig;
  };
  automationMetrics: {
    speedTarget: number; // seconds per item
    accuracyTarget: number; // percentage
    noHintsRequired: boolean;
    streakRequired: number;
  };
}

export interface DifficultyConfig {
  timeLimit?: number;
  complexity: number;
  hintsAvailable: number;
  penaltyMultiplier: number;
  xpMultiplier: number;
}

export interface SkillMastery {
  skillId: string;
  name: string;
  category: string;
  level: SkillLevel;
  automationScore: number; // 0-100
  accuracy: number;
  avgSpeed: number;
  lastPracticed: Date | null;
  totalAttempts: number;
  correctAttempts: number;
  streakDays: number;
}

export interface LevelRequirements {
  level: SkillLevel;
  minAccuracy: number;
  minAttempts: number;
  maxAvgSpeed: number; // seconds
  streakRequired: number;
  xpRequired: number;
}

// ============ ZONES CONFIGURATION ============
export const zones: Zone[] = [
  {
    id: 'logic-district',
    name: 'Logic District',
    description: 'Master control flow, patterns, and code structure',
    icon: '🧠',
    color: 'primary',
    gradient: 'from-primary/20 via-primary/10 to-primary/5',
    games: ['pattern', 'structure-builder', 'ordering', 'typing', 'debugging'],
    skills: ['if-else', 'while-loops', 'for-loops', 'switch', 'try-catch', 'methods', 'classes']
  },
  {
    id: 'data-city',
    name: 'Data City',
    description: 'Build databases, query data, and master spreadsheets',
    icon: '🏙️',
    color: 'success',
    gradient: 'from-success/20 via-success/10 to-success/5',
    games: ['erd-builder', 'sql-query', 'graph-visualizer', 'excel-master'],
    skills: ['normalization', 'foreign-keys', 'sql-select', 'sql-joins', 'functions', 'pivot-tables', 'graphs']
  },
  {
    id: 'security-sector',
    name: 'Security Sector',
    description: 'Defend systems and design secure architectures',
    icon: '🛡️',
    color: 'warning',
    gradient: 'from-warning/20 via-warning/10 to-warning/5',
    games: ['cybersecurity', 'system-design'],
    skills: ['encryption', 'authentication', 'threats', 'firewalls', 'security-policies', 'risk-assessment']
  },
  {
    id: 'algorithm-arcade',
    name: 'Algorithm Arcade',
    description: 'Race against time and master computational thinking',
    icon: '⚡',
    color: 'secondary',
    gradient: 'from-secondary/20 via-secondary/10 to-secondary/5',
    games: ['complexity-arcade', 'speed', 'pacman'],
    skills: ['big-o', 'sorting', 'searching', 'recursion', 'optimization']
  },
  {
    id: 'ai-lab',
    name: 'AI Laboratory',
    description: 'Explore machine learning and intelligent systems',
    icon: '🤖',
    color: 'accent',
    gradient: 'from-accent/20 via-accent/10 to-accent/5',
    games: ['ai-data', 'spaced-rep', 'flashcards'],
    skills: ['ml-basics', 'neural-networks', 'data-preprocessing', 'model-evaluation', 'feature-engineering']
  },
  {
    id: 'dev-studio',
    name: 'Dev Studio',
    description: 'Plan projects and model business systems',
    icon: '🎯',
    color: 'primary',
    gradient: 'from-primary/20 via-accent/10 to-success/5',
    games: ['project-planner', 'use-case', 'game-dev'],
    skills: ['gantt-charts', 'kanban', 'uml', 'requirements', 'agile', 'game-loops', 'physics']
  }
];

// ============ GAME MAPPINGS ============
export const gameMappings: GameMapping[] = [
  {
    id: 'pattern',
    name: 'Pattern Master',
    zone: 'logic-district',
    cognitiveGoal: 'recognition',
    skills: ['if-else', 'while-loops', 'for-loops', 'switch'],
    difficulties: {
      easy: { timeLimit: 60, complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 45, complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 30, complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 20, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 5, accuracyTarget: 95, noHintsRequired: true, streakRequired: 10 }
  },
  {
    id: 'typing',
    name: 'Code Typing',
    zone: 'logic-district',
    cognitiveGoal: 'procedural',
    skills: ['syntax', 'methods', 'classes', 'variables'],
    difficulties: {
      easy: { timeLimit: 120, complexity: 1, hintsAvailable: 5, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 90, complexity: 2, hintsAvailable: 3, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 60, complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 45, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 3, accuracyTarget: 98, noHintsRequired: true, streakRequired: 15 }
  },
  {
    id: 'ordering',
    name: 'Code Ordering',
    zone: 'logic-district',
    cognitiveGoal: 'procedural',
    skills: ['program-structure', 'methods', 'control-flow'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 10, accuracyTarget: 95, noHintsRequired: true, streakRequired: 8 }
  },
  {
    id: 'debugging',
    name: 'Bug Hunter',
    zone: 'logic-district',
    cognitiveGoal: 'problem-solving',
    skills: ['debugging', 'syntax-errors', 'logic-errors', 'runtime-errors'],
    difficulties: {
      easy: { timeLimit: 180, complexity: 1, hintsAvailable: 5, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 120, complexity: 2, hintsAvailable: 3, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 90, complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 60, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 30, accuracyTarget: 90, noHintsRequired: true, streakRequired: 5 }
  },
  {
    id: 'structure-builder',
    name: 'Structure Builder',
    zone: 'logic-district',
    cognitiveGoal: 'procedural',
    skills: ['classes', 'methods', 'program-structure'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 45, accuracyTarget: 90, noHintsRequired: true, streakRequired: 5 }
  },
  {
    id: 'erd-builder',
    name: 'ERD Builder',
    zone: 'data-city',
    cognitiveGoal: 'problem-solving',
    skills: ['normalization', 'foreign-keys', 'primary-keys', 'relationships'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 60, accuracyTarget: 90, noHintsRequired: false, streakRequired: 5 }
  },
  {
    id: 'sql-query',
    name: 'SQL Query',
    zone: 'data-city',
    cognitiveGoal: 'procedural',
    skills: ['sql-select', 'sql-joins', 'sql-where', 'sql-groupby', 'sql-aggregate'],
    difficulties: {
      easy: { timeLimit: 120, complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 90, complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 60, complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 45, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 30, accuracyTarget: 95, noHintsRequired: true, streakRequired: 10 }
  },
  {
    id: 'excel-master',
    name: 'Excel Master',
    zone: 'data-city',
    cognitiveGoal: 'procedural',
    skills: ['formulas', 'functions', 'pivot-tables', 'vlookup', 'conditional-formatting'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 20, accuracyTarget: 95, noHintsRequired: true, streakRequired: 8 }
  },
  {
    id: 'graph-visualizer',
    name: 'Graph Explorer',
    zone: 'data-city',
    cognitiveGoal: 'recognition',
    skills: ['graphs', 'trees', 'traversal', 'shortest-path'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 15, accuracyTarget: 90, noHintsRequired: true, streakRequired: 6 }
  },
  {
    id: 'cybersecurity',
    name: 'Security Challenge',
    zone: 'security-sector',
    cognitiveGoal: 'problem-solving',
    skills: ['encryption', 'authentication', 'threats', 'firewalls', 'security-policies'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 30, accuracyTarget: 90, noHintsRequired: false, streakRequired: 5 }
  },
  {
    id: 'system-design',
    name: 'System Design',
    zone: 'security-sector',
    cognitiveGoal: 'transfer',
    skills: ['architecture', 'stakeholders', 'requirements', 'risk-assessment'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 5, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 3, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 120, accuracyTarget: 85, noHintsRequired: false, streakRequired: 3 }
  },
  {
    id: 'complexity-arcade',
    name: 'Complexity Arcade',
    zone: 'algorithm-arcade',
    cognitiveGoal: 'recognition',
    skills: ['big-o', 'time-complexity', 'space-complexity', 'optimization'],
    difficulties: {
      easy: { timeLimit: 60, complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 45, complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 30, complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 20, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 5, accuracyTarget: 95, noHintsRequired: true, streakRequired: 12 }
  },
  {
    id: 'speed',
    name: 'Speed Challenge',
    zone: 'algorithm-arcade',
    cognitiveGoal: 'procedural',
    skills: ['quick-recall', 'syntax', 'patterns'],
    difficulties: {
      easy: { timeLimit: 60, complexity: 1, hintsAvailable: 2, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { timeLimit: 45, complexity: 2, hintsAvailable: 1, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { timeLimit: 30, complexity: 3, hintsAvailable: 0, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { timeLimit: 20, complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 3, accuracyTarget: 95, noHintsRequired: true, streakRequired: 15 }
  },
  {
    id: 'pacman',
    name: 'Pacman Coder',
    zone: 'algorithm-arcade',
    cognitiveGoal: 'procedural',
    skills: ['syntax', 'keywords', 'quick-recall'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 0, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 0, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 0, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 120, accuracyTarget: 80, noHintsRequired: true, streakRequired: 5 }
  },
  {
    id: 'ai-data',
    name: 'AI & ML',
    zone: 'ai-lab',
    cognitiveGoal: 'recognition',
    skills: ['ml-basics', 'neural-networks', 'data-preprocessing', 'model-evaluation'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 20, accuracyTarget: 90, noHintsRequired: false, streakRequired: 5 }
  },
  {
    id: 'flashcards',
    name: 'Mnemonic Cards',
    zone: 'ai-lab',
    cognitiveGoal: 'recall',
    skills: ['memory', 'patterns', 'concepts'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 5, accuracyTarget: 95, noHintsRequired: true, streakRequired: 10 }
  },
  {
    id: 'spaced-rep',
    name: 'Spaced Repetition',
    zone: 'ai-lab',
    cognitiveGoal: 'recall',
    skills: ['long-term-memory', 'concepts', 'patterns'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 3, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 10, accuracyTarget: 90, noHintsRequired: true, streakRequired: 7 }
  },
  {
    id: 'project-planner',
    name: 'Project Planner',
    zone: 'dev-studio',
    cognitiveGoal: 'problem-solving',
    skills: ['gantt-charts', 'kanban', 'critical-path', 'resource-allocation'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 60, accuracyTarget: 85, noHintsRequired: false, streakRequired: 4 }
  },
  {
    id: 'use-case',
    name: 'Use Case Diagrams',
    zone: 'dev-studio',
    cognitiveGoal: 'problem-solving',
    skills: ['uml', 'actors', 'use-cases', 'relationships'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 45, accuracyTarget: 90, noHintsRequired: false, streakRequired: 5 }
  },
  {
    id: 'game-dev',
    name: 'Game Dev',
    zone: 'dev-studio',
    cognitiveGoal: 'recognition',
    skills: ['game-loops', 'physics', 'sprites', 'collision-detection'],
    difficulties: {
      easy: { complexity: 1, hintsAvailable: 4, penaltyMultiplier: 0.5, xpMultiplier: 1 },
      medium: { complexity: 2, hintsAvailable: 2, penaltyMultiplier: 0.75, xpMultiplier: 1.5 },
      hard: { complexity: 3, hintsAvailable: 1, penaltyMultiplier: 1, xpMultiplier: 2 },
      expert: { complexity: 4, hintsAvailable: 0, penaltyMultiplier: 1.5, xpMultiplier: 3 }
    },
    automationMetrics: { speedTarget: 20, accuracyTarget: 90, noHintsRequired: false, streakRequired: 5 }
  }
];

// ============ LEVEL REQUIREMENTS ============
export const levelRequirements: LevelRequirements[] = [
  { level: 'novice', minAccuracy: 0, minAttempts: 0, maxAvgSpeed: 999, streakRequired: 0, xpRequired: 0 },
  { level: 'apprentice', minAccuracy: 60, minAttempts: 20, maxAvgSpeed: 60, streakRequired: 3, xpRequired: 100 },
  { level: 'practitioner', minAccuracy: 75, minAttempts: 50, maxAvgSpeed: 30, streakRequired: 7, xpRequired: 500 },
  { level: 'automator', minAccuracy: 90, minAttempts: 100, maxAvgSpeed: 15, streakRequired: 14, xpRequired: 1500 },
  { level: 'mentor', minAccuracy: 95, minAttempts: 200, maxAvgSpeed: 8, streakRequired: 30, xpRequired: 5000 }
];

// ============ XP SYSTEM ============
export const xpConfig = {
  correctAnswer: 10,
  firstTrySolve: 25,
  speedBonus: { fast: 15, veryFast: 25, instant: 50 },
  streakBonus: { 3: 10, 7: 25, 14: 50, 30: 100 },
  noHintBonus: 15,
  perfectSession: 100,
  dailyGoalComplete: 50,
  levelUp: 200
};

// ============ FEEDBACK MESSAGES ============
export const feedbackMessages = {
  success: {
    recognition: [
      "Pattern locked in! Your {skill} instinct is sharpening.",
      "Instant recognition! You identified that {skill} pattern in {time}s.",
      "Your brain now auto-detects {skill} structures. Keep it up!"
    ],
    procedural: [
      "Muscle memory activated! {skill} syntax flows naturally now.",
      "Code flows like breathing. {accuracy}% accuracy on {skill}!",
      "Your fingers know {skill} before your brain does. Automation achieved!"
    ],
    problemSolving: [
      "Problem dismantled! Your {skill} problem-solving is leveling up.",
      "Complex challenge conquered! {skill} mastery growing.",
      "You're thinking like a pro. {skill} solutions come naturally now."
    ]
  },
  improvement: {
    speed: "You're hesitating on {skill}—try Speed Challenge to build automaticity.",
    accuracy: "A few {skill} patterns slipped by. Replay Pattern Master for quick drilling.",
    hints: "You relied on hints for {skill}. Practice without training wheels next time!"
  },
  levelUp: {
    apprentice: "🎓 Welcome to Apprentice! You're building solid foundations in {skill}.",
    practitioner: "⚡ Practitioner unlocked! {skill} is becoming second nature.",
    automator: "🤖 AUTOMATOR achieved! {skill} now runs on autopilot in your brain.",
    mentor: "👑 MENTOR status! You can now teach others about {skill}."
  },
  streak: {
    3: "🔥 3-day streak! Your {skill} neurons are strengthening.",
    7: "🔥 7-day streak! {skill} pathways are now permanent.",
    14: "🔥🔥 14-day streak! {skill} is hardwired into your brain.",
    30: "🔥🔥🔥 30-day streak! {skill} mastery is now LEGENDARY!"
  },
  missions: {
    dataCity: "🏙️ MISSION: Data City's network is overloaded! Design an optimized ERD and write SQL queries to stabilize the system.",
    securitySector: "🛡️ ALERT: Security breach detected! Identify vulnerabilities and implement countermeasures before the attack spreads.",
    logicDistrict: "🧠 CHALLENGE: The Logic District mainframe needs refactoring. Fix the control flow bugs to restore operations.",
    algorithmArcade: "⚡ SPEED RUN: Beat the Algorithm Arcade record! Classify 20 complexity patterns in under 2 minutes.",
    aiLab: "🤖 EXPERIMENT: Train the AI Lab's neural network by correctly labeling 50 data points.",
    devStudio: "🎯 PROJECT: The Dev Studio needs a new game prototype. Design the core loop and plan the sprint."
  }
};

// ============ SESSION FLOW ============
export interface SessionFlow {
  phase: 'diagnostic' | 'lesson' | 'practice' | 'challenge' | 'reflection';
  duration: number; // minutes
  activities: string[];
}

export const sessionFlows: Record<SkillLevel, SessionFlow[]> = {
  novice: [
    { phase: 'diagnostic', duration: 2, activities: ['Quick skill check - 5 questions'] },
    { phase: 'lesson', duration: 8, activities: ['Micro-lesson with examples', 'Interactive walkthrough'] },
    { phase: 'practice', duration: 12, activities: ['Pattern Master (Easy)', 'Code Typing (Easy)', 'Code Ordering (Easy)'] },
    { phase: 'reflection', duration: 3, activities: ['3-point recap', 'Next steps preview'] }
  ],
  apprentice: [
    { phase: 'diagnostic', duration: 2, activities: ['Skill assessment - 8 questions'] },
    { phase: 'lesson', duration: 5, activities: ['Focused concept review'] },
    { phase: 'practice', duration: 15, activities: ['Pattern Master (Medium)', 'Speed Challenge (Easy)', 'Bug Hunter (Easy)'] },
    { phase: 'challenge', duration: 5, activities: ['Timed challenge mode'] },
    { phase: 'reflection', duration: 3, activities: ['Performance analysis', 'Weak area identification'] }
  ],
  practitioner: [
    { phase: 'diagnostic', duration: 2, activities: ['Quick check - 10 questions'] },
    { phase: 'practice', duration: 18, activities: ['Speed Challenge (Medium)', 'Complexity Arcade', 'System Design'] },
    { phase: 'challenge', duration: 8, activities: ['Real-world task', 'Expert-level game'] },
    { phase: 'reflection', duration: 2, activities: ['Automation metrics review'] }
  ],
  automator: [
    { phase: 'diagnostic', duration: 1, activities: ['Speed diagnostic'] },
    { phase: 'challenge', duration: 25, activities: ['Expert games only', 'Real-world projects', 'Teaching mode'] },
    { phase: 'reflection', duration: 4, activities: ['Mastery verification', 'Mentor preparation'] }
  ],
  mentor: [
    { phase: 'challenge', duration: 30, activities: ['Create content', 'Review others', 'Advanced challenges'] }
  ]
};

// ============ LEARNING TRACKS ============
export interface LearningTrack {
  id: string;
  name: string;
  icon: string;
  levels: TrackLevel[];
}

export interface TrackLevel {
  level: SkillLevel;
  outcomes: string[];
  games: string[];
  unlockConditions: {
    minXp: number;
    minAccuracy: number;
    requiredSkills: string[];
    streakDays: number;
  };
}

export const learningTracks: LearningTrack[] = [
  {
    id: 'java-programming',
    name: 'Java Programming',
    icon: '☕',
    levels: [
      {
        level: 'novice',
        outcomes: ['Recognize basic syntax', 'Write simple variables', 'Understand data types'],
        games: ['pattern', 'typing', 'ordering'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Write if/else without reference', 'Create loops confidently', 'Use methods effectively'],
        games: ['pattern', 'typing', 'ordering', 'debugging', 'speed'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['variables', 'data-types'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Debug code independently', 'Estimate complexity on sight', 'Write clean OOP code'],
        games: ['debugging', 'complexity-arcade', 'structure-builder', 'speed'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['if-else', 'loops', 'methods'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Code instinctively', 'Refactor without thinking', 'Apply patterns automatically'],
        games: ['speed', 'pacman', 'complexity-arcade', 'system-design'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['oop', 'debugging', 'complexity'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Teach others', 'Create challenges', 'Review and guide'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'systems-analysis',
    name: 'Systems Analysis',
    icon: '🌌',
    levels: [
      {
        level: 'novice',
        outcomes: ['Identify stakeholders', 'List basic requirements', 'Understand system boundaries'],
        games: ['use-case', 'project-planner'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Create use case diagrams', 'Write user stories', 'Map processes'],
        games: ['use-case', 'project-planner', 'system-design'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['stakeholders', 'requirements'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Design ERDs independently', 'Model complex processes', 'Identify risks'],
        games: ['erd-builder', 'system-design', 'project-planner'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['use-cases', 'processes'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant requirement analysis', 'Automatic pattern recognition', 'Rapid prototyping'],
        games: ['erd-builder', 'system-design', 'sql-query'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['erd', 'risks', 'modelling'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Lead system design', 'Review architectures', 'Mentor analysts'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'maths-computing',
    name: 'Maths for Computing',
    icon: '🔢',
    levels: [
      {
        level: 'novice',
        outcomes: ['Basic number operations', 'Simple logic expressions', 'Set notation'],
        games: ['pattern', 'complexity-arcade'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Boolean algebra', 'Set operations', 'Basic probability'],
        games: ['pattern', 'graph-visualizer', 'speed'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['arithmetic', 'logic-basics'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Complexity analysis', 'Graph algorithms', 'Discrete structures'],
        games: ['complexity-arcade', 'graph-visualizer', 'speed'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['boolean', 'sets', 'probability'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant Big-O recognition', 'Automatic proof patterns', 'Rapid calculation'],
        games: ['complexity-arcade', 'speed', 'graph-visualizer'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['complexity', 'graphs', 'discrete'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Teach mathematical thinking', 'Create proofs', 'Guide problem solving'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔐',
    levels: [
      {
        level: 'novice',
        outcomes: ['Identify common threats', 'Understand encryption basics', 'Password best practices'],
        games: ['cybersecurity', 'pattern'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Recognize attack patterns', 'Implement basic security', 'Understand authentication'],
        games: ['cybersecurity', 'system-design', 'speed'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['threats', 'encryption-basics'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Conduct risk assessments', 'Design secure systems', 'Incident response'],
        games: ['cybersecurity', 'system-design', 'debugging'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['attacks', 'authentication'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant threat recognition', 'Automatic security review', 'Rapid incident analysis'],
        games: ['cybersecurity', 'speed', 'system-design'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['risk', 'secure-design', 'incident'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Lead security teams', 'Create security policies', 'Train security analysts'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'ai-data-science',
    name: 'AI & Data Science',
    icon: '🤖',
    levels: [
      {
        level: 'novice',
        outcomes: ['Understand AI concepts', 'Basic data types', 'Simple visualizations'],
        games: ['ai-data', 'excel-master', 'pattern'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Data preprocessing', 'Basic ML models', 'Feature understanding'],
        games: ['ai-data', 'excel-master', 'sql-query', 'graph-visualizer'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['ai-concepts', 'data-basics'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Model evaluation', 'Neural network basics', 'Data pipeline design'],
        games: ['ai-data', 'complexity-arcade', 'sql-query'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['preprocessing', 'ml-basics'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant model selection', 'Automatic data cleaning', 'Rapid prototyping'],
        games: ['ai-data', 'speed', 'system-design'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['evaluation', 'neural-nets', 'pipelines'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Lead AI projects', 'Design experiments', 'Guide data scientists'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'business-systems',
    name: 'Business Systems',
    icon: '💼',
    levels: [
      {
        level: 'novice',
        outcomes: ['Understand business processes', 'Basic Excel formulas', 'Data organization'],
        games: ['excel-master', 'project-planner'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Create spreadsheet models', 'Project planning basics', 'Process mapping'],
        games: ['excel-master', 'project-planner', 'use-case'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['processes', 'excel-basics'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Database design', 'Advanced analytics', 'System integration'],
        games: ['erd-builder', 'sql-query', 'system-design', 'excel-master'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['models', 'planning', 'processes'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant process optimization', 'Automatic reporting', 'Rapid system design'],
        games: ['system-design', 'sql-query', 'erd-builder'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['database', 'analytics', 'integration'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Lead business analysis', 'Design enterprise systems', 'Guide analysts'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: '🎮',
    levels: [
      {
        level: 'novice',
        outcomes: ['Understand game loops', 'Basic sprites', 'Simple interactions'],
        games: ['game-dev', 'pacman', 'pattern'],
        unlockConditions: { minXp: 0, minAccuracy: 0, requiredSkills: [], streakDays: 0 }
      },
      {
        level: 'apprentice',
        outcomes: ['Collision detection', 'Animation basics', 'Input handling'],
        games: ['game-dev', 'pacman', 'typing', 'speed'],
        unlockConditions: { minXp: 200, minAccuracy: 70, requiredSkills: ['game-loops', 'sprites'], streakDays: 3 }
      },
      {
        level: 'practitioner',
        outcomes: ['Physics systems', 'AI behaviors', 'Level design'],
        games: ['game-dev', 'complexity-arcade', 'system-design'],
        unlockConditions: { minXp: 800, minAccuracy: 80, requiredSkills: ['collision', 'animation', 'input'], streakDays: 7 }
      },
      {
        level: 'automator',
        outcomes: ['Instant mechanic design', 'Automatic optimization', 'Rapid prototyping'],
        games: ['game-dev', 'pacman', 'system-design'],
        unlockConditions: { minXp: 2500, minAccuracy: 90, requiredSkills: ['physics', 'ai', 'level-design'], streakDays: 14 }
      },
      {
        level: 'mentor',
        outcomes: ['Lead game projects', 'Design game systems', 'Guide developers'],
        games: ['all'],
        unlockConditions: { minXp: 8000, minAccuracy: 95, requiredSkills: ['all'], streakDays: 30 }
      }
    ]
  }
];

// Helper functions
export function getZoneById(zoneId: string): Zone | undefined {
  return zones.find(zone => zone.id === zoneId);
}

export function getZoneByGameId(gameId: string): Zone | undefined {
  return zones.find(zone => zone.games.includes(gameId));
}

export function getGamesByZone(zoneId: string): GameMapping[] {
  const zone = zones.find(z => z.id === zoneId);
  if (!zone) return [];
  return gameMappings.filter(game => zone.games.includes(game.id));
}

export function calculateAutomationScore(
  accuracy: number,
  avgSpeed: number,
  hintsUsed: number,
  totalAttempts: number,
  targetSpeed: number
): number {
  const accuracyScore = accuracy * 0.4;
  const speedScore = Math.max(0, (1 - avgSpeed / (targetSpeed * 2)) * 100) * 0.3;
  const hintsScore = Math.max(0, (1 - hintsUsed / totalAttempts) * 100) * 0.2;
  const volumeScore = Math.min(100, totalAttempts / 2) * 0.1;
  return Math.round(accuracyScore + speedScore + hintsScore + volumeScore);
}

export function determineLevel(mastery: SkillMastery): SkillLevel {
  for (let i = levelRequirements.length - 1; i >= 0; i--) {
    const req = levelRequirements[i];
    if (
      mastery.accuracy >= req.minAccuracy &&
      mastery.totalAttempts >= req.minAttempts &&
      mastery.avgSpeed <= req.maxAvgSpeed &&
      mastery.streakDays >= req.streakRequired
    ) {
      return req.level;
    }
  }
  return 'novice';
}

export function getFeedbackMessage(
  type: 'success' | 'improvement' | 'levelUp' | 'streak',
  category: string,
  data: Record<string, string | number>
): string {
  if (type === 'success') {
    const successMessages = feedbackMessages.success;
    const messageArray = successMessages[category as keyof typeof successMessages] || successMessages.recognition;
    const template = messageArray[Math.floor(Math.random() * messageArray.length)];
    return template.replace(/\{(\w+)\}/g, (_, key) => String(data[key] || key));
  }
  
  const messages = feedbackMessages[type];
  const template = messages[category as keyof typeof messages] || '';
  return String(template).replace(/\{(\w+)\}/g, (_, key) => String(data[key] || key));
}
