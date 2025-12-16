import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GameMode, User, Module, Badge, GameProgress } from "@/types/game";

interface GameContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  modules: Module[];
  currentModule: Module | null;
  setCurrentModule: (module: Module | null) => void;
  xp: number;
  addXp: (amount: number) => void;
  streak: number;
  badges: Badge[];
  progress: GameProgress[];
  updateProgress: (progress: GameProgress) => void;
  playSound: (sound: "success" | "error" | "click" | "levelUp" | "badge") => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Mock modules data
const initialModules: Module[] = [
  {
    id: "java-foundations",
    title: "Java Galaxy",
    description: "Master the basics of Java programming through cosmic adventures",
    icon: "🚀",
    color: "primary",
    lessons: [],
    unlocked: true,
    progress: 0,
  },
  {
    id: "systems-analysis",
    title: "System Nebula",
    description: "Learn systems thinking and design through interactive challenges",
    icon: "🌌",
    color: "accent",
    lessons: [],
    unlocked: true,
    progress: 0,
  },
  {
    id: "math-computing",
    title: "Math Constellation",
    description: "Explore mathematical concepts through visual games",
    icon: "✨",
    color: "secondary",
    lessons: [],
    unlocked: true,
    progress: 0,
  },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("kid");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modules] = useState<Module[]>(initialModules);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [progress, setProgress] = useState<GameProgress[]>([]);

  // Load saved state from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("aibltycode-mode") as GameMode;
    const savedSound = localStorage.getItem("aibltycode-sound");
    const savedXp = localStorage.getItem("aibltycode-xp");
    const savedStreak = localStorage.getItem("aibltycode-streak");

    if (savedMode) setGameMode(savedMode);
    if (savedSound) setSoundEnabled(savedSound === "true");
    if (savedXp) setXp(parseInt(savedXp, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem("aibltycode-mode", gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem("aibltycode-sound", String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("aibltycode-xp", String(xp));
  }, [xp]);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
    // Check for level up or badge unlock
  };

  const updateProgress = (newProgress: GameProgress) => {
    setProgress((prev) => {
      const existing = prev.findIndex((p) => p.lessonId === newProgress.lessonId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newProgress;
        return updated;
      }
      return [...prev, newProgress];
    });
  };

  const playSound = (sound: "success" | "error" | "click" | "levelUp" | "badge") => {
    if (!soundEnabled) return;
    
    // Web Audio API for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const soundConfigs = {
      success: { freq: 800, duration: 0.15, type: "sine" as OscillatorType },
      error: { freq: 200, duration: 0.3, type: "square" as OscillatorType },
      click: { freq: 600, duration: 0.05, type: "sine" as OscillatorType },
      levelUp: { freq: 1000, duration: 0.4, type: "sine" as OscillatorType },
      badge: { freq: 1200, duration: 0.5, type: "triangle" as OscillatorType },
    };
    
    const config = soundConfigs[sound];
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, audioContext.currentTime);
    
    if (sound === "levelUp" || sound === "badge") {
      oscillator.frequency.exponentialRampToValueAtTime(
        config.freq * 1.5,
        audioContext.currentTime + config.duration
      );
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        gameMode,
        setGameMode,
        soundEnabled,
        setSoundEnabled,
        modules,
        currentModule,
        setCurrentModule,
        xp,
        addXp,
        streak,
        badges,
        progress,
        updateProgress,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
