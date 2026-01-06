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
import PatternRecognitionGame from "@/components/games/PatternRecognitionGame";
import StructureBuilderGame from "@/components/games/StructureBuilderGame";
import { MnemonicFlashcardGame } from "@/components/games/MnemonicFlashcardGame";
import SpacedRepetitionGame from "@/components/games/SpacedRepetitionGame";
import DebuggingGame from "@/components/games/DebuggingGame";
import ERDBuilderGame from "@/components/games/ERDBuilderGame";
import ProjectPlannerGame from "@/components/games/ProjectPlannerGame";
import GraphVisualizerGame from "@/components/games/GraphVisualizerGame";
import UseCaseDiagramGame from "@/components/games/UseCaseDiagramGame";
import ExcelMasterGame from "@/components/games/ExcelMasterGame";
import SQLQueryGame from "@/components/games/SQLQueryGame";
import CybersecurityGame from "@/components/games/CybersecurityGame";
import AIDataScienceGame from "@/components/games/AIDataScienceGame";
import GameDevGame from "@/components/games/GameDevGame";
import AdaptiveLearningEngine from "@/components/games/AdaptiveLearningEngine";
import VoiceCodeCoach from "@/components/games/VoiceCodeCoach";
import CodePuzzleBuilder from "@/components/games/CodePuzzleBuilder";
import { ArrowLeft, Trophy, Star, Zap } from "lucide-react";
import { useAchievements } from "@/contexts/AchievementContext";
import { useEffect } from "react";

const gameComponents: Record<string, React.ComponentType> = {
  typing: CodeTypingGame,
  ordering: CodeOrderingGame,
  speed: SpeedChallengeGame,
  pacman: PacmanCoderGame,
  "system-design": SystemBuilderGame,
  "complexity-arcade": ComplexityArcadeGame,
  pattern: PatternRecognitionGame,
  "structure-builder": StructureBuilderGame,
  flashcards: MnemonicFlashcardGame,
  "spaced-rep": SpacedRepetitionGame,
  debugging: DebuggingGame,
  "erd-builder": ERDBuilderGame,
  "project-planner": ProjectPlannerGame,
  "graph-visualizer": GraphVisualizerGame,
  "use-case": UseCaseDiagramGame,
  "excel-master": ExcelMasterGame,
  "sql-query": SQLQueryGame,
  "cybersecurity": CybersecurityGame,
  "ai-data": AIDataScienceGame,
  "game-dev": GameDevGame,
  "adaptive": AdaptiveLearningEngine,
  "voice-coach": VoiceCodeCoach,
  "puzzle-builder": CodePuzzleBuilder,
};

const gameInfo: Record<string, { title: string; emoji: string; color: string }> = {
  typing: { title: "Code Typing Practice", emoji: "⌨️", color: "primary" },
  ordering: { title: "Code Ordering Puzzle", emoji: "🧩", color: "success" },
  speed: { title: "Speed Challenge", emoji: "⚡", color: "warning" },
  pacman: { title: "Pacman Coder", emoji: "👾", color: "primary" },
  "system-design": { title: "System Design", emoji: "🔧", color: "accent" },
  "complexity-arcade": { title: "Complexity Arcade", emoji: "📊", color: "secondary" },
  pattern: { title: "Pattern Master", emoji: "🧠", color: "primary" },
  "structure-builder": { title: "Structure Builder", emoji: "🏗️", color: "accent" },
  flashcards: { title: "Visual Mnemonic Cards", emoji: "🃏", color: "warning" },
  "spaced-rep": { title: "Spaced Repetition", emoji: "🧠", color: "success" },
  debugging: { title: "Bug Hunter", emoji: "🐛", color: "warning" },
  "erd-builder": { title: "ERD Builder", emoji: "🗂️", color: "primary" },
  "project-planner": { title: "Project Planner", emoji: "📋", color: "accent" },
  "graph-visualizer": { title: "Graph Explorer", emoji: "📊", color: "success" },
  "use-case": { title: "Use Case Diagrams", emoji: "👥", color: "warning" },
  "excel-master": { title: "Excel Master", emoji: "📊", color: "success" },
  "sql-query": { title: "SQL Query Master", emoji: "🗄️", color: "primary" },
  "cybersecurity": { title: "Security Challenge", emoji: "🛡️", color: "warning" },
  "ai-data": { title: "AI & Data Science", emoji: "🤖", color: "accent" },
  "game-dev": { title: "Game Development", emoji: "🎮", color: "primary" },
  "adaptive": { title: "Adaptive Learning", emoji: "🧠", color: "secondary" },
  "voice-coach": { title: "Voice Code Coach", emoji: "🗣️", color: "accent" },
  "puzzle-builder": { title: "Code Puzzle Builder", emoji: "🧩", color: "primary" },
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { unlockAchievement } = useAchievements();

  const GameComponent = gameId ? gameComponents[gameId] : null;
  const info = gameId ? gameInfo[gameId] : null;

  // Unlock first game achievement
  useEffect(() => {
    if (gameId) {
      unlockAchievement('first_game');
    }
  }, [gameId, unlockAchievement]);

  if (!GameComponent || !info) {
    return (
      <div className="min-h-screen bg-background battle-arena-bg flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center glass p-8 rounded-2xl"
        >
          <p className="text-xl text-muted-foreground mb-4">Game not found</p>
          <Button onClick={() => navigate("/dashboard")} className="btn-ps5">
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen battle-arena-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${info.color} to-${info.color}/60 flex items-center justify-center text-3xl shadow-lg pulse-glow`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {info.emoji}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                {info.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">+50-150 XP</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Streak Bonus</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-ps5 p-6">
            <GameComponent />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
