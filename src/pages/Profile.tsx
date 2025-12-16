import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Flame, Target, Star, Medal, Calendar, Zap } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { xp, streak, badges, gameMode } = useGame();

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  // Sample badges for display
  const sampleBadges = [
    { id: "1", name: "First Steps", icon: "🚀", earned: true, description: "Complete your first lesson" },
    { id: "2", name: "Code Typer", icon: "⌨️", earned: true, description: "Complete 5 typing challenges" },
    { id: "3", name: "Speed Demon", icon: "⚡", earned: false, description: "Score 200+ in Speed Challenge" },
    { id: "4", name: "Streak Master", icon: "🔥", earned: false, description: "Maintain a 7-day streak" },
    { id: "5", name: "Java Expert", icon: "☕", earned: false, description: "Complete Java module" },
    { id: "6", name: "System Thinker", icon: "🧠", earned: false, description: "Complete Systems module" },
  ];

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-4xl"
            whileHover={{ scale: 1.1 }}
          >
            👨‍🚀
          </motion.div>
          <h1 className="text-2xl font-black text-foreground mb-1">
            Space Coder
          </h1>
          <p className="text-muted-foreground">
            {gameMode === "kid" ? "🎮 Kid Mode" : "⚡ Pro Mode"}
          </p>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glow" className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold text-primary">Level {level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next level in</p>
                  <p className="text-lg font-bold text-foreground">{xpToNextLevel} XP</p>
                </div>
              </div>
              <Progress value={xpInCurrentLevel} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {xpInCurrentLevel}/100 XP
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <Card variant="default">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total XP</p>
                <p className="text-xl font-bold text-success">{xp}</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
                <p className="text-xl font-bold text-secondary">{streak}</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Medal className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Badges</p>
                <p className="text-xl font-bold text-accent">
                  {sampleBadges.filter(b => b.earned).length}/{sampleBadges.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Days Active</p>
                <p className="text-xl font-bold text-primary">1</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-accent" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {sampleBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className={`p-3 rounded-lg text-center transition-all ${
                      badge.earned
                        ? "bg-accent/10 border border-accent/30"
                        : "bg-muted/50 border border-border opacity-50"
                    }`}
                    whileHover={badge.earned ? { scale: 1.05 } : {}}
                  >
                    <span className="text-2xl block mb-1">
                      {badge.earned ? badge.icon : "🔒"}
                    </span>
                    <p className="text-xs font-medium text-foreground">
                      {badge.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign In CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card variant="glass">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                Save Your Progress
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to sync your progress across devices and compete on leaderboards!
              </p>
              <Button variant="hero">
                Create Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
