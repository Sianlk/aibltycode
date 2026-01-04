import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Trophy, Copy, Check, Loader2, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useBattle, BattleStats } from '@/hooks/useBattle';
import { cn } from '@/lib/utils';

interface BattleLobbyProps {
  onRoomCreated?: (roomCode: string) => void;
  onRoomJoined?: (roomCode: string) => void;
}

export function BattleLobby({ onRoomCreated, onRoomJoined }: BattleLobbyProps) {
  const { createRoom, joinRoom, myStats, currentRoom, isHost } = useBattle();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [difficulty, setDifficulty] = useState(5);

  const handleCreate = async () => {
    setIsCreating(true);
    const room = await createRoom('quick-fire', rounds, difficulty);
    setIsCreating(false);
    if (room) {
      onRoomCreated?.(room.roomCode);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    const room = await joinRoom(joinCode.trim());
    setIsJoining(false);
    if (room) {
      onRoomJoined?.(room.roomCode);
    }
  };

  const copyCode = () => {
    if (currentRoom?.roomCode) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Waiting for opponent
  if (currentRoom && currentRoom.status === 'waiting') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Waiting for Opponent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Share this code with your opponent:
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="text-3xl font-bold tracking-widest bg-muted px-4 py-2 rounded-lg">
                  {currentRoom.roomCode}
                </div>
                <Button variant="outline" size="icon" onClick={copyCode}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Waiting for opponent to join...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stats Banner */}
      {myStats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { label: 'Rating', value: myStats.rating, icon: Trophy, color: 'text-yellow-500' },
            { label: 'Wins', value: myStats.wins, icon: Zap, color: 'text-green-500' },
            { label: 'Losses', value: myStats.losses, icon: Target, color: 'text-red-500' },
            { label: 'Win Streak', value: myStats.currentWinStreak, icon: Swords, color: 'text-primary' },
          ].map((stat, i) => (
            <Card key={stat.label} className="bg-gradient-to-br from-muted/50 to-muted/30">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={cn('h-8 w-8', stat.color)} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Room */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Swords className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Create Battle</CardTitle>
                  <p className="text-sm text-muted-foreground">Host a new match</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rounds: {rounds}
                </label>
                <Slider
                  value={[rounds]}
                  onValueChange={([v]) => setRounds(v)}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Difficulty: {difficulty}/10
                </label>
                <Slider
                  value={[difficulty]}
                  onValueChange={([v]) => setDifficulty(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Swords className="h-5 w-5 mr-2" />
                )}
                Create Room
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Join Room */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full bg-gradient-to-br from-accent/5 to-accent/10 border-accent/30 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Join Battle</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter a room code</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Room Code
                </label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest font-bold uppercase"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleJoin}
                disabled={isJoining || joinCode.length !== 6}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                size="lg"
              >
                {isJoining ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Users className="h-5 w-5 mr-2" />
                )}
                Join Room
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
