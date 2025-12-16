import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GameModeCard } from "@/components/dashboard/GameModeCard";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Gamepad2, Trophy, Target, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const gameModes = [
  {
    id: "typing",
    title: "Code Typing",
    description: "Practice syntax with instant feedback",
    icon: "typing" as const,
    color: "primary" as const,
  },
  {
    id: "ordering",
    title: "Code Ordering",
    description: "Arrange code blocks correctly",
    icon: "ordering" as const,
    color: "accent" as const,
  },
  {
    id: "speed",
    title: "Speed Challenge",
    description: "Race against time",
    icon: "speed" as const,
    color: "secondary" as const,
  },
  {
    id: "pacman",
    title: "Pacman Coder",
    description: "Collect code, avoid bugs",
    icon: "speed" as const,
    color: "warning" as const,
  },
  {
    id: "system-builder",
    title: "System Builder",
    description: "Design systems visually",
    icon: "ordering" as const,
    color: "success" as const,
  },
  {
    id: "complexity-arcade",
    title: "Complexity Arcade",
    description: "Master Big-O notation",
    icon: "typing" as const,
    color: "primary" as const,
  },
];

export default function Dashboard() {
  const { modules, xp, streak } = useGame();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Continue mastering Java through play
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card rounded-xl p-4 border border-border">
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
          <div className="bg-card rounded-xl p-4 border border-border">
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
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-xl font-bold text-warning">{streak} days</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
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

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Game Modes</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
              <Crown className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameModes.map((game, index) => (
              <GameModeCard key={game.id} {...game} index={index} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Learning Paths</h2>
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
