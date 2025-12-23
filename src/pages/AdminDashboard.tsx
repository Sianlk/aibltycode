import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Sparkles, Users, BookOpen, Gamepad2 } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [stats, setStats] = useState({ users: 0, modules: 0, lessons: 0 });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({ title: "Access Denied", description: "Admin privileges required", variant: "destructive" });
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  useEffect(() => {
    async function fetchStats() {
      const [{ count: users }, { count: modules }, { count: lessons }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("modules").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
      ]);
      setStats({ users: users || 0, modules: modules || 0, lessons: lessons || 0 });
    }
    if (isAdmin) fetchStats();
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
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Users className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.users}</p>
                  <p className="text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <BookOpen className="w-10 h-10 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.modules}</p>
                  <p className="text-muted-foreground">Modules</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Gamepad2 className="w-10 h-10 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{stats.lessons}</p>
                  <p className="text-muted-foreground">Lessons</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Content Generator */}
          <Card className="mb-8">
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                View as User
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
