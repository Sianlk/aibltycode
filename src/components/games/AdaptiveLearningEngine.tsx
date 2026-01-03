import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { Brain, Zap, Target, TrendingUp, Clock, Award, Sparkles, RefreshCw } from 'lucide-react';

interface Question {
  id: string;
  type: 'recognition' | 'recall' | 'application' | 'synthesis';
  difficulty: number; // 1-10
  content: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill: string;
  timeExpected: number; // seconds
}

interface PerformanceData {
  skill: string;
  difficulty: number;
  accuracy: number;
  avgTime: number;
  attempts: number;
}

const questionBank: Question[] = [
  // Recognition Level (1-3)
  { id: 'r1', type: 'recognition', difficulty: 1, content: 'Which keyword starts an if statement?', options: ['if', 'when', 'check', 'test'], correctIndex: 0, explanation: '"if" is the keyword for conditional statements!', skill: 'conditionals', timeExpected: 5 },
  { id: 'r2', type: 'recognition', difficulty: 1, content: 'What symbol means "equals" in Java comparison?', options: ['=', '==', '===', ':='], correctIndex: 1, explanation: '== compares values, = assigns values!', skill: 'operators', timeExpected: 5 },
  { id: 'r3', type: 'recognition', difficulty: 2, content: 'Which loop type checks condition first?', options: ['do-while', 'while', 'both', 'neither'], correctIndex: 1, explanation: 'while checks BEFORE running, do-while checks AFTER!', skill: 'loops', timeExpected: 8 },
  { id: 'r4', type: 'recognition', difficulty: 2, content: 'What does "void" mean in a method?', options: ['Returns nothing', 'Returns null', 'Returns 0', 'Invalid'], correctIndex: 0, explanation: 'void methods perform actions but return no value!', skill: 'methods', timeExpected: 8 },
  { id: 'r5', type: 'recognition', difficulty: 3, content: 'Which is a primitive data type?', options: ['String', 'Integer', 'int', 'Array'], correctIndex: 2, explanation: 'int is primitive, Integer is a wrapper class!', skill: 'data-types', timeExpected: 10 },
  
  // Recall Level (4-6)
  { id: 'rc1', type: 'recall', difficulty: 4, content: 'What prints when: System.out.println(5 + 3 + "hello")?', options: ['53hello', '8hello', '5 + 3 + hello', 'error'], correctIndex: 1, explanation: '5+3=8 first (left to right), then "8" + "hello" = "8hello"!', skill: 'operators', timeExpected: 15 },
  { id: 'rc2', type: 'recall', difficulty: 4, content: 'Array a = {1,2,3}. What is a.length?', options: ['2', '3', '4', 'error'], correctIndex: 1, explanation: 'length returns the count of elements, not the last index!', skill: 'arrays', timeExpected: 12 },
  { id: 'rc3', type: 'recall', difficulty: 5, content: 'What is 10 % 3?', options: ['3', '1', '0', '10'], correctIndex: 1, explanation: '% is modulo - returns remainder. 10÷3=3 remainder 1!', skill: 'operators', timeExpected: 10 },
  { id: 'rc4', type: 'recall', difficulty: 5, content: 'for(int i=0; i<5; i++) runs how many times?', options: ['4', '5', '6', 'infinite'], correctIndex: 1, explanation: 'i goes 0,1,2,3,4 = 5 iterations (< not <=)!', skill: 'loops', timeExpected: 15 },
  { id: 'rc5', type: 'recall', difficulty: 6, content: 'What modifier makes a variable belong to the class, not instance?', options: ['public', 'private', 'static', 'final'], correctIndex: 2, explanation: 'static belongs to class, shared by all instances!', skill: 'oop', timeExpected: 12 },
  
  // Application Level (7-8)
  { id: 'a1', type: 'application', difficulty: 7, content: 'Which code reverses a string s?', options: ['s.reverse()', 'new StringBuilder(s).reverse()', 'reverse(s)', 's.flip()'], correctIndex: 1, explanation: 'StringBuilder has reverse() method, String doesn\'t!', skill: 'strings', timeExpected: 20 },
  { id: 'a2', type: 'application', difficulty: 7, content: 'To prevent null pointer on String s, check:', options: ['if(s != null)', 's.isNotNull()', 'if(!s)', 'try(s)'], correctIndex: 0, explanation: 'Always check != null before calling methods on objects!', skill: 'null-safety', timeExpected: 15 },
  { id: 'a3', type: 'application', difficulty: 8, content: 'Which creates an immutable list?', options: ['new ArrayList()', 'Arrays.asList()', 'List.of()', 'Collections.list()'], correctIndex: 2, explanation: 'List.of() creates unmodifiable list (Java 9+)!', skill: 'collections', timeExpected: 20 },
  { id: 'a4', type: 'application', difficulty: 8, content: 'Best way to concatenate many strings in a loop?', options: ['+ operator', 'concat()', 'StringBuilder', 'String.join()'], correctIndex: 2, explanation: 'StringBuilder is mutable, + creates new String each time!', skill: 'performance', timeExpected: 18 },
  
  // Synthesis Level (9-10)
  { id: 's1', type: 'synthesis', difficulty: 9, content: 'Which design pattern is: private constructor, static getInstance()?', options: ['Factory', 'Singleton', 'Builder', 'Prototype'], correctIndex: 1, explanation: 'Singleton ensures single instance via private constructor!', skill: 'patterns', timeExpected: 25 },
  { id: 's2', type: 'synthesis', difficulty: 9, content: 'Time complexity of ArrayList.get(index)?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'ArrayList is array-backed, direct index access is O(1)!', skill: 'complexity', timeExpected: 20 },
  { id: 's3', type: 'synthesis', difficulty: 10, content: 'Which prevents class from being extended?', options: ['private class', 'static class', 'final class', 'abstract class'], correctIndex: 2, explanation: 'final classes cannot be subclassed (e.g., String)!', skill: 'oop-advanced', timeExpected: 22 },
  { id: 's4', type: 'synthesis', difficulty: 10, content: 'Lambda for adding two numbers?', options: ['(a,b)->a+b', 'a,b=>a+b', '{a+b}', 'add(a,b)'], correctIndex: 0, explanation: 'Lambda syntax: (params) -> expression!', skill: 'functional', timeExpected: 18 },
];

const AdaptiveLearningEngine: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [adaptiveMessage, setAdaptiveMessage] = useState('');

  const SESSION_LENGTH = 10;

  // Adaptive question selection
  const selectNextQuestion = useCallback(() => {
    // Filter questions around current difficulty
    const targetDiff = Math.max(1, Math.min(10, currentDifficulty));
    const availableQuestions = questionBank.filter(
      q => Math.abs(q.difficulty - targetDiff) <= 2
    );
    
    // Prefer questions not recently asked
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentDifficulty]);

  useEffect(() => {
    selectNextQuestion();
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const timeTaken = (Date.now() - startTime) / 1000;
    setTimeSpent(t => t + timeTaken);
    
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const wasQuick = timeTaken <= currentQuestion.timeExpected;
    
    if (isCorrect) {
      playSound('success');
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
      
      // Increase difficulty if correct and fast
      if (wasQuick && currentDifficulty < 10) {
        setCurrentDifficulty(d => Math.min(10, d + 0.5));
        setAdaptiveMessage('⚡ Fast and correct! Increasing challenge...');
      } else if (wasQuick) {
        setAdaptiveMessage('🎯 Perfect! You\'re at the highest level!');
      } else {
        setAdaptiveMessage('✓ Correct! Taking time is okay.');
      }
      
      addXp(10 + Math.floor(currentQuestion.difficulty * 2) + (streak >= 3 ? 5 : 0));
    } else {
      playSound('error');
      setStreak(0);
      
      // Decrease difficulty on wrong answer
      if (currentDifficulty > 1) {
        setCurrentDifficulty(d => Math.max(1, d - 1));
        setAdaptiveMessage('Let\'s practice this more. Adjusting difficulty...');
      } else {
        setAdaptiveMessage('Keep trying! Practice makes perfect.');
      }
    }
    
    // Update performance history
    setPerformanceHistory(prev => [...prev, {
      skill: currentQuestion.skill,
      difficulty: currentQuestion.difficulty,
      accuracy: isCorrect ? 100 : 0,
      avgTime: timeTaken,
      attempts: 1
    }]);
  };

  const nextQuestion = () => {
    const newCount = questionsAnswered + 1;
    setQuestionsAnswered(newCount);
    
    if (newCount >= SESSION_LENGTH) {
      setSessionComplete(true);
      playSound('levelUp');
    } else {
      selectNextQuestion();
    }
  };

  const restartSession = () => {
    setQuestionsAnswered(0);
    setCorrectCount(0);
    setStreak(0);
    setTimeSpent(0);
    setPerformanceHistory([]);
    setSessionComplete(false);
    setCurrentDifficulty(3);
    selectNextQuestion();
  };

  // Calculate performance stats
  const accuracy = questionsAnswered > 0 ? Math.round((correctCount / questionsAnswered) * 100) : 0;
  const avgTimePerQuestion = questionsAnswered > 0 ? (timeSpent / questionsAnswered).toFixed(1) : 0;
  const skillBreakdown = performanceHistory.reduce((acc, p) => {
    if (!acc[p.skill]) acc[p.skill] = { correct: 0, total: 0 };
    acc[p.skill].total++;
    if (p.accuracy === 100) acc[p.skill].correct++;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  if (sessionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-2">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-black mb-2">Adaptive Session Complete!</h2>
            <p className="text-muted-foreground mb-6">Your brain adapted in real-time</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-success/10 rounded-xl p-4 border border-success/30">
                <Target className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-success">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/30">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{currentDifficulty.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Final Level</p>
              </div>
              <div className="bg-warning/10 rounded-xl p-4 border border-warning/30">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold text-warning">{avgTimePerQuestion}s</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent">{correctCount}/{SESSION_LENGTH}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
            </div>
            
            {/* Skill Breakdown */}
            <div className="bg-muted/30 rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-3">Skill Performance</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(skillBreakdown).map(([skill, data]) => (
                  <div key={skill} className="flex justify-between items-center bg-background/50 rounded p-2">
                    <span className="capitalize">{skill.replace('-', ' ')}</span>
                    <Badge variant={data.correct === data.total ? 'default' : 'secondary'}>
                      {data.correct}/{data.total}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Button size="lg" onClick={restartSession} className="gap-2">
              <RefreshCw className="w-5 h-5" />
              Train Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header Stats */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Brain className="w-3 h-3" />
            Level {currentDifficulty.toFixed(1)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Target className="w-3 h-3" />
            {correctCount}/{questionsAnswered}
          </Badge>
          {streak >= 2 && (
            <Badge className="bg-warning text-warning-foreground gap-1">
              <Zap className="w-3 h-3" />
              {streak}x Streak
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {questionsAnswered + 1} / {SESSION_LENGTH}
        </span>
      </div>
      
      <Progress value={((questionsAnswered + 1) / SESSION_LENGTH) * 100} className="h-2 mb-6" />

      {/* Question Card */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="capitalize">
              {currentQuestion.type}
            </Badge>
            <Badge variant="outline">
              Difficulty: {currentQuestion.difficulty}/10
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <h3 className="text-xl font-bold mb-6">{currentQuestion.content}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showCorrectness = showResult && (isSelected || isCorrect);
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    showCorrectness && isCorrect
                      ? 'bg-success/20 border-success'
                      : showCorrectness && isSelected && !isCorrect
                      ? 'bg-destructive/20 border-destructive'
                      : isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      showCorrectness && isCorrect
                        ? 'bg-success text-success-foreground'
                        : showCorrectness && isSelected
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Result & Adaptive Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`mb-4 ${selectedAnswer === currentQuestion.correctIndex ? 'border-success' : 'border-destructive'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAnswer === currentQuestion.correctIndex ? 'bg-success/20' : 'bg-destructive/20'
                  }`}>
                    {selectedAnswer === currentQuestion.correctIndex ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold mb-1">
                      {selectedAnswer === currentQuestion.correctIndex ? 'Correct!' : 'Not quite right'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">{currentQuestion.explanation}</p>
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {adaptiveMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={nextQuestion} className="w-full gap-2">
              {questionsAnswered + 1 >= SESSION_LENGTH ? 'View Results' : 'Next Question'}
              <Award className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdaptiveLearningEngine;
