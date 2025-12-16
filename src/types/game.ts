export type GameMode = "kid" | "pro";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  gameMode: GameMode;
  soundEnabled: boolean;
  xp: number;
  level: number;
  streak: number;
  createdAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  lessons: Lesson[];
  unlocked: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  story: string;
  content: string;
  example: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  completed: boolean;
  mastery: number; // 0-100
}

export interface Challenge {
  id: string;
  lessonId: string;
  type: "typing" | "ordering" | "speed" | "pacman" | "system-builder" | "complexity-arcade";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
}

export interface GameProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  mistakes: string[];
  completedAt?: Date;
}

export interface SpacedRepetitionItem {
  lessonId: string;
  nextReviewDate: Date;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}
