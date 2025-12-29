import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Gamepad2, Star, Lightbulb } from "lucide-react";

interface GameDevChallenge {
  id: number;
  scenario: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "design" | "programming" | "graphics" | "physics";
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: GameDevChallenge[] = [
  {
    id: 1,
    scenario: "What is the main loop that runs continuously in a game, handling input, updating state, and rendering?",
    correctAnswer: "Game Loop",
    options: ["Game Loop", "Event Handler", "State Machine", "Render Pipeline"],
    hint: "It 'loops' continuously while the game runs",
    explanation: "The Game Loop is the heartbeat of a game: Input → Update → Render → Repeat (typically 60 times per second)!",
    category: "programming"
  },
  {
    id: 2,
    scenario: "A game runs at 60 FPS. How many milliseconds between each frame?",
    correctAnswer: "~16.67ms (1000ms ÷ 60)",
    options: ["~16.67ms (1000ms ÷ 60)", "60ms", "100ms", "1000ms"],
    hint: "Divide 1 second (1000ms) by frames per second",
    explanation: "1000ms ÷ 60 FPS ≈ 16.67ms per frame. This is your 'frame budget' for all game logic and rendering!",
    category: "programming"
  },
  {
    id: 3,
    scenario: "What design pattern is commonly used to manage different game screens (menu, gameplay, pause)?",
    correctAnswer: "State Machine / State Pattern",
    options: ["State Machine / State Pattern", "Singleton", "Factory", "Observer"],
    hint: "The game transitions between different 'states'",
    explanation: "State machines cleanly manage transitions between game states. Each state handles its own logic and rendering.",
    category: "design"
  },
  {
    id: 4,
    scenario: "What is 'delta time' used for in game development?",
    correctAnswer: "Frame-rate independent movement",
    options: ["Frame-rate independent movement", "Counting total time", "Network latency", "Score calculation"],
    hint: "Movement should be the same whether running at 30 or 60 FPS",
    explanation: "Delta time = time since last frame. Multiply by velocity for consistent movement across different frame rates!",
    category: "programming"
  },
  {
    id: 5,
    scenario: "What collision detection method checks if two rectangular boundaries overlap?",
    correctAnswer: "AABB (Axis-Aligned Bounding Box)",
    options: ["AABB (Axis-Aligned Bounding Box)", "Ray casting", "Pixel-perfect collision", "SAT algorithm"],
    hint: "Uses simple rectangle bounds aligned to x and y axes",
    explanation: "AABB is fast and simple: check if rectangles overlap on both X and Y axes. Great for many 2D games!",
    category: "physics"
  },
  {
    id: 6,
    scenario: "In a 2D platformer, what creates the illusion of movement when the camera follows the player?",
    correctAnswer: "Parallax scrolling",
    options: ["Parallax scrolling", "Anti-aliasing", "Bloom effect", "Motion blur"],
    hint: "Background layers move at different speeds",
    explanation: "Parallax: distant layers scroll slower than near layers, creating depth perception. Classic 2D technique!",
    category: "graphics"
  },
  {
    id: 7,
    scenario: "What is the technique of reusing game objects instead of creating/destroying them?",
    correctAnswer: "Object Pooling",
    options: ["Object Pooling", "Garbage Collection", "Memory Mapping", "Lazy Loading"],
    hint: "Think of a 'pool' of pre-created bullets waiting to be used",
    explanation: "Object pooling avoids expensive allocation/deallocation. Pre-create objects, reuse them. Essential for bullets, particles!",
    category: "programming"
  },
  {
    id: 8,
    scenario: "What makes a game 'feel good' through responsive controls, screen shake, and particle effects?",
    correctAnswer: "Game Feel / Juice",
    options: ["Game Feel / Juice", "Polygon count", "Frame rate", "Resolution"],
    hint: "It's about the 'juiciness' of interactions",
    explanation: "Game Feel/Juice = feedback, responsiveness, and polish. Screen shake, particles, sound effects, and smooth animations!",
    category: "design"
  },
  {
    id: 9,
    scenario: "A sprite sheet contains multiple animation frames in one image. What is the process of displaying them sequentially?",
    correctAnswer: "Sprite Animation / Frame Animation",
    options: ["Sprite Animation / Frame Animation", "Skeletal Animation", "Procedural Animation", "Motion Capture"],
    hint: "Flip through frames like a flipbook",
    explanation: "Display different regions of the sprite sheet in sequence. Control speed with frame timing. Classic 2D animation!",
    category: "graphics"
  },
  {
    id: 10,
    scenario: "What game design concept describes the flow between challenge and skill that keeps players engaged?",
    correctAnswer: "Flow State / Flow Channel",
    options: ["Flow State / Flow Channel", "Grind", "Power Curve", "Meta Gaming"],
    hint: "Not too easy (boring), not too hard (frustrating)",
    explanation: "Flow = perfect balance of challenge vs skill. Too easy = bored. Too hard = anxious. The sweet spot = engaged!",
    category: "design"
  },
  {
    id: 11,
    scenario: "In physics simulation, what force constantly pulls objects downward?",
    correctAnswer: "Gravity (typically 9.8 m/s² or game-adjusted)",
    options: ["Gravity (typically 9.8 m/s² or game-adjusted)", "Friction", "Drag", "Torque"],
    hint: "What makes Mario fall after jumping?",
    explanation: "Gravity acceleration adds to vertical velocity each frame. Games often use exaggerated values for better feel!",
    category: "physics"
  },
  {
    id: 12,
    scenario: "What is the technique of organizing game objects in a tree structure with parent-child relationships?",
    correctAnswer: "Scene Graph / Transform Hierarchy",
    options: ["Scene Graph / Transform Hierarchy", "Linked List", "Hash Map", "Binary Tree"],
    hint: "A child object moves with its parent",
    explanation: "Scene graphs organize objects hierarchically. Child transforms are relative to parent. Sword moves with arm, arm with character!",
    category: "programming"
  },
];

export const GameDevGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

  const shuffledOptions = useMemo(() => {
    return shuffleArray(challenge.options);
  }, [currentChallenge]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(prev => prev + (showHint ? 15 : 25));
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const categoryColors: Record<string, string> = {
    design: "bg-purple-500/10 text-purple-600",
    programming: "bg-blue-500/10 text-blue-600",
    graphics: "bg-green-500/10 text-green-600",
    physics: "bg-orange-500/10 text-orange-600",
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Game Dev Pro!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points out of {challenges.length * 25}!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key Game Dev Concepts:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• Game Loop: Input → Update → Render</li>
            <li>• Delta Time for frame-rate independence</li>
            <li>• Object Pooling for performance</li>
            <li>• Game Feel/Juice for polish</li>
          </ul>
        </div>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          Game Development - {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Score: {score}
          </div>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${categoryColors[challenge.category]}`}>
            {challenge.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground">{challenge.scenario}</p>
        </div>

        {!showHint && !showResult && (
          <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Need a hint? (-10 points)
          </Button>
        )}

        {showHint && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
          >
            💡 {challenge.hint}
          </motion.div>
        )}

        <div className="grid gap-3">
          {shuffledOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === challenge.correctAnswer;
            
            return (
              <motion.button
                key={option}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? isCorrectOption
                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                      : isSelected
                      ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                      : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
            >
              <p className="font-bold mb-2">{isCorrect ? "🎯 Correct!" : "❌ Not quite!"}</p>
              <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && (
          <Button onClick={handleNext} className="w-full">
            {currentChallenge < challenges.length - 1 ? "Next Challenge" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GameDevGame;