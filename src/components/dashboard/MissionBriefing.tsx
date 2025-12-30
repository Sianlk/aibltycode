import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { feedbackMessages, zones } from "@/data/learningSystem";
import { Target, Clock, Award, ChevronRight } from "lucide-react";

interface MissionBriefingProps {
  zoneId: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  xpReward?: number;
  timeLimit?: number;
}

const zoneToMissionKey: Record<string, keyof typeof feedbackMessages.missions> = {
  'logic-district': 'logicDistrict',
  'data-city': 'dataCity',
  'security-sector': 'securitySector',
  'algorithm-arcade': 'algorithmArcade',
  'ai-lab': 'aiLab',
  'dev-studio': 'devStudio'
};

export function MissionBriefing({ zoneId, difficulty = 'medium', xpReward = 100, timeLimit }: MissionBriefingProps) {
  const navigate = useNavigate();
  const zone = zones.find(z => z.id === zoneId);
  const missionKey = zoneToMissionKey[zoneId];
  const missionText = missionKey ? feedbackMessages.missions[missionKey] : '';

  if (!zone) return null;

  const difficultyColors = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    hard: 'bg-destructive/20 text-destructive'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-${zone.color}/30
        bg-gradient-to-br ${zone.gradient} p-6
      `}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full" />

      {/* Header */}
      <div className="relative flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-${zone.color}/20 flex items-center justify-center`}>
          <span className="text-3xl">{zone.icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 text-${zone.color}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Mission Briefing</span>
          </div>
          <h3 className="font-bold text-xl">{zone.name}</h3>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[difficulty]}`}>
          {difficulty.toUpperCase()}
        </span>
      </div>

      {/* Mission text */}
      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
        {missionText}
      </p>

      {/* Rewards */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium">{xpReward} XP</span>
        </div>
        {timeLimit && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{timeLimit} min</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <Button
        onClick={() => navigate(`/zone/${zoneId}`)}
        className={`w-full bg-${zone.color} hover:bg-${zone.color}/90`}
      >
        Accept Mission
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
