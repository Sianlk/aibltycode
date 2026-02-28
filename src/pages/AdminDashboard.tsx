import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, Plus, Sparkles, Users, BookOpen, Gamepad2, 
  Trophy, CreditCard, Shield, TrendingUp, Eye, Swords,
  Settings, Database, Activity, Crown
} from "lucide-react";

interface StatsData {
  users: number;
  modules: number;
  lessons: number;
  activeBattles: number;
  totalSubscribers: number;
  totalXP: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    users: 0,
    modules: 0,
    lessons: 0,
    activeBattles: 0,
    totalSubscribers: 0,
    totalXP: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [activeBattles, setActiveBattles] = useState<any[]>([]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({ title: "Access Denied", description: "Admin privileges required", variant: "destructive" });
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  useEffect(() => {
    async function fetchAllStats() {
      const [
        { count: users },
        { count: modules },
        { count: lessons },
        { count: activeBattles },
        { count: subscribers },
        { data: xpData },
        { data: recentUsersData },
        { data: battlesData }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("modules").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("battle_rooms").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("xp"),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("battle_rooms").select("*").eq("status", "active").limit(5)
      ]);

      const totalXP = xpData?.reduce((sum, p) => sum + (p.xp || 0), 0) || 0;

      setStats({
        users: users || 0,
        modules: modules || 0,
        lessons: lessons || 0,
        activeBattles: activeBattles || 0,
        totalSubscribers: subscribers || 0,
        totalXP
      });
      setRecentUsers(recentUsersData || []);
      setActiveBattles(battlesData || []);
    }
    if (isAdmin) fetchAllStats();
  }, [isAdmin]);

  const handleAIGenerate = async (action: string) => {
    if (!aiPrompt.trim()) {
      toast({ title: "Enter a prompt", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content-assistant", {
        body: { prompt: aiPrompt, action },
      });

      if (error) throw error;
      setAiResponse(data.content || "No response generated");
      toast({ title: "Content Generated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setAiLoading(false);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Full platform control center</p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Shield className="h-4 w-4 text-green-500" />
              Admin Access
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-5 h-12">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Manage</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Tools</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="battles" className="gap-2">
                <Swords className="h-4 w-4" />
                <span className="hidden sm:inline">Battles</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <p className="text-3xl font-black">{stats.users}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <BookOpen className="w-8 h-8 text-secondary mb-2" />
                    <p className="text-3xl font-black">{stats.modules}</p>
                    <p className="text-xs text-muted-foreground">Modules</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <Gamepad2 className="w-8 h-8 text-accent mb-2" />
                    <p className="text-3xl font-black">{stats.lessons}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <Swords className="w-8 h-8 text-orange-500 mb-2" />
                    <p className="text-3xl font-black">{stats.activeBattles}</p>
                    <p className="text-xs text-muted-foreground">Live Battles</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <CreditCard className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-3xl font-black">{stats.totalSubscribers}</p>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="flex flex-col items-center p-6">
                    <TrendingUp className="w-8 h-8 text-yellow-500 mb-2" />
                    <p className="text-3xl font-black">{(stats.totalXP / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3 flex-wrap">
                  <Button onClick={() => navigate("/dashboard")}>
                    <Eye className="w-4 h-4 mr-2" />
                    View as User
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/battle")}>
                    <Swords className="w-4 h-4 mr-2" />
                    Battle Arena
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/tutor")}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Tutor
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/sandbox")}>
                    <Database className="w-4 h-4 mr-2" />
                    Code Sandbox
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/leaderboard")}>
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Content Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe the content you want to create... e.g., 'Create a lesson about loops in Python for absolute beginners'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => handleAIGenerate("generate_lesson")} disabled={aiLoading}>
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Generate Lesson
                    </Button>
                    <Button variant="secondary" onClick={() => handleAIGenerate("generate_module")} disabled={aiLoading}>
                      Generate Module
                    </Button>
                    <Button variant="outline" onClick={() => handleAIGenerate("improve_content")} disabled={aiLoading}>
                      Improve Content
                    </Button>
                  </div>
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">AI Response:</h4>
                      <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">{aiResponse}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage">
              <UserManagement />
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No users yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{user.display_name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{user.xp || 0} XP</Badge>
                            <Badge variant="secondary">{user.mode || 'Pro'}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="battles">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Active Battles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeBattles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No active battles</p>
                  ) : (
                    <div className="space-y-3">
                      {activeBattles.map((battle) => (
                        <div key={battle.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                              <Swords className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">Room: {battle.room_code}</p>
                              <p className="text-xs text-muted-foreground">
                                {battle.game_type} • {battle.total_rounds} rounds
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {battle.host_score || 0} - {battle.opponent_score || 0}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Eye className="h-3 w-3" />
                              {battle.spectator_count || 0}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}