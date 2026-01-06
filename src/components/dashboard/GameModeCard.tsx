import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

interface GameModeCardProps {
  id: string;
  title: string;
  description: string;
  icon: "typing" | "ordering" | "speed" | "pacman" | "system" | "complexity";
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  emoji: string;
  index: number;
  link?: string;
}

export function GameModeCard({ id, title, description, emoji, color, index, link }: GameModeCardProps) {
  const navigate = useNavigate();
  const { playSound } = useGame();

  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]",
    secondary: "from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/60 hover:shadow-[0_0_30px_rgba(var(--secondary),0.3)]",
    accent: "from-accent/20 to-accent/5 border-accent/30 hover:border-accent/60 hover:shadow-[0_0_30px_rgba(var(--accent),0.3)]",
    success: "from-success/20 to-success/5 border-success/30 hover:border-success/60 hover:shadow-[0_0_30px_rgba(var(--success),0.3)]",
    warning: "from-warning/20 to-warning/5 border-warning/30 hover:border-warning/60 hover:shadow-[0_0_30px_rgba(var(--warning),0.3)]",
  };

  const iconBgClasses = {
    primary: "bg-gradient-to-br from-primary to-primary/60",
    secondary: "bg-gradient-to-br from-secondary to-secondary/60",
    accent: "bg-gradient-to-br from-accent to-accent/60",
    success: "bg-gradient-to-br from-success to-success/60",
    warning: "bg-gradient-to-br from-warning to-warning/60",
  };

  const handlePlay = () => {
    playSound("click");
    if (link) {
      navigate(link);
    } else {
      navigate(`/game/${id}`);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card
        className={cn(
          "cursor-pointer border-2 bg-gradient-to-br transition-all duration-300 overflow-hidden group",
          colorClasses[color]
        )}
        onClick={handlePlay}
      >
        <CardContent className="p-4 relative">
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <motion.div 
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg",
                iconBgClasses[color]
              )}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              {emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground truncate text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
            <motion.div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                `bg-${color}/20 group-hover:bg-${color}/40`
              )}
              whileHover={{ x: 3 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
