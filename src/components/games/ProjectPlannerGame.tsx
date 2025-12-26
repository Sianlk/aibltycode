import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Calendar, CheckCircle, XCircle, Star, ArrowRight } from "lucide-react";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Critical Path",
    description: "Find the critical path that determines project duration.",
    tasks: [
      { id: "A", name: "Design", duration: 3, dependencies: [] },
      { id: "B", name: "Backend", duration: 5, dependencies: ["A"] },
      { id: "C", name: "Frontend", duration: 4, dependencies: ["A"] },
      { id: "D", name: "Testing", duration: 2, dependencies: ["B", "C"] },
    ],
    question: "What is the critical path?",
    options: ["A → C → D (9 days)", "A → B → D (10 days)", "A → D (5 days)"],
    correctAnswer: "A → B → D (10 days)",
    explanation: "Critical path is LONGEST path: A(3) + B(5) + D(2) = 10 days. This determines minimum project duration!"
  },
  {
    id: 2,
    title: "Kanban WIP",
    description: "Team has WIP limit of 3 for 'In Progress' column.",
    tasks: [
      { id: "1", name: "Task 1", duration: 2, dependencies: [] },
      { id: "2", name: "Task 2", duration: 3, dependencies: [] },
      { id: "3", name: "Task 3", duration: 1, dependencies: [] },
      { id: "4", name: "Task 4", duration: 2, dependencies: [] },
    ],
    question: "What happens if you try to start Task 4 when Tasks 1, 2, 3 are in progress?",
    options: ["Start it anyway", "Cannot start - WIP limit reached", "Remove another task first"],
    correctAnswer: "Cannot start - WIP limit reached",
    explanation: "WIP limit of 3 means maximum 3 items in progress. Must complete one before starting Task 4!"
  },
  {
    id: 3,
    title: "Gantt Dependencies",
    description: "Task B depends on Task A. Task C depends on Task B.",
    tasks: [
      { id: "A", name: "Requirements", duration: 2, dependencies: [] },
      { id: "B", name: "Design", duration: 3, dependencies: ["A"] },
      { id: "C", name: "Development", duration: 5, dependencies: ["B"] },
    ],
    question: "When can Development (C) start?",
    options: ["Day 1", "Day 3 (after A)", "Day 6 (after A and B)"],
    correctAnswer: "Day 6 (after A and B)",
    explanation: "C depends on B, which depends on A. Must wait: A(2 days) + B(3 days) = Day 6 start for C!"
  },
  {
    id: 4,
    title: "Sprint Planning",
    description: "Team velocity is 20 story points per sprint. Sprint is 2 weeks.",
    tasks: [
      { id: "1", name: "User Login", duration: 8, dependencies: [] },
      { id: "2", name: "Dashboard", duration: 13, dependencies: [] },
      { id: "3", name: "Reports", duration: 5, dependencies: [] },
    ],
    question: "Which stories fit in one sprint?",
    options: ["All three (26 pts)", "Login + Reports (13 pts)", "Dashboard + Reports (18 pts)"],
    correctAnswer: "Dashboard + Reports (18 pts)",
    explanation: "Maximize value within velocity (20). Dashboard(13) + Reports(5) = 18 ≤ 20. Best fit!"
  },
  {
    id: 5,
    title: "Float Time",
    description: "Project must complete by Day 15. Path A→D takes 10 days. Path A→B→C→D takes 15 days.",
    tasks: [
      { id: "A", name: "Start", duration: 2, dependencies: [] },
      { id: "B", name: "Middle", duration: 5, dependencies: ["A"] },
      { id: "C", name: "Extra", duration: 6, dependencies: ["B"] },
      { id: "D", name: "End", duration: 2, dependencies: ["A", "C"] },
    ],
    question: "How much float does path A→D have?",
    options: ["0 days (critical)", "5 days", "2 days"],
    correctAnswer: "5 days",
    explanation: "A→D = 10 days, but project = 15 days. Float = 15 - 10 = 5 days of flexibility!"
  },
];

export const ProjectPlannerGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(prev => prev + 20);
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Planning Pro!</h2>
        <p className="text-muted-foreground mb-4">You scored {score} points!</p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4 text-left">
          <p className="font-bold text-primary mb-2">Key Concepts:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Critical Path</strong> = Longest path, zero float</li>
            <li>• <strong>Float</strong> = How late task can start without delay</li>
            <li>• <strong>WIP Limit</strong> = Max items in progress</li>
            <li>• <strong>Velocity</strong> = Team's sprint capacity</li>
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
          <Calendar className="w-6 h-6 text-primary" />
          {challenge.title} - Challenge {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          Score: {score}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground">{challenge.description}</p>
        </div>

        {/* Visual Task Display */}
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-bold mb-3 text-sm text-muted-foreground">Tasks:</h4>
          <div className="space-y-2">
            {challenge.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {task.id}
                </div>
                <div
                  className="h-8 bg-primary/30 rounded flex items-center px-2 text-sm"
                  style={{ width: `${task.duration * 30}px` }}
                >
                  {task.name}
                </div>
                <span className="text-xs text-muted-foreground">
                  {task.duration} {task.duration === 1 ? 'day' : 'days'}
                </span>
                {task.dependencies.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    (after {task.dependencies.join(', ')})
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="font-bold text-foreground">{challenge.question}</div>

        {/* Options */}
        <div className="grid gap-3">
          {challenge.options.map((option) => {
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
                      ? "bg-green-500/20 border-green-500"
                      : isSelected
                      ? "bg-red-500/20 border-red-500"
                      : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10" : "bg-red-500/10"}`}
            >
              <p className="font-bold mb-2">{isCorrect ? "✅ Correct!" : "❌ Not quite!"}</p>
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

export default ProjectPlannerGame;
