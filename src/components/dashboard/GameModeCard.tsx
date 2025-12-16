import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

interface GameModeCardProps {
  id: string;
  title: string;
  description: string;
  icon: "typing" | "ordering" | "speed" | "pacman" | "system" | "complexity";
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  emoji: string;
  index: number;
}

export function GameModeCard({ id, title, description, emoji, color, index }: GameModeCardProps) {
  const navigate = useNavigate();
  const { playSound } = useGame();

  const colorClasses = {
    primary: "bg-primary/10 hover:bg-primary/20 border-primary/20",
    secondary: "bg-secondary/10 hover:bg-secondary/20 border-secondary/20",
    accent: "bg-accent/10 hover:bg-accent/20 border-accent/20",
    success: "bg-success/10 hover:bg-success/20 border-success/20",
    warning: "bg-warning/10 hover:bg-warning/20 border-warning/20",
  };

  const handlePlay = () => {
    playSound("click");
    navigate(`/game/${id}`);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer border ${colorClasses[color]} transition-all duration-200`}
        onClick={handlePlay}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{emoji}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground truncate">{title}</h4>
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
            <Play className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
