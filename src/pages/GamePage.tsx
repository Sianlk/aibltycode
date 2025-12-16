import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CodeTypingGame } from "@/components/games/CodeTypingGame";
import { CodeOrderingGame } from "@/components/games/CodeOrderingGame";
import { SpeedChallengeGame } from "@/components/games/SpeedChallengeGame";
import PacmanCoderGame from "@/components/games/PacmanCoderGame";
import SystemBuilderGame from "@/components/games/SystemBuilderGame";
import ComplexityArcadeGame from "@/components/games/ComplexityArcadeGame";
import { ArrowLeft } from "lucide-react";

const gameComponents: Record<string, React.ComponentType> = {
  typing: CodeTypingGame,
  ordering: CodeOrderingGame,
  speed: SpeedChallengeGame,
  pacman: PacmanCoderGame,
  "system-builder": SystemBuilderGame,
  "complexity-arcade": ComplexityArcadeGame,
};

const gameInfo: Record<string, { title: string; emoji: string }> = {
  typing: { title: "Code Typing Practice", emoji: "⌨️" },
  ordering: { title: "Code Ordering Puzzle", emoji: "🧩" },
  speed: { title: "Speed Challenge", emoji: "⚡" },
  pacman: { title: "Pacman Coder", emoji: "👾" },
  "system-builder": { title: "System Builder", emoji: "🏗️" },
  "complexity-arcade": { title: "Complexity Arcade", emoji: "📊" },
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const GameComponent = gameId ? gameComponents[gameId] : null;
  const info = gameId ? gameInfo[gameId] : null;

  if (!GameComponent || !info) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Game not found</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {info.emoji} {info.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <GameComponent />
        </motion.div>
      </main>
    </div>
  );
}
