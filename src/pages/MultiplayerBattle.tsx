import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BattleLobby } from '@/components/multiplayer/BattleLobby';
import { BattleArena } from '@/components/multiplayer/BattleArena';
import { useBattle } from '@/hooks/useBattle';

export default function MultiplayerBattle() {
  const navigate = useNavigate();
  const { currentRoom, loadStats } = useBattle();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const inBattle = currentRoom && (currentRoom.status === 'active' || currentRoom.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Swords className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Multiplayer Battle</h1>
              <p className="text-sm text-muted-foreground">Challenge others in real-time coding duels!</p>
            </div>
          </div>
        </motion.div>

        {inBattle ? <BattleArena /> : <BattleLobby />}
      </main>
    </div>
  );
}
