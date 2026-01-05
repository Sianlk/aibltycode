import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Trophy, Swords, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LiveBattle {
  id: string;
  room_code: string;
  status: string;
  game_type: string;
  host_score: number;
  opponent_score: number;
  spectator_count: number;
  created_at: string;
  total_rounds: number;
}

export function SpectatorMode() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liveBattles, setLiveBattles] = useState<LiveBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [spectatingRoom, setSpectatingRoom] = useState<string | null>(null);
  const [battleData, setBattleData] = useState<any>(null);

  useEffect(() => {
    fetchLiveBattles();
    
    const interval = setInterval(fetchLiveBattles, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveBattles = async () => {
    const { data, error } = await supabase
      .from('battle_rooms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLiveBattles(data);
    }
    setLoading(false);
  };

  const joinAsSpectator = async (roomId: string) => {
    if (!user) {
      toast({ title: 'Please login to spectate', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('battle_spectators')
      .insert({ room_id: roomId, user_id: user.id });

    if (error && !error.message.includes('duplicate')) {
      toast({ title: 'Failed to join', variant: 'destructive' });
      return;
    }

    setSpectatingRoom(roomId);
    
    // Subscribe to battle updates
    const channel = supabase
      .channel(`spectate-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'battle_rooms',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        setBattleData(payload.new);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'battle_rounds',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setBattleData((prev: any) => ({ ...prev, currentRound: payload.new }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      leaveSpectating(roomId);
    };
  };

  const leaveSpectating = async (roomId: string) => {
    if (!user) return;
    
    await supabase
      .from('battle_spectators')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', user.id);
    
    setSpectatingRoom(null);
    setBattleData(null);
  };

  if (spectatingRoom && battleData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Spectating Live Battle</h3>
              <p className="text-sm text-muted-foreground">Room: {battleData.room_code}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => leaveSpectating(spectatingRoom)}>
            Leave
          </Button>
        </div>

        <Card className="border-2 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Host</p>
                <p className="text-4xl font-black text-primary">{battleData.host_score || 0}</p>
              </div>
              <div className="flex items-center gap-2">
                <Swords className="h-8 w-8 text-muted-foreground" />
                <span className="text-2xl font-bold text-muted-foreground">VS</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Challenger</p>
                <p className="text-4xl font-black text-accent">{battleData.opponent_score || 0}</p>
              </div>
            </div>

            {battleData.currentRound && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-center text-lg font-medium">
                  {battleData.currentRound.question?.text || 'Waiting for next round...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Spectator Mode</h3>
            <p className="text-sm text-muted-foreground">Watch live battles in real-time</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {liveBattles.length} Live
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
          />
          Finding live battles...
        </div>
      ) : liveBattles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Swords className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No live battles right now</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon or start your own!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {liveBattles.map((battle, index) => (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                'cursor-pointer transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]',
                'border-2 border-border'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <Swords className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{battle.room_code}</span>
                          <Badge variant="secondary" className="text-xs">
                            {battle.game_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {battle.spectator_count} watching
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3.5 w-3.5" />
                            {battle.host_score} - {battle.opponent_score}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => joinAsSpectator(battle.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}