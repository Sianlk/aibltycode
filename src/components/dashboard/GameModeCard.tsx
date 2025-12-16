import { motion } from "framer-motion";
import { Play, Clock, Zap, Target, Ghost, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

interface GameModeCardProps {
  id: string;
  title: string;
  description: string;
  icon: "typing" | "ordering" | "speed" | "pacman" | "system" | "complexity";
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  index: number;
}

const iconComponents = {
  typing: Target,
  ordering: Gamepad2,
  speed: Zap,
  pacman: Ghost,
  system: Clock,
  complexity: Play,
};

export function GameModeCard({ id, title, description, icon, color, index }: GameModeCardProps) {
  const navigate = useNavigate();
  const { playSound } = useGame();
  const IconComponent = iconComponents[icon];

  const colorClasses = {
    primary: {
      bg: "from-primary/20 to-primary/5",
      border: "border-primary/30 hover:border-primary",
      text: "text-primary",
      glow: "hover:shadow-glow-md",
      iconBg: "bg-primary/20",
    },
    secondary: {
      bg: "from-secondary/20 to-secondary/5",
      border: "border-secondary/30 hover:border-secondary",
      text: "text-secondary",
      glow: "hover:shadow-glow-secondary",
      iconBg: "bg-secondary/20",
    },
    accent: {
      bg: "from-accent/20 to-accent/5",
      border: "border-accent/30 hover:border-accent",
      text: "text-accent",
      glow: "hover:shadow-glow-accent",
      iconBg: "bg-accent/20",
    },
    success: {
      bg: "from-success/20 to-success/5",
      border: "border-success/30 hover:border-success",
      text: "text-success",
      glow: "hover:shadow-glow-success",
      iconBg: "bg-success/20",
    },
    warning: {
      bg: "from-warning/20 to-warning/5",
      border: "border-warning/30 hover:border-warning",
      text: "text-warning",
      glow: "hover:shadow-[0_0_20px_hsla(45,93%,58%,0.4)]",
      iconBg: "bg-warning/20",
    },
  };

  const colors = colorClasses[color];

  const handlePlay = () => {
    playSound("click");
    navigate(`/game/${id}`);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        variant="game"
        className={`cursor-pointer bg-gradient-to-br ${colors.bg} border-2 ${colors.border} ${colors.glow} transition-all duration-300`}
        onClick={handlePlay}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}
              whileHover={{ rotate: 10 }}
            >
              <IconComponent className={`w-6 h-6 ${colors.text}`} />
            </motion.div>
            <div className="flex-1">
              <h4 className={`font-bold ${colors.text}`}>{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Button variant="ghost" size="icon" className={colors.text}>
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
