import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Swords, Eye, Trophy, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BattleLobby } from '@/components/multiplayer/BattleLobby';
import { BattleArena } from '@/components/multiplayer/BattleArena';
import { SpectatorMode } from '@/components/multiplayer/SpectatorMode';
import { WinnersTable } from '@/components/multiplayer/WinnersTable';
import { TournamentBracket } from '@/components/multiplayer/TournamentBracket';
import { VoiceChat } from '@/components/multiplayer/VoiceChat';
import { useBattle } from '@/hooks/useBattle';

export default function MultiplayerBattle() {
  const navigate = useNavigate();
  const { currentRoom, loadStats } = useBattle();
  const [activeTab, setActiveTab] = useState('arena');

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const inBattle = currentRoom && (currentRoom.status === 'active' || currentRoom.status === 'completed');

  return (
    <div className="min-h-screen battle-arena-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.5)] pulse-glow"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Swords className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold font-display">Battle Arena</h1>
                <p className="text-sm text-muted-foreground">Challenge others in real-time coding duels!</p>
              </div>
            </div>
          </div>

          {/* Voice Chat */}
          {currentRoom && (
            <VoiceChat roomId={currentRoom.id} />
          )}
        </motion.div>

        {inBattle ? (
          <BattleArena />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 h-12 glass">
              <TabsTrigger value="arena" className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Swords className="h-4 w-4" />
                <span className="hidden sm:inline">Arena</span>
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="gap-2 text-sm data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Tournaments</span>
              </TabsTrigger>
              <TabsTrigger value="spectate" className="gap-2 text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Spectate</span>
              </TabsTrigger>
              <TabsTrigger value="champions" className="gap-2 text-sm data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Champions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="arena" className="mt-6">
              <BattleLobby />
            </TabsContent>

            <TabsContent value="tournaments" className="mt-6">
              <TournamentBracket />
            </TabsContent>

            <TabsContent value="spectate" className="mt-6">
              <SpectatorMode />
            </TabsContent>

            <TabsContent value="champions" className="mt-6">
              <WinnersTable />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}