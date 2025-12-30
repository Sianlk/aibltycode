import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { sessionFlows, SkillLevel } from "@/data/learningSystem";
import { Play, Clock, Brain, Gamepad2, Target, MessageCircle } from "lucide-react";

interface SessionCardProps {
  trackName: string;
  trackIcon: string;
  level: SkillLevel;
  recommendedGame?: string;
  weakArea?: string;
}

const phaseIcons = {
  diagnostic: Brain,
  lesson: MessageCircle,
  practice: Gamepad2,
  challenge: Target,
  reflection: MessageCircle
};

const phaseColors = {
  diagnostic: 'text-primary',
  lesson: 'text-success',
  practice: 'text-warning',
  challenge: 'text-secondary',
  reflection: 'text-accent'
};

export function SessionCard({ trackName, trackIcon, level, recommendedGame, weakArea }: SessionCardProps) {
  const navigate = useNavigate();
  const flow = sessionFlows[level];
  const totalDuration = flow.reduce((sum, phase) => sum + phase.duration, 0);

  const handleStartSession = () => {
    // Navigate to first recommended game or lesson
    if (recommendedGame) {
      navigate(`/game/${recommendedGame}`);
    } else {
      navigate(`/module/java-foundations`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-primary/10 via-card to-accent/5 rounded-2xl border border-primary/20 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{trackIcon}</span>
          <div>
            <h3 className="font-bold text-lg">{trackName}</h3>
            <p className="text-sm text-muted-foreground">Personalized {totalDuration}-min session</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{totalDuration} min</span>
        </div>
      </div>

      {/* Session phases */}
      <div className="space-y-2 mb-4">
        {flow.map((phase, index) => {
          const Icon = phaseIcons[phase.phase];
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
            >
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${phaseColors[phase.phase]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm capitalize">{phase.phase}</span>
                <span className="text-xs text-muted-foreground ml-2">({phase.duration} min)</span>
              </div>
              <span className="text-xs text-muted-foreground">{phase.activities[0]}</span>
            </div>
          );
        })}
      </div>

      {/* Weak area notice */}
      {weakArea && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-warning">
            💡 Focus area: <strong>{weakArea}</strong> - included in this session
          </p>
        </div>
      )}

      {/* Start button */}
      <Button
        onClick={handleStartSession}
        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
      >
        <Play className="w-5 h-5 mr-2" />
        Start Session
      </Button>
    </motion.div>
  );
}
