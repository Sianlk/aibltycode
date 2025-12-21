import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GameModeCard } from "@/components/dashboard/GameModeCard";
import { Mascot } from "@/components/dashboard/Mascot";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { Gamepad2, Flame, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const gameModes = [
  { id: "pattern", title: "Pattern Master", description: "if/else/while/switch", icon: "typing" as const, color: "primary" as const, emoji: "🧠" },
  { id: "structure-builder", title: "Structure Builder", description: "Build code blocks", icon: "ordering" as const, color: "accent" as const, emoji: "🏗️" },
  { id: "flashcards", title: "Mnemonic Cards", description: "Visual memory", icon: "typing" as const, color: "warning" as const, emoji: "🃏" },
  { id: "spaced-rep", title: "Spaced Repetition", description: "Long-term memory", icon: "typing" as const, color: "success" as const, emoji: "🧠" },
  { id: "debugging", title: "Bug Hunter", description: "Find & fix bugs", icon: "speed" as const, color: "warning" as const, emoji: "🐛" },
  { id: "typing", title: "Code Typing", description: "Practice syntax", icon: "typing" as const, color: "secondary" as const, emoji: "⌨️" },
  { id: "ordering", title: "Code Ordering", description: "Arrange blocks", icon: "ordering" as const, color: "success" as const, emoji: "🧩" },
  { id: "speed", title: "Speed Challenge", description: "Race the clock", icon: "speed" as const, color: "warning" as const, emoji: "⚡" },
  { id: "pacman", title: "Pacman Coder", description: "Collect code", icon: "speed" as const, color: "primary" as const, emoji: "👾" },
  { id: "system-design", title: "System Design", description: "Design systems", icon: "ordering" as const, color: "accent" as const, emoji: "🔧" },
  { id: "complexity-arcade", title: "Complexity Arcade", description: "Master Big-O", icon: "typing" as const, color: "secondary" as const, emoji: "📊" },
];

export default function Dashboard() {
  const { modules } = useGame();
  const { user, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ xp: 0, streak: 0, gamesPlayed: 0 });

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  // Fetch user stats from database
  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      const [profileRes, leaderboardRes] = await Promise.all([
        supabase.from('profiles').select('xp, streak_days').eq('id', user.id).single(),
        supabase.from('leaderboard').select('total_xp, current_streak, games_played').eq('user_id', user.id).maybeSingle(),
      ]);
      
      setStats({
        xp: leaderboardRes.data?.total_xp || profileRes.data?.xp || 0,
        streak: leaderboardRes.data?.current_streak || profileRes.data?.streak_days || 0,
        gamesPlayed: leaderboardRes.data?.games_played || 0,
      });
    };
    
    fetchStats();
  }, [user, progress]);

  const completedLessons = progress.filter(p => p.completed).length;
  const totalLessons = 31; // Total lessons across all modules
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Mascot */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Mascot />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.xp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6 text-warning" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-warning">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-success">{overallProgress}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <Button 
            size="lg" 
            className="flex-1 text-lg h-14 bg-primary hover:bg-primary/90"
            onClick={() => navigate('/module/java-foundations')}
          >
            🚀 Continue Learning
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 text-lg h-14 border-2"
            onClick={() => document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            Play Mini Games
          </Button>
        </motion.div>

        {/* Learning Path */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            Your Learning Path 🛤️
          </h2>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Game Modes */}
        <motion.section
          id="games-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            Mini Games 🎮
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gameModes.map((game, index) => (
              <GameModeCard key={game.id} {...game} index={index} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
