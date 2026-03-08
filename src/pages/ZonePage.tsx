import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { GameModeCard } from "@/components/dashboard/GameModeCard";
import { MasteryMeter } from "@/components/dashboard/MasteryMeter";
import { MissionBriefing } from "@/components/dashboard/MissionBriefing";
import { getGamesByZone, getZoneById, learningTracks, SkillLevel } from "@/data/learningSystem";
import { useGame } from "@/contexts/GameContext";
import { ArrowLeft, Lock, Sparkles, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const gameIconMap: Record<string, { icon: "typing" | "ordering" | "speed"; emoji: string }> = {
  'pattern': { icon: 'typing', emoji: '🧠' },
  'typing': { icon: 'typing', emoji: '⌨️' },
  'ordering': { icon: 'ordering', emoji: '🧩' },
  'debugging': { icon: 'speed', emoji: '🐛' },
  'structure-builder': { icon: 'ordering', emoji: '🏗️' },
  'erd-builder': { icon: 'ordering', emoji: '🗂️' },
  'sql-query': { icon: 'ordering', emoji: '🗄️' },
  'excel-master': { icon: 'typing', emoji: '📊' },
  'graph-visualizer': { icon: 'speed', emoji: '📈' },
  'cybersecurity': { icon: 'speed', emoji: '🛡️' },
  'system-design': { icon: 'ordering', emoji: '🔧' },
  'complexity-arcade': { icon: 'typing', emoji: '📊' },
  'speed': { icon: 'speed', emoji: '⚡' },
  'pacman': { icon: 'speed', emoji: '👾' },
  'ai-data': { icon: 'typing', emoji: '🤖' },
  'flashcards': { icon: 'typing', emoji: '🃏' },
  'spaced-rep': { icon: 'typing', emoji: '🧠' },
  'project-planner': { icon: 'ordering', emoji: '📋' },
  'use-case': { icon: 'ordering', emoji: '👥' },
  'game-dev': { icon: 'speed', emoji: '🎮' },
  'draw-io': { icon: 'ordering', emoji: '📐' },
  'plantuml': { icon: 'typing', emoji: '📝' },
};

export default function ZonePage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { gameMode } = useGame();
  const isKidsMode = gameMode === "kid";

  const zone = getZoneById(zoneId || '');
  const games = getGamesByZone(zoneId || '');

  if (!zone) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold">Zone not found</h1>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  // Mock mastery data - in production, this would come from the database
  const mockMasteryData = zone.skills.slice(0, 4).map((skill, i) => ({
    skillName: skill.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    level: (['novice', 'apprentice', 'practitioner', 'automator'] as SkillLevel[])[i % 4],
    automationScore: 25 + (i * 15),
    accuracy: 70 + (i * 5),
    avgSpeed: 8 - i,
    streakDays: i + 1,
  }));

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-gradient-to-b from-primary/5 via-background to-accent/5' : 'bg-background'}`}>
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Zone Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-8 bg-gradient-to-br ${zone.gradient} border border-${zone.color}/30`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-${zone.color}/20 flex items-center justify-center`}>
              <span className={`text-5xl ${isKidsMode ? 'animate-bounce' : ''}`}>{zone.icon}</span>
            </div>
            <div className="flex-1">
              <h1 className={`font-bold mb-2 ${isKidsMode ? 'text-3xl' : 'text-2xl'}`}>{zone.name}</h1>
              <p className="text-muted-foreground">{zone.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {zone.skills.slice(0, 5).map(skill => (
                  <span key={skill} className={`text-xs px-2 py-1 rounded-full bg-${zone.color}/20 text-${zone.color}`}>
                    {skill.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission Briefing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <MissionBriefing
            zoneId={zone.id}
            difficulty="medium"
            xpReward={150}
            timeLimit={25}
          />
        </motion.div>

        {/* Mastery Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`font-bold mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : 'text-xl'}`}>
            <Target className="w-5 h-5 text-primary" />
            {isKidsMode ? '🎯 Your Skills!' : 'Skill Mastery'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockMasteryData.map((skill) => (
              <MasteryMeter
                key={skill.skillName}
                skillName={skill.skillName}
                level={skill.level}
                automationScore={skill.automationScore}
                accuracy={skill.accuracy}
                avgSpeed={skill.avgSpeed}
                streakDays={skill.streakDays}
                compact
              />
            ))}
          </div>
        </motion.section>

        {/* Zone Games */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={`font-bold mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : 'text-xl'}`}>
            <Sparkles className="w-5 h-5 text-accent" />
            {isKidsMode ? '🎮 Zone Games!' : 'Games in this Zone'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {games.map((game, index) => {
              const iconInfo = gameIconMap[game.id] || { icon: 'typing' as const, emoji: '🎮' };
              return (
                <GameModeCard
                  key={game.id}
                  id={game.id}
                  title={game.name}
                  description={game.skills.slice(0, 2).join(', ')}
                  icon={iconInfo.icon}
                  color={zone.color as 'primary' | 'secondary' | 'accent' | 'success' | 'warning'}
                  emoji={iconInfo.emoji}
                  index={index}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Learning Track Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className={`font-bold mb-4 flex items-center gap-2 ${isKidsMode ? 'text-2xl' : 'text-xl'}`}>
            <Trophy className="w-5 h-5 text-warning" />
            {isKidsMode ? '🏆 Your Journey!' : 'Learning Track Progress'}
          </h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{zone.name} Track</span>
              <span className="text-sm text-muted-foreground">Level 2 of 5</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(['novice', 'apprentice', 'practitioner', 'automator', 'mentor'] as SkillLevel[]).map((level, i) => (
                <div
                  key={level}
                  className={`p-2 rounded-lg text-center text-xs transition-all ${
                    i === 0 ? 'bg-success/20 text-success border border-success/30' :
                    i === 1 ? 'bg-primary/20 text-primary border border-primary/30 animate-pulse' :
                    'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {i > 1 && <Lock className="w-3 h-3 mx-auto mb-1 opacity-50" />}
                  <span className="capitalize">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
