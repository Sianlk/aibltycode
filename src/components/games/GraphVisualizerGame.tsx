import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Star, GitBranch } from "lucide-react";

interface GraphChallenge {
  id: number;
  title: string;
  description: string;
  graph: { nodes: string[]; edges: [string, string][] };
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const challenges: GraphChallenge[] = [
  {
    id: 1,
    title: "Counting Edges",
    description: "Look at this undirected graph:",
    graph: {
      nodes: ["A", "B", "C", "D"],
      edges: [["A", "B"], ["B", "C"], ["C", "D"], ["A", "D"], ["B", "D"]]
    },
    question: "How many edges does this graph have?",
    options: ["4", "5", "6"],
    correctAnswer: "5",
    explanation: "Count each line: A-B, B-C, C-D, A-D, B-D = 5 edges. Memory: Edges = connections between nodes!"
  },
  {
    id: 2,
    title: "Degree of Vertex",
    description: "In the graph with nodes A, B, C where A connects to B and C, B connects to C.",
    graph: {
      nodes: ["A", "B", "C"],
      edges: [["A", "B"], ["A", "C"], ["B", "C"]]
    },
    question: "What is the degree of vertex A?",
    options: ["1", "2", "3"],
    correctAnswer: "2",
    explanation: "Degree = number of edges connected to a vertex. A connects to B and C, so degree = 2!"
  },
  {
    id: 3,
    title: "Cycle Detection",
    description: "Path: A → B → C → A",
    graph: {
      nodes: ["A", "B", "C"],
      edges: [["A", "B"], ["B", "C"], ["C", "A"]]
    },
    question: "Is this a cycle?",
    options: ["Yes - returns to start", "No - it's a tree", "Not enough info"],
    correctAnswer: "Yes - returns to start",
    explanation: "A cycle is a path that returns to its starting point. A→B→C→A is a cycle of length 3!"
  },
  {
    id: 4,
    title: "Tree Properties",
    description: "A tree has 7 nodes.",
    graph: {
      nodes: ["1", "2", "3", "4", "5", "6", "7"],
      edges: [["1", "2"], ["1", "3"], ["2", "4"], ["2", "5"], ["3", "6"], ["3", "7"]]
    },
    question: "How many edges does this tree have?",
    options: ["6", "7", "8"],
    correctAnswer: "6",
    explanation: "Trees ALWAYS have N-1 edges! 7 nodes → 6 edges. Memory: Trees are minimal connected graphs!"
  },
  {
    id: 5,
    title: "BFS Order",
    description: "Starting BFS from node A in graph: A→B, A→C, B→D, C→D",
    graph: {
      nodes: ["A", "B", "C", "D"],
      edges: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]]
    },
    question: "BFS visits nodes in which order?",
    options: ["A, B, D, C", "A, B, C, D", "A, D, B, C"],
    correctAnswer: "A, B, C, D",
    explanation: "BFS = Level by level! A first, then A's neighbors (B,C), then their neighbors (D). Uses QUEUE!"
  },
  {
    id: 6,
    title: "Connected Components",
    description: "Graph has nodes: A-B-C (connected) and X-Y (connected separately)",
    graph: {
      nodes: ["A", "B", "C", "X", "Y"],
      edges: [["A", "B"], ["B", "C"], ["X", "Y"]]
    },
    question: "How many connected components?",
    options: ["1", "2", "5"],
    correctAnswer: "2",
    explanation: "Two separate groups that aren't connected = 2 components. Component = maximal connected subgraph!"
  },
];

const GraphVisual: React.FC<{ nodes: string[]; edges: [string, string][] }> = ({ nodes, edges }) => {
  // Simple circular layout
  const radius = 60;
  const center = { x: 100, y: 80 };
  const positions: Record<string, { x: number; y: number }> = {};
  
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions[node] = {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    };
  });

  return (
    <svg viewBox="0 0 200 160" className="w-full h-40">
      {/* Edges */}
      {edges.map(([from, to], i) => (
        <line
          key={i}
          x1={positions[from].x}
          y1={positions[from].y}
          x2={positions[to].x}
          y2={positions[to].y}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
      ))}
      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node}>
          <circle
            cx={positions[node].x}
            cy={positions[node].y}
            r="18"
            className="fill-primary/20 stroke-primary"
            strokeWidth="2"
          />
          <text
            x={positions[node].x}
            y={positions[node].y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-primary font-bold text-sm"
          >
            {node}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const GraphVisualizerGame: React.FC = () => {
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
        <div className="text-6xl mb-4">🌳</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Graph Theory Expert!</h2>
        <p className="text-muted-foreground mb-4">You scored {score} points!</p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4 text-left">
          <p className="font-bold text-primary mb-2">Key Formulas:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Tree edges</strong> = N - 1 (nodes minus 1)</li>
            <li>• <strong>Degree</strong> = edges connected to vertex</li>
            <li>• <strong>BFS</strong> = Level by level (queue)</li>
            <li>• <strong>DFS</strong> = Deep first (stack)</li>
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
          <GitBranch className="w-6 h-6 text-primary" />
          {challenge.title} - Question {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          Score: {score}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{challenge.description}</p>

        {/* Graph Visualization */}
        <div className="bg-muted/30 rounded-lg p-4">
          <GraphVisual nodes={challenge.graph.nodes} edges={challenge.graph.edges} />
        </div>

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

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10" : "bg-red-500/10"}`}
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

export default GraphVisualizerGame;
