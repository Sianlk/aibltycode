import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Swords, Users, Clock, Star, Medal, Zap, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  score?: number;
  eliminated?: boolean;
}

interface Match {
  id: string;
  round: number;
  position: number;
  player1?: Participant;
  player2?: Participant;
  winner?: string;
  status: 'pending' | 'live' | 'completed';
}

interface Tournament {
  id: string;
  name: string;
  status: 'registering' | 'in_progress' | 'completed';
  participants: Participant[];
  matches: Match[];
  prizePool: number;
  maxParticipants: number;
  startTime?: Date;
}

// Mock tournament data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Weekend Warriors Cup',
    status: 'registering',
    participants: Array.from({ length: 6 }, (_, i) => ({
      id: `p${i}`,
      name: `Player ${i + 1}`,
    })),
    matches: [],
    prizePool: 1000,
    maxParticipants: 8,
    startTime: new Date(Date.now() + 3600000),
  },
  {
    id: '2',
    name: 'Code Masters Championship',
    status: 'in_progress',
    participants: Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      name: `Champion ${i + 1}`,
      score: Math.floor(Math.random() * 500),
    })),
    matches: [
      { id: 'm1', round: 1, position: 0, player1: { id: 'p0', name: 'Champion 1' }, player2: { id: 'p1', name: 'Champion 2' }, winner: 'p0', status: 'completed' },
      { id: 'm2', round: 1, position: 1, player1: { id: 'p2', name: 'Champion 3' }, player2: { id: 'p3', name: 'Champion 4' }, winner: 'p2', status: 'completed' },
      { id: 'm3', round: 1, position: 2, player1: { id: 'p4', name: 'Champion 5' }, player2: { id: 'p5', name: 'Champion 6' }, status: 'live' },
      { id: 'm4', round: 1, position: 3, player1: { id: 'p6', name: 'Champion 7' }, player2: { id: 'p7', name: 'Champion 8' }, status: 'pending' },
      { id: 'm5', round: 2, position: 0, player1: { id: 'p0', name: 'Champion 1' }, player2: { id: 'p2', name: 'Champion 3' }, status: 'pending' },
      { id: 'm6', round: 2, position: 1, status: 'pending' },
      { id: 'm7', round: 3, position: 0, status: 'pending' },
    ],
    prizePool: 5000,
    maxParticipants: 8,
  },
];

export function TournamentBracket() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Finals';
    if (round === totalRounds - 1) return 'Semi-Finals';
    if (round === totalRounds - 2) return 'Quarter-Finals';
    return `Round ${round}`;
  };

  const renderMatch = (match: Match, totalRounds: number) => (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative p-3 rounded-xl border transition-all duration-300",
        match.status === 'live' && "border-primary neon-border bg-primary/5",
        match.status === 'completed' && "border-success/50 bg-success/5",
        match.status === 'pending' && "border-border bg-card/50"
      )}
    >
      {match.status === 'live' && (
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-destructive text-[10px] font-bold uppercase tracking-wider"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          LIVE
        </motion.div>
      )}

      <div className="space-y-2">
        {/* Player 1 */}
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-lg transition-colors",
          match.winner === match.player1?.id && "bg-success/20",
          match.winner && match.winner !== match.player1?.id && "opacity-50"
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold">
            {match.player1?.name?.charAt(0) || '?'}
          </div>
          <span className="flex-1 text-sm font-medium truncate">
            {match.player1?.name || 'TBD'}
          </span>
          {match.winner === match.player1?.id && (
            <Crown className="w-4 h-4 text-warning" />
          )}
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className="flex-1 h-px bg-border" />
          <Swords className="w-3 h-3 text-muted-foreground" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Player 2 */}
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-lg transition-colors",
          match.winner === match.player2?.id && "bg-success/20",
          match.winner && match.winner !== match.player2?.id && "opacity-50"
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center text-xs font-bold">
            {match.player2?.name?.charAt(0) || '?'}
          </div>
          <span className="flex-1 text-sm font-medium truncate">
            {match.player2?.name || 'TBD'}
          </span>
          {match.winner === match.player2?.id && (
            <Crown className="w-4 h-4 text-warning" />
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderBracket = (tournament: Tournament) => {
    const rounds = Math.ceil(Math.log2(tournament.maxParticipants));
    const matchesByRound: Record<number, Match[]> = {};
    
    tournament.matches.forEach(match => {
      if (!matchesByRound[match.round]) matchesByRound[match.round] = [];
      matchesByRound[match.round].push(match);
    });

    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-8 min-w-max">
          {Array.from({ length: rounds }, (_, i) => i + 1).map(round => (
            <div key={round} className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-center text-muted-foreground uppercase tracking-wider">
                {getRoundName(round, rounds)}
              </h4>
              <div 
                className="flex flex-col justify-around gap-4"
                style={{ minHeight: `${Math.pow(2, rounds - round) * 120}px` }}
              >
                {(matchesByRound[round] || []).map(match => renderMatch(match, rounds))}
              </div>
            </div>
          ))}

          {/* Trophy */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-warning via-warning to-orange-400 flex items-center justify-center victory-glow"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <span className="mt-2 text-xs font-bold text-warning">Champion</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning via-orange-500 to-red-500 flex items-center justify-center shadow-lg glow-gold">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tournaments</h2>
            <p className="text-sm text-muted-foreground">Compete for glory and prizes</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 btn-ps5">
          <Plus className="w-4 h-4" />
          Create Tournament
        </Button>
      </div>

      {/* Tournament List */}
      {!selectedTournament ? (
        <div className="grid gap-4">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer card-ps5 transition-all hover:scale-[1.01]",
                  tournament.status === 'in_progress' && "border-primary/30"
                )}
                onClick={() => setSelectedTournament(tournament)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center",
                        tournament.status === 'registering' && "bg-gradient-to-br from-primary to-accent",
                        tournament.status === 'in_progress' && "bg-gradient-to-br from-warning to-orange-500 victory-glow",
                        tournament.status === 'completed' && "bg-gradient-to-br from-success to-emerald-500"
                      )}>
                        <Trophy className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{tournament.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="gap-1">
                            <Users className="w-3 h-3" />
                            {tournament.participants.length}/{tournament.maxParticipants}
                          </Badge>
                          <Badge 
                            variant={tournament.status === 'in_progress' ? 'default' : 'secondary'}
                            className={cn(
                              tournament.status === 'in_progress' && "bg-primary animate-pulse"
                            )}
                          >
                            {tournament.status === 'registering' && 'Open'}
                            {tournament.status === 'in_progress' && 'LIVE'}
                            {tournament.status === 'completed' && 'Ended'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4" />
                          <span className="font-bold">{tournament.prizePool}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">XP Prize</span>
                      </div>
                      {tournament.startTime && tournament.status === 'registering' && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">Starts</span>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Tournament Detail View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Button variant="ghost" onClick={() => setSelectedTournament(null)} className="gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Tournaments
          </Button>

          <Card className="card-ps5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center victory-glow">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedTournament.name}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="gap-1">
                        <Users className="w-3 h-3" />
                        {selectedTournament.participants.length} Players
                      </Badge>
                      <Badge variant="default" className="gap-1 bg-warning text-warning-foreground">
                        <Star className="w-3 h-3" />
                        {selectedTournament.prizePool} XP Prize
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedTournament.status === 'registering' && (
                  <Button className="btn-ps5 gap-2" onClick={() => { toast.success('Registered for tournament! You will be notified when it starts.'); }}>
                    <Zap className="w-4 h-4" />
                    Join Tournament
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {renderBracket(selectedTournament)}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default TournamentBracket;
