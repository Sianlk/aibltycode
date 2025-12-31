import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useSkillMastery, useSpacedRepetition } from "@/hooks/useSkillMastery";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MasteryMeter } from "@/components/dashboard/MasteryMeter";
import { SkillLevel } from "@/data/learningSystem";
import { 
  ArrowLeft, Target, Flame, Clock, TrendingUp, AlertTriangle, 
  Brain, Zap, Calendar, ChevronRight 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, loading: skillsLoading } = useSkillMastery();
  const { dueItems, loading: dueLoading } = useSpacedRepetition();
  const { progress } = useProgress();

  // Calculate weak areas (skills with accuracy < 70%)
  const weakAreas = skills.filter(s => s.accuracy < 70).slice(0, 5);
  
  // Calculate strong areas (skills with automation_score > 70)
  const strongAreas = skills.filter(s => s.automation_score > 70).slice(0, 5);

  // Mock progress data for chart (in production, fetch from daily_activity)
  const progressData = [
    { day: 'Mon', xp: 45, accuracy: 72 },
    { day: 'Tue', xp: 82, accuracy: 78 },
    { day: 'Wed', xp: 56, accuracy: 75 },
    { day: 'Thu', xp: 120, accuracy: 85 },
    { day: 'Fri', xp: 95, accuracy: 82 },
    { day: 'Sat', xp: 150, accuracy: 88 },
    { day: 'Sun', xp: 110, accuracy: 86 },
  ];

  // Category distribution
  const categoryData = skills.reduce((acc, skill) => {
    const existing = acc.find(c => c.category === skill.category);
    if (existing) {
      existing.count++;
      existing.avgScore = (existing.avgScore * (existing.count - 1) + skill.automation_score) / existing.count;
    } else {
      acc.push({ category: skill.category, count: 1, avgScore: skill.automation_score });
    }
    return acc;
  }, [] as { category: string; count: number; avgScore: number }[]);

  const totalXP = skills.reduce((sum, s) => sum + (s.total_attempts * 10), 0);
  const avgAccuracy = skills.length > 0 
    ? Math.round(skills.reduce((sum, s) => sum + s.accuracy, 0) / skills.length) 
    : 0;
  const totalPracticeTime = skills.reduce((sum, s) => sum + s.total_attempts, 0) * 0.5; // ~30s per attempt

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Your Analytics</h1>
          <p className="text-muted-foreground mb-8">Track your progress and identify areas for improvement</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total XP</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalXP}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Avg Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-success">{avgAccuracy}%</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Skills Tracked</span>
            </div>
            <p className="text-2xl font-bold text-accent">{skills.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">Practice Time</span>
            </div>
            <p className="text-2xl font-bold text-warning">{Math.round(totalPracticeTime)}m</p>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Progress
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="xp" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Skill Categories
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Complete some games to see your skill distribution
              </div>
            )}
          </motion.div>
        </div>

        {/* Due for Review */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-warning" />
            Due for Review ({dueItems.length})
          </h3>
          {dueItems.length > 0 ? (
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <p className="text-sm text-warning mb-3">
                You have {dueItems.length} items ready for spaced repetition review!
              </p>
              <Button 
                onClick={() => navigate('/game/spaced-rep')}
                className="bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                Start Review Session
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-4 text-muted-foreground text-sm">
              No items due for review. Keep practicing to build your review queue!
            </div>
          )}
        </motion.section>

        {/* Weak Areas */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Areas to Improve
          </h3>
          {weakAreas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weakAreas.map(skill => (
                <MasteryMeter
                  key={skill.id}
                  skillName={skill.skill_name}
                  level={skill.level as SkillLevel}
                  automationScore={skill.automation_score}
                  accuracy={skill.accuracy}
                  avgSpeed={skill.avg_speed}
                  streakDays={skill.streak_days}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-success text-sm">
              Great job! No weak areas detected. Keep up the excellent work!
            </div>
          )}
        </motion.section>

        {/* Strong Areas */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-success" />
            Your Strengths
          </h3>
          {strongAreas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strongAreas.map(skill => (
                <MasteryMeter
                  key={skill.id}
                  skillName={skill.skill_name}
                  level={skill.level as SkillLevel}
                  automationScore={skill.automation_score}
                  accuracy={skill.accuracy}
                  avgSpeed={skill.avg_speed}
                  streakDays={skill.streak_days}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-4 text-muted-foreground text-sm">
              Keep practicing to build your skill strengths!
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
