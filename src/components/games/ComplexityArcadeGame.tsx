import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { CheckCircle, XCircle, TrendingUp, Zap, Clock } from 'lucide-react';

interface ComplexityChallenge {
  id: string;
  code: string;
  description: string;
  options: { notation: string; description: string }[];
  correctAnswer: string;
  explanation: string;
  visualization: number[];
}

const challenges: ComplexityChallenge[] = [
  {
    id: '1',
    code: `for (int i = 0; i < n; i++) {
  sum += arr[i];
}`,
    description: 'Loop through array once to sum all elements',
    options: [
      { notation: 'O(1)', description: 'Constant time' },
      { notation: 'O(n)', description: 'Linear time' },
      { notation: 'O(n²)', description: 'Quadratic time' },
      { notation: 'O(log n)', description: 'Logarithmic time' },
    ],
    correctAnswer: 'O(n)',
    explanation: 'Single loop visits each element once. Time grows linearly with input size.',
    visualization: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: '2',
    code: `for (int i = 0; i < n; i++) {
  for (int j = 0; j < n; j++) {
    matrix[i][j] = i * j;
  }
}`,
    description: 'Nested loops processing a matrix',
    options: [
      { notation: 'O(n)', description: 'Linear time' },
      { notation: 'O(n²)', description: 'Quadratic time' },
      { notation: 'O(2n)', description: 'Double linear' },
      { notation: 'O(n log n)', description: 'Linearithmic' },
    ],
    correctAnswer: 'O(n²)',
    explanation: 'Nested loops: outer runs n times, inner runs n times each = n × n = n² operations.',
    visualization: [1, 4, 9, 16, 25, 36, 49, 64]
  },
  {
    id: '3',
    code: `int left = 0, right = arr.length - 1;
while (left <= right) {
  int mid = (left + right) / 2;
  if (arr[mid] == target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}`,
    description: 'Binary search in a sorted array',
    options: [
      { notation: 'O(n)', description: 'Linear time' },
      { notation: 'O(1)', description: 'Constant time' },
      { notation: 'O(log n)', description: 'Logarithmic time' },
      { notation: 'O(n²)', description: 'Quadratic time' },
    ],
    correctAnswer: 'O(log n)',
    explanation: 'Each iteration halves the search space. For n=1000, only ~10 steps needed!',
    visualization: [1, 1.5, 2, 2.3, 2.6, 2.8, 3, 3.2]
  },
  {
    id: '4',
    code: `return arr[0];`,
    description: 'Access first element of array',
    options: [
      { notation: 'O(1)', description: 'Constant time' },
      { notation: 'O(n)', description: 'Linear time' },
      { notation: 'O(log n)', description: 'Logarithmic time' },
      { notation: 'O(n²)', description: 'Quadratic time' },
    ],
    correctAnswer: 'O(1)',
    explanation: 'Direct access by index takes same time regardless of array size.',
    visualization: [1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    id: '5',
    code: `Arrays.sort(arr);
for (int i = 0; i < n; i++) {
  process(arr[i]);
}`,
    description: 'Sort array then process each element',
    options: [
      { notation: 'O(n)', description: 'Linear time' },
      { notation: 'O(n log n)', description: 'Linearithmic time' },
      { notation: 'O(n²)', description: 'Quadratic time' },
      { notation: 'O(log n)', description: 'Logarithmic time' },
    ],
    correctAnswer: 'O(n log n)',
    explanation: 'Sort is O(n log n) + loop is O(n). Total dominated by O(n log n).',
    visualization: [1, 3, 6, 10, 15, 22, 30, 40]
  }
];

const ComplexityArcadeGame: React.FC = () => {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const checkAnswer = () => {
    const correct = selectedAnswer === challenge.correctAnswer;
    setShowResult(true);
    
    if (correct) {
      setScore(s => s + (10 * (streak + 1)));
      setStreak(s => s + 1);
      playSound('success');
    } else {
      setStreak(0);
      playSound('error');
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      playSound('success');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-3xl font-bold mb-4">Complexity Master!</h2>
        <p className="text-xl text-muted-foreground mb-2">Score: {score}</p>
        <p className="text-muted-foreground mb-6">
          You understand how algorithms scale!
        </p>
        <Button onClick={resetGame} size="lg">Play Again</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Challenge {currentIndex + 1}/{challenges.length}</p>
          <Progress value={progress} className="w-32 h-2" />
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <Badge className="bg-warning text-warning-foreground">
              <Zap className="h-3 w-3 mr-1" />
              {streak}x streak
            </Badge>
          )}
          <Badge variant="outline" className="text-lg px-4 py-1">
            {score} pts
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            What's the Time Complexity?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {challenge.code}
            </pre>
            <p className="text-sm text-muted-foreground mt-2">{challenge.description}</p>
          </div>

          {/* Visualization */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-end justify-between h-20 gap-1">
              {challenge.visualization.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(height / Math.max(...challenge.visualization)) * 100}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-1 bg-primary/60 rounded-t"
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>n=1</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time growth
              </span>
              <span>n=8</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {challenge.options.map(opt => (
              <motion.button
                key={opt.notation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && setSelectedAnswer(opt.notation)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswer === opt.notation
                    ? showResult
                      ? opt.notation === challenge.correctAnswer
                        ? 'border-success bg-success/10'
                        : 'border-destructive bg-destructive/10'
                      : 'border-primary bg-primary/10'
                    : showResult && opt.notation === challenge.correctAnswer
                      ? 'border-success bg-success/10'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-lg font-mono font-bold">{opt.notation}</span>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`rounded-lg p-4 ${
                  selectedAnswer === challenge.correctAnswer
                    ? 'bg-success/10 border border-success/30'
                    : 'bg-destructive/10 border border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === challenge.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {selectedAnswer === challenge.correctAnswer ? 'Correct!' : `Answer: ${challenge.correctAnswer}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3">
            {!showResult ? (
              <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? 'Next Challenge' : 'Finish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplexityArcadeGame;
