import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GameModeCard } from "@/components/dashboard/GameModeCard";
import { Mascot } from "@/components/dashboard/Mascot";
import { ZoneCard } from "@/components/dashboard/ZoneCard";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useAdmin } from "@/hooks/useAdmin";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { zones } from "@/data/learningSystem";
import { moduleLessons, moduleInfo } from "@/data/moduleData";
import { moduleGameMap, unlockedModuleGames, nextGameUnlockAt, getZoneState } from "@/data/moduleGameMap";
import { Lock } from "lucide-react";
import { ProjectSubmission } from "@/components/dashboard/ProjectSubmission";
import DailyChallenges from "@/components/dashboard/DailyChallenges";
import AchievementsGallery from "@/components/dashboard/AchievementsGallery";
import { Gamepad2, Flame, Star, Trophy, Crown, Settings, Map, BookOpen, BarChart3, Award, Target, Medal, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const gameModes = [
  // Core Learning Games
  { id: "pattern", title: "Pattern Master", description: "if/else/while/switch", icon: "typing" as const, color: "primary" as const, emoji: "🧠" },
  { id: "structure-builder", title: "Structure Builder", description: "Build code blocks", icon: "ordering" as const, color: "accent" as const, emoji: "🏗️" },
  { id: "flashcards", title: "Mnemonic Cards", description: "Visual memory", icon: "typing" as const, color: "warning" as const, emoji: "🃏" },
  { id: "spaced-rep", title: "Spaced Repetition", description: "Long-term memory", icon: "typing" as const, color: "success" as const, emoji: "🧠" },
  { id: "debugging", title: "Bug Hunter", description: "Find & fix bugs", icon: "speed" as const, color: "warning" as const, emoji: "🐛" },
  { id: "typing", title: "Code Typing", description: "Practice syntax", icon: "typing" as const, color: "secondary" as const, emoji: "⌨️" },
  { id: "ordering", title: "Code Ordering", description: "Arrange blocks", icon: "ordering" as const, color: "success" as const, emoji: "🧩" },
  { id: "speed", title: "Speed Challenge", description: "Race the clock", icon: "speed" as const, color: "warning" as const, emoji: "⚡" },
  { id: "pacman", title: "Pacman Coder", description: "Collect code", icon: "speed" as const, color: "primary" as const, emoji: "👾" },
  
  // Systems & Architecture Games
  { id: "system-design", title: "System Design", description: "Design systems", icon: "ordering" as const, color: "accent" as const, emoji: "🔧" },
  { id: "pc-builder", title: "PC Builder Lab", description: "Build a PC like Tetris", icon: "ordering" as const, color: "primary" as const, emoji: "🖥️" },
  { id: "lmc-simulator", title: "LMC Simulator", description: "CPU simulation", icon: "typing" as const, color: "secondary" as const, emoji: "👨‍💼" },
  { id: "number-systems", title: "Number Systems", description: "Binary/Hex conversions", icon: "typing" as const, color: "accent" as const, emoji: "🔢" },
  
  // Networking Games
  { id: "subnetting", title: "IP Subnetting", description: "IPv4 calculations", icon: "typing" as const, color: "success" as const, emoji: "🌐" },
  { id: "network-protocols", title: "Network Protocols", description: "OSI & TCP/IP layers", icon: "ordering" as const, color: "accent" as const, emoji: "📡" },
  
  // Web Development Games
  { id: "html-css", title: "HTML & CSS Lab", description: "Web development", icon: "typing" as const, color: "warning" as const, emoji: "🎨" },
  
  // Data & Database Games
  { id: "complexity-arcade", title: "Complexity Arcade", description: "Master Big-O", icon: "typing" as const, color: "secondary" as const, emoji: "📊" },
  { id: "erd-builder", title: "ERD Builder", description: "Design databases", icon: "ordering" as const, color: "primary" as const, emoji: "🗂️" },
  { id: "sql-query", title: "SQL Query", description: "Database queries", icon: "ordering" as const, color: "primary" as const, emoji: "🗄️" },
  { id: "graph-visualizer", title: "Graph Explorer", description: "Graph algorithms", icon: "speed" as const, color: "success" as const, emoji: "📊" },
  { id: "excel-master", title: "Excel Master", description: "Formulas & functions", icon: "typing" as const, color: "success" as const, emoji: "📊" },
  
  // Project & UML Games
  { id: "project-planner", title: "Project Planner", description: "Gantt & Kanban", icon: "ordering" as const, color: "accent" as const, emoji: "📋" },
  { id: "use-case", title: "Use Case Diagrams", description: "UML modeling", icon: "ordering" as const, color: "warning" as const, emoji: "👥" },
  
  // Security & AI Games
  { id: "cybersecurity", title: "Security Challenge", description: "Cyber defense", icon: "speed" as const, color: "warning" as const, emoji: "🛡️" },
  { id: "ai-data", title: "AI & ML", description: "Machine learning", icon: "typing" as const, color: "accent" as const, emoji: "🤖" },
  { id: "game-dev", title: "Game Dev", description: "Game concepts", icon: "speed" as const, color: "primary" as const, emoji: "🎮" },
  
  // Advanced Learning
  { id: "adaptive", title: "Adaptive Learning", description: "AI-powered practice", icon: "typing" as const, color: "secondary" as const, emoji: "🧠" },
  { id: "voice-coach", title: "Voice Coach", description: "Read code aloud", icon: "typing" as const, color: "accent" as const, emoji: "🗣️" },
  { id: "puzzle-builder", title: "Code Puzzles", description: "Build code pieces", icon: "ordering" as const, color: "primary" as const, emoji: "🧩" },
  { id: "chatbot-builder", title: "Chatbot Builder Lab", description: "Build & test a real AI bot", icon: "typing" as const, color: "accent" as const, emoji: "🤖" },
  
  // Multiplayer & Sandbox
  { id: "battle", title: "Multiplayer Battle", description: "Challenge friends!", icon: "speed" as const, color: "warning" as const, emoji: "⚔️", link: "/battle" },
  { id: "sandbox", title: "Code Lab", description: "Live code editor", icon: "typing" as const, color: "success" as const, emoji: "💻", link: "/sandbox" },
];

export default function Dashboard() {
  const { modules, gameMode } = useGame();
  const { user, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { isAdmin } = useAdmin();
  const { subscribed, inTrial, trialEnd, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();
  const isKidsMode = gameMode === "kid";
  
  const [stats, setStats] = useState({ xp: 0, streak: 0, gamesPlayed: 0 });
  const [activeTab, setActiveTab] = useState("zones");

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
  const totalLessons = Object.values(moduleLessons).reduce((n, l) => n + l.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Real per-course progress, used to unlock zones and practice games.
  const completedByModule: Record<string, number> = {};
  progress.filter(p => p.completed).forEach(p => {
    completedByModule[p.moduleId] = (completedByModule[p.moduleId] ?? 0) + 1;
  });
  const totalByModule: Record<string, number> = Object.fromEntries(
    Object.entries(moduleLessons).map(([id, list]) => [id, list.length])
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-gradient-to-b from-primary/5 via-background to-accent/5' : 'bg-background'}`}>
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Admin & Subscription Status */}
        {(isAdmin || inTrial || subscribed) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex gap-2 flex-wrap">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            {subscribed && (
              <Button variant="outline" size="sm" onClick={openCustomerPortal}>
                <Crown className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            )}
            {inTrial && trialEnd && !subscribed && (
              <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                <Crown className="w-4 h-4" />
                Trial ends {new Date(trialEnd).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        )}

        {/* Mascot - only show in Kids mode */}
        {isKidsMode && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
            <Mascot />
          </motion.div>
        )}

        {/* Welcome Message for Pro mode */}
        {!isKidsMode && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className={`rounded-2xl p-4 border text-center ${isKidsMode ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isKidsMode ? 'bg-primary/30' : 'bg-primary/20'}`}>
              <Star className="w-6 h-6 text-primary" />
            </div>
            <p className={`font-bold text-primary ${isKidsMode ? 'text-3xl' : 'text-2xl'}`}>{stats.xp}</p>
            <p className="text-xs text-muted-foreground">{isKidsMode ? '⭐ XP' : 'Total XP'}</p>
          </div>
          <div className={`rounded-2xl p-4 border text-center ${isKidsMode ? 'bg-warning/10 border-warning/30' : 'bg-card border-border'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isKidsMode ? 'bg-warning/30' : 'bg-warning/20'}`}>
              <Flame className="w-6 h-6 text-warning" />
            </div>
            <p className={`font-bold text-warning ${isKidsMode ? 'text-3xl' : 'text-2xl'}`}>{stats.streak}</p>
            <p className="text-xs text-muted-foreground">{isKidsMode ? '🔥 Days' : 'Day Streak'}</p>
          </div>
          <div className={`rounded-2xl p-4 border text-center ${isKidsMode ? 'bg-success/10 border-success/30' : 'bg-card border-border'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isKidsMode ? 'bg-success/30' : 'bg-success/20'}`}>
              <Trophy className="w-6 h-6 text-success" />
            </div>
            <p className={`font-bold text-success ${isKidsMode ? 'text-3xl' : 'text-2xl'}`}>{overallProgress}%</p>
            <p className="text-xs text-muted-foreground">{isKidsMode ? '🏆 Done' : 'Complete'}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10"
        >
          <Button
            size="lg"
            className={`text-lg h-14 ${isKidsMode ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-primary hover:bg-primary/90'}`}
            onClick={() => navigate('/path')}
          >
            {isKidsMode ? '🗺️ My Quest' : 'My Path'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={`text-lg h-14 ${isKidsMode ? 'border-2 border-primary' : 'border-2'}`}
            onClick={() => {
              const moduleOrder = Object.keys(moduleLessons);
              const nextModule = moduleOrder.find(m => {
                const done = progress.filter(p => p.moduleId === m && p.completed).length;
                return done > 0 && done < 50;
              }) || moduleOrder.find(m => progress.filter(p => p.moduleId === m && p.completed).length === 0) || "java-foundations";
              navigate(`/module/${nextModule}`);
            }}
          >
            {isKidsMode ? '🚀' : ''} Continue
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className={`text-lg h-14 ${isKidsMode ? 'border-2 border-accent' : 'border-2'}`}
            onClick={() => {
              setActiveTab("games");
              setTimeout(() => document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
            }}
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            {isKidsMode ? '🎮 Games' : 'Games'}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className={`col-span-2 sm:col-span-1 text-lg h-14 ${isKidsMode ? 'border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10' : 'border-2'}`}
            onClick={() => navigate('/avatar')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isKidsMode ? '✨ Avatar' : 'Avatar Builder'}
          </Button>
        </motion.div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="zones" className="flex items-center gap-1 text-xs sm:text-sm">
              <Map className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '🗺️' : ''}Zones</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-1 text-xs sm:text-sm">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '📚' : ''}Courses</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-1 text-xs sm:text-sm">
              <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '🎮' : ''}Games</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1 text-xs sm:text-sm">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '🎯' : ''}Daily</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1 text-xs sm:text-sm">
              <Medal className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '🏅' : ''}Badges</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1 text-xs sm:text-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isKidsMode ? '🏆' : ''}Projects</span>
            </TabsTrigger>
          </TabsList>

          {/* Zones Tab */}
          <TabsContent value="zones">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-8"
            >
              <h2 className={`text-xl font-bold text-foreground mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : ''}`}>
                {isKidsMode ? '🌍 Explore the World!' : 'Learning Zones'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {isKidsMode
                  ? 'Finish a lesson in a course to open its world!'
                  : 'Each zone opens when you complete a lesson in one of its courses, and fills up as you finish more.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {zones.map((zone, index) => {
                  const state = getZoneState(zone.id, completedByModule, totalByModule);
                  const gateTitle = state.gateModuleId ? moduleInfo[state.gateModuleId]?.title : undefined;
                  return (
                    <ZoneCard
                      key={zone.id}
                      zone={zone}
                      index={index}
                      unlocked={state.unlocked}
                      progress={state.percent}
                      lessonsDone={state.lessonsDone}
                      lessonsTotal={state.lessonsTotal}
                      unlockHint={gateTitle ? `Complete a lesson in ${gateTitle} to open this zone` : undefined}
                      onUnlockClick={state.gateModuleId ? () => navigate(`/module/${state.gateModuleId}`) : undefined}
                    />
                  );
                })}
              </div>
            </motion.section>

            {/* Daily Session */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`text-xl font-bold text-foreground mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : ''}`}>
                {isKidsMode ? '⭐ Today\'s Mission!' : 'Your Daily Session'}
              </h2>
              <SessionCard
                trackName="Java Programming"
                trackIcon="☕"
                level="apprentice"
                recommendedGame="pattern"
                weakArea="if/else statements"
              />
            </motion.section>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2 className={`text-xl font-bold text-foreground mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : ''}`}>
                {isKidsMode ? '🛤️ Your Adventure!' : 'Your Learning Path'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modules.map((mod) => (

                  <div
                    key={mod.id}
                    onClick={() => navigate(`/module/${mod.id}`)}
                    className={`rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      isKidsMode 
                        ? 'bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 hover:border-primary/50 hover:shadow-xl' 
                        : 'bg-card border border-border hover:shadow-lg'
                    }`}
                  >
                    <div className={`mb-2 ${isKidsMode ? 'text-5xl' : 'text-4xl'}`}>{mod.icon}</div>
                    <h3 className={`font-bold ${isKidsMode ? 'text-lg' : ''}`}>{mod.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games">
            <motion.section
              id="games-section"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2 className={`text-xl font-bold text-foreground mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : ''}`}>
                {isKidsMode ? '🎮 Fun Games!' : 'Mini Games'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameModes.map((game, index) => (
                  <GameModeCard key={game.id} {...game} index={index} />
                ))}
              </div>
            </motion.section>

            {/* Games unlocked by your course lessons */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-10"
            >
              <h2 className={`text-xl font-bold text-foreground mb-1 ${isKidsMode ? 'text-2xl' : ''}`}>
                {isKidsMode ? '🔓 Games You Unlocked!' : 'Unlocked by your lessons'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {isKidsMode
                  ? 'Finish lessons to open more games in each course!'
                  : 'Each course opens more practice games as you complete its lessons.'}
              </p>
              <div className="space-y-4">
                {Object.keys(moduleGameMap).map((moduleId) => {
                  const info = moduleInfo[moduleId];
                  if (!info) return null;
                  const done = progress.filter((p) => p.moduleId === moduleId && p.completed).length;
                  const unlocked = unlockedModuleGames(moduleId, done);
                  const all = moduleGameMap[moduleId].games;
                  const nextAt = nextGameUnlockAt(moduleId, done);
                  return (
                    <div key={moduleId} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <button
                          onClick={() => navigate(`/module/${moduleId}`)}
                          className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
                        >
                          <span className="text-2xl">{info.icon}</span>
                          {info.title}
                        </button>
                        <span className="text-xs text-muted-foreground">
                          {done} lesson{done === 1 ? '' : 's'} done
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {all.map((gameId) => {
                          const meta = gameModes.find((g) => g.id === gameId);
                          const isUnlocked = unlocked.includes(gameId);
                          return (
                            <Button
                              key={gameId}
                              size="sm"
                              variant={isUnlocked ? 'secondary' : 'outline'}
                              disabled={!isUnlocked}
                              onClick={() => navigate(`/game/${gameId}`)}
                              className="text-xs"
                            >
                              {isUnlocked ? (
                                <span className="mr-1">{meta?.emoji ?? '🎮'}</span>
                              ) : (
                                <Lock className="mr-1 h-3 w-3" />
                              )}
                              {meta?.title ?? gameId}
                            </Button>
                          );
                        })}
                      </div>
                      {nextAt !== null && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Next game unlocks at {nextAt} lessons.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </TabsContent>

          {/* Daily Challenges Tab */}
          <TabsContent value="challenges">
            <DailyChallenges />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementsGallery />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <ProjectSubmission />
            </motion.section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
