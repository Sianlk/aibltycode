import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { RotateCcw, Trophy, Zap } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface CodeToken {
  id: string;
  text: string;
  position: Position;
  collected: boolean;
}

interface Bug {
  id: string;
  position: Position;
  direction: { x: number; y: number };
}

interface Level {
  id: number;
  name: string;
  gridSize: number;
  codeTokens: string[];
  bugCount: number;
  timeLimit: number;
}

const levels: Level[] = [
  { id: 1, name: "Variables", gridSize: 6, codeTokens: ["int", "x", "=", "10", ";"], bugCount: 2, timeLimit: 45 },
  { id: 2, name: "Printing", gridSize: 7, codeTokens: ["System", ".", "out", ".", "println"], bugCount: 3, timeLimit: 50 },
  { id: 3, name: "Methods", gridSize: 8, codeTokens: ["public", "void", "run", "(", ")", "{", "}"], bugCount: 4, timeLimit: 60 },
];

const PacmanCoderGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [levelIndex, setLevelIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [codeTokens, setCodeTokens] = useState<CodeToken[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [collectedOrder, setCollectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'complete'>('playing');
  const gameRef = useRef<HTMLDivElement>(null);
  
  const level = levels[levelIndex];
  
  // Initialize level
  const initLevel = useCallback(() => {
    const gridSize = level.gridSize;
    
    // Place player at center
    setPlayerPos({ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) });
    
    // Generate random positions for tokens (not overlapping)
    const usedPositions = new Set<string>();
    usedPositions.add(`${Math.floor(gridSize / 2)},${Math.floor(gridSize / 2)}`);
    
    const getRandomPos = (): Position => {
      let pos: Position;
      do {
        pos = { 
          x: Math.floor(Math.random() * gridSize), 
          y: Math.floor(Math.random() * gridSize) 
        };
      } while (usedPositions.has(`${pos.x},${pos.y}`));
      usedPositions.add(`${pos.x},${pos.y}`);
      return pos;
    };
    
    // Create code tokens
    const tokens = level.codeTokens.map((text, i) => ({
      id: `token-${i}`,
      text,
      position: getRandomPos(),
      collected: false,
    }));
    setCodeTokens(tokens);
    
    // Create bugs with random movement directions
    const newBugs = Array.from({ length: level.bugCount }, (_, i) => ({
      id: `bug-${i}`,
      position: getRandomPos(),
      direction: { 
        x: Math.random() > 0.5 ? 1 : -1, 
        y: Math.random() > 0.5 ? 1 : -1 
      },
    }));
    setBugs(newBugs);
    
    setCollectedOrder([]);
    setTimeLeft(level.timeLimit);
    setGameState('playing');
  }, [level]);
  
  useEffect(() => {
    initLevel();
  }, [levelIndex, initLevel]);
  
  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('lost');
          playSound('error');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, playSound]);
  
  // Bug movement
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const moveInterval = setInterval(() => {
      setBugs(prevBugs => 
        prevBugs.map(bug => {
          let newX = bug.position.x + bug.direction.x;
          let newY = bug.position.y + bug.direction.y;
          let newDir = { ...bug.direction };
          
          // Bounce off walls
          if (newX < 0 || newX >= level.gridSize) {
            newDir.x *= -1;
            newX = bug.position.x + newDir.x;
          }
          if (newY < 0 || newY >= level.gridSize) {
            newDir.y *= -1;
            newY = bug.position.y + newDir.y;
          }
          
          return {
            ...bug,
            position: { x: newX, y: newY },
            direction: newDir,
          };
        })
      );
    }, 800);
    
    return () => clearInterval(moveInterval);
  }, [gameState, level.gridSize]);
  
  // Check collision with bugs
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const hitBug = bugs.some(
      bug => bug.position.x === playerPos.x && bug.position.y === playerPos.y
    );
    
    if (hitBug) {
      setGameState('lost');
      playSound('error');
    }
  }, [playerPos, bugs, gameState, playSound]);
  
  // Player movement
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(level.gridSize - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(level.gridSize - 1, prev.y + dy));
      
      // Check for token collection
      setCodeTokens(tokens => {
        const token = tokens.find(
          t => !t.collected && t.position.x === newX && t.position.y === newY
        );
        
        if (token) {
          playSound('success');
          setScore(s => s + 20);
          setCollectedOrder(prev => [...prev, token.text]);
          
          // Check win condition
          const newCollected = [...collectedOrder, token.text];
          if (newCollected.length === level.codeTokens.length) {
            // Check if collected in correct order
            const isCorrectOrder = newCollected.every(
              (t, i) => t === level.codeTokens[i]
            );
            
            if (isCorrectOrder) {
              setScore(s => s + 100); // Bonus for correct order
            }
            
            if (levelIndex < levels.length - 1) {
              setGameState('won');
            } else {
              setGameState('complete');
            }
          }
          
          return tokens.map(t => 
            t.id === token.id ? { ...t, collected: true } : t
          );
        }
        
        return tokens;
      });
      
      return { x: newX, y: newY };
    });
  }, [gameState, level, collectedOrder, playSound, levelIndex]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);
  
  const nextLevel = () => {
    addXp(50);
    setLevelIndex(i => i + 1);
    playSound('levelUp');
  };
  
  const resetGame = () => {
    setLevelIndex(0);
    setScore(0);
    initLevel();
  };
  
  const retryLevel = () => {
    initLevel();
  };
  
  // Render grid
  const renderGrid = () => {
    const cells = [];
    const cellSize = Math.min(40, (280 / level.gridSize));
    
    for (let y = 0; y < level.gridSize; y++) {
      for (let x = 0; x < level.gridSize; x++) {
        const isPlayer = playerPos.x === x && playerPos.y === y;
        const token = codeTokens.find(t => !t.collected && t.position.x === x && t.position.y === y);
        const bug = bugs.find(b => b.position.x === x && b.position.y === y);
        
        cells.push(
          <motion.div
            key={`${x}-${y}`}
            className={`rounded-md flex items-center justify-center text-xs font-mono border
              ${isPlayer ? 'bg-primary' : ''}
              ${token ? 'bg-success/30 border-success' : 'bg-muted/30 border-border/50'}
              ${bug ? 'bg-destructive/30 border-destructive' : ''}
            `}
            style={{ width: cellSize, height: cellSize }}
            animate={isPlayer ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {isPlayer && (
              <motion.div 
                className="w-3/4 h-3/4 bg-primary-foreground rounded-full"
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            {token && !isPlayer && (
              <span className="text-success font-bold text-[10px]">{token.text}</span>
            )}
            {bug && !isPlayer && (
              <motion.span 
                className="text-base"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🐛
              </motion.span>
            )}
          </motion.div>
        );
      }
    }
    
    return cells;
  };
  
  if (gameState === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Code Master!</h2>
        <p className="text-muted-foreground mb-4">Final Score: {score}</p>
        <Button onClick={resetGame}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4" ref={gameRef}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-foreground">{level.name}</h3>
          <p className="text-sm text-muted-foreground">Level {levelIndex + 1}/{levels.length}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            <Zap className="w-3 h-3 mr-1" />
            {score}
          </Badge>
          <Badge 
            variant={timeLeft < 10 ? "destructive" : "outline"} 
            className="text-sm"
          >
            {timeLeft}s
          </Badge>
        </div>
      </div>
      
      {/* Target code */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">Collect in order:</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex flex-wrap gap-1">
            {level.codeTokens.map((token, i) => {
              const isCollected = i < collectedOrder.length;
              const isCorrect = collectedOrder[i] === token;
              
              return (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    isCollected
                      ? isCorrect
                        ? 'bg-success/20 text-success'
                        : 'bg-warning/20 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCollected ? collectedOrder[i] : token}
                </span>
              );
            })}
          </div>
          <Progress 
            value={(collectedOrder.length / level.codeTokens.length) * 100} 
            className="mt-2 h-1"
          />
        </CardContent>
      </Card>
      
      {/* Game Grid */}
      <div className="flex justify-center">
        <div 
          className="grid gap-1 p-3 rounded-lg bg-card border border-border"
          style={{ 
            gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>
      </div>
      
      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <Button variant="outline" size="icon" onClick={() => movePlayer(0, -1)}>↑</Button>
        <div className="flex gap-6">
          <Button variant="outline" size="icon" onClick={() => movePlayer(-1, 0)}>←</Button>
          <Button variant="outline" size="icon" onClick={() => movePlayer(1, 0)}>→</Button>
        </div>
        <Button variant="outline" size="icon" onClick={() => movePlayer(0, 1)}>↓</Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground hidden md:block">
        Use arrow keys or WASD to move. Collect code tokens, avoid bugs!
      </p>
      
      {/* Win/Lose modals */}
      {(gameState === 'won' || gameState === 'lost') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center ${
            gameState === 'won'
              ? 'bg-success/10 border border-success/30'
              : 'bg-destructive/10 border border-destructive/30'
          }`}
        >
          <h3 className="text-lg font-bold mb-2">
            {gameState === 'won' ? '🎉 Level Complete!' : '🐛 Bug Got You!'}
          </h3>
          <div className="flex justify-center gap-3">
            {gameState === 'won' ? (
              <Button onClick={nextLevel}>Next Level</Button>
            ) : (
              <Button onClick={retryLevel} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PacmanCoderGame;
