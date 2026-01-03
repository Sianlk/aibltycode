import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw, Check, X, Info } from 'lucide-react';

interface CodeExercise {
  id: string;
  title: string;
  prompt: string;
  codeToRead: string;
  explanation: string;
  highlights: { word: string; meaning: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const exercises: CodeExercise[] = [
  {
    id: 'var-declaration',
    title: 'Variable Declaration',
    prompt: 'Read this variable declaration aloud:',
    codeToRead: 'int age = 25;',
    explanation: 'This declares an integer variable named "age" and assigns it the value 25.',
    highlights: [
      { word: 'int', meaning: 'Integer data type - whole numbers' },
      { word: 'age', meaning: 'Variable name - describes what it stores' },
      { word: '=', meaning: 'Assignment operator - puts value into variable' },
      { word: '25', meaning: 'The value being stored' },
      { word: ';', meaning: 'Statement terminator - ends the line' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'if-statement',
    title: 'If Statement',
    prompt: 'Read this conditional statement:',
    codeToRead: 'if (x > 10) { return true; }',
    explanation: 'Checks if x is greater than 10, and if so, returns true.',
    highlights: [
      { word: 'if', meaning: 'Conditional keyword - starts a condition check' },
      { word: '(', meaning: 'Condition starts here' },
      { word: 'x > 10', meaning: 'The condition: is x greater than 10?' },
      { word: ')', meaning: 'Condition ends here' },
      { word: '{', meaning: 'Code block starts - what to do if true' },
      { word: 'return true', meaning: 'Exit method and give back true' },
      { word: '}', meaning: 'Code block ends' },
    ],
    difficulty: 'easy',
  },
  {
    id: 'for-loop',
    title: 'For Loop',
    prompt: 'Read this loop structure:',
    codeToRead: 'for (int i = 0; i < 5; i++) { }',
    explanation: 'Loops 5 times, with i going from 0 to 4.',
    highlights: [
      { word: 'for', meaning: 'Loop keyword - repeats code' },
      { word: 'int i = 0', meaning: 'Initialize: counter starts at 0' },
      { word: 'i < 5', meaning: 'Condition: keep going while i is less than 5' },
      { word: 'i++', meaning: 'Update: add 1 to i after each loop' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'method-def',
    title: 'Method Definition',
    prompt: 'Read this method signature:',
    codeToRead: 'public int add(int a, int b) { return a + b; }',
    explanation: 'A public method that takes two integers and returns their sum.',
    highlights: [
      { word: 'public', meaning: 'Access modifier - anyone can use this' },
      { word: 'int', meaning: 'Return type - method gives back an integer' },
      { word: 'add', meaning: 'Method name - describes what it does' },
      { word: '(int a, int b)', meaning: 'Parameters - inputs the method needs' },
      { word: 'return a + b', meaning: 'Calculates sum and sends it back' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'array-init',
    title: 'Array Initialization',
    prompt: 'Read this array creation:',
    codeToRead: 'String[] names = {"Alice", "Bob", "Carol"};',
    explanation: 'Creates an array of Strings with 3 names.',
    highlights: [
      { word: 'String[]', meaning: 'Array of String type - holds multiple texts' },
      { word: 'names', meaning: 'Variable name for the array' },
      { word: '{ }', meaning: 'Array literal - defines contents directly' },
      { word: '"Alice"', meaning: 'First element at index 0' },
    ],
    difficulty: 'medium',
  },
  {
    id: 'try-catch',
    title: 'Exception Handling',
    prompt: 'Read this error handling:',
    codeToRead: 'try { int x = 1/0; } catch (Exception e) { }',
    explanation: 'Attempts risky code and catches any errors that occur.',
    highlights: [
      { word: 'try', meaning: 'Start of code that might fail' },
      { word: 'catch', meaning: 'What to do if an error happens' },
      { word: 'Exception e', meaning: 'Catches any error and calls it "e"' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'lambda',
    title: 'Lambda Expression',
    prompt: 'Read this lambda:',
    codeToRead: 'list.forEach(item -> System.out.println(item));',
    explanation: 'For each item in the list, print it out.',
    highlights: [
      { word: 'forEach', meaning: 'Do something for each element' },
      { word: 'item', meaning: 'Current element being processed' },
      { word: '->', meaning: 'Lambda arrow - "goes to" or "does"' },
      { word: 'System.out.println', meaning: 'Print to console' },
    ],
    difficulty: 'hard',
  },
  {
    id: 'stream',
    title: 'Stream Pipeline',
    prompt: 'Read this stream operation:',
    codeToRead: 'nums.stream().filter(n -> n > 0).count();',
    explanation: 'Converts to stream, keeps positive numbers, counts them.',
    highlights: [
      { word: 'stream()', meaning: 'Convert collection to stream for processing' },
      { word: 'filter', meaning: 'Keep only elements matching condition' },
      { word: 'n -> n > 0', meaning: 'Lambda: n where n is greater than 0' },
      { word: 'count()', meaning: 'Count how many elements remain' },
    ],
    difficulty: 'hard',
  },
];

const VoiceCodeCoach: React.FC = () => {
  const { playSound, gameMode } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(-1);
  const [practiceMode, setPracticeMode] = useState<'listen' | 'read' | 'complete'>('listen');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const currentExercise = exercises[currentIndex];
  const isKidsMode = gameMode === 'kid';

  // Simulate text-to-speech (in real app, use Web Speech API)
  const speakCode = useCallback(() => {
    if (isMuted || !currentExercise) return;
    
    setIsPlaying(true);
    const highlights = currentExercise.highlights;
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < highlights.length) {
        setCurrentHighlight(index);
        playSound('click');
        index++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentHighlight(-1);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, [currentExercise, isMuted, playSound]);

  const markComplete = () => {
    if (!completed.includes(currentExercise.id)) {
      setCompleted([...completed, currentExercise.id]);
      setScore(s => s + (currentExercise.difficulty === 'easy' ? 10 : currentExercise.difficulty === 'medium' ? 15 : 25));
      playSound('success');
    }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHighlights(false);
      setCurrentHighlight(-1);
      setPracticeMode('listen');
    }
  };

  const prevExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowHighlights(false);
      setCurrentHighlight(-1);
    }
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted([]);
    setShowHighlights(false);
    setPracticeMode('listen');
  };

  const difficultyColors = {
    easy: 'bg-success/20 text-success border-success/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    hard: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{isKidsMode ? '🗣️' : '🎙️'}</div>
          <div>
            <h2 className="text-xl font-bold">Voice Code Coach</h2>
            <p className="text-sm text-muted-foreground">Learn to read code aloud</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{score} pts</Badge>
          <Badge variant="secondary">{completed.length}/{exercises.length}</Badge>
        </div>
      </div>

      <Progress value={(currentIndex / exercises.length) * 100} className="h-2 mb-6" />

      {/* Exercise Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{currentExercise.title}</CardTitle>
            <Badge className={difficultyColors[currentExercise.difficulty]}>
              {currentExercise.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{currentExercise.prompt}</p>
          
          {/* Code Display */}
          <div className="bg-muted/50 rounded-xl p-6 mb-4 font-mono text-lg">
            <div className="flex flex-wrap gap-1">
              {currentExercise.highlights.map((h, i) => (
                <motion.span
                  key={i}
                  className={`px-2 py-1 rounded ${
                    currentHighlight === i 
                      ? 'bg-primary text-primary-foreground' 
                      : showHighlights
                      ? 'bg-accent/30 border border-accent/50'
                      : ''
                  }`}
                  animate={currentHighlight === i ? { scale: [1, 1.1, 1] } : {}}
                >
                  {h.word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              size="lg"
              onClick={speakCode}
              disabled={isPlaying}
              className="gap-2 px-8"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isPlaying ? 'Playing...' : 'Listen'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHighlights(!showHighlights)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {/* Highlights Explanation */}
          <AnimatePresence>
            {showHighlights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-accent/10 rounded-xl p-4 mb-4"
              >
                <h4 className="font-bold mb-3">Code Breakdown:</h4>
                <div className="space-y-2">
                  {currentExercise.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <code className="bg-primary/20 px-2 py-1 rounded font-mono">{h.word}</code>
                      <span className="text-muted-foreground flex-1">{h.meaning}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <div className="bg-success/10 border border-success/30 rounded-xl p-4">
            <p className="text-sm">{currentExercise.explanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Practice Modes */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h4 className="font-bold mb-3">Practice Mode:</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={practiceMode === 'listen' ? 'default' : 'outline'}
              onClick={() => setPracticeMode('listen')}
              className="text-sm"
            >
              {isKidsMode ? '👂' : '🎧'} Listen
            </Button>
            <Button
              variant={practiceMode === 'read' ? 'default' : 'outline'}
              onClick={() => setPracticeMode('read')}
              className="text-sm"
            >
              {isKidsMode ? '📖' : '👁️'} Read Aloud
            </Button>
            <Button
              variant={practiceMode === 'complete' ? 'default' : 'outline'}
              onClick={() => { setPracticeMode('complete'); markComplete(); }}
              className="text-sm"
            >
              {isKidsMode ? '⭐' : '✓'} Got It!
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevExercise}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {completed.includes(currentExercise.id) && (
            <Badge className="bg-success text-success-foreground gap-1">
              <Check className="w-3 h-3" /> Complete
            </Badge>
          )}
        </div>
        <Button
          onClick={nextExercise}
          disabled={currentIndex === exercises.length - 1}
        >
          Next
        </Button>
      </div>

      {/* Reset */}
      {completed.length === exercises.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <Card className="bg-gradient-to-r from-success/20 to-primary/20 border-2">
            <CardContent className="p-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">All Exercises Complete!</h3>
              <p className="text-muted-foreground mb-4">You earned {score} points!</p>
              <Button onClick={resetProgress} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceCodeCoach;
