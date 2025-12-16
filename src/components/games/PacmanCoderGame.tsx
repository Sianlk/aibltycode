import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { Bug, Code, Zap, RotateCcw } from 'lucide-react';

interface GridCell {
  type: 'empty' | 'code' | 'bug' | 'player' | 'wall';
  content?: string;
  collected?: boolean;
}

interface Level {
  id: string;
  name: string;
  targetCode: string[];
  grid: string[][];
  playerStart: [number, number];
  timeLimit: number;
}

const levels: Level[] = [
  {
    id: '1',
    name: 'Hello World',
    targetCode: ['public', 'static', 'void', 'main'],
    grid: [
      ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ['W', 'P', ' ', 'C', ' ', 'B', 'W'],
      ['W', ' ', 'W', 'W', 'W', ' ', 'W'],
      ['W', 'C', ' ', 'B', ' ', 'C', 'W'],
      ['W', ' ', 'W', ' ', 'W', ' ', 'W'],
      ['W', 'B', ' ', 'C', ' ', ' ', 'W'],
      ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ],
    playerStart: [1, 1],
    timeLimit: 30
  },
  {
    id: '2',
    name: 'Variables',
    targetCode: ['int', 'String', 'boolean', 'double'],
    grid: [
      ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ['W', 'P', ' ', 'C', 'B', 'C', ' ', 'W'],
      ['W', ' ', 'W', ' ', 'W', ' ', 'W', 'W'],
      ['W', 'C', ' ', 'B', ' ', 'C', ' ', 'W'],
      ['W', 'W', 'W', ' ', 'W', 'W', ' ', 'W'],
      ['W', 'B', ' ', ' ', ' ', 'B', ' ', 'W'],
      ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ],
    playerStart: [1, 1],
    timeLimit: 35
  },
  {
    id: '3',
    name: 'Control Flow',
    targetCode: ['if', 'else', 'while', 'for', 'switch'],
    grid: [
      ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ['W', 'P', ' ', 'C', ' ', 'C', ' ', 'B', 'W'],
      ['W', ' ', 'W', 'B', 'W', ' ', 'W', ' ', 'W'],
      ['W', 'C', ' ', ' ', ' ', 'C', ' ', 'C', 'W'],
      ['W', 'W', 'W', ' ', 'W', 'W', 'W', ' ', 'W'],
      ['W', 'B', ' ', 'C', ' ', 'B', ' ', ' ', 'W'],
      ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ],
    playerStart: [1, 1],
    timeLimit: 40
  }
];

