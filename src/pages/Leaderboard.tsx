import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, Award, ArrowLeft, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_xp: number | null;
  games_played: number | null;
  lessons_completed: number | null;
  current_streak: number | null;
  best_streak: number | null;
  opt_in: boolean | null;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [optedIn, setOptedIn] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    if (user) fetchUserEntry();
  }, [user]);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('opt_in', true)
      .order('total_xp', { ascending: false })
      .limit(50);

    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  };

  const fetchUserEntry = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setUserEntry(data);
      setOptedIn(data.opt_in || false);
    }
  };

  const toggleOptIn = async () => {
    if (!user) return;
    const newValue = !optedIn;
    
    const { error } = await supabase
      .from('leaderboard')
      .update({ opt_in: newValue })
      .eq('user_id', user.id);

    if (!error) {
      setOptedIn(newValue);
      toast.success(newValue ? 'You are now on the leaderboard!' : 'Removed from leaderboard');
      fetchLeaderboard();
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-mono">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Leaderboard</h1>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Show my score</span>
                <Switch checked={optedIn} onCheckedChange={toggleOptIn} />
              </div>
            )}
          </div>

          {userEntry && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Stats</p>
                    <p className="text-2xl font-bold">{userEntry.total_xp || 0} XP</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{userEntry.games_played || 0} games</Badge>
                    <Badge variant="outline" className="ml-2">{userEntry.current_streak || 0} streak</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No players on the leaderboard yet. Be the first!
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.user_id === user?.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 flex justify-center">
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <p className="font-medium">
                            Player {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.games_played || 0} games • {entry.best_streak || 0} best streak
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{entry.total_xp || 0} XP</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Leaderboard;
