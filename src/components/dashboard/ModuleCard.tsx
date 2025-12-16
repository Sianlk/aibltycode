import { motion } from "framer-motion";
import { Lock, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Module } from "@/types/game";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  module: Module;
  index: number;
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const { setCurrentModule, playSound } = useGame();
  const navigate = useNavigate();

  const colorClasses = {
    primary: {
      border: "hover:border-primary/50",
      glow: "hover:shadow-glow-md",
      text: "text-primary",
      bg: "bg-primary/10",
    },
    secondary: {
      border: "hover:border-secondary/50",
      glow: "hover:shadow-glow-secondary",
      text: "text-secondary",
      bg: "bg-secondary/10",
    },
    accent: {
      border: "hover:border-accent/50",
      glow: "hover:shadow-glow-accent",
      text: "text-accent",
      bg: "bg-accent/10",
    },
    success: {
      border: "hover:border-success/50",
      glow: "hover:shadow-glow-success",
      text: "text-success",
      bg: "bg-success/10",
    },
    warning: {
      border: "hover:border-warning/50",
      glow: "hover:shadow-[0_0_20px_hsla(45,93%,58%,0.4)]",
      text: "text-warning",
      bg: "bg-warning/10",
    },
  };

  const colors = colorClasses[module.color];

  const handleClick = () => {
    if (!module.unlocked) {
      playSound("error");
      return;
    }
    playSound("click");
    setCurrentModule(module);
    navigate(`/module/${module.id}`);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card
        variant="module"
        className={`cursor-pointer transition-all duration-300 ${colors.border} ${colors.glow} ${!module.unlocked && "opacity-60"}`}
        onClick={handleClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center text-3xl`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {module.icon}
            </motion.div>
            {!module.unlocked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : module.progress === 100 ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : null}
          </div>

          <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
            {module.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {module.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className={`font-bold ${colors.text}`}>{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="h-2" />
          </div>

          <Button
            variant="ghost"
            className={`w-full mt-4 ${colors.text} hover:${colors.bg}`}
            disabled={!module.unlocked}
          >
            {module.unlocked ? (
              <>
                Continue Learning
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Locked"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
