import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, Award, ArrowLeft, Crown, TrendingUp, TrendingDown, Minus, Zap, Flame, Gamepad2 } from 'lucide-react';
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
  display_name?: string;
  previousRank?: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [previousEntries, setPreviousEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [optedIn, setOptedIn] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('opt_in', true)
      .order('total_xp', { ascending: false })
      .limit(50);

    if (!error && data) {
      // Calculate rank changes
      const withRankChanges = data.map((entry, index) => {
        const prevIndex = previousEntries.findIndex(p => p.user_id === entry.user_id);
        return {
          ...entry,
          previousRank: prevIndex !== -1 ? prevIndex + 1 : undefined
        };
      });
      
      setPreviousEntries(entries);
      setEntries(withRankChanges);
      
      // Find user's rank
      if (user) {
        const rank = withRankChanges.findIndex(e => e.user_id === user.id);
        setUserRank(rank !== -1 ? rank + 1 : null);
      }
    }
    setLoading(false);
  }, [user, entries, previousEntries]);

  const fetchUserEntry = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
    if (user) fetchUserEntry();
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

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
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300 drop-shadow-[0_0_6px_rgba(209,213,219,0.6)]" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600 drop-shadow-[0_0_6px_rgba(180,83,9,0.6)]" />;
    return <span className="text-muted-foreground font-mono text-lg">#{rank}</span>;
  };

  const getRankChange = (entry: LeaderboardEntry, currentRank: number) => {
    if (!entry.previousRank) return null;
    const change = entry.previousRank - currentRank;
    
    if (change > 0) {
      return (
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center text-success text-xs"
        >
          <TrendingUp className="w-3 h-3 mr-0.5" />
          +{change}
        </motion.div>
      );
    } else if (change < 0) {
      return (
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center text-destructive text-xs"
        >
          <TrendingDown className="w-3 h-3 mr-0.5" />
          {change}
        </motion.div>
      );
    }
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getRowBackground = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 via-gray-400/10 to-transparent border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent border-amber-600/30';
    return 'bg-muted/30 border-border/50';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="text-sm text-muted-foreground">Real-time rankings</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Show me</span>
                <Switch checked={optedIn} onCheckedChange={toggleOptIn} />
              </div>
            )}
          </div>

          {/* User Stats Card */}
          {userEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Card className="premium-card border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 overflow-hidden">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Your Stats</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-primary">{userEntry.total_xp || 0}</p>
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      {userRank && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Rank #{userRank} of {entries.length}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className="bg-accent/20 text-accent">
                        <Gamepad2 className="w-3 h-3 mr-1" />
                        {userEntry.games_played || 0} games
                      </Badge>
                      <Badge className="bg-warning/20 text-warning">
                        <Flame className="w-3 h-3 mr-1" />
                        {userEntry.current_streak || 0} day streak
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Leaderboard */}
          <Card className="premium-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Top Players</span>
                <Badge variant="outline" className="font-normal">
                  Live updates
                  <motion.div 
                    className="w-2 h-2 bg-success rounded-full ml-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No players on the leaderboard yet.</p>
                  <p className="text-sm">Be the first to join!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {entries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ 
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                          delay: index * 0.03 
                        }}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          entry.user_id === user?.id 
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                            : getRowBackground(index + 1)
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 flex flex-col items-center justify-center">
                            {getRankIcon(index + 1)}
                            {getRankChange(entry, index + 1)}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {(entry.display_name || `P${index + 1}`)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.user_id === user?.id ? 'You' : `Player ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{entry.games_played || 0} games</span>
                              <span>•</span>
                              <span>{entry.best_streak || 0} best streak</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.p 
                            className="font-bold text-xl text-primary"
                            key={entry.total_xp}
                            initial={{ scale: 1.2, color: 'hsl(var(--success))' }}
                            animate={{ scale: 1, color: 'hsl(var(--primary))' }}
                            transition={{ duration: 0.5 }}
                          >
                            {(entry.total_xp || 0).toLocaleString()}
                          </motion.p>
                          <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
