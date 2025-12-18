import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { RotateCcw, Trophy, Zap, Shield, Pause, Play, AlertTriangle } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface CodeToken {
  id: string;
  text: string;
  position: Position;
  collected: boolean;
  order: number;
}

interface Bug {
  id: string;
  position: Position;
  direction: { x: number; y: number };
  isGhost: boolean;
}

interface PowerPill {
  id: string;
  position: Position;
  collected: boolean;
  type: 'slow' | 'ghost' | 'hint' | 'checkpoint';
}

interface Level {
  id: number;
  name: string;
  gridSize: number;
  codeTokens: string[];
  bugCount: number;
  timeLimit: number;
  powerPillCount: number;
}

type Difficulty = 'practice' | 'standard' | 'mastery';
type GameState = 'menu' | 'playing' | 'paused' | 'won' | 'lost' | 'wrongOrder' | 'complete';

const levels: Level[] = [
  { id: 1, name: "Variables", gridSize: 6, codeTokens: ["int", "x", "=", "10", ";"], bugCount: 2, timeLimit: 60, powerPillCount: 2 },
  { id: 2, name: "Printing", gridSize: 7, codeTokens: ["System", ".", "out", ".", "println"], bugCount: 3, timeLimit: 70, powerPillCount: 2 },
  { id: 3, name: "Methods", gridSize: 7, codeTokens: ["public", "void", "run", "(", ")"], bugCount: 3, timeLimit: 75, powerPillCount: 3 },
  { id: 4, name: "Conditions", gridSize: 8, codeTokens: ["if", "(", "x", ">", "0", ")"], bugCount: 4, timeLimit: 80, powerPillCount: 3 },
  { id: 5, name: "Loops", gridSize: 8, codeTokens: ["for", "(", "int", "i", "=", "0", ")"], bugCount: 4, timeLimit: 90, powerPillCount: 4 },
  { id: 6, name: "Arrays", gridSize: 9, codeTokens: ["int", "[", "]", "nums", "=", "new", "int", "[", "5", "]"], bugCount: 5, timeLimit: 120, powerPillCount: 5 },
];

const difficultySettings = {
  practice: { bugSpeed: 1200, showHints: true, wrongOrderRewind: true, lives: 3 },
  standard: { bugSpeed: 800, showHints: false, wrongOrderRewind: true, lives: 2 },
  mastery: { bugSpeed: 600, showHints: false, wrongOrderRewind: false, lives: 1 },
};

const PacmanCoderGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [difficulty, setDifficulty] = useState<Difficulty>('standard');
  const [levelIndex, setLevelIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [codeTokens, setCodeTokens] = useState<CodeToken[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [powerPills, setPowerPills] = useState<PowerPill[]>([]);
  const [collectedOrder, setCollectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(2);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [checkpoint, setCheckpoint] = useState<{ pos: Position; collected: string[] } | null>(null);
  const [powerUpActive, setPowerUpActive] = useState<string | null>(null);
  const [wrongOrderMessage, setWrongOrderMessage] = useState<string>('');
  const [nextExpectedToken, setNextExpectedToken] = useState<string>('');
  const gameRef = useRef<HTMLDivElement>(null);
  
  const level = levels[levelIndex];
  const settings = difficultySettings[difficulty];
  
  // Initialize level
  const initLevel = useCallback(() => {
    const gridSize = level.gridSize;
    
    setPlayerPos({ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) });
    
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
    
    // Create code tokens with order
    const tokens = level.codeTokens.map((text, i) => ({
      id: `token-${i}`,
      text,
      position: getRandomPos(),
      collected: false,
      order: i,
    }));
    setCodeTokens(tokens);
    
    // Create bugs
    const newBugs = Array.from({ length: level.bugCount }, (_, i) => ({
      id: `bug-${i}`,
      position: getRandomPos(),
      direction: { 
        x: Math.random() > 0.5 ? 1 : -1, 
        y: Math.random() > 0.5 ? 1 : -1 
      },
      isGhost: false,
    }));
    setBugs(newBugs);
    
    // Create power pills
    const pillTypes: PowerPill['type'][] = ['slow', 'ghost', 'hint', 'checkpoint'];
    const newPills = Array.from({ length: level.powerPillCount }, (_, i) => ({
      id: `pill-${i}`,
      position: getRandomPos(),
      collected: false,
      type: pillTypes[i % pillTypes.length],
    }));
    setPowerPills(newPills);
    
    setCollectedOrder([]);
    setTimeLeft(level.timeLimit);
    setLives(settings.lives);
    setCheckpoint(null);
    setPowerUpActive(null);
    setNextExpectedToken(level.codeTokens[0]);
    setGameState('playing');
  }, [level, settings.lives]);
  
  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setLevelIndex(0);
    setScore(0);
    initLevel();
  };
  
  // This effect no longer needed - initLevel is called directly in startGame and nextLevel
  
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
    
    const speed = powerUpActive === 'slow' ? settings.bugSpeed * 2 : settings.bugSpeed;
    
    const moveInterval = setInterval(() => {
      setBugs(prevBugs => 
        prevBugs.map(bug => {
          if (bug.isGhost) return bug;
          
          let newX = bug.position.x + bug.direction.x;
          let newY = bug.position.y + bug.direction.y;
          let newDir = { ...bug.direction };
          
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
    }, speed);
    
    return () => clearInterval(moveInterval);
  }, [gameState, level.gridSize, powerUpActive, settings.bugSpeed]);
  
  // Check collision with bugs
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const hitBug = bugs.some(
      bug => !bug.isGhost && bug.position.x === playerPos.x && bug.position.y === playerPos.y
    );
    
    if (hitBug) {
      if (lives > 1) {
        setLives(l => l - 1);
        playSound('error');
        // Restore from checkpoint if available
        if (checkpoint) {
          setPlayerPos(checkpoint.pos);
          setCollectedOrder(checkpoint.collected);
        } else {
          setPlayerPos({ x: Math.floor(level.gridSize / 2), y: Math.floor(level.gridSize / 2) });
        }
      } else {
        setGameState('lost');
        playSound('error');
      }
    }
  }, [playerPos, bugs, gameState, playSound, lives, checkpoint, level.gridSize]);
  
  // Power-up timer
  useEffect(() => {
    if (!powerUpActive) return;
    
    const timer = setTimeout(() => {
      setPowerUpActive(null);
      setBugs(prev => prev.map(b => ({ ...b, isGhost: false })));
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [powerUpActive]);
  
  // Player movement
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(level.gridSize - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(level.gridSize - 1, prev.y + dy));
      
      // Check for power pill collection
      setPowerPills(pills => {
        const pill = pills.find(p => !p.collected && p.position.x === newX && p.position.y === newY);
        if (pill) {
          playSound('success');
          setScore(s => s + 10);
          
          switch (pill.type) {
            case 'slow':
              setPowerUpActive('slow');
              break;
            case 'ghost':
              setPowerUpActive('ghost');
              setBugs(prev => prev.map(b => ({ ...b, isGhost: true })));
              break;
            case 'hint':
              setPowerUpActive('hint');
              break;
            case 'checkpoint':
              setCheckpoint({ pos: { x: newX, y: newY }, collected: [...collectedOrder] });
              break;
          }
          
          return pills.map(p => p.id === pill.id ? { ...p, collected: true } : p);
        }
        return pills;
      });
      
      // Check for token collection
      setCodeTokens(tokens => {
        const token = tokens.find(
          t => !t.collected && t.position.x === newX && t.position.y === newY
        );
        
        if (token) {
          const expectedIndex = collectedOrder.length;
          const isCorrectOrder = token.order === expectedIndex;
          
          if (!isCorrectOrder) {
            // Wrong order collected!
            const expectedToken = level.codeTokens[expectedIndex];
            setWrongOrderMessage(`You collected "${token.text}" but needed "${expectedToken}" first!`);
            playSound('error');
            
            if (settings.wrongOrderRewind) {
              // Rewind to last checkpoint or start
              setGameState('wrongOrder');
            } else {
              // Mastery mode - instant fail
              setGameState('lost');
            }
            return tokens;
          }
          
          playSound('success');
          setScore(s => s + 25);
          const newCollected = [...collectedOrder, token.text];
          setCollectedOrder(newCollected);
          setNextExpectedToken(level.codeTokens[newCollected.length] || '');
          
          // Check win condition
          if (newCollected.length === level.codeTokens.length) {
            setScore(s => s + 100 + timeLeft * 2); // Bonus for time
            
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
  }, [gameState, level, collectedOrder, playSound, settings.wrongOrderRewind, levelIndex, timeLeft]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGameState(s => s === 'playing' ? 'paused' : s === 'paused' ? 'playing' : s);
        return;
      }
      
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
    addXp(50 + levelIndex * 10);
    playSound('levelUp');
    const newLevelIndex = levelIndex + 1;
    setLevelIndex(newLevelIndex);
    // Directly initialize the new level
    setTimeout(() => {
      const newLevel = levels[newLevelIndex];
      if (newLevel) {
        const gridSize = newLevel.gridSize;
        setPlayerPos({ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) });
        
        const usedPositions = new Set<string>();
        usedPositions.add(`${Math.floor(gridSize / 2)},${Math.floor(gridSize / 2)}`);
        
        const getRandomPos = (): Position => {
          let pos: Position;
          do {
            pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
          } while (usedPositions.has(`${pos.x},${pos.y}`));
          usedPositions.add(`${pos.x},${pos.y}`);
          return pos;
        };
        
        setCodeTokens(newLevel.codeTokens.map((text, i) => ({
          id: `token-${i}`, text, position: getRandomPos(), collected: false, order: i,
        })));
        
        setBugs(Array.from({ length: newLevel.bugCount }, (_, i) => ({
          id: `bug-${i}`, position: getRandomPos(),
          direction: { x: Math.random() > 0.5 ? 1 : -1, y: Math.random() > 0.5 ? 1 : -1 },
          isGhost: false,
        })));
        
        const pillTypes: PowerPill['type'][] = ['slow', 'ghost', 'hint', 'checkpoint'];
        setPowerPills(Array.from({ length: newLevel.powerPillCount }, (_, i) => ({
          id: `pill-${i}`, position: getRandomPos(), collected: false, type: pillTypes[i % pillTypes.length],
        })));
        
        setCollectedOrder([]);
        setTimeLeft(newLevel.timeLimit);
        setLives(settings.lives);
        setCheckpoint(null);
        setPowerUpActive(null);
        setNextExpectedToken(newLevel.codeTokens[0]);
        setGameState('playing');
      }
    }, 100);
  };
  
  const resetGame = () => {
    setGameState('menu');
    setLevelIndex(0);
    setScore(0);
  };
  
  const retryLevel = () => {
    initLevel();
  };
  
  const continueFromWrongOrder = () => {
    if (checkpoint) {
      setPlayerPos(checkpoint.pos);
      setCollectedOrder(checkpoint.collected);
      setNextExpectedToken(level.codeTokens[checkpoint.collected.length]);
    } else {
      setCollectedOrder([]);
      setCodeTokens(tokens => tokens.map(t => ({ ...t, collected: false })));
      setNextExpectedToken(level.codeTokens[0]);
    }
    setGameState('playing');
  };
  
  // Render grid
  const renderGrid = () => {
    const cells = [];
    const cellSize = Math.min(36, (280 / level.gridSize));
    
    for (let y = 0; y < level.gridSize; y++) {
      for (let x = 0; x < level.gridSize; x++) {
        const isPlayer = playerPos.x === x && playerPos.y === y;
        const token = codeTokens.find(t => !t.collected && t.position.x === x && t.position.y === y);
        const bug = bugs.find(b => b.position.x === x && b.position.y === y);
        const pill = powerPills.find(p => !p.collected && p.position.x === x && p.position.y === y);
        const isNextToken = token && token.order === collectedOrder.length;
        
        cells.push(
          <motion.div
            key={`${x}-${y}`}
            className={`rounded-md flex items-center justify-center text-xs font-mono border transition-colors
              ${isPlayer ? 'bg-primary border-primary' : ''}
              ${token && !isPlayer ? (isNextToken && (settings.showHints || powerUpActive === 'hint') ? 'bg-warning/40 border-warning animate-pulse' : 'bg-success/20 border-success/50') : ''}
              ${pill && !isPlayer ? 'bg-accent/30 border-accent' : ''}
              ${bug && !isPlayer ? (bug.isGhost ? 'bg-muted/20 border-muted' : 'bg-destructive/30 border-destructive') : ''}
              ${!isPlayer && !token && !bug && !pill ? 'bg-muted/10 border-border/30' : ''}
            `}
            style={{ width: cellSize, height: cellSize }}
            animate={isPlayer ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {isPlayer && (
              <motion.div 
                className="w-3/4 h-3/4 bg-primary-foreground rounded-full flex items-center justify-center text-[8px]"
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                😊
              </motion.div>
            )}
            {token && !isPlayer && (
              <span className={`font-bold text-[9px] ${isNextToken && (settings.showHints || powerUpActive === 'hint') ? 'text-warning' : 'text-success'}`}>
                {token.text}
              </span>
            )}
            {pill && !isPlayer && (
              <motion.span 
                className="text-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {pill.type === 'slow' ? '🐢' : pill.type === 'ghost' ? '👻' : pill.type === 'hint' ? '💡' : '📍'}
              </motion.span>
            )}
            {bug && !isPlayer && (
              <motion.span 
                className={`text-sm ${bug.isGhost ? 'opacity-30' : ''}`}
                animate={{ rotate: bug.isGhost ? 0 : [0, 10, -10, 0] }}
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
  
  // Menu screen
  if (gameState === 'menu') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-foreground mb-2">🎮 Pacman Coder</h2>
          <p className="text-muted-foreground">Collect code tokens in the correct order!</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => startGame('practice')} variant="outline" className="w-full justify-start h-auto py-3">
              <div className="text-left">
                <div className="font-bold text-success">🌱 Practice Mode</div>
                <div className="text-xs text-muted-foreground">Hints shown, rewind on mistakes, 3 lives</div>
              </div>
            </Button>
            <Button onClick={() => startGame('standard')} variant="outline" className="w-full justify-start h-auto py-3">
              <div className="text-left">
                <div className="font-bold text-primary">⚡ Standard Mode</div>
                <div className="text-xs text-muted-foreground">No hints, rewind on mistakes, 2 lives</div>
              </div>
            </Button>
            <Button onClick={() => startGame('mastery')} variant="outline" className="w-full justify-start h-auto py-3">
              <div className="text-left">
                <div className="font-bold text-destructive">🔥 Mastery Mode</div>
                <div className="text-xs text-muted-foreground">No hints, instant fail on wrong order, 1 life</div>
              </div>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Power-Ups</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2"><span>🐢</span> Slow bugs</div>
            <div className="flex items-center gap-2"><span>👻</span> Ghost mode (bugs can't hurt)</div>
            <div className="flex items-center gap-2"><span>💡</span> Show next token</div>
            <div className="flex items-center gap-2"><span>📍</span> Save checkpoint</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Wrong order screen
  if (gameState === 'wrongOrder') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
        <AlertTriangle className="w-16 h-16 text-warning mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Wrong Order!</h2>
        <p className="text-muted-foreground">{wrongOrderMessage}</p>
        <div className="bg-muted/30 rounded-lg p-4 max-w-xs mx-auto">
          <p className="text-sm text-muted-foreground mb-2">The correct order is:</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {level.codeTokens.map((t, i) => (
              <span key={i} className={`px-2 py-1 rounded text-xs font-mono ${i < collectedOrder.length ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <Button onClick={continueFromWrongOrder}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {checkpoint ? 'Back to Checkpoint' : 'Try Again'}
        </Button>
      </motion.div>
    );
  }
  
  // Complete screen
  if (gameState === 'complete') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">🎉 Code Master!</h2>
        <p className="text-muted-foreground mb-2">You completed all levels!</p>
        <p className="text-xl font-bold text-primary mb-4">Final Score: {score}</p>
        <Button onClick={resetGame}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </motion.div>
    );
  }
  
  // Paused screen
  if (gameState === 'paused') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
        <Pause className="w-16 h-16 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Paused</h2>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setGameState('playing')}>
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Quit
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-3" ref={gameRef}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-foreground">{level.name}</h3>
          <p className="text-xs text-muted-foreground">Level {levelIndex + 1}/{levels.length} • {difficulty}</p>
        </div>
        <div className="flex gap-2 items-center">
          {Array.from({ length: settings.lives }).map((_, i) => (
            <span key={i} className={`text-sm ${i < lives ? 'opacity-100' : 'opacity-30'}`}>❤️</span>
          ))}
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {score}
          </Badge>
          <Badge variant={timeLeft < 15 ? "destructive" : "outline"} className="text-xs">
            {timeLeft}s
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => setGameState('paused')}>
            <Pause className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Power-up indicator */}
      <AnimatePresence>
        {powerUpActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-accent/20 text-accent text-xs"
          >
            <Shield className="w-3 h-3" />
            {powerUpActive === 'slow' ? 'Bugs Slowed!' : powerUpActive === 'ghost' ? 'Ghost Mode!' : 'Hints Active!'}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Target code */}
      <Card className="py-2">
        <CardContent className="py-2 px-3">
          <p className="text-xs text-muted-foreground mb-1">Collect in order:</p>
          <div className="flex flex-wrap gap-1">
            {level.codeTokens.map((token, i) => {
              const isCollected = i < collectedOrder.length;
              const isNext = i === collectedOrder.length;
              
              return (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    isCollected ? 'bg-success/20 text-success' : 
                    isNext && (settings.showHints || powerUpActive === 'hint') ? 'bg-warning/20 text-warning animate-pulse' : 
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {token}
                </span>
              );
            })}
          </div>
          <Progress value={(collectedOrder.length / level.codeTokens.length) * 100} className="mt-2 h-1" />
        </CardContent>
      </Card>
      
      {/* Game Grid */}
      <div className="flex justify-center">
        <div 
          className="grid gap-0.5 p-2 rounded-lg bg-card border border-border"
          style={{ gridTemplateColumns: `repeat(${level.gridSize}, 1fr)` }}
        >
          {renderGrid()}
        </div>
      </div>
      
      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-1 md:hidden">
        <Button variant="outline" size="sm" onClick={() => movePlayer(0, -1)}>↑</Button>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => movePlayer(-1, 0)}>←</Button>
          <Button variant="outline" size="sm" onClick={() => movePlayer(1, 0)}>→</Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => movePlayer(0, 1)}>↓</Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground hidden md:block">
        Arrow keys/WASD to move • ESC to pause • Collect tokens in the right order!
      </p>
      
      {/* Win/Lose modals */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg text-center ${
              gameState === 'won' ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
            }`}
          >
            <h3 className="text-lg font-bold mb-2">
              {gameState === 'won' ? '🎉 Level Complete!' : '🐛 Game Over!'}
            </h3>
            {gameState === 'won' && <p className="text-sm text-muted-foreground mb-3">+{50 + levelIndex * 10} XP</p>}
            <div className="flex justify-center gap-3">
              {gameState === 'won' ? (
                <Button onClick={nextLevel}>Next Level</Button>
              ) : (
                <>
                  <Button onClick={retryLevel} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button variant="ghost" onClick={resetGame}>Menu</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PacmanCoderGame;