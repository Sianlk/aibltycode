import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zone, getGamesByZone } from "@/data/learningSystem";
import { useGame } from "@/contexts/GameContext";
import { Lock, ChevronRight, Sparkles } from "lucide-react";

interface ZoneCardProps {
  zone: Zone;
  index: number;
  unlocked?: boolean;
  progress?: number;
  gamesCompleted?: number;
}

export function ZoneCard({ zone, index, unlocked = true, progress = 0, gamesCompleted = 0 }: ZoneCardProps) {
  const navigate = useNavigate();
  const { gameMode } = useGame();
  const isKidsMode = gameMode === "kid";
  const games = getGamesByZone(zone.id);
  
  const colorClasses = {
    primary: 'border-primary/30 hover:border-primary/60 hover:shadow-glow-md',
    success: 'border-success/30 hover:border-success/60 hover:shadow-glow-success',
    warning: 'border-warning/30 hover:border-warning/60 hover:shadow-glow-secondary',
    secondary: 'border-secondary/30 hover:border-secondary/60 hover:shadow-glow-secondary',
    accent: 'border-accent/30 hover:border-accent/60 hover:shadow-glow-accent',
  };

  const bgGradients = {
    primary: 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent',
    success: 'bg-gradient-to-br from-success/10 via-success/5 to-transparent',
    warning: 'bg-gradient-to-br from-warning/10 via-warning/5 to-transparent',
    secondary: 'bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent',
    accent: 'bg-gradient-to-br from-accent/10 via-accent/5 to-transparent',
  };

  const iconBg = {
    primary: 'bg-primary/20',
    success: 'bg-success/20',
    warning: 'bg-warning/20',
    secondary: 'bg-secondary/20',
    accent: 'bg-accent/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => unlocked && navigate(`/zone/${zone.id}`)}
      className={`
        relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300
        ${bgGradients[zone.color as keyof typeof bgGradients]}
        ${colorClasses[zone.color as keyof typeof colorClasses]}
        ${!unlocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Lock overlay for locked zones */}
      {!unlocked && (
        <div className="absolute inset-0 bg-background/50 rounded-2xl flex items-center justify-center z-10">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {/* Zone icon */}
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center mb-4
        ${iconBg[zone.color as keyof typeof iconBg]}
      `}>
        <span className={`text-4xl ${isKidsMode ? 'animate-bounce' : ''}`}>{zone.icon}</span>
      </div>

      {/* Zone info */}
      <h3 className={`font-bold text-lg mb-1 ${isKidsMode ? 'text-xl' : ''}`}>{zone.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{zone.description}</p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{gamesCompleted}/{games.length} games</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            className={`h-full rounded-full bg-${zone.color}`}
          />
        </div>
      </div>

      {/* Games preview */}
      <div className="flex flex-wrap gap-1 mb-3">
        {games.slice(0, 4).map((game) => (
          <span
            key={game.id}
            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {game.name}
          </span>
        ))}
        {games.length > 4 && (
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            +{games.length - 4} more
          </span>
        )}
      </div>

      {/* Enter zone CTA */}
      <div className={`
        flex items-center justify-between mt-auto pt-2 border-t border-border/50
        text-sm font-medium text-${zone.color}
      `}>
        <span className="flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          {isKidsMode ? 'Explore!' : 'Enter Zone'}
        </span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}
