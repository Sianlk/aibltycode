import { motion } from "framer-motion";
import { SkillLevel, levelRequirements } from "@/data/learningSystem";
import { Zap, Target, Clock, Flame, Award } from "lucide-react";

interface MasteryMeterProps {
  skillName: string;
  level: SkillLevel;
  automationScore: number;
  accuracy: number;
  avgSpeed: number;
  streakDays: number;
  compact?: boolean;
}

const levelColors: Record<SkillLevel, string> = {
  novice: 'text-muted-foreground',
  apprentice: 'text-primary',
  practitioner: 'text-success',
  automator: 'text-warning',
  mentor: 'text-accent'
};

const levelIcons: Record<SkillLevel, string> = {
  novice: '🌱',
  apprentice: '📚',
  practitioner: '⚡',
  automator: '🤖',
  mentor: '👑'
};

const levelLabels: Record<SkillLevel, string> = {
  novice: 'Novice',
  apprentice: 'Apprentice',
  practitioner: 'Practitioner',
  automator: 'Automator',
  mentor: 'Mentor'
};

export function MasteryMeter({
  skillName,
  level,
  automationScore,
  accuracy,
  avgSpeed,
  streakDays,
  compact = false
}: MasteryMeterProps) {
  const levelIndex = ['novice', 'apprentice', 'practitioner', 'automator', 'mentor'].indexOf(level);
  const progress = ((levelIndex + 1) / 5) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
        <span className="text-2xl">{levelIcons[level]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">{skillName}</span>
            <span className={`text-xs font-bold ${levelColors[level]}`}>{levelLabels[level]}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${automationScore}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${level === 'automator' || level === 'mentor' ? 'bg-gradient-to-r from-warning to-accent' : 'bg-primary'}`}
            />
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold">{automationScore}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{levelIcons[level]}</span>
          <div>
            <h3 className="font-bold text-lg">{skillName}</h3>
            <span className={`text-sm font-medium ${levelColors[level]}`}>{levelLabels[level]}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{automationScore}%</div>
          <div className="text-xs text-muted-foreground">Automation</div>
        </div>
      </div>

      {/* Level progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          {(['novice', 'apprentice', 'practitioner', 'automator', 'mentor'] as SkillLevel[]).map((l, i) => (
            <div
              key={l}
              className={`flex flex-col items-center ${i <= levelIndex ? 'opacity-100' : 'opacity-30'}`}
            >
              <span className="text-lg">{levelIcons[l]}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">{levelLabels[l]}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-success to-warning"
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-success" />
          <div className="text-lg font-bold">{accuracy}%</div>
          <div className="text-[10px] text-muted-foreground">Accuracy</div>
        </div>
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold">{avgSpeed}s</div>
          <div className="text-[10px] text-muted-foreground">Avg Speed</div>
        </div>
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-warning" />
          <div className="text-lg font-bold">{streakDays}</div>
          <div className="text-[10px] text-muted-foreground">Day Streak</div>
        </div>
      </div>

      {/* Next level requirements */}
      {level !== 'mentor' && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>Next level: {accuracy < levelRequirements[levelIndex + 1]?.minAccuracy ? `${levelRequirements[levelIndex + 1]?.minAccuracy}% accuracy` : avgSpeed > levelRequirements[levelIndex + 1]?.maxAvgSpeed ? `<${levelRequirements[levelIndex + 1]?.maxAvgSpeed}s avg` : `${levelRequirements[levelIndex + 1]?.streakRequired} day streak`}</span>
          </div>
        </div>
      )}
    </div>
  );
}
