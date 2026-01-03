import React, { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { Puzzle, Check, X, Lightbulb, RotateCcw, ArrowRight, Zap, Timer, Trophy } from 'lucide-react';

interface PuzzlePiece {
  id: string;
  code: string;
  type: 'keyword' | 'identifier' | 'operator' | 'literal' | 'punctuation';
}

interface Puzzle {
  id: string;
  title: string;
  description: string;
  pieces: PuzzlePiece[];
  correctOrder: string[];
  hint: string;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

const puzzles: Puzzle[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Build the classic first program!',
    pieces: [
      { id: '1', code: 'System', type: 'identifier' },
      { id: '2', code: '.', type: 'punctuation' },
      { id: '3', code: 'out', type: 'identifier' },
      { id: '4', code: '.', type: 'punctuation' },
      { id: '5', code: 'println', type: 'identifier' },
      { id: '6', code: '(', type: 'punctuation' },
      { id: '7', code: '"Hello, World!"', type: 'literal' },
      { id: '8', code: ')', type: 'punctuation' },
      { id: '9', code: ';', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hint: 'Start with System, then use dots to access out.println',
    explanation: 'System.out.println() prints text to the console!',
    category: 'basics',
    difficulty: 'easy',
    timeLimit: 60,
  },
  {
    id: 'variable-int',
    title: 'Integer Variable',
    description: 'Declare and initialize an integer variable.',
    pieces: [
      { id: '1', code: 'int', type: 'keyword' },
      { id: '2', code: 'count', type: 'identifier' },
      { id: '3', code: '=', type: 'operator' },
      { id: '4', code: '42', type: 'literal' },
      { id: '5', code: ';', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5'],
    hint: 'Type first, then name, then = value ;',
    explanation: 'int count = 42; declares count as an integer with value 42.',
    category: 'variables',
    difficulty: 'easy',
    timeLimit: 45,
  },
  {
    id: 'if-condition',
    title: 'If Statement',
    description: 'Build a simple condition check.',
    pieces: [
      { id: '1', code: 'if', type: 'keyword' },
      { id: '2', code: '(', type: 'punctuation' },
      { id: '3', code: 'x', type: 'identifier' },
      { id: '4', code: '>', type: 'operator' },
      { id: '5', code: '0', type: 'literal' },
      { id: '6', code: ')', type: 'punctuation' },
      { id: '7', code: '{', type: 'punctuation' },
      { id: '8', code: '}', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8'],
    hint: 'if (condition) { body }',
    explanation: 'if (x > 0) checks if x is positive before running the block.',
    category: 'conditionals',
    difficulty: 'easy',
    timeLimit: 50,
  },
  {
    id: 'for-loop',
    title: 'For Loop',
    description: 'Create a loop that counts from 0 to 4.',
    pieces: [
      { id: '1', code: 'for', type: 'keyword' },
      { id: '2', code: '(', type: 'punctuation' },
      { id: '3', code: 'int i = 0', type: 'identifier' },
      { id: '4', code: ';', type: 'punctuation' },
      { id: '5', code: 'i < 5', type: 'identifier' },
      { id: '6', code: ';', type: 'punctuation' },
      { id: '7', code: 'i++', type: 'identifier' },
      { id: '8', code: ')', type: 'punctuation' },
      { id: '9', code: '{ }', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hint: 'for (init; condition; update) { }',
    explanation: 'This loop runs 5 times with i going 0, 1, 2, 3, 4.',
    category: 'loops',
    difficulty: 'medium',
    timeLimit: 75,
  },
  {
    id: 'method-def',
    title: 'Method Definition',
    description: 'Define a method that adds two numbers.',
    pieces: [
      { id: '1', code: 'public', type: 'keyword' },
      { id: '2', code: 'int', type: 'keyword' },
      { id: '3', code: 'add', type: 'identifier' },
      { id: '4', code: '(', type: 'punctuation' },
      { id: '5', code: 'int a, int b', type: 'identifier' },
      { id: '6', code: ')', type: 'punctuation' },
      { id: '7', code: '{', type: 'punctuation' },
      { id: '8', code: 'return a + b;', type: 'identifier' },
      { id: '9', code: '}', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hint: 'access return_type name(params) { return ...; }',
    explanation: 'This method takes two ints and returns their sum.',
    category: 'methods',
    difficulty: 'medium',
    timeLimit: 90,
  },
  {
    id: 'array-create',
    title: 'Array Creation',
    description: 'Create an array of 5 integers.',
    pieces: [
      { id: '1', code: 'int', type: 'keyword' },
      { id: '2', code: '[', type: 'punctuation' },
      { id: '3', code: ']', type: 'punctuation' },
      { id: '4', code: 'numbers', type: 'identifier' },
      { id: '5', code: '=', type: 'operator' },
      { id: '6', code: 'new', type: 'keyword' },
      { id: '7', code: 'int', type: 'keyword' },
      { id: '8', code: '[5]', type: 'literal' },
      { id: '9', code: ';', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hint: 'type[] name = new type[size];',
    explanation: 'Creates an array that can hold 5 integer values.',
    category: 'arrays',
    difficulty: 'medium',
    timeLimit: 70,
  },
  {
    id: 'try-catch',
    title: 'Try-Catch Block',
    description: 'Build error handling structure.',
    pieces: [
      { id: '1', code: 'try', type: 'keyword' },
      { id: '2', code: '{', type: 'punctuation' },
      { id: '3', code: '// risky code', type: 'identifier' },
      { id: '4', code: '}', type: 'punctuation' },
      { id: '5', code: 'catch', type: 'keyword' },
      { id: '6', code: '(Exception e)', type: 'identifier' },
      { id: '7', code: '{', type: 'punctuation' },
      { id: '8', code: '// handle error', type: 'identifier' },
      { id: '9', code: '}', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hint: 'try { ... } catch (ExceptionType var) { ... }',
    explanation: 'try block runs risky code, catch handles errors.',
    category: 'exceptions',
    difficulty: 'hard',
    timeLimit: 90,
  },
  {
    id: 'lambda',
    title: 'Lambda Expression',
    description: 'Create a lambda that doubles a number.',
    pieces: [
      { id: '1', code: 'Function<Integer, Integer>', type: 'identifier' },
      { id: '2', code: 'doubler', type: 'identifier' },
      { id: '3', code: '=', type: 'operator' },
      { id: '4', code: 'x', type: 'identifier' },
      { id: '5', code: '->', type: 'operator' },
      { id: '6', code: 'x * 2', type: 'literal' },
      { id: '7', code: ';', type: 'punctuation' },
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7'],
    hint: 'Type name = param -> expression;',
    explanation: 'Lambda x -> x * 2 takes x and returns x doubled.',
    category: 'functional',
    difficulty: 'hard',
    timeLimit: 80,
  },
];

const typeColors: Record<string, string> = {
  keyword: 'bg-primary/20 border-primary/50 text-primary',
  identifier: 'bg-success/20 border-success/50 text-success',
  operator: 'bg-warning/20 border-warning/50 text-warning',
  literal: 'bg-accent/20 border-accent/50 text-accent',
  punctuation: 'bg-muted border-border text-muted-foreground',
};

const CodePuzzleBuilder: React.FC = () => {
  const { playSound, addXp, gameMode } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const currentPuzzle = puzzles[currentIndex];
  const isKidsMode = gameMode === 'kid';

  // Initialize puzzle pieces in random order
  React.useEffect(() => {
    const shuffled = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setTimeLeft(currentPuzzle.timeLimit);
    setIsTimerActive(true);
    setShowHint(false);
    setIsChecking(false);
    setIsCorrect(null);
  }, [currentIndex]);

  // Timer
  React.useEffect(() => {
    if (!isTimerActive || isCorrect !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsTimerActive(false);
          checkAnswer();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTimerActive, isCorrect]);

  const checkAnswer = () => {
    setIsChecking(true);
    setIsTimerActive(false);
    
    const currentOrder = pieces.map(p => p.id);
    const correct = currentOrder.every((id, i) => id === currentPuzzle.correctOrder[i]);
    
    setIsCorrect(correct);
    
    if (correct) {
      playSound('success');
      const timeBonus = Math.floor(timeLeft / 5) * 2;
      const basePoints = currentPuzzle.difficulty === 'easy' ? 20 : currentPuzzle.difficulty === 'medium' ? 35 : 50;
      const streakBonus = streak >= 2 ? 10 : 0;
      const hintPenalty = showHint ? 10 : 0;
      const totalPoints = basePoints + timeBonus + streakBonus - hintPenalty;
      
      setScore(s => s + totalPoints);
      setStreak(s => s + 1);
      addXp(totalPoints);
      
      if (!completed.includes(currentPuzzle.id)) {
        setCompleted([...completed, currentPuzzle.id]);
      }
    } else {
      playSound('error');
      setStreak(0);
    }
  };

  const nextPuzzle = () => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetPuzzle = () => {
    const shuffled = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setTimeLeft(currentPuzzle.timeLimit);
    setIsTimerActive(true);
    setShowHint(false);
    setIsChecking(false);
    setIsCorrect(null);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCompleted([]);
  };

  const difficultyColors = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    hard: 'bg-destructive/20 text-destructive',
  };

  if (completed.length === puzzles.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-4 text-center"
      >
        <div className="text-7xl mb-6">🧩</div>
        <h2 className="text-3xl font-black mb-4">All Puzzles Complete!</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="bg-primary/10">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </CardContent>
          </Card>
          <Card className="bg-success/10">
            <CardContent className="p-6 text-center">
              <Puzzle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">{puzzles.length}</p>
              <p className="text-sm text-muted-foreground">Puzzles Solved</p>
            </CardContent>
          </Card>
        </div>
        <Button size="lg" onClick={resetGame} className="gap-2">
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Puzzle className="w-3 h-3" />
            {currentIndex + 1}/{puzzles.length}
          </Badge>
          <Badge className={difficultyColors[currentPuzzle.difficulty]}>
            {currentPuzzle.difficulty}
          </Badge>
          {streak >= 2 && (
            <Badge className="bg-warning text-warning-foreground gap-1">
              <Zap className="w-3 h-3" />
              {streak}x
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Timer className="w-3 h-3" />
            {timeLeft}s
          </Badge>
          <Badge variant="secondary">{score} pts</Badge>
        </div>
      </div>

      <Progress value={(timeLeft / currentPuzzle.timeLimit) * 100} className="h-2 mb-6" />

      {/* Puzzle Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {isKidsMode && '🧩 '}
            {currentPuzzle.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{currentPuzzle.description}</p>
          
          {/* Puzzle Pieces */}
          <div className="bg-muted/30 rounded-xl p-4 mb-4 min-h-[120px]">
            <Reorder.Group
              axis="x"
              values={pieces}
              onReorder={setPieces}
              className="flex flex-wrap gap-2 justify-center"
            >
              <AnimatePresence>
                {pieces.map((piece) => (
                  <Reorder.Item
                    key={piece.id}
                    value={piece}
                    disabled={isCorrect !== null}
                    className={`px-3 py-2 rounded-lg border-2 cursor-grab active:cursor-grabbing font-mono text-sm transition-all ${
                      typeColors[piece.type]
                    } ${isCorrect === false ? 'opacity-50' : ''}`}
                    whileHover={isCorrect === null ? { scale: 1.05, y: -2 } : {}}
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                  >
                    {piece.code}
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>

          {/* Preview */}
          <div className="bg-background rounded-lg p-3 mb-4 font-mono text-center">
            <code className="text-lg">
              {pieces.map(p => p.code).join('')}
            </code>
          </div>

          {/* Actions */}
          {isCorrect === null ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </Button>
              <Button onClick={checkAnswer} className="flex-1 gap-2">
                <Check className="w-4 h-4" />
                Check Answer
              </Button>
              <Button variant="outline" size="icon" onClick={resetPuzzle}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`rounded-xl p-4 ${isCorrect ? 'bg-success/20' : 'bg-destructive/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? <Check className="w-5 h-5 text-success" /> : <X className="w-5 h-5 text-destructive" />}
                  <span className="font-bold">{isCorrect ? 'Correct!' : 'Not quite right'}</span>
                </div>
                <p className="text-sm">{currentPuzzle.explanation}</p>
              </div>
              <Button onClick={isCorrect ? nextPuzzle : resetPuzzle} className="w-full gap-2">
                {isCorrect ? (
                  <>Next Puzzle <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Try Again <RotateCcw className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          )}

          {/* Hint */}
          <AnimatePresence>
            {showHint && isCorrect === null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-warning/10 border border-warning/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  <span className="font-bold text-warning">Hint</span>
                </div>
                <p className="text-sm">{currentPuzzle.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Type Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {Object.entries(typeColors).map(([type, className]) => (
              <Badge key={type} variant="outline" className={`text-xs ${className}`}>
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodePuzzleBuilder;
