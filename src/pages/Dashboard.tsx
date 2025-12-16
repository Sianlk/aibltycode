import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GameModeCard } from "@/components/dashboard/GameModeCard";
import { useGame } from "@/contexts/GameContext";
import { BookOpen, Gamepad2, Trophy, Target } from "lucide-react";

const gameModes = [
  {
    id: "typing",
    title: "Code Typing Practice",
    description: "Type code snippets with hints",
    icon: "typing" as const,
    color: "primary" as const,
  },
  {
    id: "ordering",
    title: "Code Ordering Puzzle",
    description: "Drag and drop code in order",
    icon: "ordering" as const,
    color: "accent" as const,
  },
  {
    id: "speed",
    title: "Speed Challenge",
    description: "Race against the clock",
    icon: "speed" as const,
    color: "secondary" as const,
  },
];

export default function Dashboard() {
  const { modules, xp, streak, gameMode } = useGame();

  // Calculate level from XP
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;
  const levelProgress = ((xp % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Welcome, Space Coder! {gameMode === "kid" ? "🚀" : "⚡"}
          </h1>
          <p className="text-muted-foreground">
            Continue your coding adventure through the galaxy
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-xl font-bold text-primary">{level}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total XP</p>
                <p className="text-xl font-bold text-success">{xp}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-xl font-bold text-secondary">{streak} days</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Level</p>
                <p className="text-xl font-bold text-accent">{xpToNextLevel} XP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Play Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Quick Play</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameModes.map((game, index) => (
              <GameModeCard key={game.id} {...game} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Learning Modules Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Learning Modules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
