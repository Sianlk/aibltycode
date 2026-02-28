import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, Award, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface BattleChampion {
  id: string;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  current_win_streak: number;
  best_win_streak: number;
  display_name: string;
}

export function WinnersTable() {
  const { user } = useAuth();
  const [champions, setChampions] = useState<BattleChampion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<{ wins: number; losses: number; rating: number } | null>(null);

  useEffect(() => {
    fetchChampions();
  }, [user]);

  const fetchChampions = async () => {
    // Use the secure leaderboard view (no user_id exposed)
    const { data, error } = await supabase
      .from('battle_leaderboard' as any)
      .select('*')
      .limit(10);

    if (!error && data) {
      setChampions(data as unknown as BattleChampion[]);

      // Get user's own stats from their own battle_stats row (RLS-protected)
      if (user) {
        const { data: ownStats } = await supabase
          .from('battle_stats')
          .select('wins, losses, draws, rating')
          .eq('user_id', user.id)
          .single();

        if (ownStats) {
          setUserStats({ wins: ownStats.wins || 0, losses: ownStats.losses || 0, rating: ownStats.rating || 1000 });
          // Determine rank by checking position in leaderboard
          const userInTop = (data as any[]).findIndex((c: any) => c.rating <= (ownStats.rating || 1000));
          if (userInTop === -1) {
            setUserRank((data as any[]).length + 1);
          } else {
            setUserRank(userInTop + 1);
          }
        }
      }
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />;
    return <span className="text-xl font-black text-muted-foreground">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-slate-400/20 via-slate-400/10 to-transparent border-slate-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent border-amber-600/30';
    return 'bg-card/50 border-border';
  };

  const getWinRate = (wins: number, losses: number, draws: number) => {
    const total = wins + losses + draws;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-muted-foreground">Loading champions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Battle Champions</h3>
          <p className="text-sm text-muted-foreground">Top 10 arena warriors</p>
        </div>
      </div>

      {/* User's Current Position */}
      {userStats && userRank && userRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground">#{userRank}</span>
                  <div>
                    <p className="font-semibold">Your Position</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{userStats.wins}W</span>
                      <span>-</span>
                      <span>{userStats.losses}L</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">{userStats.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Champions List */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {champions.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No champions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to claim the throne!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {champions.map((champion, index) => {
                const rank = index + 1;
                const winRate = getWinRate(champion.wins || 0, champion.losses || 0, champion.draws || 0);

                return (
                  <motion.div
                    key={champion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center justify-between p-4 transition-colors',
                      getRankBg(rank)
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 flex justify-center">
                        {getRankIcon(rank)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{champion.display_name}</p>
                          {champion.current_win_streak && champion.current_win_streak >= 3 && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {champion.current_win_streak}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                          <span className="text-green-500">{champion.wins || 0}W</span>
                          <span className="text-red-500">{champion.losses || 0}L</span>
                          <span className="text-blue-500">{champion.draws || 0}D</span>
                          <span className="text-muted-foreground">({winRate}% WR)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-2xl font-black text-primary">{champion.rating || 1000}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

