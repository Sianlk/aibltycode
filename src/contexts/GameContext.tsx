import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameMode, User, Module, Badge, GameProgress } from "@/types/game";
import { trackRetentionPing } from "@/lib/privacyAnalytics";

interface AccessibilitySettings {
  calmMode: boolean;
  dyslexiaFont: boolean;
  highContrast: boolean;
  stepByStep: boolean;
  audioReadAloud: boolean;
  reducedMotion: boolean;
}

export interface ParentalControls {
  enabled: boolean;
  dailyTimeLimit: number;
  allowedHours: { start: number; end: number };
}

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
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  parentalControls: ParentalControls;
  setParentalControls: (controls: ParentalControls) => void;
  isParentalLocked: boolean;
  setIsParentalLocked: (locked: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const defaultAccessibility: AccessibilitySettings = {
  calmMode: false,
  dyslexiaFont: false,
  highContrast: false,
  stepByStep: false,
  audioReadAloud: false,
  reducedMotion: false,
};

// All mastery modules, derived from the shared curriculum registry
const MODULE_COLORS = ["primary", "accent", "secondary"];
const initialModules: Module[] = Object.entries(moduleInfo).map(([id, info], i) => ({
  id,
  title: info.title,
  description: moduleDescriptions[id] ?? "",
  icon: info.icon,
  color: MODULE_COLORS[i % MODULE_COLORS.length],
  lessons: [],
  unlocked: true,
  progress: 0,
}));


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
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(defaultAccessibility);
  const [parentalControls, setParentalControls] = useState<ParentalControls>({
    enabled: false,
    dailyTimeLimit: 60,
    allowedHours: { start: 9, end: 21 }
  });
  const [isParentalLocked, setIsParentalLocked] = useState(true);

  // Load saved state from localStorage, then sync mode from profile DB
  useEffect(() => {
    const savedMode = localStorage.getItem("aibltycode-mode") as GameMode;
    const savedSound = localStorage.getItem("aibltycode-sound");
    const savedXp = localStorage.getItem("aibltycode-xp");
    const savedStreak = localStorage.getItem("aibltycode-streak");
    const savedAccessibility = localStorage.getItem("aibltycode-accessibility");

    if (savedMode) setGameMode(savedMode);
    if (savedSound) setSoundEnabled(savedSound === "true");
    if (savedXp) setXp(parseInt(savedXp, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedAccessibility) {
      try {
        setAccessibilityState({ ...defaultAccessibility, ...JSON.parse(savedAccessibility) });
      } catch {}
    }

    // Sync mode from database profile (overrides localStorage on login)
    const syncModeFromProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('mode, xp, streak_days')
          .eq('id', session.user.id)
          .single();
        if (profile?.mode) {
          setGameMode(profile.mode as GameMode);
          localStorage.setItem("aibltycode-mode", profile.mode);
        }
        if (profile?.xp) setXp(profile.xp);
        if (profile?.streak_days) setStreak(profile.streak_days);
      }
    };
    syncModeFromProfile();
  }, []);

  // Daily retention ping (opt-in only; no-op without consent)
  useEffect(() => {
    trackRetentionPing(streak);
  }, [streak]);

  // Apply accessibility classes to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dyslexia-font', accessibility.dyslexiaFont);
    root.classList.toggle('high-contrast', accessibility.highContrast);
    root.classList.toggle('reduced-motion', accessibility.reducedMotion);
  }, [accessibility]);

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

  useEffect(() => {
    localStorage.setItem("aibltycode-accessibility", JSON.stringify(accessibility));
  }, [accessibility]);

  const setAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilityState(prev => ({ ...prev, ...settings }));
  };

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
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

  // Debounce sound to prevent multiple plays
  const lastSoundRef = React.useRef<{ sound: string; time: number }>({ sound: '', time: 0 });
  
  const playSound = (sound: "success" | "error" | "click" | "levelUp" | "badge") => {
    if (!soundEnabled) return;
    
    // Debounce: prevent same sound within 100ms
    const now = Date.now();
    if (lastSoundRef.current.sound === sound && now - lastSoundRef.current.time < 100) {
      return;
    }
    lastSoundRef.current = { sound, time: now };
    
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
        accessibility,
        setAccessibility,
        parentalControls,
        setParentalControls,
        isParentalLocked,
        setIsParentalLocked,
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