const PacmanCoderGame: React.FC = () => {
  const { playSound } = useGame();
  const [levelIndex, setLevelIndex] = useState(0);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [playerPos, setPlayerPos] = useState<[number, number]>([1, 1]);
  const [collectedCode, setCollectedCode] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'complete'>('playing');
  const [codeIndex, setCodeIndex] = useState(0);

  const level = levels[levelIndex];

  const initializeLevel = useCallback(() => {
    const newGrid: GridCell[][] = level.grid.map((row, y) =>
      row.map((cell, x) => {
        switch (cell) {
          case 'W': return { type: 'wall' as const };
          case 'P': return { type: 'player' as const };
          case 'C': return { type: 'code' as const, content: level.targetCode[codeIndex % level.targetCode.length], collected: false };
          case 'B': return { type: 'bug' as const };
          default: return { type: 'empty' as const };
        }
      })
    );
    
    // Assign actual code tokens
    let tokenIdx = 0;
    newGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 'code') {
          cell.content = level.targetCode[tokenIdx % level.targetCode.length];
          tokenIdx++;
        }
      });
    });

    setGrid(newGrid);
    setPlayerPos(level.playerStart);
    setCollectedCode([]);
    setTimeLeft(level.timeLimit);
    setGameState('playing');
    setCodeIndex(0);
  }, [level, codeIndex]);

  useEffect(() => {
    initializeLevel();
  }, [levelIndex, initializeLevel]);

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

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newX = playerPos[0] + dx;
    const newY = playerPos[1] + dy;

    if (newX < 0 || newY < 0 || newY >= grid.length || newX >= grid[0].length) return;
    
    const targetCell = grid[newY][newX];
    if (targetCell.type === 'wall') return;

    if (targetCell.type === 'bug') {
      setGameState('lost');
      playSound('error');
      return;
    }

    if (targetCell.type === 'code' && !targetCell.collected) {
      const newCode = [...collectedCode, targetCell.content!];
      setCollectedCode(newCode);
      setScore(s => s + 10);
      playSound('success');
      
      // Check win
      if (newCode.length >= level.targetCode.length) {
        if (levelIndex < levels.length - 1) {
          setGameState('won');
        } else {
          setGameState('complete');
        }
        return;
      }

      // Mark as collected
      const newGrid = [...grid];
      newGrid[newY][newX] = { ...targetCell, collected: true, type: 'empty' };
      setGrid(newGrid);
    }

    setPlayerPos([newX, newY]);
  }, [gameState, playerPos, grid, collectedCode, level, levelIndex, playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const nextLevel = () => {
    setLevelIndex(i => i + 1);
  };

  const resetGame = () => {
    setLevelIndex(0);
    setScore(0);
    initializeLevel();
  };

  if (gameState === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-3xl font-bold mb-4">Code Master!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Final Score: {score}
        </p>
        <Button onClick={resetGame} size="lg">Play Again</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold">{level.name}</h3>
          <p className="text-sm text-muted-foreground">Level {levelIndex + 1}/{levels.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-3">
            <Zap className="h-4 w-4 mr-1" />
            {score}
          </Badge>
          <Badge variant={timeLeft < 10 ? 'destructive' : 'outline'} className="text-lg px-3">
            {timeLeft}s
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="h-4 w-4" />
            Collect: {level.targetCode.join(' → ')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-2 mb-4">
            <Progress 
              value={(collectedCode.length / level.targetCode.length) * 100} 
              className="h-2"
            />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              {collectedCode.length}/{level.targetCode.length} collected
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div 
              className="grid gap-1 bg-background p-2 rounded-lg border"
              style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 7}, minmax(0, 1fr))` }}
            >
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <motion.div
                    key={`${x}-${y}`}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-xs font-mono ${
                      cell.type === 'wall' ? 'bg-muted-foreground/30' :
                      cell.type === 'bug' ? 'bg-destructive/20' :
                      cell.type === 'code' && !cell.collected ? 'bg-success/20' :
                      'bg-muted/20'
                    }`}
                    animate={playerPos[0] === x && playerPos[1] === y ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {playerPos[0] === x && playerPos[1] === y ? (
                      <div className="w-6 h-6 bg-primary rounded-full" />
                    ) : cell.type === 'bug' ? (
                      <Bug className="h-5 w-5 text-destructive" />
                    ) : cell.type === 'code' && !cell.collected ? (
                      <span className="text-success font-bold">{cell.content}</span>
                    ) : null}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex flex-col items-center gap-2 md:hidden">
            <Button variant="outline" size="icon" onClick={() => movePlayer(0, -1)}>↑</Button>
            <div className="flex gap-8">
              <Button variant="outline" size="icon" onClick={() => movePlayer(-1, 0)}>←</Button>
              <Button variant="outline" size="icon" onClick={() => movePlayer(1, 0)}>→</Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => movePlayer(0, 1)}>↓</Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4 hidden md:block">
            Use arrow keys or WASD to move
          </p>
        </CardContent>
      </Card>

      {(gameState === 'won' || gameState === 'lost') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center ${
            gameState === 'won' ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
          }`}
        >
          <h3 className="text-lg font-bold mb-2">
            {gameState === 'won' ? 'Level Complete!' : 'Bug Caught You!'}
          </h3>
          <div className="flex justify-center gap-3">
            {gameState === 'won' ? (
              <Button onClick={nextLevel}>Next Level</Button>
            ) : (
              <Button onClick={initializeLevel} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
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
