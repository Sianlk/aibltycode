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

// Mnemonic: I.U.R = Input, Update, Render (Game Loop)
// Mnemonic: E.C.S = Entity, Component, System (architecture)

const challenges: GameDevChallenge[] = [
  // === PROGRAMMING ===
  { id: 1, scenario: "What is the main loop that runs continuously in a game, handling input, updating state, and rendering?", correctAnswer: "Game Loop", options: ["Game Loop", "Event Handler", "State Machine", "Render Pipeline"], hint: "It 'loops' continuously while the game runs", explanation: "The Game Loop: I.U.R = Input → Update → Render → Repeat (typically 60 times per second). The heartbeat of every game!", category: "programming" },
  { id: 2, scenario: "A game runs at 60 FPS. How many milliseconds between each frame?", correctAnswer: "~16.67ms (1000ms ÷ 60)", options: ["~16.67ms (1000ms ÷ 60)", "60ms", "100ms", "1000ms"], hint: "Divide 1 second (1000ms) by frames per second", explanation: "1000ms ÷ 60 FPS ≈ 16.67ms per frame. This is your 'frame budget' for all game logic and rendering!", category: "programming" },
  { id: 3, scenario: "What is 'delta time' used for in game development?", correctAnswer: "Frame-rate independent movement", options: ["Frame-rate independent movement", "Counting total time", "Network latency", "Score calculation"], hint: "Movement should be the same whether running at 30 or 60 FPS", explanation: "Delta time = time since last frame. position += velocity * deltaTime ensures consistent movement. Without it, faster PCs = faster gameplay!", category: "programming" },
  { id: 4, scenario: "What is the technique of reusing game objects instead of creating/destroying them?", correctAnswer: "Object Pooling", options: ["Object Pooling", "Garbage Collection", "Memory Mapping", "Lazy Loading"], hint: "Think of a 'pool' of pre-created bullets waiting to be used", explanation: "Object pooling avoids expensive allocation. Pre-create objects, reuse them. Essential for bullets, particles, enemies!", category: "programming" },
  { id: 5, scenario: "What architecture pattern separates game entities into data components and logic systems?", correctAnswer: "ECS (Entity Component System)", options: ["ECS (Entity Component System)", "MVC", "Singleton", "Observer"], hint: "Entities are just IDs, components hold data, systems process them", explanation: "E.C.S: Entity = ID, Component = data (Position, Velocity, Health), System = logic (MovementSystem, RenderSystem). Used in Unity DOTS, Bevy, EnTT!", category: "programming" },
  { id: 6, scenario: "What is the organizing tree structure with parent-child relationships in a game engine?", correctAnswer: "Scene Graph / Transform Hierarchy", options: ["Scene Graph / Transform Hierarchy", "Linked List", "Hash Map", "Binary Tree"], hint: "A child object moves with its parent", explanation: "Scene graphs: child transforms are relative to parent. Sword moves with hand, hand with arm, arm with character!", category: "programming" },
  { id: 7, scenario: "What coroutine-like feature lets game code run across multiple frames?", correctAnswer: "Coroutines / Async update patterns", options: ["Coroutines / Async update patterns", "Threads", "Interrupts", "Callbacks only"], hint: "Pause execution, resume next frame", explanation: "Coroutines yield control each frame. Perfect for animations, cooldowns, and AI sequences that span multiple frames.", category: "programming" },

  // === DESIGN ===
  { id: 8, scenario: "What design pattern is commonly used to manage different game screens (menu, gameplay, pause)?", correctAnswer: "State Machine / State Pattern", options: ["State Machine / State Pattern", "Singleton", "Factory", "Observer"], hint: "The game transitions between different 'states'", explanation: "State machines cleanly manage transitions. Each state handles its own input, update, and render. Prevents spaghetti code!", category: "design" },
  { id: 9, scenario: "What makes a game 'feel good' through responsive controls, screen shake, and particle effects?", correctAnswer: "Game Feel / Juice", options: ["Game Feel / Juice", "Polygon count", "Frame rate", "Resolution"], hint: "It's about the 'juiciness' of interactions", explanation: "Game Feel = feedback + responsiveness + polish. Screen shake, particles, hitstop, squash & stretch. Jan Willem Nijman's 'The art of screenshake'!", category: "design" },
  { id: 10, scenario: "What game design concept describes the flow between challenge and skill that keeps players engaged?", correctAnswer: "Flow State / Flow Channel", options: ["Flow State / Flow Channel", "Grind", "Power Curve", "Meta Gaming"], hint: "Not too easy (boring), not too hard (frustrating)", explanation: "Flow = perfect balance of challenge vs skill. Mihaly Csikszentmihalyi's concept. Dynamic difficulty adjustment aims for this.", category: "design" },
  { id: 11, scenario: "What mechanic rewards players for continued play and creates long-term engagement?", correctAnswer: "Progression System (XP, levels, unlocks)", options: ["Progression System (XP, levels, unlocks)", "Higher difficulty only", "Longer loading screens", "More cutscenes"], hint: "Players level up and unlock new content", explanation: "Progression: XP → Level Up → Unlock abilities/content → New challenges. Combines with Skinner Box reinforcement for engagement.", category: "design" },
  { id: 12, scenario: "What is the MDA framework in game design?", correctAnswer: "Mechanics, Dynamics, Aesthetics", options: ["Mechanics, Dynamics, Aesthetics", "Model, Design, Architecture", "Move, Dodge, Attack", "Menu, Dialog, Action"], hint: "Rules → emergent behavior → player experience", explanation: "M.D.A: Mechanics (rules/systems) → Dynamics (emergent behavior) → Aesthetics (emotional response). Designers work M→D→A, players experience A→D→M.", category: "design" },

  // === PHYSICS ===
  { id: 13, scenario: "What collision detection method checks if two rectangular boundaries overlap?", correctAnswer: "AABB (Axis-Aligned Bounding Box)", options: ["AABB (Axis-Aligned Bounding Box)", "Ray casting", "Pixel-perfect collision", "SAT algorithm"], hint: "Uses simple rectangle bounds aligned to x and y axes", explanation: "AABB: check overlap on X AND Y axes. Fast O(1) per pair. For rotated shapes, use SAT (Separating Axis Theorem).", category: "physics" },
  { id: 14, scenario: "In physics simulation, what force constantly pulls objects downward?", correctAnswer: "Gravity (typically 9.8 m/s² or game-adjusted)", options: ["Gravity (typically 9.8 m/s² or game-adjusted)", "Friction", "Drag", "Torque"], hint: "What makes Mario fall after jumping?", explanation: "velocity.y += gravity * deltaTime. Games often use exaggerated gravity (e.g., 20-30) for snappier feel. Coyote time adds forgiveness!", category: "physics" },
  { id: 15, scenario: "What is the technique of casting invisible lines to detect collisions or line of sight?", correctAnswer: "Raycasting", options: ["Raycasting", "AABB", "Pixel collision", "Broad phase"], hint: "Shooting an invisible beam from a point in a direction", explanation: "Raycasting fires a ray and checks what it hits. Used for: bullets, line of sight, ground detection, mouse picking, lighting!", category: "physics" },
  { id: 16, scenario: "What divides the game world into regions to reduce collision checks?", correctAnswer: "Spatial Partitioning (Quadtree/Grid)", options: ["Spatial Partitioning (Quadtree/Grid)", "Sorting", "Caching", "Compression"], hint: "Only check collisions between nearby objects", explanation: "Without partitioning: O(n²) checks. With grid/quadtree: only check neighbors. Broad phase → Narrow phase pattern.", category: "physics" },

  // === GRAPHICS ===
  { id: 17, scenario: "In a 2D platformer, what creates depth by scrolling background layers at different speeds?", correctAnswer: "Parallax scrolling", options: ["Parallax scrolling", "Anti-aliasing", "Bloom effect", "Motion blur"], hint: "Background layers move at different speeds", explanation: "Parallax: distant layers scroll slower. Creates depth perception in 2D. Simple math: layer.x = camera.x * speedFactor.", category: "graphics" },
  { id: 18, scenario: "A sprite sheet contains multiple animation frames. What is the process of displaying them sequentially?", correctAnswer: "Sprite Animation / Frame Animation", options: ["Sprite Animation / Frame Animation", "Skeletal Animation", "Procedural Animation", "Motion Capture"], hint: "Flip through frames like a flipbook", explanation: "currentFrame = (int)(elapsed / frameDuration) % totalFrames. Draw the correct region of the sprite sheet. Control speed with frameDuration.", category: "graphics" },
  { id: 19, scenario: "What are shaders in game graphics?", correctAnswer: "Programs that run on the GPU to control how pixels and vertices are rendered", options: ["Programs that run on the GPU to control how pixels and vertices are rendered", "Shadow generators", "Audio effects", "Network handlers"], hint: "They run on the graphics card, not the CPU", explanation: "Vertex shaders transform geometry. Fragment/pixel shaders determine color. Written in GLSL/HLSL. Enable: lighting, post-processing, water effects!", category: "graphics" },
  { id: 20, scenario: "What rendering technique draws only objects visible to the camera?", correctAnswer: "Frustum Culling", options: ["Frustum Culling", "Anti-aliasing", "Bloom", "Ray tracing"], hint: "Why render what the camera can't see?", explanation: "The view frustum is the camera's visible volume. Objects outside it are skipped. Crucial optimization for 3D games!", category: "graphics" },

  // === ENGINES & TOOLS ===
  { id: 21, scenario: "What open-source game engine uses GDScript and is great for 2D games?", correctAnswer: "Godot", options: ["Godot", "Unreal Engine", "CryEngine", "Source Engine"], hint: "Free, open-source, with its own scripting language", explanation: "Godot: free, MIT license, GDScript (Python-like), excellent 2D tools, growing 3D capabilities. Scene/node architecture.", category: "programming" },
  { id: 22, scenario: "What engine powers AAA games and uses C++ with Blueprints visual scripting?", correctAnswer: "Unreal Engine", options: ["Unreal Engine", "Godot", "GameMaker", "RPG Maker"], hint: "Created by Epic Games, used for Fortnite", explanation: "Unreal Engine: C++ + Blueprints, Nanite (virtualized geometry), Lumen (global illumination), MetaHuman. Free until $1M revenue.", category: "programming" },

  // === AI FOR GAMES ===
  { id: 23, scenario: "What algorithm finds the shortest path in a grid, used for NPC navigation?", correctAnswer: "A* (A-Star) Pathfinding", options: ["A* (A-Star) Pathfinding", "Bubble Sort", "Binary Search", "Quick Sort"], hint: "Uses heuristic + actual cost to find optimal path", explanation: "A*: f(n) = g(n) + h(n). g = cost from start, h = estimated cost to goal. Combines Dijkstra's efficiency with greedy best-first speed!", category: "programming" },
  { id: 24, scenario: "What AI technique uses tree structures to define complex NPC behaviors?", correctAnswer: "Behavior Trees", options: ["Behavior Trees", "Decision Tables", "Neural Networks", "Genetic Algorithms"], hint: "Nodes represent actions, conditions, and sequences", explanation: "Behavior Trees: Selector (try until success), Sequence (do all in order), Decorator (modify child). Used in Unreal, Halo, and most modern game AI.", category: "programming" },
  { id: 25, scenario: "What finite state machine component defines NPC states and transitions?", correctAnswer: "States (Idle, Patrol, Chase, Attack) and Transitions (conditions)", options: ["States (Idle, Patrol, Chase, Attack) and Transitions (conditions)", "Only animations", "Only sounds", "Only physics"], hint: "The NPC 'decides' what to do based on its current state", explanation: "FSM for NPCs: Idle → (see player) → Chase → (in range) → Attack → (player escapes) → Patrol. Clean and debuggable!", category: "programming" },
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