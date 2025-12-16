import { motion } from "framer-motion";
import { Lock, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

  const completedCount = Math.floor((module.progress / 100) * (module.lessons?.length || 3));
  const totalCount = module.lessons?.length || 3;

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
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-200 hover:bg-muted/50 ${!module.unlocked && "opacity-60"}`}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl"
                whileHover={{ scale: 1.1 }}
              >
                {module.icon}
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground">{module.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount}/{totalCount} Complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!module.unlocked ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : module.progress === 100 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
          <Progress value={module.progress} className="h-2" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
